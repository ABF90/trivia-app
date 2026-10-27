import { useNow } from "@/hooks/useNow";
import { Text } from "@/components/ui";
import { toArabicDigits } from "@/lib/arabic";
import { formatDuration, msUntilMidnight } from "@/lib/date";
import { colors } from "@/theme";

export function NextDailyCountdown() {
  const now = useNow(1000);
  const time = now ? toArabicDigits(formatDuration(msUntilMidnight(now))) : "--:--:--";
  return (
    <Text size={14} color={colors.textMuted} align="center" style={{ marginBottom: 12 }}>
      التحدي الجاي بعد{" "}
      <Text weight="display" size={18} style={{ writingDirection: "ltr" }}>
        {time}
      </Text>
    </Text>
  );
}
