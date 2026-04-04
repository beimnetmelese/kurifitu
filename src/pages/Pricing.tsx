import PricingTable from "../components/tables/PricingTable";
import { pricing } from "../data/pricing";
import { buildPricingInsights } from "../services/pricingService.ts";
import { formatCurrency } from "../utils/formatCurrency";

type PricingDecisionView = {
  roomType: string;
  currentPrice: number;
  suggestedPrice: number;
  demandLevel: string;
  priceChangePercent: number;
  insight: string;
  recommendedAction: string;
  revenueImpact: number;
  confidence: number;
  reason: string;
};

export default function Pricing() {
  const pricingInsights = buildPricingInsights(pricing);
  const competitorTrendByRoom: Record<string, string> = {
    Standard: "Nearby competitors raised weekday rates by 6%.",
    Deluxe: "Premium competitors are nearly sold out for weekend inventory.",
    "Family Suite": "Competing resorts are bundling meal plans to protect conversion.",
    "Ocean Villa": "Luxury inventory in the market is constrained over peak days.",
  };

  const decisionCards: PricingDecisionView[] = pricingInsights.map((item) => {
    const priceChangePercent = Math.round(
      ((item.suggestedPrice - item.currentPrice) / Math.max(item.currentPrice, 1)) *
        100,
    );
    const confidence =
      item.demandLevel === "High"
        ? 89
        : item.demandLevel === "Medium"
          ? 81
          : 74;
    const estimatedMonthlyBookings =
      item.demandLevel === "High" ? 120 : item.demandLevel === "Medium" ? 95 : 75;
    const revenueImpact = Math.max(
      0,
      (item.suggestedPrice - item.currentPrice) * estimatedMonthlyBookings,
    );

    return {
      roomType: item.roomType,
      currentPrice: item.currentPrice,
      suggestedPrice: item.suggestedPrice,
      demandLevel: item.demandLevel,
      priceChangePercent,
      insight:
        item.demandLevel === "High"
          ? `High demand detected for ${item.roomType}; guests show lower price sensitivity.`
          : item.demandLevel === "Medium"
            ? `Stable demand for ${item.roomType}; controlled price optimization is recommended.`
            : `Soft demand for ${item.roomType}; occupancy protection should be prioritized.`,
      recommendedAction:
        priceChangePercent >= 0
          ? `Increase ${item.roomType} by ${priceChangePercent}% and attach premium add-ons.`
          : `Decrease ${item.roomType} by ${Math.abs(priceChangePercent)}% and promote value bundles.`,
      revenueImpact,
      confidence,
      reason: `${item.optimizationReason} ${competitorTrendByRoom[item.roomType] || "Competitor pricing supports this move."}`,
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
            Why each price changes and what it earns
          </h2>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {decisionCards.map((item) => {
            const isIncrease = item.suggestedPrice >= item.currentPrice;
            return (
              <article
                key={item.roomType}
                className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-slate-950">
                    {item.roomType}
                  </h3>
                  <span className="rounded-full border border-white bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                    {item.confidence}% confidence
                  </span>
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Current Price
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {formatCurrency(item.currentPrice)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Suggested Price
                    </p>
                    <p className={`mt-1 text-sm font-semibold ${isIncrease ? "text-emerald-700" : "text-amber-700"}`}>
                      {formatCurrency(item.suggestedPrice)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Price Move
                    </p>
                    <p className={`mt-1 text-sm font-semibold ${isIncrease ? "text-emerald-700" : "text-amber-700"}`}>
                      {isIncrease ? "+" : ""}
                      {item.priceChangePercent}%
                    </p>
                  </div>
                </div>

                <div className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                  <p>
                    <span className="font-semibold text-slate-900">Insight:</span>{" "}
                    {item.insight}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Recommended Action:</span>{" "}
                    {item.recommendedAction}
                  </p>
                  <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 font-semibold text-emerald-700">
                    Revenue Impact: +{formatCurrency(item.revenueImpact)}
                  </p>
                  <p className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs leading-5 text-slate-600">
                    Reason: {item.reason}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </section>
  );
}
