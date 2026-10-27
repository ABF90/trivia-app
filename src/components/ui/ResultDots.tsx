import { StyleSheet, View } from "react-native";
import { useI18n } from "@/i18n";
import { colors } from "@/theme";
import { Icon } from "./Icon";

interface ResultDotsProps {
  results: boolean[];
  size?: number;
  showIcons?: boolean;
}

export function ResultDots({ results, size = 32, showIcons = true }: ResultDotsProps) {
  const { t } = useI18n();
  const label = results.map((ok) => (ok ? t.correct : t.wrong)).join(t.listSeparator);
  return (
    <View style={styles.row} accessible aria-label={label}>
      {results.map((ok, i) => (
        <View
          key={i}
          style={[styles.dot, { width: size, height: size, backgroundColor: ok ? colors.success : colors.danger }]}
        >
          {showIcons && <Icon name={ok ? "check" : "close"} size={size * 0.56} color={colors.onAccent} strokeWidth={3} />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8 },
  dot: { borderRadius: 10, alignItems: "center", justifyContent: "center" },
});
