import type { ReactNode } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import Animated, { SlideInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, layout, tints } from "@/theme";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

/** Modal sheet: dimmed backdrop closes it, Android back closes it, content scrolls if tall. */
export function BottomSheet({ open, onClose, children }: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={open} transparent animationType="fade" statusBarTranslucent navigationBarTranslucent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} aria-label="إغلاق" role="button" />
        <Animated.View
          entering={SlideInDown.duration(300)}
          style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 12) + 16 }]}
          aria-modal
        >
          <View style={styles.handle} />
          <ScrollView contentContainerStyle={styles.content} bounces={false} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end", alignItems: "center", backgroundColor: tints.scrim },
  sheet: {
    width: "100%",
    maxWidth: layout.maxWidth,
    maxHeight: "92%",
    backgroundColor: colors.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 14,
    paddingHorizontal: 20,
  },
  handle: { alignSelf: "center", width: 44, height: 5, borderRadius: 3, backgroundColor: colors.borderStrong, marginBottom: 10 },
  content: { alignItems: "stretch", gap: 10 },
});
