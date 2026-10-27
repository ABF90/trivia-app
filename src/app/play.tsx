import { useLocalSearchParams } from "expo-router";
import { isCategoryId } from "@/data/categories";
import { PlayScreen } from "@/features/play/PlayScreen";

export default function PlayRoute() {
  const { category, intent } = useLocalSearchParams<{ category?: string; intent?: string }>();
  return (
    <PlayScreen
      category={isCategoryId(category) ? category : undefined}
      intent={intent === "challenge" ? "challenge" : undefined}
    />
  );
}
