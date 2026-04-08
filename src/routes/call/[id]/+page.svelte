<script>
	import { onMount } from 'svelte';

	// Use local signaling server in dev, production in deployed builds
	const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost';
	const SIGNAL_BASE = isDev ? 'ws://localhost:8787' : 'wss://signal.jelly-claw.com';

	let { data } = $props();
	const callId = data.callId;

	// Determine role: ?role=host makes this tab the host (creates offer)
	// Default is guest (receives offer). This lets browser-to-browser calls work.
	let myRole = $state('guest');

	// --- State ---
	let status = $state('connecting'); // connecting | waiting | connected | ended | error
	let errorMessage = $state('');
	let isMuted = $state(false);
	let isCameraOff = $state(false);
	let isRecording = $state(false);
	let elapsedSeconds = $state(0);
	let username = $state('');

	let localStream = $state(null);
	let remoteStream = $state(null);

	let localVideoEl;
	let remoteVideoEl;

	/** @type {WebSocket | null} */
	let ws = null;
	/** @type {RTCPeerConnection | null} */
	let pc = null;
	/** @type {ReturnType<typeof setInterval> | null} */
	let timerInterval = null;

	let formattedTime = $derived(() => {
		const m = Math.floor(elapsedSeconds / 60);
		const s = elapsedSeconds % 60;
		return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
	});

	onMount(() => {
		// Parse username from subdomain
		const hostname = window.location.hostname;
		const parts = hostname.split('.');
		if (parts.length >= 3) {
			username = parts[0];
		} else {
			username = 'guest';
		}

		// Check for ?role=host query param
		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.get('role') === 'host') {
			myRole = 'host';
		}

		startCall();

		return () => {
			cleanup();
		};
	});

	async function startCall() {
		// Get local media
		try {
			localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
		} catch (err) {
			if (err.name === 'NotAllowedError') {
				status = 'error';
				errorMessage = 'Camera and microphone access was denied. Please allow access and reload.';
				return;
			} else if (err.name === 'NotFoundError') {
				status = 'error';
				errorMessage = 'No camera or microphone found on this device.';
				return;
			} else {
				status = 'error';
				errorMessage = `Could not access camera: ${err.message}`;
				return;
			}
		}

		// Connect to signaling server
		try {
			ws = new WebSocket(`${SIGNAL_BASE}/call/${callId}`);
		} catch {
			status = 'error';
			errorMessage = 'Failed to connect to signaling server.';
			return;
		}

		ws.onopen = () => {
			ws.send(JSON.stringify({ type: 'join', role: myRole }));
			status = 'waiting';
		};

		ws.onmessage = async (event) => {
			let msg;
			try {
				msg = JSON.parse(event.data);
			} catch {
				return;
			}

			switch (msg.type) {
				case 'turn-credentials':
					await setupPeerConnection(msg.iceServers);
					break;

				case 'peer-joined':
					// Other peer joined — if we're the host, create and send an offer
					if (myRole === 'host' && pc) {
						const offer = await pc.createOffer();
						await pc.setLocalDescription(offer);
						ws.send(JSON.stringify({ type: 'offer', sdp: offer.sdp }));
					}
					break;

				case 'offer':
					await handleOffer(msg);
					break;

				case 'answer':
					// Host receives the guest's answer
					if (pc && msg.sdp) {
						await pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: msg.sdp }));
					}
					break;

				case 'ice-candidate':
					await handleIceCandidate(msg);
					break;

				case 'peer-left':
					status = 'ended';
					stopTimer();
					break;

				case 'recording':
					isRecording = !!msg.active;
					break;
			}
		};

		ws.onerror = () => {
			if (status === 'connecting') {
				status = 'error';
				errorMessage = 'Connection to signaling server failed.';
			}
		};

		ws.onclose = () => {
			if (status === 'connected' || status === 'waiting') {
				status = 'ended';
				stopTimer();
			}
		};
	}

	async function setupPeerConnection(iceServers) {
		const config = {
			iceServers: iceServers || [{ urls: 'stun:stun.l.google.com:19302' }],
		};

		pc = new RTCPeerConnection(config);

		// Add local tracks
		if (localStream) {
			for (const track of localStream.getTracks()) {
				pc.addTrack(track, localStream);
			}
		}

		// Handle remote tracks
		pc.ontrack = (event) => {
			if (!remoteStream) {
				remoteStream = new MediaStream();
			}
			remoteStream.addTrack(event.track);
		};

		// Send ICE candidates to peer
		pc.onicecandidate = (event) => {
			if (event.candidate && ws && ws.readyState === WebSocket.OPEN) {
				ws.send(
					JSON.stringify({
						type: 'ice-candidate',
						candidate: event.candidate,
					})
				);
			}
		};

		pc.onconnectionstatechange = () => {
			if (pc.connectionState === 'connected') {
				status = 'connected';
				startTimer();
			} else if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
				if (status === 'connected') {
					status = 'ended';
					stopTimer();
				} else {
					status = 'error';
					errorMessage = 'Connection failed. Please try again.';
				}
			}
		};
	}

	async function handleOffer(msg) {
		if (!pc) {
			// If we haven't set up the PC yet (no TURN credentials received), use default STUN
			await setupPeerConnection(null);
		}

		try {
			await pc.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp: msg.sdp }));
			const answer = await pc.createAnswer();
			await pc.setLocalDescription(answer);

			if (ws && ws.readyState === WebSocket.OPEN) {
				ws.send(
					JSON.stringify({
						type: 'answer',
						sdp: answer.sdp,
					})
				);
			}
		} catch (err) {
			status = 'error';
			errorMessage = `Failed to handle offer: ${err.message}`;
		}
	}

	async function handleIceCandidate(msg) {
		if (pc && msg.candidate) {
			try {
				await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
			} catch {
				// Ignore ICE candidate errors — non-fatal
			}
		}
	}

	function startTimer() {
		elapsedSeconds = 0;
		timerInterval = setInterval(() => {
			elapsedSeconds++;
		}, 1000);
	}

	function stopTimer() {
		if (timerInterval) {
			clearInterval(timerInterval);
			timerInterval = null;
		}
	}

	function toggleMute() {
		isMuted = !isMuted;
		if (localStream) {
			for (const track of localStream.getAudioTracks()) {
				track.enabled = !isMuted;
			}
		}
	}

	function toggleCamera() {
		isCameraOff = !isCameraOff;
		if (localStream) {
			for (const track of localStream.getVideoTracks()) {
				track.enabled = !isCameraOff;
			}
		}
	}

	function endCall() {
		cleanup();
		status = 'ended';
	}

	function cleanup() {
		stopTimer();

		if (ws) {
			ws.close();
			ws = null;
		}

		if (pc) {
			pc.close();
			pc = null;
		}

		if (localStream) {
			for (const track of localStream.getTracks()) {
				track.stop();
			}
			localStream = null;
		}

		remoteStream = null;
	}

	// Svelte actions to bind video elements and set srcObject immediately
	function bindLocalVideo(el) {
		localVideoEl = el;
		if (localStream) el.srcObject = localStream;
		return { destroy() { localVideoEl = null; } };
	}

	function bindRemoteVideo(el) {
		remoteVideoEl = el;
		if (remoteStream) el.srcObject = remoteStream;
		return { destroy() { remoteVideoEl = null; } };
	}

	// Also react to stream changes after mount
	$effect(() => {
		if (localVideoEl && localStream && localVideoEl.srcObject !== localStream) {
			localVideoEl.srcObject = localStream;
		}
	});

	$effect(() => {
		if (remoteVideoEl && remoteStream && remoteVideoEl.srcObject !== remoteStream) {
			remoteVideoEl.srcObject = remoteStream;
		}
	});
</script>

<svelte:head>
	<title>{username ? `${username}'s call` : 'Video Call'} - Jelly Claw</title>
</svelte:head>

<div class="call-page">
	<!-- Top bar -->
	<div class="top-bar">
		{#if status === 'connected'}
			<span class="timer">{formattedTime()}</span>
		{:else if status === 'connecting'}
			<span class="status-text">Connecting...</span>
		{:else if status === 'waiting'}
			<span class="status-text">{myRole === 'host' ? 'Waiting for guest...' : 'Waiting for host...'}</span>
		{:else if status === 'ended'}
			<span class="status-text ended-text">Call ended</span>
		{:else if status === 'error'}
			<span class="status-text error-text">Error</span>
		{/if}

		{#if isRecording}
			<span class="recording-pill">REC</span>
		{/if}
	</div>

	<!-- Username label -->
	{#if username}
		<p class="username-label">{username}'s call</p>
	{/if}

	<!-- Video area -->
	<div class="video-area">
		{#if status === 'error'}
			<div class="error-overlay">
				<p class="error-icon">!</p>
				<p class="error-msg">{errorMessage}</p>
			</div>
		{:else if status === 'ended'}
			<div class="error-overlay">
				<p class="ended-icon">Call ended</p>
			</div>
		{:else}
			<!-- Remote video (host) -->
			<!-- svelte-ignore binding_property_non_reactive -->
			<video
				class="remote-video"
				use:bindRemoteVideo
				autoplay
				playsinline
			></video>

			{#if status === 'waiting'}
				<div class="waiting-overlay">
					<div class="pulse-ring"></div>
					<p>{myRole === 'host' ? 'Waiting for guest to join...' : 'Waiting for host to join...'}</p>
				</div>
			{/if}
		{/if}

		<!-- Local video (PiP) -->
		{#if localStream && status !== 'ended' && status !== 'error'}
			<div class="pip-container" class:camera-off={isCameraOff}>
				<video
					class="local-video"
					use:bindLocalVideo
					autoplay
					playsinline
					muted
				></video>
				{#if isCameraOff}
					<div class="camera-off-overlay">
						<span>Camera off</span>
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Bottom controls -->
	{#if status !== 'ended' && status !== 'error'}
		<div class="controls-bar">
			<button
				class="control-btn"
				class:active={isMuted}
				onclick={toggleMute}
				aria-label={isMuted ? 'Unmute' : 'Mute'}
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					{#if isMuted}
						<line x1="1" y1="1" x2="23" y2="23"></line>
						<path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
						<path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2c0 .76-.12 1.5-.34 2.18"></path>
						<line x1="12" y1="19" x2="12" y2="23"></line>
						<line x1="8" y1="23" x2="16" y2="23"></line>
					{:else}
						<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
						<path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
						<line x1="12" y1="19" x2="12" y2="23"></line>
						<line x1="8" y1="23" x2="16" y2="23"></line>
					{/if}
				</svg>
				<span class="control-label">{isMuted ? 'Unmute' : 'Mute'}</span>
			</button>

			<button
				class="control-btn end-call-btn"
				onclick={endCall}
				aria-label="End call"
			>
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08a.956.956 0 0 1-.29-.7c0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28a11.27 11.27 0 0 0-2.67-1.85.996.996 0 0 1-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>
				</svg>
				<span class="control-label">End</span>
			</button>

			<button
				class="control-btn"
				class:active={isCameraOff}
				onclick={toggleCamera}
				aria-label={isCameraOff ? 'Turn camera on' : 'Turn camera off'}
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					{#if isCameraOff}
						<line x1="1" y1="1" x2="23" y2="23"></line>
						<path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34m-7.72-2.06a4 4 0 1 1-5.56-5.56"></path>
					{:else}
						<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
						<circle cx="12" cy="13" r="4"></circle>
					{/if}
				</svg>
				<span class="control-label">{isCameraOff ? 'Camera on' : 'Camera off'}</span>
			</button>
		</div>
	{/if}
</div>

<style>
	.call-page {
		position: fixed;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		background: #070707;
		color: #f4f1ea;
		font-family: 'Montserrat', 'Helvetica Neue', sans-serif;
		overflow: hidden;
	}

	/* --- Top bar --- */
	.top-bar {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: 20;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		padding: 16px 20px;
	}

	.timer {
		font-size: 1rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		font-variant-numeric: tabular-nums;
	}

	.status-text {
		font-size: 0.85rem;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		opacity: 0.8;
	}

	.ended-text {
		color: #f4f1ea;
	}

	.error-text {
		color: #ff6b6b;
	}

	.recording-pill {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 4px 12px;
		background: rgba(220, 38, 38, 0.9);
		border-radius: 999px;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		animation: pulse-recording 1.5s ease-in-out infinite;
	}

	.recording-pill::before {
		content: '';
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #fff;
	}

	@keyframes pulse-recording {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.6; }
	}

	/* --- Username --- */
	.username-label {
		position: absolute;
		top: 52px;
		z-index: 20;
		margin: 0;
		font-size: 0.72rem;
		font-weight: 500;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		opacity: 0.5;
	}

	/* --- Video area --- */
	.video-area {
		position: relative;
		flex: 1;
		width: 100%;
		max-width: 500px;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.remote-video {
		width: 100%;
		height: 100%;
		object-fit: cover;
		background: #111;
	}

	.waiting-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 24px;
		background: rgba(7, 7, 7, 0.85);
		z-index: 5;
	}

	.waiting-overlay p {
		margin: 0;
		font-size: 0.85rem;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		opacity: 0.7;
	}

	.pulse-ring {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		border: 2px solid rgba(244, 241, 234, 0.3);
		animation: pulse-expand 2s ease-out infinite;
	}

	@keyframes pulse-expand {
		0% { transform: scale(0.8); opacity: 1; }
		100% { transform: scale(1.6); opacity: 0; }
	}

	.error-overlay {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 16px;
		text-align: center;
		padding: 32px;
	}

	.error-icon {
		margin: 0;
		width: 56px;
		height: 56px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: rgba(220, 38, 38, 0.15);
		color: #ff6b6b;
		font-size: 1.6rem;
		font-weight: 700;
	}

	.error-msg {
		margin: 0;
		max-width: 30ch;
		font-size: 0.9rem;
		line-height: 1.6;
		opacity: 0.8;
	}

	.ended-icon {
		margin: 0;
		font-size: 1.4rem;
		font-weight: 500;
		letter-spacing: 0.04em;
		opacity: 0.6;
	}

	/* --- PiP local video --- */
	.pip-container {
		position: absolute;
		bottom: 100px;
		right: 16px;
		z-index: 15;
		width: 120px;
		height: 160px;
		border-radius: 16px;
		overflow: hidden;
		border: 2px solid rgba(255, 255, 255, 0.15);
		background: #111;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
	}

	.local-video {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transform: scaleX(-1);
	}

	.camera-off .local-video {
		opacity: 0;
	}

	.camera-off-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #1a1a1a;
	}

	.camera-off-overlay span {
		font-size: 0.65rem;
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		opacity: 0.5;
	}

	/* --- Controls bar --- */
	.controls-bar {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 20;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 20px;
		padding: 20px 16px;
		padding-bottom: max(20px, env(safe-area-inset-bottom));
		background: linear-gradient(transparent, rgba(7, 7, 7, 0.9) 40%);
	}

	.control-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		padding: 0;
		border: none;
		background: none;
		color: #f4f1ea;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}

	.control-btn svg {
		width: 28px;
		height: 28px;
		padding: 14px;
		box-sizing: content-box;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.12);
		transition: background 180ms ease, border-color 180ms ease;
	}

	.control-btn:hover svg {
		background: rgba(255, 255, 255, 0.18);
	}

	.control-btn.active svg {
		background: rgba(255, 255, 255, 0.2);
		border-color: rgba(255, 255, 255, 0.3);
	}

	.end-call-btn svg {
		background: #dc2626;
		border-color: #dc2626;
	}

	.end-call-btn:hover svg {
		background: #ef4444;
	}

	.control-label {
		font-size: 0.62rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		opacity: 0.7;
	}

	/* --- Responsive --- */
	@media (max-width: 500px) {
		.video-area {
			max-width: 100%;
		}

		.pip-container {
			width: 100px;
			height: 133px;
			bottom: 110px;
			right: 12px;
			border-radius: 12px;
		}

		.controls-bar {
			gap: 16px;
			padding: 16px 12px;
			padding-bottom: max(16px, env(safe-area-inset-bottom));
		}

		.control-btn svg {
			width: 24px;
			height: 24px;
			padding: 12px;
		}
	}
</style>
