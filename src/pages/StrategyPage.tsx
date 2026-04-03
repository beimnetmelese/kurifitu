import {
  MiniBarChart,
  MiniLineChart,
  SectionCard,
  ScenarioChip,
} from "../components/ui";
import type { ScenarioKey } from "../lib/opsMindData";

export type StrategyPageProps = {
  currentScenario: ScenarioKey;
  scenarios: ScenarioKey[];
  scenarioSummary: string;
  scenarioStory: string[];
  scenarioMatrix: { label: string; values: number[] }[];
  onScenarioChange: (scenario: ScenarioKey) => void;
};

export function StrategyPage({
  currentScenario,
  scenarios,
  scenarioSummary,
  scenarioStory,
  scenarioMatrix,
  onScenarioChange,
}: StrategyPageProps) {
  const scenarioArrows = [
    "Trigger a rush",
    "AI reallocates staff",
    "Inventory shifts",
    "Maintenance shifts earlier",
    "Guest experience stays smooth",
  ];

  return (
    <div className="space-y-6">
      <SectionCard title="AI Decision Engine" eyebrow="One brain, many levers">
        <div className="flex flex-wrap gap-3">
          {scenarios.map((scenario) => (
            <ScenarioChip
              key={scenario}
              active={scenario === currentScenario}
              label={scenario}
              onClick={() => onScenarioChange(scenario)}
            />
          ))}
        </div>
        <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[26px] border border-slate-200 bg-slate-950 p-5 text-white">
            <p className="text-[11px] uppercase tracking-[0.35em] text-cyan-200">
              Current scenario
            </p>
            <p className="mt-3 text-3xl font-semibold">{currentScenario}</p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              {scenarioSummary}
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {scenarioStory.map((line) => (
                <div
                  key={line}
                  className="rounded-2xl border border-white/10 bg-white/6 p-3 text-sm text-slate-100"
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Decision stack</p>
              <div className="mt-3 grid gap-2">
                <div className="rounded-2xl bg-white p-3 shadow-sm">
                  Rain detected → reduce pool staff and boost spa coverage
                </div>
                <div className="rounded-2xl bg-white p-3 shadow-sm">
                  VIP arrival → reserve concierge and top-rated staff
                </div>
                <div className="rounded-2xl bg-white p-3 shadow-sm">
                  High demand → increase kitchen and inventory pressure
                </div>
              </div>
            </div>
            <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">AI confidence</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">94%</p>
              <p className="mt-1 text-sm text-slate-600">
                The engine is confident enough to act before managers intervene.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-5">
          {scenarioArrows.map((step, index) => (
            <div
              key={step}
              className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-400">
                Step {index + 1}
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-950">
                {step}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-2">
        {scenarioMatrix.map((block) => (
          <SectionCard
            key={block.label}
            title={block.label}
            eyebrow="What-if output"
          >
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <MiniLineChart
                data={block.values}
                tone={
                  block.label.includes("Demand")
                    ? "violet"
                    : block.label.includes("Staff")
                      ? "cyan"
                      : "emerald"
                }
                height={170}
              />
            </div>
          </SectionCard>
        ))}
      </div>

      <SectionCard title="Cross-System Lift" eyebrow="Scenario-driven outcomes">
        <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <MiniBarChart
              data={scenarioMatrix.map(
                (entry) => entry.values[entry.values.length - 1],
              )}
              tone="amber"
              height={180}
            />
            <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.26em] text-slate-400">
                Decision graph
              </p>
              <p className="mt-2 text-sm text-slate-600">
                One event cascades into staffing, inventory, and maintenance
                decisions at once.
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Maintenance</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                Predictive alerts move earlier when guest impact rises.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Inventory</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                Demand, weather, and event awareness are stitched together.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Workforce</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                Staff allocation is rebuilt every hour to prevent overload.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Resort outcome</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                One brain controls the operational map instead of isolated
                dashboards.
              </p>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
