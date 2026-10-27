import type { Metadata, Viewport } from "next";
import { Cairo, Lalezar } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

const lalezar = Lalezar({
  subsets: ["arabic", "latin"],
  weight: "400",
  variable: "--font-lalezar",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "صفارة", template: "%s · صفارة" },
  description: "اختبر معلوماتك في الرياضة الكويتية",
};

export const viewport: Viewport = {
  themeColor: "#0A1020",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${lalezar.variable}`}>
      <body>{children}</body>
    </html>
  );
}
