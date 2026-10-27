"use client";

import { useSyncExternalStore } from "react";
import { playerStore, type PlayerData } from "./store";

/** Persistent player profile (best score, streak, daily history). */
export function usePlayer(): PlayerData {
  return useSyncExternalStore(playerStore.subscribe, playerStore.getSnapshot, playerStore.getServerSnapshot);
}
