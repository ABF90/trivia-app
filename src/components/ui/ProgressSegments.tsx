import { StyleSheet, View } from "react-native";
import { colors, rtl } from "@/theme";

export type SegmentState = "correct" | "wrong" | "current" | "pending";

const COLORS: Record<SegmentState, string> = {
  correct: colors.success,
  wrong: colors.danger,
  current: colors.primary,
  pending: colors.border,
};

export function ProgressSegments({ segments }: { segments: SegmentState[] }) {
  return (
    <View style={styles.track} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {segments.map((state, i) => (
        <View key={i} style={[styles.segment, { backgroundColor: COLORS[state] }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: rtl.row, gap: 4 },
  segment: { flex: 1, height: 6, borderRadius: 3 },
});
