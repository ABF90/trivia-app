import type { CSSProperties } from "react";
import { cx } from "@/lib/cx";
import { Icon } from "../icons/Icon";
import styles from "./AnswerOption.module.css";

export type AnswerState = "idle" | "correct" | "wrong" | "removed" | "dimmed";

interface AnswerOptionProps {
  label: string;
  state?: AnswerState;
  /** Small caption shown next to the icon, e.g. "جوابك". */
  tag?: string;
  /** Position in the list, used to stagger the entry animation. */
  index?: number;
  compact?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
}

export function AnswerOption({ label, state = "idle", tag, index = 0, compact, disabled, onSelect }: AnswerOptionProps) {
  const icon = state === "correct" ? "check" : state === "wrong" ? "close" : null;
  return (
    <button
      type="button"
      className={cx(styles.option, state !== "idle" && styles[state], compact && styles.compact)}
      style={{ "--i": index } as CSSProperties}
      disabled={disabled || state !== "idle"}
      aria-hidden={state === "removed" || undefined}
      tabIndex={state === "removed" ? -1 : undefined}
      onClick={onSelect}
    >
      <span>{label}</span>
      {(icon || tag) && (
        <span className={styles.tag}>
          {tag}
          {icon && <Icon name={icon} size={22} strokeWidth={3} />}
        </span>
      )}
    </button>
  );
}
