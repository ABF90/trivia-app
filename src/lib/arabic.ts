const DIGITS = "٠١٢٣٤٥٦٧٨٩";

/** Converts Western digits to Eastern Arabic digits (deterministic on server and client). */
export function toArabicDigits(value: number | string): string {
  return String(value).replace(/[0-9]/g, (d) => DIGITS[Number(d)]!);
}

/** "٤ / ٥" style score label. */
export function formatScore(score: number, total: number): string {
  return `${toArabicDigits(score)} / ${toArabicDigits(total)}`;
}

/** Arabic plural for "day" (يوم / يومين / أيام / يوم). */
export function formatDays(count: number): string {
  if (count === 1) return "يوم";
  if (count === 2) return "يومين";
  if (count >= 3 && count <= 10) return `${toArabicDigits(count)} أيام`;
  return `${toArabicDigits(count)} يوم`;
}
