import type { CSSProperties } from "react";
import { cx } from "@/lib/cx";
import { Icon } from "../icons/Icon";
import styles from "./ResultDots.module.css";

interface ResultDotsProps {
  results: boolean[];
  size?: number;
  showIcons?: boolean;
}

export function ResultDots({ results, size = 32, showIcons = true }: ResultDotsProps) {
  const label = results.map((ok) => (ok ? "صح" : "غلط")).join("، ");
  return (
    <div className={styles.row} role="img" aria-label={label} style={{ "--size": `${size}px` } as CSSProperties}>
      {results.map((ok, i) => (
        <span key={i} className={cx(styles.dot, ok ? styles.correct : styles.wrong)}>
          {showIcons && <Icon name={ok ? "check" : "close"} size={size * 0.56} strokeWidth={3} />}
        </span>
      ))}
    </div>
  );
}
