import type { CSSProperties } from "react";
import { cx } from "@/lib/cx";
import styles from "./ProgressSegments.module.css";

export type SegmentState = "correct" | "wrong" | "current" | "pending";

export function ProgressSegments({ segments }: { segments: SegmentState[] }) {
  return (
    <div className={styles.track} style={{ "--count": segments.length } as CSSProperties} aria-hidden>
      {segments.map((state, i) => (
        <span key={i} className={cx(styles.segment, state !== "pending" && styles[state])} />
      ))}
    </div>
  );
}
