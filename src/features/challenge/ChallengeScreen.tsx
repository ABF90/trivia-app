"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Screen } from "@/components/ui";
import { toArabicDigits } from "@/lib/arabic";
import { GameRunner, ResultView, type GameResult } from "../game";
import { recordRound } from "../player";
import { ShareSheet } from "../share";
import { compareScores, decodeChallenge, type ChallengeOutcome } from "./codec";
import { ChallengeIntro } from "./components/ChallengeIntro";
import { InvalidChallenge } from "./components/InvalidChallenge";

type Stage = { kind: "intro" } | { kind: "playing" } | { kind: "result"; result: GameResult };

const HEADLINES: Record<ChallengeOutcome, string> = {
  win: "غلبته!",
  draw: "تعادل!",
  lose: "غلبك هالمرة",
};

export function ChallengeScreen({ code }: { code?: string }) {
  const router = useRouter();
  const challenge = useMemo(() => decodeChallenge(code), [code]);
  const [stage, setStage] = useState<Stage>({ kind: "intro" });
  const [sharing, setSharing] = useState(false);

  if (!challenge) {
    return (
      <Screen>
        <InvalidChallenge />
      </Screen>
    );
  }

  const finish = (result: GameResult) => {
    recordRound(result);
    setStage({ kind: "result", result });
  };

  return (
    <Screen background={stage.kind === "playing" ? "plain" : "glowCenter"}>
      {stage.kind === "intro" && <ChallengeIntro challenge={challenge} onAccept={() => setStage({ kind: "playing" })} />}

      {stage.kind === "playing" && (
        <GameRunner questions={challenge.questions} onFinish={finish} onExit={() => router.push("/")} />
      )}

      {stage.kind === "result" && (
        <>
          <ResultView
            result={stage.result}
            headline={HEADLINES[compareScores(stage.result.score, challenge.score)]}
            hint={`${challenge.name} جاب ${toArabicDigits(challenge.score)} من ${toArabicDigits(challenge.questions.length)}`}
          >
            <Button variant="secondary" icon="swords" iconPosition="start" onClick={() => setSharing(true)}>
              رد التحدي
            </Button>
            <Button size="lg" href="/" icon="chevronForward">
              العب صفارة
            </Button>
          </ResultView>
          <ShareSheet
            open={sharing}
            onClose={() => setSharing(false)}
            result={stage.result}
            subtitle={`رد على تحدي ${challenge.name}`}
            intent="challenge"
          />
        </>
      )}
    </Screen>
  );
}
