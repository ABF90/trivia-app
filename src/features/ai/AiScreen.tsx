import { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, TextInput, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Button, Chip, ChipGroup, Confetti, Icon, Logo, Screen, ScreenHeader, Spacer, Text } from "@/components/ui";
import { AI_CONFIG } from "@/config/game";
import { AiError, generateQuestions } from "@/data/ai/aiQuestions";
import { useGoHome } from "@/hooks/useGoHome";
import { useI18n } from "@/i18n";
import { colors, fonts, radius, textStyleFor, tints } from "@/theme";
import { GameRunner, ResultView, shouldCelebrate, type GameResult, type Question } from "../game";
import { recordRound, usePlayer } from "../player";
import { ShareSheet } from "../share";

type Stage =
  | { kind: "topic" }
  | { kind: "loading" }
  | { kind: "error"; error: AiError }
  | { kind: "playing"; questions: Question[]; id: number }
  | { kind: "result"; result: GameResult };

/** Spinning whistle shown while the AI writes. Holds still with Reduce Motion. */
function SpinningLogo() {
  const reduceMotion = useReducedMotion();
  const turn = useSharedValue(0);
  useEffect(() => {
    if (!reduceMotion) turn.set(withRepeat(withTiming(1, { duration: 1400, easing: Easing.linear }), -1));
  }, [reduceMotion, turn]);
  const style = useAnimatedStyle(() => ({ transform: [{ rotate: `${turn.get() * 360}deg` }] }));
  return (
    <Animated.View style={style}>
      <Logo size={88} decorative />
    </Animated.View>
  );
}

function LoadingFace() {
  const { t } = useI18n();
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setSlow(true), AI_CONFIG.slowHintMs);
    return () => clearTimeout(id);
  }, []);
  return (
    <Screen background="glowCenter">
      <View style={styles.center} aria-live="polite">
        <SpinningLogo />
        <Text weight="display" size={30} lineHeight={44} align="center">
          {t.aiLoading}
        </Text>
        <Text size={14} color={slow ? colors.warning : colors.textMuted} align="center">
          {slow ? t.aiLoadingSlow : t.aiLoadingHint}
        </Text>
      </View>
    </Screen>
  );
}

export function AiScreen() {
  const goHome = useGoHome();
  const player = usePlayer();
  const { t, n, lang } = useI18n();
  const [topic, setTopic] = useState("");
  const [stage, setStage] = useState<Stage>({ kind: "topic" });
  const [sharing, setSharing] = useState(false);
  const request = useRef(0);

  const trimmed = topic.trim();

  const create = async () => {
    if (!trimmed || stage.kind === "loading") return; // one request at a time (free tier: ~20/min, 50/day)
    const id = ++request.current;
    setStage({ kind: "loading" });
    try {
      const questions = await generateQuestions(trimmed, lang);
      if (id === request.current) setStage({ kind: "playing", questions, id });
    } catch (error) {
      if (id === request.current) setStage({ kind: "error", error: error instanceof AiError ? error : new AiError("network") });
    }
  };

  // Leaving the screen mid-request: ignore the late reply.
  useEffect(() => () => void request.current++, []);

  if (Platform.OS === "web") {
    return (
      <Screen>
        <ScreenHeader title={t.aiTitle} backHref="/" />
        <View style={styles.center}>
          <Icon name="phone" size={56} color={colors.primary300} strokeWidth={1.6} />
          <Text size={16} lineHeight={27} color={colors.textSecondary} align="center">
            {t.aiPhoneOnly}
          </Text>
        </View>
      </Screen>
    );
  }

  if (stage.kind === "loading") return <LoadingFace />;

  if (stage.kind === "error") {
    const { error } = stage;
    const message = t.aiErrors[(error.status ? String(error.status) : error.kind) as keyof typeof t.aiErrors] ?? t.aiErrors.http;
    return (
      <Screen>
        <ScreenHeader title={t.aiTitle} onBack={() => setStage({ kind: "topic" })} />
        <View style={styles.center} role="alert">
          <View style={styles.errorIcon}>
            <Icon name="close" size={36} color={colors.danger} strokeWidth={2.4} />
          </View>
          <Text weight="display" size={30} lineHeight={44} align="center">
            {t.aiErrorTitle}
          </Text>
          <Text size={16} lineHeight={27} color={colors.textSecondary} align="center">
            {message}
          </Text>
          <Text size={12} color={colors.textMuted} align="center">
            {t.aiErrorCode(error.code)}
          </Text>
        </View>
        <Spacer />
        <View style={styles.actions}>
          <Button size="lg" icon="replay" iconPosition="start" onPress={create}>
            {t.tryAgain}
          </Button>
          <Button variant="secondary" onPress={() => setStage({ kind: "topic" })}>
            {t.changeTopic}
          </Button>
        </View>
      </Screen>
    );
  }

  if (stage.kind === "playing") {
    return (
      <Screen>
        <GameRunner
          key={stage.id}
          questions={stage.questions}
          label={(i, total) => t.aiRoundLabel(n(i + 1), n(total))}
          onFinish={(result) => {
            recordRound(result);
            setStage({ kind: "result", result });
          }}
          onExit={() => setStage({ kind: "topic" })}
        />
      </Screen>
    );
  }

  if (stage.kind === "result") {
    const { result } = stage;
    return (
      <Screen background="glowTop" overlay={shouldCelebrate(result.score, result.total) ? <Confetti /> : null}>
        <ResultView result={result} best={player.best} hint={t.aiSubtitle(trimmed)}>
          <Text size={13} color={colors.textMuted} align="center">
            {t.aiWarning}
          </Text>
          <Button variant="secondary" icon="share" iconPosition="start" onPress={() => setSharing(true)}>
            {t.shareResult}
          </Button>
          <Button variant="secondary" onPress={() => setStage({ kind: "topic" })}>
            {t.newTopic}
          </Button>
          <Button size="lg" icon="replay" iconPosition="start" onPress={create}>
            {t.playAgain}
          </Button>
        </ResultView>
        <ShareSheet open={sharing} onClose={() => setSharing(false)} result={result} subtitle={t.aiSubtitle(trimmed)} />
      </Screen>
    );
  }

  // Topic entry
  return (
    <Screen background="glowTop">
      <ScreenHeader title={t.aiTitle} backHref="/" />

      <View style={styles.hero}>
        <Logo size={72} decorative />
        <Text weight="display" size={36} lineHeight={52} align="center" role="heading">
          {t.aiCardTitle}
        </Text>
        <Text size={16} lineHeight={27} color={colors.textSecondary} align="center">
          {t.aiIntro}
        </Text>
      </View>

      <View style={styles.field}>
        <TextInput
          style={[styles.input, textStyleFor(lang)]}
          value={topic}
          onChangeText={setTopic}
          placeholder={t.aiTopicPlaceholder}
          placeholderTextColor={colors.textMuted}
          maxLength={AI_CONFIG.maxTopicLength}
          aria-label={t.aiTopicLabel}
          returnKeyType="go"
          onSubmitEditing={create}
          autoCorrect={false}
        />
      </View>

      <View style={styles.suggestions}>
        <ChipGroup label={t.aiTopicLabel}>
          {t.aiSuggestions.map((s) => (
            <Chip key={s} selected={trimmed === s} onPress={() => setTopic(s)}>
              {s}
            </Chip>
          ))}
        </ChipGroup>
      </View>

      <Spacer />

      <Button size="lg" icon="chevronForward" onPress={create} disabled={!trimmed}>
        {t.aiCreate}
      </Button>
      <Button variant="ghost" size="sm" onPress={goHome} style={styles.homeLink}>
        {t.home}
      </Button>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, minHeight: 360, alignItems: "center", justifyContent: "center", gap: 14, paddingHorizontal: 8 },
  hero: { marginTop: 24, alignItems: "center", gap: 8 },
  field: {
    marginTop: 28,
    height: 58,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    justifyContent: "center",
  },
  input: { color: colors.text, fontFamily: fonts.bold, fontSize: 18, paddingVertical: 0 },
  suggestions: { marginTop: 16 },
  errorIcon: {
    width: 72,
    height: 72,
    borderRadius: radius.xl,
    backgroundColor: tints.danger14,
    alignItems: "center",
    justifyContent: "center",
  },
  actions: { gap: 12 },
  homeLink: { marginTop: 8 },
});
