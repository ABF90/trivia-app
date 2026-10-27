import { StyleSheet, View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import { colors, radius, rtl, shadows, tints } from "@/theme";
import { Text } from "./Text";

interface QuestionCardProps {
  prompt: string;
  category?: string;
  warning?: boolean;
  compact?: boolean;
}

export function QuestionCard({ prompt, category, warning, compact }: QuestionCardProps) {
  return (
    <Animated.View
      entering={compact ? undefined : FadeInRight.duration(350)}
      style={[styles.card, !compact && shadows.card, compact && styles.compact, warning && styles.warning]}
    >
      {category && (
        <View style={styles.category}>
          <Text weight="bold" size={13} color={colors.primary300}>
            {category}
          </Text>
        </View>
      )}
      <Text weight="heavy" size={compact ? 20 : 22} lineHeight={compact ? 31 : 35} role="heading">
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
  category: {
    alignSelf: rtl.alignStart,
    backgroundColor: tints.primary15,
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 12,
  },
});
