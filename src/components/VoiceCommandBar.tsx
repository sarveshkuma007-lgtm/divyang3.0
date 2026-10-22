import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, Navigation, ShieldAlert, Eye, DollarSign, Video, Radio } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import { ActiveTab } from '../types';

interface VoiceCommandBarProps {
  onNavigateTab: (tab: ActiveTab) => void;
  onRunAction?: (actionName: string, payload?: any) => void;
}

export const VoiceCommandBar: React.FC<VoiceCommandBarProps> = ({ onNavigateTab, onRunAction }) => {
  const { speak, triggerHaptic, setTheme, setIsSosOpen, setIsAiChatOpen, lastHapticPulseName } = useAccessibility();
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [lastExecutedCommand, setLastExecutedCommand] = useState<string>('Voice system active. Speak or tap commands.');
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let current = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            current += event.results[i][0].transcript;
          }
          setTranscript(current);
          handleVoiceCommand(current.toLowerCase());
        };

        recognition.onerror = (err: any) => {
          console.warn('Speech recognition status:', err.error);
        };

        recognition.onend = () => {
          if (isListening) {
            try {
              recognition.start();
            } catch (e) {
              // Ignore
            }
          }
        };

        recognitionRef.current = recognition;
      } catch (e) {
        setIsSupported(false);
      }
    } else {
      setIsSupported(false);
    }
  }, [isListening]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      // Simulate voice listening cycle if browser blocks permissions
      const nextState = !isListening;
      setIsListening(nextState);
      if (nextState) {
        triggerHaptic('tap');
        speak('Voice listener simulated. Tap any preset command or speak.');
        setLastExecutedCommand('Listening for voice commands...');
      } else {
        speak('Voice listener paused.');
      }
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsListening(false);
      speak('Voice command listening paused.');
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {}
      setIsListening(true);
      triggerHaptic('tap');
      speak('Listening for Divyang voice commands. Say navigate, scan, sos, or open call.');
      setLastExecutedCommand('Listening for voice commands...');
    }
  };

  const handleVoiceCommand = (cmdText: string) => {
    const lower = cmdText.trim().toLowerCase();

    if (lower.includes('sos') || lower.includes('emergency') || lower.includes('help me')) {
      setIsSosOpen(true);
      triggerHaptic('sos');
      setLastExecutedCommand('Action: Emergency SOS Activated');
      speak('Emergency SOS protocol initiated.');
      return;
    }

    if (lower.includes('navigate') || lower.includes('map') || lower.includes('directions')) {
      onNavigateTab('navigation');
      triggerHaptic('tap');
      setLastExecutedCommand('Navigating to Divyang Tactile Maps');
      speak('Opening Divyang tactile navigation.');
      return;
    }

    if (lower.includes('close eye') || lower.includes('vr') || lower.includes('sensory') || lower.includes('travel')) {
      onNavigateTab('vr-sensory');
      triggerHaptic('tap');
      setLastExecutedCommand('Opening AI VR Sensory Audio Navigation');
      speak('Entering AI generated sensory audio space. You can close your eyes.');
      return;
    }

    if (lower.includes('sign') || lower.includes('video call') || lower.includes('call') || lower.includes('subtitle')) {
      onNavigateTab('sign-video');
      triggerHaptic('tap');
      setLastExecutedCommand('Opening Sign Language & Video Call Suite');
      speak('Opening sign language camera and video calling.');
      return;
    }

    if (lower.includes('scan') || lower.includes('document') || lower.includes('prescription')) {
      onNavigateTab('scanner');
      triggerHaptic('tap');
      setLastExecutedCommand('Opening Document Scanner with Privacy Guard');
      speak('Opening privacy-aware document scanner.');
      return;
    }

    if (lower.includes('money') || lower.includes('currency') || lower.includes('cash') || lower.includes('rupee')) {
      onNavigateTab('scanner');
      triggerHaptic('tap');
      if (onRunAction) onRunAction('detect-money');
      setLastExecutedCommand('Running Money & Banknote Detector');
      speak('Detecting banknotes and currency.');
      return;
    }

    if (lower.includes('high contrast') || lower.includes('yellow')) {
      setTheme('high-contrast-yellow');
      triggerHaptic('tap');
      setLastExecutedCommand('Theme: High Contrast Yellow Active');
      speak('High contrast yellow on black mode enabled.');
      return;
    }

    if (lower.includes('deaf mode') || lower.includes('calm')) {
      setTheme('deaf-calm');
      triggerHaptic('tap');
      setLastExecutedCommand('Theme: Deaf Calming Palette Active');
      speak('Deaf calming visual theme enabled.');
      return;
    }

    if (lower.includes('reading') || lower.includes('dyslexia')) {
      setTheme('reading');
      triggerHaptic('tap');
      setLastExecutedCommand('Theme: Warm Reading Mode Active');
      speak('Reading mode active.');
      return;
    }

    if (lower.includes('assistant') || lower.includes('chat') || lower.includes('sahayak')) {
      setIsAiChatOpen(true);
      triggerHaptic('tap');
      setLastExecutedCommand('Opening Divyang Sahayak AI');
      speak('Opening Divyang Sahayak assistant.');
      return;
    }
  };

  const handleManualCommand = (command: string, tab?: ActiveTab) => {
    setTranscript(command);
    handleVoiceCommand(command);
    if (tab) onNavigateTab(tab);
  };

  return (
    <section 
      aria-label="Hands-free Voice Command Console"
      className="w-full bg-slate-900/90 border-b border-slate-800 px-4 sm:px-8 py-3 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Active Mic Control & Live Visual Status */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={toggleListening}
            className={`flex items-center justify-center w-11 h-11 rounded-md transition-all focus-visible:outline-2 focus-visible:outline-teal-400 shrink-0 ${
              isListening
                ? 'bg-teal-500 text-slate-950 ring-4 ring-teal-500/20 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            aria-label={isListening ? 'Stop voice command listening' : 'Start voice command listening'}
            title={isListening ? 'Voice command active' : 'Click to enable hands-free voice command'}
          >
            {isListening ? (
              <Mic className="w-5 h-5 animate-pulse" />
            ) : (
              <MicOff className="w-5 h-5 text-slate-400" />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Hands-Free Voice Engine
              </span>
              {isListening && (
                <span className="inline-flex items-center px-1.5 py-0.2 text-[10px] font-mono text-teal-300 bg-teal-950/80 rounded border border-teal-800">
                  LIVE MIC
                </span>
              )}
              {lastHapticPulseName && (
                <span className="inline-flex items-center px-1.5 py-0.2 text-[10px] font-mono text-amber-300 bg-amber-950/80 rounded border border-amber-800">
                  HAPTIC: {lastHapticPulseName}
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-slate-200 truncate">
              {transcript ? `"${transcript}"` : lastExecutedCommand}
            </p>
          </div>
        </div>

        {/* Right: Quick Voice Command Triggers (Immediate one-tap or speech matching) */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => handleManualCommand('Navigate to Metro Station', 'navigation')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 bg-slate-800/80 hover:bg-slate-750 hover:text-white rounded border border-slate-700 whitespace-nowrap transition-colors"
          >
            <Navigation className="w-3.5 h-3.5 text-teal-400" />
            <span>"Navigate"</span>
          </button>

          <button
            onClick={() => handleManualCommand('Close eyes VR sensory mode', 'vr-sensory')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 bg-slate-800/80 hover:bg-slate-750 hover:text-white rounded border border-slate-700 whitespace-nowrap transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>"VR Mode"</span>
          </button>

          <button
            onClick={() => handleManualCommand('Scan medical prescription', 'scanner')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 bg-slate-800/80 hover:bg-slate-750 hover:text-white rounded border border-slate-700 whitespace-nowrap transition-colors"
          >
            <Radio className="w-3.5 h-3.5 text-sky-400" />
            <span>"Scan Document"</span>
          </button>

          <button
            onClick={() => handleManualCommand('Detect 500 Rupee banknote', 'scanner')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 bg-slate-800/80 hover:bg-slate-750 hover:text-white rounded border border-slate-700 whitespace-nowrap transition-colors"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>"Detect Money"</span>
          </button>

          <button
            onClick={() => handleManualCommand('Start sign language video call', 'sign-video')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 bg-slate-800/80 hover:bg-slate-750 hover:text-white rounded border border-slate-700 whitespace-nowrap transition-colors"
          >
            <Video className="w-3.5 h-3.5 text-indigo-400" />
            <span>"Sign Call"</span>
          </button>
        </div>
      </div>
    </section>
  );
};
