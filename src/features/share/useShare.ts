"use client";

import { useCallback, useState } from "react";

export type ShareStatus = "idle" | "shared" | "copied" | "error";

interface SharePayload {
  title: string;
  text: string;
  url: string;
}

/** Native share sheet when available (mobile), clipboard otherwise. */
export function useShare() {
  const [status, setStatus] = useState<ShareStatus>("idle");

  const share = useCallback(async (payload: SharePayload) => {
    try {
      if (navigator.share) {
        await navigator.share(payload);
        setStatus("shared");
        return;
      }
      await navigator.clipboard.writeText(`${payload.text}\n${payload.url}`);
      setStatus("copied");
    } catch (error) {
      // The user closing the native sheet is not an error.
      if (error instanceof DOMException && error.name === "AbortError") return;
      setStatus("error");
    }
  }, []);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }, []);

  return { status, share, copy, reset: () => setStatus("idle") };
}
