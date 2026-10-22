/**
 * Spatial Audio Synthesizer & Accessibility Speech Engine
 * Powered by Web Audio API & Web Speech API
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// 1. Play Binaural 3D Panned Audio Cue
export function playSpatialPing(
  frequency = 440,
  pan = 0, // -1 (far left) to +1 (far right)
  duration = 0.25,
  type: OscillatorType = 'sine'
) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const panNode = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    // Smooth envelope to prevent audio pops
    gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    if (panNode) {
      panNode.pan.setValueAtTime(pan, ctx.currentTime);
      osc.connect(gainNode);
      gainNode.connect(panNode);
      panNode.connect(ctx.destination);
    } else {
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
    }

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn('AudioContext playback error:', e);
  }
}

// 2. Play Echolocation Sonar Beep (Pitch reflects proximity)
export function playSonarPing(distanceMeters: number, direction: 'left' | 'center' | 'right' = 'center') {
  // Proximity: Closer obstacle (1m) = higher frequency 880Hz, Far obstacle (10m) = lower 320Hz
  const clampedDist = Math.max(0.5, Math.min(10, distanceMeters));
  const freq = 900 - clampedDist * 55;
  const pan = direction === 'left' ? -0.8 : direction === 'right' ? 0.8 : 0;
  playSpatialPing(freq, pan, 0.18, 'triangle');
}

// 3. Play Haptic Sub-Bass Tactile Thump (audible + physical feeling on phone speakers)
export function playTactileSubThump() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(65, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.2);

    gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch (e) {
    // Ignore context blocked
  }
}

// 4. Play Emergency Siren Tone
let emergencyOsc: OscillatorNode | null = null;
let emergencyGain: GainNode | null = null;

export function startEmergencySiren() {
  try {
    const ctx = getAudioContext();
    if (emergencyOsc) return;

    emergencyOsc = ctx.createOscillator();
    emergencyGain = ctx.createGain();

    emergencyOsc.type = 'sawtooth';
    emergencyOsc.frequency.setValueAtTime(600, ctx.currentTime);

    // Siren sweep
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(2, ctx.currentTime); // 2Hz siren pulse
    lfoGain.gain.setValueAtTime(300, ctx.currentTime);
    lfo.connect(emergencyOsc.frequency);
    lfo.start();

    emergencyGain.gain.setValueAtTime(0.25, ctx.currentTime);

    emergencyOsc.connect(emergencyGain);
    emergencyGain.connect(ctx.destination);
    emergencyOsc.start();
  } catch (e) {
    console.warn('Failed to start siren', e);
  }
}

export function stopEmergencySiren() {
  try {
    if (emergencyOsc) {
      emergencyOsc.stop();
      emergencyOsc.disconnect();
      emergencyOsc = null;
    }
  } catch (e) {
    // Ignore
  }
}

// 5. High-Accessibility Text-To-Speech (SpeechSynthesis)
export function speakText(
  text: string,
  rate = 1.0,
  pitch = 1.0,
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return false;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;

    // Pick best natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Siri')));
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (e) {
    console.warn('SpeechSynthesis error:', e);
    return false;
  }
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
