import { Icon } from "@/components/ui";
import { cx } from "@/lib/cx";
import { weekOf } from "@/lib/date";
import styles from "./WeekStrip.module.css";

interface WeekStripProps {
  today: string;
  playedDays: ReadonlySet<string>;
}

export function WeekStrip({ today, playedDays }: WeekStripProps) {
  return (
    <ul className={styles.week} role="list" aria-label="أيام هالأسبوع">
      {weekOf(today).map(({ key, label }) => {
        const isToday = key === today;
        const played = playedDays.has(key);
        return (
          <li key={key} className={cx(styles.day, isToday && styles.today)}>
            <span className={styles.label}>{isToday ? "اليوم" : label}</span>
            <span
              className={cx(styles.box, played && styles.played, isToday && !played && styles.pending)}
              aria-label={played ? "لعبت" : "ما لعبت"}
            >
              {played && <Icon name="check" size={16} strokeWidth={3} />}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
