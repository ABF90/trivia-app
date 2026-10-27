import { StyleSheet, View } from "react-native";
import { Button, Logo, Screen, Spacer, Text } from "@/components/ui";
import { useI18n } from "@/i18n";
import { colors } from "@/theme";

export default function NotFoundRoute() {
  const { t } = useI18n();
  return (
    <Screen background="glowTop">
      <View style={styles.box}>
        <Logo size={80} />
        <Text weight="display" size={40} lineHeight={56} align="center">
          {t.notFoundTitle}
        </Text>
        <Text size={16} color={colors.textSecondary} align="center">
          {t.notFoundBody}
        </Text>
      </View>
      <Spacer />
      <Button size="lg" href="/">
        {t.goHome}
      </Button>
    </Screen>
  );
}

const styles = StyleSheet.create({
  box: { marginTop: "35%", alignItems: "center", gap: 12 },
});
