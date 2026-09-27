import { useEffect, useRef, useState, useCallback } from 'react';

export interface UseWalkthroughAudioOptions {
  initialEnabled?: boolean;
  cooldownMs?: number;
}

export interface UseWalkthroughAudioReturn {
  isAudioEnabled: boolean;
  toggleAudio: () => void;
  playTransition: (direction?: 1 | -1) => void;
  playSoftChime: (freq?: number) => void;
}

/**
 * Custom React hook for PhotoWalkthrough that plays a subtle 'whoosh'
 * and 'soft crystal door chime' sound effect triggered at each room transition point
 * using low-latency Web Audio API synthesis.
 */
export function useWalkthroughAudio(
  activeRoomIndex: number,
  options: UseWalkthroughAudioOptions = {}
): UseWalkthroughAudioReturn {
  const { initialEnabled = true, cooldownMs = 320 } = options;
  const [isAudioEnabled, setIsAudioEnabled] = useState(initialEnabled);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseBufferRef = useRef<AudioBuffer | null>(null);
  const lastActiveRoomRef = useRef<number | null>(null);
  const lastTriggerTimeRef = useRef<number>(0);

  // Lazy-initialize AudioContext and stereo pink-noise buffer upon first user interaction
  const initAudio = useCallback(() => {
    if (typeof window === 'undefined') return;

    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        // Generate stereo pink noise buffer for warm atmospheric whoosh
        const sampleRate = ctx.sampleRate;
        const bufferSize = sampleRate * 2;
        const buffer = ctx.createBuffer(2, bufferSize, sampleRate);

        for (let ch = 0; ch < 2; ch++) {
          const output = buffer.getChannelData(ch);
          let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.058;
            b6 = white * 0.115926;
          }
        }
        noiseBufferRef.current = buffer;
      }
    }

    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
  }, []);

  // Unlock AudioContext on common user gestures (scroll wheel, click, touch, keydown)
  useEffect(() => {
    const handleGesture = () => {
      initAudio();
    };

    window.addEventListener('click', handleGesture, { once: true });
    window.addEventListener('wheel', handleGesture, { once: true, passive: true });
    window.addEventListener('touchstart', handleGesture, { once: true, passive: true });
    window.addEventListener('keydown', handleGesture, { once: true });

    return () => {
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('wheel', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
      window.removeEventListener('keydown', handleGesture);
    };
  }, [initAudio]);

  // Clean up AudioContext on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  /**
   * Plays a delicate, high-end transition whoosh + soft harmonic door chime
   */
  const playTransition = useCallback(
    (direction: 1 | -1 = 1) => {
      if (!isAudioEnabled) return;

      const now = performance.now();
      if (now - lastTriggerTimeRef.current < cooldownMs) {
        return;
      }
      lastTriggerTimeRef.current = now;

      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx || ctx.state !== 'running') return;

      const t = ctx.currentTime;

      // 1. SUBTLE LUXURY ATMOSPHERIC WHOOSH
      if (noiseBufferRef.current) {
        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = noiseBufferRef.current;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.Q.setValueAtTime(1.8, t);

        const startFreq = direction === 1 ? 260 : 750;
        const peakFreq = direction === 1 ? 920 : 320;
        const endFreq = 180;

        filter.frequency.setValueAtTime(startFreq, t);
        filter.frequency.exponentialRampToValueAtTime(peakFreq, t + 0.18);
        filter.frequency.exponentialRampToValueAtTime(endFreq, t + 0.58);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.0001, t);
        noiseGain.gain.linearRampToValueAtTime(0.08, t + 0.14);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.62);

        noiseSource.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        noiseSource.start(t);
        noiseSource.stop(t + 0.65);
      }

      // 2. SOFT CRYSTAL HARMONIC DOOR CHIME
      // Warm pentatonic resonance tones (D5, F#5, A5, D6)
      const tones =
        direction === 1
          ? [
              { freq: 587.33, delay: 0.05, decay: 0.85, vol: 0.045, type: 'sine' as OscillatorType },
              { freq: 880.0, delay: 0.1, decay: 0.75, vol: 0.035, type: 'triangle' as OscillatorType },
              { freq: 1174.66, delay: 0.15, decay: 0.6, vol: 0.02, type: 'sine' as OscillatorType },
              { freq: 1479.98, delay: 0.18, decay: 0.45, vol: 0.012, type: 'sine' as OscillatorType }
            ]
          : [
              { freq: 1174.66, delay: 0.04, decay: 0.7, vol: 0.035, type: 'sine' as OscillatorType },
              { freq: 880.0, delay: 0.09, decay: 0.8, vol: 0.035, type: 'triangle' as OscillatorType },
              { freq: 587.33, delay: 0.14, decay: 0.9, vol: 0.045, type: 'sine' as OscillatorType }
            ];

      tones.forEach((tone) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = tone.type;
        osc.frequency.setValueAtTime(tone.freq, t);

        const chimeStart = t + tone.delay;
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.setValueAtTime(0.0001, chimeStart);
        gain.gain.linearRampToValueAtTime(tone.vol, chimeStart + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.00001, chimeStart + tone.decay);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(chimeStart);
        osc.stop(chimeStart + tone.decay + 0.05);
      });
    },
    [isAudioEnabled, cooldownMs, initAudio]
  );

  /**
   * Plays a standalone soft chime (e.g. for user toggle preview)
   */
  const playSoftChime = useCallback(
    (freq: number = 880) => {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx || ctx.state !== 'running') return;

      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.035, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.00001, t + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.65);
    },
    [initAudio]
  );

  const toggleAudio = useCallback(() => {
    setIsAudioEnabled((prev) => {
      const next = !prev;
      if (next) {
        initAudio();
        // Play preview so user gets immediate acoustic confirmation
        setTimeout(() => {
          playTransition(1);
        }, 30);
      }
      return next;
    });
  }, [initAudio, playTransition]);

  // Hook-based effect: Trigger sound at each room transition point
  useEffect(() => {
    if (lastActiveRoomRef.current !== null && lastActiveRoomRef.current !== activeRoomIndex) {
      const direction = activeRoomIndex > lastActiveRoomRef.current ? 1 : -1;
      playTransition(direction);
    }
    lastActiveRoomRef.current = activeRoomIndex;
  }, [activeRoomIndex, playTransition]);

  return {
    isAudioEnabled,
    toggleAudio,
    playTransition,
    playSoftChime
  };
}
