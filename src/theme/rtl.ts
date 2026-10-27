import { I18nManager } from "react-native";

/**
 * The app is Arabic-only, so it must read right-to-left on every phone.
 * Expo Go turns on native RTL only when the device language is RTL (and ignores
 * forcesRTL), so layout direction is resolved here instead of relying on it:
 * - native RTL on  → "row" already starts on the right
 * - native RTL off → "row-reverse" puts the first child on the right
 * Per the Expo docs, textAlign "left" means start in RTL and "right" means end.
 */
const nativeRTL = I18nManager.isRTL;

export const rtl = {
  row: nativeRTL ? "row" : "row-reverse",
  /** Align text to the reading start (the right edge). */
  textStart: nativeRTL ? "left" : "right",
  /** Cross-axis alignment towards the reading start / end in a column. */
  alignStart: nativeRTL ? "flex-start" : "flex-end",
  alignEnd: nativeRTL ? "flex-end" : "flex-start",
} as const;
