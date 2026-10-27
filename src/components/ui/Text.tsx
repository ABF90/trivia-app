import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from "react-native";
import { colors, fonts, rtl, type FontWeight } from "@/theme";

export interface TextProps extends RNTextProps {
  weight?: FontWeight;
  size?: number;
  color?: string;
  align?: "start" | "center";
  lineHeight?: number;
}

/**
 * App-wide text: Cairo by default, Lalezar with weight="display".
 * Always right-aligned/RTL, because an unset textAlign aligns left even in RTL.
 */
export function Text({ weight = "regular", size = 16, color = colors.text, align = "start", lineHeight, style, ...rest }: TextProps) {
  const base: TextStyle = {
    fontFamily: fonts[weight],
    fontSize: size,
    color,
    textAlign: align === "center" ? "center" : rtl.textStart,
    writingDirection: "rtl",
    ...(lineHeight ? { lineHeight } : null),
  };
  return <RNText style={[base, style]} {...rest} />;
}
