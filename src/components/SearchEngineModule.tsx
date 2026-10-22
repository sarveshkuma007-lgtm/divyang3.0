import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { Search, MapPin, Phone, ExternalLink, Filter, Sparkles, Building, BookOpen, Volume2 } from 'lucide-react';

interface DivyangResource {
  id: string;
  category: 'metro' | 'interpreter' | 'braille' | 'clinic' | 'welfare';
  title: string;
  location: string;
  contact: string;
  features: string[];
  description: string;
}

export const SearchEngineModule: React.FC = () => {
  const { speak, triggerHaptic } = useAccessibility();
  const [query, setQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const resources: DivyangResource[] = [
    {
      id: 'res-1',
      category: 'metro',
      title: 'Central Metro Station (Accessible Hub)',
      location: 'Connaught Place Junction, Gate 2 & 4',
      contact: '+91 11 2341 7910',
      features: ['Dual Step-Free Elevators', 'Full Tactile Blister Paving', 'Audible Chirp Crossings', 'Wheelchair Ramp'],
      description: 'Fully certified barrier-free transit hub with dedicated Divyang assistance desk and tactile directional tiles leading directly to Platform 1.',
    },
    {
      id: 'res-2',
      category: 'interpreter',
      title: 'National Sign Language Interpretation Center (ISL/ASL)',
      location: 'National Institute for Hearing Handicapped, New Delhi',
      contact: '1800-11-7446 (Toll-Free Video)',
      features: ['24/7 On-Demand Video Call', 'Court & Legal Certification', 'Medical Interpreter Booking', 'Emergency Relay'],
      description: 'Certified deaf interpreters available for instant three-way video calling, hospital appointments, and official government paperwork.',
    },
    {
      id: 'res-3',
      category: 'braille',
      title: 'National Braille Library & Audio Book Repository',
      location: '4th Avenue Cultural Complex, Sector 9',
      contact: '+91 11 2685 4120',
      features: ['Free Tactile Embossing', 'Screen Reader Audio Booths', 'Digital Refreshable Braille Files', 'Postal Delivery'],
      description: 'Over 25,000 digitized talking books, tactile graphics maps, and free embossed printing services for blind students and researchers.',
    },
    {
      id: 'res-4',
      category: 'clinic',
      title: 'AIIMS Comprehensive Sensory & Audiology Wing',
      location: 'Ansari Nagar, New Delhi',
      contact: '+91 11 2658 8500',
      features: ['Free Hearing Aid Calibration', 'Cochlear Implant Tuning', 'Low-Vision Telescopic Prescription', 'UDID Assessment'],
      description: 'Government medical center offering free audiometry, hearing aid synchronization, low-vision orientation mobility training, and UDID certifications.',
    },
    {
      id: 'res-5',
      category: 'welfare',
      title: 'Central Divyang Pension & Assistive Device Scheme (ADIP)',
      location: 'Ministry of Social Justice & Empowerment',
      contact: 'disabilityaffairs.gov.in',
      features: ['75% Public Transit Concession', 'Free Motorized Tricycles / Canes', 'Monthly Disability Pension', 'Inclusive Education Grant'],
      description: 'Official national welfare scheme providing subsidized mobility equipment, financial pensions, and universal travel passes across all Indian states.',
    },
    {
      id: 'res-6',
      category: 'metro',
      title: 'Airport Express Metro Terminal',
      location: 'Terminal 3 Concourse',
      contact: '+91 11 2567 5126',
      features: ['Zero-Gap Train Boarding', 'Audio Beacons in 4 Languages', 'Braille Signage Directory', 'Tactile Paving to Gates'],
      description: 'Direct step-free transit connection to domestic and international terminals with level train boarding platforms for wheelchairs and cane commuters.',
    },
  ];

  const filtered = resources.filter(res => {
    const matchesCategory = selectedCategory === 'all' || res.category === selectedCategory;
    const matchesQuery = 
      res.title.toLowerCase().includes(query.toLowerCase()) ||
      res.description.toLowerCase().includes(query.toLowerCase()) ||
      res.location.toLowerCase().includes(query.toLowerCase()) ||
      res.features.some(f => f.toLowerCase().includes(query.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const handleReadResource = (res: DivyangResource) => {
    triggerHaptic('tap');
    speak(`${res.title}. Located at ${res.location}. ${res.description} Features include: ${res.features.join(', ')}.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 tracking-wider uppercase mb-1">
            <span>Universal Information Retrieval Engine</span>
            <span aria-hidden="true">·</span>
            <span>Verified Accessibility Data</span>
            <span aria-hidden="true">·</span>
            <span>Voice Search</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Divyang Accessibility Search Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Find step-free transit hubs, certified sign language interpreters, Braille libraries, and government disability welfare schemes.
          </p>
        </div>
      </div>

      {/* Search Bar & Filter Tabs */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for accessible metro, sign interpreter, Braille library, wheelchair ramps..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-teal-400 focus:border-teal-400 placeholder:text-slate-500 shadow-md"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All Resources' },
            { id: 'metro', label: 'Accessible Metros' },
            { id: 'interpreter', label: 'Sign Interpreters' },
            { id: 'braille', label: 'Braille & Audio' },
            { id: 'clinic', label: 'Sensory Clinics' },
            { id: 'welfare', label: 'Govt Schemes' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                triggerHaptic('tap');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-teal-600 text-slate-950 font-semibold'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Found {filtered.length} verified accessibility points</span>
          <span className="font-mono">Updated today</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(res => (
            <div
              key={res.id}
              className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between hover:border-slate-700 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-bold text-white">{res.title}</h3>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-950 text-teal-300 border border-slate-800 shrink-0">
                    {res.category}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>{res.location}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {res.description}
                </p>

                {/* Features list */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {res.features.map((f, i) => (
                    <span key={i} className="text-[11px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800/80">
                      ✓ {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-mono text-teal-400">{res.contact}</span>
                <button
                  onClick={() => handleReadResource(res)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white rounded transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>Read Aloud</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
