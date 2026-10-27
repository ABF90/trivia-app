import { StyleSheet, View } from "react-native";
import { colors, rtl } from "@/theme";
import { Icon } from "./Icon";

interface ResultDotsProps {
  results: boolean[];
  size?: number;
  showIcons?: boolean;
}

export function ResultDots({ results, size = 32, showIcons = true }: ResultDotsProps) {
  const label = results.map((ok) => (ok ? "صح" : "غلط")).join("، ");
  return (
    <View style={styles.row} accessible accessibilityLabel={label}>
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
  row: { flexDirection: rtl.row, flexWrap: "wrap", justifyContent: "center", gap: 8 },
  dot: { borderRadius: 10, alignItems: "center", justifyContent: "center" },
});
