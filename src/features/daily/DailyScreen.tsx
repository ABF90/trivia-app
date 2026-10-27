"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/ui";
import { useHydrated } from "@/hooks/useHydrated";
import { toArabicDigits } from "@/lib/arabic";
import { toDateKey } from "@/lib/date";
import { GameRunner } from "../game";
import { recordDaily, selectDailyEntry, selectStreak, usePlayer } from "../player";
import { DailyIntro } from "./components/DailyIntro";
import { DailyResult } from "./components/DailyResult";
import { entryToResult, getDailyNumber, getDailyRound } from "./daily";

export function DailyScreen() {
  const hydrated = useHydrated();
  return <Screen>{hydrated ? <DailyFlow /> : null}</Screen>;
}

/** Client-only: depends on the local date and on-device history. */
function DailyFlow() {
  const router = useRouter();
  const player = usePlayer();
  const [today] = useState(() => toDateKey(new Date()));
  const [playing, setPlaying] = useState(false);

  const dailyNumber = getDailyNumber(today);
  const entry = selectDailyEntry(player, today);
  const streak = selectStreak(player, today);
  const round = useMemo(() => getDailyRound(today), [today]);
  const playedDays = useMemo(() => new Set(Object.keys(player.daily.history)), [player.daily.history]);
  const result = useMemo(() => (entry ? entryToResult(entry) : null), [entry]);

  if (result) return <DailyResult dailyNumber={dailyNumber} result={result} streak={streak} />;

  if (playing) {
    return (
      <GameRunner
        questions={round}
        onFinish={(r) => recordDaily(today, r)}
        onExit={() => router.push("/")}
        label={(i, total) => `تحدي #${toArabicDigits(dailyNumber)} · ${toArabicDigits(i + 1)} من ${toArabicDigits(total)}`}
      />
    );
  }

  return <DailyIntro today={today} streak={streak} playedDays={playedDays} onStart={() => setPlaying(true)} />;
}
