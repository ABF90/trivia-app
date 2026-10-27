import { useMemo, useState } from "react";
import { Button, Confetti, Screen } from "@/components/ui";
import { useGoHome } from "@/hooks/useGoHome";
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
  const goHome = useGoHome();
  const challenge = useMemo(() => decodeChallenge(code), [code]);
  const [stage, setStage] = useState<Stage>({ kind: "intro" });
  const [sharing, setSharing] = useState(false);

  if (!challenge) {
    return (
      <Screen>
        <InvalidChallenge onHome={goHome} />
      </Screen>
    );
  }

  const finish = (result: GameResult) => {
    recordRound(result);
    setStage({ kind: "result", result });
  };

  const celebrate = stage.kind === "result" && compareScores(stage.result.score, challenge.score) === "win";

  return (
    <Screen background={stage.kind === "playing" ? "plain" : "glowCenter"} overlay={celebrate ? <Confetti /> : null}>
      {stage.kind === "intro" && (
        <ChallengeIntro challenge={challenge} onAccept={() => setStage({ kind: "playing" })} onDecline={goHome} />
      )}

      {stage.kind === "playing" && <GameRunner questions={challenge.questions} onFinish={finish} onExit={goHome} />}

      {stage.kind === "result" && (
        <>
          <ResultView
            result={stage.result}
            headline={HEADLINES[compareScores(stage.result.score, challenge.score)]}
            hint={`${challenge.name} جاب ${toArabicDigits(challenge.score)} من ${toArabicDigits(challenge.questions.length)}`}
          >
            <Button variant="secondary" icon="swords" iconPosition="start" onPress={() => setSharing(true)}>
              رد التحدي
            </Button>
            <Button size="lg" icon="chevronForward" onPress={goHome}>
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

