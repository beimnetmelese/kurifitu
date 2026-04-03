export function calculateGrowth(
  before: number | string | null | undefined,
  after: number | string | null | undefined,
): number {
  const previous = Number(before);
  const current = Number(after);

  if (!Number.isFinite(previous) || !Number.isFinite(current)) return 0;
  if (previous === 0) return current === 0 ? 0 : 100;

  return ((current - previous) / previous) * 100;
}
