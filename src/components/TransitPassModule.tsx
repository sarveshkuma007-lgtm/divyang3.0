import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { TransitPass } from '../types';
import { 
  CreditCard, CheckCircle2, QrCode, WifiOff, Download, 
  Smartphone, ShieldCheck, Tag, ArrowRight, RefreshCw, Zap
} from 'lucide-react';

export const TransitPassModule: React.FC = () => {
  const { speak, triggerHaptic } = useAccessibility();

  const [activePass, setActivePass] = useState<TransitPass>({
    id: 'pass-div-0994',
    passNumber: 'DIV-METRO-0994-2026',
    holderName: 'Aarav Sharma (UDID #DL01201994)',
    concessionType: 'Divyang Universal Concession Pass',
    discountPercentage: 75,
    expiryDate: '31 Dec 2026',
    qrCodeData: 'DIVYANG-PASS-AUTH-HASH-99882211',
    networkValidity: 'All Metro, Suburban Rail & Municipal Bus Lines',
    balanceInr: 450,
  });

  const [isNfcTapping, setIsNfcTapping] = useState<boolean>(false);
  const [purchaseSuccessBanner, setPurchaseSuccessBanner] = useState<string | null>(null);

  const handleSimulateNfcTap = () => {
    setIsNfcTapping(true);
    triggerHaptic('turn-left');

    setTimeout(() => {
      setIsNfcTapping(false);
      triggerHaptic([150, 80, 200]);
      speak('Contactless Divyang NFC Tap Successful! Gate open. Fare debited: 5 Rupees. Balance remaining: 445 Rupees.');
      setActivePass(prev => ({ ...prev, balanceInr: Math.max(0, prev.balanceInr - 5) }));
    }, 1200);
  };

  const handleTopUpPass = (amount: number) => {
    const discountedPrice = Math.round(amount * 0.25); // 75% concession!
    setActivePass(prev => ({ ...prev, balanceInr: prev.balanceInr + amount }));
    triggerHaptic('tap');
    setPurchaseSuccessBanner(
      `Pass Recharged with ₹${amount}! You paid only ₹${discountedPrice} (75% Divyang Subsidy Applied).`
    );
    speak(
      `Recharge successful. Added ${amount} Rupees. You paid only ${discountedPrice} Rupees with 75% Divyang government subsidy.`
    );

    setTimeout(() => {
      setPurchaseSuccessBanner(null);
    }, 6000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 tracking-wider uppercase mb-1">
            <span>Direct Accessible Fare &amp; Mobility Payments</span>
            <span aria-hidden="true">·</span>
            <span>75% Government Subsidy</span>
            <span aria-hidden="true">·</span>
            <span>Offline QR Pass</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Accessible Transit Passes &amp; Direct Payments
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Purchase transit passes online and offline with certified Divyang concessions, tactile verification, and contactless gate tap.
          </p>
        </div>

        {/* Offline Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Offline Cryptographic Proof Ready</span>
        </div>
      </div>

      {purchaseSuccessBanner && (
        <div className="p-4 bg-emerald-950 border border-emerald-600 rounded-xl text-emerald-200 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{purchaseSuccessBanner}</span>
        </div>
      )}

      {/* Main Grid: Digital Pass Display & Purchase Options */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Digital Smart Card & Contactless NFC Simulator (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-2xl relative border border-slate-800 bg-slate-950">
            {/* High-Fidelity Generated Transit Pass Card Image */}
            <img
              src="/src/assets/images/transit_pass_card_1792685151497.jpg"
              alt="Universal Divyang Mobility Transit Card with Braille Dots"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />

            {/* Overlaid Live Balance */}
            <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-teal-500/50 text-right">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Wallet Balance</div>
              <div className="text-lg font-bold text-teal-300 font-mono tabular-nums">
                ₹{activePass.balanceInr}.00
              </div>
            </div>

            {/* Overlaid Card Info Bottom */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/85 backdrop-blur-md p-3 rounded-xl border border-slate-700/80 text-xs flex items-center justify-between text-slate-200">
              <div>
                <div className="font-bold text-white">{activePass.passNumber}</div>
                <div className="text-[11px] text-slate-400">{activePass.networkValidity}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-mono">
                  75% SUBSIDY
                </span>
              </div>
            </div>
          </div>

          {/* Contactless NFC Tap Simulator */}
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-teal-400" />
                <span>Contactless Subway &amp; Bus Gate Reader</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">NFC / RFID Sim</span>
            </div>

            <p className="text-xs text-slate-400">
              Hold device against the reader at fare gates. Uses tactile vibration confirmation to let you know the turnstile is open.
            </p>

            <button
              onClick={handleSimulateNfcTap}
              disabled={isNfcTapping}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                isNfcTapping
                  ? 'bg-amber-500 text-slate-950 animate-pulse'
                  : 'bg-teal-600 hover:bg-teal-500 text-slate-950 shadow-md'
              }`}
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{isNfcTapping ? 'Communicating with Fare Gate...' : 'Simulate NFC Contactless Tap at Gate'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Direct Purchase, Offline Pass & Concession Top-Up (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Direct Concession Pass Purchase / Top-Up */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>Direct Purchase &amp; Divyang Concession Top-Up</span>
              </h3>
              <span className="text-xs text-emerald-400 font-mono">Instant Recharge</span>
            </div>

            <p className="text-xs text-slate-400">
              Government subsidized fare: You only pay 25% of standard commuter price. Direct payment via UPI, RuPay Accessible Card, or offline token.
            </p>

            <div className="grid grid-cols-3 gap-3">
              {[
                { add: 200, pay: 50, label: 'Standard Pass' },
                { add: 500, pay: 125, label: 'Monthly Pass' },
                { add: 1000, pay: 250, label: 'Quarterly Network' },
              ].map((tier, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTopUpPass(tier.add)}
                  className="p-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-emerald-700 rounded-xl text-left transition-all"
                >
                  <div className="text-xs font-semibold text-slate-300">{tier.label}</div>
                  <div className="text-base font-bold text-white font-mono mt-1">₹{tier.add}</div>
                  <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
                    Pay only ₹{tier.pay}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Offline QR Transit Pass */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <QrCode className="w-4 h-4 text-teal-400" />
                <span>Offline Encrypted Barcode Pass</span>
              </h3>
              <span className="text-xs text-teal-400">Works without Internet</span>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-4">
              {/* Simulated QR Pattern */}
              <div className="w-24 h-24 bg-white p-2 rounded-lg shrink-0 flex items-center justify-center">
                <div className="grid grid-cols-4 gap-1 w-full h-full">
                  <div className="bg-black rounded-xs"></div>
                  <div className="bg-black rounded-xs"></div>
                  <div className="bg-black rounded-xs"></div>
                  <div className="bg-transparent"></div>
                  <div className="bg-black rounded-xs"></div>
                  <div className="bg-transparent"></div>
                  <div className="bg-black rounded-xs"></div>
                  <div className="bg-black rounded-xs"></div>
                  <div className="bg-transparent"></div>
                  <div className="bg-black rounded-xs"></div>
                  <div className="bg-transparent"></div>
                  <div className="bg-black rounded-xs"></div>
                  <div className="bg-black rounded-xs"></div>
                  <div className="bg-black rounded-xs"></div>
                  <div className="bg-black rounded-xs"></div>
                  <div className="bg-black rounded-xs"></div>
                </div>
              </div>

              <div className="text-xs space-y-1">
                <div className="font-bold text-white">Dynamic Cryptographic Transit Token</div>
                <p className="text-slate-400">
                  Scanned directly at metro optical barriers or by bus conductor ticket machines.
                </p>
                <div className="text-[11px] font-mono text-emerald-400 pt-1">
                  Valid until: {activePass.expiryDate}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                triggerHaptic('tap');
                speak('Offline transit pass saved to local secure cache.');
              }}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-teal-400" />
              <span>Download Offline Mobility Pass</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
