import React, { useState } from 'react';
import { AccessibilityProvider, useAccessibility } from './context/AccessibilityContext';
import { ActiveTab } from './types';
import { Navbar } from './components/Navbar';
import { VoiceCommandBar } from './components/VoiceCommandBar';
import { PersonalizedDashboard } from './components/PersonalizedDashboard';
import { NavigationModule } from './components/NavigationModule';
import { VRSensoryNavigation } from './components/VRSensoryNavigation';
import { SignLanguageVideoModule } from './components/SignLanguageVideoModule';
import { ScannerModule } from './components/ScannerModule';
import { TransitPassModule } from './components/TransitPassModule';
import { WearablesModule } from './components/WearablesModule';
import { SearchEngineModule } from './components/SearchEngineModule';
import { EmergencySOSModal } from './components/EmergencySOSModal';
import { AIChatModal } from './components/AIChatModal';

function AppContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const { lastHapticPulseName, activeScreenReadingText } = useAccessibility();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-teal-500/30 selection:text-teal-200">
      {/* 1. Universal Top Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. Global Hands-Free Voice Command & Haptic Feedback Bar */}
      <VoiceCommandBar onNavigateTab={setActiveTab} />

      {/* 3. Silent Visual Haptic Pulse & Screen Reading Ticker for Deaf Commuters */}
      {lastHapticPulseName && (
        <div className="w-full bg-teal-950/90 border-b border-teal-800 px-4 py-1.5 flex items-center justify-between text-xs text-teal-200 transition-all">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
            <span>Haptic Actuator Pulse: <strong className="text-white">{lastHapticPulseName}</strong></span>
          </div>
          <span className="text-[11px] font-mono text-teal-400">Silent Vibration Sent</span>
        </div>
      )}

      {/* 4. Main Body Content Based on Active Tab */}
      <main className="flex-1 w-full pb-16">
        {activeTab === 'dashboard' && <PersonalizedDashboard setActiveTab={setActiveTab} />}
        {activeTab === 'navigation' && <NavigationModule />}
        {activeTab === 'vr-sensory' && <VRSensoryNavigation />}
        {activeTab === 'sign-video' && <SignLanguageVideoModule />}
        {activeTab === 'scanner' && <ScannerModule />}
        {activeTab === 'transit' && <TransitPassModule />}
        {activeTab === 'wearables' && <WearablesModule />}
        {activeTab === 'search' && <SearchEngineModule />}
      </main>

      {/* 5. Minimal Accessible Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950 py-6 px-4 sm:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Divyang Drishti &amp; Sparsh</span>
            <span aria-hidden="true">·</span>
            <span>Universal Assistive Mobility &amp; Communication Protocol</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>WCAG 2.2 Level AAA</span>
            <span aria-hidden="true">·</span>
            <span>Web Speech &amp; BLE Sync Active</span>
            <span aria-hidden="true">·</span>
            <span>Emergency Relay Ready</span>
          </div>
        </div>
      </footer>

      {/* 6. Global Modals (SOS & AI Chat) */}
      <EmergencySOSModal />
      <AIChatModal />
    </div>
  );
}

export default function App() {
  return (
    <AccessibilityProvider>
      <AppContent />
    </AccessibilityProvider>
  );
}
