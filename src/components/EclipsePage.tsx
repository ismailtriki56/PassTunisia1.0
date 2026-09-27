import React, { useState, useEffect } from 'react';
import {
  SunMedium,
  Moon,
  ShieldAlert,
  Sparkles,
  MapPin,
  Check,
  Info,
  Calendar,
  Users,
  Eye,
  AlertTriangle,
  Compass,
  CheckCircle2,
  ChevronRight,
  Timer,
  Flame,
  ArrowRight,
  ShieldCheck,
  Clock,
  Layers,
  Award
} from 'lucide-react';
import { Attraction, Hotel, Booking } from '../types';
import { SafeImage } from './SafeImage';
import { formatEnglishDate } from '../utils/dateUtils';
import { generatePassId } from '../services/storage';

interface EclipsePageProps {
  attractions: Attraction[];
  hotels: Hotel[];
  onBookExpedition: (booking: Booking) => void;
  onGoToPlanner: () => void;
}

export const EclipsePage: React.FC<EclipsePageProps> = ({
  attractions,
  hotels,
  onBookExpedition,
  onGoToPlanner
}) => {
  // Southern Tunisia Totality Attractions ONLY
  const eclipseAttractionIds = [5, 11, 12, 13, 14, 8, 9, 26];
  const totalityAttractions = attractions.filter((a) =>
    eclipseAttractionIds.includes(a.id) || a.category === 'eclipse_viewing'
  );

  // Eclipse Lodging ONLY
  const eclipseHotels = hotels.filter((h) => h.has_eclipse_view || ['Tozeur', 'Kebili', 'Douz', 'Tataouine', 'Gafsa'].includes(h.location));

  // Selected hotel state
  const [selectedHotelId, setSelectedHotelId] = useState<number>(1); // Sahara Eclipse Lodge default
  const [selectedStops, setSelectedStops] = useState<number[]>([5, 11, 13, 14]); // Key totality stops
  const [travelerName, setTravelerName] = useState('');
  const [travelerEmail, setTravelerEmail] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(2);

  // Interactive Safety Checklist
  const [checkedSafetyItems, setCheckedSafetyItems] = useState<Record<string, boolean>>({
    iso_glasses: true,
    optics_filter: true,
    timing_rule: false,
    desert_hydration: false,
    sun_shelter: false
  });

  const toggleSafetyItem = (key: string) => {
    setCheckedSafetyItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Countdown timer to August 2, 2027 09:07:00 UTC (Totality onset in Southern Tunisia)
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 308, hours: 4, minutes: 25, seconds: 30 });

  useEffect(() => {
    const targetDate = new Date('2027-08-02T09:07:00Z').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleStop = (id: number) => {
    if (selectedStops.includes(id)) {
      if (selectedStops.length > 1) {
        setSelectedStops(selectedStops.filter((s) => s !== id));
      }
    } else {
      setSelectedStops([...selectedStops, id]);
    }
  };

  // Cost calculation
  const chosenHotel = hotels.find((h) => h.id === selectedHotelId) || hotels[0];
  const hotelNightsCost = (chosenHotel?.price_per_night_dt || 200) * 2; // 2 nights
  const attractionsCost = selectedStops.reduce((sum, id) => {
    const a = attractions.find((att) => att.id === id);
    return sum + (a ? a.price_dt * numberOfPeople : 0);
  }, 0);
  const totalCostDt = hotelNightsCost + attractionsCost;

  const handleConfirmExpedition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!travelerName.trim()) return;

    const newPassId = generatePassId().replace('TN-2026', 'TN-2027');
    const newBooking: Booking = {
      id: `bk-ecl-${Date.now()}`,
      pass_id: newPassId,
      traveler_name: travelerName.trim(),
      traveler_email: travelerEmail.trim() || `${travelerName.toLowerCase().replace(/\s+/g, '')}@eclipse2027.tn`,
      selected_attraction_ids: selectedStops,
      selected_hotel_id: selectedHotelId,
      trip_dates: {
        start: '2027-08-01',
        end: '2027-08-03'
      },
      number_of_people: numberOfPeople,
      status: 'Confirmed (Eclipse Expedition)',
      total_cost_dt: totalCostDt,
      created_at: new Date().toISOString()
    };

    onBookExpedition(newBooking);
  };

  return (
    <div className="min-h-screen bg-[#060814] text-slate-100 font-sans relative overflow-hidden">
      {/* Background Starry Aura & Corona Glow Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-amber-500/15 via-purple-600/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[400px] -right-40 w-[600px] h-[600px] bg-gradient-to-br from-indigo-900/20 via-purple-900/15 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Top Banner Navigation */}
      <div className="border-b border-slate-800/80 bg-[#080d1e]/80 backdrop-blur-md sticky top-18 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-amber-300">
              August 2, 2027 • Southern Tunisia Totality Corridor
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => document.getElementById('safety-precautions')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-xs font-semibold px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Safety Precautions</span>
            </button>
            <button
              onClick={onGoToPlanner}
              className="text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Standard Trip Planner →
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* HERO SECTION: Eclipse 2027 Visual Corona Banner */}
        <section className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-br from-[#0c1228] via-[#090e1f] to-[#050711] p-6 sm:p-12 shadow-2xl">
          {/* Subtle Corona Solar Ring Graphic in Hero */}
          <div className="absolute -top-12 -right-12 w-80 h-80 rounded-full border-[10px] border-amber-400/20 filter blur-sm pointer-events-none" />
          <div className="absolute -top-6 -right-6 w-68 h-68 rounded-full border-[3px] border-amber-300/40 pointer-events-none" />
          <div className="absolute top-8 right-8 w-40 h-40 rounded-full bg-black shadow-[0_0_50px_rgba(251,191,36,0.6)] pointer-events-none hidden md:block" />

          <div className="max-w-3xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-purple-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Great North African Eclipse of the Century</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              August 2, 2027 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-purple-400">
                Total Solar Eclipse
              </span>{' '}
              in Tunisia
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              On Monday, August 2, 2027, the moon will completely veil the sun across Southern Tunisia, plunging the Sahara into daytime twilight for up to <strong className="text-amber-300 font-bold">6 minutes and 23 seconds</strong> — the longest total solar eclipse on land until the 22nd century.
            </p>

            {/* Countdown Clock Grid */}
            <div className="pt-2">
              <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5 text-amber-400" />
                <span>Countdown to Totality in Southern Tunisia</span>
              </div>
              <div className="grid grid-cols-4 gap-3 max-w-md">
                <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 text-center">
                  <span className="block text-2xl sm:text-3xl font-black font-mono text-amber-300">
                    {timeLeft.days}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Days</span>
                </div>
                <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 text-center">
                  <span className="block text-2xl sm:text-3xl font-black font-mono text-amber-300">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Hours</span>
                </div>
                <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 text-center">
                  <span className="block text-2xl sm:text-3xl font-black font-mono text-amber-300">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Mins</span>
                </div>
                <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 text-center">
                  <span className="block text-2xl sm:text-3xl font-black font-mono text-amber-300">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Secs</span>
                </div>
              </div>
            </div>

            {/* Quick Stat Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Max Duration</h4>
                  <p className="text-xs text-amber-300 font-mono font-bold">6m 23s Totality</p>
                  <span className="text-[10px] text-slate-400">At Chott el Djerid Centerline</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Sky Visibility</h4>
                  <p className="text-xs text-purple-300 font-mono font-bold">98% Clear Probability</p>
                  <span className="text-[10px] text-slate-400">Arid Saharan cloudless skies</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Path Width</h4>
                  <p className="text-xs text-emerald-300 font-mono font-bold">~258 km Wide Umbra</p>
                  <span className="text-[10px] text-slate-400">Tozeur, Kebili, Douz corridor</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: CRITICAL ECLIPSE VIEWING SAFETY PRECAUTIONS (USER EXPLICIT REQUIREMENT) */}
        <section id="safety-precautions" className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-indigo-950/40 border-2 border-amber-500/60 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-amber-200 tracking-tight">
                  Mandatory Eclipse Safety Precautions & Viewing Rules
                </h2>
                <span className="bg-amber-400 text-slate-950 font-black text-[10px] uppercase px-2 py-0.5 rounded tracking-wider">
                  Crucial
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Direct solar viewing without certified filtration causes irreversible retinal burns (solar retinopathy). Read and observe these scientific guidelines.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Rule 1 */}
            <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-400">
                <Eye className="w-4 h-4 shrink-0" />
                <h3 className="text-xs font-bold uppercase tracking-wider">ISO 12312-2 Solar Glasses Only</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Standard sunglasses, polarized lenses, smoked glass, or exposed film <strong className="text-red-300">NEVER</strong> protect against solar infrared radiation. You must use certified <strong>ISO 12312-2</strong> compliant solar eclipse glasses for all partial phases.
              </p>
            </div>

            {/* Rule 2 */}
            <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-400">
                <Timer className="w-4 h-4 shrink-0" />
                <h3 className="text-xs font-bold uppercase tracking-wider">The Exact Totality Window</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                You may ONLY look directly at the eclipsed sun with naked eyes during the <strong>100% totality window</strong> when the moon completely obscures the sun. The instant the first bead of sunlight re-emerges (Baily's Beads), solar glasses must go back on.
              </p>
            </div>

            {/* Rule 3 */}
            <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-400">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Optical Magnification Hazard</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Never</strong> look at the sun through a camera lens, binoculars, or telescope while wearing eclipse glasses. The concentrated light beam acts like a magnifying glass and will melt the filter and permanently damage your vision instantly.
              </p>
            </div>

            {/* Rule 4 */}
            <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-400">
                <Flame className="w-4 h-4 shrink-0" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Saharan Heat & Hydration</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Southern Tunisia in August averages <strong>42°C (108°F)</strong>. Carry at least 4 liters of potable water per person, wear loose breathable white clothing, high-SPF sunscreen, and wide-brim hats during daytime eclipse watch.
              </p>
            </div>
          </div>

          {/* Interactive Checklist for Traveler Readiness */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-300 mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Traveler Safety Equipment Readiness Checklist</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { key: 'iso_glasses', label: 'ISO 12312-2 Certified Solar Eclipse Glasses' },
                { key: 'optics_filter', label: 'Front-Mount Solar Filters for Camera/Phone Lenses' },
                { key: 'timing_rule', label: 'Understood: Glasses ON until 100% complete darkness' },
                { key: 'desert_hydration', label: 'Hydration Pack / 4L Water Per Person Prepared' },
                { key: 'sun_shelter', label: 'Sun Canopy / UV Protective Headwear for Chott el Djerid' }
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => toggleSafetyItem(item.key)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                    checkedSafetyItems[item.key]
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                      : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                      checkedSafetyItems[item.key]
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                        : 'border-slate-600'
                    }`}
                  >
                    {checkedSafetyItems[item.key] && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: TOTALITY ASTRONOMICAL CORRIDOR & TIMELINE BREAKDOWN */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-1">
                <Compass className="w-3.5 h-3.5" />
                <span>Geographic Eclipse Observatory</span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Totality Centerline Path & Astronomical Corridor
              </h2>
              <p className="text-xs text-slate-400">
                Official astronomical corridor metrics and certified observation sectors across Southern Tunisia on August 2, 2027.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="flex items-center gap-1">
                <span className="w-3 h-1 bg-amber-400 rounded-full inline-block" />
                <span className="text-slate-300">Centerline Duration: Up to 6m 23s</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                <span className="text-slate-300">Cloud Risk: &lt;3%</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Sector 1: Chott el Djerid */}
            <div className="bg-gradient-to-b from-amber-950/30 to-slate-900/90 border border-amber-500/40 rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:border-amber-400 transition-all shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Centerline Apex
                </span>
                <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                  <Timer className="w-3.5 h-3.5" /> 6m 23s
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-200 transition-colors">
                  Chott el Djerid Salt Flats
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  North Africa&apos;s largest salt lake. 360° unobstructed horizon, zero light pollution, shimmering salt crystal crust.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex justify-between">
                <span>Elevation: 64° Zenith</span>
                <span className="text-amber-400 font-semibold">Max Totality</span>
              </div>
            </div>

            {/* Sector 2: Kebili Ridge */}
            <div className="bg-gradient-to-b from-slate-900/90 to-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3 group hover:border-slate-700 transition-all shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest bg-slate-800 px-2 py-0.5 rounded">
                  Elevated Plateau
                </span>
                <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                  <Timer className="w-3.5 h-3.5" /> 6m 15s
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-200 transition-colors">
                  Kebili Desert Ridge
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Panoramic vantage point overlooking expansive date palm groves and red desert mesas as the umbra descends.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex justify-between">
                <span>Elevation: 63.8°</span>
                <span className="text-emerald-400 font-semibold">Prime Corona</span>
              </div>
            </div>

            {/* Sector 3: Douz Grand Erg */}
            <div className="bg-gradient-to-b from-slate-900/90 to-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3 group hover:border-slate-700 transition-all shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest bg-slate-800 px-2 py-0.5 rounded">
                  Dune Sea Umbra
                </span>
                <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                  <Timer className="w-3.5 h-3.5" /> 6m 08s
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-200 transition-colors">
                  Douz Sahara Dunes
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Gateway to the Grand Erg Oriental. Silken golden ripples with dramatic temperature drop during 6 minutes of darkness.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex justify-between">
                <span>Elevation: 63.5°</span>
                <span className="text-amber-400 font-semibold">Desert Watch</span>
              </div>
            </div>

            {/* Sector 4: Tozeur Oasis */}
            <div className="bg-gradient-to-b from-slate-900/90 to-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3 group hover:border-slate-700 transition-all shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest bg-slate-800 px-2 py-0.5 rounded">
                  Oasis Hub
                </span>
                <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                  <Timer className="w-3.5 h-3.5" /> 5m 50s
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-200 transition-colors">
                  Tozeur Oasis & Nefta
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Historic brick architecture, palmeries, and Mos Espa desert sets with convenient airport & lodge access.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex justify-between">
                <span>Elevation: 64.2°</span>
                <span className="text-cyan-400 font-semibold">Expedition Base</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: CERTIFIED SOUTHERN TOTALITY SITES ONLY */}
        <section className="space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-black text-white tracking-tight">
              Certified Totality Locations (Southern Tunisia Path)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Strictly restricted to sites located inside the August 2, 2027 umbra path of totality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {totalityAttractions.map((att) => {
              const isSelected = selectedStops.includes(att.id);
              let totalityTime = '5m 50s';
              if (att.id === 5) totalityTime = '6m 23s (MAX)';
              if (att.id === 11) totalityTime = '6m 15s';
              if (att.id === 14) totalityTime = '6m 08s';
              if (att.id === 13) totalityTime = '5m 45s';

              return (
                <div
                  key={att.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col bg-slate-900/80 ${
                    isSelected
                      ? 'border-amber-400/80 ring-1 ring-amber-400/50 shadow-lg shadow-amber-500/10'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                    <SafeImage
                      src={att.image_url}
                      alt={att.name}
                      category={att.category}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-amber-400/40 text-[11px] font-mono font-bold text-amber-300">
                      ☀️ {totalityTime}
                    </div>
                    <div className="absolute bottom-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-semibold text-slate-300">
                      {att.location}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-extrabold text-base text-white tracking-tight leading-snug">
                        {att.name}
                      </h3>
                      <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                        {att.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                      <div className="text-xs">
                        <span className="text-slate-400">Entry: </span>
                        <span className="font-bold text-amber-300">{att.price_dt} DT</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleStop(att.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 shadow-xs'
                            : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Included in Expedition</span>
                          </>
                        ) : (
                          <span>+ Add to Expedition</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 5: ECLIPSE-VIEW HOTELS SHOWCASE */}
        <section className="space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-black text-white tracking-tight">
              Totality Lodging & Desert Eclipse Bases
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select your expedition lodging in the southern viewing corridor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {eclipseHotels.map((h) => {
              const isSelected = selectedHotelId === h.id;
              return (
                <div
                  key={h.id}
                  onClick={() => setSelectedHotelId(h.id)}
                  className={`rounded-2xl border p-5 cursor-pointer transition-all duration-200 bg-slate-900/80 flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-400 ring-2 ring-amber-400/40 bg-slate-900 shadow-xl shadow-amber-500/10'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="relative h-40 rounded-xl overflow-hidden bg-slate-950">
                      <SafeImage
                        src={h.image_url}
                        alt={h.name}
                        className="w-full h-full object-cover"
                      />
                      {h.has_eclipse_view && (
                        <div className="absolute top-2 left-2 bg-amber-400 text-slate-950 font-black text-[10px] uppercase px-2 py-0.5 rounded shadow">
                          Direct Totality View
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-base text-white">{h.name}</h3>
                        <span className="text-xs font-mono font-bold text-amber-300">
                          {h.price_per_night_dt} DT/night
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        {h.location}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {h.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">
                      {isSelected ? '✓ Active Expedition Hotel' : 'Click to select'}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'bg-amber-400 border-amber-300 text-slate-950'
                          : 'border-slate-600'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 6: PRE-CURATED EXPEDITION PACKAGE & DIRECT BOOKING FORM */}
        <section className="bg-gradient-to-br from-slate-900 via-[#0a0f24] to-slate-950 border border-amber-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Pre-Curated Expedition Itinerary Breakdown */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                  Pre-Curated Package
                </span>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  3-Day Southern Totality Expedition
                </h3>
                <p className="text-xs text-slate-400">
                  August 1 – August 3, 2027 • Centered around maximum solar totality on August 2nd.
                </p>
              </div>

              {/* Day-by-Day Stops */}
              <div className="space-y-4">
                {/* Day 1 */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 font-mono">
                      DAY 1: August 1, 2027
                    </span>
                    <span className="text-[11px] text-slate-400">Arrival & Desert Sunset</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    Base Camp Arrival at {chosenHotel.name}
                  </h4>
                  <p className="text-xs text-slate-300">
                    Check into your desert lodge in Tozeur/Kebili. Afternoon expedition to Ong Jmel & Mos Espa dunes for golden-hour sunset photography and solar filter testing.
                  </p>
                </div>

                {/* Day 2 (TOTALITY DAY) */}
                <div className="bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-500/60 rounded-2xl p-4 space-y-2 ring-1 ring-amber-500/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 font-mono flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      DAY 2: August 2, 2027 (TOTALITY DAY)
                    </span>
                    <span className="text-[11px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded">
                      6m 23s Totality
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-white">
                    Centerline Observation at Chott el Djerid / Kebili Ridge
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    08:00 Early morning transfer to the salt flats. 09:07 UTC totality window: 360-degree desert horizon twilight, glowing white solar corona, and Mercury/Venus planetary alignment.
                  </p>
                </div>

                {/* Day 3 */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 font-mono">
                      DAY 3: August 3, 2027
                    </span>
                    <span className="text-[11px] text-slate-400">Grand Erg & Amazigh Oasis</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    Douz Sand Dunes & Matmata Troglodyte Heritage
                  </h4>
                  <p className="text-xs text-slate-300">
                    Morning camel caravan across the golden dunes of Douz, followed by lunch in a subterranean troglodyte home in Matmata.
                  </p>
                </div>
              </div>

              {/* Selected Stops Summary */}
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 text-xs space-y-2">
                <span className="font-bold text-slate-300 block">
                  Included Expedition Stops ({selectedStops.length} selected):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedStops.map((id) => {
                    const att = attractions.find((a) => a.id === id);
                    return att ? (
                      <span
                        key={id}
                        className="bg-amber-500/15 border border-amber-500/30 text-amber-200 px-2.5 py-1 rounded-lg text-[11px] font-medium"
                      >
                        ✓ {att.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            </div>

            {/* Right: Direct Booking Card */}
            <div className="lg:col-span-5 bg-slate-950 rounded-2xl border border-amber-500/50 p-6 space-y-5 shadow-xl">
              <div className="border-b border-slate-800 pb-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-lg text-white">Book Eclipse Expedition</h4>
                  <span className="text-[10px] font-mono uppercase bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-black">
                    August 2027
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Generates an official PassTunisia verified digital pass.
                </p>
              </div>

              <form onSubmit={handleConfirmExpedition} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Lead Traveler Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={travelerName}
                    onChange={(e) => setTravelerName(e.target.value)}
                    placeholder="e.g. Leila Bouazizi"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Contact Email (for Pass Delivery)
                  </label>
                  <input
                    type="email"
                    value={travelerEmail}
                    onChange={(e) => setTravelerEmail(e.target.value)}
                    placeholder="e.g. leila.travel@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Number of Travelers
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}
                      className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="text-sm font-mono font-bold text-amber-300 px-3">
                      {numberOfPeople} {numberOfPeople === 1 ? 'Traveler' : 'Travelers'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setNumberOfPeople(numberOfPeople + 1)}
                      className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Pricing Breakdown */}
                <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>{chosenHotel.name} (2 nights)</span>
                    <span>{hotelNightsCost} DT</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Selected Sites ({selectedStops.length} stops x {numberOfPeople})</span>
                    <span>{attractionsCost} DT</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm text-white">
                    <span>Total Estimated Cost</span>
                    <span className="text-amber-400 font-mono">{totalCostDt} DT</span>
                  </div>
                </div>

                {/* Booking Button */}
                <button
                  type="submit"
                  disabled={!travelerName.trim()}
                  className={`w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    travelerName.trim()
                      ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 shadow-lg shadow-amber-500/20'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <SunMedium className="w-4 h-4 text-slate-950" />
                  <span>Confirm Eclipse Expedition Pass</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>

                {/* Prototype Badge */}
                <div className="text-center pt-1">
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 inline-flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-amber-400" />
                    PROTOTYPE — not a real booking
                  </span>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
