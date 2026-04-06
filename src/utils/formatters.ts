export function formatMoney(amount: number | string): string {
  const num = Number(amount);
  return isNaN(num) || !isFinite(num)
    ? "0"
    : num.toLocaleString("id-ID", { maximumFractionDigits: 0 });
}

export function formatMoneySplit(amount: number | string): string {
  const num = Number(amount);
  return isNaN(num) || !isFinite(num)
    ? "0"
    : num.toLocaleString("id-ID", { maximumFractionDigits: 0 });
}

export function roundToNearest100(amount: number): number {
  const sign = amount < 0 ? -1 : 1;
  return sign * Math.round(Math.abs(amount) / 100) * 100;
}

export function formatCalcDisplay(value: string): string {
  if (!value || value === "0") return "0";
  if (value.endsWith("."))
    return Number(value.slice(0, -1)).toLocaleString("en-US") + ".";
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  const parts = value.split(".");
  return parts[1] !== undefined
    ? `${Number(parts[0]).toLocaleString("en-US")}.${parts[1]}`
    : Number(parts[0]).toLocaleString("en-US");
}
