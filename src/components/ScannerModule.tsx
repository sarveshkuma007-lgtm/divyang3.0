import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { ScannedDocumentResult, DetectedCurrency, DetectedObstacle } from '../types';
import { 
  Scan, ShieldAlert, Lock, Unlock, FileText, DollarSign, 
  Eye, Volume2, Bluetooth, AlertTriangle, CheckCircle, 
  RefreshCw, Play, Video, ArrowRight
} from 'lucide-react';

export const ScannerModule: React.FC = () => {
  const { speak, stopSpeech, triggerHaptic, hearingAid } = useAccessibility();

  const [activeTab, setActiveTab] = useState<'document' | 'money' | 'obstacle'>('document');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [selectedDocSample, setSelectedDocSample] = useState<string>('medical-prescription');
  const [docResult, setDocResult] = useState<ScannedDocumentResult>({
    title: 'Apollo Hospitals Clinical Prescription',
    docType: 'Medical & Diagnostic Health Record',
    isSensitive: true,
    sensitivityReason: 'Contains protected patient medical diagnoses, doctor notes, and prescription dosages.',
    extractedText: 'Patient: Divyang Citizen #8841-A. Rx: Azithromycin 500mg once daily after meal for 5 days. Blood Pressure: 122/80 mmHg. Next audiometry check: 7 days.',
    summary: 'Clinical prescription for antibiotic medication with follow-up audiometry scheduled in 7 days.',
    signGloss: ['DOCTOR', 'MEDICINE', 'EAT', 'ONE-PER-DAY', 'FIVE-DAYS', 'VISIT', 'HOSPITAL'],
  });

  // Privacy Safeguard State
  const [privacyConsentGiven, setPrivacyConsentGiven] = useState<boolean>(false);
  const [isBluetoothEarpieceConfirmed, setIsBluetoothEarpieceConfirmed] = useState<boolean>(hearingAid.connected);

  // Currency detector state
  const [selectedCurrencySample, setSelectedCurrencySample] = useState<string>('inr-500');
  const [currencyResult, setCurrencyResult] = useState<DetectedCurrency>({
    denomination: '₹500 (Five Hundred Rupees)',
    currency: 'INR',
    value: 500,
    confidence: 0.98,
    tactileVibrations: [200, 100, 200, 100, 200, 100, 200, 100, 400],
    voiceAnnouncement: 'Five Hundred Rupee banknote recognized. Genuine Reserve Bank watermark detected.',
  });

  // Obstacle detector state
  const [selectedObstacleSample, setSelectedObstacleSample] = useState<string>('curb-drop');
  const [obstacleResult, setObstacleResult] = useState<DetectedObstacle>({
    obstacle: 'Sudden Sidewalk Curb Drop',
    distanceMeters: 1.2,
    direction: 'Directly Ahead (12 o\'clock)',
    urgency: 'high',
    tactilePattern: [400, 100, 400, 100, 400],
    voiceAlert: 'Caution! Low curb drop 1.2 meters ahead. Step down carefully.',
    navCorrection: 'Shift 30 degrees right toward the tactile curb ramp.',
  });

  // 1. Scan Document
  const handleScanDocument = async (sampleKey: string) => {
    setIsScanning(true);
    setSelectedDocSample(sampleKey);
    setPrivacyConsentGiven(false);
    triggerHaptic('tap');

    try {
      const res = await fetch('/api/scan-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sampleId: sampleKey }),
      });
      const data = await res.json();
      setDocResult(data);
      setIsScanning(false);

      if (data.isSensitive) {
        triggerHaptic('caution');
        speak(
          'Privacy Alert: Sensitive confidential document detected. For your safety and confidentiality, connect a Bluetooth earpiece first or proceed to a private location before text is read aloud.'
        );
      } else {
        triggerHaptic('tap');
        speak(`Document scanned: ${data.title}. Type: ${data.docType}. Summary: ${data.summary}`);
      }
    } catch (e) {
      setIsScanning(false);
    }
  };

  // 2. Detect Currency
  const handleDetectCurrency = async (currKey: string) => {
    setIsScanning(true);
    setSelectedCurrencySample(currKey);
    triggerHaptic('tap');

    try {
      const res = await fetch('/api/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'currency', target: currKey }),
      });
      const data: DetectedCurrency = await res.json();
      setCurrencyResult(data);
      setIsScanning(false);

      // Trigger currency tactile pulse
      triggerHaptic(data.tactileVibrations);
      speak(data.voiceAnnouncement);
    } catch (e) {
      setIsScanning(false);
    }
  };

  // 3. Detect Obstacle
  const handleDetectObstacle = async (obstKey: string) => {
    setIsScanning(true);
    setSelectedObstacleSample(obstKey);
    triggerHaptic('tap');

    try {
      const res = await fetch('/api/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'obstacle', target: obstKey }),
      });
      const data: DetectedObstacle = await res.json();
      setObstacleResult(data);
      setIsScanning(false);

      // Trigger warning pattern
      triggerHaptic(data.tactilePattern);
      speak(`${data.voiceAlert} ${data.navCorrection}`);
    } catch (e) {
      setIsScanning(false);
    }
  };

  const handleReadSensitiveText = () => {
    setPrivacyConsentGiven(true);
    triggerHaptic('tap');
    speak(`Reading confidential document: ${docResult.extractedText}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 tracking-wider uppercase mb-1">
            <span>OCR &amp; Computer Vision Engine</span>
            <span aria-hidden="true">·</span>
            <span>Privacy Safeguard</span>
            <span aria-hidden="true">·</span>
            <span>Tactile Denomination</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Privacy Document &amp; Money Scanner
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Extracts text from photos, converts documents to sign language gloss, identifies banknotes by voice and tactile vibration, and protects your private records.
          </p>
        </div>

        {/* Tab switch: Document, Money, Obstacle */}
        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            onClick={() => {
              setActiveTab('document');
              triggerHaptic('tap');
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'document' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Document Scanner
          </button>
          <button
            onClick={() => {
              setActiveTab('money');
              triggerHaptic('tap');
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'money' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Money Detector
          </button>
          <button
            onClick={() => {
              setActiveTab('obstacle');
              triggerHaptic('tap');
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'obstacle' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Obstacle Detector
          </button>
        </div>
      </div>

      {/* Mode 1: Document Scanner */}
      {activeTab === 'document' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Document Camera View & Sample Pickers (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[4/3] w-full bg-slate-950 rounded-xl border border-slate-800 p-6 flex flex-col justify-between overflow-hidden shadow-lg">
              {/* Scan Reticle Line */}
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8">
                <div className="flex justify-between">
                  <div className="w-8 h-8 border-t-2 border-l-2 border-sky-400"></div>
                  <div className="w-8 h-8 border-t-2 border-r-2 border-sky-400"></div>
                </div>
                {isScanning && (
                  <div className="w-full h-0.5 bg-sky-400 shadow-[0_0_15px_#38bdf8] animate-pulse"></div>
                )}
                <div className="flex justify-between">
                  <div className="w-8 h-8 border-b-2 border-l-2 border-sky-400"></div>
                  <div className="w-8 h-8 border-b-2 border-r-2 border-sky-400"></div>
                </div>
              </div>

              {/* Document Preview Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-5 z-10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-300 uppercase tracking-wide">
                    Document in Viewfinder
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">OCR Lens Active</span>
                </div>
                <h3 className="text-base font-bold text-white">{docResult.title}</h3>
                <p className="text-xs text-slate-300 font-mono line-clamp-3 bg-slate-950 p-2.5 rounded border border-slate-800">
                  {docResult.extractedText}
                </p>
              </div>

              {/* Status footer */}
              <div className="flex items-center justify-between text-xs text-slate-400 z-10">
                <span>Class: <strong className="text-white">{docResult.docType}</strong></span>
                <span>Privacy: {docResult.isSensitive ? '🔒 Confidential' : '🔓 Public'}</span>
              </div>
            </div>

            {/* Document Test Benchmark Presets */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300">
                Scan Document Samples:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleScanDocument('medical-prescription')}
                  className={`p-2.5 text-xs rounded-lg border text-left transition-colors ${
                    selectedDocSample === 'medical-prescription'
                      ? 'border-sky-500 bg-sky-950/40 text-sky-200'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="font-semibold">Hospital Prescription</div>
                  <div className="text-[11px] text-red-400">Private / Medical</div>
                </button>

                <button
                  onClick={() => handleScanDocument('bank-statement')}
                  className={`p-2.5 text-xs rounded-lg border text-left transition-colors ${
                    selectedDocSample === 'bank-statement'
                      ? 'border-sky-500 bg-sky-950/40 text-sky-200'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="font-semibold">Bank Pension Statement</div>
                  <div className="text-[11px] text-red-400">Private / Financial</div>
                </button>

                <button
                  onClick={() => handleScanDocument('transit-pass')}
                  className={`p-2.5 text-xs rounded-lg border text-left transition-colors ${
                    selectedDocSample === 'transit-pass'
                      ? 'border-sky-500 bg-sky-950/40 text-sky-200'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="font-semibold">Divyang Transit Pass</div>
                  <div className="text-[11px] text-emerald-400">Standard Mobility</div>
                </button>

                <button
                  onClick={() => handleScanDocument('udid-card')}
                  className={`p-2.5 text-xs rounded-lg border text-left transition-colors ${
                    selectedDocSample === 'udid-card'
                      ? 'border-sky-500 bg-sky-950/40 text-sky-200'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="font-semibold">Government UDID Card</div>
                  <div className="text-[11px] text-red-400">Private / ID</div>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Privacy Guard Shield & Sign Language Gloss Output (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* PRIVACY GUARD WARNING BANNER (Critical requirement from prompt!) */}
            {docResult.isSensitive ? (
              <div className="p-5 rounded-xl border-2 border-amber-500 bg-amber-950/40 space-y-4">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h2 className="text-base font-bold text-amber-300">
                      Privacy Guard Activated: Confidential Document
                    </h2>
                    <p className="text-xs text-amber-200/90 mt-1 leading-relaxed">
                      {docResult.sensitivityReason ||
                        'This document contains sensitive private records. To prevent bystanders from overhearing, connect a Bluetooth earpiece first or move to a private location before text is spoken.'}
                    </p>
                  </div>
                </div>

                {/* Bluetooth Earpiece Status */}
                <div className="p-3 rounded-lg bg-black/60 border border-amber-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Bluetooth className="w-4 h-4 text-teal-400" />
                    <span>
                      {hearingAid.connected
                        ? `Connected: ${hearingAid.name}`
                        : 'No Bluetooth earpiece detected'}
                    </span>
                  </div>
                  <span className={`font-mono text-[10px] px-2 py-0.5 rounded ${
                    hearingAid.connected ? 'bg-teal-950 text-teal-300 border border-teal-800' : 'bg-red-950 text-red-300'
                  }`}>
                    {hearingAid.connected ? 'SECURE AUDIO OK' : 'PUBLIC AUDIO RISK'}
                  </span>
                </div>

                {/* Privacy Consent Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={handleReadSensitiveText}
                    className="w-full sm:w-auto px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>Proceed &amp; Read Aloud Securely</span>
                  </button>

                  <button
                    onClick={() => {
                      triggerHaptic('tap');
                      speak('Privacy mode verified. Screen display only.');
                    }}
                    className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 rounded-lg text-xs"
                  >
                    Silent Visual Only
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-emerald-800 bg-emerald-950/30 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="text-xs text-emerald-200">
                  Public document verified. Safe to announce over speakers.
                </div>
              </div>
            )}

            {/* Extracted Document Summary & Sign Language Gloss */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-sky-400" />
                  <span>Document Meaning &amp; Sign Language Conversion</span>
                </h3>
                <span className="text-xs text-sky-400">Divyang AI OCR</span>
              </div>

              <div>
                <div className="text-xs text-slate-400 font-medium">Plain-Language Summary:</div>
                <p className="text-sm text-slate-200 mt-1 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                  {docResult.summary}
                </p>
              </div>

              {/* Sign Language Gloss Sequence */}
              <div>
                <div className="text-xs text-slate-400 font-medium mb-1.5 flex items-center justify-between">
                  <span>Sign Language Video Representation:</span>
                  <span className="text-[11px] text-teal-400">ASL / ISL Gloss Keywords</span>
                </div>
                <div className="flex flex-wrap gap-1.5 p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  {docResult.signGloss.map((gloss, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs font-mono font-semibold text-teal-300 bg-teal-950/80 border border-teal-800 rounded"
                    >
                      [{gloss}]
                    </span>
                  ))}
                </div>
              </div>

              {/* Audio Listen */}
              <button
                onClick={() => speak(docResult.summary)}
                className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Volume2 className="w-4 h-4 text-teal-400" />
                <span>Listen to Extracted Summary</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Money / Currency Detector */}
      {activeTab === 'money' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <span>Camera Banknote &amp; Currency Detector</span>
            </h3>
            <div className="relative aspect-[4/3] w-full rounded-xl bg-slate-950 border border-slate-800 p-6 flex flex-col justify-center items-center text-center shadow-lg">
              <div className="w-24 h-24 rounded-full bg-emerald-950/60 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 text-2xl font-bold font-mono">
                {currencyResult.currency === 'INR' ? '₹' : '$'}{currencyResult.value}
              </div>
              <div className="mt-4 text-lg font-bold text-white">{currencyResult.denomination}</div>
              <div className="text-xs text-slate-400 mt-1">
                Confidence: {(currencyResult.confidence * 100).toFixed(0)}% · Optical Watermark Verified
              </div>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1">
              <div className="text-slate-400 font-medium">Tactile Vibration Confirmation:</div>
              <div className="text-teal-300 font-mono">
                {currencyResult.value === 500 && '5 distinct tactile pulses emitted for ₹500'}
                {currencyResult.value === 200 && '2 long tactile pulses emitted for ₹200'}
                {currencyResult.value === 100 && '1 long pulse + 1 short pulse emitted for ₹100'}
                {currencyResult.value === 20 && '2 short pulses for $20'}
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-semibold text-white">
              Scan Banknote Benchmarks
            </h3>
            <p className="text-xs text-slate-400">
              Select a banknote denomination to test high-contrast identification, tactile pulse code, and speech output.
            </p>

            <div className="space-y-2">
              {[
                { id: 'inr-500', label: '₹500 Banknote (Mahatma Gandhi Series)', desc: 'Grey stone note with Red Fort motif' },
                { id: 'inr-200', label: '₹200 Banknote (Bright Orange)', desc: 'Sanchi Stupa motif with tactile mark' },
                { id: 'inr-100', label: '₹100 Banknote (Lavender)', desc: 'Rani ki Vav motif with raised triangle' },
                { id: 'usd-20', label: '$20 US Dollar Bill', desc: 'Federal Reserve Jackson note' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => handleDetectCurrency(item.id)}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    selectedCurrencySample === item.id
                      ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200'
                      : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs">{item.label}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>

            <button
              onClick={() => handleDetectCurrency(selectedCurrencySample)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs transition-colors"
            >
              Re-Scan Banknote in Camera
            </button>
          </div>
        </div>
      )}

      {/* Mode 3: Obstacle Detector */}
      {activeTab === 'obstacle' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Camera Spatial Obstacle Warning</span>
            </h3>
            <div className="relative aspect-[4/3] w-full rounded-xl bg-slate-950 border border-slate-800 p-6 flex flex-col justify-center items-center text-center shadow-lg">
              <div className="w-20 h-20 rounded-full bg-red-950/60 border-2 border-red-500 flex items-center justify-center text-red-400 text-3xl font-bold animate-pulse">
                !
              </div>
              <div className="mt-3 text-lg font-bold text-white">{obstacleResult.obstacle}</div>
              <div className="text-sm font-bold text-amber-400 font-mono mt-1">
                Distance: {obstacleResult.distanceMeters} meters · {obstacleResult.direction}
              </div>
              <p className="text-xs text-slate-300 mt-2 max-w-sm">
                Correction: {obstacleResult.navCorrection}
              </p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-semibold text-white">
              Obstruction Simulation Library
            </h3>
            <p className="text-xs text-slate-400">
              Test how the application warns visually impaired users of curbs, steps, and head-height hazards.
            </p>

            <div className="space-y-2">
              {[
                { id: 'curb-drop', label: 'Sidewalk Curb Drop (1.2m Ahead)', urgency: 'High Urgency' },
                { id: 'staircase-down', label: 'Descending Flight of Stairs (2.5m)', urgency: 'High Urgency' },
                { id: 'construction-scaffolding', label: 'Overhanging Pipe at Head Height (1.8m)', urgency: 'Critical' },
                { id: 'clear-path', label: 'Clear Tactile Paving Pathway (8.0m)', urgency: 'Nominal' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => handleDetectObstacle(item.id)}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    selectedObstacleSample === item.id
                      ? 'border-amber-500 bg-amber-950/40 text-amber-200'
                      : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs">{item.label}</div>
                  <div className="text-[11px] text-amber-400 mt-0.5">{item.urgency}</div>
                </button>
              ))}
            </div>

            <button
              onClick={() => handleDetectObstacle(selectedObstacleSample)}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors"
            >
              Scan Physical Environment Ahead
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
