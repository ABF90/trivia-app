import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Icon, type IconName } from "../icons/Icon";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "warning" | "success" | "dashed";
export type ButtonSize = "sm" | "md" | "lg";

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconPosition?: "start" | "end";
  /** Stretch to the container width (default). */
  block?: boolean;
  /** Drop the coloured glow shadow. */
  flat?: boolean;
  /** Subtle "breathing" call-to-action animation. */
  breathe?: boolean;
  className?: string;
  children: ReactNode;
}

type ButtonProps = BaseProps &
  (
    | ({ href: string } & { onClick?: never; type?: never; disabled?: never })
    | ({ href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>)
  );

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    icon,
    iconPosition = "end",
    block = true,
    flat,
    breathe,
    className,
    children,
    ...rest
  } = props;

  const classes = cx(
    styles.button,
    styles[size],
    styles[variant],
    block && styles.block,
    flat && styles.flat,
    breathe && styles.breathe,
    className,
  );
  const iconSize = size === "lg" ? 22 : 20;
  const iconEl = icon && <Icon name={icon} size={iconSize} strokeWidth={2.4} />;
  const content = (
    <>
      {iconPosition === "start" && iconEl}
      {children}
      {iconPosition === "end" && iconEl}
    </>
  );

  if ("href" in rest && rest.href !== undefined) {
    return (
      <Link href={rest.href} className={classes}>
        {content}
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {content}
    </button>
  );
}
