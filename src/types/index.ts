export type AccessibilityProfile = 'universal' | 'deaf' | 'blind' | 'mute' | 'deaf-blind';

export type VisualTheme = 
  | 'deaf-calm'               // Muted calming teal/slate to prevent ocular irritation
  | 'high-contrast-yellow'    // Yellow on Black (#facc15 on #000)
  | 'high-contrast-cyan'      // Cyan on Black (#22d3ee on #000)
  | 'day'                     // Soft high-readability daylight
  | 'night'                   // Deep dark slate
  | 'reading';                // Sepia paper with wide dyslexia spacing

export type ActiveTab = 
  | 'dashboard'
  | 'navigation'
  | 'vr-sensory'
  | 'sign-video'
  | 'scanner'
  | 'transit'
  | 'wearables'
  | 'search';

export interface HearingAidDevice {
  id: string;
  name: string;
  model: string;
  connected: boolean;
  batteryLevel: number;
  currentProfile: 'speech-clarity' | 'noise-suppression' | 'telecoil-loop' | 'outdoor-wind';
  leftGainDb: number;
  rightGainDb: number;
  noiseReductionDb: number;
}

export interface SmartWearable {
  id: string;
  name: string;
  type: 'cane' | 'haptic-belt' | 'smartwatch';
  connected: boolean;
  batteryLevel: number;
  statusText: string;
  lastHapticTestTime?: string;
}

export interface TransitPass {
  id: string;
  passNumber: string;
  holderName: string;
  concessionType: string;
  discountPercentage: number;
  expiryDate: string;
  qrCodeData: string;
  networkValidity: string;
  balanceInr: number;
}

export interface ScannedDocumentResult {
  title: string;
  docType: string;
  isSensitive: boolean;
  sensitivityReason?: string;
  extractedText: string;
  summary: string;
  signGloss: string[];
}

export interface DetectedCurrency {
  denomination: string;
  currency: string;
  value: number;
  confidence: number;
  tactileVibrations: number[];
  voiceAnnouncement: string;
}

export interface DetectedObstacle {
  obstacle: string;
  distanceMeters: number;
  direction: string;
  urgency: 'low' | 'medium' | 'high';
  tactilePattern: number[];
  voiceAlert: string;
  navCorrection: string;
}

export interface NavigationWaypoint {
  id: string;
  title: string;
  distanceMeters: number;
  instruction: string;
  voicePrompt: string;
  tactileCode: 'turn-left' | 'turn-right' | 'straight' | 'ramp' | 'caution';
  audioSignalType: 'chirp' | 'steady' | 'rapid' | 'bell';
  elevationChangeMeters: number;
  hasTactilePaving: boolean;
  hasAudibleCrosswalk: boolean;
}

export interface SocialAccessibilityAlert {
  id: string;
  type: 'elevator' | 'construction' | 'tactile-paving' | 'audible-beacon' | 'volunteer-assist';
  location: string;
  description: string;
  status: 'active' | 'resolved' | 'investigating';
  timestamp: string;
  verifiedByVolunteers: number;
}
