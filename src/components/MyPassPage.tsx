import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Ticket,
  Calendar,
  Users,
  MapPin,
  CheckCircle2,
  Printer,
  Copy,
  Check,
  Building,
  Coins,
  ShieldAlert,
  ArrowLeft,
  Sparkles,
  ArrowRight,
  Compass,
  Search
} from 'lucide-react';
import { Booking, Attraction, Hotel } from '../types';
import { SafeImage } from './SafeImage';
import { TunisiaEmblem } from './TunisiaLogo';
import { getStoredBookings } from '../services/storage';
import { formatEnglishDate, formatEnglishDateRange } from '../utils/dateUtils';

interface MyPassPageProps {
  booking: Booking | null;
  attractions: Attraction[];
  hotels: Hotel[];
  onBackToPlanner: () => void;
  onSelectAnotherPass: (passId: string) => void;
}

export const MyPassPage: React.FC<MyPassPageProps> = ({
  booking,
  attractions,
  hotels,
  onBackToPlanner,
  onSelectAnotherPass,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [manualLookupInput, setManualLookupInput] = useState('');
  const allStored = getStoredBookings();

  // Create lookup maps
  const attractionsMap = React.useMemo(() => {
    const map = new Map<number, Attraction>();
    attractions.forEach((a) => map.set(a.id, a));
    return map;
  }, [attractions]);

  const hotelsMap = React.useMemo(() => {
    const map = new Map<number, Hotel>();
    hotels.forEach((h) => map.set(h.id, h));
    return map;
  }, [hotels]);

  const selectedHotel = booking?.selected_hotel_id
    ? hotelsMap.get(booking.selected_hotel_id) || null
    : null;

  // Requirement 4: Fix QR code so it encodes the actual current live URL dynamically
  const passUrl = React.useMemo(() => {
    if (!booking?.pass_id) return '';
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://passtunisia.app';
    return `${origin}/pass/${booking.pass_id}`;
  }, [booking?.pass_id]);

  useEffect(() => {
    if (passUrl) {
      QRCode.toDataURL(passUrl, {
        width: 280,
        margin: 2,
        color: {
          dark: '#0c353f',
          light: '#ffffff',
        },
      })
        .then((url) => {
          setQrDataUrl(url);
        })
        .catch((err) => {
          console.error('Failed to generate QR code:', err);
        });
    }
  }, [passUrl]);

  const handleCopyLink = () => {
    if (!passUrl) return;
    navigator.clipboard.writeText(passUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  // Requirement 1: If user visits My Pass before booking, NEVER show a sample pass or placeholder pass!
  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-8">
        <div className="w-16 h-16 rounded-3xl bg-[#fdf5f0] border border-[#c25934]/20 text-[#c25934] flex items-center justify-center mx-auto shadow-sm">
          <Ticket className="w-8 h-8" />
        </div>

        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#c25934] bg-[#fdf5f0] px-3 py-1 rounded-full border border-[#c25934]/15">
            Pass Not Yet Issued
          </span>
          <h2 className="text-3xl font-black text-[#1f1d1a] tracking-tight">
            No Travel Pass Generated Yet
          </h2>
          <p className="text-sm text-[#73685e] max-w-lg mx-auto leading-relaxed">
            Your official PassTunisia travel pass and dynamic verification QR code are generated after you plan your itinerary, customize your stops, and confirm your booking.
          </p>
        </div>

        {/* 3 Step Guide */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-2">
          <div className="bg-white p-4 rounded-2xl border border-[#e8dfd5] shadow-xs space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-[#c25934] text-white text-xs font-bold flex items-center justify-center">
              1
            </div>
            <div className="font-bold text-xs text-[#1e1c1a]">Plan Trip</div>
            <div className="text-[11px] text-[#786e64]">Enter dates, base city, and interests in the Trip Planner.</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#e8dfd5] shadow-xs space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-[#124e5b] text-white text-xs font-bold flex items-center justify-center">
              2
            </div>
            <div className="font-bold text-xs text-[#1e1c1a]">Select Stops</div>
            <div className="text-[11px] text-[#786e64]">Review AI recommendations and tailor your attractions.</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#e8dfd5] shadow-xs space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">
              3
            </div>
            <div className="font-bold text-xs text-[#1e1c1a]">Get Pass</div>
            <div className="text-[11px] text-[#786e64]">Confirm with your name & email to receive your pass with QR code.</div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={onBackToPlanner}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#c25934] hover:bg-[#b04a27] text-white font-bold text-sm rounded-2xl shadow-lg shadow-[#c25934]/25 hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>Start AI Trip Planner</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        {/* Existing Passes lookup (if user previously booked a pass in this browser or has an ID) */}
        {allStored.length > 0 && (
          <div className="pt-8 border-t border-[#ede5da] text-left space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#82776c]">
              Your Confirmed Passes in this Browser:
            </h4>
            <div className="space-y-2">
              {allStored.map((b) => (
                <button
                  key={b.pass_id}
                  onClick={() => onSelectAnotherPass(b.pass_id)}
                  className="w-full text-left p-3.5 rounded-2xl bg-white border border-[#e6ded3] hover:border-[#c25934] flex items-center justify-between text-xs cursor-pointer transition-colors shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#124e5b]/10 text-[#124e5b] flex items-center justify-center font-bold">
                      <Ticket className="w-4 h-4 text-[#124e5b]" />
                    </div>
                    <div>
                      <div className="font-mono font-bold text-[#124e5b]">
                        {b.pass_id}
                      </div>
                      <div className="text-[#3b352f] text-[11px]">
                        {b.traveler_name} • {b.selected_attraction_ids.length} attractions
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-semibold text-[#80766b] block">
                      {formatEnglishDateRange(b.trip_dates.start, b.trip_dates.end)}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
                      Confirmed
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Direct lookup by ID */}
        <div className="pt-4 border-t border-[#ede5da]">
          <details className="text-xs text-[#7e746a] group">
            <summary className="cursor-pointer font-bold hover:text-[#c25934] flex items-center justify-center gap-1">
              <Search className="w-3.5 h-3.5" />
              <span>Looking up an existing Pass ID? Click here</span>
            </summary>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (manualLookupInput.trim()) {
                  onSelectAnotherPass(manualLookupInput.trim());
                }
              }}
              className="flex gap-2 max-w-sm mx-auto mt-3"
            >
              <input
                type="text"
                value={manualLookupInput}
                onChange={(e) => setManualLookupInput(e.target.value)}
                placeholder="Enter Pass ID"
                className="flex-1 px-3.5 py-2 bg-white border border-[#d8cec2] rounded-xl font-mono uppercase text-xs"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#124e5b] text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Find
              </button>
            </form>
          </details>
        </div>
      </div>
    );
  }

  // Active confirmed booking view
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Banner Actions (Hidden in Print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBackToPlanner}
          className="self-start inline-flex items-center gap-1.5 text-xs font-bold text-[#635a51] hover:text-[#c25934] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Plan Another Trip</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#dcd2c6] hover:bg-stone-50 rounded-xl text-xs font-bold text-[#453f38] shadow-xs transition-colors cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#124e5b]" />
                <span>Copy Pass Link</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#124e5b] hover:bg-[#0a353f] text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Pass</span>
          </button>
        </div>
      </div>

      {/* Official Travel Pass Boarding Card */}
      <div className="bg-white rounded-3xl border border-[#ded5c8] shadow-2xl overflow-hidden relative">
        {/* Pass Top Branding Bar */}
        <div className="bg-gradient-to-r from-[#c25934] via-[#b64f2b] to-[#124e5b] text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <TunisiaEmblem sizeClass="w-5 h-5" />
              <span className="text-xs font-black tracking-widest uppercase bg-white/20 px-2 py-0.5 rounded">
                Official Digital Voucher
              </span>
              <span className="text-xs font-bold text-amber-200">
                PassTunisia
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Tunisia Explorer Pass
            </h1>
            <p className="text-xs text-white/80 font-mono">
              Issued for: {booking.traveler_name} • {booking.traveler_email}
            </p>
          </div>

          <div className="text-left sm:text-right bg-black/20 p-3 rounded-2xl border border-white/10 shrink-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-200">
              Pass ID Reference
            </div>
            <div className="text-xl sm:text-2xl font-mono font-black tracking-wider text-white">
              {booking.pass_id}
            </div>
          </div>
        </div>

        {/* Status & Validity Strip */}
        <div className="bg-[#faf7f2] border-b border-[#ece3d8] px-6 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#5c544a]">Status:</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px] shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{booking.status || 'Confirmed (Prototype)'}</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-[#695f54] font-medium">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#124e5b]" />
              Dates: <strong>{formatEnglishDate(booking.trip_dates.start, { formatStyle: 'short' })}</strong> to <strong>{formatEnglishDate(booking.trip_dates.end, { formatStyle: 'short' })}</strong>
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#124e5b]" />
              <strong>{booking.number_of_people}</strong> {booking.number_of_people === 1 ? 'Person' : 'People'}
            </span>
          </div>
        </div>

        {/* Pass Content Grid: Left details, Right QR */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Details: Sites & Lodging (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Selected Sites */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-wider text-[#1e1c1a] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#124e5b] text-white text-[11px] flex items-center justify-center font-bold">
                    ★
                  </span>
                  <span>Included Attractions & Sites ({booking.selected_attraction_ids.length})</span>
                </h3>
              </div>

              <div className="space-y-2.5">
                {booking.selected_attraction_ids.map((attractionId) => {
                  const att = attractionsMap.get(attractionId);
                  if (!att) return null;
                  return (
                    <div
                      key={att.id}
                      className="p-3 rounded-2xl bg-[#faf7f2] border border-[#ede5db] flex items-center gap-3.5"
                    >
                      <div className="w-16 h-14 rounded-xl overflow-hidden bg-stone-200 shrink-0">
                        <SafeImage
                          src={att.image_url}
                          fallbackSrc={att.fallback_image_url}
                          alt={att.name}
                          category={att.category}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-xs sm:text-sm text-[#1e1c1a] truncate">
                            {att.name}
                          </h4>
                          <span className="text-[11px] font-bold text-[#c25934] shrink-0">
                            {att.price_dt === 0 ? 'Free' : `${att.price_dt} DT`}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-[#73685e] mt-0.5">
                          <span className="flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 text-[#c25934]" />
                            {att.location}
                          </span>
                          <span>•</span>
                          <span className="font-medium text-[#124e5b]">{att.region}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Hotel */}
            {selectedHotel && (
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-black uppercase tracking-wider text-[#1e1c1a] flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#124e5b]" />
                  <span>Reserved Lodging Base</span>
                </h3>
                <div className="p-3.5 rounded-2xl bg-[#faf7f2] border border-[#ede5db] flex items-center gap-3.5">
                  <div className="w-16 h-14 rounded-xl overflow-hidden bg-stone-200 shrink-0">
                    <SafeImage
                      src={selectedHotel.image_url}
                      fallbackSrc={selectedHotel.fallback_image_url}
                      alt={selectedHotel.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs sm:text-sm text-[#1e1c1a] truncate">
                        {selectedHotel.name}
                      </h4>
                      <span className="text-[11px] font-bold text-[#124e5b]">
                        {selectedHotel.price_per_night_dt} DT / night
                      </span>
                    </div>
                    <div className="text-[11px] text-[#756a60] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#c25934]" />
                      <span>{selectedHotel.location} ({selectedHotel.region})</span>
                      {selectedHotel.has_eclipse_view && (
                        <span className="ml-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                          Eclipse Terrace
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cost Summary Box */}
            <div className="bg-[#f5eee3] rounded-2xl p-4 border border-[#e5dcd0] flex items-center justify-between text-xs">
              <span className="font-bold text-[#5c5348]">
                Pass Grand Total:
              </span>
              <span className="text-lg font-black text-[#c25934]">
                {booking.total_cost_dt} DT
              </span>
            </div>
          </div>

          {/* Right Column: Dynamic Live QR Code & Verification (5 cols) */}
          <div className="lg:col-span-5 bg-[#faf7f2] rounded-3xl p-6 border border-[#ece3d8] flex flex-col items-center text-center space-y-4">
            <div className="space-y-1">
              <div className="text-[11px] font-mono font-bold text-[#124e5b] uppercase tracking-wider">
                Digital Pass Verification
              </div>
              <h3 className="font-extrabold text-sm text-[#1e1c1a]">
                Scan to Validate Pass
              </h3>
            </div>

            {/* QR Code Container */}
            <div className="bg-white p-3.5 rounded-2xl shadow-md border border-[#e5ded4]">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR Code for pass ${booking.pass_id}`}
                  className="w-48 h-48 sm:w-56 sm:h-56 mx-auto object-contain"
                />
              ) : (
                <div className="w-48 h-48 sm:w-56 sm:h-56 bg-stone-100 rounded-xl flex items-center justify-center text-xs text-stone-400">
                  Generating QR...
                </div>
              )}
            </div>

            {/* Live encoded URL display */}
            <div className="w-full space-y-2">
              <div className="text-[11px] font-mono text-[#786e64] bg-white px-2.5 py-1.5 rounded-lg border border-[#e2d8cb] truncate max-w-full">
                {passUrl}
              </div>

              {/* Requirement: Prominent Prototype Label */}
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-bold space-y-1 text-center">
                <div className="flex items-center justify-center gap-1 text-[#c25934]">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Prototype pass — not a valid government ticket.</span>
                </div>
                <div className="text-[10px] text-amber-800 font-normal">
                  Issued upon confirmed trip booking for demonstration purposes.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pass Bottom Perforated Edge Decoration */}
        <div className="border-t-2 border-dashed border-[#ddd3c6] p-4 bg-[#fcf9f5] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#857a70] gap-2">
          <span>Pass ID: <strong className="font-mono">{booking.pass_id}</strong> • Created {formatEnglishDate(booking.created_at, { formatStyle: 'medium' })}</span>
          <span>PassTunisia Tourism Initiative • Autonomous Trip Pass</span>
        </div>
      </div>
    </div>
  );
};
