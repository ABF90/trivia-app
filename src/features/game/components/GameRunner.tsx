"use client";

import { useEffect, useState } from "react";
import type { SegmentState } from "@/components/ui";
import { toArabicDigits } from "@/lib/arabic";
import { useGame } from "../hooks/useGame";
import type { GameState } from "../model/gameReducer";
import type { GameResult, Question } from "../types";
import { ExitConfirmSheet } from "./ExitConfirmSheet";
import { FeedbackView } from "./FeedbackView";
import { GameHeader } from "./GameHeader";
import { QuestionView } from "./QuestionView";

export interface GameRunnerProps {
  questions: Question[];
  onFinish: (result: GameResult) => void;
  /** Called after the player confirms leaving mid-round. */
  onExit: () => void;
  allowLifeline?: boolean;
  /** Header text, defaults to "السؤال ٢ من ٥". */
  label?: (index: number, total: number) => string;
  /** Points earned before this round (e.g. a diwaniya player's running total). */
  scoreOffset?: number;
}

const defaultLabel = (index: number, total: number) =>
  `السؤال ${toArabicDigits(index + 1)} من ${toArabicDigits(total)}`;

function toSegments(state: GameState): SegmentState[] {
  return state.questions.map((_, i) => {
    const answer = state.answers[i];
    if (answer) return answer.correct ? "correct" : "wrong";
    return i === state.index ? "current" : "pending";
  });
}

function vibrate(pattern: number | number[]) {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  // Browsers reject vibration before the first real tap.
  if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return;
  navigator.vibrate(pattern);
}

/**
 * Plays one round from first question to last. The parent owns what happens
 * before and after (intro, result screen), which keeps this reusable across
 * free play, daily, challenge and diwaniya modes.
 */
export function GameRunner({
  questions,
  onFinish,
  onExit,
  allowLifeline = true,
  label = defaultLabel,
  scoreOffset = 0,
}: GameRunnerProps) {
  const { state, question, lastAnswer, score, actions } = useGame(questions, { onFinish });
  const [confirmingExit, setConfirmingExit] = useState(false);

  useEffect(() => {
    if (lastAnswer) vibrate(lastAnswer.correct ? 30 : [40, 60, 40]);
  }, [lastAnswer]);

  const openExit = () => {
    actions.pause();
    setConfirmingExit(true);
  };
  const stay = () => {
    setConfirmingExit(false);
    actions.resume();
  };

  const showFeedback = lastAnswer && !lastAnswer.correct;
  const isLast = state.index === state.questions.length - 1;

  return (
    <>
      <GameHeader
        label={label(state.index, state.questions.length)}
        segments={toSegments(state)}
        score={scoreOffset + score}
        onExit={showFeedback ? undefined : openExit}
      />

      {showFeedback ? (
        <FeedbackView
          question={question}
          answer={lastAnswer}
          nextLabel={isLast ? "شوف النتيجة" : "التالي"}
          disabled={state.phase === "finished"}
          onNext={actions.next}
        />
      ) : (
        <QuestionView
          state={state}
          question={question}
          lastAnswer={lastAnswer}
          allowLifeline={allowLifeline}
          onAnswer={actions.answer}
          onLifeline={actions.applyLifeline}
        />
      )}

      <ExitConfirmSheet open={confirmingExit} onStay={stay} onLeave={onExit} />
    </>
  );
}
