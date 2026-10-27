import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from "react-native";
import { useI18n, type Language } from "@/i18n";
import { colors, fonts, textStyleFor, type FontWeight } from "@/theme";

export interface TextProps extends RNTextProps {
  weight?: FontWeight;
  size?: number;
  color?: string;
  align?: "start" | "center";
  lineHeight?: number;
  /** Language of this text when it differs from the UI (aligns and orders it correctly). */
  lang?: Language;
}

/**
 * App-wide text: Cairo by default, Lalezar with weight="display".
 * Aligns to the reading start of the current language (right in Arabic, left
 * in English), because an unset textAlign always aligns left.
 */
export function Text({ weight = "regular", size = 16, color = colors.text, align = "start", lineHeight, lang: textLang, style, ...rest }: TextProps) {
  const { lang: uiLang } = useI18n();
  const lang = textLang ?? uiLang;
  const base: TextStyle = {
    fontFamily: fonts[weight],
    fontSize: size,
    color,
    ...textStyleFor(lang, align),
    ...(lineHeight ? { lineHeight } : null),
  };
  return <RNText style={[base, style]} {...rest} />;
}
