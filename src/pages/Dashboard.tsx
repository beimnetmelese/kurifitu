import { useEffect, useState } from "react";
import Loader from "../components/common/Loader";
import InsightCard from "../components/cards/InsightCard";
import MetricCard from "../components/cards/MetricCard";
import OccupancyChart from "../components/charts/OccupancyChart.tsx";
import { formatCurrency } from "../utils/formatCurrency.ts";
import { useDashboardData } from "../hooks/useDashboardData.ts";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timerId = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timerId);
  }, []);

  const {
    totalRevenue,
    predictedRevenue,
    growthPercentage,
    avgRevenuePerGuest,
    upsellConversionRate,
    occupancyData,
    pricingInsights,
  } = useDashboardData();

  if (isLoading) {
    return <Loader />;
  }

  const topInsights = [
    {
      label: "Demand",
      value: `${growthPercentage.toFixed(1)}% growth`,
      tone: "text-cyan-700 bg-cyan-50 border-cyan-200",
    },
    {
      label: "Revenue",
      value: formatCurrency(predictedRevenue),
      tone: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
    {
      label: "Conversion",
      value: `${(upsellConversionRate * 100).toFixed(1)}%`,
      tone: "text-amber-700 bg-amber-50 border-amber-200",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-slate-950 px-6 py-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_25%)]" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-200/90">
              Operations Command
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              AI-driven overview of revenue and demand, presented as a premium
              executive console.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
            {topInsights.map((item) => (
              <div
                key={item.label}
                className={`rounded-2xl border px-4 py-3 shadow-sm ${item.tone}`}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-80">
                  {item.label}
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-950">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          title="Revenue Before AI"
          value={formatCurrency(totalRevenue)}
        />
        <MetricCard
          title="Revenue After AI"
          value={formatCurrency(predictedRevenue)}
        />
        <MetricCard
          title="Growth Percentage"
          value={`${growthPercentage.toFixed(1)}%`}
          growth={growthPercentage}
        />
        <MetricCard
          title="Avg Revenue Per Guest"
          value={formatCurrency(avgRevenuePerGuest)}
        />
        <MetricCard
          title="Upsell Conversion Rate"
          value={`${(upsellConversionRate * 100).toFixed(1)}%`}
        />
      </div>

      <div className="rounded-[32px] border border-slate-200/80 bg-white/60 p-3 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <OccupancyChart data={occupancyData} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {pricingInsights.map((row) => (
          <InsightCard
            key={row.roomType}
            title={`${row.roomType} AI Insight`}
            description={`${row.reason} Suggested price ${formatCurrency(row.suggestedPrice)}. Demand level: ${row.demandLevel}.`}
            type={row.expectedLift >= 0 ? "success" : "warning"}
          />
        ))}
      </div>
    </section>
  );
}
