import type { Language } from "@/i18n/strings";

/** Text in both app languages. */
export type Localized = Record<Language, string>;

export type CategoryId =
  // Kuwaiti sports (hand-written)
  | "legends"
  | "worldcup"
  | "gulf"
  | "league"
  | "olympics"
  // Open Trivia DB (translated)
  | "sports"
  | "animals"
  | "history";

export type Difficulty = "easy" | "medium" | "hard";
/** What the player picks: one level, or all of them. */
export type DifficultyFilter = Difficulty | "mixed";

export interface Category {
  id: CategoryId;
  label: Localized;
}

export interface Question {
  id: string;
  category: CategoryId;
  difficulty: Difficulty;
  prompt: Localized;
  /** Short form used in answer reviews; falls back to `prompt`. */
  summary?: Localized;
  options: readonly [Localized, Localized, Localized, Localized];
  /** Index into `options`. Fixed at build time so stored results stay valid. */
  answer: number;
  /** "تعرف؟" fact shown after a wrong answer, when there is one. */
  fact?: Localized;
  /** Live question with no Arabic translation yet: `ar` holds the English text. */
  untranslated?: boolean;
}

export interface AnswerRecord {
  questionId: string;
  /** `null` when the timer ran out. */
  selected: number | null;
  correct: boolean;
}

export interface GameResult {
  questions: Question[];
  answers: AnswerRecord[];
  score: number;
  total: number;
}
