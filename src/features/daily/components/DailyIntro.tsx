import { Button, Icon, ScreenHeader, Spacer } from "@/components/ui";
import { GAME_CONFIG } from "@/config/game";
import { formatDays, toArabicDigits } from "@/lib/arabic";
import { NextDailyCountdown } from "./NextDailyCountdown";
import { WeekStrip } from "./WeekStrip";
import styles from "./DailyIntro.module.css";

interface DailyIntroProps {
  today: string;
  streak: number;
  playedDays: ReadonlySet<string>;
  onStart: () => void;
}

export function DailyIntro({ today, streak, playedDays, onStart }: DailyIntroProps) {
  return (
    <>
      <ScreenHeader title="تحدي اليوم" backHref="/" />

      <section className={styles.hero}>
        <Icon name="flame" size={64} strokeWidth={1.6} className={styles.flame} />
        <p className={styles.streak}>{streak > 0 ? formatDays(streak) : "ابدأ سلسلتك"}</p>
        <p className={styles.streakText}>
          {streak > 0 ? "سلسلتك ما انقطعت، لا تخربها اليوم!" : "العب كل يوم وخل السلسلة تكبر"}
        </p>
        <WeekStrip today={today} playedDays={playedDays} />
      </section>

      <p className={styles.rules}>
        نفس الـ {toArabicDigits(GAME_CONFIG.roundSize)} أسئلة لكل اللاعبين، ومحاولة وحدة بس.
      </p>

      <Spacer />

      <NextDailyCountdown />
      <Button size="lg" variant="warning" onClick={onStart}>
        ابدأ تحدي اليوم
      </Button>
    </>
  );
}
