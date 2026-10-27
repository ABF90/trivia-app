import type { I18n } from "@/i18n";

/** e.g. "٥ من ٥ تغلبه · ٤ من ٥ تعادل · أقل تخسر" / "5 of 5 wins · 4 of 5 draws · less loses" */
export function describeRules({ t, n }: I18n, theirScore: number, total: number): string {
  const of = (v: number) => t.scoreOf(n(v), n(total));
  if (theirScore >= total) return `${t.ruleDraw(of(total))} · ${t.ruleLose}`;
  const win = theirScore + 1 === total ? t.ruleWin(of(total)) : t.ruleWinOrMore(of(theirScore + 1));
  return `${win} · ${t.ruleDraw(of(theirScore))} · ${t.ruleLose}`;
}
