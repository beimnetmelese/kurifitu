import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import MetricCard from "../components/cards/MetricCard";
import { analytics } from "../data/analytics";
import { useDashboardData } from "../hooks/useDashboardData";
import { formatCurrency } from "../utils/formatCurrency";
import { getDemandLevel } from "../utils/getDemandLevel";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
);

type AiRecommendation = {
  title: string;
  reason: string;
  expectedImpact: number;
  priority: "High" | "Medium";
};

export default function RevenueOverview() {
  const {
    totalRevenue,
    predictedRevenue,
    growthPercentage,
    avgRevenuePerGuest,
    upsellConversionRate,
    occupancyData,
    pricingInsights,
    segmentInsights,
  } = useDashboardData();

  const latestOccupancy =
    occupancyData[occupancyData.length - 1]?.predicted ?? analytics.occupancyRate;
  const demandLevel = getDemandLevel(latestOccupancy);

  const pricingDirection =
    demandLevel === "High"
      ? "Increase"
      : demandLevel === "Medium"
        ? "Optimize"
        : "Decrease";

  const pricingDirectionReason =
    demandLevel === "High"
      ? "Demand is running above baseline, so higher rates can lift margin without hurting occupancy."
      : demandLevel === "Medium"
        ? "Demand is steady, so targeted package pricing should improve conversion."
        : "Demand is soft, so strategic discounts can protect occupancy and ancillary spend.";

  const totalUplift = predictedRevenue - totalRevenue;
  const pricingImpact = pricingInsights.reduce(
    (sum, row) => sum + Math.max(0, row.expectedLift * 25),
    0,
  );
  const upsellImpact = analytics.upsellRevenue;

  const strongestSegment =
    segmentInsights
      .slice()
      .sort((left, right) => right.avgSpend - left.avgSpend)[0]?.name ?? "Family";

  const lowestDemandDay = occupancyData
    .slice()
    .sort((left, right) => left.predicted - right.predicted)[0];
  const highestDemandDay = occupancyData
    .slice()
    .sort((left, right) => right.predicted - left.predicted)[0];

  const demandForecast = occupancyData.slice(0, 7).map((row) => {
    const level = getDemandLevel(row.predicted);
    const normalizedDay = (row.day || "N/A").toLowerCase();
    const isWeekend = normalizedDay.startsWith("sat") || normalizedDay.startsWith("sun");

    return {
      day: row.day || "N/A",
      predicted: row.predicted,
      level,
      isWeekend,
    };
  });

  const saturdayDemand = demandForecast.find((day) =>
    day.day.toLowerCase().startsWith("sat"),
  );
  const tuesdayDemand = demandForecast.find((day) =>
    day.day.toLowerCase().startsWith("tue"),
  );
  const highDemandActionDay =
    saturdayDemand ?? {
      day: highestDemandDay?.day ?? "Saturday",
      predicted: highestDemandDay?.predicted ?? 92,
      level: getDemandLevel(highestDemandDay?.predicted ?? 92),
      isWeekend: true,
    };
  const lowDemandActionDay =
    tuesdayDemand ?? {
      day: lowestDemandDay?.day ?? "Tuesday",
      predicted: lowestDemandDay?.predicted ?? 45,
      level: getDemandLevel(lowestDemandDay?.predicted ?? 45),
      isWeekend: false,
    };

  const demandPointColors = demandForecast.map((day) => {
    if (day.level === "High") return "#16a34a";
    if (day.level === "Medium") return "#f59e0b";
    return "#ef4444";
  });

  const recommendations: AiRecommendation[] = [
    {
      title: "Increase deluxe room prices by 15% this weekend",
      reason:
        "Weekend occupancy forecast exceeds 85% and premium room demand remains high in the current booking window.",
      expectedImpact: Math.round(totalRevenue * 0.024),
      priority: "High",
    },
    {
      title: `Target ${strongestSegment} segment with bundled offers`,
      reason:
        "Segment behavior shows high spend per stay and strong acceptance of convenience-focused upsells.",
      expectedImpact: Math.round(totalRevenue * 0.018),
      priority: "Medium",
    },
    {
      title: "Offer tactical discounts next week for low-demand dates",
      reason: `${lowestDemandDay?.day ?? "Tuesday"} has the weakest projected occupancy and risks dragging weekly RevPAR performance.`,
      expectedImpact: Math.round(totalRevenue * 0.013),
      priority: "High",
    },
  ];

  const revenueTrendLabels = ["Before AI", "After AI"];
  const revenueTrendData = [totalRevenue, predictedRevenue];

  const pricingLabels = pricingInsights.map((row) => row.roomType);
  const pricingRevenueData = pricingInsights.map(
    (row) => Math.max(0, row.expectedLift) * 30,
  );

  const alertCards = [
    {
      title: "High-demand surge detected",
      detail: "Friday to Sunday occupancy is above 85%. Raise premium inventory rates and lock in value-added upsells.",
      tone: "border-emerald-200 bg-emerald-50 text-emerald-900",
    },
    {
      title: "Low-occupancy risk to address",
      detail: `${lowestDemandDay?.day ?? "Tuesday"} is projected below 65% occupancy. Trigger promo bundles and retargeting campaigns now.`,
      tone: "border-amber-200 bg-amber-50 text-amber-900",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-slate-950 px-6 py-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.2),transparent_35%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(132,204,22,0.14),transparent_30%)]" />
        <div className="relative flex flex-col gap-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-200/90">
            Revenue Intelligence Hub
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Dashboard Overview
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-300">
            Unified command center for AI-driven revenue optimization across demand forecasting, dynamic pricing, and upsell performance.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(predictedRevenue)}
          growth={growthPercentage}
        />
        <MetricCard
          title="Revenue per Guest"
          value={formatCurrency(avgRevenuePerGuest)}
        />
        <MetricCard
          title="Predicted Occupancy"
          value={`${latestOccupancy.toFixed(1)}%`}
        />
        <MetricCard
          title="Upsell Conversion"
          value={`${(upsellConversionRate * 100).toFixed(1)}%`}
        />
        <MetricCard
          title="Revenue Uplift from AI"
          value={formatCurrency(totalUplift)}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-[30px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur-xl lg:col-span-2">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-500">
                AI Insights & Recommendations
              </p>
              <h2 className="mt-1 text-xl font-semibold text-slate-950">
                Next best actions to grow revenue
              </h2>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {recommendations.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${item.priority === "High" ? "bg-rose-100 text-rose-700" : "bg-cyan-100 text-cyan-700"}`}
                  >
                    {item.priority} Priority
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  <span className="font-semibold text-slate-800">Reason:</span> {item.reason}
                </p>
                <p className="mt-2 text-sm font-semibold text-emerald-700">
                  Expected revenue impact: +{formatCurrency(item.expectedImpact)}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[30px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-500">
            Demand & Pricing Snapshot
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950">
            Current signal: {demandLevel}
          </h2>
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Suggested Direction
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-950">
              {pricingDirection}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {pricingDirectionReason}
            </p>
          </div>
          <div className="mt-4 grid gap-2 text-sm text-slate-700">
            <p className="rounded-xl border border-slate-200 bg-white px-3 py-2">
              Avg predicted occupancy this week: {(
                occupancyData.reduce((sum, row) => sum + row.predicted, 0) /
                Math.max(occupancyData.length, 1)
              ).toFixed(1)}%
            </p>
            <p className="rounded-xl border border-slate-200 bg-white px-3 py-2">
              AI estimated pricing lift: +{formatCurrency(pricingImpact)}
            </p>
          </div>
        </section>
      </div>

      <section className="rounded-[30px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur-xl">
        <div className="flex flex-col gap-2 border-b border-slate-200/80 pb-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-500">
            7-Day Demand Forecast
          </p>
          <h2 className="text-xl font-semibold text-slate-950">
            Predicted occupancy and pricing signals
          </h2>
        </div>

        <div className="mt-5 h-[300px] rounded-2xl border border-slate-200 bg-white p-3">
          <Line
            data={{
              labels: demandForecast.map((day) => day.day),
              datasets: [
                {
                  label: "Predicted occupancy",
                  data: demandForecast.map((day) => day.predicted),
                  borderColor: "#0f766e",
                  backgroundColor: "rgba(15,118,110,0.15)",
                  fill: true,
                  tension: 0.35,
                  pointRadius: 5,
                  pointHoverRadius: 6,
                  pointBackgroundColor: demandPointColors,
                },
                {
                  label: "High-demand day",
                  data: demandForecast.map((day) =>
                    day.level === "High" ? day.predicted : null,
                  ),
                  borderColor: "transparent",
                  backgroundColor: "#16a34a",
                  pointRadius: 7,
                  pointHoverRadius: 8,
                  showLine: false,
                },
                {
                  label: "Low-demand day",
                  data: demandForecast.map((day) =>
                    day.level === "Low" ? day.predicted : null,
                  ),
                  borderColor: "transparent",
                  backgroundColor: "#ef4444",
                  pointRadius: 7,
                  pointHoverRadius: 8,
                  showLine: false,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "bottom",
                },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const index = context.dataIndex;
                      const day = demandForecast[index];
                      if (!day) return `${context.dataset.label}: ${context.parsed.y}%`;
                      return `${day.predicted}% (${day.level} demand${day.isWeekend ? ", weekend" : ""})`;
                    },
                  },
                },
              },
              scales: {
                y: {
                  min: 0,
                  max: 100,
                  ticks: {
                    callback: (value) => `${value}%`,
                    color: "#64748b",
                  },
                  grid: {
                    color: "#e2e8f0",
                  },
                },
                x: {
                  ticks: {
                    color: "#64748b",
                  },
                  grid: {
                    color: "#f1f5f9",
                  },
                },
              },
            }}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {demandForecast.map((day) => {
            const tone =
              day.level === "High"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : day.level === "Medium"
                  ? "border-amber-200 bg-amber-50 text-amber-700"
                  : "border-rose-200 bg-rose-50 text-rose-700";

            return (
              <span
                key={day.day}
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${tone}`}
              >
                {day.day}: {day.level}
              </span>
            );
          })}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
            <p className="text-sm font-semibold">
              {highDemandActionDay.day} demand is very high ({highDemandActionDay.predicted.toFixed(0)}%) - increase room prices by 15%
            </p>
          </article>
          <article className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
            <p className="text-sm font-semibold">
              {lowDemandActionDay.day} demand is low ({lowDemandActionDay.predicted.toFixed(0)}%) - introduce discounts or bundles
            </p>
          </article>
        </div>
      </section>

      <section className="rounded-[30px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur-xl">
        <div className="flex flex-col gap-2 border-b border-slate-200/80 pb-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-500">
            Revenue Impact Visualization
          </p>
          <h2 className="text-xl font-semibold text-slate-950">
            Where AI creates measurable gains
          </h2>
        </div>
        <div className="mt-5 grid gap-4 xl:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-900">Before AI vs After AI Revenue</p>
            <div className="mt-3 h-[260px]">
              <Bar
                data={{
                  labels: revenueTrendLabels,
                  datasets: [
                    {
                      label: "Revenue",
                      data: revenueTrendData,
                      backgroundColor: ["#94a3b8", "#0f766e"],
                      borderRadius: 10,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                }}
              />
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-900">Pricing Impact on Revenue</p>
            <div className="mt-3 h-[260px]">
              <Line
                data={{
                  labels: pricingLabels,
                  datasets: [
                    {
                      label: "Projected lift",
                      data: pricingRevenueData,
                      borderColor: "#0369a1",
                      backgroundColor: "rgba(3,105,161,0.12)",
                      fill: true,
                      tension: 0.35,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                }}
              />
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-900">Upsell Contribution to Total Revenue</p>
            <div className="mt-3 h-[260px]">
              <Doughnut
                data={{
                  labels: ["Upsell Revenue", "Core Revenue"],
                  datasets: [
                    {
                      data: [upsellImpact, Math.max(predictedRevenue - upsellImpact, 0)],
                      backgroundColor: ["#0ea5e9", "#cbd5e1"],
                      borderWidth: 0,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                  },
                }}
              />
            </div>
          </article>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {alertCards.map((alert) => (
          <article
            key={alert.title}
            className={`rounded-2xl border p-4 ${alert.tone}`}
          >
            <p className="text-sm font-semibold">{alert.title}</p>
            <p className="mt-2 text-sm leading-6">{alert.detail}</p>
          </article>
        ))}
      </section>
    </section>
  );
}
