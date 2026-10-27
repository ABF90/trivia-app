import { View } from "react-native";
import { colors } from "@/theme";
import { Text } from "./Text";

const PALETTE = {
  blue: { bg: colors.primary, fg: colors.white },
  teal: { bg: colors.success, fg: colors.onAccent },
  amber: { bg: colors.warning, fg: colors.onAccent },
  rose: { bg: colors.danger, fg: colors.onAccent },
  sky: { bg: colors.primary300, fg: colors.onAccent },
  slate: { bg: colors.border, fg: colors.textSecondary },
} as const;

export type AvatarColor = keyof typeof PALETTE;
const ORDER: AvatarColor[] = ["blue", "teal", "amber", "rose", "sky", "slate"];

export function avatarColorAt(index: number): AvatarColor {
  return ORDER[index % ORDER.length]!;
}

interface AvatarProps {
  label: string;
  color?: AvatarColor;
  size?: number;
}

export function Avatar({ label, color = "blue", size = 34 }: AvatarProps) {
  const p = PALETTE[color];
  return (
    <View
      aria-hidden
      style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: p.bg, alignItems: "center", justifyContent: "center" }}
    >
      <Text weight="display" size={size * 0.5} lineHeight={size * 0.75} color={p.fg} align="center">
        {label}
      </Text>
    </View>
  );
}
