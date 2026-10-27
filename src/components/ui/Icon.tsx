import type { ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { colors } from "@/theme";

/** Line icons from the design, drawn on a 24×24 grid. */
const PATHS = {
  close: <Path d="M6 6l12 12M18 6L6 18" />,
  check: <Path d="M5 12l5 5L20 7" />,
  /** Points left: "forward" in RTL. */
  chevronForward: <Path d="M15 6l-6 6 6 6" />,
  /** Points right: "back" in RTL. */
  chevronBack: <Path d="M9 6l6 6-6 6" />,
  flame: <Path d="M12 2c1 3.5 5 6 5 11a5 5 0 0 1-10 0c0-2.5 1.5-4 2.5-5 .3 1.6 1.2 2.6 2.5 3-.3-3.3 0-6.3 0-9z" />,
  trophy: (
    <>
      <Path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z" />
      <Path d="M17 5h3a3 3 0 0 1-3 4M7 5H4a3 3 0 0 0 3 4" />
    </>
  ),
  swords: (
    <>
      <Path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
      <Path d="M13 19l6-6" />
      <Path d="M9.5 17.5L21 6V3h-3L6.5 14.5" />
      <Path d="M11 19l-6-6" />
    </>
  ),
  users: (
    <>
      <Circle cx="9" cy="8" r="3.5" />
      <Path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5" />
      <Circle cx="17" cy="9" r="2.5" />
      <Path d="M17 14.5c2.4 0 4 1.6 4.5 4" />
    </>
  ),
  badge: (
    <>
      <Path d="M5 8l7-5 7 5v8l-7 5-7-5z" />
      <Path d="M9 12l2 2 4-4" />
    </>
  ),
  share: (
    <>
      <Path d="M12 3v12M7 8l5-5 5 5" />
      <Path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
    </>
  ),
  replay: (
    <>
      <Path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <Path d="M3 3v5h5" />
    </>
  ),
  bulb: <Path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z" />,
  exit: (
    <>
      <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <Path d="M16 17l5-5-5-5M21 12H9" />
    </>
  ),
  phone: (
    <>
      <Rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <Path d="M11 18.5h2" />
    </>
  ),
  plus: <Path d="M12 5v14M5 12h14" />,
  copy: (
    <>
      <Rect x="9" y="9" width="12" height="12" rx="2" />
      <Path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof PATHS;

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  fill?: string;
  /** Accessible label. Without one the icon is decorative. */
  label?: string;
  style?: StyleProp<ViewStyle>;
}

export function Icon({ name, size = 20, color = colors.text, strokeWidth = 2, fill = "none", label, style }: IconProps) {
  // Accessibility props live on the View: react-native-svg forwards unknown props to the DOM on web.
  return (
    <View
      style={style}
      accessible={!!label}
      accessibilityRole={label ? "image" : undefined}
      accessibilityLabel={label}
      accessibilityElementsHidden={!label}
      importantForAccessibility={label ? "yes" : "no-hide-descendants"}
    >
      <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={fill}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {PATHS[name]}
      </Svg>
    </View>
  );
}
