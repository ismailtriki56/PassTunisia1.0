import React from 'react';
import { X, Sparkles, MapPin, CheckCircle2, Ticket, QrCode, ShieldAlert, ArrowRight } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartPlanning: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
  onStartPlanning
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#faf7f2] w-full max-w-2xl rounded-3xl border border-[#ded5c8] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#c25934] via-[#b64f2b] to-[#124e5b] text-white p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded">
              Guide & Architecture
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              How PassTunisia Works
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6 text-sm text-[#453f38]">
          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-[#e8dfd4] shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-xl bg-[#c25934] text-white font-black text-sm flex items-center justify-center">
                1
              </div>
              <h4 className="font-bold text-sm text-[#1e1c1a]">Plan Your Trip</h4>
              <p className="text-xs text-[#70665c] leading-relaxed">
                Choose your base city, travel dates, interests (including August 2027 Total Solar Eclipse), and budget.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#e8dfd4] shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-xl bg-[#124e5b] text-white font-black text-sm flex items-center justify-center">
                2
              </div>
              <h4 className="font-bold text-sm text-[#1e1c1a]">Customize Stops</h4>
              <p className="text-xs text-[#70665c] leading-relaxed">
                Gemini AI curates geographically proximate attractions and hotels. Select or exclude individual stops as you wish.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#e8dfd4] shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white font-black text-sm flex items-center justify-center">
                3
              </div>
              <h4 className="font-bold text-sm text-[#1e1c1a]">Receive Digital Pass</h4>
              <p className="text-xs text-[#70665c] leading-relaxed">
                Confirm your booking with your traveler contact to instantly generate your official digital pass with live QR verification.
              </p>
            </div>
          </div>

          {/* Reference Pass Mockup (Clearly Labeled Example) */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#756a5e]">
                Pass Format Reference
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-md border border-amber-200">
                Example (for demonstration only)
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#ded5c8] shadow-xs opacity-90 text-xs space-y-2">
              <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                <div className="font-mono font-bold text-[#124e5b]">
                  EXAMPLE PASS: <span className="text-[#c25934]">TN-EXAMPLE-DEMO</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  Example Pass Specimen
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-[#635a50]">
                <div>• Verified regional attraction entries</div>
                <div>• Suggested hotel voucher info</div>
                <div>• Dynamic QR code pointing to live route</div>
                <div>• Lightweight attendee identity check</div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#ece3d8]">
            <p className="text-xs text-[#786e64]">
              Ready to create your own authentic Tunisian pass?
            </p>
            <button
              onClick={() => {
                onClose();
                onStartPlanning();
              }}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#c25934] hover:bg-[#b04a27] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Start Trip Planner</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
