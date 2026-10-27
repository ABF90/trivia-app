import { cx } from "@/lib/cx";
import styles from "./LifelineButton.module.css";

interface LifelineButtonProps {
  used: boolean;
  disabled?: boolean;
  onUse: () => void;
}

export function LifelineButton({ used, disabled, onUse }: LifelineButtonProps) {
  return (
    <button
      type="button"
      className={cx(styles.lifeline, used && styles.used)}
      disabled={used || disabled}
      onClick={onUse}
      aria-label={used ? "٥٠/٥٠، استخدمتها" : "٥٠/٥٠، احذف إجابتين"}
    >
      <span className={styles.title}>٥٠/٥٠</span>
      <span className={styles.caption}>{used ? "استخدمتها" : "احذف ٢"}</span>
    </button>
  );
}
