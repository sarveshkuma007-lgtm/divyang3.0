import React from 'react';
import { ActiveTab } from '../types';
import { useAccessibility } from '../context/AccessibilityContext';
import { AlertCircle, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { setIsSosOpen, setIsAiChatOpen, speak, triggerHaptic } = useAccessibility();

  const handleNavClick = (tab: ActiveTab, label: string) => {
    setActiveTab(tab);
    triggerHaptic('tap');
    speak(`${label} view active`);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between gap-8">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => handleNavClick('dashboard', 'Universal Dashboard')}
          className="text-lg sm:text-xl font-bold tracking-tight text-white hover:text-teal-300 transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-teal-400 focus-visible:outline-offset-2"
          aria-label="Divyang Drishti home"
        >
          Divyang Drishti
        </button>
      </div>

      {/* Zone 2: 5 clean single-line text navigation links */}
      <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
        <button
          onClick={() => handleNavClick('dashboard', 'Dashboard')}
          className={`whitespace-nowrap transition-colors hover:text-white ${
            activeTab === 'dashboard' ? 'text-teal-300 font-semibold border-b-2 border-teal-400 pb-0.5' : ''
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => handleNavClick('navigation', 'Navigation & Maps')}
          className={`whitespace-nowrap transition-colors hover:text-white ${
            activeTab === 'navigation' ? 'text-teal-300 font-semibold border-b-2 border-teal-400 pb-0.5' : ''
          }`}
        >
          Divyang Maps
        </button>
        <button
          onClick={() => handleNavClick('vr-sensory', 'Close Eyes VR Navigation')}
          className={`whitespace-nowrap transition-colors hover:text-white ${
            activeTab === 'vr-sensory' ? 'text-teal-300 font-semibold border-b-2 border-teal-400 pb-0.5' : ''
          }`}
        >
          VR Sensory
        </button>
        <button
          onClick={() => handleNavClick('sign-video', 'Sign Language & Video')}
          className={`whitespace-nowrap transition-colors hover:text-white ${
            activeTab === 'sign-video' ? 'text-teal-300 font-semibold border-b-2 border-teal-400 pb-0.5' : ''
          }`}
        >
          Sign &amp; Call
        </button>
        <button
          onClick={() => handleNavClick('scanner', 'Document & Money Scanner')}
          className={`whitespace-nowrap transition-colors hover:text-white ${
            activeTab === 'scanner' ? 'text-teal-300 font-semibold border-b-2 border-teal-400 pb-0.5' : ''
          }`}
        >
          Scanner
        </button>
      </nav>

      {/* Zone 3: 1 primary action + Assistive AI Sahayak launcher */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => {
            setIsAiChatOpen(true);
            triggerHaptic('tap');
            speak('Divyang Sahayak assistant opened');
          }}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-teal-200 bg-teal-950/60 border border-teal-700/60 rounded-md hover:bg-teal-900/60 transition-colors whitespace-nowrap"
          aria-label="Open Divyang AI Assistant"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span className="hidden sm:inline">AI Sahayak</span>
        </button>

        <button
          onClick={() => {
            setIsSosOpen(true);
            triggerHaptic('sos');
          }}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors shadow-sm focus-visible:outline-2 focus-visible:outline-red-400 whitespace-nowrap"
          aria-label="Emergency SOS trigger"
        >
          <AlertCircle className="w-4 h-4 text-white" />
          <span>SOS Help</span>
        </button>
      </div>
    </header>
  );
};
