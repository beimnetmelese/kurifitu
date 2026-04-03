type RecommendationCardProps = {
  title: string;
  matchPercentage: number;
  description: string;
};

export default function RecommendationCard({
  title,
  matchPercentage,
  description,
}: RecommendationCardProps) {
  const normalizedMatch = Math.max(
    0,
    Math.min(100, Number(matchPercentage) || 0),
  );

  return (
    <article className="group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-slate-950 p-5 text-white shadow-[0_18px_50px_rgba(15,23,42,0.2)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(15,23,42,0.26)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.15),transparent_30%)]" />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200">
              Personalized Match
            </p>
            <h3 className="mt-3 text-lg font-semibold text-white">{title}</h3>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-right backdrop-blur">
            <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-100">
              Fit
            </p>
            <p className="text-lg font-semibold text-white">
              {normalizedMatch.toFixed(0)}%
            </p>
          </div>
        </div>
        <div
          className="mt-5 h-2 overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-valuenow={normalizedMatch}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400"
            style={{ width: `${normalizedMatch}%` }}
          />
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-300">{description}</p>
      </div>
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl transition duration-300 group-hover:bg-cyan-400/20" />
    </article>
  );
}
