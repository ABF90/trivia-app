import Link from "next/link";
import { Icon, type IconName } from "../icons/Icon";
import styles from "./IconButton.module.css";

interface IconButtonProps {
  icon: IconName;
  label: string;
  href?: string;
  onClick?: () => void;
}

export function IconButton({ icon, label, href, onClick }: IconButtonProps) {
  const glyph = <Icon name={icon} size={20} strokeWidth={2.2} />;
  if (href) {
    return (
      <Link href={href} aria-label={label} className={styles.iconButton}>
        {glyph}
      </Link>
    );
  }
  return (
    <button type="button" aria-label={label} onClick={onClick} className={styles.iconButton}>
      {glyph}
    </button>
  );
}
