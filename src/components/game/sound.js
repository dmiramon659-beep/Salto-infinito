const MUTE_KEY = 'vallajump:muted';

let audioCtx = null;
let muted = typeof window !== 'undefined' && window.localStorage.getItem(MUTE_KEY) === '1';
let forcedMute = false;

function context() {
  if (typeof window === 'undefined') return null;
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) return null;
  if (!audioCtx) audioCtx = new AudioCtor();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function tone(ac, { type = 'sine', from, to, dur, gain = 0.08, delay = 0 }) {
  const start = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const amp = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, start);
  if (to && to !== from) osc.frequency.exponentialRampToValueAtTime(to, start + dur);
  amp.gain.setValueAtTime(0.0001, start);
  amp.gain.exponentialRampToValueAtTime(gain, start + Math.min(0.03, dur * 0.35));
  amp.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  osc.connect(amp).connect(ac.destination);
  osc.start(start);
  osc.stop(start + dur + 0.02);
}

export function isMuted() {
  return muted;
}

export function setMuted(next) {
  muted = next;
  window.localStorage.setItem(MUTE_KEY, next ? '1' : '0');
}

// Silences every sound while an ad is playing (does not touch the player's choice).
export function setForcedMute(next) {
  forcedMute = next;
  if (!audioCtx) return;
  if (next) audioCtx.suspend();
  else if (audioCtx.state === 'suspended') audioCtx.resume();
}

export function playJump() {
  const ac = context();
  if (!ac || muted || forcedMute) return;
  tone(ac, { type: 'square', from: 300, to: 880, dur: 0.18, gain: 0.07 });
}

export function playSlide() {
  const ac = context();
  if (!ac || muted || forcedMute) return;
  tone(ac, { type: 'triangle', from: 620, to: 170, dur: 0.2, gain: 0.045 });
}

export function playDeath() {
  const ac = context();
  if (!ac || muted || forcedMute) return;
  tone(ac, { type: 'sawtooth', from: 440, to: 70, dur: 0.55, gain: 0.1 });

  const length = Math.floor(ac.sampleRate * 0.22);
  const buffer = ac.createBuffer(1, length, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) {
    const decay = (1 - i / length) ** 2;
    data[i] = (Math.random() * 2 - 1) * decay;
  }
  const noise = ac.createBufferSource();
  noise.buffer = buffer;
  const noiseGain = ac.createGain();
  noiseGain.gain.value = 0.16;
  noise.connect(noiseGain).connect(ac.destination);
  noise.start(ac.currentTime);
}

export function playPickup() {
  const ac = context();
  if (!ac || muted || forcedMute) return;
  tone(ac, { type: 'sine', from: 660, to: 660, dur: 0.1, gain: 0.07 });
  tone(ac, { type: 'sine', from: 990, to: 990, dur: 0.14, gain: 0.06, delay: 0.09 });
}

export function playHurt() {
  const ac = context();
  if (!ac || muted || forcedMute) return;
  tone(ac, { type: 'square', from: 260, to: 110, dur: 0.24, gain: 0.09 });
}