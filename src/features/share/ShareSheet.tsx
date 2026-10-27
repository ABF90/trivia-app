"use client";

import { useMemo } from "react";
import { BottomSheet, Button } from "@/components/ui";
import { formatScore } from "@/lib/arabic";
import { cx } from "@/lib/cx";
import { buildChallengeUrl } from "../challenge/codec";
import type { GameResult } from "../game/types";
import { setPlayerName, usePlayer } from "../player";
import { ShareCard } from "./ShareCard";
import styles from "./ShareSheet.module.css";
import { useShare } from "./useShare";

const FALLBACK_NAME = "لاعب صفارة";

interface ShareSheetProps {
  open: boolean;
  onClose: () => void;
  result: GameResult;
  subtitle: string;
  streak?: number;
  /** "challenge" puts the challenge invite first; "score" shares the result card. */
  intent?: "score" | "challenge";
}

const STATUS_TEXT = {
  idle: "",
  shared: "تمت المشاركة",
  copied: "تم نسخ الرابط، أرسله للربع",
  error: "ما قدرنا نشارك، جرّب تنسخ الرابط",
} as const;

export function ShareSheet({ open, onClose, result, subtitle, streak, intent = "score" }: ShareSheetProps) {
  const player = usePlayer();
  const { status, share, copy } = useShare();
  const displayName = player.name.trim() || FALLBACK_NAME;

  const url = useMemo(
    () => (open ? buildChallengeUrl(window.location.origin, displayName, result) : ""),
    [open, displayName, result],
  );

  const text =
    intent === "challenge"
      ? `${displayName} يتحداك في صفارة! جبت ${formatScore(result.score, result.total)}، تقدر تغلبني؟`
      : `صفارة · ${subtitle}\nجبت ${formatScore(result.score, result.total)}، تقدر تغلبني؟`;

  return (
    <BottomSheet open={open} onClose={onClose} title={intent === "challenge" ? "تحدَّ ربعك" : "شارك نتيجتك"}>
      {(titleId) => (
        <>
          <h2 id={titleId} className={styles.title}>
            {intent === "challenge" ? "تحدَّ ربعك بنفس الأسئلة" : "شارك نتيجتك"}
          </h2>

          <div className={styles.preview}>
            <ShareCard
              playerName={displayName}
              subtitle={subtitle}
              score={result.score}
              total={result.total}
              results={result.answers.map((a) => a.correct)}
              streak={streak}
            />
          </div>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>اسمك</span>
            <input
              className={styles.input}
              value={player.name}
              placeholder={FALLBACK_NAME}
              maxLength={24}
              onChange={(e) => setPlayerName(e.target.value)}
            />
          </label>

          <div className={styles.actions}>
            <Button size="lg" flat icon="share" iconPosition="start" onClick={() => share({ title: "صفارة", text, url })}>
              {intent === "challenge" ? "أرسل التحدي" : "شارك"}
            </Button>
            <Button variant="secondary" icon="copy" iconPosition="start" onClick={() => copy(url)}>
              انسخ الرابط
            </Button>
          </div>
          <p className={cx(styles.status, status === "error" && styles.error)} role="status">
            {STATUS_TEXT[status]}
          </p>
        </>
      )}
    </BottomSheet>
  );
}
