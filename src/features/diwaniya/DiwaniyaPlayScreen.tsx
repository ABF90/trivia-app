"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Confetti, Icon, IconButton, Screen, Spacer } from "@/components/ui";
import { toArabicDigits } from "@/lib/arabic";
import { cx } from "@/lib/cx";
import { GameRunner } from "../game";
import { Standings } from "./components/Standings";
import { useDiwaniya } from "./DiwaniyaProvider";
import { playerName, selectCurrentQuestion, selectStandings } from "./model";
import styles from "./DiwaniyaPlayScreen.module.css";

export function DiwaniyaPlayScreen() {
  const router = useRouter();
  const { state, recordTurn, reset, start } = useDiwaniya();
  const [answering, setAnswering] = useState(false);

  // Landing here without a game (refresh / direct link) → back to setup.
  useEffect(() => {
    if (state.status === "setup") router.replace("/diwaniya");
  }, [state.status, router]);

  // Leaving the /diwaniya layout unmounts the provider, which discards the session.
  const leave = () => router.push("/");

  if (state.status === "setup") return <Screen>{null}</Screen>;

  const standings = selectStandings(state);
  const roundLabel = `الجولة ${toArabicDigits(state.round + 1)} من ${toArabicDigits(state.questionsPerPlayer)}`;

  if (state.status === "finished") {
    const top = standings.filter((s) => s.rank === 1);
    const tie = top.length > 1;
    return (
      <Screen background="glowCenter">
        <Confetti />
        <div className={styles.trophy}>
          <Icon name="trophy" size={84} strokeWidth={1.6} />
        </div>
        <p className={styles.winnerLabel}>{tie ? "تعادل بين" : "الفايز"}</p>
        <p className={cx(styles.name, styles.winner)}>{top.map((s) => s.name).join(" و ")}</p>
        <div className={styles.standings}>
          <Standings standings={standings} />
        </div>
        <Spacer />
        <div className={styles.actions}>
          <Button size="lg" icon="replay" iconPosition="start" onClick={start}>
            جولة ثانية بنفس الربع
          </Button>
          <Button variant="ghost" size="sm" onClick={reset}>
            غيّر اللاعبين
          </Button>
        </div>
      </Screen>
    );
  }

  const current = state.players[state.turn]!;
  const currentName = playerName(current, state.turn);
  const question = selectCurrentQuestion(state);

  if (answering && question) {
    return (
      <Screen>
        <GameRunner
          key={`${state.round}-${state.turn}`}
          questions={[question]}
          allowLifeline={false}
          scoreOffset={current.score}
          label={() => `دور ${currentName} · ${roundLabel}`}
          onFinish={(r) => {
            recordTurn(r.score > 0);
            setAnswering(false);
          }}
          onExit={leave}
        />
      </Screen>
    );
  }

  return (
    <Screen background="glowTeal">
      <header className={styles.header}>
        <IconButton icon="close" label="إنهاء اللعبة" onClick={leave} />
        <span className={styles.round}>{roundLabel}</span>
      </header>

      <div className={styles.phone}>
        <Icon name="phone" size={84} strokeWidth={1.6} />
      </div>
      <p className={styles.passTo}>مرّر التلفون لـ</p>
      <p className={styles.name} key={current.id}>
        {currentName}
      </p>
      <p className={styles.warning}>لا تشوف السؤال قبل دورك!</p>

      <div className={styles.standings}>
        <Standings standings={standings} activeIndex={state.turn} />
      </div>

      <Spacer />

      <Button size="lg" variant="success" onClick={() => setAnswering(true)}>
        أنا {currentName}، جاهز
      </Button>
    </Screen>
  );
}
