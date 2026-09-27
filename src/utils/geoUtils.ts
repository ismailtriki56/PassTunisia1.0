import { Attraction, Hotel } from '../types';

export interface LatLng {
  lat: number;
  lng: number;
}

// Known coordinates for Tunisian destinations
export const TUNISIAN_CITY_COORDINATES: Record<string, LatLng> = {
  tozeur: { lat: 33.9197, lng: 8.1335 },
  nefta: { lat: 33.8731, lng: 7.8778 },
  kebili: { lat: 33.7044, lng: 8.9690 },
  douz: { lat: 33.4663, lng: 9.0203 },
  tunis: { lat: 36.8065, lng: 10.1815 },
  carthage: { lat: 36.8529, lng: 10.3235 },
  'sidi bou said': { lat: 36.8703, lng: 10.3414 },
  sousse: { lat: 35.8288, lng: 10.6380 },
  monastir: { lat: 35.7761, lng: 10.8329 },
  mahdia: { lat: 35.5047, lng: 11.0622 },
  'el jem': { lat: 35.2965, lng: 10.7069 },
  djem: { lat: 35.2965, lng: 10.7069 },
  kairouan: { lat: 35.6814, lng: 10.1039 },
  djerba: { lat: 33.8750, lng: 10.8572 },
  zarzis: { lat: 33.5040, lng: 11.1122 },
  tataouine: { lat: 32.9333, lng: 10.4500 },
  matmata: { lat: 33.5428, lng: 9.9672 },
  tabarka: { lat: 36.9544, lng: 8.7580 },
  bizerte: { lat: 37.2746, lng: 9.8739 },
  nabeul: { lat: 36.4561, lng: 10.7376 },
  hammamet: { lat: 36.4000, lng: 10.6167 },
  zaghouan: { lat: 36.3986, lng: 10.1428 },
  gafsa: { lat: 34.4250, lng: 8.7842 },
  sbeitla: { lat: 35.2392, lng: 9.1292 },
  kerkennah: { lat: 34.7180, lng: 11.1680 },
  sfax: { lat: 34.7406, lng: 10.7603 },
  beja: { lat: 36.7256, lng: 9.1817 },
  dougga: { lat: 36.4225, lng: 9.2192 }
};

export function getCoordinatesForLocation(locationStr: string): LatLng {
  const norm = locationStr.toLowerCase().trim();
  for (const [key, coords] of Object.entries(TUNISIAN_CITY_COORDINATES)) {
    if (norm.includes(key)) {
      return coords;
    }
  }
  // Default to Tunis if location not specifically matched
  return TUNISIAN_CITY_COORDINATES.tunis;
}

/**
 * Calculates great-circle distance between two points on the Earth's surface using Haversine formula
 * Returns distance in kilometers (km)
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export interface AttractionWithDistance extends Attraction {
  distanceKm: number;
}

/**
 * Programmatically filters attractions around the staying location:
 * - Initially filters attractions within roughly 100km.
 * - If fewer than 5 matches exist, widens to 200km.
 * - If still fewer than 5, returns the closest 6 attractions sorted by distance.
 */
export function filterAttractionsByProximity(
  stayingLocation: string,
  allAttractions: Attraction[]
): AttractionWithDistance[] {
  const origin = getCoordinatesForLocation(stayingLocation);

  const withDistances: AttractionWithDistance[] = allAttractions.map((att) => ({
    ...att,
    distanceKm: calculateDistanceKm(origin.lat, origin.lng, att.lat, att.lng)
  }));

  // Sort ascending by distance
  withDistances.sort((a, b) => a.distanceKm - b.distanceKm);

  // Filter <= 100km
  const within100km = withDistances.filter((a) => a.distanceKm <= 100);
  if (within100km.length >= 5) {
    return within100km;
  }

  // Widen to <= 200km
  const within200km = withDistances.filter((a) => a.distanceKm <= 200);
  if (within200km.length >= 5) {
    return within200km;
  }

  // Return the closest 6-8 attractions
  return withDistances.slice(0, Math.min(8, withDistances.length));
}

/**
 * Filters hotels prioritizing those closest to the staying location
 */
export function filterHotelsByProximity(
  stayingLocation: string,
  allHotels: Hotel[],
  preferEclipse?: boolean
): (Hotel & { distanceKm: number })[] {
  const origin = getCoordinatesForLocation(stayingLocation);

  const hotelsWithDistance = allHotels.map((h) => {
    const hotelCoords = getCoordinatesForLocation(h.location);
    return {
      ...h,
      distanceKm: calculateDistanceKm(origin.lat, origin.lng, hotelCoords.lat, hotelCoords.lng)
    };
  });

  // Sort by eclipse preference if requested, then by distance
  hotelsWithDistance.sort((a, b) => {
    if (preferEclipse && a.has_eclipse_view !== b.has_eclipse_view) {
      return a.has_eclipse_view ? -1 : 1;
    }
    return a.distanceKm - b.distanceKm;
  });

  return hotelsWithDistance;
}

/**
 * Builds a geographically accurate fallback itinerary based on staying location
 * Ensures Tozeur never gets Tunis attractions even in fallback mode!
 */
export function getDynamicFallbackItinerary(
  stayingLocation: string,
  allAttractions: Attraction[],
  allHotels: Hotel[],
  diffDays: number = 2,
  interests: string[] = []
): { days: { day: number; stops: { attraction_id: number; reason: string; selected: boolean }[] }[]; suggested_hotel_id: number } {
  const preferEclipse = interests.some((i) => i.toLowerCase().includes('eclipse'));
  const nearbyAttractions = filterAttractionsByProximity(stayingLocation, allAttractions);
  const nearbyHotels = filterHotelsByProximity(stayingLocation, allHotels, preferEclipse);

  const suggestedHotel = nearbyHotels[0] || allHotels[0];
  const numDays = Math.max(1, Math.min(diffDays || 2, 7));

  // Distribute nearby attractions across days (2-3 stops per day)
  const stopsPerDay = 2;
  const days: { day: number; stops: { attraction_id: number; reason: string; selected: boolean }[] }[] = [];

  let attIndex = 0;
  for (let d = 1; d <= numDays; d++) {
    const dayStops: { attraction_id: number; reason: string; selected: boolean }[] = [];
    for (let s = 0; s < stopsPerDay; s++) {
      if (attIndex < nearbyAttractions.length) {
        const att = nearbyAttractions[attIndex];
        const distText = att.distanceKm === 0 ? 'Within base city' : `${att.distanceKm} km from ${stayingLocation}`;
        dayStops.push({
          attraction_id: att.id,
          reason: `${distText}: Visit ${att.name} in the ${att.region}. Ideal for ${att.category} enthusiasts.`,
          selected: true
        });
        attIndex++;
      } else if (nearbyAttractions.length > 0) {
        // Reuse in circular fashion if trip has more days than nearby attractions
        const att = nearbyAttractions[attIndex % nearbyAttractions.length];
        dayStops.push({
          attraction_id: att.id,
          reason: `Nearby site (${att.distanceKm} km): Explore ${att.name} at your own pace.`,
          selected: true
        });
        attIndex++;
      }
    }
    if (dayStops.length > 0) {
      days.push({ day: d, stops: dayStops });
    }
  }

  return {
    days: days.length > 0 ? days : [
      {
        day: 1,
        stops: nearbyAttractions.slice(0, 2).map((a) => ({
          attraction_id: a.id,
          reason: `Nearby exploration (${a.distanceKm} km): ${a.name}`,
          selected: true
        }))
      }
    ],
    suggested_hotel_id: suggestedHotel ? suggestedHotel.id : 1
  };
}
