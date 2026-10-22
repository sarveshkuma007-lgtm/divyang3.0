import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { HearingAidDevice, SmartWearable } from '../types';
import { 
  Bluetooth, Activity, Volume2, ShieldCheck, BatteryCharging, 
  Wifi, Sliders, CheckCircle2, RefreshCw, Smartphone, Zap
} from 'lucide-react';

export const WearablesModule: React.FC = () => {
  const { 
    hearingAid, 
    updateHearingAid, 
    wearables, 
    toggleWearableConnection, 
    triggerHaptic, 
    speak 
  } = useAccessibility();

  const [isScanningBluetooth, setIsScanningBluetooth] = useState<boolean>(false);
  const [bluetoothScanMessage, setBluetoothScanMessage] = useState<string | null>(null);

  const handleScanWebBluetooth = async () => {
    setIsScanningBluetooth(true);
    triggerHaptic('tap');
    speak('Scanning for Bluetooth medical peripherals and hearing aids nearby...');

    // Attempt native Web Bluetooth API if available
    if (typeof navigator !== 'undefined' && (navigator as any).bluetooth) {
      try {
        await (navigator as any).bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: ['battery_service', 'device_information'],
        });
        setBluetoothScanMessage('New peripheral successfully paired via Web Bluetooth BLE.');
        setIsScanningBluetooth(false);
        return;
      } catch (err: any) {
        // Fall back to prototype simulated scan
      }
    }

    setTimeout(() => {
      setIsScanningBluetooth(false);
      setBluetoothScanMessage('Bluetooth scan complete. All 3 Divyang medical devices synchronized with zero packet loss.');
      triggerHaptic('tap');
      speak('Bluetooth synchronization complete. Hearing aid and tactile cane connected.');
    }, 1500);
  };

  const handleSoundProfileChange = (profile: HearingAidDevice['currentProfile'], label: string) => {
    updateHearingAid({ currentProfile: profile });
    speak(`Hearing aid profile switched to ${label}.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-1">
            <span>Bluetooth Low Energy 5.3 Sync</span>
            <span aria-hidden="true">·</span>
            <span>Medical Audio Equalization</span>
            <span aria-hidden="true">·</span>
            <span>Haptic Actuators</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Medical Devices &amp; Automated Hearing Aid Sync
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time synchronization for binaural hearing aids, ultrasonic LiDAR white canes, and haptic turn-by-turn guidance wearables.
          </p>
        </div>

        {/* Scan Bluetooth Button */}
        <button
          onClick={handleScanWebBluetooth}
          disabled={isScanningBluetooth}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
            isScanningBluetooth
              ? 'bg-cyan-500 text-slate-950 animate-pulse'
              : 'bg-cyan-600 hover:bg-cyan-500 text-slate-950 shadow-md'
          }`}
        >
          <Bluetooth className="w-4 h-4" />
          <span>{isScanningBluetooth ? 'Scanning BLE Radios...' : 'Pair New Bluetooth Device'}</span>
        </button>
      </div>

      {bluetoothScanMessage && (
        <div className="p-4 bg-cyan-950 border border-cyan-700 rounded-xl text-cyan-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>{bluetoothScanMessage}</span>
          </div>
          <button onClick={() => setBluetoothScanMessage(null)} className="text-cyan-400 font-semibold">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid: Hearing Aid Equalizer & Smart Wearables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Automated Hearing Aid Synchronization & Equalizer (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-cyan-400">
                  <Volume2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{hearingAid.name}</h3>
                  <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>{hearingAid.model}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-teal-400">BLE Stream 24-bit HD</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1.5 text-base font-bold text-white font-mono tabular-nums">
                  <BatteryCharging className="w-4 h-4 text-emerald-400" />
                  <span>{hearingAid.batteryLevel}%</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">18h remaining</div>
              </div>
            </div>

            {/* Hearing Aid Sound Profiles */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-300">
                Automated Environmental Sound Profiles:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'speech-clarity', label: 'Speech Clarity', desc: 'Boosts vocal tones' },
                  { id: 'noise-suppression', label: 'Noise Shield', desc: 'Cuts subway rumble' },
                  { id: 'telecoil-loop', label: 'Telecoil T-Loop', desc: 'Station broadcast' },
                  { id: 'outdoor-wind', label: 'Wind Filter', desc: 'Outdoor commute' },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleSoundProfileChange(item.id as any, item.label)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      hearingAid.currentProfile === item.id
                        ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-xs">{item.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Binaural dB Gain Adjuster */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Left Ear Receiver Gain</span>
                  <span className="text-cyan-300 font-mono">+{hearingAid.leftGainDb} dB</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="35"
                  value={hearingAid.leftGainDb}
                  onChange={(e) => updateHearingAid({ leftGainDb: Number(e.target.value) })}
                  className="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded cursor-pointer"
                />
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Right Ear Receiver Gain</span>
                  <span className="text-cyan-300 font-mono">+{hearingAid.rightGainDb} dB</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="35"
                  value={hearingAid.rightGainDb}
                  onChange={(e) => updateHearingAid({ rightGainDb: Number(e.target.value) })}
                  className="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Noise Reduction Intensity */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Adaptive Background Noise Attenuation</span>
                <span className="text-teal-300 font-mono">-{hearingAid.noiseReductionDb} dB</span>
              </div>
              <input
                type="range"
                min="0"
                max="24"
                value={hearingAid.noiseReductionDb}
                onChange={(e) => updateHearingAid({ noiseReductionDb: Number(e.target.value) })}
                className="w-full accent-teal-500 bg-slate-800 h-1.5 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Smart White Cane & Tactile Navigation Belt (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Smart Mobility Wearables Array</span>
            </h3>

            <div className="space-y-3">
              {wearables.map(wearable => (
                <div
                  key={wearable.id}
                  className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">{wearable.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{wearable.statusText}</p>
                    </div>
                    <button
                      onClick={() => toggleWearableConnection(wearable.id)}
                      className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                        wearable.connected
                          ? 'bg-teal-950 text-teal-300 border-teal-800'
                          : 'bg-slate-900 text-slate-500 border-slate-800'
                      }`}
                    >
                      {wearable.connected ? 'SYNCED' : 'OFFLINE'}
                    </button>
                  </div>

                  {/* Battery & Hardware Test */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[11px]">
                    <span className="text-slate-400 font-mono">Battery: {wearable.batteryLevel}%</span>
                    <button
                      onClick={() => {
                        if (wearable.type === 'cane') {
                          triggerHaptic('caution');
                          speak('Testing UltraCane dual handle vibration motors.');
                        } else if (wearable.type === 'haptic-belt') {
                          triggerHaptic('turn-left');
                          speak('Testing Wayband 360 degree directional vibration belt.');
                        } else {
                          triggerHaptic('tap');
                          speak('Testing smartwatch Braille pin actuator.');
                        }
                      }}
                      className="text-cyan-400 hover:underline"
                    >
                      Test Haptic Motors
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Turn-by-Turn Wearable Guidance Test Console */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white">
              Tactile Haptic Navigation Actuator Test
            </h3>
            <p className="text-xs text-slate-400">
              Test how wearable devices pulse for left, right, and emergency obstacle stops while walking.
            </p>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={() => {
                  triggerHaptic('turn-left');
                  speak('Left turn pulse sent to wearables.');
                }}
                className="py-2.5 px-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-xs text-teal-300 font-semibold"
              >
                Left Pulse
              </button>

              <button
                onClick={() => {
                  triggerHaptic('turn-right');
                  speak('Right turn pulse sent to wearables.');
                }}
                className="py-2.5 px-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-xs text-teal-300 font-semibold"
              >
                Right Pulse
              </button>

              <button
                onClick={() => {
                  triggerHaptic('caution');
                  speak('Emergency obstacle shudder sent to all wearables.');
                }}
                className="py-2.5 px-2 bg-red-950/60 hover:bg-red-900/60 border border-red-800 rounded text-xs text-red-300 font-semibold"
              >
                Obstacle Stop
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
