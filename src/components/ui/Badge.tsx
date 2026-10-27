import { StyleSheet, View } from "react-native";
import { colors, rtl, tints } from "@/theme";
import { Icon, type IconName } from "./Icon";
import { Text } from "./Text";

type Tone = "warning" | "primary" | "success" | "danger";

const TONES: Record<Tone, { fg: string; bg: string; border: string }> = {
  warning: { fg: colors.warning, bg: tints.warning14, border: tints.warning40 },
  primary: { fg: colors.primary300, bg: tints.primary15, border: tints.primary35 },
  success: { fg: colors.success, bg: tints.success14, border: colors.success },
  danger: { fg: colors.danger, bg: tints.danger14, border: tints.danger50 },
};

interface BadgeProps {
  children: string;
  icon?: IconName;
  tone?: Tone;
  outlined?: boolean;
  size?: number;
}

export function Badge({ children, icon, tone = "warning", outlined, size = 15 }: BadgeProps) {
  const t = TONES[tone];
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }, outlined && { borderWidth: 1, borderColor: t.border }]}>
      {icon && <Icon name={icon} size={size + 3} color={t.fg} />}
      <Text weight="heavy" size={size} color={t.fg}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: rtl.row,
    alignItems: "center",
    alignSelf: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 999,
  },
});
