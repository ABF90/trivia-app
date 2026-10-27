"use client";

import { useNow } from "@/hooks/useNow";
import { toArabicDigits } from "@/lib/arabic";
import { formatDuration, msUntilMidnight } from "@/lib/date";
import styles from "./NextDailyCountdown.module.css";

export function NextDailyCountdown() {
  const now = useNow(1000);
  return (
    <p className={styles.text}>
      التحدي الجاي بعد{" "}
      <b className={styles.time} dir="ltr">
        {now ? toArabicDigits(formatDuration(msUntilMidnight(now))) : "--:--:--"}
      </b>
    </p>
  );
}
