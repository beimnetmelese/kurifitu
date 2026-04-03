import InsightCard from "../components/cards/InsightCard";
import SegmentTable from "../components/tables/SegmentTable";
import { guests } from "../data/guests";
import { segments } from "../data/segments";
import {
  buildSegmentSummaries,
  getHighValueSegments,
} from "../services/segmentationService.ts";

export default function Segments() {
  const segmentInsights = buildSegmentSummaries(guests, segments);
  const highValueSegments = getHighValueSegments(segments);

  const avgSpend =
    segmentInsights.length > 0
      ? segmentInsights.reduce((sum, segment) => sum + segment.avgSpend, 0) /
        segmentInsights.length
      : 0;

  return (
    <section className="space-y-6">
      <div className="relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-slate-950 px-6 py-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.12),transparent_28%)]" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-violet-200/90">
              Audience Strategy
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              Customer Segments
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Segment behavior insights and marketing strategy guidance.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-100">
                Segments
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {segmentInsights.length}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-100">
                Avg. spend
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {avgSpend.toFixed(0)}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-100">
                High value
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {highValueSegments.length} targets
              </p>
            </div>
          </div>
        </div>
      </div>

      <SegmentTable data={segmentInsights} />

      <div className="grid gap-4 md:grid-cols-2">
        <InsightCard
          title="High-Value Segment Focus"
          description={`AI segmentation prioritizes the segments with strongest spending potential. Priority segments: ${highValueSegments.map((segment) => segment.name).join(", ")}`}
          type="success"
        />
      </div>
    </section>
  );
}
