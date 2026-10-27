import { useEffect } from "react";
import { Pressable, StyleSheet, View, type ViewStyle } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { colors, rtl } from "@/theme";
import { Icon } from "./Icon";
import { Text } from "./Text";

export type AnswerState = "idle" | "correct" | "wrong" | "removed" | "dimmed";

interface AnswerOptionProps {
  label: string;
  state?: AnswerState;
  /** Small caption next to the icon, e.g. "جوابك". */
  tag?: string;
  /** Position in the list, staggers the entry animation (70ms each). */
  index?: number;
  compact?: boolean;
  disabled?: boolean;
  animateIn?: boolean;
  onSelect?: () => void;
}

const CONTAINER: Record<AnswerState, ViewStyle> = {
  idle: { backgroundColor: colors.surface, borderColor: colors.borderStrong },
  correct: { backgroundColor: colors.success, borderColor: colors.success },
  wrong: { backgroundColor: colors.danger, borderColor: colors.danger },
  removed: { backgroundColor: "transparent", borderColor: colors.borderStrong, borderStyle: "dashed" },
  dimmed: { backgroundColor: colors.surfaceMuted, borderColor: colors.surfaceMuted },
};

export function AnswerOption({
  label,
  state = "idle",
  tag,
  index = 0,
  compact,
  disabled,
  animateIn = true,
  onSelect,
}: AnswerOptionProps) {
  const shake = useSharedValue(0);
  const scale = useSharedValue(1);
  const fade = useSharedValue(1);

  // Wrong → shake, correct → pop, removed by 50/50 → shrink and fade.
  useEffect(() => {
    if (state === "wrong") {
      shake.set(withSequence(...[-8, 8, -8, 8, 0].map((x) => withTiming(x, { duration: 60 }))));
    } else if (state === "correct") {
      scale.set(withSequence(withTiming(1.03, { duration: 150 }), withSpring(1)));
    } else if (state === "removed") {
      scale.set(withTiming(0.96, { duration: 250 }));
      fade.set(withTiming(0.35, { duration: 250 }));
    }
  }, [state, shake, scale, fade]);

  const motion = useAnimatedStyle(() => ({
    opacity: fade.get(),
    transform: [{ translateX: shake.get() }, { scale: scale.get() }],
  }));

  const onAccent = state === "correct" || state === "wrong";
  const muted = state === "removed" || state === "dimmed";
  const textColor = onAccent ? colors.onAccent : muted ? colors.textMuted : colors.text;
  const icon = state === "correct" ? "check" : state === "wrong" ? "close" : null;
  const height = state === "dimmed" ? 48 : compact ? 56 : 60;

  return (
    <Animated.View entering={animateIn ? FadeInDown.delay(350 + index * 70).duration(300) : undefined} style={motion}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || state !== "idle" }}
        accessibilityElementsHidden={state === "removed"}
        importantForAccessibility={state === "removed" ? "no-hide-descendants" : "auto"}
        disabled={disabled || state !== "idle"}
        onPress={onSelect}
        style={({ pressed }) => [
          styles.option,
          { minHeight: height },
          CONTAINER[state],
          pressed && state === "idle" && styles.pressed,
        ]}
      >
        <Text
          weight={onAccent ? "heavy" : "bold"}
          size={state === "dimmed" ? 17 : 19}
          color={textColor}
          style={[styles.label, state === "removed" && styles.struck]}
        >
          {label}
        </Text>
        {(icon || tag) && (
          <View style={styles.tag}>
            {tag && (
              <Text weight="heavy" size={13} color={colors.onAccent}>
                {tag}
              </Text>
            )}
            {icon && <Icon name={icon} size={22} color={colors.onAccent} strokeWidth={3} />}
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  option: {
    borderRadius: 18,
    borderWidth: 1.5,
    paddingHorizontal: 20,
    paddingVertical: 8,
    flexDirection: rtl.row,
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  pressed: { borderColor: colors.primary300 },
  label: { flexShrink: 1 },
  struck: { textDecorationLine: "line-through" },
  tag: { flexDirection: rtl.row, alignItems: "center", gap: 6, flexShrink: 0 },
});
