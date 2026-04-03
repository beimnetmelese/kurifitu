import type { ReactNode } from "react";

type MetricCardProps = {
  title: string;
  value: string | number;
  growth?: number;
  icon?: ReactNode;
};

export default function MetricCard({
  title,
  value,
  growth,
  icon,
}: MetricCardProps) {
  const metricGrowth = typeof growth === "number" ? growth : null;
  const growthTone =
    metricGrowth !== null && metricGrowth > 0
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : metricGrowth !== null && metricGrowth < 0
        ? "border-rose-200 bg-rose-50 text-rose-700"
        : "border-slate-200 bg-slate-50 text-slate-500";
  const growthPrefix = metricGrowth !== null && metricGrowth > 0 ? "+" : "";
  const growthArrow =
    metricGrowth !== null && metricGrowth > 0
      ? "↑"
      : metricGrowth !== null && metricGrowth < 0
        ? "↓"
        : "";

  return (
    <article className="group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-500 via-emerald-500 to-teal-500" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
            {title}
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {value}
          </p>
        </div>
        {icon ? (
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 shadow-sm">
            {icon}
          </span>
        ) : null}
      </div>
      {metricGrowth !== null ? (
        <small
          className={`mt-4 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${growthTone}`}
        >
          {`${growthPrefix}${Math.abs(metricGrowth).toFixed(1)}% ${growthArrow}`}
        </small>
      ) : null}
    </article>
  );
}
