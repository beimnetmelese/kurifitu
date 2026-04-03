import {
  GlassPanel,
  MiniBarChart,
  MiniLineChart,
  PulseDot,
  SectionCard,
  SoftBadge,
  StatTile,
} from "../components/ui";
import type { DecisionNote } from "../lib/opsMindData";

export type OverviewPageProps = {
  scenario: string;
  weather: string;
  summary: string;
  kpis: {
    label: string;
    value: number;
    suffix?: string;
    tone: "cyan" | "violet" | "emerald" | "amber" | "rose";
  }[];
  highlights: { label: string; value: number; delta: string }[];
  decisions: DecisionNote[];
  occupancyTrend: number[];
  revenueTrend: number[];
  flowTrend: number[];
  story: string[];
};

export function OverviewPage({
  scenario,
  weather,
  summary,
  kpis,
  highlights,
  decisions,
  occupancyTrend,
  revenueTrend,
  flowTrend,
  story,
}: OverviewPageProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {kpis.map((metric) => (
          <StatTile
            key={metric.label}
            label={metric.label}
            value={metric.value}
            suffix={metric.suffix}
            accent={metric.tone}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <GlassPanel className="relative overflow-hidden p-7">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.15),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.12),transparent_32%)]" />
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <SoftBadge tone="cyan">{scenario}</SoftBadge>
                <SoftBadge tone="slate">{weather}</SoftBadge>
              </div>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
                The resort is operating like a living intelligence layer.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                {summary}
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-500">
                {story.map((line) => (
                  <div
                    key={line}
                    className="flex items-start gap-2 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm"
                  >
                    <PulseDot tone="cyan" />
                    <span className="max-w-[220px]">{line}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid min-w-[260px] gap-3 rounded-3xl border border-slate-200 bg-white/75 p-4 shadow-sm">
              <div className="rounded-2xl bg-slate-950 p-4 text-white">
                <p className="text-[11px] uppercase tracking-[0.35em] text-cyan-200">
                  AI operating thesis
                </p>
                <p className="mt-2 text-lg font-semibold">
                  Predict, route, protect, and optimize in one loop.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Pulse status</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-2xl font-semibold text-slate-950">
                    Live
                  </span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                    Stable
                  </span>
                </div>
              </div>
            </div>
          </div>
        </GlassPanel>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
          {highlights.map((item, index) => (
            <StatTile
              key={item.label}
              label={item.label}
              value={item.value}
              accent={
                index % 5 === 0
                  ? "cyan"
                  : index % 5 === 1
                    ? "violet"
                    : index % 5 === 2
                      ? "emerald"
                      : index % 5 === 3
                        ? "amber"
                        : "rose"
              }
            />
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <SectionCard title="AI Decision Stream" eyebrow="Live reasoning">
          <div className="space-y-3">
            {decisions.map((decision) => (
              <div
                key={decision.title}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-950">
                    {decision.title}
                  </p>
                  <SoftBadge tone={decision.tone}>{decision.tone}</SoftBadge>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {decision.detail}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Operational Forecast" eyebrow="Trend intelligence">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center justify-between text-sm text-slate-500">
                <span>Occupancy curve</span>
                <span className="font-semibold text-slate-900">
                  {occupancyTrend[occupancyTrend.length - 1]}%
                </span>
              </div>
              <MiniLineChart data={occupancyTrend} tone="cyan" height={160} />
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center justify-between text-sm text-slate-500">
                <span>Revenue velocity</span>
                <span className="font-semibold text-slate-900">
                  ${revenueTrend[revenueTrend.length - 1].toLocaleString()}
                </span>
              </div>
              <MiniLineChart data={revenueTrend} tone="violet" height={160} />
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 lg:col-span-2">
              <div className="mb-3 flex items-center justify-between text-sm text-slate-500">
                <span>Flow pressure snapshot</span>
                <span className="font-semibold text-slate-900">Demand map</span>
              </div>
              <MiniBarChart data={flowTrend} tone="emerald" height={170} />
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Today in One Glance" eyebrow="Executive summary">
        <div className="grid gap-4 md:grid-cols-4">
          {highlights.map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-slate-200 bg-white p-4"
            >
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {item.value}
              </p>
              <p className="mt-1 text-sm text-cyan-700">{item.delta}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
