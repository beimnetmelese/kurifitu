import { formatCurrency } from "../../utils/formatCurrency.ts";
import type { SegmentSummary } from "../../services/segmentationService.ts";

type SegmentTableProps = {
  data?: SegmentSummary[];
};

export default function SegmentTable({ data = [] }: SegmentTableProps) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="border-b border-slate-200/80 px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
          Audience Intelligence
        </p>
        <h2 className="mt-2 text-xl font-semibold text-slate-950">
          Segment Insights
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr className="bg-slate-50/90 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              <th className="px-5 py-4">Segment Name</th>
              <th className="px-5 py-4">Avg Spend</th>
              <th className="px-5 py-4">Description</th>
              <th className="px-5 py-4">Strategy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {data.map((row) => (
              <tr key={row.name} className="transition hover:bg-emerald-50/60">
                <td className="px-5 py-4 font-medium text-slate-900">
                  {row.name}
                </td>
                <td className="px-5 py-4 text-slate-600">
                  {formatCurrency(row.avgSpend)}
                </td>
                <td className="px-5 py-4 text-sm leading-6 text-slate-600">
                  {row.description || row.behaviorSummary}
                </td>
                <td className="px-5 py-4 text-sm leading-6 text-slate-600">
                  {row.recommendedStrategy || row.strategy}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
