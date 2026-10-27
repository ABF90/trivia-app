import { useMemo } from "react";
import { StyleSheet, TextInput, useWindowDimensions, View } from "react-native";
import { BottomSheet, Button, Text } from "@/components/ui";
import { useI18n } from "@/i18n";
import { colors, fonts, radius, textStyleFor } from "@/theme";
import { buildChallengeUrl } from "../challenge/codec";
import type { GameResult } from "../game/types";
import { setPlayerName, usePlayer } from "../player";
import { ShareCard } from "./ShareCard";
import { useShare } from "./useShare";

interface ShareSheetProps {
  open: boolean;
  onClose: () => void;
  result: GameResult;
  subtitle: string;
  streak?: number;
  /** "challenge" puts the challenge invite first; "score" shares the result card. */
  intent?: "score" | "challenge";
}

export function ShareSheet({ open, onClose, result, subtitle, streak, intent = "score" }: ShareSheetProps) {
  const player = usePlayer();
  const { t, lang, score } = useI18n();
  const { width } = useWindowDimensions();
  const { status, share, copy } = useShare();
  const displayName = player.name.trim() || t.defaultPlayerName;
  const url = useMemo(() => buildChallengeUrl(displayName, result), [displayName, result]);

  const resultText = score(result.score, result.total);
  const text =
    intent === "challenge" ? t.shareChallengeText(displayName, resultText) : t.shareScoreText(subtitle, resultText);

  return (
    <BottomSheet open={open} onClose={onClose}>
      <Text weight="heavy" size={18} role="heading">
        {intent === "challenge" ? t.shareChallengeTitle : t.shareTitle}
      </Text>

      <ShareCard
        width={Math.min(260, width - 80)}
        playerName={displayName}
        subtitle={subtitle}
        score={result.score}
        total={result.total}
        results={result.answers.map((a) => a.correct)}
        streak={streak}
      />

      <View style={styles.field}>
        <Text size={14} color={colors.textMuted}>
          {t.yourName}
        </Text>
        <TextInput
          style={[styles.input, textStyleFor(lang)]}
          value={player.name}
          placeholder={t.defaultPlayerName}
          placeholderTextColor={colors.textMuted}
          maxLength={24}
          onChangeText={setPlayerName}
          aria-label={t.yourName}
          returnKeyType="done"
        />
      </View>

      <Button size="lg" flat icon="share" iconPosition="start" onPress={() => share({ title: t.appName, text, url })}>
        {intent === "challenge" ? t.sendChallengeShort : t.share}
      </Button>
      <Button variant="secondary" icon="copy" iconPosition="start" onPress={() => copy(`${text}\n${url}`)}>
        {t.copyLink}
      </Button>
      <Text
        size={14}
        color={status === "error" ? colors.danger : colors.success}
        align="center"
        aria-live="polite"
      >
        {t.shareStatus[status]}
      </Text>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 52,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    backgroundColor: colors.bg,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
  },
  input: {
    flex: 1,
    minWidth: 0,
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: 16,
    paddingVertical: 0,
  },
});
