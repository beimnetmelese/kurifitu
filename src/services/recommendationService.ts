import { predictGuestValue } from './predictionService.ts';

type GuestProfile = {
  name?: string;
  segment?: string;
  predictedSpend?: number;
  preferences?: string[];
  purchaseLikelihood?: number;
};

const SERVICE_MAP: Record<string, string[]> = {
  spa: ['Spa Session', 'Wellness Package'],
  'fine dining': ['Chef Tasting Menu', 'Sunset Dining Experience'],
  dining: ['Chef Tasting Menu', 'Sunset Dining Experience'],
  'kids club': ['Kids Club Access', 'Family Activity Pass'],
  'poolside dining': ['Poolside Dining Credit', 'Family Lunch Bundle'],
  'airport transfer': ['Private Airport Transfer', 'Priority Check-In'],
  'express laundry': ['Business Laundry Express', 'Meeting Day Garment Service'],
  'breakfast bundle': ['Breakfast + Late Checkout', 'Cafe Credit Bundle'],
  'city tour': ['Guided City Tour', 'Local Experience Pass'],
};

export function getRecommendations(guest: GuestProfile): string[] {
  if (!guest || !Array.isArray(guest.preferences)) return [];

  const normalized = guest.preferences.map((item) => String(item).toLowerCase());
  const mapped = normalized.flatMap((preference) => SERVICE_MAP[preference] || []);

  if (mapped.length === 0) return ['Welcome Amenity', 'Late Checkout Option'];

  return [...new Set(mapped)].slice(0, 3);
}

export function getPurchaseLikelihood(guest: GuestProfile): number {
  const baseline = Number(guest?.purchaseLikelihood) || 0;
  const preferenceBoost = Array.isArray(guest?.preferences)
    ? Math.min(guest.preferences.length * 0.03, 0.12)
    : 0;

  return Math.min(0.95, baseline + preferenceBoost);
}

export function generatePersonalizedMessage(guest: GuestProfile): string {
  const recommendation = getRecommendations(guest)[0] || 'exclusive resort experiences';
  const likelihood = Math.round(getPurchaseLikelihood(guest) * 100);
  return `AI recommendation: Offer ${recommendation} to ${guest?.name || 'this guest'} (${likelihood}% purchase likelihood).`;
}

export function calculateUpsellStats(guestList: GuestProfile[] = []): {
  avgPurchaseLikelihood: number;
  estimatedUpsellRevenue: number;
} {
  if (!Array.isArray(guestList) || guestList.length === 0) {
    return {
      avgPurchaseLikelihood: 0,
      estimatedUpsellRevenue: 0,
    };
  }

  const totalLikelihood = guestList.reduce((sum, guest) => {
    return sum + getPurchaseLikelihood(guest);
  }, 0);

  const estimatedUpsellRevenue = guestList.reduce((sum, guest) => {
    const guestValue = predictGuestValue(guest);
    return sum + guestValue * getPurchaseLikelihood(guest) * 0.18;
  }, 0);

  return {
    avgPurchaseLikelihood: totalLikelihood / guestList.length,
    estimatedUpsellRevenue,
  };
}
