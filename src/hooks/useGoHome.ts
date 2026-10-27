import { useRouter } from "expo-router";
import { useCallback } from "react";

/** Pops back to the home screen (or replaces the current screen when home isn't in the stack, e.g. after a deep link). */
export function useGoHome() {
  const router = useRouter();
  return useCallback(() => router.dismissTo("/"), [router]);
}
