import type { CSSProperties } from "react";
import { cx } from "@/lib/cx";
import styles from "./SegmentedControl.module.css";

interface SegmentedControlProps<T extends string | number> {
  legend: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  format?: (value: T) => string;
}

export function SegmentedControl<T extends string | number>({
  legend,
  options,
  value,
  onChange,
  format = String,
}: SegmentedControlProps<T>) {
  return (
    <fieldset className={styles.group}>
      <legend className={styles.legend}>{legend}</legend>
      <div className={styles.options} style={{ "--count": options.length } as CSSProperties}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={option === value}
            className={cx(styles.option, option === value && styles.selected)}
            onClick={() => onChange(option)}
          >
            {format(option)}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
