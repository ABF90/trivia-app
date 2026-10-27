import { StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Icon, Text } from "@/components/ui";
import { useI18n } from "@/i18n";
import { colors, radius, tints } from "@/theme";
import type { GameResult } from "../../game/types";

/** "راجع أجوبتك": each question with the right answer, and the player's pick when wrong. */
export function AnswerReview({ result }: { result: GameResult }) {
  const { t, pick, lang } = useI18n();
  return (
    <View style={styles.list}>
      {result.questions.map((q, i) => {
        const answer = result.answers[i];
        const correct = !!answer?.correct;
        const english = lang === "ar" && q.untranslated ? "en" : undefined;
        const picked = answer && answer.selected !== null ? q.options[answer.selected] : undefined;
        const yours = picked ? pick(picked) : t.notAnswered;
        return (
          <Animated.View
            key={q.id}
            entering={FadeInDown.delay(200 + i * 80).duration(300)}
            style={[styles.item, !correct && styles.wrongItem]}
          >
            <View style={[styles.mark, { backgroundColor: correct ? colors.success : colors.danger }]}>
              <Icon name={correct ? "check" : "close"} size={16} color={colors.onAccent} strokeWidth={3} label={correct ? t.correct : t.wrong} />
            </View>
            <View style={styles.text}>
              <Text size={14} color={colors.textSecondary} lang={english}>
                {pick(q.summary ?? q.prompt)}
              </Text>
              <Text weight="bold" size={15}>
                {pick(q.options[q.answer]!)}
                {!correct && (
                  <Text weight="semibold" size={13} color={colors.danger300}>
                    {t.yourAnswerWas(yours)}
                  </Text>
                )}
              </Text>
            </View>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 8 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  wrongItem: { borderColor: tints.danger50 },
  mark: { width: 30, height: 30, borderRadius: radius.sm, alignItems: "center", justifyContent: "center" },
  text: { flex: 1, minWidth: 0 },
});
