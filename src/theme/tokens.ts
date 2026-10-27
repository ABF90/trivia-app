/** Design tokens — the single source of truth for colours, radii and type. */
export const colors = {
  bg: "#0A1020",
  bgDeep: "#05080F",
  surface: "#16213A",
  surfaceMuted: "#111A2E",
  border: "#24314F",
  borderStrong: "#2A3756",

  primary: "#1F6BFF",
  primary300: "#7FA8FF",
  primary200: "#A9C4FF",
  glow: "#142A5C",
  glowTeal: "#0F3D36",

  text: "#F4F6FA",
  textSecondary: "#C9D2E3",
  textTertiary: "#9AA6BF",
  textMuted: "#8390AA",
  textFact: "#DCE3F0",
  onAccent: "#0A1020",

  success: "#12C7A5",
  danger: "#FF4D6D",
  danger300: "#FF8FA3",
  warning: "#FFB020",

  flagGreen: "#007A3D",
  flagRed: "#CE1126",
  white: "#FFFFFF",
  black: "#000000",
} as const;

/** Translucent tints used for soft backgrounds and borders. */
export const tints = {
  primary12: "rgba(31,107,255,0.12)",
  primary15: "rgba(31,107,255,0.15)",
  primary20: "rgba(31,107,255,0.20)",
  primary35: "rgba(31,107,255,0.35)",
  warning14: "rgba(255,176,32,0.14)",
  warning35: "rgba(255,176,32,0.35)",
  warning40: "rgba(255,176,32,0.40)",
  success14: "rgba(18,199,165,0.14)",
  danger10: "rgba(255,77,109,0.10)",
  danger14: "rgba(255,77,109,0.14)",
  danger50: "rgba(255,77,109,0.50)",
  scrim: "rgba(5,8,15,0.72)",
} as const;

export const radius = { sm: 10, md: 16, lg: 20, xl: 24, xxl: 28, pill: 999 } as const;

/** Font family names registered in the root layout. Never set fontWeight with these. */
export const fonts = {
  regular: "Cairo_400Regular",
  semibold: "Cairo_600SemiBold",
  bold: "Cairo_700Bold",
  heavy: "Cairo_800ExtraBold",
  display: "Lalezar_400Regular",
} as const;

export type FontWeight = keyof typeof fonts;

export const layout = {
  /** Phone-width column cap on tablets and web. */
  maxWidth: 480,
  gutter: 20,
} as const;

export const shadows = {
  primary: { shadowColor: colors.primary, shadowOpacity: 0.45, shadowRadius: 15, shadowOffset: { width: 0, height: 10 }, elevation: 8 },
  warning: { shadowColor: colors.warning, shadowOpacity: 0.35, shadowRadius: 15, shadowOffset: { width: 0, height: 10 }, elevation: 8 },
  success: { shadowColor: colors.success, shadowOpacity: 0.35, shadowRadius: 15, shadowOffset: { width: 0, height: 10 }, elevation: 8 },
  card: { shadowColor: colors.primary, shadowOpacity: 0.18, shadowRadius: 20, shadowOffset: { width: 0, height: 12 }, elevation: 6 },
} as const;
