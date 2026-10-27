import { toArabicDigits } from "@/lib/arabic";

/** e.g. "٥ من ٥ تغلبه · ٤ من ٥ تعادل · أقل تخسر" */
export function describeRules(theirScore: number, total: number): string {
  const n = (v: number) => `${toArabicDigits(v)} من ${toArabicDigits(total)}`;
  if (theirScore >= total) return `${n(total)} تعادل · أقل تخسر`;
  const win = theirScore + 1 === total ? n(total) : `${n(theirScore + 1)} أو أكثر`;
  return `${win} تغلبه · ${n(theirScore)} تعادل · أقل تخسر`;
}
