import { IconButton, ProgressSegments, ScorePill, type SegmentState } from "@/components/ui";
import styles from "./GameHeader.module.css";

interface GameHeaderProps {
  label: string;
  segments: SegmentState[];
  score: number;
  onExit?: () => void;
}

export function GameHeader({ label, segments, score, onExit }: GameHeaderProps) {
  return (
    <header className={styles.header}>
      {onExit && <IconButton icon="close" label="خروج" onClick={onExit} />}
      <div className={styles.progress}>
        <span className={styles.label}>{label}</span>
        <ProgressSegments segments={segments} />
      </div>
      <ScorePill points={score} />
    </header>
  );
}
