import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { Badge, ResultDots, ScoreDigits, Spacer, Text } from "@/components/ui";
import { formatScore, toArabicDigits } from "@/lib/arabic";
import { colors, radius } from "@/theme";
import { getHeadline, getNextTitleHint, getTitle } from "../model/titles";
import type { GameResult } from "../types";

interface ResultViewProps {
  result: GameResult;
  best?: { score: number; total: number } | null;
  /** Overrides the default headline ("كفو!" …). */
  headline?: string;
  /** Overrides the default title hint line. */
  hint?: string;
  /** Action buttons pinned to the bottom. */
  children: ReactNode;
}

/** Score reveal. Pair it with <Confetti /> via the Screen overlay when shouldCelebrate(). */
export function ResultView({ result, best, headline, hint, children }: ResultViewProps) {
  const { score, total, answers } = result;
  return (
    <>
      <Animated.View entering={FadeInDown.delay(500).duration(400)} style={styles.head}>
        <Text weight="display" size={56} lineHeight={76} align="center">
          {headline ?? getHeadline(score, total)}
        </Text>
        <Badge icon="badge" outlined size={16}>{`لقبك: ${getTitle(score, total)}`}</Badge>
        <Text size={14} color={colors.textSecondary} align="center">
          {hint ?? getNextTitleHint(score, total)}
        </Text>
      </Animated.View>

      <Animated.View
        entering={ZoomIn.springify().damping(12)}
        style={styles.board}
        accessible
        accessibilityLabel={`نتيجتك ${toArabicDigits(score)} من ${toArabicDigits(total)}`}
      >
        <Text weight="bold" size={13} color={colors.textMuted} align="center" style={styles.boardLabel}>
          النتيجة النهائية
        </Text>
        <ScoreDigits score={score} total={total} size={total >= 10 ? 80 : 96} />
        <ResultDots results={answers.map((a) => a.correct)} />
        {best && (
          <Text size={14} color={colors.textMuted} align="center">
            أفضل نتيجة لك:{" "}
            <Text weight="heavy" size={14}>
              {formatScore(best.score, best.total)}
            </Text>
          </Text>
        )}
      </Animated.View>

      <Spacer />

      <Animated.View entering={FadeInDown.delay(1100).duration(400)} style={styles.actions}>
        {children}
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  head: { gap: 8, marginTop: 8 },
  board: {
    marginTop: 28,
    backgroundColor: colors.bgDeep,
    borderRadius: radius.xxl,
    padding: 22,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    gap: 14,
  },
  boardLabel: { letterSpacing: 2 },
  actions: { gap: 12 },
});
