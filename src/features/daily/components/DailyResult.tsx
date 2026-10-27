"use client";

import { useState } from "react";
import { Button, Icon, ScreenHeader, Spacer } from "@/components/ui";
import { formatDays, toArabicDigits } from "@/lib/arabic";
import { getHeadline, getTitle } from "../../game/model/titles";
import type { GameResult } from "../../game/types";
import { ShareSheet } from "../../share";
import { AnswerReview } from "./AnswerReview";
import { NextDailyCountdown } from "./NextDailyCountdown";
import styles from "./DailyResult.module.css";

interface DailyResultProps {
  dailyNumber: number;
  result: GameResult;
  streak: number;
}

export function DailyResult({ dailyNumber, result, streak }: DailyResultProps) {
  const [sharing, setSharing] = useState(false);
  const { score, total } = result;
  const label = `تحدي اليوم #${toArabicDigits(dailyNumber)}`;

  return (
    <>
      <ScreenHeader title={label} backHref="/" backLabel="الرئيسية" />

      <section className={styles.summary} aria-label={`نتيجتك ${toArabicDigits(score)} من ${toArabicDigits(total)}`}>
        <div className={styles.info}>
          <span className={styles.headline}>{getHeadline(score, total)}</span>
          <span className={styles.meta}>
            <Icon name="badge" size={16} />
            {getTitle(score, total)}
            {streak > 0 && ` · سلسلة ${formatDays(streak)}`}
          </span>
        </div>
        <span className={styles.score}>
          <span className={styles.mine}>{toArabicDigits(score)}</span>
          <span className={styles.sep}> / </span>
          {toArabicDigits(total)}
        </span>
      </section>

      <h2 className={styles.reviewTitle}>راجع أجوبتك</h2>
      <AnswerReview result={result} />

      <Spacer />

      <NextDailyCountdown />
      <div className={styles.actions}>
        <Button size="lg" icon="share" iconPosition="start" onClick={() => setSharing(true)}>
          شارك نتيجتك بالقروب
        </Button>
        <Button variant="ghost" size="sm" href="/">
          الرئيسية
        </Button>
      </div>

      <ShareSheet
        open={sharing}
        onClose={() => setSharing(false)}
        result={result}
        subtitle={`${label} · كل الأقسام`}
        streak={streak}
      />
    </>
  );
}
