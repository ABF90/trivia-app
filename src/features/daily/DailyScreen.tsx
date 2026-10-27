import { useMemo, useState } from "react";
import { Screen } from "@/components/ui";
import { useGoHome } from "@/hooks/useGoHome";
import { toArabicDigits } from "@/lib/arabic";
import { toDateKey } from "@/lib/date";
import { GameRunner } from "../game";
import { recordDaily, selectDailyEntry, selectStreak, usePlayer } from "../player";
import { DailyIntro } from "./components/DailyIntro";
import { DailyResult } from "./components/DailyResult";
import { entryToResult, getDailyNumber, getDailyRound } from "./daily";

export function DailyScreen() {
  const goHome = useGoHome();
  const player = usePlayer();
  const [today] = useState(() => toDateKey(new Date()));
  const [playing, setPlaying] = useState(false);

  const dailyNumber = getDailyNumber(today);
  const entry = selectDailyEntry(player, today);
  const streak = selectStreak(player, today);
  const round = useMemo(() => getDailyRound(today), [today]);
  const playedDays = useMemo(() => new Set(Object.keys(player.daily.history)), [player.daily.history]);
  const result = useMemo(() => (entry ? entryToResult(entry) : null), [entry]);

  let content;
  if (result) {
    content = <DailyResult dailyNumber={dailyNumber} result={result} streak={streak} />;
  } else if (playing) {
    content = (
      <GameRunner
        questions={round}
        onFinish={(r) => recordDaily(today, r)}
        onExit={goHome}
        label={(i, total) => `تحدي #${toArabicDigits(dailyNumber)} · ${toArabicDigits(i + 1)} من ${toArabicDigits(total)}`}
      />
    );
  } else {
    content = <DailyIntro today={today} streak={streak} playedDays={playedDays} onStart={() => setPlaying(true)} />;
  }

  return <Screen>{content}</Screen>;
}
