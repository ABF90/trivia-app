import { useLocalSearchParams } from "expo-router";
import { ChallengeScreen } from "@/features/challenge/ChallengeScreen";

/** Opened from a challenge link: sfara://challenge?d=… */
export default function ChallengeRoute() {
  const { d } = useLocalSearchParams<{ d?: string }>();
  return <ChallengeScreen code={d} />;
}
