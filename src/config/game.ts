/** Central game tuning. Change numbers here, not inside components. */
export const GAME_CONFIG = {
  roundSize: 5,
  secondsPerQuestion: 15,
  /** Timer turns amber and pulses below this many seconds. */
  warningSeconds: 5,
  /** Delay before auto-advancing after a correct answer. */
  correctAdvanceMs: 1200,
  /** Day #1 of the daily challenge (local date, YYYY-MM-DD). */
  dailyLaunchDate: "2026-10-16",
} as const;

/** Live questions from Open Trivia DB (https://opentdb.com, CC BY-SA 4.0). */
export const LIVE_CONFIG = {
  baseUrl: "https://opentdb.com",
  /** The API allows one request per 5 seconds per IP. */
  minRequestGapMs: 5100,
  requestTimeoutMs: 6000,
  /** Questions requested per call (API max 50). */
  batchSize: 10,
  /** How long a round start may wait for live questions before using bundled ones. */
  roundWaitMs: 4000,
  /** After a network failure, skip the network for this long. */
  offlineCooldownMs: 30_000,
} as const;

/** AI question mode (OpenRouter). Phone only: a web build would hand the key to every visitor. */
export const AI_CONFIG = {
  endpoint: "https://openrouter.ai/api/v1/chat/completions",
  /**
   * Free models, in priority order. OpenRouter tries the next one when a model
   * is rate-limited or down, within the same request. Keep every entry ":free"
   * so a fallback can never land on a paid model. Swap names if one retires (404).
   */
  models: [
    "google/gemma-4-31b-it:free", // fast, good Arabic; often busy
    "nvidia/nemotron-3.5-lightning:free", // ~1 min
    "nvidia/nemotron-3.5-super-vl:free", // last resort, slowest
  ],
  questionCount: 5,
  /** Free models can be slow; give up after this long and show the error face. */
  timeoutMs: 120_000,
  /** Show the "still working" line after this long. */
  slowHintMs: 20_000,
  maxTopicLength: 80,
} as const;

export const DIWANIYA_CONFIG = {
  minPlayers: 2,
  maxPlayers: 6,
  questionCounts: [3, 5, 10] as const,
  defaultQuestionCount: 5,
} as const;

export const STORAGE_KEYS = {
  player: "sfara:player:v1",
} as const;
