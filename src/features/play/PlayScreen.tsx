import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Button, Confetti, Icon, Screen, Spacer, Text } from "@/components/ui";
import { GAME_CONFIG } from "@/config/game";
import { categoryLabels } from "@/data/categories";
import { pickFreshRound, questionIdsFor, type QuestionFilter } from "@/data/questionBank";
import { useGoHome } from "@/hooks/useGoHome";
import { useI18n } from "@/i18n";
import { colors, radius, tints } from "@/theme";
import { GameRunner, ResultView, shouldCelebrate, type GameResult, type Question } from "../game";
import { markSeen, recordRound, resetSeen, usePlayer } from "../player";
import { playerStore } from "../player/store";
import { ShareSheet } from "../share";

type Stage =
  | { kind: "loading" }
  | { kind: "playing"; round: Question[]; remaining: number; id: number }
  | { kind: "result"; result: GameResult; remaining: number }
  | { kind: "exhausted" };

interface PlayScreenProps {
  filter: QuestionFilter;
  /** "challenge" makes sending a challenge the main call to action on the result screen. */
  intent?: "challenge";
}

export function PlayScreen({ filter, intent }: PlayScreenProps) {
  const goHome = useGoHome();
  const player = usePlayer();
  const { t, n, pick } = useI18n();
  const [stage, setStage] = useState<Stage>({ kind: "loading" });
  const [share, setShare] = useState<"score" | "challenge" | null>(null);
  const mounted = useRef(true);
  useEffect(() => () => void (mounted.current = false), []);

  // Live questions arrive asynchronously (bundled ones fill in when offline).
  const loadRound = useCallback(async () => {
    setStage({ kind: "loading" });
    const { questions, remaining } = await pickFreshRound(
      GAME_CONFIG.roundSize,
      filter,
      new Set(playerStore.getSnapshot().seen),
    );
    if (!mounted.current) return;
    setStage(questions.length ? { kind: "playing", round: questions, remaining, id: Date.now() } : { kind: "exhausted" });
  }, [filter]);

  // Load once per screen: the filter object is rebuilt from route params on every render.
  useEffect(() => {
    void loadRound();
  }, []);

  const finish = useCallback(
    (result: GameResult) => {
      recordRound(result);
      markSeen(result.questions.map((q) => q.id));
      setStage((prev) => ({ kind: "result", result, remaining: prev.kind === "playing" ? prev.remaining : 0 }));
    },
    [],
  );

  const startOver = () => {
    resetSeen(questionIdsFor(filter));
    void loadRound();
  };

  if (stage.kind === "loading") {
    return (
      <Screen>
        <View style={styles.loading} aria-live="polite">
          <ActivityIndicator size="large" color={colors.primary300} />
          <Text size={16} color={colors.textSecondary} align="center">
            {t.loadingQuestions}
          </Text>
        </View>
      </Screen>
    );
  }

  if (stage.kind === "exhausted") {
    return (
      <Screen background="glowTop">
        <View style={styles.exhausted}>
          <View style={styles.exhaustedIcon}>
            <Icon name="trophy" size={40} color={colors.warning} />
          </View>
          <Text weight="display" size={36} lineHeight={52} align="center" role="heading">
            {t.exhaustedTitle}
          </Text>
          <Text size={16} lineHeight={27} color={colors.textSecondary} align="center">
            {t.exhaustedBody}
          </Text>
        </View>
        <Spacer />
        <View style={styles.actions}>
          <Button size="lg" icon="replay" iconPosition="start" onPress={startOver}>
            {t.exhaustedReset}
          </Button>
          <Button variant="secondary" onPress={goHome}>
            {t.exhaustedPickOther}
          </Button>
        </View>
      </Screen>
    );
  }

  if (stage.kind === "playing") {
    return (
      <Screen>
        <GameRunner key={stage.id} questions={stage.round} onFinish={finish} onExit={goHome} />
      </Screen>
    );
  }

  const { result, remaining } = stage;
  const labels = categoryLabels(filter.categories).map(pick);
  const subtitle = t.freePlaySubtitle(
    [labels.length ? labels.join(t.listSeparator) : t.allCategories, t.difficultyLevels[filter.difficulty]].join(" · "),
  );
  const shareButton = (
    <Button variant="secondary" icon="share" iconPosition="start" onPress={() => setShare("score")}>
      {t.shareResult}
    </Button>
  );
  const replayLabel = remaining === 0 ? t.exhaustedReset : t.playAgain;
  const onReplay = remaining === 0 ? startOver : () => void loadRound();

  return (
    <Screen background="glowTop" overlay={shouldCelebrate(result.score, result.total) ? <Confetti /> : null}>
      <ResultView result={result} best={player.best}>
        {remaining > 0 && remaining < GAME_CONFIG.roundSize && (
          <Text size={14} color={colors.warning} align="center">
            {t.lastQuestions(n(remaining))}
          </Text>
        )}
        {intent === "challenge" ? (
          <>
            {shareButton}
            <Button variant="secondary" icon="replay" iconPosition="start" onPress={onReplay}>
              {replayLabel}
            </Button>
            <Button size="lg" icon="swords" iconPosition="start" onPress={() => setShare("challenge")}>
              {t.sendChallenge}
            </Button>
          </>
        ) : (
          <>
            {shareButton}
            <Button variant="secondary" icon="swords" iconPosition="start" onPress={() => setShare("challenge")}>
              {t.challengeSameQuestions}
            </Button>
            <Button size="lg" icon="replay" iconPosition="start" onPress={onReplay}>
              {replayLabel}
            </Button>
          </>
        )}
      </ResultView>

      <ShareSheet
        open={share !== null}
        onClose={() => setShare(null)}
        result={result}
        subtitle={subtitle}
        intent={share ?? "score"}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, minHeight: 400, alignItems: "center", justifyContent: "center", gap: 16 },
  exhausted: { marginTop: "25%", alignItems: "center", gap: 12 },
  exhaustedIcon: {
    width: 80,
    height: 80,
    borderRadius: radius.xl,
    backgroundColor: tints.warning14,
    alignItems: "center",
    justifyContent: "center",
  },
  actions: { gap: 12 },
});
