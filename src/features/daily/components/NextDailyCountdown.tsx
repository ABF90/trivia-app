import { useNow } from "@/hooks/useNow";
import { Text } from "@/components/ui";
import { formatDuration, msUntilMidnight } from "@/lib/date";
import { useI18n } from "@/i18n";
import { colors } from "@/theme";

export function NextDailyCountdown() {
  const now = useNow(1000);
  const { t, n } = useI18n();
  const time = now ? n(formatDuration(msUntilMidnight(now))) : "--:--:--";
  return (
    <Text size={14} color={colors.textMuted} align="center" style={{ marginBottom: 12 }}>
      {t.nextDailyIn}
      <Text weight="display" size={18} style={{ writingDirection: "ltr" }}>
        {time}
      </Text>
    </Text>
  );
}
