import { StyleSheet, View } from "react-native";
import { BottomSheet, Button, Icon, Text } from "@/components/ui";
import { colors, radius, tints } from "@/theme";

interface ExitConfirmSheetProps {
  open: boolean;
  onStay: () => void;
  onLeave: () => void;
}

export function ExitConfirmSheet({ open, onStay, onLeave }: ExitConfirmSheetProps) {
  return (
    <BottomSheet open={open} onClose={onStay}>
      <View style={styles.icon}>
        <Icon name="exit" size={30} color={colors.danger} />
      </View>
      <Text weight="display" size={34} lineHeight={48} align="center" role="heading">
        تبي تطلع؟
      </Text>
      <Text size={16} lineHeight={27} color={colors.textSecondary} align="center">
        بتضيع نقاط هالجولة، والتايمر واقف لين تقرر.
      </Text>
      <View style={styles.actions}>
        <Button size="lg" flat onPress={onStay}>
          كمّل اللعب
        </Button>
        <Button variant="danger" onPress={onLeave}>
          اطلع
        </Button>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  icon: {
    alignSelf: "center",
    marginTop: 14,
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    backgroundColor: tints.danger14,
    alignItems: "center",
    justifyContent: "center",
  },
  actions: { marginTop: 16, gap: 10 },
});
