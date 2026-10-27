import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { GAME_CONFIG } from "@/config/game";
import {
  createGameState,
  gameReducer,
  selectLastAnswer,
  selectQuestion,
  selectResult,
  selectScore,
} from "../model/gameReducer";
import { pickFiftyFifty } from "../model/lifeline";
import type { GameResult, Question } from "../types";

interface UseGameOptions {
  onFinish?: (result: GameResult) => void;
  secondsPerQuestion?: number;
}

/** Wires the pure reducer to time: the countdown, auto-advance and finish callback. */
export function useGame(questions: Question[], options: UseGameOptions = {}) {
  const { onFinish, secondsPerQuestion = GAME_CONFIG.secondsPerQuestion } = options;
  const [state, dispatch] = useReducer(gameReducer, undefined, () =>
    createGameState(questions, secondsPerQuestion),
  );

  const question = selectQuestion(state);
  const lastAnswer = selectLastAnswer(state);
  const { phase, paused } = state;

  // Countdown — one interval per question, stopped while paused or revealed.
  useEffect(() => {
    if (phase !== "answering" || paused) return;
    const id = setInterval(() => dispatch({ type: "tick" }), 1000);
    return () => clearInterval(id);
  }, [phase, paused, state.index]);

  // Correct answers advance on their own; wrong ones wait for "التالي".
  useEffect(() => {
    if (phase !== "revealed" || !lastAnswer?.correct) return;
    const id = setTimeout(() => dispatch({ type: "next" }), GAME_CONFIG.correctAdvanceMs);
    return () => clearTimeout(id);
  }, [phase, lastAnswer]);

  // Fire onFinish exactly once per finished round.
  const onFinishRef = useRef(onFinish);
  useEffect(() => {
    onFinishRef.current = onFinish;
  });
  const reported = useRef(false);
  useEffect(() => {
    if (phase !== "finished") {
      reported.current = false;
      return;
    }
    if (reported.current) return;
    reported.current = true;
    onFinishRef.current?.(selectResult(state));
  }, [phase, state]);

  const answer = useCallback((option: number) => dispatch({ type: "answer", option }), []);
  const next = useCallback(() => dispatch({ type: "next" }), []);
  const pause = useCallback(() => dispatch({ type: "pause" }), []);
  const resume = useCallback(() => dispatch({ type: "resume" }), []);
  const applyLifeline = useCallback(
    () => dispatch({ type: "useLifeline", removed: pickFiftyFifty(question) }),
    [question],
  );

  const result = useMemo(() => selectResult(state), [state]);

  return {
    state,
    question,
    lastAnswer,
    score: selectScore(state),
    result,
    actions: { answer, next, pause, resume, applyLifeline },
  };
}
