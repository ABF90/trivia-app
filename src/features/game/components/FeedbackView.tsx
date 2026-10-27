import { AnswerOption, Button, FactCard, QuestionCard, Spacer, type AnswerState } from "@/components/ui";
import type { AnswerRecord, Question } from "../types";
import styles from "./FeedbackView.module.css";

interface FeedbackViewProps {
  question: Question;
  answer: AnswerRecord;
  nextLabel?: string;
  disabled?: boolean;
  onNext: () => void;
}

/** Shown after a wrong answer or timeout: reveals the right answer and a fact. */
export function FeedbackView({ question, answer, nextLabel = "التالي", disabled, onNext }: FeedbackViewProps) {
  const timedOut = answer.selected === null;

  const stateFor = (i: number): { state: AnswerState; tag?: string } => {
    if (i === question.answer) return { state: "correct", tag: "الجواب الصح" };
    if (i === answer.selected) return { state: "wrong", tag: "جوابك" };
    return { state: "dimmed" };
  };

  return (
    <>
      <p className={styles.headline} role="status">
        {timedOut ? "خلص الوقت!" : "مو هالمرة!"}
      </p>

      <div className={styles.card}>
        <QuestionCard prompt={question.prompt} compact />
      </div>

      <div className={styles.options}>
        {question.options.map((label, i) => {
          const { state, tag } = stateFor(i);
          return <AnswerOption key={i} label={label} state={state} tag={tag} compact />;
        })}
      </div>

      <div className={styles.fact}>
        <FactCard>{question.fact}</FactCard>
      </div>

      <Spacer />

      <Button size="lg" flat icon="chevronForward" onClick={onNext} disabled={disabled}>
        {nextLabel}
      </Button>
    </>
  );
}
