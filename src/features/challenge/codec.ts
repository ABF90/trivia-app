import { getQuestionById } from "@/data/questionBank";
import type { GameResult, Question } from "../game/types";

/**
 * A challenge travels entirely inside the link (no server):
 * challenger name + question IDs + right/wrong per question.
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
}

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(code: string): string {
  const base64 = code.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64 + "=".repeat((4 - (base64.length % 4)) % 4));
  return new TextDecoder().decode(Uint8Array.from(binary, (c) => c.charCodeAt(0)));
}

export function encodeChallenge(name: string, result: GameResult): string {
  const wire: WireFormat = {
    v: 1,
    n: name.slice(0, 24),
    q: result.questions.map((q) => q.id),
    r: result.answers.map((a) => (a.correct ? "1" : "0")).join(""),
  };
  return toBase64Url(JSON.stringify(wire));
}

export function decodeChallenge(code: string | null | undefined): Challenge | null {
  if (!code) return null;
  try {
    const wire = JSON.parse(fromBase64Url(code)) as Partial<WireFormat>;
    if (wire.v !== 1 || !Array.isArray(wire.q) || typeof wire.r !== "string") return null;
    if (wire.q.length === 0 || wire.q.length !== wire.r.length || wire.q.length > 20) return null;

    const questions = wire.q.map((id) => getQuestionById(String(id)));
    if (questions.some((q) => !q)) return null;

    const results = [...wire.r].map((c) => c === "1");
    return {
      name: typeof wire.n === "string" && wire.n.trim() ? wire.n.trim() : "واحد من ربعك",
      questions: questions as Question[],
      results,
      score: results.filter(Boolean).length,
    };
  } catch {
    return null;
  }
}

export function buildChallengeUrl(origin: string, name: string, result: GameResult): string {
  return `${origin}/challenge?d=${encodeChallenge(name, result)}`;
}

export type ChallengeOutcome = "win" | "draw" | "lose";

export function compareScores(mine: number, theirs: number): ChallengeOutcome {
  if (mine > theirs) return "win";
  if (mine === theirs) return "draw";
  return "lose";
}
