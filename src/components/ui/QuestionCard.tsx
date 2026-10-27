import { StyleSheet, View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import type { Language } from "@/i18n";
import { colors, radius, shadows, tints } from "@/theme";
import { Text } from "./Text";

interface QuestionCardProps {
  prompt: string;
  category?: string;
  warning?: boolean;
  compact?: boolean;
  /** Language of the prompt when it isn't the UI language (untranslated live question). */
  textLang?: Language;
  /** Small pill shown next to the category, e.g. "بالإنجليزي". */
  note?: string;
  noteLabel?: string;
}

export function QuestionCard({ prompt, category, warning, compact, textLang, note, noteLabel }: QuestionCardProps) {
  return (
    <Animated.View
      entering={compact ? undefined : FadeInRight.duration(350)}
      style={[styles.card, !compact && shadows.card, compact && styles.compact, warning && styles.warning]}
    >
      {(category || note) && (
        <View style={styles.pills}>
          {category && (
            <View style={styles.category}>
              <Text weight="bold" size={13} color={colors.primary300}>
                {category}
              </Text>
            </View>
          )}
          {note && (
            <View style={styles.note} aria-label={noteLabel}>
              <Text weight="bold" size={12} color={colors.warning}>
                {note}
              </Text>
            </View>
          )}
        </View>
      )}
      <Text weight="heavy" size={compact ? 20 : 22} lineHeight={compact ? 31 : 35} role="heading" lang={textLang}>
        {prompt}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 24,
    gap: 12,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  compact: { paddingVertical: 20 },
  warning: { borderColor: tints.warning35 },
  pills: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  note: { backgroundColor: tints.warning14, paddingHorizontal: 10, paddingVertical: 2, borderRadius: 12 },
  category: {
    backgroundColor: tints.primary15,
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 12,
  },
});
