import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import {
  ATTRACTIONS_DATA,
  HOTELS_DATA,
  DEFAULT_FALLBACK_ITINERARY,
  getRegionForLocation,
  ADJACENT_REGIONS
} from './src/data/travelData.ts';
import {
  filterAttractionsByProximity,
  filterHotelsByProximity,
  getCoordinatesForLocation,
  calculateDistanceKm,
  getDynamicFallbackItinerary
} from './src/utils/geoUtils.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-memory bookings store (starts clean, no premature sample seeds!)
const bookingsMap = new Map<string, any>();

// Dynamic Gemini Client getter ensuring live environment key detection
function getGeminiClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Routes
app.get('/api/attractions', (_req, res) => {
  res.json(ATTRACTIONS_DATA);
});

app.get('/api/hotels', (_req, res) => {
  res.json(HOTELS_DATA);
});

app.get('/api/bookings/:passId', (req, res) => {
  const { passId } = req.params;
  const booking = bookingsMap.get(passId);
  if (!booking) {
    return res.status(404).json({ error: 'Pass not found' });
  }
  return res.json(booking);
});

app.post('/api/bookings', (req, res) => {
  const booking = req.body;
  if (!booking || !booking.pass_id) {
    return res.status(400).json({ error: 'Invalid booking data' });
  }
  bookingsMap.set(booking.pass_id, booking);
  return res.status(201).json(booking);
});

// AI Itinerary Generation with Strict Programmatic Geographic Proximity Pre-Filtering
app.post('/api/generate-itinerary', async (req, res) => {
  const { stayingLocation, startDate, endDate, numberOfPeople, interests, budgetDt } = req.body;

  let diffDays = 2;
  try {
    if (startDate && endDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      const d = Math.round((e.getTime() - s.getTime()) / (1000 * 3600 * 24));
      if (d > 0) diffDays = Math.min(7, d);
    }
  } catch {
    diffDays = 2;
  }

  const baseLocation = stayingLocation || 'Tunis';
  const userRegion = getRegionForLocation(baseLocation);
  const isEclipseRequested = Array.isArray(interests) && interests.some((i: string) =>
    i.toLowerCase().includes('eclipse')
  );

  // PROGRAMMATIC PRE-FILTERING BEFORE CALLING GEMINI:
  // Given user's staying location, calculate distance using lat/lng already in data,
  // and only pass attractions within roughly 100km of the user's stated location into the Gemini prompt as candidates
  // (unless fewer than 5 matches exist, in which case widen to 200km).
  const candidateAttractions = filterAttractionsByProximity(baseLocation, ATTRACTIONS_DATA);

  // If eclipse requested, ensure southern eclipse_viewing attractions in totality path are also eligible
  if (isEclipseRequested) {
    const eclipseAttractions = ATTRACTIONS_DATA.filter((a) => a.category === 'eclipse_viewing');
    const origin = getCoordinatesForLocation(baseLocation);
    for (const ea of eclipseAttractions) {
      if (!candidateAttractions.some((ca) => ca.id === ea.id)) {
        candidateAttractions.push({
          ...ea,
          distanceKm: calculateDistanceKm(origin.lat, origin.lng, ea.lat, ea.lng)
        });
      }
    }
  }

  // Pre-filter candidate hotels prioritizing proximity and eclipse view
  const candidateHotels = filterHotelsByProximity(baseLocation, HOTELS_DATA, isEclipseRequested).slice(0, 5);

  console.log(`[Itinerary Generator] Staying: "${baseLocation}" | Region: "${userRegion}" | Candidates: ${candidateAttractions.length} attractions within range, ${candidateHotels.length} hotels.`);

  let eclipseGuidance = '';
  if (isEclipseRequested) {
    eclipseGuidance = '\nSPECIAL REQUIREMENT: "Eclipse 2027" is requested. You MUST include at least one eclipse_viewing attraction (e.g. Chott el Djerid, Kebili Ridge) and suggest an eclipse-view hotel.';
  }

  const prompt = `You are a Tunisia trip planning assistant. Given the PRE-FILTERED nearby attractions and hotels data below, return ONLY valid JSON in this exact shape, no markdown, no extra text: {"days":[{"day":1,"stops":[{"attraction_id":1,"reason":"..."}]}],"suggested_hotel_id":1}

USER TRIP INPUTS:
- Staying location: ${baseLocation} (${userRegion})
- Trip Dates: ${startDate || '2026-10-01'} to ${endDate || '2026-10-03'} (${diffDays} days)
- Travelers: ${numberOfPeople || 2}
- Selected Interests: ${Array.isArray(interests) ? interests.join(', ') : 'history, culture'}
- Total Budget in DT: ${budgetDt || 1000} DT
${eclipseGuidance}

MANDATORY GEOGRAPHIC RULES:
1. ONLY select attractions from the candidate list below (all have been verified as nearby to ${baseLocation}).
2. Do NOT hallucinate attractions that are not in this candidate list.
3. In each stop's reason, mention the realistic activity and proximity.
4. Select suggested_hotel_id from the candidate hotels list below.

CANDIDATE NEARBY ATTRACTIONS (Distance from ${baseLocation}):
${JSON.stringify(candidateAttractions.map(a => ({
  id: a.id,
  name: a.name,
  category: a.category,
  location: a.location,
  region: a.region,
  distance_km: a.distanceKm,
  price_dt: a.price_dt,
  duration_hours: a.duration_hours
})), null, 2)}

CANDIDATE HOTELS:
${JSON.stringify(candidateHotels.map(h => ({
  id: h.id,
  name: h.name,
  location: h.location,
  region: h.region,
  has_eclipse_view: h.has_eclipse_view,
  distance_km: h.distanceKm,
  price_per_night_dt: h.price_per_night_dt
})), null, 2)}
`;

  const ai = getGeminiClient();

  try {
    if (!ai) {
      console.warn('Gemini API key not configured. Returning dynamic geographically pre-filtered fallback itinerary.');
      return res.json(getDynamicFallbackItinerary(baseLocation, ATTRACTIONS_DATA, HOTELS_DATA, diffDays, interests || []));
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.2,
      },
    });

    const text = response.text || '';
    const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    if (!parsed || !Array.isArray(parsed.days) || parsed.days.length === 0) {
      throw new Error('Parsed response missing valid days array');
    }

    parsed.days.forEach((day: any) => {
      if (Array.isArray(day.stops)) {
        day.stops.forEach((stop: any) => {
          stop.selected = true;
        });
      }
    });

    return res.json(parsed);
  } catch (err) {
    console.error('Failed to generate itinerary with Gemini API, falling back to dynamic proximity itinerary:', err);
    return res.json(getDynamicFallbackItinerary(baseLocation, ATTRACTIONS_DATA, HOTELS_DATA, diffDays, interests || []));
  }
});

// Mount Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PassTunisia full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
