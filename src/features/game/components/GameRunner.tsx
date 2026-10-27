import { useEffect, useState } from "react";
import type { SegmentState } from "@/components/ui";
import { useI18n, type I18n } from "@/i18n";
import { haptics } from "@/lib/platform/haptics";
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
  /** Header text, defaults to "السؤال ٢ من ٥" / "Question 2 of 5". */
  label?: (index: number, total: number) => string;
  /** Points earned before this round (e.g. a diwaniya player's running total). */
  scoreOffset?: number;
}

const defaultLabel = ({ t, n }: I18n) => (index: number, total: number) => t.questionOf(n(index + 1), n(total));

function toSegments(state: GameState): SegmentState[] {
  return state.questions.map((_, i) => {
    const answer = state.answers[i];
    if (answer) return answer.correct ? "correct" : "wrong";
    return i === state.index ? "current" : "pending";
  });
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
  label,
  scoreOffset = 0,
}: GameRunnerProps) {
  const i18n = useI18n();
  const { t } = i18n;
  const { state, question, lastAnswer, score, actions } = useGame(questions, { onFinish });
  const headerLabel = label ?? defaultLabel(i18n);
  const [confirmingExit, setConfirmingExit] = useState(false);

  useEffect(() => {
    if (lastAnswer) void (lastAnswer.correct ? haptics.success() : haptics.error());
  }, [lastAnswer]);

  const openExit = () => {
    actions.pause();
    setConfirmingExit(true);
  };
  const stay = () => {
    setConfirmingExit(false);
    actions.resume();
  };
  const leave = () => {
    setConfirmingExit(false);
    onExit();
  };

  const showFeedback = lastAnswer && !lastAnswer.correct;
  const isLast = state.index === state.questions.length - 1;

  return (
    <>
      <GameHeader
        label={headerLabel(state.index, state.questions.length)}
        segments={toSegments(state)}
        score={scoreOffset + score}
        onExit={showFeedback ? undefined : openExit}
      />

      {showFeedback ? (
        <FeedbackView
          question={question}
          answer={lastAnswer}
          nextLabel={isLast ? t.seeResult : t.next}
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

      <ExitConfirmSheet open={confirmingExit} onStay={stay} onLeave={leave} />
    </>
  );
}
