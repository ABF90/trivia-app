import type { Question } from "@/features/game/types";
import { hashString, shuffle } from "@/lib/random";

/** Fewer valid questions than this and the reply counts as broken. */
const MIN_QUESTIONS = 3;

interface RawQuestion {
  question: string;
  correct: string;
  wrong: string[];
}

/**
 * Pulls a JSON value out of a model reply that may be messy: wrapped in
 * ```json fences, preceded by "Sure! Here are…", or followed by notes.
 */
export function extractJson(text: string): unknown {
  const cleaned = text.replace(/```(?:json)?/gi, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    // Fall back to the outermost {...} or [...] block.
  }
  for (const [open, close] of [["{", "}"], ["[", "]"]] as const) {
    const start = cleaned.indexOf(open);
    const end = cleaned.lastIndexOf(close);
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1));
      } catch {
        // try the next shape
      }
    }
  }
  return null;
}

const text = (v: unknown) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim() : "");

/** Accepts the shape we ask for, plus common variations models drift into. */
function toRaw(item: unknown): RawQuestion | null {
  if (!item || typeof item !== "object") return null;
  const o = item as Record<string, unknown>;
  const question = text(o.question ?? o.q ?? o.prompt);
  let correct = text(o.correct ?? o.answer ?? o.correct_answer ?? o.correctAnswer);
  let wrong = (o.wrong ?? o.incorrect ?? o.incorrect_answers ?? o.wrong_answers ?? o.wrongAnswers) as unknown;

  // { options: [...], answer: 2 } or { options: [...], answer: "text" }
  if (!Array.isArray(wrong) && Array.isArray(o.options)) {
    const options = o.options.map(text);
    const idx = typeof o.answer === "number" ? o.answer : options.indexOf(correct);
    if (idx >= 0 && idx < options.length) {
      correct = options[idx]!;
      wrong = options.filter((_, i) => i !== idx);
    }
  }
  if (!question || !correct || !Array.isArray(wrong)) return null;

  const wrongs = [...new Set(wrong.map(text))].filter((w) => w && w !== correct).slice(0, 3);
  return wrongs.length === 3 ? { question, correct, wrong: wrongs } : null;
}

/**
 * Turns the model's reply into playable questions, or `null` when it can't
 * be read. The right answer is shuffled into a random position here.
 */
export function parseReply(reply: string, topic: string, count: number): Question[] | null {
  const json = extractJson(reply);
  const list = Array.isArray(json)
    ? json
    : json && typeof json === "object"
      ? ((json as Record<string, unknown>).questions ?? Object.values(json).find(Array.isArray))
      : null;
  if (!Array.isArray(list)) return null;

  const seen = new Set<string>();
  const raws = list
    .map(toRaw)
    .filter((q): q is RawQuestion => !!q && !seen.has(q.question) && !!seen.add(q.question))
    .slice(0, count);
  if (raws.length < MIN_QUESTIONS) return null;

  return raws.map((r) => {
    const options = shuffle([r.correct, ...r.wrong]);
    return {
      id: `ai-${hashString(`${topic}|${r.question}`).toString(16)}`,
      category: "ai",
      difficulty: "medium",
      prompt: { ar: r.question, en: r.question },
      options: options.map((o) => ({ ar: o, en: o })) as unknown as Question["options"],
      answer: options.indexOf(r.correct),
      generated: true,
    };
  });
}
