import { LIVE_CONFIG } from "@/config/game";
import type { CategoryId, Difficulty, DifficultyFilter, Question } from "@/features/game/types";
import { hashString, shuffle } from "@/lib/random";
import { OPENTDB_QUESTIONS } from "../opentdb";
import { fetchQuestions, type ApiQuestion } from "./opentdbClient";

/** Our categories that Open Trivia DB serves live, with its category IDs. */
const API_CATEGORY = { sports: 21, animals: 27, history: 23 } as const satisfies Partial<Record<CategoryId, number>>;
type LiveCategory = keyof typeof API_CATEGORY;

export function isLiveCategory(id: CategoryId): id is LiveCategory {
  return id in API_CATEGORY;
}

// ── Translations ────────────────────────────────────────────────────────
// Live questions are matched to the bundled translations by their English
// text, so a translated question keeps its Arabic, its ID and its option order.
const normalize = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();
const translatedByText = new Map(OPENTDB_QUESTIONS.map((q) => [normalize(q.prompt.en), q]));

/** Untranslated live questions seen this session, so challenge links and results can find them by ID. */
const liveRegistry = new Map<string, Question>();

export function getLiveQuestion(id: string): Question | undefined {
  return liveRegistry.get(id);
}

export function registerLiveQuestion(q: Question) {
  liveRegistry.set(q.id, q);
}

function toQuestion(api: ApiQuestion, category: LiveCategory): Question {
  const translated = translatedByText.get(normalize(api.question));
  if (translated) return translated;

  const options = shuffle([api.correct, ...api.incorrect]).map((en) => ({ ar: en, en }));
  const question: Question = {
    id: `otdb-live-${category}-${hashString(normalize(api.question)).toString(16)}`,
    category,
    difficulty: api.difficulty,
    prompt: { ar: api.question, en: api.question },
    options: options as unknown as Question["options"],
    answer: options.findIndex((o) => o.en === api.correct),
    untranslated: true,
  };
  registerLiveQuestion(question);
  return question;
}

// ── Buffer ──────────────────────────────────────────────────────────────
// Fetched questions wait here until a round uses them. One request per
// category+difficulty is in flight at a time.
const buffer = new Map<string, Map<string, Question>>();
const inFlight = new Map<string, Promise<void>>();

const keyFor = (category: LiveCategory, difficulty: DifficultyFilter) => `${category}:${difficulty}`;

function buffered(category: LiveCategory, difficulty: DifficultyFilter, seen: ReadonlySet<string>): Question[] {
  return [...(buffer.get(keyFor(category, difficulty))?.values() ?? [])].filter((q) => !seen.has(q.id));
}

function refill(category: LiveCategory, difficulty: DifficultyFilter): Promise<void> {
  const key = keyFor(category, difficulty);
  const running = inFlight.get(key);
  if (running) return running;
  const level: Difficulty | null = difficulty === "mixed" ? null : difficulty;
  const task = fetchQuestions(API_CATEGORY[category], level, LIVE_CONFIG.batchSize)
    .then((results) => {
      const bucket = buffer.get(key) ?? new Map<string, Question>();
      for (const q of results.map((r) => toQuestion(r, category))) bucket.set(q.id, q);
      buffer.set(key, bucket);
    })
    .finally(() => inFlight.delete(key));
  inFlight.set(key, task);
  return task;
}

function withTimeout(promise: Promise<unknown>, ms: number): Promise<void> {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, ms);
    promise.then(
      () => (clearTimeout(timer), resolve()),
      () => (clearTimeout(timer), resolve()),
    );
  });
}

/**
 * Live questions available for a round. Waits (briefly) for at most one
 * category that has nothing buffered, and refills the others in the
 * background for the next round. Never rejects: offline simply means fewer
 * or no live questions, and the caller fills in from the bundle.
 */
export async function gatherLive(
  categories: readonly LiveCategory[],
  difficulty: DifficultyFilter,
  seen: ReadonlySet<string>,
  want: number,
): Promise<Map<CategoryId, Question[]>> {
  const empty = categories.filter((c) => buffered(c, difficulty, seen).length === 0);
  const waitFor = empty[0];
  if (waitFor) await withTimeout(refill(waitFor, difficulty), LIVE_CONFIG.roundWaitMs);

  for (const c of categories) {
    if (buffered(c, difficulty, seen).length < want) refill(c, difficulty).catch(() => {});
  }
  return new Map<CategoryId, Question[]>(categories.map((c) => [c, buffered(c, difficulty, seen)]));
}

/** Untranslated live questions known for a category/difficulty (for "start over"). */
export function liveIdsFor(categories: readonly CategoryId[], difficulty: DifficultyFilter): string[] {
  return [...liveRegistry.values()]
    .filter((q) => (categories.length === 0 || categories.includes(q.category)) && (difficulty === "mixed" || q.difficulty === difficulty))
    .map((q) => q.id);
}
