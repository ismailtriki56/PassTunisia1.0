import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { TripPlannerPage } from './components/TripPlannerPage';
import { ItineraryResultsPage } from './components/ItineraryResultsPage';
import { MyPassPage } from './components/MyPassPage';
import { EclipsePage } from './components/EclipsePage';
import { HowItWorksModal } from './components/HowItWorksModal';
import { TunisiaLogo } from './components/TunisiaLogo';
import { ATTRACTIONS_DATA, HOTELS_DATA, DEFAULT_FALLBACK_ITINERARY } from './data/travelData';
import { generateItinerary } from './services/itineraryApi';
import {
  Booking,
  ItineraryResult,
  TripPlannerInput,
  Attraction,
  Hotel
} from './types';
import {
  fetchBookingByPassId,
  saveBooking,
  getStoredBookings
} from './services/storage';
import { Compass, SunMedium } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'planner' | 'itinerary' | 'pass' | 'eclipse'>('home');
  const [attractions] = useState<Attraction[]>(ATTRACTIONS_DATA);
  const [hotels] = useState<Hotel[]>(HOTELS_DATA);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  // Default trip inputs
  const [tripInput, setTripInput] = useState<TripPlannerInput>({
    stayingLocation: 'Tunis',
    startDate: '2026-10-01',
    endDate: '2026-10-04',
    numberOfPeople: 2,
    interests: ['History', 'Culture'],
    budgetDt: 1200,
  });

  const [itinerary, setItinerary] = useState<ItineraryResult | null>(null);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [plannerPrefillInterest, setPlannerPrefillInterest] = useState<string | undefined>();
  const [plannerPrefillLocation, setPlannerPrefillLocation] = useState<string | undefined>();

  // Check URL on load ONLY if user navigated to a specific /pass/:passId or ?pass=:passId
  useEffect(() => {
    const handleUrlRoute = async () => {
      const pathname = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      const queryPass = searchParams.get('pass');

      let targetPassId: string | null = null;

      if (pathname.startsWith('/pass/')) {
        targetPassId = pathname.replace('/pass/', '').trim();
      } else if (queryPass) {
        targetPassId = queryPass.trim();
      }

      if (targetPassId) {
        const found = await fetchBookingByPassId(targetPassId);
        if (found) {
          setCurrentBooking(found);
          setActiveTab('pass');
        } else {
          // If pass not found, do NOT show a fake pass
          setCurrentBooking(null);
          setActiveTab('pass');
        }
      }
    };

    handleUrlRoute();

    window.addEventListener('popstate', handleUrlRoute);
    return () => window.removeEventListener('popstate', handleUrlRoute);
  }, []);

  // Sync route in browser history when switching to or looking up a pass
  const navigateToPass = (passId: string, bookingObj?: Booking) => {
    if (bookingObj) {
      setCurrentBooking(bookingObj);
    }
    const newPath = `/pass/${encodeURIComponent(passId)}`;
    window.history.pushState({ passId }, '', newPath);
    setActiveTab('pass');
  };

  const handleStartPlanner = (initialInterest?: string, initialLocation?: string) => {
    setPlannerPrefillInterest(initialInterest);
    setPlannerPrefillLocation(initialLocation);
    if (initialInterest === 'Eclipse 2027') {
      setTripInput((prev) => ({
        ...prev,
        stayingLocation: initialLocation || 'Tozeur',
        startDate: '2027-08-01',
        endDate: '2027-08-03',
        interests: ['Eclipse 2027', 'Desert', 'Culture'],
      }));
    }
    setActiveTab('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlanSubmit = async (input: TripPlannerInput) => {
    setTripInput(input);
    setIsLoading(true);
    setActiveTab('itinerary');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const result = await generateItinerary(input);
      setItinerary(result);
    } catch (err) {
      console.error('Itinerary generation error:', err);
      setItinerary(DEFAULT_FALLBACK_ITINERARY);
    } finally {
      setIsLoading(false);
    }
  };

  // The ONLY place where a booking and pass are generated and displayed!
  const handleConfirmBooking = (booking: Booking) => {
    saveBooking(booking);
    setCurrentBooking(booking);
    navigateToPass(booking.pass_id, booking);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPass = async (passId: string) => {
    setIsLoading(true);
    const found = await fetchBookingByPassId(passId);
    setIsLoading(false);
    if (found) {
      navigateToPass(found.pass_id, found);
    } else {
      setCurrentBooking(null);
      navigateToPass(passId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2] text-[#242220]">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'pass') {
            window.history.pushState(null, '', '/');
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        hasItinerary={Boolean(itinerary)}
        activePassId={currentBooking?.pass_id}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            attractions={attractions}
            hotels={hotels}
            onStartPlanner={handleStartPlanner}
            onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
            onOpenEclipse={() => {
              setActiveTab('eclipse');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'planner' && (
          <TripPlannerPage
            initialInterest={plannerPrefillInterest}
            initialLocation={plannerPrefillLocation}
            onSubmitPlan={handlePlanSubmit}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'itinerary' && (
          <ItineraryResultsPage
            itinerary={itinerary}
            tripInput={tripInput}
            attractions={attractions}
            hotels={hotels}
            isLoading={isLoading}
            onConfirmBooking={handleConfirmBooking}
            onBackToPlanner={() => {
              setActiveTab('planner');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'eclipse' && (
          <EclipsePage
            attractions={attractions}
            hotels={hotels}
            onBookExpedition={handleConfirmBooking}
            onGoToPlanner={() => {
              setActiveTab('planner');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'pass' && (
          <MyPassPage
            booking={currentBooking}
            attractions={attractions}
            hotels={hotels}
            onBackToPlanner={() => {
              setActiveTab('planner');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectAnotherPass={handleSelectPass}
          />
        )}
      </main>

      {/* "How It Works" Separate Modal with clearly labeled Example Pass Specimen */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onStartPlanning={() => {
          setIsHowItWorksOpen(false);
          handleStartPlanner();
        }}
      />

      {/* Footer */}
      <footer className="no-print bg-[#f4efe8] border-t border-[#e5dcd1] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2">
                <TunisiaLogo size="sm" showSubtitle={false} />
              </div>
              <p className="text-xs text-[#6e6459] max-w-sm leading-relaxed">
                Autonomous itinerary synthesis and digital tourism pass system. Prioritizes geographic proximity, genuine Wikimedia Commons photography, and certified Eclipse 2027 totality logistics.
              </p>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#124e5b] bg-[#ebf5f7] px-3 py-1 rounded-lg">
                <SunMedium className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '10s' }} />
                <span>Total Solar Eclipse: August 2, 2027 Totality in the Sahara</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-extrabold uppercase tracking-wider text-[#474037]">
                Key Regions
              </h4>
              <ul className="space-y-1 text-[#6e6459]">
                <li>Tunis & Carthage area</li>
                <li>Cap Bon & Nabeul area</li>
                <li>Bizerte & Ichkeul area</li>
                <li>Sahel & Monastir area</li>
                <li>Tozeur & Chott Djerid area</li>
                <li>Kebili & Douz Sahara area</li>
                <li>Matmata & Tataouine area</li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-extrabold uppercase tracking-wider text-[#474037]">
                Prototype Notice
              </h4>
              <p className="text-[#786d62] leading-relaxed">
                PassTunisia is a demonstration application. Digital passes are issued only after itinerary planning and booking confirmation.
              </p>
              <button
                onClick={() => setIsHowItWorksOpen(true)}
                className="text-xs font-bold text-[#c25934] hover:underline cursor-pointer"
              >
                View Workflow & Example Pass Specimen →
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-[#e2d8cb] flex flex-col sm:flex-row items-center justify-between text-xs text-[#877c71] gap-2">
            <div>
              © 2026 PassTunisia. Built with Google AI Studio.
            </div>
            <div className="flex items-center gap-4">
              <span>Prototype Demo</span>
              <span>•</span>
              <span>Tunisian Tourism Initiative</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
