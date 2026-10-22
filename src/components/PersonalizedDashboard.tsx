import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { ActiveTab, AccessibilityProfile, VisualTheme } from '../types';
import { 
  Sun, Moon, Eye, Volume2, Bluetooth, Navigation, Camera,
  CreditCard, Compass, Sliders, CheckCircle2, ShieldCheck, 
  HelpCircle, Sparkles, AlertTriangle, ArrowRight, Activity
} from 'lucide-react';

interface PersonalizedDashboardProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const PersonalizedDashboard: React.FC<PersonalizedDashboardProps> = ({ setActiveTab }) => {
  const {
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
    hapticsEnabled,
    setHapticsEnabled,
    hapticIntensity,
    setHapticIntensity,
    hearingAid,
    wearables,
    speak,
    triggerHaptic,
    setIsAiChatOpen,
    setIsSosOpen,
  } = useAccessibility();

  const handleProfileSelect = (p: AccessibilityProfile, label: string) => {
    setProfile(p);
    triggerHaptic('tap');
  };

  const handleThemeSelect = (t: VisualTheme, label: string) => {
    setTheme(t);
    triggerHaptic('tap');
    speak(`Visual mode switched to ${label}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-10">
      {/* 1. Header Hero with User Empathy & Profile Switcher */}
      <div className="border-b border-slate-800 pb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 tracking-wider uppercase mb-2">
            <span>Universal Divyang Operating Hub</span>
            <span aria-hidden="true">·</span>
            <span>WCAG 2.2 AAA Compliant</span>
            <span aria-hidden="true">·</span>
            <span>Multimodal Sensory Core</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white max-w-2xl text-balance">
            Personalized Accessibility Dashboard
          </h1>
          <p className="mt-2 text-base text-slate-400 max-w-2xl">
            Adaptive sensory controls designed to eliminate ocular irritation, synchronize medical wearables, and provide voice-guided mobility.
          </p>
        </div>

        {/* Accessibility Profile Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <span className="text-xs font-medium text-slate-400 shrink-0">Active Persona:</span>
          <div className="flex flex-wrap gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              onClick={() => handleProfileSelect('deaf', 'Deaf')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                profile === 'deaf' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Deaf / Hard of Hearing
            </button>
            <button
              onClick={() => handleProfileSelect('blind', 'Blind')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                profile === 'blind' ? 'bg-yellow-500 text-black font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Blind / Low Vision
            </button>
            <button
              onClick={() => handleProfileSelect('mute', 'Mute')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                profile === 'mute' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Speech / Mute
            </button>
            <button
              onClick={() => handleProfileSelect('deaf-blind', 'Deaf-Blind')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                profile === 'deaf-blind' ? 'bg-cyan-500 text-black font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Deaf-Blind
            </button>
            <button
              onClick={() => handleProfileSelect('universal', 'Universal')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                profile === 'universal' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Universal
            </button>
          </div>
        </div>
      </div>

      {/* 2. Visual Comfort, Brightness & Adaptive High-Contrast Matrix */}
      <section className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Sun className="w-5 h-5 text-teal-400" />
              <span>Visual Comfort &amp; Adaptive Display Modes</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Engineered with flicker-free muted pigments to prevent neurological irritation for deaf users and maximum luminescence for low vision.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>Current Brightness: <strong className="text-teal-300 font-mono tabular-nums">{brightness}%</strong></span>
            <span>Font Scale: <strong className="text-teal-300 font-mono tabular-nums">{fontSizeScale}%</strong></span>
          </div>
        </div>

        {/* Theme Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => handleThemeSelect('deaf-calm', 'Deaf Calming Palette')}
            className={`p-3 rounded-lg border text-left transition-all ${
              theme === 'deaf-calm'
                ? 'border-teal-500 bg-teal-950/40 ring-2 ring-teal-500/20'
                : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-teal-800 border border-teal-600 mb-2"></div>
            <div className="text-xs font-semibold text-white">Deaf Calming</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Low-glare teal &amp; slate</div>
          </button>

          <button
            onClick={() => handleThemeSelect('high-contrast-yellow', 'High Contrast Yellow')}
            className={`p-3 rounded-lg border text-left transition-all ${
              theme === 'high-contrast-yellow'
                ? 'border-yellow-400 bg-black ring-2 ring-yellow-400/40 text-yellow-300'
                : 'border-slate-800 bg-black hover:border-yellow-600'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-yellow-400 border border-yellow-200 mb-2"></div>
            <div className="text-xs font-bold text-yellow-400">Contrast Yellow</div>
            <div className="text-[11px] text-yellow-600 mt-0.5">Macular low-vision</div>
          </button>

          <button
            onClick={() => handleThemeSelect('high-contrast-cyan', 'High Contrast Cyan')}
            className={`p-3 rounded-lg border text-left transition-all ${
              theme === 'high-contrast-cyan'
                ? 'border-cyan-400 bg-black ring-2 ring-cyan-400/40 text-cyan-300'
                : 'border-slate-800 bg-black hover:border-cyan-600'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-cyan-400 border border-cyan-200 mb-2"></div>
            <div className="text-xs font-bold text-cyan-400">Contrast Cyan</div>
            <div className="text-[11px] text-cyan-600 mt-0.5">Deaf-Blind high acuity</div>
          </button>

          <button
            onClick={() => handleThemeSelect('reading', 'Paper Reading Mode')}
            className={`p-3 rounded-lg border text-left transition-all ${
              theme === 'reading'
                ? 'border-amber-600 bg-amber-950/30 ring-2 ring-amber-500/20'
                : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-amber-200 border border-amber-400 mb-2"></div>
            <div className="text-xs font-semibold text-white">Reading Mode</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Warm paper &amp; dyslexia</div>
          </button>

          <button
            onClick={() => handleThemeSelect('day', 'Daylight High Readability')}
            className={`p-3 rounded-lg border text-left transition-all ${
              theme === 'day'
                ? 'border-sky-500 bg-slate-200 text-slate-900 ring-2 ring-sky-500/20'
                : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-white border border-slate-300 mb-2"></div>
            <div className="text-xs font-semibold text-white">Daylight Mode</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Outdoor direct sunlight</div>
          </button>

          <button
            onClick={() => handleThemeSelect('night', 'Deep Night Slate')}
            className={`p-3 rounded-lg border text-left transition-all ${
              theme === 'night'
                ? 'border-slate-600 bg-slate-950 ring-2 ring-slate-400/20'
                : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-slate-900 border border-slate-700 mb-2"></div>
            <div className="text-xs font-semibold text-white">Night Mode</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Zero blue-light fatigue</div>
          </button>
        </div>

        {/* Sliders for Brightness, Font Scaling & Haptics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Brightness Adjustment */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="brightness-slider" className="font-medium text-slate-300">
                Display Luminescence
              </label>
              <span className="font-mono tabular-nums text-teal-300">{brightness}%</span>
            </div>
            <input
              id="brightness-slider"
              type="range"
              min="40"
              max="125"
              step="5"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-full accent-teal-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              aria-label="Display brightness control"
            />
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Soft 40%</span>
              <span>Balanced 100%</span>
              <span>Ultra 125%</span>
            </div>
          </div>

          {/* Font Scaling */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="font-scale-slider" className="font-medium text-slate-300">
                Dynamic Font Acuity
              </label>
              <span className="font-mono tabular-nums text-teal-300">{fontSizeScale}%</span>
            </div>
            <input
              id="font-scale-slider"
              type="range"
              min="90"
              max="180"
              step="10"
              value={fontSizeScale}
              onChange={(e) => setFontSizeScale(Number(e.target.value))}
              className="w-full accent-teal-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              aria-label="Font scale adjustment"
            />
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Standard 100%</span>
              <span>Large 140%</span>
              <span>Max 180%</span>
            </div>
          </div>

          {/* Haptic Intensity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-300">Tactile Haptic Guidance</span>
              <button
                onClick={() => {
                  setHapticsEnabled(!hapticsEnabled);
                  triggerHaptic('tap');
                }}
                className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                  hapticsEnabled ? 'text-teal-300 border-teal-800 bg-teal-950/60' : 'text-slate-500 border-slate-800'
                }`}
              >
                {hapticsEnabled ? 'ACTIVE' : 'MUTED'}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['gentle', 'moderate', 'strong'] as const).map((intensity) => (
                <button
                  key={intensity}
                  onClick={() => {
                    setHapticIntensity(intensity);
                    triggerHaptic('tap');
                    speak(`Haptic intensity set to ${intensity}`);
                  }}
                  className={`py-1.5 text-xs rounded border transition-colors capitalize ${
                    hapticIntensity === intensity
                      ? 'border-teal-400 bg-teal-950/60 text-teal-200 font-semibold'
                      : 'border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {intensity}
                </button>
              ))}
            </div>
            <div className="text-[11px] text-slate-500">
              Simulates turn vibrations &amp; obstacle warnings
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Feature Command Hub - Direct Access to Required Capabilities */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            Ecosystem Modules
          </h2>
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span>Voice Command Enabled</span>
            <span aria-hidden="true">·</span>
            <span>Real-Time Sensor Link</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Module 1: Divyang Maps & Navigation */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-teal-800/80 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-teal-950/80 border border-teal-800 flex items-center justify-center text-teal-400">
                  <Navigation className="w-5 h-5" />
                </div>
                <div className="text-xs text-slate-400">Voice + Haptic</div>
              </div>
              <h3 className="text-base font-semibold text-white">Voice &amp; Tactile Navigation</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Google Maps-style navigation with voice-guided prompts tailored for visually impaired users, real-time visual alerts, and tactile turns.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveTab('navigation');
                triggerHaptic('tap');
                speak('Opening voice guided Divyang navigation');
              }}
              className="mt-4 flex items-center justify-between px-3.5 py-2 text-xs font-medium text-teal-200 bg-teal-950/60 border border-teal-800/80 rounded-lg hover:bg-teal-900/60 transition-colors"
            >
              <span>Launch Divyang Maps</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Module 2: Close Eyes VR Sensory Environment */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-amber-800/80 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-amber-950/80 border border-amber-800 flex items-center justify-center text-amber-400">
                  <Compass className="w-5 h-5" />
                </div>
                <div className="text-xs text-slate-400">Binaural 3D Audio</div>
              </div>
              <h3 className="text-base font-semibold text-white">Close-Eyes VR Sensory Navigation</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Travel anywhere with closed eyes using AI-generated spatial audio, echolocation pings, and synchronized haptic orientation.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveTab('vr-sensory');
                triggerHaptic('tap');
                speak('Entering close-eyes VR sensory navigation');
              }}
              className="mt-4 flex items-center justify-between px-3.5 py-2 text-xs font-medium text-amber-200 bg-amber-950/60 border border-amber-800/80 rounded-lg hover:bg-amber-900/60 transition-colors"
            >
              <span>Enter VR Sensory Audio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Module 3: Sign Language & Video Calling */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-indigo-800/80 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-950/80 border border-indigo-800 flex items-center justify-center text-indigo-400">
                  <Camera className="w-5 h-5" />
                </div>
                <div className="text-xs text-slate-400">Camera Translation</div>
              </div>
              <h3 className="text-base font-semibold text-white">Sign Translation &amp; Video Call</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Real-time camera sign language translation, automatic video call subtitles, and 3D sign avatar for seamless deaf communication.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveTab('sign-video');
                triggerHaptic('tap');
                speak('Opening sign language translation and video calling');
              }}
              className="mt-4 flex items-center justify-between px-3.5 py-2 text-xs font-medium text-indigo-200 bg-indigo-950/60 border border-indigo-800/80 rounded-lg hover:bg-indigo-900/60 transition-colors"
            >
              <span>Launch Sign &amp; Video Call</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Module 4: Privacy-Aware Document & Currency Scanner */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-sky-800/80 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-sky-950/80 border border-sky-800 flex items-center justify-center text-sky-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-xs text-slate-400">Privacy Safeguard</div>
              </div>
              <h3 className="text-base font-semibold text-white">Document &amp; Money Scanner</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Extracts text, converts to sign language videos, announces banknote values, and warns you to wear Bluetooth earpieces for confidential documents.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveTab('scanner');
                triggerHaptic('tap');
                speak('Opening document and currency scanner');
              }}
              className="mt-4 flex items-center justify-between px-3.5 py-2 text-xs font-medium text-sky-200 bg-sky-950/60 border border-sky-800/80 rounded-lg hover:bg-sky-900/60 transition-colors"
            >
              <span>Scan Documents &amp; Money</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Module 5: Transit Pass & Direct Concessions */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-emerald-800/80 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="text-xs text-slate-400">75% Concession</div>
              </div>
              <h3 className="text-base font-semibold text-white">Accessible Transit Passes</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Purchase universal metro/bus passes online and offline with government Divyang concession, tactile proof, and NFC contactless simulation.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveTab('transit');
                triggerHaptic('tap');
                speak('Opening transit pass and payments');
              }}
              className="mt-4 flex items-center justify-between px-3.5 py-2 text-xs font-medium text-emerald-200 bg-emerald-950/60 border border-emerald-800/80 rounded-lg hover:bg-emerald-900/60 transition-colors"
            >
              <span>Manage Transit Passes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Module 6: Bluetooth Medical & Hearing Aid Sync */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-cyan-800/80 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-cyan-400">
                  <Bluetooth className="w-5 h-5" />
                </div>
                <div className="text-xs text-slate-400">Hardware Sync</div>
              </div>
              <h3 className="text-base font-semibold text-white">Medical Device &amp; Wearables</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Automated hearing aid synchronization, ultrasonic smart cane range telemetry, and haptic belt turn-by-turn guidance calibration.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveTab('wearables');
                triggerHaptic('tap');
                speak('Opening medical device and hearing aid synchronizer');
              }}
              className="mt-4 flex items-center justify-between px-3.5 py-2 text-xs font-medium text-cyan-200 bg-cyan-950/60 border border-cyan-800/80 rounded-lg hover:bg-cyan-900/60 transition-colors"
            >
              <span>Sync Medical Wearables</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Connected Medical Telemetry Strip (Hearing Aid, Smart Cane & Belt) */}
      <section className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-semibold text-white">
              Peripheral Medical Hardware Telemetry
            </h3>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span>Bluetooth Low Energy (BLE) 5.3</span>
            <span aria-hidden="true">·</span>
            <span>Real-time Latency: 12ms</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Hearing Aid Status */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-slate-400">Hearing Aid Synchronizer</div>
              <div className="text-sm font-semibold text-white mt-0.5">{hearingAid.name}</div>
              <div className="text-xs text-teal-400 mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Profile: Speech Clarity active</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-bold text-white font-mono tabular-nums">{hearingAid.batteryLevel}%</div>
              <div className="text-[11px] text-slate-500">Battery Level</div>
            </div>
          </div>

          {/* Smart Cane Status */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-slate-400">LiDAR White Cane</div>
              <div className="text-sm font-semibold text-white mt-0.5">UltraCane Haptic Pro</div>
              <div className="text-xs text-teal-400 mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Range 4.5m Obstacle Scan</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-bold text-white font-mono tabular-nums">84%</div>
              <div className="text-[11px] text-slate-500">Dual Motor OK</div>
            </div>
          </div>

          {/* Tactile Belt Status */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-slate-400">Tactile Navigation Belt</div>
              <div className="text-sm font-semibold text-white mt-0.5">Wayband Haptic Matrix</div>
              <div className="text-xs text-teal-400 mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>8 Directional Buzzers</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-bold text-white font-mono tabular-nums">76%</div>
              <div className="text-[11px] text-slate-500">Calibrated</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
