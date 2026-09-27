export type AttractionCategory = 'history' | 'culture' | 'beach' | 'desert' | 'eclipse_viewing';

export interface Attraction {
  id: number;
  name: string;
  category: AttractionCategory;
  location: string;
  region: string;
  description: string;
  opening_hours: string;
  price_dt: number;
  duration_hours: number;
  lat: number;
  lng: number;
  image_url: string;
  fallback_image_url?: string;
}

export interface Hotel {
  id: number;
  name: string;
  location: string;
  region: string;
  has_eclipse_view: boolean;
  price_per_night_dt: number;
  description: string;
  image_url: string;
  fallback_image_url?: string;
  rating?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface ItineraryStop {
  attraction_id: number;
  reason: string;
  selected?: boolean;
}

export interface ItineraryDay {
  day: number;
  stops: ItineraryStop[];
}

export interface ItineraryResult {
  days: ItineraryDay[];
  suggested_hotel_id: number | null;
}

export interface TripPlannerInput {
  stayingLocation: string;
  startDate: string;
  endDate: string;
  numberOfPeople: number;
  interests: string[];
  budgetDt: number;
}

export interface Booking {
  id: string;
  pass_id: string;
  traveler_name: string;
  traveler_email: string;
  selected_attraction_ids: number[];
  selected_hotel_id: number | null;
  trip_dates: {
    start: string;
    end: string;
  };
  number_of_people: number;
  status: string;
  total_cost_dt: number;
  created_at: string;
}
