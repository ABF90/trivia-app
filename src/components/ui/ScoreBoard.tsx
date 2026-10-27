import type { CSSProperties } from "react";
import { toArabicDigits } from "@/lib/arabic";
import { cx } from "@/lib/cx";
import styles from "./ScoreBoard.module.css";

interface ScoreDigitsProps {
  score: number;
  total: number;
  /** Digit tile width: px number (scales down on narrow phones) or any CSS length. */
  size?: number | string;
  variant?: "inset" | "boxed";
}

/** Stadium-scoreboard style "٤ / ٥". */
export function ScoreDigits({ score, total, size = 96, variant = "inset" }: ScoreDigitsProps) {
  const tile = cx(styles.digit, variant === "boxed" && styles.boxed);
  return (
    <div
      className={styles.digits}
      style={{ "--w": typeof size === "number" ? `min(${size}px, ${size / 4}vw)` : size } as CSSProperties}
      aria-label={`${toArabicDigits(score)} من ${toArabicDigits(total)}`}
      role="img"
    >
      <span className={cx(tile, styles.score, score === 0 && styles.zero)}>{toArabicDigits(score)}</span>
      <span className={styles.slash}>/</span>
      <span className={tile}>{toArabicDigits(total)}</span>
    </div>
  );
}
