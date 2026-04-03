import { getDemandLevel } from '../utils/getDemandLevel.ts';

export type PricingRow = {
  roomType: string;
  currentPrice: number;
  baseDemand: number;
  seasonalityFactor: number;
  reason?: string;
};

export type PricingInsight = PricingRow & {
  demandLevel: ReturnType<typeof getDemandLevel>;
  optimizationReason: string;
  suggestedPrice: number;
  expectedLift: number;
};

function getOptimizationDemand(room: PricingRow): number {
  const baseDemand = Number(room?.baseDemand) || 0;
  const seasonalityFactor = Number(room?.seasonalityFactor) || 1;
  return baseDemand * seasonalityFactor;
}

function getDemandMultiplier(score: number): number {
  const demandLevel = getDemandLevel(score);
  if (demandLevel === 'High') return 1.16;
  if (demandLevel === 'Medium') return 1.08;
  return 0.94;
}

export function getRecommendedPrice(room: PricingRow): number {
  const basePrice = Number(room?.currentPrice) || 0;
  const optimizationDemand = getOptimizationDemand(room);
  const multiplier = getDemandMultiplier(optimizationDemand);
  return Math.round(basePrice * multiplier);
}

export function getPricingReason(room: PricingRow): string {
  const optimizationDemand = getOptimizationDemand(room);
  const demandLevel = getDemandLevel(optimizationDemand);

  if (demandLevel === 'High') {
    return 'High demand forecast detected. AI optimization increases rate to maximize revenue.';
  }
  if (demandLevel === 'Medium') {
    return 'Moderate demand expected. AI optimization applies a measured price uplift.';
  }
  return 'Lower demand period identified. AI optimization softens price to protect occupancy.';
}

export function calculateRevenueImpact(room: PricingRow): number {
  const currentPrice = Number(room?.currentPrice) || 0;
  return getRecommendedPrice(room) - currentPrice;
}

export function buildPricingInsights(pricingRows: PricingRow[] = []): PricingInsight[] {
  return pricingRows.map((row) => {
    const optimizationDemand = getOptimizationDemand(row);
    const suggestedPrice = getRecommendedPrice(row);
    const serviceReason = getPricingReason(row);

    return {
      ...row,
      demandLevel: getDemandLevel(optimizationDemand),
      optimizationReason: serviceReason,
      reason: row.reason || serviceReason,
      suggestedPrice,
      expectedLift: calculateRevenueImpact(row),
    };
  });
}
