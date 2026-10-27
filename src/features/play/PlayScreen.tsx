import { useCallback, useState } from "react";
import { Button, Confetti, Screen } from "@/components/ui";
import { GAME_CONFIG } from "@/config/game";
import { ALL_CATEGORIES_LABEL, getCategory } from "@/data/categories";
import { pickRound } from "@/data/questionBank";
import { useGoHome } from "@/hooks/useGoHome";
import { GameRunner, ResultView, shouldCelebrate, type CategoryId, type GameResult, type Question } from "../game";
import { recordRound, usePlayer } from "../player";
import { ShareSheet } from "../share";

type Stage = { kind: "playing"; round: Question[]; id: number } | { kind: "result"; result: GameResult };

interface PlayScreenProps {
  category?: CategoryId;
  /** "challenge" makes sending a challenge the main call to action on the result screen. */
  intent?: "challenge";
}

export function PlayScreen({ category, intent }: PlayScreenProps) {
  const goHome = useGoHome();
  const player = usePlayer();
  const newRound = useCallback((id: number): Stage => ({ kind: "playing", round: pickRound(GAME_CONFIG.roundSize, category), id }), [category]);
  const [stage, setStage] = useState<Stage>(() => newRound(0));
  const [share, setShare] = useState<"score" | "challenge" | null>(null);

  const replay = () => setStage((prev) => newRound(prev.kind === "playing" ? prev.id + 1 : Date.now()));

  const finish = useCallback((result: GameResult) => {
    recordRound(result);
    setStage({ kind: "result", result });
  }, []);

  if (stage.kind === "playing") {
    return (
      <Screen>
        <GameRunner key={stage.id} questions={stage.round} onFinish={finish} onExit={goHome} />
      </Screen>
    );
  }

  const { result } = stage;
  const categoryLabel = category ? getCategory(category).label : ALL_CATEGORIES_LABEL;
  const shareButton = (
    <Button variant="secondary" icon="share" iconPosition="start" onPress={() => setShare("score")}>
      شارك نتيجتك
    </Button>
  );

  return (
    <Screen background="glowTop" overlay={shouldCelebrate(result.score, result.total) ? <Confetti /> : null}>
      <ResultView result={result} best={player.best}>
        {intent === "challenge" ? (
          <>
            {shareButton}
            <Button variant="secondary" icon="replay" iconPosition="start" onPress={replay}>
              العب مرة ثانية
            </Button>
            <Button size="lg" icon="swords" iconPosition="start" onPress={() => setShare("challenge")}>
              أرسل التحدي لربعك
            </Button>
          </>
        ) : (
          <>
            {shareButton}
            <Button variant="secondary" icon="swords" iconPosition="start" onPress={() => setShare("challenge")}>
              تحدَّ ربعك بنفس الأسئلة
            </Button>
            <Button size="lg" icon="replay" iconPosition="start" onPress={replay}>
              العب مرة ثانية
            </Button>
          </>
        )}
      </ResultView>

      <ShareSheet
        open={share !== null}
        onClose={() => setShare(null)}
        result={result}
        subtitle={`لعب حر · ${categoryLabel}`}
        intent={share ?? "score"}
      />
    </Screen>
  );
}
