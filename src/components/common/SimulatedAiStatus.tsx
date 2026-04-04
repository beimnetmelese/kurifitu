type SimulatedAiStatusProps = {
  modelName: string;
  domain: string;
  confidence: number;
  cadenceLabel: string;
};

export default function SimulatedAiStatus({
  modelName,
  domain,
  confidence,
  cadenceLabel,
}: SimulatedAiStatusProps) {
  const normalizedConfidence = Math.max(0, Math.min(100, confidence));

  return (
    <section className="rounded-2xl border border-cyan-200 bg-cyan-50/80 p-4 shadow-[0_10px_24px_rgba(8,145,178,0.08)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="relative inline-flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-600" />
          </span>
          <p className="text-sm font-semibold text-cyan-900">
            Simulated AI Active: {modelName}
          </p>
        </div>
        <span className="rounded-full border border-white bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
          {normalizedConfidence.toFixed(0)}% confidence
        </span>
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-600">
        Domain: {domain}. Decision refresh cadence: {cadenceLabel}. This panel uses deterministic simulated AI logic to generate recommendations and projected revenue impact.
      </p>
    </section>
  );
}
