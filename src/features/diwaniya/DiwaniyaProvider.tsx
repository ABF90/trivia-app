import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";
import { pickRound } from "@/data/questionBank";
import { playerStore } from "../player/store";
import { diwaniyaReducer, initialDiwaniyaState, totalTurns, type DiwaniyaState, type QuestionCount } from "./model";

interface DiwaniyaContextValue {
  state: DiwaniyaState;
  addPlayer: () => void;
  removePlayer: (id: number) => void;
  renamePlayer: (id: number, name: string) => void;
  setQuestionCount: (count: QuestionCount) => void;
  /** Deals a fresh question queue and starts (or restarts) the game. */
  start: () => void;
  recordTurn: (correct: boolean) => void;
  reset: () => void;
}

const DiwaniyaContext = createContext<DiwaniyaContextValue | null>(null);

/** In-memory session for pass-the-phone mode, shared by the setup and play routes. */
export function DiwaniyaProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(diwaniyaReducer, initialDiwaniyaState);

  const value = useMemo<DiwaniyaContextValue>(
    () => ({
      state,
      addPlayer: () => dispatch({ type: "addPlayer" }),
      removePlayer: (id) => dispatch({ type: "removePlayer", id }),
      renamePlayer: (id, name) => dispatch({ type: "renamePlayer", id, name }),
      setQuestionCount: (count) => dispatch({ type: "setQuestionCount", count }),
      // Prefer questions this phone hasn't shown yet, but never run short.
      start: () => dispatch({ type: "start", queue: pickRound(totalTurns(state), undefined, new Set(playerStore.getSnapshot().seen)) }),
      recordTurn: (correct) => dispatch({ type: "recordTurn", correct }),
      reset: () => dispatch({ type: "reset" }),
    }),
    [state],
  );

  return <DiwaniyaContext.Provider value={value}>{children}</DiwaniyaContext.Provider>;
}

export function useDiwaniya(): DiwaniyaContextValue {
  const ctx = useContext(DiwaniyaContext);
  if (!ctx) throw new Error("useDiwaniya must be used inside <DiwaniyaProvider>");
  return ctx;
}
