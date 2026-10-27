import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./Chip.module.css";

interface ChipProps {
  selected?: boolean;
  onClick?: () => void;
  children: ReactNode;
}

export function Chip({ selected = false, onClick, children }: ChipProps) {
  return (
    <button type="button" aria-pressed={selected} onClick={onClick} className={cx(styles.chip, selected && styles.selected)}>
      {children}
    </button>
  );
}

/** Horizontally scrolling chip list that bleeds to the screen edges. */
export function ChipRow({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div role="group" aria-label={label} className={styles.row}>
      {children}
    </div>
  );
}
