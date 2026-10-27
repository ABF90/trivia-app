import styles from "./Confetti.module.css";

const COLORS = ["var(--color-primary)", "var(--color-success)", "var(--color-warning)", "var(--color-text)"];
// Fixed layout keeps server and client markup identical.
const PIECES = [
  { left: "8%", delay: 0.2 },
  { left: "20%", delay: 0.9 },
  { left: "36%", delay: 0.4 },
  { left: "51%", delay: 1.3 },
  { left: "64%", delay: 0.6 },
  { left: "79%", delay: 1.1 },
  { left: "90%", delay: 0.1 },
];

export function Confetti() {
  return (
    <div className={styles.layer} aria-hidden>
      {PIECES.map((p, i) => (
        <span
          key={i}
          className={styles.piece}
          style={{ left: p.left, background: COLORS[i % COLORS.length], animationDelay: `${p.delay}s` }}
        />
      ))}
    </div>
  );
}
