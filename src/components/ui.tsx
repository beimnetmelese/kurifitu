import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export function SectionCard({
  title,
  eyebrow,
  action,
  children,
  className = "",
}: {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`group rounded-[32px] border border-slate-200/80 bg-white/95 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(15,23,42,0.11)] ${className}`}
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          {eyebrow ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-lime-700">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-1 text-[1.05rem] font-semibold tracking-tight text-slate-950 md:text-xl">
            {title}
          </h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function GlassPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[32px] border border-slate-200/80 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionKicker({ text }: { text: string }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan-600">
      {text}
    </p>
  );
}

export function AnimatedNumber({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const [current, setCurrent] = useState(value);

  useEffect(() => {
    let raf = 0;
    const start = current;
    const delta = value - start;
    const duration = 24;
    let frame = 0;

    const step = () => {
      frame += 1;
      const progress = Math.min(frame / duration, 1);
      setCurrent(Math.round(start + delta * progress));
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <span>
      {current.toLocaleString()}
      {suffix}
    </span>
  );
}

export function StatTile({
  label,
  value,
  suffix,
  accent,
}: {
  label: string;
  value: number;
  suffix?: string;
  accent: "cyan" | "violet" | "emerald" | "amber" | "rose";
}) {
  const accentClass =
    accent === "cyan"
      ? "from-cyan-500/20 to-cyan-400/5 text-cyan-700"
      : accent === "violet"
        ? "from-violet-500/20 to-violet-400/5 text-violet-700"
        : accent === "emerald"
          ? "from-emerald-500/20 to-emerald-400/5 text-emerald-700"
          : accent === "amber"
            ? "from-amber-500/20 to-amber-400/5 text-amber-700"
            : "from-rose-500/20 to-rose-400/5 text-rose-700";

  return (
    <div
      className={`group rounded-[28px] border border-slate-200/80 bg-gradient-to-br ${accentClass} p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_55px_rgba(15,23,42,0.1)]`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
        {label}
      </p>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
        <AnimatedNumber value={value} suffix={suffix} />
      </p>
    </div>
  );
}

export function SoftBadge({
  children,
  tone = "slate",
}: {
  children: ReactNode;
  tone?: "slate" | "cyan" | "violet" | "emerald" | "amber" | "rose";
}) {
  const toneClass =
    tone === "cyan"
      ? "bg-cyan-50 text-cyan-800 ring-cyan-200"
      : tone === "violet"
        ? "bg-violet-50 text-violet-800 ring-violet-200"
        : tone === "emerald"
          ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
          : tone === "amber"
            ? "bg-amber-50 text-amber-800 ring-amber-200"
            : tone === "rose"
              ? "bg-rose-50 text-rose-800 ring-rose-200"
              : "bg-slate-100 text-slate-700 ring-slate-200";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset transition-all duration-200 ${toneClass}`}
    >
      {children}
    </span>
  );
}

export function ProgressBar({
  value,
  tone = "cyan",
}: {
  value: number;
  tone?: "cyan" | "violet" | "emerald" | "amber" | "rose";
}) {
  const fillClass =
    tone === "cyan"
      ? "from-cyan-500 to-sky-500"
      : tone === "violet"
        ? "from-violet-500 to-fuchsia-500"
        : tone === "emerald"
          ? "from-emerald-500 to-teal-500"
          : tone === "amber"
            ? "from-amber-500 to-orange-500"
            : "from-rose-500 to-pink-500";

  return (
    <div className="h-2 w-full rounded-full bg-slate-100">
      <div
        className={`h-2 rounded-full bg-gradient-to-r ${fillClass}`}
        style={{ width: `${Math.max(4, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function MiniLineChart({
  data,
  tone = "cyan",
  height = 110,
}: {
  data: number[];
  tone?: "cyan" | "violet" | "emerald" | "amber";
  height?: number;
}) {
  const dimensions = { width: 100, height: 100 };
  const stroke =
    tone === "cyan"
      ? "#0891b2"
      : tone === "violet"
        ? "#7c3aed"
        : tone === "emerald"
          ? "#059669"
          : "#d97706";

  const { line, area } = useMemo(() => {
    const points = data.length > 1 ? data : [data[0] ?? 0, data[0] ?? 0];
    const max = Math.max(...points, 1);
    const min = Math.min(...points);
    const range = Math.max(max - min, 1);
    const stepX = dimensions.width / (points.length - 1);
    const coords = points.map((point, index) => ({
      x: index * stepX,
      y:
        dimensions.height -
        ((point - min) / range) * (dimensions.height - 12) -
        6,
    }));

    const linePath = coords
      .map(
        (point, index) =>
          `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`,
      )
      .join(" ");
    const areaPath = `${linePath} L ${dimensions.width} ${dimensions.height} L 0 ${dimensions.height} Z`;
    return { line: linePath, area: areaPath };
  }, [data]);

  return (
    <svg viewBox="0 0 100 100" className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={`area-${tone}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.25" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0.04" />
        </linearGradient>
      </defs>
      {[20, 40, 60, 80].map((lineY) => (
        <line
          key={lineY}
          x1="0"
          y1={lineY}
          x2="100"
          y2={lineY}
          stroke="rgba(148,163,184,0.25)"
          strokeDasharray="3 4"
        />
      ))}
      <path d={area} fill={`url(#area-${tone})`} />
      <path
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MiniBarChart({
  data,
  tone = "violet",
  height = 110,
}: {
  data: number[];
  tone?: "cyan" | "violet" | "emerald" | "amber" | "rose";
  height?: number;
}) {
  const fill =
    tone === "cyan"
      ? "url(#bar-cyan)"
      : tone === "violet"
        ? "url(#bar-violet)"
        : tone === "emerald"
          ? "url(#bar-emerald)"
          : tone === "amber"
            ? "url(#bar-amber)"
            : "url(#bar-amber)";

  const max = Math.max(...data, 1);
  const barWidth = 100 / Math.max(data.length, 1);

  return (
    <svg viewBox="0 0 100 100" className="w-full" style={{ height }}>
      <defs>
        <linearGradient id="bar-cyan" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
        <linearGradient id="bar-violet" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="bar-emerald" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="bar-amber" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      {data.map((value, index) => {
        const barHeight = (value / max) * 82 + 8;
        const x = index * barWidth + 4;
        return (
          <rect
            key={`${value}-${index}`}
            x={x}
            y={100 - barHeight}
            width={barWidth - 8}
            height={barHeight}
            rx="5"
            fill={fill}
          />
        );
      })}
    </svg>
  );
}

export function DonutGauge({ value, label }: { value: number; label: string }) {
  const normalized = Math.max(0, Math.min(100, value));
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalized / 100) * circumference;

  return (
    <div className="flex items-center gap-4 rounded-[28px] border border-slate-200/80 bg-slate-50/90 p-4 shadow-[0_12px_32px_rgba(15,23,42,0.05)]">
      <svg viewBox="0 0 100 100" className="h-20 w-20 shrink-0">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="10"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#0ea5e9"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-semibold text-slate-950">{normalized}%</p>
      </div>
    </div>
  );
}

export function PageTabButton({
  active,
  title,
  detail,
  onClick,
}: {
  active: boolean;
  title: string;
  detail: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl border px-4 py-3 text-left transition-all duration-300 ${active ? "border-slate-950 bg-slate-950 text-white shadow-[0_14px_35px_rgba(2,132,199,0.18)]" : "border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"}`}
    >
      <div className="text-sm font-semibold">{title}</div>
      <div
        className={`mt-1 text-xs ${active ? "text-slate-300" : "text-slate-500"}`}
      >
        {detail}
      </div>
    </button>
  );
}

export function ScenarioChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-200 ${active ? "border-lime-400 bg-lime-50 text-lime-800 shadow-[0_10px_30px_rgba(132,204,22,0.14)]" : "border-slate-200 bg-white text-slate-600 hover:border-lime-200 hover:bg-lime-50 hover:text-lime-700"}`}
    >
      {label}
    </button>
  );
}

export function MotionLine({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent ${className}`}
    />
  );
}

export function PulseDot({
  tone = "cyan",
}: {
  tone?: "cyan" | "violet" | "emerald" | "amber";
}) {
  const color =
    tone === "cyan"
      ? "bg-cyan-400"
      : tone === "violet"
        ? "bg-violet-400"
        : tone === "emerald"
          ? "bg-emerald-400"
          : "bg-amber-400";
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full ${color} animate-pulse`}
    />
  );
}

export function movingGradientClass(
  tone: "cyan" | "violet" | "emerald" | "amber" | "rose",
) {
  return tone === "cyan"
    ? "from-cyan-500/15 via-sky-500/10 to-transparent"
    : tone === "violet"
      ? "from-violet-500/15 via-fuchsia-500/10 to-transparent"
      : tone === "emerald"
        ? "from-emerald-500/15 via-teal-500/10 to-transparent"
        : tone === "amber"
          ? "from-amber-500/15 via-orange-500/10 to-transparent"
          : "from-rose-500/15 via-pink-500/10 to-transparent";
}
