import { Pressable, StyleSheet } from "react-native";
import { Text } from "@/components/ui";
import { colors } from "@/theme";

interface LifelineButtonProps {
  used: boolean;
  disabled?: boolean;
  onUse: () => void;
}

export function LifelineButton({ used, disabled, onUse }: LifelineButtonProps) {
  const tone = used ? colors.textMuted : colors.warning;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={used ? "٥٠/٥٠، استخدمتها" : "٥٠/٥٠، احذف إجابتين"}
      accessibilityState={{ disabled: used || disabled }}
      disabled={used || disabled}
      onPress={onUse}
      style={({ pressed }) => [styles.button, { borderColor: used ? colors.borderStrong : colors.warning }, pressed && styles.pressed]}
    >
      <Text
        weight="display"
        size={18}
        lineHeight={22}
        color={tone}
        align="center"
        style={used ? styles.struck : undefined}
      >
        ٥٠/٥٠
      </Text>
      <Text weight="bold" size={11} lineHeight={15} color={tone} align="center">
        {used ? "استخدمتها" : "احذف ٢"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { backgroundColor: "rgba(255,176,32,0.10)" },
  struck: { textDecorationLine: "line-through" },
});
