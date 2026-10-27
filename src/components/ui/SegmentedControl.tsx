import { Pressable, StyleSheet, View } from "react-native";
import { colors, radius, rtl, tints } from "@/theme";
import { Text } from "./Text";

interface SegmentedControlProps<T extends string | number> {
  legend: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  format?: (value: T) => string;
}

export function SegmentedControl<T extends string | number>({
  legend,
  options,
  value,
  onChange,
  format = String,
}: SegmentedControlProps<T>) {
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={legend} style={styles.group}>
      <Text weight="heavy" size={15} color={colors.textMuted}>
        {legend}
      </Text>
      <View style={styles.options}>
        {options.map((option) => {
          const selected = option === value;
          return (
            <Pressable
              key={option}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => onChange(option)}
              style={[styles.option, selected && styles.selected]}
            >
              <Text weight="display" size={22} lineHeight={32} align="center">
                {format(option)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: 10 },
  options: { flexDirection: rtl.row, gap: 10 },
  option: {
    flex: 1,
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  selected: { borderWidth: 2, borderColor: colors.primary, backgroundColor: tints.primary20 },
});
