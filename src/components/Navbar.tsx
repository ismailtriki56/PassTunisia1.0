import React, { useState } from 'react';
import { Compass, Sparkles, Ticket, MapPin, Menu, X, SunMedium, Info } from 'lucide-react';
import { TunisiaLogo } from './TunisiaLogo';

interface NavbarProps {
  activeTab: 'home' | 'planner' | 'itinerary' | 'pass' | 'eclipse';
  setActiveTab: (tab: 'home' | 'planner' | 'itinerary' | 'pass' | 'eclipse') => void;
  hasItinerary: boolean;
  activePassId?: string | null;
  onOpenHowItWorks?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  hasItinerary,
  activePassId,
  onOpenHowItWorks
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#faf7f2]/95 backdrop-blur-md border-b border-[#e7dfd5] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo with Tunisian Flag Crescent & Star */}
          <div
            onClick={() => setActiveTab('home')}
            className="cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActiveTab('home');
              }
            }}
          >
            <TunisiaLogo size="md" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-[#c25934] text-white shadow-sm shadow-[#c25934]/30'
                  : 'text-[#4a443d] hover:text-[#c25934] hover:bg-[#ebdcca]/40'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => setActiveTab('planner')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'planner'
                  ? 'bg-[#c25934] text-white shadow-sm shadow-[#c25934]/30'
                  : 'text-[#4a443d] hover:text-[#c25934] hover:bg-[#ebdcca]/40'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#e07a5f]" />
              Trip Planner
            </button>

            <button
              onClick={() => {
                if (hasItinerary) setActiveTab('itinerary');
              }}
              disabled={!hasItinerary}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'itinerary'
                  ? 'bg-[#c25934] text-white shadow-sm shadow-[#c25934]/30'
                  : hasItinerary
                  ? 'text-[#4a443d] hover:text-[#c25934] hover:bg-[#ebdcca]/40 cursor-pointer'
                  : 'text-[#9c9388] cursor-not-allowed opacity-50'
              }`}
              title={hasItinerary ? 'View generated itinerary' : 'Generate an itinerary in Trip Planner first'}
            >
              <MapPin className="w-4 h-4" />
              Itinerary Results
              {hasItinerary && (
                <span className="w-2 h-2 rounded-full bg-[#124e5b] inline-block animate-ping" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('pass')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'pass'
                  ? 'bg-[#124e5b] text-white shadow-sm shadow-[#124e5b]/30'
                  : 'text-[#4a443d] hover:text-[#124e5b] hover:bg-[#ebf5f7]'
              }`}
            >
              <Ticket className="w-4 h-4 text-[#c25934]" />
              My Pass
              {activePassId && (
                <span className="text-[11px] font-mono font-bold bg-[#c25934] text-white px-1.5 py-0.5 rounded">
                  {activePassId.slice(-4)}
                </span>
              )}
            </button>
          </nav>

          {/* Right Header Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {onOpenHowItWorks && (
              <button
                onClick={onOpenHowItWorks}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e4dbd0] hover:border-[#c25934] text-[#4a443d] hover:text-[#c25934] rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Info className="w-3.5 h-3.5 text-[#124e5b]" />
                <span>How It Works</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('eclipse')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'eclipse'
                  ? 'bg-gradient-to-r from-slate-950 to-indigo-950 text-amber-300 ring-2 ring-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-gradient-to-r from-[#124e5b] to-[#1c6a7b] hover:from-slate-900 hover:to-indigo-950 text-white shadow-xs hover:shadow'
              }`}
            >
              <SunMedium className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '12s' }} />
              <span>Eclipse 2027</span>
              <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-sm uppercase tracking-wider">
                Special
              </span>
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            {onOpenHowItWorks && (
              <button
                onClick={onOpenHowItWorks}
                className="p-2 text-[#4a443d] hover:text-[#c25934] rounded-lg bg-white border border-[#e4dbd0] text-xs font-bold"
              >
                <Info className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#4a443d] hover:text-[#c25934] rounded-lg bg-white border border-[#e4dbd0]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#e7dfd5] bg-[#faf7f2] px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <button
            onClick={() => {
              setActiveTab('home');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
              activeTab === 'home' ? 'bg-[#c25934] text-white' : 'text-[#4a443d]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => {
              setActiveTab('planner');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between ${
              activeTab === 'planner' ? 'bg-[#c25934] text-white' : 'text-[#4a443d]'
            }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#e07a5f]" />
              Trip Planner
            </span>
            <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md">
              AI Powered
            </span>
          </button>
          <button
            onClick={() => {
              setActiveTab('eclipse');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between ${
              activeTab === 'eclipse'
                ? 'bg-slate-950 text-amber-300 ring-1 ring-amber-400'
                : 'text-[#4a443d] bg-amber-500/10'
            }`}
          >
            <span className="flex items-center gap-2">
              <SunMedium className="w-4 h-4 text-amber-500" />
              <span>August 2027 Eclipse Expedition</span>
            </span>
            <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded uppercase">
              Totality
            </span>
          </button>
          <button
            onClick={() => {
              if (hasItinerary) {
                setActiveTab('itinerary');
                setMobileMenuOpen(false);
              }
            }}
            disabled={!hasItinerary}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between ${
              activeTab === 'itinerary'
                ? 'bg-[#c25934] text-white'
                : hasItinerary
                ? 'text-[#4a443d]'
                : 'text-[#9c9388] opacity-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Itinerary Results
            </span>
            {hasItinerary && (
              <span className="text-xs bg-[#124e5b] text-white font-bold px-2 py-0.5 rounded-md">
                Ready
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab('pass');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between ${
              activeTab === 'pass' ? 'bg-[#124e5b] text-white' : 'text-[#4a443d]'
            }`}
          >
            <span className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-[#c25934]" />
              My Pass
            </span>
            {activePassId && (
              <span className="text-xs font-mono bg-white/20 px-2 py-0.5 rounded">
                {activePassId}
              </span>
            )}
          </button>

          {onOpenHowItWorks && (
            <div className="pt-2 border-t border-[#e7dfd5]">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenHowItWorks();
                }}
                className="w-full text-left px-4 py-2 text-xs font-bold text-[#124e5b] flex items-center gap-2"
              >
                <Info className="w-4 h-4" />
                <span>How It Works & Pass Example</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
