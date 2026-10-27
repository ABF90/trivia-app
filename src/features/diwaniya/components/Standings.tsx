import { Avatar, avatarColorAt } from "@/components/ui";
import { toArabicDigits } from "@/lib/arabic";
import { cx } from "@/lib/cx";
import type { selectStandings } from "../model";
import styles from "./Standings.module.css";

interface StandingsProps {
  standings: ReturnType<typeof selectStandings>;
  activeIndex?: number;
}

export function Standings({ standings, activeIndex }: StandingsProps) {
  return (
    <ol className={styles.list} aria-label="ترتيب اللاعبين">
      {standings.map(({ player, index, name, rank }) => {
        const active = index === activeIndex;
        return (
          <li key={player.id} className={cx(styles.row, rank === 1 && styles.leader, active && styles.active)}>
            <span className={styles.rank}>{toArabicDigits(rank)}</span>
            <Avatar label={name.charAt(0)} color={avatarColorAt(index)} size={30} />
            <span className={styles.name}>
              {name}
              {active && " · دوره"}
            </span>
            <span className={styles.score}>{toArabicDigits(player.score)}</span>
          </li>
        );
      })}
    </ol>
  );
}
