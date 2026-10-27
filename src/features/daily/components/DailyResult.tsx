import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Icon, ScreenHeader, Spacer, Text } from "@/components/ui";
import { formatDays, toArabicDigits } from "@/lib/arabic";
import { colors, radius, rtl } from "@/theme";
import { getHeadline, getTitle } from "../../game/model/titles";
import type { GameResult } from "../../game/types";
import { ShareSheet } from "../../share";
import { AnswerReview } from "./AnswerReview";
import { NextDailyCountdown } from "./NextDailyCountdown";

interface DailyResultProps {
  dailyNumber: number;
  result: GameResult;
  streak: number;
}

export function DailyResult({ dailyNumber, result, streak }: DailyResultProps) {
  const [sharing, setSharing] = useState(false);
  const { score, total } = result;
  const label = `تحدي اليوم #${toArabicDigits(dailyNumber)}`;

  return (
    <>
      <ScreenHeader title={label} backHref="/" backLabel="الرئيسية" />

      <View style={styles.summary} accessible aria-label={`نتيجتك ${toArabicDigits(score)} من ${toArabicDigits(total)}`}>
        <View style={styles.info}>
          <Text weight="display" size={34} lineHeight={46}>
            {getHeadline(score, total)}
          </Text>
          <View style={styles.meta}>
            <Icon name="badge" size={16} color={colors.warning} />
            <Text weight="heavy" size={14} color={colors.warning}>
              {getTitle(score, total)}
              {streak > 0 ? ` · سلسلة ${formatDays(streak)}` : ""}
            </Text>
          </View>
        </View>
        <Text weight="display" size={52} lineHeight={70}>
          <Text weight="display" size={52} color={colors.success}>
            {toArabicDigits(score)}
          </Text>
          <Text weight="display" size={52} color={colors.textMuted}>
            {" / "}
          </Text>
          {toArabicDigits(total)}
        </Text>
      </View>

      <Text weight="heavy" size={15} color={colors.textTertiary} style={styles.reviewTitle}>
        راجع أجوبتك
      </Text>
      <AnswerReview result={result} />

      <Spacer />

      <NextDailyCountdown />
      <View style={styles.actions}>
        <Button size="lg" icon="share" iconPosition="start" onPress={() => setSharing(true)}>
          شارك نتيجتك بالقروب
        </Button>
        <Button variant="ghost" size="sm" href="/">
          الرئيسية
        </Button>
      </View>

      <ShareSheet
        open={sharing}
        onClose={() => setSharing(false)}
        result={result}
        subtitle={`${label} · كل الأقسام`}
        streak={streak}
      />
    </>
  );
}

const styles = StyleSheet.create({
  summary: {
    marginTop: 20,
    borderRadius: radius.xl,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: colors.bgDeep,
    borderWidth: 2,
    borderColor: colors.border,
    flexDirection: rtl.row,
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  info: { gap: 2, flexShrink: 1 },
  meta: { flexDirection: rtl.row, alignItems: "center", gap: 6 },
  reviewTitle: { marginTop: 22, marginBottom: 10 },
  actions: { gap: 10 },
});
