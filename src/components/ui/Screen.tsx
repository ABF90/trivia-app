import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { IconButton } from "./IconButton";
import styles from "./Screen.module.css";

type Background = "plain" | "glowTop" | "glowCenter" | "glowTeal";

interface ScreenProps {
  children: ReactNode;
  background?: Background;
  className?: string;
}

/** Mobile-first page column: full height, safe-area aware, capped width on large screens. */
export function Screen({ children, background = "plain", className }: ScreenProps) {
  return (
    <div className={cx(styles.backdrop, background !== "plain" && styles[background])}>
      <main className={cx(styles.screen, className)}>{children}</main>
    </div>
  );
}

/** Pushes following content to the bottom of the screen. */
export function Spacer() {
  return <div className={styles.spacer} aria-hidden />;
}

interface ScreenHeaderProps {
  title?: string;
  backHref?: string;
  backLabel?: string;
  end?: ReactNode;
}

export function ScreenHeader({ title, backHref, backLabel = "رجوع", end }: ScreenHeaderProps) {
  return (
    <header className={styles.header}>
      {backHref && <IconButton icon="chevronBack" href={backHref} label={backLabel} />}
      {title && <h1 className={styles.headerTitle}>{title}</h1>}
      {end && <div className={styles.headerEnd}>{end}</div>}
    </header>
  );
}
