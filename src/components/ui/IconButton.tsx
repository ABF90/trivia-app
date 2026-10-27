import { useRouter, type Href } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { colors } from "@/theme";
import { Icon, type IconName } from "./Icon";

interface IconButtonProps {
  icon: IconName;
  label: string;
  href?: Href;
  onPress?: () => void;
}

export function IconButton({ icon, label, href, onPress }: IconButtonProps) {
  const router = useRouter();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      onPress={() => (href ? router.push(href) : onPress?.())}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Icon name={icon} size={20} color={colors.textSecondary} strokeWidth={2.2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { backgroundColor: colors.border },
});
