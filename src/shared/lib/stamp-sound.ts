const BODY_START_HZ = 160;
const BODY_END_HZ = 55;
const BODY_SWEEP_SEC = 0.12;
const BODY_GAIN = 0.9;
const BODY_DECAY_SEC = 0.22;
const BODY_STOP_SEC = 0.25;

const HIT_LENGTH_SEC = 0.06;
const HIT_FILTER_HZ = 1800;
const HIT_FILTER_Q = 0.8;
const HIT_GAIN = 0.5;

const SILENCE = 0.001;

let context: AudioContext | null = null;

function openContext() {
	context ??= new AudioContext();
	if (context.state === "suspended") {
		context.resume().catch(() => undefined);
	}

	return context;
}

function createHitBuffer(ctx: AudioContext) {
	const length = Math.floor(ctx.sampleRate * HIT_LENGTH_SEC);
	const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
	const samples = buffer.getChannelData(0);

	for (let i = 0; i < length; i += 1) {
		const decay = (1 - i / length) ** 2;
		samples[i] = (Math.random() * 2 - 1) * decay;
	}

	return buffer;
}

export function primeStampSound() {
	openContext();
}

export function playStampSound() {
	const ctx = openContext();
	const t = ctx.currentTime;

	const body = ctx.createOscillator();
	body.type = "triangle";
	body.frequency.setValueAtTime(BODY_START_HZ, t);
	body.frequency.exponentialRampToValueAtTime(BODY_END_HZ, t + BODY_SWEEP_SEC);

	const bodyGain = ctx.createGain();
	bodyGain.gain.setValueAtTime(BODY_GAIN, t);
	bodyGain.gain.exponentialRampToValueAtTime(SILENCE, t + BODY_DECAY_SEC);

	body.connect(bodyGain).connect(ctx.destination);
	body.start(t);
	body.stop(t + BODY_STOP_SEC);

	const hit = ctx.createBufferSource();
	hit.buffer = createHitBuffer(ctx);

	const hitFilter = ctx.createBiquadFilter();
	hitFilter.type = "bandpass";
	hitFilter.frequency.setValueAtTime(HIT_FILTER_HZ, t);
	hitFilter.Q.setValueAtTime(HIT_FILTER_Q, t);

	const hitGain = ctx.createGain();
	hitGain.gain.setValueAtTime(HIT_GAIN, t);

	hit.connect(hitFilter).connect(hitGain).connect(ctx.destination);
	hit.start(t);
}
