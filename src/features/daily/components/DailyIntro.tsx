import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Button, Icon, ScreenHeader, Spacer, Text } from "@/components/ui";
import { GAME_CONFIG } from "@/config/game";
import { useI18n } from "@/i18n";
import { colors, radius } from "@/theme";
import { NextDailyCountdown } from "./NextDailyCountdown";
import { WeekStrip } from "./WeekStrip";

interface DailyIntroProps {
  today: string;
  streak: number;
  playedDays: ReadonlySet<string>;
  onStart: () => void;
}

function Flame() {
  const reduceMotion = useReducedMotion();
  const t = useSharedValue(0);
  useEffect(() => {
    if (!reduceMotion) t.set(withRepeat(withSequence(withTiming(1, { duration: 700 }), withTiming(0, { duration: 700 })), -1));
  }, [reduceMotion, t]);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + t.get() * 0.08 }, { rotate: `${-3 * t.get()}deg` }],
  }));
  return (
    <Animated.View style={style}>
      <Icon name="flame" size={64} strokeWidth={1.6} color={colors.warning} fill="rgba(255,176,32,0.18)" />
    </Animated.View>
  );
}

export function DailyIntro({ today, streak, playedDays, onStart }: DailyIntroProps) {
  const { t, n, days } = useI18n();
  return (
    <>
      <ScreenHeader title={t.dailyHeader} backHref="/" />

      <View style={styles.hero}>
        <Flame />
        <Text weight="display" size={52} lineHeight={72} color={colors.warning} align="center">
          {streak > 0 ? days(streak) : t.startStreak}
        </Text>
        <Text size={15} color={colors.textSecondary} align="center">
          {streak > 0 ? t.streakAlive : t.streakStart}
        </Text>
        <WeekStrip today={today} playedDays={playedDays} />
      </View>

      <Text size={16} lineHeight={27} color={colors.textSecondary} align="center" style={styles.rules}>
        {t.dailyRules(n(GAME_CONFIG.roundSize))}
      </Text>

      <Spacer />

      <NextDailyCountdown />
      <Button size="lg" variant="warning" onPress={onStart}>
        {t.startDaily}
      </Button>
    </>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginTop: 28,
    borderRadius: radius.xxl,
    paddingVertical: 28,
    paddingHorizontal: 20,
    backgroundColor: colors.surface,
    alignItems: "center",
    gap: 4,
  },
  rules: { marginTop: 24 },
});
