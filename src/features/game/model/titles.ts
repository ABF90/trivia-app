/** Player titles: 0-1 احتياط · 2-3 أساسي · 4 كابتن · 5 ذيب (scaled for other round sizes). */
export type PlayerTitle = "احتياط" | "أساسي" | "كابتن" | "ذيب";

export function getTitle(score: number, total: number): PlayerTitle {
  if (total <= 0) return "احتياط";
  if (score >= total) return "ذيب";
  const ratio = score / total;
  if (ratio >= 0.8) return "كابتن";
  if (ratio >= 0.4) return "أساسي";
  return "احتياط";
}

export function getNextTitleHint(score: number, total: number): string | null {
  const title = getTitle(score, total);
  if (title === "ذيب") return "أعلى لقب! إنت ذيب";
  if (title === "كابتن") return `جيب ${total} من ${total} وتصير ذيب`;
  if (title === "أساسي") return "قربت من الكابتن، كمّل!";
  return "كل لاعب بدأ احتياط";
}

export function getHeadline(score: number, total: number): string {
  const ratio = total ? score / total : 0;
  if (ratio >= 0.8) return "كفو!";
  if (ratio >= 0.4) return "مو شين!";
  return "حظ أوفر";
}

export function shouldCelebrate(score: number, total: number): boolean {
  return total > 0 && score / total >= 0.8;
}
