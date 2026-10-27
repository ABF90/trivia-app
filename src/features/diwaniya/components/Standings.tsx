import { StyleSheet, View } from "react-native";
import { Avatar, avatarColorAt, Text } from "@/components/ui";
import { useI18n } from "@/i18n";
import { colors } from "@/theme";
import type { selectStandings } from "../model";

interface StandingsProps {
  standings: ReturnType<typeof selectStandings>;
  activeIndex?: number;
}

export function Standings({ standings, activeIndex }: StandingsProps) {
  const { t, n } = useI18n();
  return (
    <View style={styles.list} aria-label={t.standings}>
      {standings.map(({ player, index, name, rank }, i) => {
        const active = index === activeIndex;
        return (
          <View key={player.id} style={[styles.row, i > 0 && styles.divider]}>
            <Text weight="display" size={18} color={rank === 1 ? colors.warning : colors.textMuted} align="center" style={styles.rank}>
              {n(rank)}
            </Text>
            <Avatar label={name.charAt(0)} color={avatarColorAt(index)} size={30} />
            <Text
              weight={active ? "heavy" : "bold"}
              size={16}
              color={active ? colors.success : colors.text}
              numberOfLines={1}
              style={styles.name}
            >
              {active ? t.theirTurn(name) : name}
            </Text>
            <Text weight="display" size={22} lineHeight={32}>
              {n(player.score)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { backgroundColor: colors.surface, borderRadius: 22, paddingVertical: 8, paddingHorizontal: 16 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 52 },
  divider: { borderTopWidth: 1, borderTopColor: colors.border },
  rank: { width: 18 },
  name: { flex: 1, minWidth: 0 },
});
