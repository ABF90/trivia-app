import { LIVE_CONFIG } from "@/config/game";
import type { Difficulty } from "@/features/game/types";

/** A question exactly as Open Trivia DB returns it (after URL-decoding). */
export interface ApiQuestion {
  category: string;
  difficulty: Difficulty;
  question: string;
  correct: string;
  incorrect: string[];
}

interface ApiResponse {
  response_code: number;
  results?: { difficulty: string; category: string; question: string; correct_answer: string; incorrect_answers: string[] }[];
  token?: string;
}

/** Response codes from https://opentdb.com/api_config.php */
const CODE = { ok: 0, noResults: 1, invalidParam: 2, tokenNotFound: 3, tokenEmpty: 4, rateLimit: 5 } as const;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ── Rate limiting ───────────────────────────────────────────────────────
// Every request goes through one queue so calls are at least 5s apart, even
// when several screens ask at once.
let queue: Promise<unknown> = Promise.resolve();
let lastRequestAt = 0;

function scheduled<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const wait = lastRequestAt + LIVE_CONFIG.minRequestGapMs - Date.now();
    if (wait > 0) await sleep(wait);
    lastRequestAt = Date.now();
    return task();
  });
  queue = run.catch(() => undefined);
  return run;
}

// ── Connectivity ────────────────────────────────────────────────────────
let offlineUntil = 0;

export function isLikelyOffline(): boolean {
  return Date.now() < offlineUntil;
}

async function getJson(path: string): Promise<ApiResponse> {
  if (isLikelyOffline()) throw new Error("offline");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), LIVE_CONFIG.requestTimeoutMs);
  try {
    const res = await fetch(`${LIVE_CONFIG.baseUrl}${path}`, { signal: controller.signal });
    if (res.status === 429) return { response_code: CODE.rateLimit };
    return (await res.json()) as ApiResponse;
  } catch (error) {
    offlineUntil = Date.now() + LIVE_CONFIG.offlineCooldownMs;
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

// ── Session token ───────────────────────────────────────────────────────
// A token makes the API skip questions it already sent us. It lives in
// memory: the API expires tokens after 6 hours without use anyway, and the
// app keeps its own "seen" list for the long term.
// The very first question request goes out without one: fetching a token
// first would cost a whole 5s rate-limit slot before any question arrives.
let token: string | null = null;
let tokenRequest: Promise<void> | null = null;

function requestTokenInBackground() {
  if (token || tokenRequest) return;
  tokenRequest = scheduled(() => getJson("/api_token.php?command=request"))
    .then((data) => {
      token = data.token ?? null;
    })
    .catch(() => {})
    .finally(() => {
      tokenRequest = null;
    });
}

const decode = (s: string) => decodeURIComponent(s).trim();

/**
 * Fetches up to `amount` unseen multiple-choice questions for one category.
 * Handles the API's quirks: asks for fewer when a pool is small, renews an
 * expired or exhausted token, and backs off on rate limits.
 * Resolves to [] when the category has nothing new; rejects when offline.
 */
export async function fetchQuestions(categoryId: number, difficulty: Difficulty | null, amount: number): Promise<ApiQuestion[]> {
  let size = Math.min(amount, 50);
  let renewedToken = false;
  for (let attempt = 0; attempt < 6 && size >= 1; attempt++) {
    const tk = token;
    const params = new URLSearchParams({
      amount: String(size),
      category: String(categoryId),
      type: "multiple",
      encode: "url3986",
      ...(tk ? { token: tk } : {}),
      ...(difficulty ? { difficulty } : {}),
    });
    const data = await scheduled(() => getJson(`/api.php?${params}`));
    if (!tk) requestTokenInBackground();

    switch (data.response_code) {
      case CODE.ok:
        return (data.results ?? []).map((q) => ({
          category: decode(q.category),
          difficulty: decode(q.difficulty) as Difficulty,
          question: decode(q.question),
          correct: decode(q.correct_answer),
          incorrect: q.incorrect_answers.map(decode),
        }));
      case CODE.noResults:
        size = Math.floor(size / 2); // fewer left than requested
        break;
      case CODE.tokenEmpty:
        // The token has sent everything it can for this query at this size.
        if (size > 1) {
          size = Math.floor(size / 2);
        } else if (!renewedToken && tk) {
          await scheduled(() => getJson(`/api_token.php?command=reset&token=${tk}`));
          renewedToken = true;
          size = Math.min(amount, 50);
        } else {
          return [];
        }
        break;
      case CODE.tokenNotFound:
        token = null; // expired; request a fresh one
        break;
      case CODE.rateLimit:
        await sleep(LIVE_CONFIG.minRequestGapMs);
        break;
      default:
        return [];
    }
  }
  return [];
}
