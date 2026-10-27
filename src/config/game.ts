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

export const DIWANIYA_CONFIG = {
  minPlayers: 2,
  maxPlayers: 6,
  questionCounts: [3, 5, 10] as const,
  defaultQuestionCount: 5,
} as const;

export const STORAGE_KEYS = {
  player: "sfara:player:v1",
} as const;
