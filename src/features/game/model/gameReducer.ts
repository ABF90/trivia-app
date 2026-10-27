import type { AnswerRecord, GameResult, Question } from "../types";

export type GamePhase = "answering" | "revealed" | "finished";

export interface GameState {
  questions: Question[];
  index: number;
  phase: GamePhase;
  answers: AnswerRecord[];
  secondsPerQuestion: number;
  timeLeft: number;
  paused: boolean;
  lifelineUsed: boolean;
  /** Options hidden by 50/50 for the current question. */
  removed: number[];
}

export type GameAction =
  | { type: "tick" }
  | { type: "answer"; option: number }
  | { type: "useLifeline"; removed: number[] }
  | { type: "next" }
  | { type: "pause" }
  | { type: "resume" };

export function createGameState(questions: Question[], secondsPerQuestion: number): GameState {
  return {
    questions,
    index: 0,
    phase: "answering",
    answers: [],
    secondsPerQuestion,
    timeLeft: secondsPerQuestion,
    paused: false,
    lifelineUsed: false,
    removed: [],
  };
}

function reveal(state: GameState, selected: number | null): GameState {
  const question = state.questions[state.index]!;
  const record: AnswerRecord = {
    questionId: question.id,
    selected,
    correct: selected === question.answer,
  };
  return { ...state, phase: "revealed", answers: [...state.answers, record] };
}

/** Pure state machine for one round. Side effects (timers, randomness) live in useGame. */
export function gameReducer(state: GameState, action: GameAction): GameState {
  const canAct = state.phase === "answering" && !state.paused;

  switch (action.type) {
    case "tick": {
      if (!canAct) return state;
      const timeLeft = state.timeLeft - 1;
      return timeLeft > 0 ? { ...state, timeLeft } : reveal({ ...state, timeLeft: 0 }, null);
    }
    case "answer":
      if (!canAct || state.removed.includes(action.option)) return state;
      return reveal(state, action.option);
    case "useLifeline":
      if (!canAct || state.lifelineUsed) return state;
      return { ...state, lifelineUsed: true, removed: action.removed };
    case "next": {
      if (state.phase !== "revealed") return state;
      if (state.index >= state.questions.length - 1) return { ...state, phase: "finished" };
      return {
        ...state,
        index: state.index + 1,
        phase: "answering",
        timeLeft: state.secondsPerQuestion,
        removed: [],
      };
    }
    case "pause":
      return { ...state, paused: true };
    case "resume":
      return { ...state, paused: false };
  }
}

// Selectors
export const selectQuestion = (s: GameState) => s.questions[s.index]!;
export const selectLastAnswer = (s: GameState): AnswerRecord | undefined =>
  s.phase === "answering" ? undefined : s.answers[s.answers.length - 1];
export const selectScore = (s: GameState) => s.answers.filter((a) => a.correct).length;
export const selectResult = (s: GameState): GameResult => ({
  questions: s.questions,
  answers: s.answers,
  score: selectScore(s),
  total: s.questions.length,
});
