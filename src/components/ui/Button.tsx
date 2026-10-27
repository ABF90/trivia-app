import { useRouter, type Href } from "expo-router";
import { useEffect, type ReactNode } from "react";
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { colors, radius, rtl, shadows } from "@/theme";
import { Icon, type IconName } from "./Icon";
import { Text } from "./Text";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "warning" | "success" | "dashed";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: ReactNode;
  onPress?: () => void;
  /** Navigates with the router instead of calling onPress. */
  href?: Href;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconPosition?: "start" | "end";
  /** Drop the coloured glow shadow. */
  flat?: boolean;
  /** Subtle "breathing" call-to-action animation. */
  breathe?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

const VARIANTS: Record<ButtonVariant, { container: ViewStyle; text: string; shadow?: ViewStyle }> = {
  primary: { container: { backgroundColor: colors.primary }, text: colors.white, shadow: shadows.primary },
  secondary: { container: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }, text: colors.text },
  ghost: { container: { backgroundColor: "transparent" }, text: colors.textSecondary },
  danger: { container: { backgroundColor: "transparent" }, text: colors.danger },
  warning: { container: { backgroundColor: colors.warning }, text: colors.onAccent, shadow: shadows.warning },
  success: { container: { backgroundColor: colors.success }, text: colors.onAccent, shadow: shadows.success },
  dashed: {
    container: { backgroundColor: "transparent", borderWidth: 1.5, borderStyle: "dashed", borderColor: colors.borderStrong },
    text: colors.primary200,
  },
};

const SIZES: Record<ButtonSize, { height: number; radius: number; font: number; icon: number; px: number }> = {
  lg: { height: 64, radius: radius.lg, font: 21, icon: 22, px: 24 },
  md: { height: 56, radius: 18, font: 16, icon: 20, px: 14 },
  sm: { height: 48, radius: 18, font: 16, icon: 18, px: 16 },
};

function useBreathe(enabled: boolean) {
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);
  useEffect(() => {
    if (!enabled || reduceMotion) return;
    scale.set(withRepeat(withSequence(withTiming(1.04, { duration: 600 }), withTiming(1, { duration: 600 })), -1));
  }, [enabled, reduceMotion, scale]);
  return useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));
}

export function Button({
  children,
  onPress,
  href,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "end",
  flat,
  breathe = false,
  disabled,
  accessibilityLabel,
  style,
}: ButtonProps) {
  const router = useRouter();
  const v = VARIANTS[variant];
  const s = SIZES[size];
  const breatheStyle = useBreathe(breathe);
  const iconEl = icon && <Icon name={icon} size={s.icon} color={v.text} strokeWidth={2.4} />;

  const handlePress = () => {
    if (href) router.push(href);
    else onPress?.();
  };

  return (
    <Animated.View style={[breatheStyle, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled: !!disabled }}
        disabled={disabled}
        onPress={handlePress}
        style={({ pressed }) => [
          styles.base,
          { minHeight: s.height, borderRadius: s.radius, paddingHorizontal: s.px },
          v.container,
          !flat && v.shadow,
          pressed && styles.pressed,
          disabled && styles.disabled,
        ]}
      >
        <View style={styles.content}>
          {iconPosition === "start" && iconEl}
          <Text weight={size === "sm" ? "bold" : "heavy"} size={s.font} color={v.text} align="center">
            {children}
          </Text>
          {iconPosition === "end" && iconEl}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: "center", justifyContent: "center" },
  content: { flexDirection: rtl.row, alignItems: "center", justifyContent: "center", gap: 10 },
  pressed: { transform: [{ scale: 0.98 }], opacity: 0.92 },
  disabled: { opacity: 0.5 },
});
