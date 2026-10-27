import { Stack } from "expo-router";
import { I18nManager } from "react-native";
import { DiwaniyaProvider } from "@/features/diwaniya";
import { colors } from "@/theme";

/** Keeps the pass-the-phone session alive while moving between setup and play. */
export default function DiwaniyaLayout() {
  return (
    <DiwaniyaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
          animation: I18nManager.isRTL ? "default" : "slide_from_left",
        }}
      />
    </DiwaniyaProvider>
  );
}
