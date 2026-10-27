import { toArabicDigits } from "@/lib/arabic";
import { Icon } from "../icons/Icon";
import styles from "./ScorePill.module.css";

export function ScorePill({ points }: { points: number }) {
  return (
    <div className={styles.pill} aria-label={`${toArabicDigits(points)} نقاط`}>
      <Icon name="trophy" size={18} className={styles.icon} />
      <span className={styles.value}>{toArabicDigits(points)}</span>
      <span className={styles.label}>نقاط</span>
    </div>
  );
}
