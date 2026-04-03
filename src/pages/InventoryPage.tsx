import {
  MiniBarChart,
  MiniLineChart,
  ProgressBar,
  SectionCard,
  SoftBadge,
} from "../components/ui";
import { useMemo, useState } from "react";
import type { InventoryItem } from "../lib/opsMindData";

export type InventoryPageProps = {
  items: InventoryItem[];
  demandCurve: number[];
  stockCurve: number[];
};

export function InventoryPage({
  items,
  demandCurve,
  stockCurve,
}: InventoryPageProps) {
  const [whatIfScenario, setWhatIfScenario] = useState<
    | "Calm Morning"
    | "Weekend Rush"
    | "Rain Alert"
    | "VIP Arrival"
    | "Event Night"
  >("Weekend Rush");

  const scenarioAdjustments = {
    "Calm Morning": { demandBoost: 0, stockBias: 0, reliabilityBias: 8 },
    "Weekend Rush": { demandBoost: 12, stockBias: -4, reliabilityBias: -6 },
    "Rain Alert": { demandBoost: 6, stockBias: -2, reliabilityBias: -2 },
    "VIP Arrival": { demandBoost: 8, stockBias: -3, reliabilityBias: -3 },
    "Event Night": { demandBoost: 14, stockBias: -6, reliabilityBias: -8 },
  }[whatIfScenario];

  const reorderList = items.filter((item) => item.stock < item.demand);
  const overstockList = items.filter((item) => item.stock - item.demand > 20);
  const highestMargin = items
    .slice()
    .sort((left, right) => right.margin - left.margin)[0];

  const totalMargin = items.reduce((sum, item) => sum + item.margin, 0);
  const totalWasteRisk = overstockList.reduce(
    (sum, item) => sum + Math.max(0, item.stock - item.demand),
    0,
  );
  const totalReorderPressure = reorderList.reduce(
    (sum, item) => sum + Math.max(0, item.demand - item.stock),
    0,
  );

  const whatIfItems = useMemo(
    () =>
      items.map((item) => {
        const adjustedDemand = Math.max(
          5,
          item.demand + scenarioAdjustments.demandBoost,
        );
        const adjustedStock = Math.max(
          5,
          item.stock + scenarioAdjustments.stockBias,
        );
        const riskGap = adjustedDemand - adjustedStock;
        return {
          ...item,
          adjustedDemand,
          adjustedStock,
          riskGap,
        };
      }),
    [items, scenarioAdjustments.demandBoost, scenarioAdjustments.stockBias],
  );

  const simulatedReorders = whatIfItems.filter(
    (item) => item.adjustedStock < item.adjustedDemand,
  ).length;
  const simulatedWaste = whatIfItems.filter(
    (item) => item.adjustedStock - item.adjustedDemand > 20,
  ).length;

  const supplierPulse = useMemo(
    () =>
      [
        {
          name: "Produce Lane",
          leadTime: 1,
          fillRate: 96,
          reliability: 95 + scenarioAdjustments.reliabilityBias,
        },
        {
          name: "Kitchen Supply",
          leadTime: 2,
          fillRate: 91,
          reliability: 88 + scenarioAdjustments.reliabilityBias,
        },
        {
          name: "Guest Amenities",
          leadTime: 3,
          fillRate: 97,
          reliability: 92 + scenarioAdjustments.reliabilityBias,
        },
        {
          name: "Seafood Partner",
          leadTime: 2,
          fillRate: 89,
          reliability: 84 + scenarioAdjustments.reliabilityBias,
        },
      ].map((supplier) => ({
        ...supplier,
        reliability: Math.max(45, Math.min(99, supplier.reliability)),
      })),
    [scenarioAdjustments.reliabilityBias],
  );

  const freshnessRunway = items
    .slice()
    .sort(
      (left, right) => left.stock - left.demand - (right.stock - right.demand),
    )
    .slice(0, 4)
    .map((item) => {
      const runway = Math.max(
        1,
        Math.round((item.stock / Math.max(1, item.demand)) * 7),
      );
      const runwayScore = Math.max(6, Math.min(100, runway * 12));
      return {
        ...item,
        runway,
        runwayScore,
      };
    });

  const outcomeKPIs = [
    {
      label: "Waste prevented",
      value: `${Math.max(6, totalWasteRisk * 2)} units`,
      note: "Promotions can absorb overstock before freshness drops.",
    },
    {
      label: "Margin protected",
      value: `${Math.round(totalMargin * 0.42)} pts`,
      note: "The optimizer keeps profitable items visible when stock is healthy.",
    },
    {
      label: "Reorder pressure",
      value: `${totalReorderPressure} units`,
      note: "Auto-buy queue is shaped by demand gaps instead of fixed thresholds.",
    },
    {
      label: "Scenario risk",
      value: `${simulatedReorders + simulatedWaste} flags`,
      note: "What-if mode shows how fast inventory pressure shifts under demand spikes.",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {outcomeKPIs.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
              {kpi.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">
              {kpi.value}
            </p>
            <p className="mt-2 text-sm text-slate-600">{kpi.note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard
          title="Smart Inventory Matrix"
          eyebrow="Predict -> optimize -> never waste"
        >
          <div className="mb-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                Reorder now
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">
                {reorderList.length}
              </p>
            </div>
            <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                Overstock
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">
                {overstockList.length}
              </p>
            </div>
            <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                Top profit item
              </p>
              <p className="mt-2 text-xl font-semibold text-slate-950">
                {highestMargin?.name}
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-[26px] border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Demand</th>
                  <th className="px-4 py-3">Risk</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.name}
                    className="border-t border-slate-200 bg-white"
                  >
                    <td className="px-4 py-4 font-semibold text-slate-950">
                      {item.name}
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {item.category}
                    </td>
                    <td className="px-4 py-4 text-slate-600">{item.stock}%</td>
                    <td className="px-4 py-4 text-slate-600">{item.demand}%</td>
                    <td className="px-4 py-4">
                      <SoftBadge
                        tone={
                          item.risk === "High"
                            ? "rose"
                            : item.risk === "Medium"
                              ? "amber"
                              : "emerald"
                        }
                      >
                        {item.risk}
                      </SoftBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard title="Demand vs Stock" eyebrow="Pressure signal">
            <div className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <MiniLineChart data={demandCurve} tone="violet" height={160} />
              <MiniLineChart data={stockCurve} tone="emerald" height={160} />
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl bg-white p-3 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                    Demand oracle
                  </p>
                  <p className="mt-2 text-sm text-slate-700">
                    Weather, booking density, and event timing are shaping
                    tomorrow's demand curve.
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-3 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                    Smart reorder
                  </p>
                  <p className="mt-2 text-sm text-slate-700">
                    Only items below demand thresholds get pushed into the
                    supplier queue.
                  </p>
                </div>
              </div>
            </div>
          </SectionCard>
          <SectionCard title="Waste Killer AI" eyebrow="Margin protection">
            <div className="space-y-3">
              <div className="rounded-3xl border border-slate-200 bg-white p-4">
                <p className="font-semibold text-slate-950">Overstock alert</p>
                <p className="mt-2 text-sm text-slate-600">
                  Too many tomatoes are still in storage. Push the promo dish
                  before freshness risk rises.
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-4">
                <p className="font-semibold text-slate-950">Reorder timing</p>
                <p className="mt-2 text-sm text-slate-600">
                  Juice and seafood reorder windows are moving forward because
                  of evening demand.
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-4">
                <p className="font-semibold text-slate-950">Supplier pulse</p>
                <p className="mt-2 text-sm text-slate-600">
                  Supplier timing is now tracked by reliability, fill rate, and
                  lead time volatility so reorders stay safer.
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-4">
                <p className="font-semibold text-slate-950">Freshness runway</p>
                <p className="mt-2 text-sm text-slate-600">
                  Items close to stockout or waste are ranked first so the team
                  can react before the room feels the impact.
                </p>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      <SectionCard
        title="What-If Simulator"
        eyebrow="Judge-friendly scenario engine"
      >
        <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4 rounded-[28px] border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap gap-2">
              {[
                "Calm Morning",
                "Weekend Rush",
                "Rain Alert",
                "VIP Arrival",
                "Event Night",
              ].map((scenario) => (
                <button
                  key={scenario}
                  type="button"
                  onClick={() =>
                    setWhatIfScenario(
                      scenario as
                        | "Calm Morning"
                        | "Weekend Rush"
                        | "Rain Alert"
                        | "VIP Arrival"
                        | "Event Night",
                    )
                  }
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-all ${whatIfScenario === scenario ? "bg-slate-950 text-white shadow-[0_10px_24px_rgba(15,23,42,0.18)]" : "bg-white text-slate-600 hover:bg-slate-100"}`}
                >
                  {scenario}
                </button>
              ))}
            </div>

            <div className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                Scenario effect
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                {whatIfScenario} pushes demand by{" "}
                {scenarioAdjustments.demandBoost}%
              </p>
              <p className="mt-2 text-sm text-slate-600">
                The AI rebalances reorder risk, projected waste, and supplier
                timing as soon as the scenario changes.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                  Reorders in scenario
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">
                  {simulatedReorders}
                </p>
              </div>
              <div className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                  Overstock risk
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">
                  {simulatedWaste}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
            <MiniBarChart
              data={whatIfItems.map((item) =>
                Math.max(item.adjustedDemand, item.adjustedStock),
              )}
              tone="cyan"
              height={180}
            />
            <div className="mt-4 space-y-3">
              {whatIfItems.slice(0, 4).map((item) => (
                <div
                  key={item.name}
                  className="rounded-[24px] border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-950">{item.name}</p>
                    <SoftBadge tone={item.riskGap > 0 ? "rose" : "emerald"}>
                      {item.riskGap > 0 ? "At risk" : "Healthy"}
                    </SoftBadge>
                  </div>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                        Adjusted stock
                      </p>
                      <p className="mt-1 text-lg font-semibold text-slate-950">
                        {item.adjustedStock}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                        Adjusted demand
                      </p>
                      <p className="mt-1 text-lg font-semibold text-slate-950">
                        {item.adjustedDemand}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <SectionCard
          title="Supplier Reliability Radar"
          eyebrow="Lead-time confidence"
        >
          <div className="space-y-4">
            {supplierPulse.map((supplier) => (
              <div
                key={supplier.name}
                className="rounded-[26px] border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-950">
                      {supplier.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      Lead time {supplier.leadTime}d · Fill rate{" "}
                      {supplier.fillRate}%
                    </p>
                  </div>
                  <SoftBadge
                    tone={
                      supplier.reliability > 90
                        ? "emerald"
                        : supplier.reliability > 80
                          ? "amber"
                          : "rose"
                    }
                  >
                    {supplier.reliability}% reliable
                  </SoftBadge>
                </div>
                <div className="mt-3">
                  <ProgressBar
                    value={supplier.reliability}
                    tone={
                      supplier.reliability > 90
                        ? "emerald"
                        : supplier.reliability > 80
                          ? "amber"
                          : "rose"
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Freshness Runway"
          eyebrow="Waste prevention timeline"
        >
          <div className="space-y-4">
            {freshnessRunway.map((item) => (
              <div
                key={item.name}
                className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-950">{item.name}</p>
                    <p className="text-sm text-slate-500">
                      {item.runway} days of runway before pressure spikes
                    </p>
                  </div>
                  <SoftBadge
                    tone={
                      item.runway <= 2
                        ? "rose"
                        : item.runway <= 4
                          ? "amber"
                          : "emerald"
                    }
                  >
                    {item.runway <= 2
                      ? "Immediate"
                      : item.runway <= 4
                        ? "Soon"
                        : "Safe"}
                  </SoftBadge>
                </div>
                <div className="mt-3">
                  <ProgressBar
                    value={item.runwayScore}
                    tone={
                      item.runway <= 2
                        ? "rose"
                        : item.runway <= 4
                          ? "amber"
                          : "emerald"
                    }
                  />
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  AI will prioritize this item if demand accelerates or menu mix
                  shifts.
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Dynamic Menu Optimization"
        eyebrow="Profit-aware suggestions"
      >
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <MiniBarChart
              data={items.map((item) => item.margin)}
              tone="amber"
              height={170}
            />
            <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.26em] text-slate-400">
                Menu optimizer
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                Push the most profitable dishes when stock depth is strong.
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {items.slice(0, 4).map((item) => (
              <div
                key={item.name}
                className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(15,23,42,0.08)]"
              >
                <p className="text-sm text-slate-500">{item.name}</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">
                  {item.suggestion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
