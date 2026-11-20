export function formatCoins(value) {
  const n = Math.round(Number(value) || 0);
  if (n >= 1000000) {
    const m = Math.round((n / 1000000) * 10) / 10;
    return `${Number.isInteger(m) ? m : String(m).replace('.', ',')}M`;
  }
  if (n >= 1000) {
    return `${Math.round(n / 1000)}K`;
  }
  return String(n);
}