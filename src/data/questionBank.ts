import { CATEGORIES } from "@/data/categories";
import type { CategoryId, DifficultyFilter, Question } from "@/features/game/types";
import { createRng, hashString, sample, shuffle } from "@/lib/random";
import { gatherLive, getLiveQuestion, isLiveCategory, liveIdsFor } from "./live/liveQuestions";
import { OPENTDB_QUESTIONS } from "./opentdb";
import { LOCAL_QUESTIONS } from "./questions";

/**
 * Access layer for questions. Components never import the data files or the
 * API client directly, so sources can change by editing only this folder.
 *
 * Sources:
 * - Kuwaiti categories: hand-written, bundled.
 * - Sports / Animals / History: live from Open Trivia DB when online, matched
 *   to the bundled Arabic translations; the bundle doubles as the offline set.
 */
const BUNDLED: readonly Question[] = [...LOCAL_QUESTIONS, ...OPENTDB_QUESTIONS];
const byId = new Map(BUNDLED.map((q) => [q.id, q]));
const ALL_CATEGORY_IDS = CATEGORIES.map((c) => c.id);

export interface QuestionFilter {
  /** Empty means every category. */
  categories: readonly CategoryId[];
  difficulty: DifficultyFilter;
}

export const ANY_QUESTION: QuestionFilter = { categories: [], difficulty: "mixed" };

export function getQuestionById(id: string): Question | undefined {
  return byId.get(id) ?? getLiveQuestion(id);
}

/** Bundled questions matching a filter. */
export function getQuestions({ categories, difficulty }: QuestionFilter): Question[] {
  return BUNDLED.filter(
    (q) =>
      (categories.length === 0 || categories.includes(q.category)) &&
      (difficulty === "mixed" || q.difficulty === difficulty),
  );
}

/** Every known question ID for a filter, bundled and live (used to "start over"). */
export function questionIdsFor(filter: QuestionFilter): Set<string> {
  return new Set([...getQuestions(filter).map((q) => q.id), ...liveIdsFor(filter.categories, filter.difficulty)]);
}

export interface Round {
  questions: Question[];
  /** Unseen questions still known for this filter after this round. */
  remaining: number;
  /** How many questions in the round came from the live API. */
  live: number;
}

/**
 * Free-play round made only of questions the player hasn't seen, mixing the
 * chosen categories evenly. Each category prefers live questions and falls
 * back to the bundle (offline, slow network, or a pool the API has run out of).
 * Returns fewer than `count` when nearly everything is seen, and an empty
 * round when it's exhausted (the caller offers to reset).
 */
export async function pickFreshRound(count: number, filter: QuestionFilter, seen: ReadonlySet<string>): Promise<Round> {
  const categories = filter.categories.length ? [...filter.categories] : ALL_CATEGORY_IDS;
  const live = await gatherLive(categories.filter(isLiveCategory), filter.difficulty, seen, count);

  // Per category: live questions first, then bundled ones not already in the live list.
  const perCategory = categories.map((category) => {
    const fromApi = shuffle(live.get(category) ?? []);
    const liveIds = new Set(fromApi.map((q) => q.id));
    const fromBundle = shuffle(
      getQuestions({ categories: [category], difficulty: filter.difficulty }).filter((q) => !seen.has(q.id) && !liveIds.has(q.id)),
    );
    return [...fromApi, ...fromBundle];
  });

  // Round-robin across categories so a 3-category round isn't all one topic.
  const picked: Question[] = [];
  const order = shuffle(perCategory.map((_, i) => i));
  for (let round = 0; picked.length < count; round++) {
    const before = picked.length;
    for (const i of order) {
      const q = perCategory[i]![round];
      if (q && picked.length < count) picked.push(q);
    }
    if (picked.length === before) break;
  }

  const total = perCategory.reduce((sum, list) => sum + list.length, 0);
  const liveIds = new Set([...live.values()].flat().map((q) => q.id));
  return {
    questions: shuffle(picked),
    remaining: total - picked.length,
    live: picked.filter((q) => liveIds.has(q.id)).length,
  };
}

/** Prefers unseen questions, then tops up with seen ones (pass-the-phone mode, bundled). */
export function pickRound(count: number, filter: QuestionFilter = ANY_QUESTION, seen: ReadonlySet<string> = new Set()): Question[] {
  const pool = getQuestions(filter);
  const fresh = shuffle(pool.filter((q) => !seen.has(q.id)));
  if (fresh.length >= count) return fresh.slice(0, count);
  return [...fresh, ...sample(pool.filter((q) => seen.has(q.id)), count - fresh.length)];
}

/** Same questions for every player on a given date (bundled, so it's identical everywhere and offline). */
export function pickDailyRound(dateKey: string, count: number): Question[] {
  return sample(getQuestions(ANY_QUESTION), count, createRng(hashString(`daily:${dateKey}`)));
}
