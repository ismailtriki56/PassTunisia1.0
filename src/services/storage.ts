import { Booking } from '../types';

const STORAGE_KEY = 'passtunisia_bookings';

export function getStoredBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    // Filter out any legacy prototype sample seeds
    const cleanList = parsed.filter(b => b && b.pass_id && b.pass_id !== 'TN-2026-ECL8' && b.id !== 'b-seed-1');
    return cleanList;
  } catch {
    return [];
  }
}

export function saveBooking(booking: Booking): void {
  try {
    const current = getStoredBookings();
    const updated = [booking, ...current.filter(b => b.pass_id !== booking.pass_id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Also attempt background sync with server
    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    }).catch(err => {
      console.warn('Backend booking sync notice (offline or local mode):', err);
    });
  } catch (e) {
    console.error('Failed to save booking to localStorage:', e);
  }
}

export async function fetchBookingByPassId(passId: string): Promise<Booking | null> {
  const localList = getStoredBookings();
  const foundLocal = localList.find(b => b.pass_id.toUpperCase() === passId.trim().toUpperCase());

  try {
    const res = await fetch(`/api/bookings/${encodeURIComponent(passId.trim())}`);
    if (res.ok) {
      const serverBooking = await res.json();
      if (serverBooking && serverBooking.pass_id) {
        saveBooking(serverBooking);
        return serverBooking;
      }
    }
  } catch {
    // network or dev fallback
  }

  return foundLocal || null;
}

export function generatePassId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TN-2026-${rand}`;
}
