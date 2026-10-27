import { shuffle } from "@/lib/random";
import type { Question } from "../types";

/** Picks two wrong options to remove for 50/50. */
export function pickFiftyFifty(question: Question, rng: () => number = Math.random): number[] {
  const wrong = question.options.map((_, i) => i).filter((i) => i !== question.answer);
  return shuffle(wrong, rng).slice(0, 2).sort((a, b) => a - b);
}
