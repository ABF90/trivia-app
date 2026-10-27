"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, Chip, ChipRow, Icon, Logo, Screen, Spacer } from "@/components/ui";
import { ALL_CATEGORIES_LABEL, CATEGORIES } from "@/data/categories";
import { useHydrated } from "@/hooks/useHydrated";
import { formatDays, formatScore, toArabicDigits } from "@/lib/arabic";
import { toDateKey } from "@/lib/date";
import { getDailyNumber } from "../daily/daily";
import { getTitle, type CategoryId } from "../game";
import { selectDailyEntry, selectStreak, usePlayer, type PlayerData } from "../player";
import styles from "./HomeScreen.module.css";

function playHref(category: CategoryId | null, intent?: "challenge") {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (intent) params.set("intent", intent);
  const query = params.toString();
  return query ? `/play?${query}` : "/play";
}

function DailyCard({ player, hydrated }: { player: PlayerData; hydrated: boolean }) {
  let title = "تحدي اليوم";
  let meta = "نفس الأسئلة للكل، كل يوم";
  if (hydrated) {
    const today = toDateKey(new Date());
    const entry = selectDailyEntry(player, today);
    const streak = selectStreak(player, today);
    title = `تحدي اليوم #${toArabicDigits(getDailyNumber(today))}`;
    meta = entry ? `لعبته اليوم · ${formatScore(entry.score, entry.total)}` : "ما لعبته اليوم";
    if (streak > 0) meta += ` · سلسلتك ${formatDays(streak)}`;
  }
  return (
    <Link href="/daily" className={styles.daily}>
      <span className={styles.dailyIcon}>
        <Icon name="flame" size={28} />
      </span>
      <span className={styles.dailyText}>
        <span className={styles.dailyTitle}>{title}</span>
        <span className={styles.dailyMeta}>{meta}</span>
      </span>
      <Icon name="chevronForward" className={styles.chevron} />
    </Link>
  );
}

export function HomeScreen() {
  const player = usePlayer();
  const hydrated = useHydrated();
  const [category, setCategory] = useState<CategoryId | null>(null);

  return (
    <Screen background="glowTop">
      <div className={styles.hero}>
        <Logo size={112} className={styles.logo} />
        <div className={styles.name}>
          <h1 className={styles.title}>صفارة</h1>
          <p className={styles.latin} dir="ltr">
            SFARA
          </p>
          <p className={styles.tagline}>اختبر معلوماتك في الرياضة الكويتية</p>
        </div>
      </div>

      <DailyCard player={player} hydrated={hydrated} />

      <section className={styles.categories}>
        <h2 className={styles.sectionTitle}>لعب حر · اختر القسم</h2>
        <ChipRow label="الأقسام">
          <Chip selected={category === null} onClick={() => setCategory(null)}>
            {ALL_CATEGORIES_LABEL}
          </Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c.id} selected={category === c.id} onClick={() => setCategory(c.id)}>
              {c.label}
            </Chip>
          ))}
        </ChipRow>
      </section>

      <Spacer />

      <div className={styles.footer}>
        <p className={styles.stats}>
          {player.best ? (
            <>
              لقبك: <b className={styles.titleValue}>{getTitle(player.best.score, player.best.total)}</b> · أفضل نتيجة{" "}
              <b className={styles.scoreValue}>{formatScore(player.best.score, player.best.total)}</b>
            </>
          ) : (
            "العب أول جولة وخذ لقبك"
          )}
        </p>
        <Button size="lg" href={playHref(category)} icon="chevronForward" breathe>
          لعب حر
        </Button>
        <div className={styles.modes}>
          <Button variant="secondary" size="md" href={playHref(category, "challenge")} icon="swords" iconPosition="start">
            تحدَّ ربعك
          </Button>
          <Button variant="secondary" size="md" href="/diwaniya" icon="users" iconPosition="start">
            وضع الديوانية
          </Button>
        </div>
      </div>
    </Screen>
  );
}
