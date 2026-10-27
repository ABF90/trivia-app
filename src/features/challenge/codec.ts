import * as Linking from "expo-linking";
import { isCategoryId } from "@/data/categories";
import { registerLiveQuestion } from "@/data/live/liveQuestions";
import { getQuestionById } from "@/data/questionBank";
import type { GameResult, Question } from "../game/types";

/**
 * A challenge travels entirely inside the link (no server):
 * challenger name + question IDs + right/wrong per question. Untranslated
 * live questions aren't in the friend's app, so they travel in full (`x`).
 */
export interface Challenge {
  name: string;
  questions: Question[];
  results: boolean[];
  score: number;
}

interface WireFormat {
  v: 1;
  n: string;
  q: string[];
  r: string; // "10111"
  /** Embedded questions the receiver may not have (untranslated live ones). */
  x?: EmbeddedQuestion[];
}

interface EmbeddedQuestion {
  i: string; // id
  c: string; // category
  d: string; // difficulty
  p: string; // prompt (English)
  o: string[]; // 4 options (English)
  a: number; // answer index
}

const DIFFICULTIES = ["easy", "medium", "hard"] as const;

function embed(q: Question): EmbeddedQuestion {
  return { i: q.id, c: q.category, d: q.difficulty, p: q.prompt.en, o: q.options.map((o) => o.en), a: q.answer };
}

function unembed(e: EmbeddedQuestion): Question | null {
  const difficulty = DIFFICULTIES.find((d) => d === e.d);
  if (typeof e.i !== "string" || !isCategoryId(e.c) || !difficulty || typeof e.p !== "string") return null;
  if (!Array.isArray(e.o) || e.o.length !== 4 || !Number.isInteger(e.a) || e.a < 0 || e.a > 3) return null;
  const question: Question = {
    id: e.i,
    category: e.c,
    difficulty,
    prompt: { ar: e.p, en: e.p },
    options: e.o.map((en) => ({ ar: String(en), en: String(en) })) as unknown as Question["options"],
    answer: e.a,
    untranslated: true,
  };
  registerLiveQuestion(question);
  return question;
}

// UTF-8 via encodeURIComponent so this runs on Hermes, browsers and Node alike
// (Hermes doesn't guarantee TextDecoder).
function utf8ToBinary(text: string): string {
  return encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, (_, hex: string) => String.fromCharCode(parseInt(hex, 16)));
}

function binaryToUtf8(binary: string): string {
  return decodeURIComponent(
    Array.from(binary, (c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`).join(""),
  );
}

function toBase64Url(text: string): string {
  return btoa(utf8ToBinary(text)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(code: string): string {
  const base64 = code.replace(/-/g, "+").replace(/_/g, "/");
  return binaryToUtf8(atob(base64 + "=".repeat((4 - (base64.length % 4)) % 4)));
}

export function encodeChallenge(name: string, result: GameResult): string {
  const wire: WireFormat = {
    v: 1,
    n: name.slice(0, 24),
    q: result.questions.map((q) => q.id),
    r: result.answers.map((a) => (a.correct ? "1" : "0")).join(""),
  };
  const untranslated = result.questions.filter((q) => q.untranslated);
  if (untranslated.length) wire.x = untranslated.map(embed);
  return toBase64Url(JSON.stringify(wire));
}

export function decodeChallenge(code: string | null | undefined): Challenge | null {
  if (!code) return null;
  try {
    const wire = JSON.parse(fromBase64Url(code)) as Partial<WireFormat>;
    if (wire.v !== 1 || !Array.isArray(wire.q) || typeof wire.r !== "string") return null;
    if (wire.q.length === 0 || wire.q.length !== wire.r.length || wire.q.length > 20) return null;

    const embedded = new Map(
      (Array.isArray(wire.x) ? wire.x : []).map((e) => [String(e?.i), e] as const),
    );
    const questions = wire.q.map((id) => {
      const known = getQuestionById(String(id));
      if (known) return known;
      const e = embedded.get(String(id));
      return e ? unembed(e) : null;
    });
    if (questions.some((q) => !q)) return null;

    const results = [...wire.r].map((c) => c === "1");
    return {
      /** Empty when the sender left no name; screens show a localized fallback. */
      name: typeof wire.n === "string" ? wire.n.trim() : "",
      questions: questions as Question[],
      results,
      score: results.filter(Boolean).length,
    };
  } catch {
    return null;
  }
}

/**
 * Deep link into the challenge screen. Resolves to `sfara://challenge?d=…` in
 * builds, `exp://<dev-server>/--/challenge?d=…` in Expo Go and an http URL on web.
 */
export function buildChallengeUrl(name: string, result: GameResult): string {
  return Linking.createURL("challenge", { queryParams: { d: encodeChallenge(name, result) } });
}

export type ChallengeOutcome = "win" | "draw" | "lose";

export function compareScores(mine: number, theirs: number): ChallengeOutcome {
  if (mine > theirs) return "win";
  if (mine === theirs) return "draw";
  return "lose";
}
