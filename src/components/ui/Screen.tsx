import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, layout, rtl } from "@/theme";
import { IconButton } from "./IconButton";
import { Text } from "./Text";
import type { Href } from "expo-router";

type Background = "plain" | "glowTop" | "glowCenter" | "glowTeal";

const GRADIENTS: Record<Exclude<Background, "plain">, { colors: [string, string, ...string[]]; locations: [number, number, ...number[]] }> = {
  glowTop: { colors: [colors.glow, colors.bg], locations: [0, 0.6] },
  glowCenter: { colors: [colors.bg, colors.glow, colors.bg], locations: [0, 0.3, 0.7] },
  glowTeal: { colors: [colors.bg, colors.glowTeal, colors.bg], locations: [0, 0.25, 0.65] },
};

interface ScreenProps {
  children: ReactNode;
  background?: Background;
  /** Rendered above the scroll content (confetti, etc). */
  overlay?: ReactNode;
}

/**
 * Mobile-first page: safe-area aware, scrolls on short phones, and caps its
 * width on tablets/web. Use <Spacer /> to push content to the bottom.
 */
export function Screen({ children, background = "plain", overlay }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const gradient = background === "plain" ? null : GRADIENTS[background];
  return (
    <View style={styles.root}>
      {gradient && <LinearGradient colors={gradient.colors} locations={gradient.locations} style={StyleSheet.absoluteFill} />}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingTop: Math.max(insets.top, 12) + 12, paddingBottom: Math.max(insets.bottom, 12) + 16 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {children}
      </ScrollView>
      {overlay}
    </View>
  );
}

/** Pushes following content to the bottom of the screen. */
export function Spacer() {
  return <View style={styles.spacer} />;
}

interface ScreenHeaderProps {
  title?: string;
  backHref?: Href;
  backLabel?: string;
  onBack?: () => void;
}

export function ScreenHeader({ title, backHref, backLabel = "رجوع", onBack }: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      {(backHref || onBack) && <IconButton icon="chevronBack" href={backHref} onPress={onBack} label={backLabel} />}
      {title && (
        <Text weight="heavy" size={20} role="heading">
          {title}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: {
    flexGrow: 1,
    width: "100%",
    maxWidth: layout.maxWidth,
    alignSelf: "center",
    paddingHorizontal: layout.gutter,
  },
  spacer: { flexGrow: 1, minHeight: 24 },
  header: { flexDirection: rtl.row, alignItems: "center", gap: 12 },
});
