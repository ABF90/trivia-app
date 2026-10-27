import { StyleSheet, View } from "react-native";
import { Button, Logo, Spacer, Text } from "@/components/ui";
import { useI18n } from "@/i18n";
import { colors } from "@/theme";

export function InvalidChallenge({ onHome }: { onHome: () => void }) {
  const { t } = useI18n();
  return (
    <>
      <View style={styles.box}>
        <Logo size={72} />
        <Text weight="display" size={34} lineHeight={48} align="center">
          {t.brokenLinkTitle}
        </Text>
        <Text size={16} lineHeight={27} color={colors.textSecondary} align="center">
          {t.brokenLinkBody}
        </Text>
      </View>
      <Spacer />
      <Button size="lg" onPress={onHome}>
        {t.goHome}
      </Button>
    </>
  );
}

const styles = StyleSheet.create({
  box: { marginTop: "30%", alignItems: "center", gap: 10 },
});
