import type { Metadata } from "next";
import { ChallengeScreen } from "@/features/challenge/ChallengeScreen";

export const metadata: Metadata = {
  title: "تحدَّ ربعك",
  description: "واحد من ربعك يتحداك في صفارة، تقدر تغلبه؟",
};

type SearchParams = Promise<{ d?: string }>;

export default async function ChallengePage({ searchParams }: { searchParams: SearchParams }) {
  const { d } = await searchParams;
  return <ChallengeScreen code={d} />;
}
