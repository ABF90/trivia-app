import { useRouter, type Href } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { Button, Chip, ChipRow, Icon, Logo, Screen, Spacer, Text } from "@/components/ui";
import { ALL_CATEGORIES_LABEL, CATEGORIES } from "@/data/categories";
import { formatDays, formatScore, toArabicDigits } from "@/lib/arabic";
import { toDateKey } from "@/lib/date";
import { colors, radius, rtl, tints } from "@/theme";
import { getDailyNumber } from "../daily/daily";
import { getTitle, type CategoryId } from "../game";
import { selectDailyEntry, selectStreak, usePlayer, type PlayerData } from "../player";

function playHref(category: CategoryId | null, intent?: "challenge"): Href {
  return {
    pathname: "/play",
    params: { ...(category ? { category } : {}), ...(intent ? { intent } : {}) },
  };
}

function DailyCard({ player }: { player: PlayerData }) {
  const router = useRouter();
  const today = toDateKey(new Date());
  const entry = selectDailyEntry(player, today);
  const streak = selectStreak(player, today);
  let meta = entry ? `لعبته اليوم · ${formatScore(entry.score, entry.total)}` : "ما لعبته اليوم";
  if (streak > 0) meta += ` · سلسلتك ${formatDays(streak)}`;

  return (
    <Animated.View entering={FadeInDown.delay(450).duration(500)}>
      <Pressable
        role="button"
        onPress={() => router.push("/daily")}
        style={({ pressed }) => [styles.daily, pressed && styles.dailyPressed]}
      >
        <View style={styles.dailyIcon}>
          <Icon name="flame" size={28} color={colors.warning} />
        </View>
        <View style={styles.dailyText}>
          <Text weight="heavy" size={17}>
            {`تحدي اليوم #${toArabicDigits(getDailyNumber(today))}`}
          </Text>
          <Text size={14} color={colors.textTertiary}>
            {meta}
          </Text>
        </View>
        <Icon name="chevronForward" color={colors.textTertiary} />
      </Pressable>
    </Animated.View>
  );
}

export function HomeScreen() {
  const player = usePlayer();
  const [category, setCategory] = useState<CategoryId | null>(null);

  return (
    <Screen background="glowTop">
      <View style={styles.hero}>
        <Animated.View entering={ZoomIn.duration(700).springify()}>
          <Logo size={112} />
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.name}>
          <Text weight="display" size={64} lineHeight={86} align="center" role="heading">
            صفارة
          </Text>
          <Text weight="bold" size={13} color={colors.textTertiary} align="center" style={styles.latin}>
            SFARA
          </Text>
          <Text size={16} color={colors.textSecondary} align="center" style={styles.tagline}>
            اختبر معلوماتك في الرياضة الكويتية
          </Text>
        </Animated.View>
      </View>

      <DailyCard player={player} />

      <Animated.View entering={FadeInDown.delay(450).duration(500)} style={styles.categories}>
        <Text weight="heavy" size={14} color={colors.textTertiary}>
          لعب حر · اختر القسم
        </Text>
        <ChipRow>
          <Chip selected={category === null} onPress={() => setCategory(null)}>
            {ALL_CATEGORIES_LABEL}
          </Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c.id} selected={category === c.id} onPress={() => setCategory(c.id)}>
              {c.label}
            </Chip>
          ))}
        </ChipRow>
      </Animated.View>

      <Spacer />

      <View style={styles.footer}>
        <Text size={14} color={colors.textTertiary} align="center">
          {player.best ? (
            <>
              {"لقبك: "}
              <Text weight="bold" size={14} color={colors.warning}>
                {getTitle(player.best.score, player.best.total)}
              </Text>
              {" · أفضل نتيجة "}
              <Text weight="bold" size={14}>
                {formatScore(player.best.score, player.best.total)}
              </Text>
            </>
          ) : (
            "العب أول جولة وخذ لقبك"
          )}
        </Text>
        <Button size="lg" href={playHref(category)} icon="chevronForward" breathe>
          لعب حر
        </Button>
        <View style={styles.modes}>
          <Button variant="secondary" href={playHref(category, "challenge")} icon="swords" iconPosition="start" style={styles.mode}>
            تحدَّ ربعك
          </Button>
          <Button variant="secondary" href="/diwaniya" icon="users" iconPosition="start" style={styles.mode}>
            وضع الديوانية
          </Button>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: "center", gap: 14, paddingTop: 24 },
  name: { alignItems: "center" },
  latin: { letterSpacing: 6, writingDirection: "ltr" },
  tagline: { marginTop: 8 },
  daily: {
    marginTop: 36,
    flexDirection: rtl.row,
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dailyPressed: { borderColor: colors.borderStrong },
  dailyIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: tints.warning14,
    alignItems: "center",
    justifyContent: "center",
  },
  dailyText: { flex: 1, minWidth: 0, gap: 2 },
  categories: { marginTop: 24, gap: 10 },
  footer: { gap: 12 },
  modes: { flexDirection: rtl.row, gap: 12 },
  mode: { flex: 1 },
});
