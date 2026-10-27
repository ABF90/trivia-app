import { useLocalSearchParams } from "expo-router";
import { parseCategories } from "@/data/categories";
import type { DifficultyFilter } from "@/features/game";
import { PlayScreen } from "@/features/play/PlayScreen";

const DIFFICULTIES: readonly DifficultyFilter[] = ["easy", "medium", "hard", "mixed"];

/** /play?categories=sports,history&difficulty=hard&intent=challenge */
export default function PlayRoute() {
  const params = useLocalSearchParams<{ categories?: string; difficulty?: string; intent?: string }>();
  const difficulty = DIFFICULTIES.find((d) => d === params.difficulty) ?? "mixed";
  return (
    <PlayScreen
      filter={{ categories: parseCategories(params.categories), difficulty }}
      intent={params.intent === "challenge" ? "challenge" : undefined}
    />
  );
}
