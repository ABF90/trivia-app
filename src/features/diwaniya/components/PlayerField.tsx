import { Avatar, avatarColorAt, Icon } from "@/components/ui";
import { toArabicDigits } from "@/lib/arabic";
import styles from "./PlayerField.module.css";

interface PlayerFieldProps {
  index: number;
  name: string;
  placeholder: string;
  canRemove: boolean;
  onRename: (name: string) => void;
  onRemove: () => void;
}

export function PlayerField({ index, name, placeholder, canRemove, onRename, onRemove }: PlayerFieldProps) {
  return (
    <div className={styles.field}>
      <Avatar label={toArabicDigits(index + 1)} color={avatarColorAt(index)} />
      <input
        className={styles.input}
        value={name}
        placeholder={placeholder}
        maxLength={20}
        aria-label={`اسم اللاعب ${toArabicDigits(index + 1)}`}
        onChange={(e) => onRename(e.target.value)}
      />
      {canRemove && (
        <button type="button" className={styles.remove} aria-label={`احذف ${name || placeholder}`} onClick={onRemove}>
          <Icon name="close" size={18} />
        </button>
      )}
    </div>
  );
}
