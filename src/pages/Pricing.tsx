import DecisionInsightCard from "../components/common/DecisionInsightCard";
import PricingTable from "../components/tables/PricingTable";
import { pricing } from "../data/pricing";
import { buildPricingInsights } from "../services/pricingService.ts";
import { formatCurrency } from "../utils/formatCurrency";
import type { DecisionInsight } from "../types/decisionInsight";

export default function Pricing() {
  const pricingInsights = buildPricingInsights(pricing);
  const decisionCards: DecisionInsight[] = pricingInsights.map((item) => {
    const estimatedMonthlyLift = Math.max(0, item.expectedLift * 90);
    const confidence = item.demandLevel === "High" ? 88 : item.demandLevel === "Medium" ? 79 : 73;

    return {
      id: item.roomType,
      title: `${item.roomType} pricing decision`,
      prediction: `Suggested price ${formatCurrency(item.suggestedPrice)} (current ${formatCurrency(item.currentPrice)}).`,
      insight: `${item.demandLevel} demand forecast indicates ${item.expectedLift >= 0 ? "headroom for higher rates" : "a need to protect occupancy"}.`,
      recommendedAction:
        item.expectedLift >= 0
          ? `Increase ${item.roomType} rates by ${Math.round((item.expectedLift / Math.max(item.currentPrice, 1)) * 100)}% and pair with premium add-ons.`
          : `Soften ${item.roomType} pricing and bundle value-added benefits to preserve bookings.`,
      expectedImpact: `+${formatCurrency(estimatedMonthlyLift)} projected monthly revenue`,
      confidence,
      reason: item.optimizationReason,
      tone: item.expectedLift >= 0 ? "success" : "warning",
    };
  });

  const recommendedAverage =
    pricingInsights.length > 0
      ? pricingInsights.reduce((sum, item) => sum + item.suggestedPrice, 0) /
        pricingInsights.length
      : 0;

  return (
    <section className="space-y-6">
      <div className="relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-white px-6 py-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.1),transparent_28%)]" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-700">
              Pricing Strategy
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              Dynamic Pricing
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Room pricing recommendations powered by demand forecasts.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
            <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-700">
                Rooms
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-950">
                {pricingInsights.length}
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Avg. suggestion
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-950">
                {recommendedAverage.toFixed(0)}
              </p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-700">
                Strategy
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-950">
                Demand-led optimization
              </p>
            </div>
          </div>
        </div>
      </div>

      <PricingTable data={pricingInsights} />

      <section className="rounded-[30px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur-xl">
        <div className="border-b border-slate-200/80 pb-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-500">
            AI Pricing Decision Feed
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950">
            Prediction to revenue action
          </h2>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {decisionCards.map((item) => (
            <DecisionInsightCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </section>
  );
}
