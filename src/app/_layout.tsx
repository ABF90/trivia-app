import { Cairo_400Regular, Cairo_600SemiBold, Cairo_700Bold, Cairo_800ExtraBold } from "@expo-google-fonts/cairo";
import { Lalezar_400Regular } from "@expo-google-fonts/lalezar";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { I18nManager } from "react-native";
import { colors } from "@/theme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Cairo_400Regular,
    Cairo_600SemiBold,
    Cairo_700Bold,
    Cairo_800ExtraBold,
    Lalezar_400Regular,
  });
  const ready = fontsLoaded || !!fontError;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
          // Arabic reading order: new screens enter from the left (native RTL already does this).
          animation: I18nManager.isRTL ? "default" : "slide_from_left",
        }}
      />
    </>
  );
}
