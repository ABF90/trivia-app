import { StyleSheet, View } from "react-native";
import { Icon, Text } from "@/components/ui";
import { weekOf } from "@/lib/date";
import { colors, radius, rtl } from "@/theme";

interface WeekStripProps {
  today: string;
  playedDays: ReadonlySet<string>;
}

export function WeekStrip({ today, playedDays }: WeekStripProps) {
  return (
    <View style={styles.week} aria-label="أيام هالأسبوع">
      {weekOf(today).map(({ key, label }) => {
        const isToday = key === today;
        const played = playedDays.has(key);
        return (
          <View key={key} style={styles.day}>
            <Text size={12} weight={isToday ? "heavy" : "regular"} color={isToday ? colors.text : colors.textMuted} align="center">
              {isToday ? "اليوم" : label}
            </Text>
            <View
              style={[styles.box, played && styles.played, isToday && !played && styles.pending]}
              accessible
              aria-label={played ? "لعبت" : "ما لعبت"}
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
  week: { marginTop: 16, alignSelf: "stretch", flexDirection: rtl.row, gap: 6 },
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
