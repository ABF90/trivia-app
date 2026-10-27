import { useRouter, type Href } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { Button, Chip, ChipGroup, Icon, Logo, Screen, SegmentedControl, Spacer, Text } from "@/components/ui";
import { CATEGORIES, MAX_CATEGORIES } from "@/data/categories";
import { useI18n } from "@/i18n";
import { haptics } from "@/lib/platform/haptics";
import { toDateKey } from "@/lib/date";
import { colors, radius, tints } from "@/theme";
import { getDailyNumber } from "../daily/daily";
import { titleText, type CategoryId, type DifficultyFilter } from "../game";
import { selectDailyEntry, selectStreak, setLanguage, setPreferences, usePlayer, type PlayerData } from "../player";

const DIFFICULTIES: readonly DifficultyFilter[] = ["easy", "medium", "hard", "mixed"];

function playHref(categories: CategoryId[], difficulty: DifficultyFilter, intent?: "challenge"): Href {
  return {
    pathname: "/play",
    params: {
      ...(categories.length ? { categories: categories.join(",") } : {}),
      difficulty,
      ...(intent ? { intent } : {}),
    },
  };
}

function LanguageToggle() {
  const { t, lang } = useI18n();
  return (
    <Pressable
      role="button"
      aria-label={t.languageToggleLabel}
      hitSlop={8}
      onPress={() => setLanguage(lang === "ar" ? "en" : "ar")}
      style={({ pressed }) => [styles.langToggle, pressed && styles.langPressed]}
    >
      <Text weight="heavy" size={14} color={colors.primary200}>
        {t.languageToggle}
      </Text>
    </Pressable>
  );
}

function DailyCard({ player }: { player: PlayerData }) {
  const router = useRouter();
  const { t, n, score, days } = useI18n();
  const today = toDateKey(new Date());
  const entry = selectDailyEntry(player, today);
  const streak = selectStreak(player, today);
  let meta = entry ? t.dailyPlayed(score(entry.score, entry.total)) : t.dailyNotPlayed;
  if (streak > 0) meta += t.dailyStreak(days(streak));

  return (
    <Animated.View entering={FadeInDown.delay(400).duration(500)}>
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
            {t.dailyTitle(n(getDailyNumber(today)))}
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
  const { t, n, pick, score } = useI18n();
  const [categories, setCategories] = useState<CategoryId[]>(player.preferences.categories);
  const [difficulty, setDifficulty] = useState<DifficultyFilter>(player.preferences.difficulty);
  const [limitHit, setLimitHit] = useState(false);
  const full = categories.length >= MAX_CATEGORIES;

  const save = (next: { categories?: CategoryId[]; difficulty?: DifficultyFilter }) => {
    const prefs = { categories: next.categories ?? categories, difficulty: next.difficulty ?? difficulty };
    setCategories(prefs.categories);
    setDifficulty(prefs.difficulty);
    setPreferences(prefs);
  };

  const toggleCategory = (id: CategoryId) => {
    if (categories.includes(id)) {
      setLimitHit(false);
      save({ categories: categories.filter((c) => c !== id) });
    } else if (full) {
      setLimitHit(true);
      void haptics.error();
    } else {
      save({ categories: [...categories, id] });
    }
  };

  return (
    <Screen background="glowTop">
      <View style={styles.topBar}>
        <LanguageToggle />
      </View>

      <View style={styles.hero}>
        <Animated.View entering={ZoomIn.duration(700).springify()}>
          <Logo size={96} />
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.name}>
          <Text weight="display" size={56} lineHeight={76} align="center" role="heading">
            {t.appName}
          </Text>
          <Text size={15} color={colors.textSecondary} align="center">
            {t.tagline}
          </Text>
        </Animated.View>
      </View>

      <DailyCard player={player} />

      <Animated.View entering={FadeInDown.delay(450).duration(500)} style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text weight="heavy" size={14} color={limitHit ? colors.warning : colors.textTertiary} aria-live="polite">
            {limitHit ? t.maxCategories : t.pickCategories}
          </Text>
          {categories.length > 0 && (
            <Text weight="bold" size={13} color={colors.primary300}>
              {t.pickedCount(n(categories.length))}
            </Text>
          )}
        </View>
        <ChipGroup label={t.pickCategories}>
          <Chip selected={categories.length === 0} onPress={() => {
              setLimitHit(false);
              save({ categories: [] });
            }}>
            {t.allCategories}
          </Chip>
          {CATEGORIES.map((c) => {
            const selected = categories.includes(c.id);
            return (
              <Chip key={c.id} selected={selected} dimmed={full && !selected} onPress={() => toggleCategory(c.id)}>
                {pick(c.label)}
              </Chip>
            );
          })}
        </ChipGroup>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(500).duration(500)} style={styles.section}>
        <SegmentedControl
          legend={t.difficulty}
          options={DIFFICULTIES}
          value={difficulty}
          onChange={(d) => save({ difficulty: d })}
          format={(d) => t.difficultyLevels[d]}
          variant="text"
        />
      </Animated.View>

      <Spacer />

      <View style={styles.footer}>
        <Text size={14} color={colors.textTertiary} align="center">
          {player.best ? (
            <>
              {t.yourTitle}
              <Text weight="bold" size={14} color={colors.warning}>
                {titleText(t, player.best.score, player.best.total)}
              </Text>
              {t.bestScore}
              <Text weight="bold" size={14}>
                {score(player.best.score, player.best.total)}
              </Text>
            </>
          ) : (
            t.firstRound
          )}
        </Text>
        <Button size="lg" href={playHref(categories, difficulty)} icon="chevronForward" breathe>
          {t.freePlay}
        </Button>
        <View style={styles.modes}>
          <Button
            variant="secondary"
            href={playHref(categories, difficulty, "challenge")}
            icon="swords"
            iconPosition="start"
            style={styles.mode}
          >
            {t.challengeFriends}
          </Button>
          <Button variant="secondary" href="/diwaniya" icon="users" iconPosition="start" style={styles.mode}>
            {t.diwaniya}
          </Button>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: "row", justifyContent: "flex-end" },
  langToggle: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: tints.primary35,
    backgroundColor: tints.primary12,
    justifyContent: "center",
  },
  langPressed: { backgroundColor: tints.primary20 },
  hero: { alignItems: "center", gap: 10 },
  name: { alignItems: "center" },
  daily: {
    marginTop: 24,
    flexDirection: "row",
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
  section: { marginTop: 22, gap: 10 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  footer: { gap: 12 },
  modes: { flexDirection: "row", gap: 12 },
  mode: { flex: 1 },
});
