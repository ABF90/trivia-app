import { StyleSheet, View } from "react-native";
import Animated, { FadeInLeft, FadeInRight, ZoomIn } from "react-native-reanimated";
import { Avatar, Button, Logo, Spacer, Text } from "@/components/ui";
import { GAME_CONFIG } from "@/config/game";
import { useI18n } from "@/i18n";
import { colors, radius } from "@/theme";
import type { Challenge } from "../codec";
import { describeRules } from "../rules";

interface ChallengeIntroProps {
  challenge: Challenge;
  onAccept: () => void;
  onDecline: () => void;
}

export function ChallengeIntro({ challenge, onAccept, onDecline }: ChallengeIntroProps) {
  const total = challenge.questions.length;
  const i18n = useI18n();
  const { t, n } = i18n;
  const name = challenge.name || t.aFriend;
  return (
    <>
      <View style={styles.brand}>
        <Logo size={36} variant="mark" decorative />
        <Text weight="display" size={26} lineHeight={36}>
          {t.appName}
        </Text>
      </View>

      <Text weight="display" size={42} lineHeight={56} align="center" style={styles.title} role="heading">
        {t.challengesYou(name)}
      </Text>
      <Text size={16} color={colors.textSecondary} align="center">
        {t.sameQuestions(n(total), n(GAME_CONFIG.secondsPerQuestion))}
      </Text>

      <View style={styles.versus}>
        <Animated.View entering={FadeInRight.duration(400)} style={styles.player}>
          <Avatar label={name.charAt(0)} size={64} />
          <Text weight="heavy" size={16} align="center" numberOfLines={1}>
            {name}
          </Text>
          <Text weight="display" size={38} lineHeight={50} color={colors.success} align="center">
            {`${n(challenge.score)} / ${n(total)}`}
          </Text>
        </Animated.View>
        <Animated.View entering={ZoomIn.delay(500).springify()} style={styles.vs}>
          <Text weight="display" size={26} lineHeight={36} color={colors.onAccent} align="center">
            VS
          </Text>
        </Animated.View>
        <Animated.View entering={FadeInLeft.delay(150).duration(400)} style={[styles.player, styles.you]}>
          <Avatar label="؟" color="slate" size={64} />
          <Text weight="heavy" size={16} align="center">
            {t.you}
          </Text>
          <Text weight="display" size={38} lineHeight={50} color={colors.textMuted} align="center">
            {`? / ${n(total)}`}
          </Text>
        </Animated.View>
      </View>

      <Text size={15} color={colors.textMuted} align="center" style={styles.rules}>
        {describeRules(i18n, challenge.score, total)}
      </Text>

      <Spacer />

      <View style={styles.actions}>
        <Button size="lg" onPress={onAccept}>
          {t.acceptChallenge}
        </Button>
        <Button variant="ghost" size="sm" onPress={onDecline}>
          {t.notNow}
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  brand: { flexDirection: "row", alignItems: "center", gap: 10 },
  title: { marginTop: 40 },
  versus: { marginTop: 36, flexDirection: "row", alignItems: "center", gap: 8 },
  player: {
    flex: 1,
    minWidth: 0,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: "center",
    gap: 6,
  },
  you: { borderWidth: 2, borderStyle: "dashed", borderColor: colors.borderStrong },
  vs: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.warning,
    alignItems: "center",
    justifyContent: "center",
  },
  rules: { marginTop: 28 },
  actions: { gap: 12 },
});
