import { StyleSheet, View } from "react-native";
import { IconButton, ProgressSegments, ScorePill, Text, type SegmentState } from "@/components/ui";
import { useI18n } from "@/i18n";


interface GameHeaderProps {
  label: string;
  segments: SegmentState[];
  score: number;
  onExit?: () => void;
}

export function GameHeader({ label, segments, score, onExit }: GameHeaderProps) {
  const { t } = useI18n();
  return (
    <View style={styles.header}>
      {onExit && <IconButton icon="close" label={t.exit} onPress={onExit} />}
      <View style={styles.progress}>
        <Text weight="heavy" size={15} numberOfLines={1}>
          {label}
        </Text>
        <ProgressSegments segments={segments} />
      </View>
      <ScorePill points={score} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: 12 },
  progress: { flex: 1, minWidth: 0, gap: 6 },
});
