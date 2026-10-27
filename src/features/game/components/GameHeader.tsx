import { StyleSheet, View } from "react-native";
import { IconButton, ProgressSegments, ScorePill, Text, type SegmentState } from "@/components/ui";
import { rtl } from "@/theme";

interface GameHeaderProps {
  label: string;
  segments: SegmentState[];
  score: number;
  onExit?: () => void;
}

export function GameHeader({ label, segments, score, onExit }: GameHeaderProps) {
  return (
    <View style={styles.header}>
      {onExit && <IconButton icon="close" label="خروج" onPress={onExit} />}
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
  header: { flexDirection: rtl.row, alignItems: "center", gap: 12 },
  progress: { flex: 1, minWidth: 0, gap: 6 },
});
