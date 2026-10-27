import type { CSSProperties } from "react";
import { cx } from "@/lib/cx";
import styles from "./Avatar.module.css";

export const AVATAR_COLORS = ["blue", "teal", "amber", "rose", "sky", "slate"] as const;
export type AvatarColor = (typeof AVATAR_COLORS)[number];

export function avatarColorAt(index: number): AvatarColor {
  return AVATAR_COLORS[index % AVATAR_COLORS.length]!;
}

interface AvatarProps {
  label: string;
  color?: AvatarColor;
  size?: number;
}

export function Avatar({ label, color = "blue", size = 34 }: AvatarProps) {
  return (
    <span aria-hidden className={cx(styles.avatar, styles[color])} style={{ "--size": `${size}px` } as CSSProperties}>
      {label}
    </span>
  );
}
