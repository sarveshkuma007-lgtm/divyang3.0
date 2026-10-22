import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { startEmergencySiren, stopEmergencySiren } from '../utils/audioSpatial';
import { 
  AlertCircle, ShieldAlert, PhoneCall, MapPin, 
  Heart, X, CheckCircle2, Siren, Radio, Zap
} from 'lucide-react';

export const EmergencySOSModal: React.FC = () => {
  const { isSosOpen, setIsSosOpen, triggerHaptic, speak, profile } = useAccessibility();
  const [sirenOn, setSirenOn] = useState<boolean>(true);
  const [dispatched, setDispatched] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(3);

  useEffect(() => {
    if (isSosOpen) {
      triggerHaptic('sos');
      speak('Emergency SOS mode activated. Disagree or cancel within 3 seconds, or emergency dispatch will be alerted with your location.');
      if (sirenOn) {
        startEmergencySiren();
      }

      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setDispatched(true);
            speak('Emergency signal dispatched to 112 Emergency Services and primary emergency guardian.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(timer);
        stopEmergencySiren();
      };
    } else {
      stopEmergencySiren();
      setDispatched(false);
      setCountdown(3);
    }
  }, [isSosOpen, sirenOn]);

  if (!isSosOpen) return null;

  const handleClose = () => {
    stopEmergencySiren();
    setIsSosOpen(false);
    triggerHaptic('tap');
    speak('Emergency SOS cancelled.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      {/* Visual Strobe Alert Header */}
      <div className="w-full max-w-lg bg-slate-950 border-2 border-red-500 rounded-2xl overflow-hidden shadow-2xl space-y-6 p-6">
        {/* Top Danger Bar */}
        <div className="flex items-center justify-between border-b border-red-900 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white animate-pulse">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Emergency SOS Broadcast</h2>
              <p className="text-xs text-red-300 font-mono">
                {dispatched ? 'SIGNAL TRANSMITTED · ACTIVE RESCUE' : `DISPATCHING IN ${countdown}s`}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center"
            aria-label="Cancel SOS"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live GPS & Medical Profile Payload */}
        <div className="bg-red-950/30 border border-red-800/80 rounded-xl p-4 space-y-2 text-xs">
          <div className="flex items-center justify-between text-red-200">
            <span className="font-semibold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span>Current GPS Fix:</span>
            </span>
            <span className="font-mono">28.6139° N, 77.2090° E (Accuracy: ±2m)</span>
          </div>

          <div className="flex items-center justify-between text-red-200">
            <span className="font-semibold flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-red-400" />
              <span>Medical Card:</span>
            </span>
            <span>Blood: B+ · UDID #DL01201994 · Deaf / Low Vision</span>
          </div>

          <div className="flex items-center justify-between text-red-200">
            <span className="font-semibold flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              <span>Primary Guardian:</span>
            </span>
            <span className="font-mono">Dr. R. Sharma (+91 98101 22345)</span>
          </div>
        </div>

        {/* Tactile SOS Signal Info */}
        <div className="p-3 bg-black border border-slate-800 rounded-lg flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Tactile Morse Vibration: <strong>... --- ...</strong></span>
          </div>
          <button
            onClick={() => {
              setSirenOn(!sirenOn);
              if (sirenOn) stopEmergencySiren();
              else startEmergencySiren();
            }}
            className="text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300"
          >
            {sirenOn ? 'Mute Audio Siren' : 'Enable Siren'}
          </button>
        </div>

        {/* Immediate Call Triggers */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <a
            href="tel:112"
            onClick={() => speak('Calling National 112 Emergency Dispatch')}
            className="py-3 px-4 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors text-center"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call 112 Police/EMS</span>
          </a>

          <button
            onClick={handleClose}
            className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold text-center"
          >
            I Am Safe · Dismiss SOS
          </button>
        </div>
      </div>
    </div>
  );
};
