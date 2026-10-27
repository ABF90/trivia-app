import { Avatar, Button, Logo, Spacer } from "@/components/ui";
import { GAME_CONFIG } from "@/config/game";
import { toArabicDigits } from "@/lib/arabic";
import { cx } from "@/lib/cx";
import type { Challenge } from "../codec";
import { describeRules } from "../rules";
import styles from "./ChallengeIntro.module.css";

interface ChallengeIntroProps {
  challenge: Challenge;
  onAccept: () => void;
}

export function ChallengeIntro({ challenge, onAccept }: ChallengeIntroProps) {
  const total = challenge.questions.length;
  return (
    <>
      <header className={styles.brand}>
        <Logo size={36} variant="mark" decorative />
        <span className={styles.brandName}>صفارة</span>
      </header>

      <h1 className={styles.title}>{challenge.name} يتحداك!</h1>
      <p className={styles.subtitle}>
        نفس الـ {toArabicDigits(total)} أسئلة، ونفس الـ {toArabicDigits(GAME_CONFIG.secondsPerQuestion)} ثانية لكل سؤال
      </p>

      <div className={styles.versus}>
        <div className={cx(styles.player, styles.them)}>
          <Avatar label={challenge.name.charAt(0)} size={64} />
          <span className={styles.playerName}>{challenge.name}</span>
          <span className={styles.score}>
            {toArabicDigits(challenge.score)} / {toArabicDigits(total)}
          </span>
        </div>
        <span className={styles.vs} dir="ltr">
          VS
        </span>
        <div className={cx(styles.player, styles.you)}>
          <Avatar label="؟" color="slate" size={64} />
          <span className={styles.playerName}>إنت</span>
          <span className={styles.score}>؟ / {toArabicDigits(total)}</span>
        </div>
      </div>

      <p className={styles.rules}>{describeRules(challenge.score, total)}</p>

      <Spacer />

      <div className={styles.actions}>
        <Button size="lg" onClick={onAccept}>
          اقبل التحدي
        </Button>
        <Button variant="ghost" size="sm" href="/">
          مو الحين
        </Button>
      </div>
    </>
  );
}
