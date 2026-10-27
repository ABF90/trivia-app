import { StyleSheet, View } from "react-native";
import { Button, Logo, Screen, Spacer, Text } from "@/components/ui";
import { colors } from "@/theme";

export default function NotFoundRoute() {
  return (
    <Screen background="glowTop">
      <View style={styles.box}>
        <Logo size={80} />
        <Text weight="display" size={40} lineHeight={56} align="center">
          تسلل!
        </Text>
        <Text size={16} color={colors.textSecondary} align="center">
          هالصفحة مو موجودة.
        </Text>
      </View>
      <Spacer />
      <Button size="lg" href="/">
        روح للرئيسية
      </Button>
    </Screen>
  );
}

const styles = StyleSheet.create({
  box: { marginTop: "35%", alignItems: "center", gap: 12 },
});
