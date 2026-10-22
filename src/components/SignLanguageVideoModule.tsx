import React, { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { 
  Camera, Video, Mic, MicOff, PhoneCall, PhoneOff, 
  Sparkles, CheckCircle2, MessageSquare, RefreshCw, Volume2, 
  HelpCircle, UserCheck, Shield
} from 'lucide-react';

export const SignLanguageVideoModule: React.FC = () => {
  const { speak, triggerHaptic } = useAccessibility();

  const [activeSubTab, setActiveSubTab] = useState<'camera-translator' | 'video-call'>('video-call');
  const [cameraActive, setCameraActive] = useState<boolean>(true);
  const [isCalling, setIsCalling] = useState<boolean>(true);
  const [micMuted, setMicMuted] = useState<boolean>(false);
  const [detectedSign, setDetectedSign] = useState<{
    gesture: string;
    translation: string;
    confidence: number;
    timestamp: string;
  }>({
    gesture: 'HELLO',
    translation: 'Hello! I am communicating via Divyang sign translation.',
    confidence: 96.4,
    timestamp: 'Just now',
  });

  const [callSubtitles, setCallSubtitles] = useState<{
    id: string;
    speaker: 'Deaf Commuter (Sign Language)' | 'Dr. Meera (Speech Audio)';
    text: string;
    signGloss?: string[];
    time: string;
  }[]>([
    {
      id: 'sub-1',
      speaker: 'Dr. Meera (Speech Audio)',
      text: 'Good morning! Can you see the live subtitles clearly on your screen?',
      signGloss: ['GOOD', 'MORNING', 'YOU', 'SEE', 'SUBTITLES', 'CLEAR'],
      time: '10:02 AM',
    },
    {
      id: 'sub-2',
      speaker: 'Deaf Commuter (Sign Language)',
      text: 'Yes, the AI sign translator is reading my hands smoothly. I need direction to the audiology lab.',
      signGloss: ['YES', 'AI', 'SIGN', 'READ', 'SMOOTH', 'NEED', 'AUDIOLOGY', 'ROOM'],
      time: '10:02 AM',
    },
    {
      id: 'sub-3',
      speaker: 'Dr. Meera (Speech Audio)',
      text: 'The audiology unit is on Floor 2. Take the step-free tactile elevator right past reception.',
      signGloss: ['AUDIOLOGY', 'FLOOR-TWO', 'TAKE', 'ELEVATOR', 'RIGHT', 'PAST', 'RECEPTION'],
      time: '10:03 AM',
    },
  ]);

  const [customSignInput, setCustomSignInput] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Initialize camera stream if available in browser
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (cameraActive && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(s => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(err => {
          // Camera denied or hermetic iframe fallback
          console.log('Camera running in simulated high-fidelity mode');
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraActive]);

  const handleSimulateGesture = (gesture: string, translation: string, signGloss: string[]) => {
    setDetectedSign({
      gesture,
      translation,
      confidence: +(94 + Math.random() * 5).toFixed(1),
      timestamp: 'Just now',
    });

    // Add to live call subtitles
    const newSub = {
      id: `sub-${Date.now()}`,
      speaker: 'Deaf Commuter (Sign Language)' as const,
      text: translation,
      signGloss,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setCallSubtitles(prev => [...prev, newSub]);
    triggerHaptic('tap');
    speak(translation);
  };

  const handleSendCustomText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSignInput.trim()) return;

    const newSub = {
      id: `sub-${Date.now()}`,
      speaker: 'Dr. Meera (Speech Audio)' as const,
      text: customSignInput.trim(),
      signGloss: customSignInput.trim().toUpperCase().split(' ').slice(0, 6),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setCallSubtitles(prev => [...prev, newSub]);
    setCustomSignInput('');
    triggerHaptic('tap');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 tracking-wider uppercase mb-1">
            <span>Camera Vision &amp; Sign Language Engine</span>
            <span aria-hidden="true">·</span>
            <span>ASL &amp; ISL Vocabulary</span>
            <span aria-hidden="true">·</span>
            <span>Auto Subtitles</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Sign Language Translation &amp; Accessible Video Call
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Automated hand gesture detection translates signs to live spoken subtitles, and bidirectional video calling keeps deaf and hearing individuals in sync.
          </p>
        </div>

        {/* Tab switch between Video Call & Camera Translator */}
        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            onClick={() => {
              setActiveSubTab('video-call');
              triggerHaptic('tap');
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'video-call'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Video Call with Subtitles
          </button>
          <button
            onClick={() => {
              setActiveSubTab('camera-translator');
              triggerHaptic('tap');
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'camera-translator'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign Camera Scanner
          </button>
        </div>
      </div>

      {/* Main Section */}
      {activeSubTab === 'video-call' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Video Calling Feeds (Dual Feed: Deaf User + Peer Caller) (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
              {/* Remote Participant (Dr. Meera / Interpreter) */}
              <div className="w-full h-full bg-slate-900 flex items-center justify-center relative">
                {/* Fallback realistic video avatar */}
                <div className="text-center p-6 space-y-3">
                  <div className="w-20 h-20 rounded-full bg-indigo-950 border-2 border-indigo-500/50 flex items-center justify-center mx-auto text-indigo-300 font-bold text-2xl">
                    DM
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">Dr. Meera Sharma</h3>
                    <p className="text-xs text-slate-400">Chief Audiologist &amp; Certified Sign Interpreter</p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-800 rounded">
                    <span>CALL ACTIVE · HD ENCRYPTED</span>
                  </div>
                </div>

                {/* Picture-in-Picture: Local User Feed with Live Hand Sign Tracking */}
                <div className="absolute top-4 right-4 w-44 sm:w-52 aspect-[4/3] rounded-lg bg-black border-2 border-teal-500 overflow-hidden shadow-xl">
                  {cameraActive ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover scale-x-[-1]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
                      Camera Muted
                    </div>
                  )}

                  {/* Hand Tracking Bounding Box Simulation */}
                  <div className="absolute inset-3 border border-teal-400/80 rounded pointer-events-none">
                    <div className="absolute -top-2 left-1 bg-teal-500 text-slate-950 font-mono text-[9px] px-1 font-bold rounded">
                      SIGN DETECTED: {detectedSign.gesture}
                    </div>
                  </div>
                </div>

                {/* Live Overlaid Subtitles Banner on Video */}
                <div className="absolute bottom-4 left-4 right-4 bg-slate-950/95 border border-slate-700/80 rounded-xl p-3.5 shadow-2xl backdrop-blur-md">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-teal-400 uppercase tracking-wider mb-1">
                    <span>Real-Time Bilingual Subtitles</span>
                    <span className="font-mono text-slate-400 tabular-nums">Confidence: {detectedSign.confidence}%</span>
                  </div>
                  <p className="text-sm sm:text-base font-medium text-white leading-relaxed">
                    {callSubtitles[callSubtitles.length - 1]?.text || detectedSign.translation}
                  </p>
                </div>
              </div>
            </div>

            {/* Video Call Controls Bar */}
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setCameraActive(!cameraActive);
                    triggerHaptic('tap');
                  }}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
                    cameraActive
                      ? 'bg-slate-800 text-white border-slate-700 hover:bg-slate-750'
                      : 'bg-red-950/80 border-red-800 text-red-300'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>{cameraActive ? 'Camera ON' : 'Camera OFF'}</span>
                </button>

                <button
                  onClick={() => {
                    setMicMuted(!micMuted);
                    triggerHaptic('tap');
                  }}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
                    !micMuted
                      ? 'bg-slate-800 text-white border-slate-700 hover:bg-slate-750'
                      : 'bg-amber-950/80 border-amber-800 text-amber-300'
                  }`}
                >
                  {micMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  <span>{micMuted ? 'Muted' : 'Mic ON'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsCalling(!isCalling);
                    triggerHaptic('tap');
                    speak(isCalling ? 'Call ended.' : 'Initiating accessible video call.');
                  }}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${
                    isCalling
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {isCalling ? <PhoneOff className="w-4 h-4" /> : <PhoneCall className="w-4 h-4" />}
                  <span>{isCalling ? 'End Call' : 'Start Call'}</span>
                </button>
              </div>
            </div>

            {/* Quick Gesture Simulator for Instant Demonstration */}
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
              <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Simulate Camera Sign Language Gesture:</span>
                <span className="text-[11px] text-teal-400">Triggers Live Subtitles &amp; Voice</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => handleSimulateGesture('HELLO', 'Hello, how can I help you today?', ['HELLO', 'HELP', 'TODAY'])}
                  className="p-2 text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-left transition-colors"
                >
                  <div className="font-bold text-teal-300">HELLO</div>
                  <div className="text-[10px] text-slate-400 truncate">General greeting</div>
                </button>

                <button
                  onClick={() => handleSimulateGesture('THANK YOU', 'Thank you very much for your kind support.', ['THANK-YOU', 'SUPPORT'])}
                  className="p-2 text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-left transition-colors"
                >
                  <div className="font-bold text-teal-300">THANK YOU</div>
                  <div className="text-[10px] text-slate-400 truncate">Appreciation</div>
                </button>

                <button
                  onClick={() => handleSimulateGesture('EMERGENCY', 'I need immediate medical emergency assistance!', ['HELP', 'DOCTOR', 'URGENT'])}
                  className="p-2 text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-left transition-colors"
                >
                  <div className="font-bold text-red-400">EMERGENCY</div>
                  <div className="text-[10px] text-slate-400 truncate">Urgent help</div>
                </button>

                <button
                  onClick={() => handleSimulateGesture('MEDICINE', 'Where is the nearest pharmacy or medication counter?', ['MEDICINE', 'PHARMACY', 'WHERE'])}
                  className="p-2 text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-left transition-colors"
                >
                  <div className="font-bold text-teal-300">MEDICINE</div>
                  <div className="text-[10px] text-slate-400 truncate">Prescription</div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Complete Conversation Transcript & Sign Avatar Guide (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Subtitle Transcript History */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  <span>Subtitles &amp; Sign Gloss Transcript</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">Bilingual Sync</span>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {callSubtitles.map(sub => (
                  <div key={sub.id} className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-indigo-300">{sub.speaker}</span>
                      <span className="text-[11px] font-mono text-slate-500">{sub.time}</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed">{sub.text}</p>
                    {sub.signGloss && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {sub.signGloss.map((gloss, idx) => (
                          <span key={idx} className="text-[10px] font-mono text-teal-300 bg-teal-950/60 px-1.5 py-0.5 rounded border border-teal-900">
                            [{gloss}]
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Text to Sign / Speech Input */}
              <form onSubmit={handleSendCustomText} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={customSignInput}
                  onChange={(e) => setCustomSignInput(e.target.value)}
                  placeholder="Type message to convert to sign subtitles..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-indigo-400"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold whitespace-nowrap"
                >
                  Send
                </button>
              </form>
            </div>

            {/* 3D Sign Language Avatar Demonstrator */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-teal-400" />
                  <span>3D Sign Language Avatar Demonstrator</span>
                </h3>
                <span className="text-xs text-teal-400">Maya (ASL/ISL)</span>
              </div>

              <div className="aspect-[4/3] w-full rounded-lg overflow-hidden border border-slate-800 relative bg-slate-950">
                <img
                  src="/src/assets/images/sign_language_guide_1792685151788.jpg"
                  alt="3D Sign language virtual instructor demonstrating gestures"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-slate-950/90 border border-slate-800 rounded px-2.5 py-1 text-center text-xs text-teal-300">
                  Signing: "{detectedSign.gesture}" · Real-time gesture sync
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Standalone Camera Sign Scanner Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-indigo-400" />
              <span>Camera Hand Tracking &amp; Gesture Interpreter</span>
            </h3>
            <div className="relative aspect-[4/3] w-full rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
              <div className="absolute inset-8 border-2 border-teal-400/80 rounded-xl pointer-events-none flex items-center justify-center">
                <span className="bg-slate-950/80 text-teal-300 font-mono text-xs px-2 py-1 rounded">
                  KEEP HANDS INSIDE BOX
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1">
              <div className="text-slate-400">Current Gesture: <strong className="text-teal-300">{detectedSign.gesture}</strong></div>
              <div className="text-white text-sm font-medium">"{detectedSign.translation}"</div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-semibold text-white">
              Divyang Sign Language Dictionary
            </h3>
            <p className="text-xs text-slate-400">
              Select any vocabulary word to test the camera detection model and speech synthesis.
            </p>

            <div className="space-y-3">
              {[
                { sign: 'HELLO', desc: 'Hand open near brow, wave outward.', speech: 'Hello, welcome!' },
                { sign: 'HELP / SOS', desc: 'Closed fist on open palm upward.', speech: 'I require assistance!' },
                { sign: 'THANK YOU', desc: 'Fingertips touch chin and extend forward.', speech: 'Thank you very much.' },
                { sign: 'WATER', desc: 'W-handshape tapping near lower lip.', speech: 'Can I have drinking water please?' },
                { sign: 'DOCTOR', desc: 'Two fingers tapping wrist pulse area.', speech: 'I need to see a doctor.' },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{item.sign}</div>
                    <div className="text-slate-400 mt-0.5">{item.desc}</div>
                  </div>
                  <button
                    onClick={() => handleSimulateGesture(item.sign, item.speech, [item.sign])}
                    className="px-3 py-1.5 bg-indigo-950 border border-indigo-700 text-indigo-300 rounded hover:bg-indigo-900 whitespace-nowrap"
                  >
                    Test Sign
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
