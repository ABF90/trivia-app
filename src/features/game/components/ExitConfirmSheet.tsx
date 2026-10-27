"use client";

import { BottomSheet, Button, Icon } from "@/components/ui";
import styles from "./ExitConfirmSheet.module.css";

interface ExitConfirmSheetProps {
  open: boolean;
  onStay: () => void;
  onLeave: () => void;
}

export function ExitConfirmSheet({ open, onStay, onLeave }: ExitConfirmSheetProps) {
  return (
    <BottomSheet open={open} onClose={onStay} title="تبي تطلع؟">
      {(titleId) => (
        <>
          <span className={styles.icon}>
            <Icon name="exit" size={30} />
          </span>
          <h2 id={titleId} className={styles.title}>
            تبي تطلع؟
          </h2>
          <p className={styles.body}>بتضيع نقاط هالجولة، والتايمر واقف لين تقرر.</p>
          <div className={styles.actions}>
            <Button size="lg" flat onClick={onStay}>
              كمّل اللعب
            </Button>
            <Button variant="danger" onClick={onLeave}>
              اطلع
            </Button>
          </div>
        </>
      )}
    </BottomSheet>
  );
}
