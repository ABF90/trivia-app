import type { Metadata } from "next";
import { DailyScreen } from "@/features/daily/DailyScreen";

export const metadata: Metadata = { title: "تحدي اليوم" };

export default function DailyPage() {
  return <DailyScreen />;
}
