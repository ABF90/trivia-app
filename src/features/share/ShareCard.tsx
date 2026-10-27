import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import { Badge, Logo, ResultDots, ScoreDigits, Spacer, Text } from "@/components/ui";
import { GAME_CONFIG } from "@/config/game";
import { useI18n } from "@/i18n";
import { colors } from "@/theme";
import { titleText } from "../game/model/titles";

export interface ShareCardProps {
  playerName: string;
  subtitle: string;
  score: number;
  total: number;
  results: boolean[];
  streak?: number;
  /** Card width; every size inside scales with it (story format 9:16). */
  width: number;
}

export function ShareCard({ playerName, subtitle, score, total, results, streak, width }: ShareCardProps) {
  const { t, n, days } = useI18n();
  const u = width / 100; // 1% of the card width
  return (
    <View style={[styles.card, { width, height: width * (16 / 9), padding: 8 * u, paddingTop: 10 * u }]}>
      <LinearGradient colors={["#1B3A80", colors.bg]} locations={[0, 0.65]} style={StyleSheet.absoluteFill} />
      <View style={[styles.brand, { gap: 2.5 * u }]}>
        <Logo size={11 * u} decorative />
        <Text weight="display" size={8.4 * u} lineHeight={12 * u}>
          {t.appName}
        </Text>
      </View>
      <Text weight="display" size={6.4 * u} lineHeight={10 * u} align="center" style={{ marginTop: 3 * u }}>
        {playerName}
      </Text>
      <Text weight="bold" size={3.7 * u} color={colors.primary200} align="center">
        {subtitle}
      </Text>

      <View style={{ marginTop: 6 * u }}>
        <ScoreDigits score={score} total={total} size={27 * u} variant="boxed" />
      </View>
      <View style={{ marginTop: 5 * u }}>
        <ResultDots results={results} size={9 * u} showIcons={false} />
      </View>
      <View style={[styles.badges, { marginTop: 4 * u, gap: 2.5 * u }]}>
        <Badge icon="badge" size={3.7 * u}>
          {titleText(t, score, total)}
        </Badge>
        {!!streak && (
          <Badge icon="flame" size={3.7 * u}>
            {t.streakBadge(days(streak))}
          </Badge>
        )}
      </View>

      <Spacer />

      <Text weight="display" size={10.8 * u} lineHeight={15 * u} align="center">
        {t.canYouBeatMe}
      </Text>
      <Text size={3.7 * u} color={colors.textSecondary} align="center">
        {t.sameTimer(n(GAME_CONFIG.secondsPerQuestion))}
      </Text>

      <View style={styles.flag}>
        <View style={[styles.flagStripe, { backgroundColor: colors.flagGreen }]} />
        <View style={[styles.flagStripe, { backgroundColor: colors.text }]} />
        <View style={[styles.flagStripe, { backgroundColor: colors.flagRed }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { alignSelf: "center", alignItems: "center", borderRadius: 24, overflow: "hidden", backgroundColor: colors.bg },
  brand: { flexDirection: "row", alignItems: "center" },
  badges: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  flag: { position: "absolute", left: 0, right: 0, bottom: 0, height: 8, flexDirection: "row" },
  flagStripe: { flex: 1 },
});
