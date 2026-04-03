import Badge from "../common/Badge";
import { formatCurrency } from "../../utils/formatCurrency.ts";
import type { PricingInsight } from "../../services/pricingService.ts";

function getDemandBadgeType(
  level: PricingInsight["demandLevel"],
): "success" | "warning" | "info" {
  if (level === "High") return "success";
  if (level === "Medium") return "warning";
  return "info";
}

type PricingTableProps = {
  data?: PricingInsight[];
};

export default function PricingTable({ data = [] }: PricingTableProps) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="border-b border-slate-200/80 px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
          Revenue Optimization
        </p>
        <h2 className="mt-2 text-xl font-semibold text-slate-950">
          AI Pricing Recommendations
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr className="bg-slate-50/90 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              <th className="px-5 py-4">Room Type</th>
              <th className="px-5 py-4">Current Price</th>
              <th className="px-5 py-4">Suggested Price</th>
              <th className="px-5 py-4">Demand Level</th>
              <th className="px-5 py-4">AI Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {data.map((room) => {
              const currentPrice = Number(room.currentPrice) || 0;
              const suggestedPrice = Number(room.suggestedPrice) || 0;
              const isIncrease = suggestedPrice > currentPrice;
              const isDecrease = suggestedPrice < currentPrice;

              return (
                <tr
                  key={room.roomType}
                  className="transition hover:bg-cyan-50/60"
                >
                  <td className="px-5 py-4 font-medium text-slate-900">
                    {room.roomType}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {formatCurrency(currentPrice)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                        isIncrease
                          ? "bg-emerald-50 text-emerald-700"
                          : isDecrease
                            ? "bg-rose-50 text-rose-700"
                            : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {formatCurrency(suggestedPrice)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      text={room.demandLevel}
                      type={getDemandBadgeType(room.demandLevel)}
                    />
                  </td>
                  <td className="px-5 py-4 text-sm leading-6 text-slate-600">
                    {room.optimizationReason || room.reason}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
