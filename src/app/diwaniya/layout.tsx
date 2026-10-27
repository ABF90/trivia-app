import type { Metadata } from "next";
import { DiwaniyaProvider } from "@/features/diwaniya";

export const metadata: Metadata = { title: "وضع الديوانية" };

/** Keeps the pass-the-phone session alive while moving between setup and play. */
export default function DiwaniyaLayout({ children }: { children: React.ReactNode }) {
  return <DiwaniyaProvider>{children}</DiwaniyaProvider>;
}
