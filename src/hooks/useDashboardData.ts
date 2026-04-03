import { useMemo } from 'react';
import { analytics } from '../data/analytics';
import { guests } from '../data/guests';
import { pricing } from '../data/pricing';
import { segments } from '../data/segments';
import { buildPricingInsights } from '../services/pricingService.ts';
import { predictGuestValue, predictOccupancy, predictRevenueGrowth } from '../services/predictionService.ts';
import { calculateUpsellStats } from '../services/recommendationService.ts';
import { buildSegmentSummaries } from '../services/segmentationService.ts';

export function useDashboardData() {
  return useMemo(() => {
    const totalRevenue = analytics.totalRevenueBefore;
    const predictedRevenue = analytics.totalRevenueAfter;
    const growthPercentage = predictRevenueGrowth(totalRevenue, predictedRevenue);

    const occupancyData = predictOccupancy(analytics.occupancyForecast);
    const pricingInsights = buildPricingInsights(pricing);
    const upsellStats = calculateUpsellStats(guests);
    const segmentInsights = buildSegmentSummaries(guests, segments);
    const avgRevenuePerGuest =
      guests.length > 0
        ? guests.reduce((sum, guest) => sum + predictGuestValue(guest), 0) / guests.length
        : 0;
    const upsellConversionRate = analytics.upsellConversionRate;

    return {
      totalRevenue,
      predictedRevenue,
      growthPercentage,
      avgRevenuePerGuest,
      upsellConversionRate,
      occupancyData,
      pricingInsights,
      upsellStats,
      segmentInsights,
      guests,
      loading: false,
      error: null,
    };
  }, []);
}
