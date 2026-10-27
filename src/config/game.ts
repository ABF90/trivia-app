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

export const DIWANIYA_CONFIG = {
  minPlayers: 2,
  maxPlayers: 6,
  questionCounts: [3, 5, 10] as const,
  defaultQuestionCount: 5,
} as const;

export const STORAGE_KEYS = {
  player: "sfara:player:v1",
} as const;
