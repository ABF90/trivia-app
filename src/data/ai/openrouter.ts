import { AI_CONFIG } from "@/config/game";
import type { Language } from "@/i18n";
import { systemPrompt, userPrompt } from "./instructions";

/** Why an AI request failed. `status` is the HTTP code when there is one (401, 429…). */
export type AiErrorKind = "noKey" | "network" | "timeout" | "http" | "badReply" | "empty";

export class AiError extends Error {
  constructor(
    readonly kind: AiErrorKind,
    readonly status?: number,
    message?: string,
  ) {
    super(message ?? kind);
  }

  /** Short code shown in small text on the error face. */
  get code(): string {
    return this.status ? String(this.status) : this.kind;
  }
}

// Inlined by Expo from .env.local at bundle time (restart `expo start` after editing it).
const API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY?.trim() ?? "";

interface ChatResponse {
  choices?: { message?: { content?: string | null } }[];
  error?: { code?: number | string; message?: string };
}

/** Asks the model for questions about `topic`; resolves to the raw text it wrote. */
export async function requestQuestions(topic: string, lang: Language): Promise<string> {
  if (!API_KEY) throw new AiError("noKey");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), AI_CONFIG.timeoutMs);
  let res: Response;
  try {
    res = await fetch(AI_CONFIG.endpoint, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "X-Title": "Sfara trivia",
      },
      body: JSON.stringify({
        // Fallback chain: OpenRouter uses the first free model that's available.
        models: AI_CONFIG.models,
        temperature: 0.8,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt(lang, AI_CONFIG.questionCount) },
          { role: "user", content: userPrompt(topic) },
        ],
      }),
    });
  } catch {
    throw new AiError(controller.signal.aborted ? "timeout" : "network");
  } finally {
    clearTimeout(timer);
  }

  const body = (await res.json().catch(() => null)) as ChatResponse | null;
  // OpenRouter sometimes reports provider errors inside a 200 response.
  const errorCode = Number(body?.error?.code);
  if (!res.ok || body?.error) {
    throw new AiError("http", res.ok ? (Number.isFinite(errorCode) ? errorCode : undefined) : res.status, body?.error?.message);
  }

  const content = body?.choices?.[0]?.message?.content;
  if (!content?.trim()) throw new AiError("badReply");
  return content;
}
