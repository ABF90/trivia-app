import { GAME_CONFIG } from "@/config/game";
import { getQuestionById, pickDailyRound } from "@/data/questionBank";
import { daysBetween } from "@/lib/date";
import type { GameResult, Question } from "../game/types";
import type { DailyEntry } from "../player";

export function getDailyNumber(dateKey: string): number {
  return Math.max(1, daysBetween(GAME_CONFIG.dailyLaunchDate, dateKey) + 1);
}

export function getDailyRound(dateKey: string): Question[] {
  return pickDailyRound(dateKey, GAME_CONFIG.roundSize);
}

/** Rebuilds a full result from what is stored on the device. */
export function entryToResult(entry: DailyEntry): GameResult {
  const questions = entry.questionIds.map(getQuestionById).filter((q): q is Question => !!q);
  const answers = questions.map((q, i) => {
    const selected = entry.selections[i] ?? null;
    return { questionId: q.id, selected, correct: selected === q.answer };
  });
  return { questions, answers, score: entry.score, total: entry.total };
}
