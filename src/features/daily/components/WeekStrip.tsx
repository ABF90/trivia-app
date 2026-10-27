import { StyleSheet, View } from "react-native";
import { Icon, Text } from "@/components/ui";
import { weekOf } from "@/lib/date";
import { useI18n } from "@/i18n";
import { colors, radius } from "@/theme";

interface WeekStripProps {
  today: string;
  playedDays: ReadonlySet<string>;
}

export function WeekStrip({ today, playedDays }: WeekStripProps) {
  const { t } = useI18n();
  return (
    <View style={styles.week} aria-label={t.thisWeek}>
      {weekOf(today).map(({ key, weekday }) => {
        const isToday = key === today;
        const played = playedDays.has(key);
        return (
          <View key={key} style={styles.day}>
            <Text size={12} weight={isToday ? "heavy" : "regular"} color={isToday ? colors.text : colors.textMuted} align="center">
              {isToday ? t.today : t.weekdays[weekday]}
            </Text>
            <View
              style={[styles.box, played && styles.played, isToday && !played && styles.pending]}
              accessible
              aria-label={played ? t.played : t.notPlayed}
            >
              {played && <Icon name="check" size={16} color={colors.onAccent} strokeWidth={3} />}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  week: { marginTop: 16, alignSelf: "stretch", flexDirection: "row", gap: 6 },
  day: { flex: 1, alignItems: "center", gap: 6 },
  box: {
    width: "100%",
    maxWidth: 34,
    aspectRatio: 1,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  played: { backgroundColor: colors.warning },
  pending: { backgroundColor: "transparent", borderWidth: 2, borderStyle: "dashed", borderColor: colors.warning },
});
