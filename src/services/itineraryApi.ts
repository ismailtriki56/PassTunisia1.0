import { DEFAULT_FALLBACK_ITINERARY } from '../data/travelData';
import { ItineraryResult, TripPlannerInput } from '../types';

export async function generateItinerary(input: TripPlannerInput): Promise<ItineraryResult> {
  try {
    const response = await fetch('/api/generate-itinerary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      console.warn('API returned non-OK status, falling back to default itinerary');
      return DEFAULT_FALLBACK_ITINERARY;
    }

    const data = await response.json();
    if (data && Array.isArray(data.days) && data.days.length > 0) {
      return data;
    }
    return DEFAULT_FALLBACK_ITINERARY;
  } catch (err) {
    console.error('Failed to call itinerary API, returning fallback:', err);
    return DEFAULT_FALLBACK_ITINERARY;
  }
}
