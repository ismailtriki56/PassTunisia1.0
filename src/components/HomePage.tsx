import React, { useState, useMemo, useRef } from 'react';
import {
  Compass,
  Sparkles,
  MapPin,
  Clock,
  Search,
  ArrowRight,
  SunMedium,
  CheckCircle2,
  Building,
  ShieldCheck,
  Eye,
  Info
} from 'lucide-react';
import { Attraction, Hotel } from '../types';
import { SafeImage } from './SafeImage';

interface HomePageProps {
  attractions: Attraction[];
  hotels: Hotel[];
  onStartPlanner: (initialInterest?: string, initialLocation?: string) => void;
  onOpenHowItWorks?: () => void;
  onOpenEclipse?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  attractions,
  hotels,
  onStartPlanner,
  onOpenHowItWorks,
  onOpenEclipse
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewModalAttraction, setPreviewModalAttraction] = useState<Attraction | null>(null);
  const catalogRef = useRef<HTMLElement>(null);

  const categories: { id: string; label: string; icon: string }[] = [
    { id: 'all', label: 'All Sights', icon: '🏛️' },
    { id: 'eclipse_viewing', label: 'Eclipse 2027', icon: '☀️' },
    { id: 'history', label: 'Antiquity & Ruins', icon: '🏺' },
    { id: 'culture', label: 'Culture & Medinas', icon: '🕌' },
    { id: 'beach', label: 'Beaches & Coasts', icon: '🌊' },
    { id: 'desert', label: 'Sahara & Oases', icon: '🐪' },
  ];

  const regionsList = useMemo(() => {
    const set = new Set<string>();
    attractions.forEach(a => {
      if (a.region) set.add(a.region);
    });
    return Array.from(set).sort();
  }, [attractions]);

  const filteredAttractions = useMemo(() => {
    return attractions.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const matchesRegion =
        selectedRegion === 'all' || item.region === selectedRegion;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesRegion && matchesSearch;
    });
  }, [attractions, selectedCategory, selectedRegion, searchQuery]);

  const eclipseHotels = useMemo(() => {
    return hotels.filter(h => h.has_eclipse_view);
  }, [hotels]);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-14 lg:pt-12 lg:pb-20">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#c25934]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#124e5b]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Heading and CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fdf5f0] border border-[#c25934]/20 text-[#c25934] text-xs font-bold tracking-wide uppercase shadow-xs">
                <SunMedium className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '14s' }} />
                <span>Total Solar Eclipse 2027 • August 2nd Totality Path</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1b1917] tracking-tight leading-[1.12]">
                Your Passport to <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c25934] via-[#b64f2b] to-[#124e5b]">
                  Tunisian Wonders
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#5c544c] max-w-xl leading-relaxed">
                Smart itinerary generation powered by Gemini AI. Prioritizes authentic attractions physically close to your stay, coordinates regional travel times, and plans optimal totality viewing for the 2027 Total Solar Eclipse in the Sahara.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={() => onStartPlanner()}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#c25934] hover:bg-[#b04b27] text-white font-bold text-base shadow-lg shadow-[#c25934]/25 hover:shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 text-amber-200" />
                  <span>Start AI Trip Planner</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <button
                  onClick={() => (onOpenEclipse ? onOpenEclipse() : onStartPlanner('Eclipse 2027', 'Tozeur'))}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-[#124e5b] hover:bg-[#0c3943] text-white font-bold text-sm shadow-md shadow-[#124e5b]/20 hover:shadow-lg transition-all cursor-pointer"
                >
                  <SunMedium className="w-4 h-4 text-amber-300" />
                  <span>Eclipse 2027 Expedition</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 border-t border-[#e8dfd5] grid grid-cols-3 gap-4 text-xs text-[#6a6054]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#124e5b]" />
                  <span className="font-semibold">28 Verified Sights</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#124e5b]" />
                  <span className="font-semibold">Geographic Proximity</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#c25934]" />
                  <span className="font-semibold">Verified Wikimedia Photos</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Feature Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Card */}
                <div className="bg-white rounded-3xl p-4 shadow-xl border border-[#e8dfd5] space-y-4">
                  <div className="relative h-60 rounded-2xl overflow-hidden group">
                    <SafeImage
                      src="https://commons.wikimedia.org/wiki/Special:FilePath/Amphi%20El%20Jem.jpg"
                      alt="Amphitheatre of El Jem"
                      category="history"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#c25934] px-2 py-0.5 rounded-md w-fit mb-1 font-mono">
                        UNESCO World Heritage • El Jem & Mahdia
                      </span>
                      <h3 className="text-xl font-bold">Amphitheatre of El Jem</h3>
                      <p className="text-xs text-white/90 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-300" />
                        Mahdia Governorate, Central Tunisia
                      </p>
                    </div>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="bg-[#fcf9f5] p-3 rounded-xl border border-[#ede5da]">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#124e5b]">
                        <SunMedium className="w-4 h-4 text-[#c25934]" />
                        <span>August 2027 Totality</span>
                      </div>
                      <p className="text-[11px] text-[#786e63] mt-1 leading-tight">
                        5m 40s darkness along southern salt basins and desert bluffs.
                      </p>
                    </div>
                    <div className="bg-[#fcf9f5] p-3 rounded-xl border border-[#ede5da]">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#124e5b]">
                        <Compass className="w-4 h-4 text-[#124e5b]" />
                        <span>Regional Intelligence</span>
                      </div>
                      <p className="text-[11px] text-[#786e63] mt-1 leading-tight">
                        Routes prioritize sights in your staying area before crossing regions.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Clean Feature Badge (Replacing the premature sample pass) */}
                <div className="absolute -bottom-5 -left-3 sm:-left-5 bg-[#124e5b] text-white p-3 rounded-2xl shadow-xl flex items-center gap-3 border border-white/20">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center font-bold text-amber-300">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <div className="text-[10px] tracking-wider uppercase text-teal-200 font-bold">
                      Autonomous Planner
                    </div>
                    <div className="text-xs font-bold text-white">Geographic Coherence Engine</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2027 Total Solar Eclipse Spotlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c2f37] via-[#124e5b] to-[#263c43] text-white p-6 sm:p-10 shadow-xl border border-[#216574]">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <SunMedium className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '10s' }} />
                <span>The Celestial Event of the Decade</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-snug">
                August 2, 2027 Total Solar Eclipse in Tunisia
              </h2>
              <p className="text-sm sm:text-base text-gray-200 leading-relaxed max-w-2xl">
                The moon will completely blot out the sun across central and southern Tunisia for up to 5 minutes and 40 seconds. Chott el Djerid, Tozeur, Kebili, Douz, and Kerkennah sit directly under the centerline of totality. Our AI itinerary planner pairs totality viewing sites with verified eclipse-view desert lodges.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => (onOpenEclipse ? onOpenEclipse() : onStartPlanner('Eclipse 2027', 'Tozeur'))}
                  className="px-5 py-2.5 bg-[#c25934] hover:bg-[#b04a27] text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <SunMedium className="w-4 h-4 text-amber-300" />
                  <span>Explore Eclipse Expedition & Safety →</span>
                </button>
                <div className="text-xs text-amber-200/90 font-medium">
                  ✦ Centerline: Kebili • Chott el Djerid • Tozeur • Kerkennah
                </div>
              </div>
            </div>

            {/* Mini Eclipse Lodges card */}
            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center justify-between">
                <span>Featured Eclipse Lodges</span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Totality Ready</span>
              </div>
              <div className="space-y-2">
                {eclipseHotels.slice(0, 3).map((h) => (
                  <div key={h.id} className="bg-black/30 p-2.5 rounded-xl text-xs flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white">{h.name}</div>
                      <div className="text-[11px] text-gray-300 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#c25934]" /> {h.location} • {h.region}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-amber-300">{h.price_per_night_dt} DT</div>
                      <div className="text-[10px] text-gray-400">/ night</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Attractions Catalog Section */}
      <section ref={catalogRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-[#c25934] uppercase tracking-wider">
              Explore Destinations
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1b1917] tracking-tight">
              Curated Tunisian Attractions & Heritage
            </h2>
            <p className="text-sm text-[#665e55] mt-1">
              Browse 28 authentic sights organized by region with verified Wikimedia Commons imagery.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, region, or city..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-[#e4dbd0] rounded-xl focus:ring-2 focus:ring-[#c25934] focus:outline-none"
            />
            <Search className="w-4 h-4 text-[#8a7f72] absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Filter Controls: Category & Region */}
        <div className="space-y-2.5">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-[#c25934] text-white shadow-sm shadow-[#c25934]/30'
                    : 'bg-white text-[#4f483f] border border-[#e6ded5] hover:border-[#c25934] hover:text-[#c25934]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Region Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
            <span className="text-[11px] font-bold text-[#7d7265] whitespace-nowrap mr-1">
              Region:
            </span>
            <button
              onClick={() => setSelectedRegion('all')}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedRegion === 'all'
                  ? 'bg-[#124e5b] text-white font-bold'
                  : 'bg-[#f0ebe3] text-[#5c544a] hover:bg-[#e4ddd4]'
              }`}
            >
              All Regions
            </button>
            {regionsList.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedRegion === reg
                    ? 'bg-[#124e5b] text-white font-bold'
                    : 'bg-[#f0ebe3] text-[#5c544a] hover:bg-[#e4ddd4]'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        {/* Attractions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAttractions.map((attraction) => (
            <div
              key={attraction.id}
              className="group bg-white rounded-2xl border border-[#e8dfd5] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col"
            >
              {/* Image Box */}
              <div className="relative h-48 overflow-hidden bg-stone-100">
                <SafeImage
                  src={attraction.image_url}
                  alt={attraction.name}
                  category={attraction.category}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs ${
                      attraction.category === 'eclipse_viewing'
                        ? 'bg-amber-500 text-stone-900 font-extrabold'
                        : attraction.category === 'desert'
                        ? 'bg-[#c25934] text-white'
                        : attraction.category === 'beach'
                        ? 'bg-cyan-700 text-white'
                        : attraction.category === 'culture'
                        ? 'bg-[#124e5b] text-white'
                        : 'bg-stone-800 text-white'
                    }`}
                  >
                    {attraction.category.replace('_', ' ')}
                  </span>
                </div>

                {/* Price Pill */}
                <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
                  {attraction.price_dt === 0 ? 'Free Entry' : `${attraction.price_dt} DT`}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-[#8c8276] font-medium">
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#c25934] shrink-0" />
                      <span className="truncate">{attraction.location}</span>
                    </span>
                    <span className="text-[10px] font-semibold text-[#124e5b] bg-[#ebf5f7] px-1.5 py-0.5 rounded shrink-0">
                      {attraction.region.split('&')[0].trim()}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-[#1e1c1a] group-hover:text-[#c25934] transition-colors leading-snug line-clamp-1">
                    {attraction.name}
                  </h3>
                  <p className="text-xs text-[#61574d] line-clamp-2 leading-relaxed">
                    {attraction.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#f0e8de] flex items-center justify-between text-[11px] text-[#756b61]">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#124e5b]" />
                    <span>~{attraction.duration_hours}h duration</span>
                  </div>

                  <button
                    onClick={() => setPreviewModalAttraction(attraction)}
                    className="text-xs font-bold text-[#124e5b] hover:text-[#c25934] flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3 h-3" />
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAttractions.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#e0d6cb] p-8">
            <Compass className="w-8 h-8 text-[#a69c91] mx-auto mb-2 animate-bounce" />
            <h4 className="font-bold text-sm text-[#4a443d]">No attractions found</h4>
            <p className="text-xs text-[#7e7469] mt-1">
              Try adjusting your search keywords or switching category/region filters.
            </p>
          </div>
        )}
      </section>

      {/* Accommodations Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="text-xs font-bold text-[#124e5b] uppercase tracking-wider">
              Where to Stay
            </div>
            <h2 className="text-2xl font-extrabold text-[#1b1917] tracking-tight">
              Featured Stays & Lodges
            </h2>
            <p className="text-sm text-[#665e55]">
              Hand-picked accommodations matched to your destination and eclipse vantage point.
            </p>
          </div>
          <button
            onClick={() => onStartPlanner()}
            className="text-xs font-bold text-[#c25934] hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>Plan with lodging</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {hotels.slice(0, 4).map((hotel) => (
            <div
              key={hotel.id}
              className="bg-white rounded-2xl border border-[#e8dfd5] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="relative h-44 bg-stone-100">
                <SafeImage
                  src={hotel.image_url}
                  alt={hotel.name}
                  category="hotel"
                  className="w-full h-full object-cover"
                />
                {hotel.has_eclipse_view && (
                  <div className="absolute top-3 left-3 bg-amber-500 text-stone-950 text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-xs">
                    Eclipse View Terrace
                  </div>
                )}
                <div className="absolute bottom-3 right-3 bg-black/75 text-white text-xs font-bold px-2 py-0.5 rounded">
                  {hotel.price_per_night_dt} DT / night
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between text-xs text-[#8c8276] mb-1 font-medium">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#c25934]" />
                      <span>{hotel.location}</span>
                    </span>
                    <span className="text-[10px] text-[#124e5b] font-semibold">{hotel.region}</span>
                  </div>
                  <h4 className="font-bold text-sm text-[#1e1c1a]">{hotel.name}</h4>
                  <p className="text-xs text-[#685e54] mt-1 line-clamp-2 leading-relaxed">
                    {hotel.description}
                  </p>
                </div>
                <div className="pt-2 border-t border-[#f0e8de] flex items-center justify-between text-xs">
                  <span className="text-[#877d73]">Rating: ⭐ {hotel.rating || 4.5}</span>
                  <span className="font-bold text-[#124e5b]">Prototype lodging</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Showcase (Clean workflow explanation without premature pass display) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-[#f5eee3] rounded-3xl p-6 sm:p-8 border border-[#e4dbd0] text-center space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-[#c25934]/10 text-[#c25934] flex items-center justify-center mx-auto">
            <Compass className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-black text-[#1e1c1a]">How PassTunisia Works</h3>
            <p className="text-xs sm:text-sm text-[#6b6257] max-w-lg mx-auto">
              A 3-step workflow from trip idea to confirmed digital travel pass.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-2">
            <div className="bg-white p-4 rounded-2xl border border-[#ded5c8] shadow-xs">
              <span className="w-6 h-6 rounded-full bg-[#c25934] text-white text-xs font-bold flex items-center justify-center mb-2">1</span>
              <div className="font-bold text-xs text-[#1f1d1a]">Plan Your Trip</div>
              <p className="text-[11px] text-[#6b6257] mt-1 leading-snug">Set your dates, base city, interests & budget in our Trip Planner.</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#ded5c8] shadow-xs">
              <span className="w-6 h-6 rounded-full bg-[#124e5b] text-white text-xs font-bold flex items-center justify-center mb-2">2</span>
              <div className="font-bold text-xs text-[#1f1d1a]">Customize Stops</div>
              <p className="text-[11px] text-[#6b6257] mt-1 leading-snug">AI groups geographically close sights and handles inter-region travel.</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#ded5c8] shadow-xs">
              <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center mb-2">3</span>
              <div className="font-bold text-xs text-[#1f1d1a]">Receive Digital Pass</div>
              <p className="text-[11px] text-[#6b6257] mt-1 leading-snug">Confirm with your name & email to instantly get your verified pass & QR ticket.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onStartPlanner()}
              className="px-6 py-2.5 bg-[#c25934] hover:bg-[#b04a27] text-white font-bold text-xs sm:text-sm rounded-xl cursor-pointer shadow-md"
            >
              Start Planning Now
            </button>
            {onOpenHowItWorks && (
              <button
                onClick={onOpenHowItWorks}
                className="px-4 py-2.5 bg-white border border-[#d6ccbf] hover:bg-stone-50 text-[#4d453b] font-bold text-xs sm:text-sm rounded-xl cursor-pointer flex items-center gap-1.5"
              >
                <Info className="w-4 h-4 text-[#124e5b]" />
                <span>See Pass Example</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      {previewModalAttraction && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#ded5ca] animate-in fade-in">
            <div className="relative h-56 bg-stone-100">
              <SafeImage
                src={previewModalAttraction.image_url}
                alt={previewModalAttraction.name}
                category={previewModalAttraction.category}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setPreviewModalAttraction(null)}
                className="absolute top-3 right-3 bg-black/60 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#c25934] bg-[#fdf5f0] px-2 py-0.5 rounded">
                    {previewModalAttraction.category.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#124e5b] bg-[#ebf5f7] px-2 py-0.5 rounded">
                    {previewModalAttraction.region}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#1b1917] mt-1.5">
                  {previewModalAttraction.name}
                </h3>
                <p className="text-xs text-[#80766a] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#c25934]" />
                  {previewModalAttraction.location}
                </p>
              </div>

              <p className="text-sm text-[#544c43] leading-relaxed">
                {previewModalAttraction.description}
              </p>

              <div className="grid grid-cols-2 gap-3 bg-[#faf7f2] p-3 rounded-xl border border-[#ede5da] text-xs">
                <div>
                  <span className="text-[#8a8074] block">Opening Hours:</span>
                  <span className="font-bold text-[#2d2823]">{previewModalAttraction.opening_hours}</span>
                </div>
                <div>
                  <span className="text-[#8a8074] block">Estimated Duration:</span>
                  <span className="font-bold text-[#2d2823]">~{previewModalAttraction.duration_hours} hours</span>
                </div>
                <div>
                  <span className="text-[#8a8074] block">Admission:</span>
                  <span className="font-bold text-[#c25934]">
                    {previewModalAttraction.price_dt === 0 ? 'Free' : `${previewModalAttraction.price_dt} DT`}
                  </span>
                </div>
                <div>
                  <span className="text-[#8a8074] block">Region:</span>
                  <span className="font-bold text-[#124e5b]">
                    {previewModalAttraction.region}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setPreviewModalAttraction(null)}
                  className="flex-1 py-2.5 rounded-xl border border-[#ddd2c5] text-xs font-bold text-[#5c544c] hover:bg-stone-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const loc = previewModalAttraction.location.split('/')[0].trim();
                    setPreviewModalAttraction(null);
                    onStartPlanner(
                      previewModalAttraction.category === 'eclipse_viewing' ? 'Eclipse 2027' : undefined,
                      loc
                    );
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#c25934] text-white text-xs font-bold hover:bg-[#b04a27] shadow-sm cursor-pointer"
                >
                  Plan Route Here
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
