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
import { formatDays, toArabicDigits } from "@/lib/arabic";
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
  return (
    <>
      <ScreenHeader title="تحدي اليوم" backHref="/" />

      <View style={styles.hero}>
        <Flame />
        <Text weight="display" size={52} lineHeight={72} color={colors.warning} align="center">
          {streak > 0 ? formatDays(streak) : "ابدأ سلسلتك"}
        </Text>
        <Text size={15} color={colors.textSecondary} align="center">
          {streak > 0 ? "سلسلتك ما انقطعت، لا تخربها اليوم!" : "العب كل يوم وخل السلسلة تكبر"}
        </Text>
        <WeekStrip today={today} playedDays={playedDays} />
      </View>

      <Text size={16} lineHeight={27} color={colors.textSecondary} align="center" style={styles.rules}>
        {`نفس الـ ${toArabicDigits(GAME_CONFIG.roundSize)} أسئلة لكل اللاعبين، ومحاولة وحدة بس.`}
      </Text>

      <Spacer />

      <NextDailyCountdown />
      <Button size="lg" variant="warning" onPress={onStart}>
        ابدأ تحدي اليوم
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
