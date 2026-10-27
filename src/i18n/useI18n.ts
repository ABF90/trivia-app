import { useMemo } from "react";
import { usePlayer } from "@/features/player/usePlayer";
import { formatDays, formatNumber, formatScore } from "./format";
import { STRINGS, type Language } from "./strings";

export type Direction = "rtl" | "ltr";

export interface I18n {
  lang: Language;
  dir: Direction;
  t: (typeof STRINGS)[Language];
  /** Format a number with the language's digits. */
  n: (value: number | string) => string;
  score: (score: number, total: number) => string;
  days: (count: number) => string;
  /** Pick the current language from a `{ ar, en }` value. */
  pick: (text: { ar: string; en: string }) => string;
}

export function i18nFor(lang: Language): I18n {
  return {
    lang,
    dir: lang === "ar" ? "rtl" : "ltr",
    t: STRINGS[lang],
    n: (v) => formatNumber(v, lang),
    score: (s, total) => formatScore(s, total, lang),
    days: (c) => formatDays(c, lang),
    pick: (text) => text[lang],
  };
}

/** Current language, strings and formatters. Re-renders when the player switches language. */
export function useI18n(): I18n {
  const { language } = usePlayer();
  return useMemo(() => i18nFor(language), [language]);
}
