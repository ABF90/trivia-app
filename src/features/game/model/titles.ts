import type { Strings } from "@/i18n";

/** Player titles: 0-1 bench · 2-3 starter · 4 captain · 5 wolf (ذيب), scaled for other round sizes. */
export type TitleKey = keyof Strings["titles"];
export type HeadlineKey = keyof Strings["headlines"];

export function getTitleKey(score: number, total: number): TitleKey {
  if (total <= 0) return "bench";
  if (score >= total) return "wolf";
  const ratio = score / total;
  if (ratio >= 0.8) return "captain";
  if (ratio >= 0.4) return "starter";
  return "bench";
}

export function getHeadlineKey(score: number, total: number): HeadlineKey {
  const ratio = total ? score / total : 0;
  if (ratio >= 0.8) return "great";
  if (ratio >= 0.4) return "good";
  return "low";
}

export function shouldCelebrate(score: number, total: number): boolean {
  return total > 0 && score / total >= 0.8;
}

/** Localized helpers, so screens don't repeat the key → string lookup. */
export function titleText(t: Strings, score: number, total: number): string {
  return t.titles[getTitleKey(score, total)];
}

export function headlineText(t: Strings, score: number, total: number): string {
  return t.headlines[getHeadlineKey(score, total)];
}

export function titleHintText(t: Strings, score: number, total: number, n: (v: number) => string): string {
  const key = getTitleKey(score, total);
  return key === "captain" ? t.titleHints.captain(n(total)) : t.titleHints[key];
}
