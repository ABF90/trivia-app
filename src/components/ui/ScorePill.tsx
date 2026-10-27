import { StyleSheet, View } from "react-native";
import { toArabicDigits } from "@/lib/arabic";
import { colors, rtl } from "@/theme";
import { Icon } from "./Icon";
import { Text } from "./Text";

export function ScorePill({ points }: { points: number }) {
  return (
    <View style={styles.pill} accessible aria-label={`${toArabicDigits(points)} نقاط`}>
      <Icon name="trophy" size={18} color={colors.warning} />
      <Text weight="display" size={22} lineHeight={30}>
        {toArabicDigits(points)}
      </Text>
      <Text weight="bold" size={13} color={colors.textSecondary}>
        نقاط
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 22,
    backgroundColor: colors.surface,
    flexDirection: rtl.row,
    alignItems: "center",
    gap: 6,
  },
});
