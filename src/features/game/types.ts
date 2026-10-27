export type CategoryId = "worldcup" | "legends" | "gulf" | "league" | "olympics";

export interface Category {
  id: CategoryId;
  label: string;
}

export interface Question {
  id: string;
  category: CategoryId;
  prompt: string;
  /** Short form used in answer reviews. */
  summary: string;
  options: readonly [string, string, string, string];
  /** Index into `options`. */
  answer: number;
  /** "تعرف؟" fact shown after a wrong answer. */
  fact: string;
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
