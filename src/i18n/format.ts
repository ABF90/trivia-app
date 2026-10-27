import type { Language } from "./strings";

const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/** Eastern Arabic digits in Arabic, Western digits in English. */
export function formatNumber(value: number | string, lang: Language): string {
  const s = String(value);
  return lang === "ar" ? s.replace(/[0-9]/g, (d) => ARABIC_DIGITS[Number(d)]!) : s;
}

export function formatScore(score: number, total: number, lang: Language): string {
  return `${formatNumber(score, lang)} / ${formatNumber(total, lang)}`;
}

/** "يوم / يومين / ٣ أيام / ١١ يوم" — "1 day / 3 days". */
export function formatDays(count: number, lang: Language): string {
  if (lang === "en") return count === 1 ? "1 day" : `${count} days`;
  if (count === 1) return "يوم";
  if (count === 2) return "يومين";
  if (count >= 3 && count <= 10) return `${formatNumber(count, lang)} أيام`;
  return `${formatNumber(count, lang)} يوم`;
}
