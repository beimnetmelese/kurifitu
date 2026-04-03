import {
  MiniBarChart,
  MiniLineChart,
  ProgressBar,
  SectionCard,
  SoftBadge,
} from "../components/ui";
import type { AreaKey, StaffMember } from "../lib/opsMindData";

export type WorkforcePageProps = {
  scenario: string;
  staff: StaffMember[];
  recommendation: string;
  areaLoads: { area: AreaKey; load: number; target: number }[];
  energyCurve: number[];
};

const areaColors: Record<
  AreaKey,
  "cyan" | "violet" | "emerald" | "amber" | "rose"
> = {
  Pool: "cyan",
  Restaurant: "violet",
  Lobby: "amber",
  Spa: "emerald",
  Bar: "rose",
};

export function WorkforcePage({
  scenario,
  staff,
  recommendation,
  areaLoads,
  energyCurve,
}: WorkforcePageProps) {
  const activeCount = staff.filter(
    (person) => person.status === "Active",
  ).length;
  const idleCount = staff.filter((person) => person.status === "Idle").length;
  const assignedCount = staff.filter(
    (person) => person.status === "Assigned",
  ).length;

  const burnoutRisk = Math.max(
    6,
    Math.min(
      94,
      100 -
        Math.round(
          energyCurve.reduce((sum, value) => sum + value, 0) /
            Math.max(energyCurve.length, 1),
        ),
    ),
  );

  const bestFitStaff = staff
    .slice()
    .sort(
      (left, right) =>
        right.skill +
        right.guestScore -
        right.energy -
        (left.skill + left.guestScore - left.energy),
    )
    .slice(0, 3);

  const shiftBlueprint = [
    {
      label: "Peak coverage",
      value: "Pool + Restaurant",
      detail: "Highest guest pressure gets the strongest team first.",
    },
    {
      label: "Recovery buffer",
      value: "Lobby and spa breaks",
      detail: "Idle staff stay in reserve to avoid burnout spikes.",
    },
    {
      label: "VIP shield",
      value: "Concierge priority",
      detail: "Best guest-score staff remain ready for premium arrivals.",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard title="Dynamic Workforce Brain" eyebrow={scenario}>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl bg-slate-950 p-5 text-white md:col-span-3">
              <p className="text-[11px] uppercase tracking-[0.35em] text-cyan-200">
                AI recommendation
              </p>
              <p className="mt-3 text-2xl font-semibold leading-tight">
                {recommendation}
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Active</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">
                {activeCount}
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Idle</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">
                {idleCount}
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Assigned</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">
                {assignedCount}
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Energy Safety Curve" eyebrow="Burnout detection">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <MiniLineChart data={energyCurve} tone="amber" height={220} />
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-white p-3 shadow-sm">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                  Burnout risk
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">
                  {burnoutRisk}%
                </p>
              </div>
              <div className="rounded-2xl bg-white p-3 shadow-sm">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                  Reserve pool
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">
                  {idleCount}
                </p>
              </div>
              <div className="rounded-2xl bg-white p-3 shadow-sm">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                  Auto mode
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">On</p>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionCard title="Area Load Matrix" eyebrow="Routing pressure">
          <div className="space-y-4">
            {areaLoads.map((area) => (
              <div
                key={area.area}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">
                      {area.area}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Target {area.target}%
                    </p>
                  </div>
                  <SoftBadge
                    tone={
                      area.load > area.target
                        ? "rose"
                        : area.load > area.target - 10
                          ? "amber"
                          : "emerald"
                    }
                  >
                    {area.load}% load
                  </SoftBadge>
                </div>
                <div className="mt-3">
                  <ProgressBar value={area.load} tone={areaColors[area.area]} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Staff Roster" eyebrow="Skill-based routing">
          <div className="mb-5 grid gap-3 md:grid-cols-3">
            {shiftBlueprint.map((item) => (
              <div
                key={item.label}
                className="rounded-[26px] border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-xs uppercase tracking-[0.26em] text-slate-400">
                  {item.label}
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-950">
                  {item.value}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="mb-5 rounded-[28px] border border-lime-200 bg-lime-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-lime-800">
              Best-fit staff
            </p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {bestFitStaff.map((person) => (
                <div
                  key={person.id}
                  className="rounded-2xl bg-white p-4 shadow-sm"
                >
                  <p className="font-semibold text-slate-950">{person.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{person.role}</p>
                  <p className="mt-3 text-xs font-medium text-lime-700">
                    Fit score {person.skill + person.guestScore - person.energy}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {staff.map((person) => (
              <div
                key={person.id}
                className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-slate-950">
                      {person.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">{person.role}</p>
                  </div>
                  <SoftBadge
                    tone={
                      person.status === "Idle"
                        ? "amber"
                        : person.status === "Assigned"
                          ? "violet"
                          : "emerald"
                    }
                  >
                    {person.status}
                  </SoftBadge>
                </div>
                <div className="mt-4 grid gap-2 text-xs text-slate-500">
                  <div className="flex items-center justify-between">
                    <span>Area</span>
                    <span className="font-semibold text-slate-800">
                      {person.area}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Energy</span>
                    <span className="font-semibold text-slate-800">
                      {person.energy}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Skill</span>
                    <span className="font-semibold text-slate-800">
                      {person.skill}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Guest score</span>
                    <span className="font-semibold text-slate-800">
                      {person.guestScore}%
                    </span>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <ProgressBar
                    value={person.energy}
                    tone={
                      person.energy < 45
                        ? "rose"
                        : person.energy < 70
                          ? "amber"
                          : "emerald"
                    }
                  />
                  <div className="rounded-2xl bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
                    AI keeps this assignment live based on demand, skill, and
                    energy.
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Workforce Forecast"
        eyebrow="Predicted schedule pressure"
      >
        <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <MiniBarChart
              data={areaLoads.map((area) => area.load)}
              tone="violet"
              height={170}
            />
            <div className="mt-4 grid gap-2">
              {areaLoads.map((area) => (
                <div
                  key={area.area}
                  className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 text-sm shadow-sm"
                >
                  <span className="font-medium text-slate-700">
                    {area.area}
                  </span>
                  <span className="text-slate-500">Target {area.target}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-500">Burnout guard</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                Energy-aware scheduling is on
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-500">VIP routing</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                Best-rated staff reserved for premium arrivals
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-4 md:col-span-2">
              <p className="text-sm text-slate-500">Ghost demand detection</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                Friday evening bar pressure is pre-loaded before it happens.
              </p>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
