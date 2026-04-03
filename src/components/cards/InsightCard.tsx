type InsightType = "info" | "success" | "warning";

type InsightCardProps = {
  title: string;
  description: string;
  type?: InsightType;
};

export default function InsightCard({
  title,
  description,
  type = "info",
}: InsightCardProps) {
  const typeClass =
    type === "success"
      ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white"
      : type === "warning"
        ? "border-amber-200 bg-gradient-to-br from-amber-50 to-white"
        : "border-cyan-200 bg-gradient-to-br from-cyan-50 to-white";

  const labelTone =
    type === "success"
      ? "text-emerald-700"
      : type === "warning"
        ? "text-amber-700"
        : "text-cyan-700";

  return (
    <article
      className={`relative overflow-hidden rounded-[28px] border p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.1)] ${typeClass}`}
    >
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-white/50 blur-3xl" />
      <span
        className={`inline-flex rounded-full border border-white/80 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${labelTone}`}
      >
        AI Insight
      </span>
      <h3 className="mt-4 text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </article>
  );
}
