import type { DecisionInsight } from "../../types/decisionInsight";

type DecisionInsightCardProps = {
  item: DecisionInsight;
};

export default function DecisionInsightCard({ item }: DecisionInsightCardProps) {
  const toneClass =
    item.tone === "success"
      ? "border-emerald-200 bg-emerald-50/70"
      : item.tone === "warning"
        ? "border-amber-200 bg-amber-50/70"
        : "border-cyan-200 bg-cyan-50/70";

  const confidenceLabel =
    typeof item.confidence === "number"
      ? `${Math.max(0, Math.min(100, item.confidence)).toFixed(0)}% confidence`
      : null;

  return (
    <article
      className={`rounded-2xl border p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] ${toneClass}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
        {confidenceLabel ? (
          <span className="rounded-full border border-white/80 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
            {confidenceLabel}
          </span>
        ) : null}
      </div>

      <dl className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
        <div>
          <dt className="font-semibold text-slate-900">Prediction</dt>
          <dd>{item.prediction}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-900">Insight</dt>
          <dd>{item.insight}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-900">Recommended Action</dt>
          <dd>{item.recommendedAction}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-900">Expected Impact</dt>
          <dd className="font-semibold text-emerald-700">{item.expectedImpact}</dd>
        </div>
      </dl>

      {item.reason ? (
        <p className="mt-3 rounded-xl border border-white/70 bg-white/70 px-3 py-2 text-xs leading-5 text-slate-600">
          Reason: {item.reason}
        </p>
      ) : null}
    </article>
  );
}
