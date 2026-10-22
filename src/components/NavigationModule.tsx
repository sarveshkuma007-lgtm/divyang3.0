import React, { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { NavigationWaypoint, SocialAccessibilityAlert } from '../types';
import { 
  Navigation, Volume2, ShieldAlert, WifiOff, Wifi, 
  MapPin, CheckCircle, ArrowRight, ArrowUp, CornerUpRight, 
  CornerUpLeft, AlertTriangle, Eye, RefreshCw, ThumbsUp, Send
} from 'lucide-react';

export const NavigationModule: React.FC = () => {
  const { speak, stopSpeech, triggerHaptic, hapticIntensity, hearingAid, wearables } = useAccessibility();

  const [activeRouteId, setActiveRouteId] = useState<string>('route-hospital');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [simulatedSpeedKmh, setSimulatedSpeedKmh] = useState<number>(3.8);
  const [activeObstacleAlert, setActiveObstacleAlert] = useState<{
    text: string;
    distance: number;
    urgent: boolean;
  } | null>(null);

  // Social alerts
  const [socialAlerts, setSocialAlerts] = useState<SocialAccessibilityAlert[]>([
    {
      id: 'alert-1',
      type: 'elevator',
      location: 'Metro Gate 2 (MG Road)',
      description: 'Elevator undergoing bi-weekly maintenance. Alternate step-free ramp open at Gate 4 with audio chime.',
      status: 'active',
      timestamp: '14 mins ago',
      verifiedByVolunteers: 6,
    },
    {
      id: 'alert-2',
      type: 'audible-beacon',
      location: 'Civil Hospital Crossing',
      description: 'Audible chirp beacon volume calibrated for heavy traffic hours. Chirps north-south signal.',
      status: 'active',
      timestamp: '32 mins ago',
      verifiedByVolunteers: 11,
    },
    {
      id: 'alert-3',
      type: 'construction',
      location: 'Library Pathway Boardwalk',
      description: 'Sidewalk repair ahead. Temporary tactile rubber guide mat laid out to bypass work area.',
      status: 'active',
      timestamp: '1 hour ago',
      verifiedByVolunteers: 8,
    },
  ]);

  const [newReportText, setNewReportText] = useState<string>('');
  const [showReportForm, setShowReportForm] = useState<boolean>(false);

  // Routes tailored for Divyang users
  const routes: Record<string, {
    title: string;
    destination: string;
    totalDistanceMeters: number;
    estimatedWalkMinutes: number;
    tactilePavedPercent: number;
    audibleCrossings: number;
    steps: NavigationWaypoint[];
  }> = {
    'route-hospital': {
      title: 'Metro Central to Civil Hospital Accessibility Wing',
      destination: 'City Civil Hospital (Divyang Care Unit)',
      totalDistanceMeters: 380,
      estimatedWalkMinutes: 6,
      tactilePavedPercent: 95,
      audibleCrossings: 2,
      steps: [
        {
          id: 'step-1',
          title: 'Exit Metro Gate A onto Tactile Paving',
          distanceMeters: 45,
          instruction: 'Proceed forward 45 meters following the grooved directional pavers on your right.',
          voicePrompt: 'Proceed forward 45 meters. Follow the linear tactile guide tiles along the main concourse.',
          tactileCode: 'straight',
          audioSignalType: 'steady',
          elevationChangeMeters: 0,
          hasTactilePaving: true,
          hasAudibleCrosswalk: false,
        },
        {
          id: 'step-2',
          title: 'Audible Crosswalk at Avenue 4',
          distanceMeters: 60,
          instruction: 'Stop at the warning blister tiles. Wait for the cuckoo chirp sound indicating green walk signal.',
          voicePrompt: 'Warning: Road crossing in 15 meters. Tactile blister tiles underfoot. Audible chirping signal active.',
          tactileCode: 'caution',
          audioSignalType: 'chirp',
          elevationChangeMeters: -0.1,
          hasTactilePaving: true,
          hasAudibleCrosswalk: true,
        },
        {
          id: 'step-3',
          title: 'Turn Right onto Hospital Ramp with Handrails',
          distanceMeters: 75,
          instruction: 'Turn 90 degrees right. Use the continuous steel handrail along the 1:12 slope ramp.',
          voicePrompt: 'Turn 90 degrees right. Enter the hospital wheelchair accessible ramp. Handrail is on your left.',
          tactileCode: 'turn-right',
          audioSignalType: 'steady',
          elevationChangeMeters: 1.2,
          hasTactilePaving: true,
          hasAudibleCrosswalk: false,
        },
        {
          id: 'step-4',
          title: 'Arrive at Divyang Care Lobby & Reception',
          distanceMeters: 30,
          instruction: 'Arrive at automated sliding doors. Audio reception beacon will greet you on entry.',
          voicePrompt: 'You have arrived safely at City Civil Hospital Divyang Care Unit. Reception desk is 4 meters ahead.',
          tactileCode: 'straight',
          audioSignalType: 'bell',
          elevationChangeMeters: 0,
          hasTactilePaving: true,
          hasAudibleCrosswalk: false,
        },
      ],
    },
    'route-library': {
      title: 'Station to Braille & Sign Language Center',
      destination: 'Divyang Knowledge & Braille Center',
      totalDistanceMeters: 260,
      estimatedWalkMinutes: 4,
      tactilePavedPercent: 100,
      audibleCrossings: 1,
      steps: [
        {
          id: 'lib-1',
          title: 'Follow Tactile Promenade East',
          distanceMeters: 80,
          instruction: 'Keep right along the tactile yellow blister lane for 80 meters.',
          voicePrompt: 'Walk straight 80 meters along the pedestrian promenade.',
          tactileCode: 'straight',
          audioSignalType: 'steady',
          elevationChangeMeters: 0,
          hasTactilePaving: true,
          hasAudibleCrosswalk: false,
        },
        {
          id: 'lib-2',
          title: 'Turn Left onto Sensory Garden Walk',
          distanceMeters: 110,
          instruction: 'Turn 90 degrees left at the aromatic sensory planter box.',
          voicePrompt: 'Turn left. You are entering the sensory garden walkway. Low-traffic pedestrian zone.',
          tactileCode: 'turn-left',
          audioSignalType: 'steady',
          elevationChangeMeters: 0,
          hasTactilePaving: true,
          hasAudibleCrosswalk: false,
        },
        {
          id: 'lib-3',
          title: 'Arrive at Braille Center Entrance',
          distanceMeters: 70,
          instruction: 'Entrance with Braille directory board is on your immediate right.',
          voicePrompt: 'Arrived at Braille Center. Braille map console is located at entrance door on your right.',
          tactileCode: 'straight',
          audioSignalType: 'bell',
          elevationChangeMeters: 0,
          hasTactilePaving: true,
          hasAudibleCrosswalk: false,
        },
      ],
    },
  };

  const currentRoute = routes[activeRouteId] || routes['route-hospital'];
  const currentStep = currentRoute.steps[currentStepIndex] || currentRoute.steps[0];

  // Execute guidance when step changes
  useEffect(() => {
    if (isNavigating) {
      // 1. Speak prompt for visually impaired
      speak(currentStep.voicePrompt);

      // 2. Trigger tactile haptic feedback for turn or caution
      if (currentStep.tactileCode === 'turn-left') {
        triggerHaptic('turn-left');
      } else if (currentStep.tactileCode === 'turn-right') {
        triggerHaptic('turn-right');
      } else if (currentStep.tactileCode === 'caution') {
        triggerHaptic('caution');
      } else {
        triggerHaptic([80]);
      }
    }
  }, [currentStepIndex, isNavigating]);

  // Simulate unexpected obstacle detection during navigation
  const triggerSimulatedObstacle = () => {
    setActiveObstacleAlert({
      text: 'Caution! Temporary construction barrier detected 1.5 meters ahead.',
      distance: 1.5,
      urgent: true,
    });
    triggerHaptic('caution');
    speak('Warning! Obstacle detected 1.5 meters ahead. Sidewalk barricade. Shift slightly right.');

    setTimeout(() => {
      setActiveObstacleAlert(null);
    }, 7000);
  };

  const startNavigation = () => {
    setIsNavigating(true);
    setCurrentStepIndex(0);
    triggerHaptic('tap');
    speak(`Starting voice-guided navigation to ${currentRoute.destination}. ${currentRoute.steps[0].voicePrompt}`);
  };

  const stopNavigation = () => {
    setIsNavigating(false);
    stopSpeech();
    triggerHaptic('tap');
    speak('Navigation paused.');
  };

  const nextStep = () => {
    if (currentStepIndex < currentRoute.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      speak('Destination reached. Congratulations on a safe journey!');
      setIsNavigating(false);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handlePostReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReportText.trim()) return;

    const newAlert: SocialAccessibilityAlert = {
      id: `user-report-${Date.now()}`,
      type: 'volunteer-assist',
      location: 'Current Navigation Coordinate',
      description: newReportText.trim(),
      status: 'active',
      timestamp: 'Just now',
      verifiedByVolunteers: 1,
    };

    setSocialAlerts(prev => [newAlert, ...prev]);
    setNewReportText('');
    setShowReportForm(false);
    triggerHaptic('tap');
    speak('Accessibility report submitted to community Divyang network.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 tracking-wider uppercase mb-1">
            <span>High-Contrast Divyang Mobility System</span>
            <span aria-hidden="true">·</span>
            <span>Tactile Haptic Sync</span>
            <span aria-hidden="true">·</span>
            <span>Wearable Ready</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Voice-Guided &amp; Tactile Navigation
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Tailored prompts for visually impaired users with real-time visual alerts and haptic vibration directionals for deaf commuters.
          </p>
        </div>

        {/* Offline Mode & Route Switcher */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsOffline(!isOffline);
              triggerHaptic('tap');
              speak(isOffline ? 'Online cloud GPS navigation synced.' : 'Offline mode active. Using local cached city accessibility map.');
            }}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
              isOffline
                ? 'bg-amber-950/60 border-amber-800 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {isOffline ? <WifiOff className="w-4 h-4 text-amber-400" /> : <Wifi className="w-4 h-4 text-teal-400" />}
            <span>{isOffline ? 'Offline Pack Active' : 'Online GPS'}</span>
          </button>

          <button
            onClick={triggerSimulatedObstacle}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-amber-700 transition-colors"
            title="Test real-time obstacle alert"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Test Obstacle Alert</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Map & Turn-by-Turn Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive High-Contrast Map Canvas & Visual Alert HUD (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
            {/* Map Canvas Background with Tactile Lines */}
            <div className="absolute inset-0 opacity-80">
              <svg className="w-full h-full" viewBox="0 0 800 450" preserveAspectRatio="none">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Road Network */}
                <path d="M 50 180 Q 220 180 320 240 T 750 240" fill="none" stroke="#1e293b" strokeWidth="48" strokeLinecap="round" />
                <path d="M 320 50 L 320 400" fill="none" stroke="#1e293b" strokeWidth="36" strokeLinecap="round" />

                {/* Tactile Blister Yellow Walking Paving Path */}
                <path
                  d="M 60 170 Q 220 170 320 230 L 520 230 L 520 120 L 720 120"
                  fill="none"
                  stroke="#eab308"
                  strokeWidth="8"
                  strokeDasharray="6 6"
                  strokeLinecap="round"
                />

                {/* Safe Ramp Section */}
                <path d="M 520 230 L 520 120" fill="none" stroke="#14b8a6" strokeWidth="10" strokeLinecap="round" />

                {/* Waypoints */}
                <circle cx="60" cy="170" r="10" fill="#3b82f6" />
                <text x="75" y="175" fill="#93c5fd" fontSize="13" fontFamily="sans-serif" fontWeight="bold">Metro Gate A</text>

                <circle cx="320" cy="230" r="9" fill="#f59e0b" />
                <text x="335" y="225" fill="#fde68a" fontSize="12" fontFamily="sans-serif">Audible Crossing (Chirp)</text>

                <circle cx="520" cy="120" r="9" fill="#14b8a6" />
                <text x="535" y="115" fill="#5eead4" fontSize="12" fontFamily="sans-serif">Hospital Wheelchair Ramp</text>

                <circle cx="720" cy="120" r="14" fill="#ef4444" />
                <text x="705" y="150" fill="#fca5a5" fontSize="13" fontFamily="sans-serif" fontWeight="bold">Civil Hospital</text>

                {/* Current User Live Pulse */}
                <circle
                  cx={currentStepIndex === 0 ? 90 : currentStepIndex === 1 ? 320 : currentStepIndex === 2 ? 520 : 720}
                  cy={currentStepIndex === 0 ? 170 : currentStepIndex === 1 ? 230 : currentStepIndex === 2 ? 160 : 120}
                  r="16"
                  fill="none"
                  stroke="#2dd4bf"
                  strokeWidth="3"
                  className="animate-ping"
                />
                <circle
                  cx={currentStepIndex === 0 ? 90 : currentStepIndex === 1 ? 320 : currentStepIndex === 2 ? 520 : 720}
                  cy={currentStepIndex === 0 ? 170 : currentStepIndex === 1 ? 230 : currentStepIndex === 2 ? 160 : 120}
                  r="7"
                  fill="#14b8a6"
                />
              </svg>
            </div>

            {/* Visual Alert Flash Header for Deaf Users */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
              <div className="bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-2 pointer-events-auto">
                <div className="w-2.5 h-2.5 rounded-full bg-teal-400"></div>
                <span className="text-xs font-semibold text-white">
                  Step {currentStepIndex + 1} of {currentRoute.steps.length}
                </span>
                <span className="text-xs text-slate-400">· {currentStep.distanceMeters}m</span>
              </div>

              {currentStep.hasAudibleCrosswalk && (
                <div className="bg-amber-950/90 border border-amber-700 text-amber-200 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 pointer-events-auto animate-pulse">
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Audible Chirp Crosswalk Ahead</span>
                </div>
              )}
            </div>

            {/* Obstacle Alert Floating Banner */}
            {activeObstacleAlert && (
              <div className="absolute bottom-4 left-4 right-4 bg-red-950/95 border-2 border-red-500 rounded-xl p-4 shadow-2xl flex items-center gap-3 animate-bounce">
                <AlertTriangle className="w-6 h-6 text-red-400 shrink-0" />
                <div className="flex-1">
                  <div className="text-xs font-bold text-red-300 uppercase tracking-wider">
                    Immediate Tactile Caution
                  </div>
                  <div className="text-sm font-semibold text-white">{activeObstacleAlert.text}</div>
                </div>
                <button
                  onClick={() => setActiveObstacleAlert(null)}
                  className="px-3 py-1 text-xs bg-red-800 text-white rounded hover:bg-red-700 font-medium"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>

          {/* Route Details Strip */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-center">
            <div>
              <div className="text-xs text-slate-400">Total Distance</div>
              <div className="text-base font-bold text-white font-mono tabular-nums">{currentRoute.totalDistanceMeters}m</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Tactile Paved</div>
              <div className="text-base font-bold text-teal-400 font-mono tabular-nums">{currentRoute.tactilePavedPercent}%</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Audible Signals</div>
              <div className="text-base font-bold text-amber-400 font-mono tabular-nums">{currentRoute.audibleCrossings} Intersections</div>
            </div>
          </div>
        </div>

        {/* Right Column: Turn-by-Turn Guidance & Social Alerts (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Navigation Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
                Turn-by-Turn Instruction
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ETA: ~{currentRoute.estimatedWalkMinutes} mins
              </span>
            </div>

            {/* Large Visual Direction Indicator */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center shrink-0">
                {currentStep.tactileCode === 'turn-left' ? (
                  <CornerUpLeft className="w-8 h-8 text-teal-400" />
                ) : currentStep.tactileCode === 'turn-right' ? (
                  <CornerUpRight className="w-8 h-8 text-teal-400" />
                ) : currentStep.tactileCode === 'caution' ? (
                  <AlertTriangle className="w-8 h-8 text-amber-400" />
                ) : (
                  <ArrowUp className="w-8 h-8 text-teal-400" />
                )}
              </div>

              <div>
                <h2 className="text-lg font-bold text-white leading-snug">
                  {currentStep.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                  {currentStep.instruction}
                </p>
              </div>
            </div>

            {/* Voice Prompt Box */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="text-xs text-slate-300 italic">
                  "{currentStep.voicePrompt}"
                </span>
              </div>
              <button
                onClick={() => speak(currentStep.voicePrompt)}
                className="px-2.5 py-1 text-xs bg-teal-950 border border-teal-700 text-teal-300 rounded hover:bg-teal-900 shrink-0"
              >
                Replay Voice
              </button>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              {!isNavigating ? (
                <button
                  onClick={startNavigation}
                  className="flex-1 py-3 px-4 bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Start Live Voice &amp; Haptic Guidance</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={prevStep}
                    disabled={currentStepIndex === 0}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white rounded-lg text-xs font-semibold"
                  >
                    Previous
                  </button>
                  <button
                    onClick={nextStep}
                    className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-500 text-slate-950 rounded-lg text-xs font-bold"
                  >
                    {currentStepIndex === currentRoute.steps.length - 1 ? 'Finish Route' : 'Next Step (Walk Simulation)'}
                  </button>
                  <button
                    onClick={stopNavigation}
                    className="px-3 py-2.5 bg-red-950/70 border border-red-800 text-red-300 hover:bg-red-900 rounded-lg text-xs"
                  >
                    Stop
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Social Assistance & Accessibility Alerts Feed */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-teal-400" />
                <span>Crowdsourced Accessibility Alerts</span>
              </h3>
              <button
                onClick={() => setShowReportForm(!showReportForm)}
                className="text-xs text-teal-300 hover:underline"
              >
                {showReportForm ? 'Cancel' : '+ Report Barrier'}
              </button>
            </div>

            {/* Quick Report Barrier Form */}
            {showReportForm && (
              <form onSubmit={handlePostReport} className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                <label className="text-xs text-slate-300 font-medium">Describe Accessibility Obstacle</label>
                <input
                  type="text"
                  value={newReportText}
                  onChange={(e) => setNewReportText(e.target.value)}
                  placeholder="e.g. Broken elevator at gate 3, missing tactile mat..."
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white focus:outline-teal-400"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-teal-600 text-slate-950 font-semibold rounded text-xs hover:bg-teal-500"
                >
                  Submit Alert to Network
                </button>
              </form>
            )}

            {/* Alerts List */}
            <div className="space-y-3">
              {socialAlerts.map(alert => (
                <div key={alert.id} className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="font-semibold text-teal-300">{alert.location}</span>
                    <span className="font-mono text-[11px]">{alert.timestamp}</span>
                  </div>
                  <p className="text-slate-200">{alert.description}</p>
                  <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
                    <span>Verified by {alert.verifiedByVolunteers} commuters</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-teal-400">Divyang Volunteer Validated</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
