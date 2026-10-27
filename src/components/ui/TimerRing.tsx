import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { useI18n } from "@/i18n";
import { colors } from "@/theme";
import { Text } from "./Text";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const SIZE = 76;
const RADIUS = 32;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface TimerRingProps {
  timeLeft: number;
  total: number;
  warningAt: number;
  paused?: boolean;
}

export function TimerRing({ timeLeft, total, warningAt, paused = false }: TimerRingProps) {
  const warning = timeLeft <= warningAt;
  const reduceMotion = useReducedMotion();
  const { n, t } = useI18n();
  const progress = useSharedValue(timeLeft / total);
  const pulse = useSharedValue(1);

  useEffect(() => {
    progress.set(withTiming(timeLeft / total, { duration: paused ? 0 : 1000, easing: Easing.linear }));
  }, [timeLeft, total, paused, progress]);

  // Last seconds: amber ring that pulses.
  useEffect(() => {
    if (warning && !paused && !reduceMotion) {
      pulse.set(withRepeat(withSequence(withTiming(1.08, { duration: 500 }), withTiming(1, { duration: 500 })), -1));
    } else {
      cancelAnimation(pulse);
      pulse.set(withTiming(1, { duration: 150 }));
    }
  }, [warning, paused, reduceMotion, pulse]);

  const ringProps = useAnimatedProps(() => ({ strokeDashoffset: CIRCUMFERENCE * (1 - progress.get()) }));
  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.get() }] }));
  const tone = warning ? colors.warning : colors.primary;

  return (
    <Animated.View
      style={[styles.timer, pulseStyle, paused && styles.paused]}
      accessible
      role="timer"
      aria-label={t.secondsLeft(n(timeLeft))}
    >
      <Svg width={SIZE} height={SIZE} viewBox="0 0 76 76">
        <Circle cx="38" cy="38" r={RADIUS} fill="none" stroke={colors.border} strokeWidth={7} />
        <AnimatedCircle
          cx="38"
          cy="38"
          r={RADIUS}
          fill="none"
          stroke={tone}
          strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          animatedProps={ringProps}
          transform="rotate(-90 38 38)"
        />
      </Svg>
      <View style={styles.value} pointerEvents="none">
        <Text weight="display" size={warning ? 30 : 28} color={warning ? colors.warning : colors.text} align="center" lineHeight={40}>
          {n(timeLeft)}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  timer: { width: SIZE, height: SIZE },
  paused: { opacity: 0.6 },
  value: { ...StyleSheet.absoluteFill, alignItems: "center", justifyContent: "center" },
});
