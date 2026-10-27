import { Platform, type TextStyle, type ViewStyle } from "react-native";
import type { Direction, Language } from "@/i18n";

/**
 * Layout direction comes from the chosen language, not the phone's settings:
 * Expo Go enables native RTL only for RTL device languages and ignores
 * forcesRTL. Yoga's `direction` style flips every "row" below it on iOS,
 * Android and web alike.
 */
export function directionStyle(dir: Direction): ViewStyle {
  return { direction: dir };
}

/**
 * Text alignment for the language. On native the text node itself is laid out
 * LTR so "left"/"right" stay absolute (RN swaps them inside RTL layouts);
 * writingDirection still gives Arabic the right punctuation and bidi order.
 */
export function textStyleFor(lang: Language, align: "start" | "center" = "start"): TextStyle {
  const rtl = lang === "ar";
  return {
    textAlign: align === "center" ? "center" : rtl ? "right" : "left",
    writingDirection: rtl ? "rtl" : "ltr",
    ...(Platform.OS === "web" ? null : { direction: "ltr" }),
  };
}
