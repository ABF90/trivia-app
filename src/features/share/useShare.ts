import * as Clipboard from "expo-clipboard";
import { useCallback, useState } from "react";
import { Platform, Share } from "react-native";

export type ShareStatus = "idle" | "shared" | "copied" | "error";

interface SharePayload {
  title: string;
  text: string;
  url: string;
}

/** Native share sheet (WhatsApp, Instagram…) with a clipboard fallback. */
export function useShare() {
  const [status, setStatus] = useState<ShareStatus>("idle");

  const copy = useCallback(async (text: string) => {
    try {
      await Clipboard.setStringAsync(text);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }, []);

  const share = useCallback(
    async ({ title, text, url }: SharePayload) => {
      const message = `${text}\n${url}`;
      try {
        if (Platform.OS === "web" && typeof navigator !== "undefined" && !navigator.share) {
          await copy(message);
          return;
        }
        const result = await Share.share({ title, message });
        if (result.action === Share.sharedAction) setStatus("shared");
      } catch {
        await copy(message);
      }
    },
    [copy],
  );

  return { status, share, copy };
}
