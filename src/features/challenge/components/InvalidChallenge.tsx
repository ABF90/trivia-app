import { StyleSheet, View } from "react-native";
import { Button, Logo, Spacer, Text } from "@/components/ui";
import { colors } from "@/theme";

export function InvalidChallenge({ onHome }: { onHome: () => void }) {
  return (
    <>
      <View style={styles.box}>
        <Logo size={72} />
        <Text weight="display" size={34} lineHeight={48} align="center">
          الرابط خربان
        </Text>
        <Text size={16} lineHeight={27} color={colors.textSecondary} align="center">
          ما قدرنا نقرا التحدي. اطلب من ربعك يرسله مرة ثانية.
        </Text>
      </View>
      <Spacer />
      <Button size="lg" onPress={onHome}>
        روح للرئيسية
      </Button>
    </>
  );
}

const styles = StyleSheet.create({
  box: { marginTop: "30%", alignItems: "center", gap: 10 },
});
