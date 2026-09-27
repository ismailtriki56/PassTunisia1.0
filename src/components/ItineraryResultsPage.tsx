import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Clock,
  Sparkles,
  Building,
  CheckSquare,
  Square,
  Coins,
  AlertCircle,
  Calendar,
  Users,
  ShieldAlert,
  ArrowRight,
  SunMedium,
  CheckCircle,
  Compass
} from 'lucide-react';
import { Attraction, Hotel, ItineraryResult, TripPlannerInput, Booking } from '../types';
import { formatEnglishDateRange } from '../utils/dateUtils';
import { SafeImage } from './SafeImage';
import { generatePassId } from '../services/storage';

interface ItineraryResultsPageProps {
  itinerary: ItineraryResult | null;
  tripInput: TripPlannerInput;
  attractions: Attraction[];
  hotels: Hotel[];
  isLoading: boolean;
  onConfirmBooking: (booking: Booking) => void;
  onBackToPlanner: () => void;
}

export const ItineraryResultsPage: React.FC<ItineraryResultsPageProps> = ({
  itinerary,
  tripInput,
  attractions,
  hotels,
  isLoading,
  onConfirmBooking,
  onBackToPlanner,
}) => {
  // Map of stop selections: key = `${day}-${attraction_id}`, value = boolean
  const [selectedStops, setSelectedStops] = useState<Record<string, boolean>>({});
  const [includeHotel, setIncludeHotel] = useState<boolean>(true);

  // Lightweight user identity state
  const [travelerName, setTravelerName] = useState<string>('Ismail Triki');
  const [travelerEmail, setTravelerEmail] = useState<string>('ismailtriki999@gmail.com');
  const [emailTouched, setEmailTouched] = useState<boolean>(false);
  const [nameTouched, setNameTouched] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Initialize selected stops when itinerary changes
  React.useEffect(() => {
    if (itinerary?.days) {
      const initial: Record<string, boolean> = {};
      itinerary.days.forEach((day) => {
        day.stops.forEach((stop) => {
          initial[`${day.day}-${stop.attraction_id}`] = true;
        });
      });
      setSelectedStops(initial);
    }
  }, [itinerary]);

  const attractionsMap = useMemo(() => {
    const map = new Map<number, Attraction>();
    attractions.forEach((a) => map.set(a.id, a));
    return map;
  }, [attractions]);

  const hotelsMap = useMemo(() => {
    const map = new Map<number, Hotel>();
    hotels.forEach((h) => map.set(h.id, h));
    return map;
  }, [hotels]);

  const suggestedHotel = itinerary?.suggested_hotel_id
    ? hotelsMap.get(itinerary.suggested_hotel_id) || null
    : null;

  // Nights count calculation
  const nights = useMemo(() => {
    try {
      const s = new Date(tripInput.startDate);
      const e = new Date(tripInput.endDate);
      const diff = Math.round((e.getTime() - s.getTime()) / (1000 * 3600 * 24));
      return Math.max(1, diff);
    } catch {
      return 1;
    }
  }, [tripInput.startDate, tripInput.endDate]);

  // Selected attraction count and IDs
  const selectedAttractionIds = useMemo(() => {
    const ids: number[] = [];
    if (!itinerary) return ids;

    itinerary.days.forEach((day) => {
      day.stops.forEach((stop) => {
        if (selectedStops[`${day.day}-${stop.attraction_id}`]) {
          if (!ids.includes(stop.attraction_id)) {
            ids.push(stop.attraction_id);
          }
        }
      });
    });
    return ids;
  }, [itinerary, selectedStops]);

  // Cost tally
  const attractionsCostTotal = useMemo(() => {
    let total = 0;
    selectedAttractionIds.forEach((id) => {
      const att = attractionsMap.get(id);
      if (att) {
        total += att.price_dt * tripInput.numberOfPeople;
      }
    });
    return total;
  }, [selectedAttractionIds, attractionsMap, tripInput.numberOfPeople]);

  const hotelCostTotal = useMemo(() => {
    if (!includeHotel || !suggestedHotel) return 0;
    return suggestedHotel.price_per_night_dt * nights;
  }, [includeHotel, suggestedHotel, nights]);

  const grandTotalCost = attractionsCostTotal + hotelCostTotal;

  // Email validation: has @ and domain format
  const isEmailFormatValid = useMemo(() => {
    if (!travelerEmail.trim()) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return re.test(travelerEmail.trim());
  }, [travelerEmail]);

  const isNameValid = travelerName.trim().length >= 2;
  const isAnyStopSelected = selectedAttractionIds.length > 0;
  const canConfirm = isAnyStopSelected && isNameValid && isEmailFormatValid && !isSubmitting;

  const toggleStop = (day: number, attractionId: number) => {
    const key = `${day}-${attractionId}`;
    setSelectedStops((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleConfirm = () => {
    if (!canConfirm) return;
    setIsSubmitting(true);

    const passId = generatePassId();
    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      pass_id: passId,
      traveler_name: travelerName.trim(),
      traveler_email: travelerEmail.trim(),
      selected_attraction_ids: selectedAttractionIds,
      selected_hotel_id: includeHotel && suggestedHotel ? suggestedHotel.id : null,
      trip_dates: {
        start: tripInput.startDate,
        end: tripInput.endDate,
      },
      number_of_people: tripInput.numberOfPeople,
      status: 'Confirmed (Prototype)',
      total_cost_dt: grandTotalCost,
      created_at: new Date().toISOString(),
    };

    onConfirmBooking(newBooking);
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-[#c25934]/20 border-t-[#c25934] animate-spin" />
          <div className="absolute inset-3 rounded-full border-4 border-[#124e5b]/20 border-b-[#124e5b] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }} />
          <div className="w-full h-full flex items-center justify-center">
            <Compass className="w-8 h-8 text-[#c25934] animate-pulse" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-[#1e1c1a]">
            Gemini AI is Synthesizing Your Route
          </h2>
          <p className="text-sm text-[#70665c] max-w-md mx-auto">
            Matching attractions in {tripInput.stayingLocation}, verifying opening schedules, calculating admission fees, and cross-referencing totality coordinates...
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f4eee5] rounded-xl text-xs font-mono text-[#5c544a]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Calling model: gemini-3.8-flash</span>
        </div>
      </div>
    );
  }

  if (!itinerary || !itinerary.days || itinerary.days.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-[#1f1d1a]">No Itinerary Available Yet</h2>
        <p className="text-sm text-[#6e6459]">
          Fill in your preferences in the Trip Planner to let our AI build your daily stops and accommodation schedule.
        </p>
        <button
          onClick={onBackToPlanner}
          className="px-6 py-3 bg-[#c25934] text-white font-bold text-sm rounded-xl cursor-pointer"
        >
          Go to Trip Planner
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8dfd5] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#c25934] mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Suggested Itinerary</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1b1917] tracking-tight">
            Custom Trip to {tripInput.stayingLocation || 'Tunisia'}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-[#6e6459]">
            <span className="flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#124e5b]" />
              {formatEnglishDateRange(tripInput.startDate, tripInput.endDate)} ({nights} {nights === 1 ? 'day' : 'days'})
            </span>
            <span className="flex items-center gap-1 font-medium">
              <Users className="w-3.5 h-3.5 text-[#124e5b]" />
              {tripInput.numberOfPeople} {tripInput.numberOfPeople === 1 ? 'Traveler' : 'Travelers'}
            </span>
            <span className="flex items-center gap-1 font-medium">
              <Coins className="w-3.5 h-3.5 text-[#c25934]" />
              Budget: {tripInput.budgetDt} DT
            </span>
          </div>
        </div>

        <button
          onClick={onBackToPlanner}
          className="self-start md:self-auto px-4 py-2 border border-[#d8cec2] hover:bg-stone-50 rounded-xl text-xs font-bold text-[#574f46] transition-colors"
        >
          Adjust Inputs
        </button>
      </div>

      {/* Days List */}
      <div className="space-y-8">
        {itinerary.days.map((day) => (
          <div key={day.day} className="space-y-4">
            {/* Day Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#124e5b] text-white flex items-center justify-center font-black text-base shadow-sm">
                D{day.day}
              </div>
              <div>
                <h2 className="text-xl font-black text-[#1e1c1a]">
                  Day {day.day} Exploration
                </h2>
                <p className="text-xs text-[#73685e]">
                  {day.stops.length} recommended site{day.stops.length !== 1 ? 's' : ''} for this day
                </p>
              </div>
            </div>

            {/* Stops Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {day.stops.map((stop) => {
                const attraction = attractionsMap.get(stop.attraction_id);
                if (!attraction) return null;

                const isSelected = !!selectedStops[`${day.day}-${stop.attraction_id}`];

                return (
                  <div
                    key={`${day.day}-${stop.attraction_id}`}
                    onClick={() => toggleStop(day.day, stop.attraction_id)}
                    className={`rounded-2xl border transition-all cursor-pointer overflow-hidden flex flex-col ${
                      isSelected
                        ? 'bg-white border-[#c25934] shadow-md ring-2 ring-[#c25934]/20'
                        : 'bg-stone-50/70 border-stone-200 opacity-60 hover:opacity-90'
                    }`}
                  >
                    {/* Thumbnail Header */}
                    <div className="relative h-44 bg-stone-200 overflow-hidden">
                      <SafeImage
                        src={attraction.image_url}
                        fallbackSrc={attraction.fallback_image_url}
                        alt={attraction.name}
                        category={attraction.category}
                        className="w-full h-full object-cover"
                      />

                      {/* Checkbox badge */}
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-xl flex items-center gap-1.5 text-xs font-bold text-[#1b1917] shadow-sm">
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-[#c25934]" />
                        ) : (
                          <Square className="w-4 h-4 text-stone-400" />
                        )}
                        <span>{isSelected ? 'Included in Pass' : 'Excluded'}</span>
                      </div>

                      {/* Price pill */}
                      <div className="absolute bottom-3 right-3 bg-black/75 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                        {attraction.price_dt === 0
                          ? 'Free'
                          : `${attraction.price_dt} DT / person`}
                      </div>

                      {/* Category tag */}
                      <div className="absolute top-3 right-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white px-2 py-0.5 rounded">
                          {attraction.category.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs text-[#877d71] mb-1 font-medium">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#c25934]" />
                            <span>{attraction.location}</span>
                          </span>
                          <span className="text-[10px] font-bold text-[#124e5b] bg-[#ebf5f7] px-1.5 py-0.5 rounded">
                            {attraction.region}
                          </span>
                        </div>
                        <h3 className="font-bold text-base text-[#1b1917] leading-snug">
                          {attraction.name}
                        </h3>
                        <p className="text-xs text-[#5e554c] mt-1 line-clamp-2">
                          {attraction.description}
                        </p>
                      </div>

                      {/* AI Reason Callout */}
                      <div className="bg-[#fcf8f3] border-l-3 border-[#c25934] p-2.5 rounded-r-xl text-xs space-y-1">
                        <div className="font-bold text-[#9e4222] flex items-center gap-1 text-[11px] uppercase tracking-wide">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>Why Gemini AI picked this:</span>
                        </div>
                        <p className="text-[#453f38] italic leading-relaxed">
                          "{stop.reason}"
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#f2eae1] flex items-center justify-between text-xs text-[#7d7266]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#124e5b]" />
                          Hours: {attraction.opening_hours}
                        </span>
                        <span className="font-medium text-[#242220]">
                          ~{attraction.duration_hours} hrs
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Suggested Hotel Section */}
      {suggestedHotel && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-[#124e5b]" />
              <h2 className="text-xl font-black text-[#1e1c1a]">
                AI Suggested Accommodation
              </h2>
            </div>
            <span className="text-xs font-semibold text-[#7e7368]">
              {suggestedHotel.location}
            </span>
          </div>

          <div
            onClick={() => setIncludeHotel(!includeHotel)}
            className={`rounded-3xl border transition-all cursor-pointer overflow-hidden p-4 sm:p-6 flex flex-col md:flex-row gap-6 items-center ${
              includeHotel
                ? 'bg-white border-[#124e5b] shadow-md ring-2 ring-[#124e5b]/20'
                : 'bg-stone-50 border-stone-200 opacity-60'
            }`}
          >
            <div className="relative w-full md:w-64 h-44 rounded-2xl overflow-hidden bg-stone-200 shrink-0">
              <SafeImage
                src={suggestedHotel.image_url}
                fallbackSrc={suggestedHotel.fallback_image_url}
                alt={suggestedHotel.name}
                className="w-full h-full object-cover"
              />
              {suggestedHotel.has_eclipse_view && (
                <div className="absolute top-2 left-2 bg-amber-500 text-stone-950 font-black text-[10px] px-2 py-0.5 rounded shadow">
                  Totality View Terrace
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2 w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-xs font-bold px-2 py-0.5 bg-[#ebf5f7] text-[#124e5b] rounded-md">
                    Recommended Stay
                  </div>
                  {suggestedHotel.has_eclipse_view && (
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <SunMedium className="w-3.5 h-3.5 text-amber-500" />
                      Eclipse Ready
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1b1917]">
                  {includeHotel ? (
                    <CheckSquare className="w-5 h-5 text-[#124e5b]" />
                  ) : (
                    <Square className="w-5 h-5 text-stone-400" />
                  )}
                  <span>{includeHotel ? 'Hotel Selected' : 'Hotel Excluded'}</span>
                </div>
              </div>

              <h3 className="text-lg font-black text-[#1e1c1a]">
                {suggestedHotel.name}
              </h3>
              <p className="text-xs text-[#63594e] leading-relaxed">
                {suggestedHotel.description}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-between text-xs border-t border-[#f0e8de]">
                <span className="text-[#7d7367]">
                  Rate: <strong>{suggestedHotel.price_per_night_dt} DT</strong> / night × {nights} nights
                </span>
                <span className="font-bold text-sm text-[#124e5b]">
                  {suggestedHotel.price_per_night_dt * nights} DT total lodging
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Step & Lightweight User Identity */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#e8dfd5] shadow-xl space-y-8">
        <div className="border-b border-[#f0e8de] pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-[#1e1c1a] flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#c25934] text-white text-xs flex items-center justify-center font-bold">
                ✓
              </span>
              <span>Confirm & Issue Travel Pass</span>
            </h2>
            <span className="text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg">
              PROTOTYPE — not a real booking
            </span>
          </div>
          <p className="text-xs text-[#786e63] mt-1">
            Fill in your lightweight traveler contact to generate your PassTunisia digital QR voucher.
          </p>
        </div>

        {/* Traveler Name and Email Inputs (Requirement 2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Traveler Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#453f38] flex items-center justify-between">
              <span>Traveler Full Name</span>
              <span className="text-[11px] text-[#8c8275]">Required</span>
            </label>
            <input
              type="text"
              required
              value={travelerName}
              onChange={(e) => {
                setTravelerName(e.target.value);
                setNameTouched(true);
              }}
              placeholder="e.g. Ismail Triki"
              className={`w-full px-4 py-2.5 bg-[#faf7f2] border rounded-xl text-sm font-medium text-[#1e1c1a] focus:outline-none ${
                nameTouched && !isNameValid
                  ? 'border-red-500 ring-1 ring-red-500'
                  : 'border-[#ddd2c5] focus:ring-2 focus:ring-[#c25934]'
              }`}
            />
            {nameTouched && !isNameValid && (
              <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Please enter traveler name (minimum 2 characters).</span>
              </p>
            )}
          </div>

          {/* Email with client format check */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#453f38] flex items-center justify-between">
              <span>Traveler Email</span>
              <span className="text-[11px] text-[#8c8275]">Format checked (@ and domain)</span>
            </label>
            <input
              type="email"
              required
              value={travelerEmail}
              onChange={(e) => {
                setTravelerEmail(e.target.value);
                setEmailTouched(true);
              }}
              placeholder="e.g. ismailtriki999@gmail.com"
              className={`w-full px-4 py-2.5 bg-[#faf7f2] border rounded-xl text-sm font-medium text-[#1e1c1a] focus:outline-none ${
                emailTouched && !isEmailFormatValid
                  ? 'border-red-500 ring-1 ring-red-500'
                  : 'border-[#ddd2c5] focus:ring-2 focus:ring-[#c25934]'
              }`}
            />
            {emailTouched && !isEmailFormatValid && (
              <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Please enter a valid email format (e.g., name@domain.com).</span>
              </p>
            )}
          </div>
        </div>

        {/* Cost Summary Breakdown */}
        <div className="bg-[#faf7f2] rounded-2xl p-4 sm:p-5 border border-[#ede5db] space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[#695f54]">
            Trip Pass Cost Breakdown
          </div>
          <div className="space-y-1.5 text-xs text-[#524940]">
            <div className="flex justify-between">
              <span>Selected Attractions ({selectedAttractionIds.length} sites × {tripInput.numberOfPeople} travelers):</span>
              <span className="font-bold">{attractionsCostTotal} DT</span>
            </div>
            {includeHotel && suggestedHotel && (
              <div className="flex justify-between">
                <span>Suggested Hotel ({suggestedHotel.name} × {nights} nights):</span>
                <span className="font-bold">{hotelCostTotal} DT</span>
              </div>
            )}
            <div className="border-t border-[#e2d8cb] pt-2 flex justify-between text-sm sm:text-base font-black text-[#1e1c1a]">
              <span>Estimated Total Cost:</span>
              <span className="text-[#c25934]">{grandTotalCost} DT</span>
            </div>
          </div>
        </div>

        {/* Warning & Submit Button */}
        <div className="space-y-4 pt-2">
          {!isAnyStopSelected && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>You must select at least one attraction stop to confirm your trip.</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Prototype disclaimer note */}
            <div className="text-xs text-[#80766b] flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Prototype — identity is not verified in this demo.</span>
            </div>

            {/* Confirm button */}
            <button
              onClick={handleConfirm}
              disabled={!canConfirm}
              className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                canConfirm
                  ? 'bg-[#c25934] hover:bg-[#b04a27] text-white shadow-[#c25934]/30 cursor-pointer transform hover:-translate-y-0.5'
                  : 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none'
              }`}
            >
              <span>Confirm My Trip</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
