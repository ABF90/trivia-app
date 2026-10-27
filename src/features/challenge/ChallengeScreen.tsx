import { useMemo, useState } from "react";
import { Button, Confetti, Screen } from "@/components/ui";
import { useGoHome } from "@/hooks/useGoHome";
import { useI18n } from "@/i18n";
import { GameRunner, ResultView, type GameResult } from "../game";
import { recordRound } from "../player";
import { ShareSheet } from "../share";
import { compareScores, decodeChallenge } from "./codec";
import { ChallengeIntro } from "./components/ChallengeIntro";
import { InvalidChallenge } from "./components/InvalidChallenge";

type Stage = { kind: "intro" } | { kind: "playing" } | { kind: "result"; result: GameResult };

export function ChallengeScreen({ code }: { code?: string }) {
  const goHome = useGoHome();
  const { t, n } = useI18n();
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

  const name = challenge.name || t.aFriend;

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
            headline={t.outcomes[compareScores(stage.result.score, challenge.score)]}
            hint={t.theyScored(name, n(challenge.score), n(challenge.questions.length))}
          >
            <Button variant="secondary" icon="swords" iconPosition="start" onPress={() => setSharing(true)}>
              {t.replyChallenge}
            </Button>
            <Button size="lg" icon="chevronForward" onPress={goHome}>
              {t.playSfara}
            </Button>
          </ResultView>
          <ShareSheet
            open={sharing}
            onClose={() => setSharing(false)}
            result={stage.result}
            subtitle={t.replySubtitle(name)}
            intent="challenge"
          />
        </>
      )}
    </Screen>
  );
}

