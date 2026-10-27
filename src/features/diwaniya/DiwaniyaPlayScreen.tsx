import { Redirect, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  ZoomIn,
} from "react-native-reanimated";
import { Button, Confetti, Icon, IconButton, Screen, Spacer, Text } from "@/components/ui";
import { useGoHome } from "@/hooks/useGoHome";
import { toArabicDigits } from "@/lib/arabic";
import { colors, rtl } from "@/theme";
import { GameRunner } from "../game";
import { Standings } from "./components/Standings";
import { useDiwaniya } from "./DiwaniyaProvider";
import { playerName, selectCurrentQuestion, selectStandings } from "./model";

/** The phone icon sways from side to side: "pass it on". */
function PassingPhone() {
  const reduceMotion = useReducedMotion();
  const t = useSharedValue(0);
  useEffect(() => {
    if (!reduceMotion) t.set(withRepeat(withSequence(withTiming(1, { duration: 800 }), withTiming(-1, { duration: 800 })), -1, true));
  }, [reduceMotion, t]);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: 18 * t.get() }, { rotate: `${8 * t.get()}deg` }],
  }));
  return (
    <Animated.View style={[styles.phone, style]}>
      <Icon name="phone" size={84} strokeWidth={1.6} color={colors.success} />
    </Animated.View>
  );
}

export function DiwaniyaPlayScreen() {
  const goHome = useGoHome();
  const router = useRouter();
  const { state, recordTurn, start } = useDiwaniya();
  const [answering, setAnswering] = useState(false);

  // Landing here without a game (reload / deep link) → back to setup.
  if (state.status === "setup") return <Redirect href="/diwaniya" />;

  const standings = selectStandings(state);
  const roundLabel = `الجولة ${toArabicDigits(state.round + 1)} من ${toArabicDigits(state.questionsPerPlayer)}`;

  if (state.status === "finished") {
    const top = standings.filter((s) => s.rank === 1);
    return (
      <Screen background="glowCenter" overlay={<Confetti />}>
        <Animated.View entering={ZoomIn.springify()} style={styles.trophy}>
          <Icon name="trophy" size={84} strokeWidth={1.6} color={colors.warning} />
        </Animated.View>
        <Text size={18} color={colors.textSecondary} align="center" style={styles.winnerLabel}>
          {top.length > 1 ? "تعادل بين" : "الفايز"}
        </Text>
        <Text weight="display" size={52} lineHeight={72} color={colors.warning} align="center">
          {top.map((s) => s.name).join(" و ")}
        </Text>
        <View style={styles.standings}>
          <Standings standings={standings} />
        </View>
        <Spacer />
        <View style={styles.actions}>
          <Button size="lg" icon="replay" iconPosition="start" onPress={start}>
            جولة ثانية بنفس الربع
          </Button>
          {/* Setup keeps the names; starting again resets the scores. */}
          <Button variant="ghost" size="sm" onPress={() => router.dismissTo("/diwaniya")}>
            غيّر اللاعبين
          </Button>
        </View>
      </Screen>
    );
  }

  const current = state.players[state.turn]!;
  const currentName = playerName(current, state.turn);
  const question = selectCurrentQuestion(state);

  if (answering && question) {
    return (
      <Screen>
        <GameRunner
          key={`${state.round}-${state.turn}`}
          questions={[question]}
          allowLifeline={false}
          scoreOffset={current.score}
          label={() => `دور ${currentName} · ${roundLabel}`}
          onFinish={(r) => {
            recordTurn(r.score > 0);
            setAnswering(false);
          }}
          onExit={goHome}
        />
      </Screen>
    );
  }

  return (
    <Screen background="glowTeal">
      <View style={styles.header}>
        <IconButton icon="close" label="إنهاء اللعبة" onPress={goHome} />
        <Text weight="heavy" size={15} color={colors.textSecondary}>
          {roundLabel}
        </Text>
      </View>

      <PassingPhone />
      <Text size={18} color={colors.textSecondary} align="center" style={styles.passTo}>
        مرّر التلفون لـ
      </Text>
      <Animated.View key={current.id} entering={ZoomIn.delay(200).springify()}>
        <Text weight="display" size={56} lineHeight={76} color={colors.success} align="center">
          {currentName}
        </Text>
      </Animated.View>
      <Text size={15} color={colors.textMuted} align="center">
        لا تشوف السؤال قبل دورك!
      </Text>

      <View style={styles.standings}>
        <Standings standings={standings} activeIndex={state.turn} />
      </View>

      <Spacer />

      <Button size="lg" variant="success" onPress={() => setAnswering(true)}>
        {`أنا ${currentName}، جاهز`}
      </Button>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: rtl.row, alignItems: "center", justifyContent: "space-between" },
  phone: { marginTop: 40, alignSelf: "center" },
  passTo: { marginTop: 20 },
  standings: { marginTop: 32 },
  trophy: { marginTop: 24, alignSelf: "center" },
  winnerLabel: { marginTop: 24 },
  actions: { gap: 10 },
});
