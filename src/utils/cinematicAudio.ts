// Web Audio API procedural cinematic sound engine
// Synthesizes a delicate, high-end architectural "ambient whoosh" combined with a "soft crystal door chime"

class CinematicSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private lastTriggerTime: number = 0;
  private noiseBuffer: AudioBuffer | null = null;

  constructor() {
    // Lazy initialized on user gesture to conform to browser autoplay policies
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.createPinkNoiseBuffer();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  private createPinkNoiseBuffer() {
    if (!this.ctx) return;
    const sampleRate = this.ctx.sampleRate;
    const bufferSize = sampleRate * 2; // 2 seconds
    const buffer = this.ctx.createBuffer(2, bufferSize, sampleRate);
    
    // Create stereo pink noise with smooth spatial width
    for (let channel = 0; channel < 2; channel++) {
      const output = buffer.getChannelData(channel);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
        b6 = white * 0.115926;
      }
    }
    this.noiseBuffer = buffer;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (!muted) {
      this.initContext();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      this.initContext();
      // Play a very brief, gentle confirmation chime
      this.playChimeOnly(880, 0.03);
    }
    return this.isMuted;
  }

  /**
   * Plays a quick preview chime
   */
  public playChimeOnly(freq: number = 880, volume: number = 0.04) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || this.ctx.state !== 'running') return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.00001, t + 0.6);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.65);
  }

  /**
   * Plays a delicate, high-end transition whoosh + soft harmonic door chime
   * @param direction 1 for forward (walking deeper into residence), -1 for backward
   */
  public playTransitionSound(direction: 1 | -1 = 1) {
    if (this.isMuted) return;

    const now = performance.now();
    // 320ms cooldown to avoid acoustic stutter during rapid scrubbing
    if (now - this.lastTriggerTime < 320) {
      return;
    }
    this.lastTriggerTime = now;

    this.initContext();
    if (!this.ctx || this.ctx.state !== 'running') return;

    const t = this.ctx.currentTime;

    // ==========================================
    // 1. SUBTLE LUXURY ATMOSPHERIC WHOOSH
    // Airy breath passing through an architectural threshold
    // ==========================================
    if (this.noiseBuffer) {
      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = this.noiseBuffer;

      // Swept bandpass filter
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(1.8, t);

      const startFreq = direction === 1 ? 260 : 750;
      const peakFreq = direction === 1 ? 920 : 320;
      const endFreq = 180;

      filter.frequency.setValueAtTime(startFreq, t);
      filter.frequency.exponentialRampToValueAtTime(peakFreq, t + 0.18);
      filter.frequency.exponentialRampToValueAtTime(endFreq, t + 0.58);

      // Delicate envelope
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.0001, t);
      noiseGain.gain.linearRampToValueAtTime(0.08, t + 0.14);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.62);

      noiseSource.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noiseSource.start(t);
      noiseSource.stop(t + 0.65);
    }

    // ==========================================
    // 2. SOFT CRYSTAL HARMONIC DOOR CHIME
    // Pentatonic chord tones giving an opulent, peaceful chime
    // ==========================================
    // D-major pentatonic harmonics: D5 (587.33), F#5 (739.99), A5 (880), E6 (1318.5)
    const tones = direction === 1
      ? [
          { freq: 587.33, delay: 0.05, decay: 0.85, vol: 0.045, type: 'sine' as OscillatorType },
          { freq: 880.00, delay: 0.10, decay: 0.75, vol: 0.035, type: 'triangle' as OscillatorType },
          { freq: 1174.66, delay: 0.15, decay: 0.60, vol: 0.020, type: 'sine' as OscillatorType },
          { freq: 1479.98, delay: 0.18, decay: 0.45, vol: 0.012, type: 'sine' as OscillatorType }
        ]
      : [
          { freq: 1174.66, delay: 0.04, decay: 0.70, vol: 0.035, type: 'sine' as OscillatorType },
          { freq: 880.00, delay: 0.09, decay: 0.80, vol: 0.035, type: 'triangle' as OscillatorType },
          { freq: 587.33, delay: 0.14, decay: 0.90, vol: 0.045, type: 'sine' as OscillatorType }
        ];

    tones.forEach((tone) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = tone.type;
      osc.frequency.setValueAtTime(tone.freq, t);

      const chimeStart = t + tone.delay;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.setValueAtTime(0.0001, chimeStart);
      gain.gain.linearRampToValueAtTime(tone.vol, chimeStart + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.00001, chimeStart + tone.decay);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(chimeStart);
      osc.stop(chimeStart + tone.decay + 0.05);
    });
  }
}

export const cinematicAudio = new CinematicSoundEngine();
