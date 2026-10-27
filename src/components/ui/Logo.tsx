import { View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { colors } from "@/theme";

interface LogoProps {
  size?: number;
  /** "full" adds the sound waves and flag ribbon; "mark" is the bare whistle. */
  variant?: "full" | "mark";
  decorative?: boolean;
}

export function Logo({ size = 112, variant = "full", decorative = false }: LogoProps) {
  const full = variant === "full";
  return (
    <View
      accessible={!decorative}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : "شعار صفارة"}
    >
      <Svg width={size} height={size} viewBox="0 0 120 120">
        <Rect width="120" height="120" rx="28" fill={colors.primary} />
        {full && (
          <>
            <Path d="M22 38 a16 16 0 0 1 14 -14" fill="none" stroke={colors.white} strokeWidth="4" strokeLinecap="round" />
            <Path d="M14 34 a26 26 0 0 1 20 -20" fill="none" stroke={colors.white} strokeWidth="4" strokeLinecap="round" opacity={0.6} />
          </>
        )}
        <Circle cx="54" cy="66" r="26" fill={colors.white} />
        <Rect x="62" y="40" width="40" height="16" rx="5" fill={colors.white} />
        <Circle cx="54" cy="66" r="9" fill={colors.bg} />
        {full && (
          <>
            <Rect y="106" width="120" height="14" fill={colors.flagGreen} />
            <Rect y="110.6" width="120" height="4.7" fill={colors.white} />
            <Rect y="115.3" width="120" height="4.7" fill={colors.flagRed} />
            <Path d="M0 106 L16 106 L10 120 L0 120 Z" fill={colors.black} />
          </>
        )}
      </Svg>
    </View>
  );
}
