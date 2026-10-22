import React, { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { playSpatialPing, playSonarPing, playTactileSubThump } from '../utils/audioSpatial';
import { 
  Compass, Headphones, Volume2, Footprints, AlertTriangle, 
  MapPin, Play, Square, Eye, EyeOff, RotateCcw, Activity
} from 'lucide-react';

export const VRSensoryNavigation: React.FC = () => {
  const { speak, stopSpeech, triggerHaptic, hapticIntensity } = useAccessibility();

  const [isSensoryActive, setIsSensoryActive] = useState<boolean>(false);
  const [eyesClosedMode, setEyesClosedMode] = useState<boolean>(false);
  const [selectedDestination, setSelectedDestination] = useState<string>('botanical-garden');
  const [virtualSteps, setVirtualSteps] = useState<number>(0);
  const [compassHeading, setCompassHeading] = useState<number>(14); // degrees
  const [currentDistanceMeters, setCurrentDistanceMeters] = useState<number>(180);
  const [detectedObstacleDistance, setDetectedObstacleDistance] = useState<number>(4.2);
  const timerRef = useRef<any>(null);

  const destinations: Record<string, {
    name: string;
    city: string;
    description: string;
    totalDistance: number;
    ambientSoundscape: string;
    acousticLandmarks: {
      bearing: number;
      name: string;
      sound: string;
    }[];
  }> = {
    'botanical-garden': {
      name: 'Sensory Botanical Garden & Fragrance Trail',
      city: 'Accessible Urban Sanctuary',
      description: 'Tactile stone pathway bordered by lavender planters, running water fountains, and chirping birds.',
      totalDistance: 220,
      ambientSoundscape: 'Flowing water fountain (45° Right) · Chirping finches (Overhead) · Tactile guide stone underfoot',
      acousticLandmarks: [
        { bearing: 45, name: 'Limestone Fountain', sound: 'Gentle water splash' },
        { bearing: 310, name: 'Bamboo Chime Arbour', sound: 'Hollow wooden resonance' },
        { bearing: 180, name: 'Braille Plant Directory', sound: 'Audio beacon ping' },
      ],
    },
    'museum-audio': {
      name: 'National Museum Tactile Sculpture Hall',
      city: 'Cultural Heritage Gallery',
      description: 'Polished marble floor with high acoustic reverberation, directional audio spotlights at each sculpture.',
      totalDistance: 160,
      ambientSoundscape: 'Soft gallery reverberation · Audio spotlight at 12 o\'clock · Tactile velvet stanchion line',
      acousticLandmarks: [
        { bearing: 0, name: 'Bronze Relief Sculpture', sound: 'Directional narration beam' },
        { bearing: 90, name: 'Audio Guide Touch Console', sound: 'Harmonic bell' },
      ],
    },
    'tokyo-crossing': {
      name: 'Shibuya Accessible Scramble Crossing',
      city: 'Tokyo, Japan (Simulated Mobility)',
      description: 'World-famous intersection simulated with tactile blister street crossings, bird sound cues, and safe pedestrian flow.',
      totalDistance: 280,
      ambientSoundscape: 'Birdsong crosswalk audio (Piyo-Piyo / Kakko) · Smooth electric transit hum · Tactile edge strip',
      acousticLandmarks: [
        { bearing: 15, name: 'North Crossing Audible Signal', sound: 'High cuckoo chirp' },
        { bearing: 100, name: 'Subway Elevator Chime', sound: 'Electronic two-tone' },
      ],
    },
  };

  const currentDest = destinations[selectedDestination] || destinations['botanical-garden'];

  // Sensory audio loop when active
  useEffect(() => {
    if (isSensoryActive) {
      // Periodic spatial ping & sonar feedback
      timerRef.current = setInterval(() => {
        // Step forward
        setVirtualSteps(prev => prev + 1);
        setCurrentDistanceMeters(prev => Math.max(0, prev - 0.9));

        // Sub-bass tactile step thump
        playTactileSubThump();
        triggerHaptic('tap');

        // Directional audio cue: Pings center or pan depending on compass
        const pan = Math.sin((compassHeading * Math.PI) / 180);
        playSpatialPing(520, pan * 0.5, 0.15, 'sine');

        // Echolocation Sonar ping
        playSonarPing(detectedObstacleDistance, pan > 0 ? 'right' : 'left');
      }, 1200);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSensoryActive, compassHeading, detectedObstacleDistance]);

  const startSensoryVR = () => {
    setIsSensoryActive(true);
    setEyesClosedMode(true);
    triggerHaptic('tap');
    speak(
      `Entering AI-generated VR sensory environment for ${currentDest.name}. Put on headphones. You can close your eyes now. Ambient soundscapes and tactile haptics will guide your orientation.`
    );
  };

  const stopSensoryVR = () => {
    setIsSensoryActive(false);
    setEyesClosedMode(false);
    stopSpeech();
    triggerHaptic('tap');
    speak('Sensory VR exploration paused. Opening eyes mode.');
  };

  const turnLeft = () => {
    setCompassHeading(prev => (prev - 15 + 360) % 360);
    playSpatialPing(420, -0.7, 0.2);
    triggerHaptic('turn-left');
    speak('Turned 15 degrees left.');
  };

  const turnRight = () => {
    setCompassHeading(prev => (prev + 15) % 360);
    playSpatialPing(620, 0.7, 0.2);
    triggerHaptic('turn-right');
    speak('Turned 15 degrees right.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-wider uppercase mb-1">
            <span>Spatial Echolocation &amp; Binaural Engine</span>
            <span aria-hidden="true">·</span>
            <span>Binaural 3D Audio</span>
            <span aria-hidden="true">·</span>
            <span>Close-Eyes Travel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            AI-Generated VR Sensory Audio Navigation
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Travel anywhere in the world with your eyes closed. Real-time acoustic reflection, directional soundscapes, and tactile haptic pulses orient you naturally.
          </p>
        </div>

        {/* Sensory VR Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setEyesClosedMode(!eyesClosedMode)}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
              eyesClosedMode
                ? 'bg-amber-950/70 border-amber-800 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {eyesClosedMode ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
            <span>{eyesClosedMode ? 'Eyes-Closed Mode ON' : 'Eyes-Closed Mode OFF'}</span>
          </button>
        </div>
      </div>

      {/* Main Sensory HUD & 3D Environment Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Sensory City Visualization / Eyes Closed Screen (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className={`relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-xl border overflow-hidden shadow-2xl transition-all ${
            eyesClosedMode
              ? 'bg-black border-amber-500/40'
              : 'bg-slate-950 border-slate-800'
          }`}>
            {/* Generated High-Fidelity Sensory City Asset as background */}
            <img
              src="/src/assets/images/vr_sensory_city_1792685152180.jpg"
              alt="AI-generated sensory acoustic city environment with topological soundwaves"
              className={`w-full h-full object-cover transition-opacity duration-700 ${
                eyesClosedMode ? 'opacity-25 filter blur-xs' : 'opacity-85'
              }`}
              referrerPolicy="no-referrer"
            />

            {/* Overlay Echolocation Soundwave Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {isSensoryActive && (
                <>
                  <div className="w-48 h-48 rounded-full border-2 border-amber-400/50 animate-ping"></div>
                  <div className="w-72 h-72 rounded-full border border-teal-400/40 animate-pulse"></div>
                  <div className="w-96 h-96 rounded-full border border-slate-600/30"></div>
                </>
              )}

              {/* Compass Needle */}
              <div
                className="w-20 h-20 rounded-full border-2 border-amber-400 bg-slate-950/80 flex flex-col items-center justify-center shadow-lg transition-transform duration-300"
                style={{ transform: `rotate(${compassHeading}deg)` }}
              >
                <div className="w-1.5 h-6 bg-red-500 rounded-t"></div>
                <div className="w-1.5 h-6 bg-slate-400 rounded-b"></div>
              </div>
            </div>

            {/* Eyes Closed Guide Banner for Low-Vision & Blind Users */}
            {eyesClosedMode && (
              <div className="absolute top-4 left-4 right-4 bg-black/90 border border-amber-500/50 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                  <Headphones className="w-4 h-4" />
                  <span>Eyes Closed Sensory Space · Binaural Audio Active</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Listen with stereo headphones. Higher pitch indicates nearby landmarks. Tactile vibration pulses through your device.
                </p>
              </div>
            )}

            {/* Bottom Telemetry HUD */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300 bg-slate-950/90 border border-slate-800 rounded-lg p-2.5">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <Footprints className="w-4 h-4 text-teal-400" />
                  <strong className="text-white font-mono tabular-nums">{virtualSteps}</strong> steps
                </span>
                <span className="text-slate-600">|</span>
                <span className="flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-amber-400" />
                  <strong className="text-white font-mono tabular-nums">{compassHeading}°</strong> NNE
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400">Remaining:</span>
                <strong className="text-amber-300 font-mono tabular-nums">{currentDistanceMeters.toFixed(1)}m</strong>
              </div>
            </div>
          </div>

          {/* Directional Touch Controls for Visually Impaired (Large High-Target Buttons) */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={turnLeft}
              className="py-3 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-white flex flex-col items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-teal-400" />
              <span>Turn Left 15°</span>
            </button>

            <button
              onClick={() => {
                if (isSensoryActive) {
                  stopSensoryVR();
                } else {
                  startSensoryVR();
                }
              }}
              className={`py-3 px-4 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                isSensoryActive
                  ? 'bg-amber-600 hover:bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-teal-600 hover:bg-teal-500 text-slate-950'
              }`}
            >
              {isSensoryActive ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isSensoryActive ? 'Pause Sensory VR' : 'Begin Closed-Eyes VR'}</span>
            </button>

            <button
              onClick={turnRight}
              className="py-3 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-white flex flex-col items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-teal-400 scale-x-[-1]" />
              <span>Turn Right 15°</span>
            </button>
          </div>
        </div>

        {/* Right Column: Destination Chooser & Acoustic Landmark Beacon Map (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Destination Selector */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Select Virtual Sensory Destination</span>
            </h3>

            <div className="space-y-2">
              {Object.entries(destinations).map(([key, dest]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedDestination(key);
                    setCurrentDistanceMeters(dest.totalDistance);
                    setVirtualSteps(0);
                    triggerHaptic('tap');
                    speak(`Selected ${dest.name}. ${dest.description}`);
                  }}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    selectedDestination === key
                      ? 'border-amber-500 bg-amber-950/30 ring-1 ring-amber-500/30'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{dest.name}</span>
                    <span className="text-[11px] font-mono text-amber-300">{dest.totalDistance}m</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {dest.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Acoustic Soundscape & Echolocation Radar */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-teal-400" />
              <span>Acoustic Echolocation Landmarks</span>
            </h3>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
              <div className="font-semibold text-teal-300">Active Binaural Soundscape:</div>
              <p className="text-slate-400">{currentDest.ambientSoundscape}</p>
            </div>

            <div className="space-y-2">
              {currentDest.acousticLandmarks.map((lm, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-white">{lm.name}</div>
                    <div className="text-[11px] text-slate-400">{lm.sound}</div>
                  </div>
                  <button
                    onClick={() => {
                      playSpatialPing(580, (lm.bearing - 180) / 180, 0.4);
                      triggerHaptic('tap');
                      speak(`${lm.name} is at bearing ${lm.bearing} degrees.`);
                    }}
                    className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-teal-300 rounded border border-slate-700"
                  >
                    Listen Cue
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
