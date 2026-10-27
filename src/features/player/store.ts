import { STORAGE_KEYS } from "@/config/game";
import { createPersistentStore } from "@/lib/createPersistentStore";
import { addDays } from "@/lib/date";
import type { GameResult } from "../game/types";

export interface DailyEntry {
  score: number;
  total: number;
  questionIds: string[];
  /** Selected option per question, `null` for a timeout. */
  selections: (number | null)[];
}

export interface PlayerData {
  name: string;
  best: { score: number; total: number } | null;
  daily: {
    lastPlayed: string | null;
    streak: number;
    history: Record<string, DailyEntry>;
  };
}

const DEFAULT_PLAYER: PlayerData = {
  name: "",
  best: null,
  daily: { lastPlayed: null, streak: 0, history: {} },
};

/** How many days of daily history to keep on the device. */
const HISTORY_DAYS = 14;

export const playerStore = createPersistentStore<PlayerData>(STORAGE_KEYS.player, DEFAULT_PLAYER);

const ratio = (s: { score: number; total: number }) => s.score / s.total;

// ── Actions ─────────────────────────────────────────────────────────────

export function recordRound({ score, total }: GameResult) {
  playerStore.update((p) => ({
    ...p,
    best: !p.best || ratio({ score, total }) > ratio(p.best) ? { score, total } : p.best,
  }));
}

export function recordDaily(dateKey: string, result: GameResult) {
  playerStore.update((p) => {
    if (p.daily.history[dateKey]) return p; // one attempt per day
    const continues = p.daily.lastPlayed === addDays(dateKey, -1);
    const history = { ...p.daily.history };
    history[dateKey] = {
      score: result.score,
      total: result.total,
      questionIds: result.questions.map((q) => q.id),
      selections: result.answers.map((a) => a.selected),
    };
    const cutoff = addDays(dateKey, -HISTORY_DAYS);
    for (const key of Object.keys(history)) if (key < cutoff) delete history[key];

    return {
      ...p,
      daily: { lastPlayed: dateKey, streak: continues ? p.daily.streak + 1 : 1, history },
    };
  });
  recordRound(result);
}

export function setPlayerName(name: string) {
  playerStore.update((p) => ({ ...p, name: name.slice(0, 24) }));
}

// ── Selectors ───────────────────────────────────────────────────────────

/** Streak that is still alive today (played today or yesterday). */
export function selectStreak(p: PlayerData, today: string): number {
  const { lastPlayed, streak } = p.daily;
  if (!lastPlayed) return 0;
  return lastPlayed === today || lastPlayed === addDays(today, -1) ? streak : 0;
}

export function selectDailyEntry(p: PlayerData, dateKey: string): DailyEntry | undefined {
  return p.daily.history[dateKey];
}
