import type { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { colors, tints } from "@/theme";
import { Text } from "./Text";

interface ChipProps {
  selected?: boolean;
  /** Dimmed but still tappable (e.g. the max-3 limit is reached). */
  dimmed?: boolean;
  onPress?: () => void;
  children: string;
}

export function Chip({ selected = false, dimmed = false, onPress, children }: ChipProps) {
  return (
    <Pressable
      role="button"
      aria-selected={selected}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, selected && styles.selected, dimmed && styles.dimmed, pressed && styles.pressed]}
    >
      <Text weight={selected ? "heavy" : "bold"} size={15}>
        {children}
      </Text>
    </Pressable>
  );
}

/** Wrapping group of chips, so every option is visible without scrolling. */
export function ChipGroup({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <View role="group" aria-label={label} style={styles.group}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 42,
    paddingHorizontal: 15,
    borderRadius: 21,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    justifyContent: "center",
  },
  selected: { borderWidth: 2, borderColor: colors.primary, backgroundColor: tints.primary20 },
  dimmed: { opacity: 0.45 },
  pressed: { transform: [{ scale: 0.97 }] },
  group: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
});
