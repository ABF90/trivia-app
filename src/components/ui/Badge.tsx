import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Icon, type IconName } from "../icons/Icon";
import styles from "./Badge.module.css";

interface BadgeProps {
  children: ReactNode;
  icon?: IconName;
  tone?: "warning" | "primary" | "success" | "danger";
  outlined?: boolean;
}

export function Badge({ children, icon, tone = "warning", outlined }: BadgeProps) {
  return (
    <span className={cx(styles.badge, styles[tone], outlined && styles.outlined)}>
      {icon && <Icon name={icon} size={18} />}
      {children}
    </span>
  );
}
