let audioCtx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function playTone(
  frequency: number,
  duration: number,
  volume: number,
  type: OscillatorType = 'sine',
): void {
  const ctx = getContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    void ctx.resume();
  }

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start();
  oscillator.stop(ctx.currentTime + duration);
}

export function playHoverSound(): void {
  playTone(520, 0.08, 0.04, 'triangle');
}

export function playClickSound(): void {
  playTone(280, 0.06, 0.05, 'square');
  window.setTimeout(() => playTone(640, 0.12, 0.05, 'sine'), 60);
}

export function playIntroSound(): void {
  playTone(440, 0.15, 0.03, 'sine');
  window.setTimeout(() => playTone(660, 0.2, 0.035, 'sine'), 120);
}
