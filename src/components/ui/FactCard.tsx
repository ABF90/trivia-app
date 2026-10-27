import { StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { colors, radius, rtl, tints } from "@/theme";
import { Icon } from "./Icon";
import { Text } from "./Text";

export function FactCard({ children, title = "تعرف؟" }: { children: string; title?: string }) {
  return (
    <Animated.View entering={FadeInDown.delay(700).duration(400)} style={styles.fact}>
      <Icon name="bulb" size={24} color={colors.primary300} style={styles.icon} />
      <View style={styles.body}>
        <Text weight="heavy" size={15} color={colors.primary200}>
          {title}
        </Text>
        <Text size={15} lineHeight={25} color={colors.textFact}>
          {children}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fact: {
    borderRadius: radius.lg,
    paddingVertical: 16,
    paddingHorizontal: 18,
    backgroundColor: tints.primary12,
    borderWidth: 1,
    borderColor: tints.primary35,
    flexDirection: rtl.row,
    gap: 12,
  },
  icon: { marginTop: 2 },
  body: { flex: 1 },
});
