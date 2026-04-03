export type DemandLevel = 'Low' | 'Medium' | 'High';

export function getDemandLevel(score: number | string | null | undefined): DemandLevel {
  const demand = Number(score);
  if (!Number.isFinite(demand)) return 'Low';

  if (demand >= 71) return 'High';
  if (demand >= 41) return 'Medium';
  return 'Low';
}
