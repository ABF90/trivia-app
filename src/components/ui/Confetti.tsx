import { useEffect } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { colors } from "@/theme";

const COLORS = [colors.primary, colors.success, colors.warning, colors.text];
const PIECES = [
  { left: 0.08, delay: 200 },
  { left: 0.2, delay: 900 },
  { left: 0.36, delay: 400 },
  { left: 0.51, delay: 1300 },
  { left: 0.64, delay: 600 },
  { left: 0.79, delay: 1100 },
  { left: 0.9, delay: 100 },
];

function Piece({ left, delay, color, fall }: { left: number; delay: number; color: string; fall: number }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.set(withDelay(delay, withRepeat(withTiming(1, { duration: 2600, easing: Easing.in(Easing.quad) }), -1)));
  }, [delay, t]);
  const style = useAnimatedStyle(() => {
    const p = t.get();
    return {
      opacity: p < 0.1 ? p * 10 : 1 - p,
      transform: [{ translateY: -40 + p * fall }, { rotate: `${p * 540}deg` }],
    };
  });
  return <Animated.View style={[styles.piece, { left: `${left * 100}%`, backgroundColor: color }, style]} />;
}

/** Falling confetti for scores of 4/5 or better. Hidden when Reduce Motion is on. */
export function Confetti() {
  const reduceMotion = useReducedMotion();
  const { height } = useWindowDimensions();
  if (reduceMotion) return null;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none" aria-hidden>
      {PIECES.map((p, i) => (
        <Piece key={i} left={p.left} delay={p.delay} color={COLORS[i % COLORS.length]!} fall={height * 0.65} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  piece: { position: "absolute", top: 0, width: 8, height: 14, borderRadius: 2 },
});
