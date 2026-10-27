import type { Metadata } from "next";
import { isCategoryId } from "@/data/categories";
import { PlayScreen } from "@/features/play/PlayScreen";

export const metadata: Metadata = { title: "لعب حر" };

type SearchParams = Promise<{ category?: string; intent?: string }>;

export default async function PlayPage({ searchParams }: { searchParams: SearchParams }) {
  const { category, intent } = await searchParams;
  return (
    <PlayScreen
      category={isCategoryId(category) ? category : undefined}
      intent={intent === "challenge" ? "challenge" : undefined}
    />
  );
}
