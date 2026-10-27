import { AnswerOption, QuestionCard, Spacer, TimerRing, type AnswerState } from "@/components/ui";
import { GAME_CONFIG } from "@/config/game";
import { getCategory } from "@/data/categories";
import type { GameState } from "../model/gameReducer";
import type { AnswerRecord, Question } from "../types";
import { LifelineButton } from "./LifelineButton";
import styles from "./QuestionView.module.css";

interface QuestionViewProps {
  state: GameState;
  question: Question;
  lastAnswer?: AnswerRecord;
  allowLifeline: boolean;
  onAnswer: (option: number) => void;
  onLifeline: () => void;
}

function optionState(i: number, state: GameState, question: Question, lastAnswer?: AnswerRecord): AnswerState {
  if (lastAnswer && lastAnswer.selected === i) return lastAnswer.correct ? "correct" : "wrong";
  if (state.removed.includes(i)) return "removed";
  if (lastAnswer && i === question.answer) return "correct";
  return "idle";
}

export function QuestionView({ state, question, lastAnswer, allowLifeline, onAnswer, onLifeline }: QuestionViewProps) {
  const answering = state.phase === "answering";
  const warning = answering && state.timeLeft <= GAME_CONFIG.warningSeconds;

  return (
    <>
      <div className={styles.timerRow}>
        <span />
        <TimerRing
          timeLeft={state.timeLeft}
          total={state.secondsPerQuestion}
          warningAt={GAME_CONFIG.warningSeconds}
          paused={state.paused || !answering}
        />
        {allowLifeline ? (
          <LifelineButton used={state.lifelineUsed} disabled={!answering} onUse={onLifeline} />
        ) : (
          <span />
        )}
      </div>

      {/* key restarts the entry animation for every new question */}
      <div className={styles.card} key={question.id}>
        <QuestionCard prompt={question.prompt} category={getCategory(question.category).label} warning={warning} />
      </div>

      <Spacer />

      <div className={styles.options} key={`${question.id}-options`}>
        {question.options.map((label, i) => (
          <AnswerOption
            key={i}
            index={i}
            label={label}
            state={optionState(i, state, question, lastAnswer)}
            disabled={!answering}
            onSelect={() => onAnswer(i)}
          />
        ))}
      </div>
    </>
  );
}
