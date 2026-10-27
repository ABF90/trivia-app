import { useMemo } from "react";
import { StyleSheet, TextInput, useWindowDimensions, View } from "react-native";
import { BottomSheet, Button, Text } from "@/components/ui";
import { formatScore } from "@/lib/arabic";
import { colors, fonts, radius, rtl } from "@/theme";
import { buildChallengeUrl } from "../challenge/codec";
import type { GameResult } from "../game/types";
import { setPlayerName, usePlayer } from "../player";
import { ShareCard } from "./ShareCard";
import { useShare } from "./useShare";

const FALLBACK_NAME = "لاعب صفارة";

interface ShareSheetProps {
  open: boolean;
  onClose: () => void;
  result: GameResult;
  subtitle: string;
  streak?: number;
  /** "challenge" puts the challenge invite first; "score" shares the result card. */
  intent?: "score" | "challenge";
}

const STATUS_TEXT = {
  idle: "",
  shared: "تمت المشاركة",
  copied: "تم نسخ الرابط، أرسله للربع",
  error: "ما قدرنا نشارك، جرّب تنسخ الرابط",
} as const;

export function ShareSheet({ open, onClose, result, subtitle, streak, intent = "score" }: ShareSheetProps) {
  const player = usePlayer();
  const { width } = useWindowDimensions();
  const { status, share, copy } = useShare();
  const displayName = player.name.trim() || FALLBACK_NAME;
  const url = useMemo(() => buildChallengeUrl(displayName, result), [displayName, result]);

  const text =
    intent === "challenge"
      ? `${displayName} يتحداك في صفارة! جبت ${formatScore(result.score, result.total)}، تقدر تغلبني؟`
      : `صفارة · ${subtitle}\nجبت ${formatScore(result.score, result.total)}، تقدر تغلبني؟`;

  return (
    <BottomSheet open={open} onClose={onClose}>
      <Text weight="heavy" size={18} role="heading">
        {intent === "challenge" ? "تحدَّ ربعك بنفس الأسئلة" : "شارك نتيجتك"}
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
          اسمك
        </Text>
        <TextInput
          style={styles.input}
          value={player.name}
          placeholder={FALLBACK_NAME}
          placeholderTextColor={colors.textMuted}
          maxLength={24}
          onChangeText={setPlayerName}
          aria-label="اسمك"
          returnKeyType="done"
        />
      </View>

      <Button size="lg" flat icon="share" iconPosition="start" onPress={() => share({ title: "صفارة", text, url })}>
        {intent === "challenge" ? "أرسل التحدي" : "شارك"}
      </Button>
      <Button variant="secondary" icon="copy" iconPosition="start" onPress={() => copy(`${text}\n${url}`)}>
        انسخ الرابط
      </Button>
      <Text
        size={14}
        color={status === "error" ? colors.danger : colors.success}
        align="center"
        aria-live="polite"
      >
        {STATUS_TEXT[status]}
      </Text>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: rtl.row,
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
    textAlign: rtl.textStart,
    writingDirection: "rtl",
    paddingVertical: 0,
  },
});
