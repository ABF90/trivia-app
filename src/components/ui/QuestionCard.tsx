import { cx } from "@/lib/cx";
import styles from "./QuestionCard.module.css";

interface QuestionCardProps {
  prompt: string;
  category?: string;
  warning?: boolean;
  compact?: boolean;
}

export function QuestionCard({ prompt, category, warning, compact }: QuestionCardProps) {
  return (
    <section className={cx(styles.card, warning && styles.warning, compact && styles.compact)}>
      {category && <span className={styles.category}>{category}</span>}
      <h1 className={styles.prompt}>{prompt}</h1>
    </section>
  );
}
