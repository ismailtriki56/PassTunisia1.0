import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Calendar,
  Users,
  MapPin,
  Coins,
  AlertCircle,
  SunMedium,
  Check,
  Compass,
  ArrowRight
} from 'lucide-react';
import { TripPlannerInput } from '../types';
import { EnglishDatePicker } from './EnglishDatePicker';
import { formatEnglishDateRange } from '../utils/dateUtils';

interface TripPlannerPageProps {
  initialInterest?: string;
  initialLocation?: string;
  onSubmitPlan: (input: TripPlannerInput) => Promise<void>;
  isLoading: boolean;
}

export const TripPlannerPage: React.FC<TripPlannerPageProps> = ({
  initialInterest,
  initialLocation,
  onSubmitPlan,
  isLoading,
}) => {
  // Current date in system context: 2026-09-27
  const todayStr = '2026-09-27';

  // Form states
  const [stayingLocation, setStayingLocation] = useState<string>(initialLocation || 'Tunis');
  const [startDate, setStartDate] = useState<string>('2026-10-01');
  const [endDate, setEndDate] = useState<string>('2026-10-04');
  const [numberOfPeople, setNumberOfPeople] = useState<number>(2);
  const [budgetDt, setBudgetDt] = useState<number>(1200);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'History',
    'Culture',
  ]);

  // Synchronize initial interest if passed
  useEffect(() => {
    if (initialInterest && !selectedInterests.includes(initialInterest)) {
      setSelectedInterests((prev) => [...prev, initialInterest]);
    }
  }, [initialInterest]);

  // Synchronize initial location if passed
  useEffect(() => {
    if (initialLocation) {
      setStayingLocation(initialLocation);
    }
  }, [initialLocation]);

  const popularLocations = [
    'Tunis',
    'Tozeur',
    'Kebili',
    'Douz',
    'Djerba',
    'Sousse',
    'Tabarka',
    'Bizerte',
    'Tataouine',
    'Matmata',
    'Monastir',
    'Zaghouan',
  ];

  const interestOptions = [
    { id: 'History', label: 'History & Antiquities', desc: 'Roman colosseums, Punic ruins, forts', icon: '🏛️' },
    { id: 'Culture', label: 'Culture & Heritage', desc: 'Medinas, mosaics, artisan souks', icon: '🕌' },
    { id: 'Beach', label: 'Beach & Coastal', desc: 'Mediterranean shores, coral diving, islands', icon: '🌊' },
    { id: 'Desert', label: 'Desert & Oases', desc: 'Sahara sand dunes, canyons, camel treks', icon: '🐪' },
    { id: 'Eclipse 2027', label: 'Eclipse 2027', desc: 'Totality path, solar viewing, desert night skies', icon: '☀️', special: true },
  ];

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter((item) => item !== id));
      }
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  // Validation Logic
  const isStartDatePast = startDate ? startDate < todayStr : false;
  const isEndDateInvalid = Boolean(startDate && endDate && endDate <= startDate);

  const isFormValid =
    Boolean(stayingLocation.trim()) &&
    Boolean(startDate) &&
    Boolean(endDate) &&
    !isStartDatePast &&
    !isEndDateInvalid &&
    numberOfPeople >= 1 &&
    budgetDt >= 100 &&
    selectedInterests.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;

    await onSubmitPlan({
      stayingLocation: stayingLocation.trim(),
      startDate,
      endDate,
      numberOfPeople,
      interests: selectedInterests,
      budgetDt,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fdf5f0] border border-[#c25934]/20 text-[#c25934] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Gemini-Powered Itinerary Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#1b1917] tracking-tight">
          Craft Your Ideal Tunisia Journey
        </h1>
        <p className="text-sm sm:text-base text-[#6b6257] max-w-xl mx-auto leading-relaxed">
          Specify your destination, dates, and interests. Our AI will curate authentic stops, timetable estimates, and totality-ready lodging.
        </p>
      </div>

      {/* Main Form Container */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#e8dfd5] space-y-8"
      >
        {/* Step 1: Base Location */}
        <div className="space-y-3">
          <label className="block text-sm font-extrabold text-[#1f1d1a] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#124e5b] text-white text-xs flex items-center justify-center font-bold">
              1
            </span>
            <span>Where will you be staying or starting from?</span>
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={stayingLocation}
              onChange={(e) => setStayingLocation(e.target.value)}
              placeholder="e.g. Tunis, Tozeur, Djerba, Sousse, Tabarka..."
              className="w-full pl-10 pr-4 py-3 bg-[#faf7f2] border border-[#ddd2c5] rounded-2xl text-sm font-medium text-[#242220] focus:ring-2 focus:ring-[#c25934] focus:outline-none"
            />
            <MapPin className="w-5 h-5 text-[#c25934] absolute left-3.5 top-3.5" />
          </div>

          {/* Quick Location Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-bold text-[#8a7f72] mr-1">Popular bases:</span>
            {popularLocations.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setStayingLocation(loc)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                  stayingLocation.toLowerCase() === loc.toLowerCase()
                    ? 'bg-[#124e5b] text-white shadow-xs'
                    : 'bg-[#f4efe8] text-[#554e45] hover:bg-[#e9e1d6]'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Trip Dates with REQUIRED VALIDATION */}
        <div className="space-y-4">
          <label className="block text-sm font-extrabold text-[#1f1d1a] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#124e5b] text-white text-xs flex items-center justify-center font-bold">
              2
            </span>
            <span>Trip Dates</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#5e554b] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#c25934]" />
                  <span>Start Date</span>
                </span>
                <span className="text-[10px] text-[#8c8275] font-mono">en-US</span>
              </label>
              <EnglishDatePicker
                value={startDate}
                onChange={(newDate) => setStartDate(newDate)}
                minDate={todayStr}
                hasError={isStartDatePast}
              />
              {isStartDatePast && (
                <p className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Start date cannot be in the past (minimum: {todayStr})</span>
                </p>
              )}
            </div>

            {/* End Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#5e554b] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#124e5b]" />
                  <span>End Date</span>
                </span>
                <span className="text-[10px] text-[#8c8275] font-mono">en-US</span>
              </label>
              <EnglishDatePicker
                value={endDate}
                onChange={(newDate) => setEndDate(newDate)}
                minDate={startDate || todayStr}
                hasError={isEndDateInvalid}
              />
              {isEndDateInvalid && (
                <p className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>End date must be after start date</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Step 3: Travelers & Budget */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Travelers */}
          <div className="space-y-2">
            <label className="block text-sm font-extrabold text-[#1f1d1a] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#124e5b] text-white text-xs flex items-center justify-center font-bold">
                3
              </span>
              <span>Number of People</span>
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}
                className="w-11 h-11 rounded-2xl bg-[#faf7f2] border border-[#ddd2c5] hover:bg-stone-200 text-lg font-bold flex items-center justify-center cursor-pointer transition-colors"
              >
                -
              </button>
              <div className="flex-1 py-2.5 px-4 bg-[#faf7f2] border border-[#ddd2c5] rounded-2xl text-center font-bold text-base text-[#1e1c1a]">
                {numberOfPeople} {numberOfPeople === 1 ? 'Traveler' : 'Travelers'}
              </div>
              <button
                type="button"
                onClick={() => setNumberOfPeople(Math.min(20, numberOfPeople + 1))}
                className="w-11 h-11 rounded-2xl bg-[#faf7f2] border border-[#ddd2c5] hover:bg-stone-200 text-lg font-bold flex items-center justify-center cursor-pointer transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <label className="block text-sm font-extrabold text-[#1f1d1a] flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#124e5b] text-white text-xs flex items-center justify-center font-bold">
                  4
                </span>
                <span>Budget in DT (Tunisian Dinar)</span>
              </span>
              <span className="text-xs font-mono font-bold text-[#c25934] bg-[#fdf5f0] px-2 py-0.5 rounded">
                ~{Math.round(budgetDt / numberOfPeople)} DT / person
              </span>
            </label>
            <div className="relative">
              <input
                type="number"
                min={100}
                max={25000}
                step={50}
                value={budgetDt}
                onChange={(e) => setBudgetDt(Math.max(100, Number(e.target.value) || 100))}
                className="w-full pl-10 pr-14 py-2.5 bg-[#faf7f2] border border-[#ddd2c5] rounded-2xl text-sm font-bold text-[#242220] focus:ring-2 focus:ring-[#c25934] focus:outline-none"
              />
              <Coins className="w-5 h-5 text-amber-600 absolute left-3.5 top-3" />
              <span className="absolute right-4 top-3 text-xs font-bold text-[#756b61]">
                DT
              </span>
            </div>
          </div>
        </div>

        {/* Step 4: Interests Multi-Select (with Eclipse 2027 option) */}
        <div className="space-y-3">
          <label className="block text-sm font-extrabold text-[#1f1d1a] flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#124e5b] text-white text-xs flex items-center justify-center font-bold">
                5
              </span>
              <span>Select Interests & Trip Themes</span>
            </span>
            <span className="text-xs text-[#877c70]">
              {selectedInterests.length} selected
            </span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {interestOptions.map((opt) => {
              const isSelected = selectedInterests.includes(opt.id);
              return (
                <div
                  key={opt.id}
                  onClick={() => toggleInterest(opt.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? opt.special
                        ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-400 ring-2 ring-amber-400/40 shadow-sm'
                        : 'bg-[#fdf7f3] border-[#c25934] ring-2 ring-[#c25934]/30 shadow-sm'
                      : 'bg-[#faf7f2] border-[#e4dbd0] hover:border-[#c25934]/60'
                  }`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm font-bold ${
                          opt.special ? 'text-amber-900' : 'text-[#2b2723]'
                        }`}
                      >
                        {opt.label}
                      </span>
                      {isSelected && (
                        <span
                          className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${
                            opt.special ? 'bg-amber-600' : 'bg-[#c25934]'
                          }`}
                        >
                          ✓
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#70665c] mt-0.5 leading-snug">
                      {opt.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedInterests.includes('Eclipse 2027') && (
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl flex items-center gap-2.5 text-xs text-amber-900">
              <SunMedium className="w-5 h-5 text-amber-600 shrink-0 animate-spin" style={{ animationDuration: '10s' }} />
              <span>
                <strong>Eclipse 2027 Active:</strong> The itinerary engine will prioritize August 2027 totality path sites (Chott el Djerid, Kebili, Kerkennah) and recommend certified eclipse-view hotels.
              </span>
            </div>
          )}
        </div>

        {/* Submit Section */}
        <div className="pt-4 border-t border-[#ede5da] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#7e746a] text-center sm:text-left">
            {isEndDateInvalid ? (
              <span className="text-red-600 font-bold">
                ⚠️ Please fix date errors above before proceeding.
              </span>
            ) : isStartDatePast ? (
              <span className="text-red-600 font-bold">
                ⚠️ Start date cannot be in the past.
              </span>
            ) : (
              <span>Ready to plan ~{Math.max(1, Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24)))} days of Tunisian exploration.</span>
            )}
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-lg ${
              !isFormValid || isLoading
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none'
                : 'bg-[#c25934] hover:bg-[#b04a27] text-white shadow-[#c25934]/30 hover:shadow-xl cursor-pointer transform hover:-translate-y-0.5'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Crafting Itinerary with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-200" />
                <span>Generate Itinerary</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
