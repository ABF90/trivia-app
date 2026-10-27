import type { CategoryId, Question } from "@/features/game/types";
import { createRng, hashString, sample } from "@/lib/random";
import { QUESTIONS } from "./questions";

/**
 * Access layer for questions. Components never import QUESTIONS directly,
 * so the source can later move to an API/CMS by changing only this file.
 */
const byId = new Map(QUESTIONS.map((q) => [q.id, q]));

export function getQuestionById(id: string): Question | undefined {
  return byId.get(id);
}

export function getQuestions(category?: CategoryId): Question[] {
  return category ? QUESTIONS.filter((q) => q.category === category) : [...QUESTIONS];
}

/** Random round for free play. */
export function pickRound(count: number, category?: CategoryId): Question[] {
  return sample(getQuestions(category), count);
}

/** Same questions for every player on a given date. */
export function pickDailyRound(dateKey: string, count: number): Question[] {
  return sample(getQuestions(), count, createRng(hashString(`daily:${dateKey}`)));
}
