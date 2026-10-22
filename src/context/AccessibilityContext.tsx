import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AccessibilityProfile, VisualTheme, HearingAidDevice, SmartWearable } from '../types';
import { speakText, stopSpeaking, playTactileSubThump } from '../utils/audioSpatial';

interface AccessibilityContextType {
  profile: AccessibilityProfile;
  setProfile: (p: AccessibilityProfile) => void;
  theme: VisualTheme;
  setTheme: (t: VisualTheme) => void;
  brightness: number;
  setBrightness: (b: number) => void;
  fontSizeScale: number;
  setFontSizeScale: (scale: number) => void;
  speechRate: number;
  setSpeechRate: (r: number) => void;
  speechPitch: number;
  setSpeechPitch: (p: number) => void;
  autoReadOnFocus: boolean;
  setAutoReadOnFocus: (val: boolean) => void;
  hapticsEnabled: boolean;
  setHapticsEnabled: (val: boolean) => void;
  hapticIntensity: 'gentle' | 'moderate' | 'strong';
  setHapticIntensity: (val: 'gentle' | 'moderate' | 'strong') => void;
  triggerHaptic: (pattern: number[] | 'tap' | 'turn-left' | 'turn-right' | 'caution' | 'sos') => void;
  speak: (text: string) => void;
  stopSpeech: () => void;
  isSpeaking: boolean;
  hearingAid: HearingAidDevice;
  updateHearingAid: (updates: Partial<HearingAidDevice>) => void;
  wearables: SmartWearable[];
  toggleWearableConnection: (id: string) => void;
  isSosOpen: boolean;
  setIsSosOpen: (open: boolean) => void;
  isAiChatOpen: boolean;
  setIsAiChatOpen: (open: boolean) => void;
  lastHapticPulseName: string | null;
  activeScreenReadingText: string | null;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<AccessibilityProfile>('universal');
  const [theme, setThemeState] = useState<VisualTheme>('deaf-calm');
  const [brightness, setBrightness] = useState<number>(100);
  const [fontSizeScale, setFontSizeScale] = useState<number>(100);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [speechPitch, setSpeechPitch] = useState<number>(1.0);
  const [autoReadOnFocus, setAutoReadOnFocus] = useState<boolean>(true);
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(true);
  const [hapticIntensity, setHapticIntensity] = useState<'gentle' | 'moderate' | 'strong'>('moderate');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isSosOpen, setIsSosOpen] = useState<boolean>(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState<boolean>(false);
  const [lastHapticPulseName, setLastHapticPulseName] = useState<string | null>(null);
  const [activeScreenReadingText, setActiveScreenReadingText] = useState<string | null>(null);

  // Peripheral Hearing Aid State
  const [hearingAid, setHearingAid] = useState<HearingAidDevice>({
    id: 'aid-phonak-01',
    name: 'Phonak Audéo Lumity 90-R',
    model: 'Binaural Adaptive Receiver',
    connected: true,
    batteryLevel: 92,
    currentProfile: 'speech-clarity',
    leftGainDb: 18,
    rightGainDb: 22,
    noiseReductionDb: 12,
  });

  // Peripheral Wearables
  const [wearables, setWearables] = useState<SmartWearable[]>([
    {
      id: 'wearable-cane-01',
      name: 'UltraCane LiDAR & Tactile Grip',
      type: 'cane',
      connected: true,
      batteryLevel: 84,
      statusText: 'LiDAR range 4.5m active · Dual haptic motors synced',
    },
    {
      id: 'wearable-belt-01',
      name: 'Wayband Tactile Navigation Belt',
      type: 'haptic-belt',
      connected: true,
      batteryLevel: 76,
      statusText: '360° directional buzzers calibrated',
    },
    {
      id: 'wearable-watch-01',
      name: 'Divyang Tactile Smartwatch',
      type: 'smartwatch',
      connected: true,
      batteryLevel: 89,
      statusText: 'Braille pin display standby',
    },
  ]);

  // Update DOM classes for Theme & Font scaling
  useEffect(() => {
    const body = document.body;
    body.classList.remove(
      'theme-deaf-calm',
      'theme-high-contrast-yellow',
      'theme-high-contrast-cyan',
      'theme-day',
      'theme-night',
      'theme-reading-mode'
    );
    body.classList.add(`theme-${theme}`);

    // Font size scaling via root CSS variable
    document.documentElement.style.fontSize = `${fontSizeScale}%`;

    // Brightness filter on the body
    body.style.filter = `brightness(${brightness}%)`;
  }, [theme, fontSizeScale, brightness]);

  // Profile-based defaults
  const setProfile = (newProfile: AccessibilityProfile) => {
    setProfileState(newProfile);
    if (newProfile === 'deaf') {
      setThemeState('deaf-calm');
      speakText('Deaf accessibility profile loaded. Calming visual interface and subtitles prioritized.');
    } else if (newProfile === 'blind') {
      setThemeState('high-contrast-yellow');
      setFontSizeScale(125);
      speakText('Blind and low-vision accessibility profile active. High contrast yellow on black enabled. Screen reader and tactile haptics ready.');
    } else if (newProfile === 'mute') {
      speakText('Non-verbal speech communication profile active. Quick text-to-speech board ready.');
    } else if (newProfile === 'deaf-blind') {
      setThemeState('high-contrast-cyan');
      setFontSizeScale(150);
      setHapticIntensity('strong');
      triggerHaptic('sos');
      speakText('Deaf-blind multimodal profile active. Tactile Morse pulses and ultra-high contrast enabled.');
    } else {
      setThemeState('deaf-calm');
      setFontSizeScale(100);
    }
  };

  const setTheme = (newTheme: VisualTheme) => {
    setThemeState(newTheme);
  };

  // Tactile Haptic Trigger
  const triggerHaptic = useCallback((pattern: number[] | 'tap' | 'turn-left' | 'turn-right' | 'caution' | 'sos') => {
    if (!hapticsEnabled) return;

    let vibrationArray: number[] = [];
    let pulseName = '';

    const multiplier = hapticIntensity === 'strong' ? 1.4 : hapticIntensity === 'gentle' ? 0.6 : 1.0;

    if (Array.isArray(pattern)) {
      vibrationArray = pattern.map(v => Math.round(v * multiplier));
      pulseName = `Custom Pattern (${pattern.length} pulses)`;
    } else if (pattern === 'tap') {
      vibrationArray = [Math.round(40 * multiplier)];
      pulseName = 'Tactile Click';
    } else if (pattern === 'turn-left') {
      vibrationArray = [Math.round(80 * multiplier), 50, Math.round(80 * multiplier)];
      pulseName = 'Left Turn Haptic Pulse';
    } else if (pattern === 'turn-right') {
      vibrationArray = [Math.round(180 * multiplier), 60, Math.round(180 * multiplier)];
      pulseName = 'Right Turn Haptic Pulse';
    } else if (pattern === 'caution') {
      vibrationArray = [Math.round(250 * multiplier), 80, Math.round(250 * multiplier), 80, Math.round(400 * multiplier)];
      pulseName = 'Obstacle Caution Warning Pulse';
    } else if (pattern === 'sos') {
      // Morse SOS: ... --- ...
      vibrationArray = [
        100, 50, 100, 50, 100, 150, // S (...)
        300, 50, 300, 50, 300, 150, // O (---)
        100, 50, 100, 50, 100        // S (...)
      ];
      pulseName = 'SOS Morse Tactile Pulse (... --- ...)';
    }

    setLastHapticPulseName(pulseName);
    playTactileSubThump();

    // Call hardware vibration if available
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(vibrationArray);
      } catch (e) {
        // Ignore restricted iframe
      }
    }

    // Clear pulse feedback banner after 2.5s
    setTimeout(() => {
      setLastHapticPulseName((curr) => (curr === pulseName ? null : curr));
    }, 2500);
  }, [hapticsEnabled, hapticIntensity]);

  // Voice Speech
  const speak = useCallback((text: string) => {
    if (!text) return;
    setIsSpeaking(true);
    setActiveScreenReadingText(text);
    speakText(text, speechRate, speechPitch, () => {
      setIsSpeaking(false);
      setActiveScreenReadingText(null);
    });
  }, [speechRate, speechPitch]);

  const stopSpeech = useCallback(() => {
    stopSpeaking();
    setIsSpeaking(false);
    setActiveScreenReadingText(null);
  }, []);

  const updateHearingAid = (updates: Partial<HearingAidDevice>) => {
    setHearingAid(prev => ({ ...prev, ...updates }));
    triggerHaptic('tap');
  };

  const toggleWearableConnection = (id: string) => {
    setWearables(prev =>
      prev.map(w => (w.id === id ? { ...w, connected: !w.connected } : w))
    );
    triggerHaptic('tap');
  };

  return (
    <AccessibilityContext.Provider
      value={{
        profile,
        setProfile,
        theme,
        setTheme,
        brightness,
        setBrightness,
        fontSizeScale,
        setFontSizeScale,
        speechRate,
        setSpeechRate,
        speechPitch,
        setSpeechPitch,
        autoReadOnFocus,
        setAutoReadOnFocus,
        hapticsEnabled,
        setHapticsEnabled,
        hapticIntensity,
        setHapticIntensity,
        triggerHaptic,
        speak,
        stopSpeech,
        isSpeaking,
        hearingAid,
        updateHearingAid,
        wearables,
        toggleWearableConnection,
        isSosOpen,
        setIsSosOpen,
        isAiChatOpen,
        setIsAiChatOpen,
        lastHapticPulseName,
        activeScreenReadingText,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
