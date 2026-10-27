import type { CSSProperties } from "react";
import { Icon } from "@/components/ui";
import { cx } from "@/lib/cx";
import type { GameResult } from "../../game/types";
import styles from "./AnswerReview.module.css";

/** "راجع أجوبتك": each question with the right answer, and the player's pick when wrong. */
export function AnswerReview({ result }: { result: GameResult }) {
  return (
    <ol className={styles.list}>
      {result.questions.map((q, i) => {
        const answer = result.answers[i];
        const correct = !!answer?.correct;
        const yours = answer && answer.selected !== null ? q.options[answer.selected] : "ما جاوبت";
        return (
          <li key={q.id} className={cx(styles.item, !correct && styles.wrongItem)} style={{ "--i": i } as CSSProperties}>
            <span className={styles.mark}>
              <Icon name={correct ? "check" : "close"} size={16} strokeWidth={3} label={correct ? "صح" : "غلط"} />
            </span>
            <span className={styles.text}>
              <span className={styles.summary}>{q.summary}</span>
              <b className={styles.answer}>
                {q.options[q.answer]} {!correct && <span className={styles.yours}>· جوابك: {yours}</span>}
              </b>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
