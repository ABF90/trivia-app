"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Screen } from "@/components/ui";
import { GAME_CONFIG } from "@/config/game";
import { ALL_CATEGORIES_LABEL, getCategory } from "@/data/categories";
import { pickRound } from "@/data/questionBank";
import { GameRunner, ResultView, type CategoryId, type GameResult, type Question } from "../game";
import { recordRound, usePlayer } from "../player";
import { ShareSheet } from "../share";

type Stage =
  | { kind: "loading" }
  | { kind: "playing"; round: Question[]; id: number }
  | { kind: "result"; result: GameResult };

interface PlayScreenProps {
  category?: CategoryId;
  /** "challenge" makes sending a challenge the main call to action on the result screen. */
  intent?: "challenge";
}

export function PlayScreen({ category, intent }: PlayScreenProps) {
  const router = useRouter();
  const player = usePlayer();
  const [stage, setStage] = useState<Stage>({ kind: "loading" });
  const [share, setShare] = useState<"score" | "challenge" | null>(null);

  const startRound = useCallback(() => {
    // Random selection runs on the client only to keep SSR markup deterministic.
    setStage((prev) => ({
      kind: "playing",
      round: pickRound(GAME_CONFIG.roundSize, category),
      id: prev.kind === "playing" ? prev.id + 1 : Date.now(),
    }));
  }, [category]);

  useEffect(startRound, [startRound]);

  const finish = useCallback((result: GameResult) => {
    recordRound(result);
    setStage({ kind: "result", result });
  }, []);

  const categoryLabel = category ? getCategory(category).label : ALL_CATEGORIES_LABEL;
  const background = stage.kind === "result" ? "glowTop" : "plain";

  return (
    <Screen background={background}>
      {stage.kind === "playing" && (
        <GameRunner key={stage.id} questions={stage.round} onFinish={finish} onExit={() => router.push("/")} />
      )}

      {stage.kind === "result" && (
        <>
          <ResultView result={stage.result} best={player.best}>
            {intent === "challenge" ? (
              <>
                <Button variant="secondary" icon="share" iconPosition="start" onClick={() => setShare("score")}>
                  شارك نتيجتك
                </Button>
                <Button variant="secondary" icon="replay" iconPosition="start" onClick={startRound}>
                  العب مرة ثانية
                </Button>
                <Button size="lg" icon="swords" iconPosition="start" onClick={() => setShare("challenge")}>
                  أرسل التحدي لربعك
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" icon="share" iconPosition="start" onClick={() => setShare("score")}>
                  شارك نتيجتك
                </Button>
                <Button variant="secondary" icon="swords" iconPosition="start" onClick={() => setShare("challenge")}>
                  تحدَّ ربعك بنفس الأسئلة
                </Button>
                <Button size="lg" icon="replay" iconPosition="start" onClick={startRound}>
                  العب مرة ثانية
                </Button>
              </>
            )}
          </ResultView>

          <ShareSheet
            open={share !== null}
            onClose={() => setShare(null)}
            result={stage.result}
            subtitle={`لعب حر · ${categoryLabel}`}
            intent={share ?? "score"}
          />
        </>
      )}
    </Screen>
  );
}
