import { StyleSheet, useWindowDimensions, View } from "react-native";
import { useI18n } from "@/i18n";
import { colors } from "@/theme";
import { Text } from "./Text";

interface ScoreDigitsProps {
  score: number;
  total: number;
  /** Digit tile width; shrinks to a quarter of the screen width on narrow phones. */
  size?: number;
  variant?: "inset" | "boxed";
}

/** Stadium-scoreboard style "٤ / ٥" (score at the reading start). */
export function ScoreDigits({ score, total, size = 96, variant = "inset" }: ScoreDigitsProps) {
  const { width } = useWindowDimensions();
  const { n, t } = useI18n();
  const w = Math.min(size, width / 4);
  const tile = [
    styles.tile,
    { width: w, height: w * 1.2, borderRadius: w * 0.19 },
    variant === "boxed" && styles.boxed,
  ];
  const digit = (value: number, color: string) => (
    <View style={tile}>
      <Text weight="display" size={w * 0.95} lineHeight={w * 1.2} color={color} align="center">
        {n(value)}
      </Text>
    </View>
  );
  return (
    <View
      style={[styles.row, { gap: w * 0.18 }]}
      accessible
      aria-label={t.scoreOf(n(score), n(total))}
    >
      {digit(score, score === 0 ? colors.danger : colors.success)}
      <Text weight="display" size={w * 0.46} color={colors.textMuted}>
        /
      </Text>
      {digit(total, colors.text)}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  tile: { backgroundColor: colors.surfaceMuted, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  boxed: { backgroundColor: colors.bgDeep, borderWidth: 2, borderColor: colors.border },
});
