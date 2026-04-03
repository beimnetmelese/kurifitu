import { getDemandLevel } from '../utils/getDemandLevel.ts';
import { calculateGrowth } from '../utils/calculateGrowth.ts';

export type OccupancyPoint = {
  day: string;
  occupancy?: number;
  predicted: number;
};

export type OccupancyPrediction = OccupancyPoint & {
  demandLevel: ReturnType<typeof getDemandLevel>;
};

export type GuestProfile = {
  name?: string;
  segment?: string;
  predictedSpend?: number;
  preferences?: string[];
  purchaseLikelihood?: number;
};

export function predictOccupancy(forecast: OccupancyPoint[] = []): OccupancyPrediction[] {
  return forecast.map((point) => {
    const predicted = Number(point.predicted) || 0;
    return {
      ...point,
      demandLevel: getDemandLevel(predicted),
    };
  });
}

export function predictRevenueGrowth(
  totalRevenueBefore: number | string | null | undefined,
  totalRevenueAfter: number | string | null | undefined,
): number {
  return calculateGrowth(totalRevenueBefore, totalRevenueAfter);
}

export function predictGuestValue(guest: GuestProfile): number {
  const predictedSpend = Number(guest?.predictedSpend) || 0;
  const purchaseLikelihood = Number(guest?.purchaseLikelihood) || 0;
  return Math.round(predictedSpend * (1 + purchaseLikelihood * 0.35));
}

export function buildOccupancyPredictions(forecast: OccupancyPoint[] = []): OccupancyPrediction[] {
  return predictOccupancy(forecast);
}
