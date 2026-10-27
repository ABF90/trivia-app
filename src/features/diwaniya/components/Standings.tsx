import { StyleSheet, View } from "react-native";
import { Avatar, avatarColorAt, Text } from "@/components/ui";
import { toArabicDigits } from "@/lib/arabic";
import { colors, rtl } from "@/theme";
import type { selectStandings } from "../model";

interface StandingsProps {
  standings: ReturnType<typeof selectStandings>;
  activeIndex?: number;
}

export function Standings({ standings, activeIndex }: StandingsProps) {
  return (
    <View style={styles.list} aria-label="ترتيب اللاعبين">
      {standings.map(({ player, index, name, rank }, i) => {
        const active = index === activeIndex;
        return (
          <View key={player.id} style={[styles.row, i > 0 && styles.divider]}>
            <Text weight="display" size={18} color={rank === 1 ? colors.warning : colors.textMuted} align="center" style={styles.rank}>
              {toArabicDigits(rank)}
            </Text>
            <Avatar label={name.charAt(0)} color={avatarColorAt(index)} size={30} />
            <Text
              weight={active ? "heavy" : "bold"}
              size={16}
              color={active ? colors.success : colors.text}
              numberOfLines={1}
              style={styles.name}
            >
              {active ? `${name} · دوره` : name}
            </Text>
            <Text weight="display" size={22} lineHeight={32}>
              {toArabicDigits(player.score)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { backgroundColor: colors.surface, borderRadius: 22, paddingVertical: 8, paddingHorizontal: 16 },
  row: { flexDirection: rtl.row, alignItems: "center", gap: 12, minHeight: 52 },
  divider: { borderTopWidth: 1, borderTopColor: colors.border },
  rank: { width: 18 },
  name: { flex: 1, minWidth: 0 },
});
