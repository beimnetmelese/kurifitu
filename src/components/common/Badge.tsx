type BadgeType = "info" | "success" | "warning" | "danger" | "neutral";

type BadgeProps = {
  text: string;
  type?: BadgeType;
};

const badgeStyles: Record<BadgeType, string> = {
  info: "border-cyan-200 bg-cyan-50 text-cyan-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  danger: "border-rose-200 bg-rose-50 text-rose-800",
  neutral: "border-slate-200 bg-slate-50 text-slate-700",
};

export default function Badge({ text, type = "info" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide shadow-sm ${badgeStyles[type]}`}
    >
      {text}
    </span>
  );
}
