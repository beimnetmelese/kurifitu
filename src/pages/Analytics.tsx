import { useEffect, useState } from "react";
import Loader from "../components/common/Loader";
import InsightCard from "../components/cards/InsightCard";
import MetricCard from "../components/cards/MetricCard";
import { analytics } from "../data/analytics";
import {
  predictOccupancy,
  predictRevenueGrowth,
} from "../services/predictionService.ts";
import { formatCurrency } from "../utils/formatCurrency.ts";

export default function Analytics() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timerId = setTimeout(() => setIsLoading(false), 850);
    return () => clearTimeout(timerId);
  }, []);

  const revenueBefore = analytics.totalRevenueBefore;
  const revenueAfter = analytics.totalRevenueAfter;
  const growthPercentage = predictRevenueGrowth(revenueBefore, revenueAfter);

  const occupancyPredictions = predictOccupancy(analytics.occupancyForecast);
  const pricingImpact = revenueAfter - revenueBefore - analytics.upsellRevenue;

  if (isLoading) {
    return <Loader />;
  }

  const highestOccupancy = Math.max(
    ...occupancyPredictions.map((point) => point.predicted),
  );

  return (
    <section className="space-y-6">
      <div className="relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-white px-6 py-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.1),transparent_28%)]" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-700">
              Revenue Intelligence
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              Revenue Analytics
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Impact analysis across pricing, occupancy, and upsell
              contribution.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
            <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-700">
                Peak occupancy
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-950">
                {highestOccupancy}%
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Revenue lift
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-950">
                {formatCurrency(revenueAfter - revenueBefore)}
              </p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-700">
                Pricing impact
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-950">
                {formatCurrency(pricingImpact)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          title="Revenue Before AI"
          value={formatCurrency(revenueBefore)}
        />
        <MetricCard
          title="Revenue After AI"
          value={formatCurrency(revenueAfter)}
        />
        <MetricCard
          title="Growth Percentage"
          value={`${growthPercentage.toFixed(1)}%`}
          growth={growthPercentage}
        />
        <MetricCard
          title="Upsell Contribution"
          value={formatCurrency(analytics.upsellRevenue)}
        />
        <MetricCard
          title="Pricing Impact"
          value={formatCurrency(pricingImpact)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <InsightCard
          title="AI Impact Summary"
          description={`Combined pricing optimization and upsell targeting increase projected revenue. Total uplift: ${formatCurrency(revenueAfter - revenueBefore)}.`}
          type="success"
        />
        <InsightCard
          title="Demand Forecast Signal"
          description={`Prediction engine indicates strong late-week demand, supporting higher dynamic rates. Peak predicted occupancy: ${Math.max(...occupancyPredictions.map((point) => point.predicted))}%.`}
          type="info"
        />
      </div>
    </section>
  );
}
