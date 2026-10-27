import { Badge, Logo, ResultDots, ScoreDigits, Spacer } from "@/components/ui";
import { GAME_CONFIG } from "@/config/game";
import { formatDays, toArabicDigits } from "@/lib/arabic";
import { getTitle } from "../game/model/titles";
import styles from "./ShareCard.module.css";

export interface ShareCardProps {
  playerName: string;
  subtitle: string;
  score: number;
  total: number;
  results: boolean[];
  streak?: number;
  linkLabel?: string;
}

export function ShareCard({ playerName, subtitle, score, total, results, streak, linkLabel }: ShareCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.brand}>
        <Logo size={44} decorative />
        <span className={styles.brandName}>صفارة</span>
      </div>
      <p className={styles.name}>{playerName}</p>
      <p className={styles.subtitle}>{subtitle}</p>

      <div className={styles.score}>
        <ScoreDigits score={score} total={total} size="27cqw" variant="boxed" />
      </div>
      <div className={styles.dots}>
        <ResultDots results={results} size={36} showIcons={false} />
      </div>
      <div className={styles.badges}>
        <Badge icon="badge">{getTitle(score, total)}</Badge>
        {!!streak && <Badge icon="flame">سلسلة {formatDays(streak)}</Badge>}
      </div>

      <Spacer />

      <p className={styles.cta}>تقدر تغلبني؟</p>
      <p className={styles.ctaSub}>نفس الأسئلة، نفس الـ {toArabicDigits(GAME_CONFIG.secondsPerQuestion)} ثانية</p>
      {linkLabel && <p className={styles.link}>{linkLabel}</p>}

      <div className={styles.flag} aria-hidden>
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
