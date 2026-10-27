import { ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AnswerOption, Logo, Text } from "@/components/ui";
import { STRINGS } from "@/i18n";
import { colors, directionStyle, radius } from "@/theme";

const SWATCHES = [
  { name: "ليل الملعب", color: colors.bg, meta: "#0A1020 · خلفية" },
  { name: "الكروت", color: colors.surface, meta: "#16213A · سطوح" },
  { name: "الأزرق", color: colors.primary, meta: "#1F6BFF · أساسي" },
  { name: "النص", color: colors.text, meta: "#F4F6FA" },
  { name: "صح ✓", color: colors.success, meta: "#12C7A5" },
  { name: "غلط ✕", color: colors.danger, meta: "#FF4D6D" },
  { name: "آخر ٥ ثواني", color: colors.warning, meta: "#FFB020" },
];

/** Brand sheet: logo, colours, type and answer states (wide layout on tablets/web). */
export default function BrandRoute() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const wide = width >= 900;
  return (
    <ScrollView
      style={[styles.root, directionStyle("rtl")]}
      contentContainerStyle={[styles.page, wide && styles.pageWide, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}
    >
      <View style={[styles.identity, wide && styles.identityWide]}>
        <Logo size={160} />
        <Text weight="display" size={72} lineHeight={96} align="center">
          صفارة
        </Text>
        <Text size={13} lineHeight={22} color={colors.textMuted} align="center">
          {STRINGS.ar.credit}
        </Text>
        <Text size={14} lineHeight={24} color={colors.textTertiary} align="center">
          صفارة حكم بيضاء على الأزرق، وشريط صغير بألوان العلم. بدون شعارات أندية أو شعار الدولة.
        </Text>
      </View>

      <View style={styles.sections}>
        <Text weight="heavy" size={18} color={colors.textTertiary}>
          الألوان
        </Text>
        <View style={styles.swatches}>
          {SWATCHES.map((s) => (
            <View key={s.name} style={styles.swatch}>
              <View style={[styles.chip, { backgroundColor: s.color }]} />
              <Text weight="bold" size={14}>
                {s.name}
              </Text>
              <Text size={12} color={colors.textTertiary}>
                {s.meta}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.typeCard}>
          <Text size={13} color={colors.textTertiary}>
            Lalezar · العناوين والأرقام
          </Text>
          <Text weight="display" size={44} lineHeight={60}>
            كفو! ٤ / ٥
          </Text>
        </View>
        <View style={styles.typeCard}>
          <Text size={13} color={colors.textTertiary}>
            Cairo · الأسئلة والأزرار
          </Text>
          <Text weight="bold" size={22} lineHeight={33}>
            في أي سنة شارك الأزرق في كأس العالم؟
          </Text>
          <Text size={16} color={colors.textSecondary}>
            نص عادي ١٦، والأسئلة ٢٢ عريض
          </Text>
        </View>

        <Text weight="heavy" size={18} color={colors.textTertiary}>
          حالات زر الجواب
        </Text>
        <View style={styles.states}>
          <AnswerOption label="عادي" compact animateIn={false} />
          <AnswerOption label="صح" state="correct" compact animateIn={false} />
          <AnswerOption label="غلط" state="wrong" compact animateIn={false} />
          <AnswerOption label="انحذف (٥٠/٥٠)" state="removed" compact animateIn={false} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  page: { width: "100%", maxWidth: 1200, alignSelf: "center", paddingHorizontal: 20, gap: 24 },
  pageWide: { flexDirection: "row", alignItems: "flex-start", gap: 40 },
  identity: { backgroundColor: colors.surface, borderRadius: radius.xxl, padding: 32, alignItems: "center", gap: 12 },
  identityWide: { width: 340 },
  sections: { flex: 1, gap: 16 },
  swatches: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  swatch: { width: 110, gap: 6 },
  chip: { height: 72, borderRadius: radius.md, borderWidth: 1, borderColor: colors.borderStrong },
  typeCard: { backgroundColor: colors.surface, borderRadius: radius.lg, paddingVertical: 18, paddingHorizontal: 22, gap: 4 },
  states: { gap: 10 },
});
