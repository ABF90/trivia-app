import { useRef, type ReactNode } from "react";
import { I18nManager, Pressable, ScrollView, StyleSheet, type ScrollViewInstance } from "react-native";
import { colors, layout, rtl, tints } from "@/theme";
import { Text } from "./Text";

interface ChipProps {
  selected?: boolean;
  onPress?: () => void;
  children: string;
}

export function Chip({ selected = false, onPress, children }: ChipProps) {
  return (
    <Pressable
      role="button"
      aria-selected={selected}
      onPress={onPress}
      style={[styles.chip, selected && styles.selected]}
    >
      <Text weight={selected ? "heavy" : "bold"} size={15}>
        {children}
      </Text>
    </Pressable>
  );
}

/** Horizontally scrolling chip list that bleeds to the screen edges and starts on the right. */
export function ChipRow({ children }: { children: ReactNode }) {
  const ref = useRef<ScrollViewInstance>(null);
  return (
    <ScrollView
      ref={ref}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.row}
      contentContainerStyle={styles.rowContent}
      // Without native RTL the reversed row starts scrolled to the left; jump to its right edge.
      onContentSizeChange={() => !I18nManager.isRTL && ref.current?.scrollToEnd({ animated: false })}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    justifyContent: "center",
  },
  selected: { borderWidth: 2, borderColor: colors.primary, backgroundColor: tints.primary20 },
  row: { marginHorizontal: -layout.gutter, flexGrow: 0 },
  rowContent: { flexDirection: rtl.row, gap: 8, paddingHorizontal: layout.gutter },
});
