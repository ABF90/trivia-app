interface LogoProps {
  size?: number;
  /** "full" adds the sound waves and flag ribbon; "mark" is the bare whistle. */
  variant?: "full" | "mark";
  className?: string;
  decorative?: boolean;
}

export function Logo({ size = 112, variant = "full", className, decorative = false }: LogoProps) {
  const full = variant === "full";
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : "شعار صفارة"}
      aria-hidden={decorative || undefined}
    >
      <rect width="120" height="120" rx="28" fill="var(--color-primary)" />
      {full && (
        <>
          <path d="M22 38 a16 16 0 0 1 14 -14" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
          <path d="M14 34 a26 26 0 0 1 20 -20" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".6" />
        </>
      )}
      <circle cx="54" cy="66" r="26" fill="#fff" />
      <rect x="62" y="40" width="40" height="16" rx="5" fill="#fff" />
      <circle cx="54" cy="66" r="9" fill="var(--color-bg)" />
      {full && (
        <>
          <rect y="106" width="120" height="14" fill="var(--flag-green)" />
          <rect y="110.6" width="120" height="4.7" fill="#fff" />
          <rect y="115.3" width="120" height="4.7" fill="var(--flag-red)" />
          <path d="M0 106 L16 106 L10 120 L0 120 Z" fill="#000" />
        </>
      )}
    </svg>
  );
}
