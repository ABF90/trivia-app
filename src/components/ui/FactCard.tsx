import { Icon } from "../icons/Icon";
import styles from "./FactCard.module.css";

export function FactCard({ children, title = "تعرف؟" }: { children: string; title?: string }) {
  return (
    <aside className={styles.fact}>
      <Icon name="bulb" size={24} className={styles.icon} />
      <div>
        <p className={styles.title}>{title}</p>
        <p className={styles.body}>{children}</p>
      </div>
    </aside>
  );
}
