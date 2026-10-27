import { DIWANIYA_CONFIG } from "@/config/game";
import { toArabicDigits } from "@/lib/arabic";
import type { Question } from "../game/types";

export interface DiwaniyaPlayer {
  id: number;
  /** Raw input; may be empty (then the default "لاعب n" is used). */
  name: string;
  score: number;
}

export type QuestionCount = (typeof DIWANIYA_CONFIG.questionCounts)[number];

export interface DiwaniyaState {
  status: "setup" | "playing" | "finished";
  players: DiwaniyaPlayer[];
  nextId: number;
  questionsPerPlayer: QuestionCount;
  /** 0-based round; each round every player answers one question. */
  round: number;
  /** Index of the player whose turn it is. */
  turn: number;
  queue: Question[];
}

export type DiwaniyaAction =
  | { type: "addPlayer" }
  | { type: "removePlayer"; id: number }
  | { type: "renamePlayer"; id: number; name: string }
  | { type: "setQuestionCount"; count: QuestionCount }
  | { type: "start"; queue: Question[] }
  | { type: "recordTurn"; correct: boolean }
  | { type: "reset" };

export const initialDiwaniyaState: DiwaniyaState = {
  status: "setup",
  players: [
    { id: 1, name: "", score: 0 },
    { id: 2, name: "", score: 0 },
  ],
  nextId: 3,
  questionsPerPlayer: DIWANIYA_CONFIG.defaultQuestionCount,
  round: 0,
  turn: 0,
  queue: [],
};

export function defaultPlayerName(index: number): string {
  return `لاعب ${toArabicDigits(index + 1)}`;
}

export function playerName(player: DiwaniyaPlayer, index: number): string {
  return player.name.trim() || defaultPlayerName(index);
}

export function diwaniyaReducer(state: DiwaniyaState, action: DiwaniyaAction): DiwaniyaState {
  switch (action.type) {
    case "addPlayer":
      if (state.players.length >= DIWANIYA_CONFIG.maxPlayers) return state;
      return {
        ...state,
        players: [...state.players, { id: state.nextId, name: "", score: 0 }],
        nextId: state.nextId + 1,
      };
    case "removePlayer":
      if (state.players.length <= DIWANIYA_CONFIG.minPlayers) return state;
      return { ...state, players: state.players.filter((p) => p.id !== action.id) };
    case "renamePlayer":
      return {
        ...state,
        players: state.players.map((p) => (p.id === action.id ? { ...p, name: action.name.slice(0, 20) } : p)),
      };
    case "setQuestionCount":
      return { ...state, questionsPerPlayer: action.count };
    case "start":
      return {
        ...state,
        status: "playing",
        players: state.players.map((p) => ({ ...p, score: 0 })),
        round: 0,
        turn: 0,
        queue: action.queue,
      };
    case "recordTurn": {
      if (state.status !== "playing") return state;
      const players = state.players.map((p, i) =>
        i === state.turn && action.correct ? { ...p, score: p.score + 1 } : p,
      );
      const lastInRound = state.turn === state.players.length - 1;
      const round = lastInRound ? state.round + 1 : state.round;
      return {
        ...state,
        players,
        turn: lastInRound ? 0 : state.turn + 1,
        round,
        status: round >= state.questionsPerPlayer ? "finished" : "playing",
      };
    }
    case "reset":
      return { ...state, status: "setup", round: 0, turn: 0, queue: [], players: state.players.map((p) => ({ ...p, score: 0 })) };
  }
}

// Selectors
export const totalTurns = (s: DiwaniyaState) => s.players.length * s.questionsPerPlayer;
export const selectCurrentQuestion = (s: DiwaniyaState) => s.queue[s.round * s.players.length + s.turn];

/** Players sorted by score with shared ranks for ties. */
export function selectStandings(s: DiwaniyaState) {
  const sorted = s.players
    .map((player, index) => ({ player, index, name: playerName(player, index) }))
    .sort((a, b) => b.player.score - a.player.score || a.index - b.index);
  return sorted.map((entry) => ({
    ...entry,
    rank: sorted.findIndex((e) => e.player.score === entry.player.score) + 1,
  }));
}
