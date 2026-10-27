import type { ReactNode } from "react";
import { Badge, Confetti, ResultDots, ScoreDigits, Spacer } from "@/components/ui";
import { formatScore, toArabicDigits } from "@/lib/arabic";
import { getHeadline, getNextTitleHint, getTitle, shouldCelebrate } from "../model/titles";
import type { GameResult } from "../types";
import styles from "./ResultView.module.css";

interface ResultViewProps {
  result: GameResult;
  best?: { score: number; total: number } | null;
  /** Overrides the default headline ("كفو!" …). */
  headline?: string;
  /** Overrides the default title hint line. */
  hint?: ReactNode;
  /** Action buttons pinned to the bottom. */
  children: ReactNode;
}

export function ResultView({ result, best, headline, hint, children }: ResultViewProps) {
  const { score, total, answers } = result;
  return (
    <>
      {shouldCelebrate(score, total) && <Confetti />}

      <div className={styles.head}>
        <p className={styles.headline}>{headline ?? getHeadline(score, total)}</p>
        <div className={styles.badge}>
          <Badge icon="badge" outlined>
            لقبك: {getTitle(score, total)}
          </Badge>
        </div>
        <p className={styles.hint}>{hint ?? getNextTitleHint(score, total)}</p>
      </div>

      <section
        className={styles.board}
        aria-label={`نتيجتك ${toArabicDigits(score)} من ${toArabicDigits(total)}`}
      >
        <span className={styles.boardLabel}>النتيجة النهائية</span>
        <ScoreDigits score={score} total={total} size={total >= 10 ? 80 : 96} />
        <ResultDots results={answers.map((a) => a.correct)} />
        {best && (
          <span className={styles.best}>
            أفضل نتيجة لك: <b>{formatScore(best.score, best.total)}</b>
          </span>
        )}
      </section>

      <Spacer />

      <div className={styles.actions}>{children}</div>
    </>
  );
}
