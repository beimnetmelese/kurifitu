export function formatCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return '$0.00';

  const numericValue = Number(value);
  if (Number.isNaN(numericValue) || !Number.isFinite(numericValue)) return '$0.00';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(numericValue);
}
