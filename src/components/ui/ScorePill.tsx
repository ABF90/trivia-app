import { StyleSheet, View } from "react-native";
import { useI18n } from "@/i18n";
import { colors } from "@/theme";
import { Icon } from "./Icon";
import { Text } from "./Text";

export function ScorePill({ points }: { points: number }) {
  const { n, t } = useI18n();
  return (
    <View style={styles.pill} accessible aria-label={t.pointsLabel(n(points))}>
      <Icon name="trophy" size={18} color={colors.warning} />
      <Text weight="display" size={22} lineHeight={30}>
        {n(points)}
      </Text>
      <Text weight="bold" size={13} color={colors.textSecondary}>
        {t.points}
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
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});
