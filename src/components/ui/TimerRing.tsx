import { toArabicDigits } from "@/lib/arabic";
import { cx } from "@/lib/cx";
import styles from "./TimerRing.module.css";

const RADIUS = 32;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface TimerRingProps {
  timeLeft: number;
  total: number;
  warningAt: number;
  paused?: boolean;
}

export function TimerRing({ timeLeft, total, warningAt, paused = false }: TimerRingProps) {
  const warning = timeLeft <= warningAt;
  const offset = CIRCUMFERENCE * (1 - timeLeft / total);
  return (
    <div className={cx(styles.timer, warning && styles.warning, paused && styles.paused)} role="timer">
      <svg width="76" height="76" viewBox="0 0 76 76" aria-label={`باقي ${toArabicDigits(timeLeft)} ثانية`} role="img">
        <circle className={styles.track} cx="38" cy="38" r={RADIUS} fill="none" strokeWidth="7" />
        <circle
          className={styles.ring}
          cx="38"
          cy="38"
          r={RADIUS}
          fill="none"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          transform="rotate(-90 38 38)"
        />
      </svg>
      <span className={styles.value} aria-hidden>
        {toArabicDigits(timeLeft)}
      </span>
    </div>
  );
}
