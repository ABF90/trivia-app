import { AI_CONFIG } from "@/config/game";
import type { Question } from "@/features/game/types";
import type { Language } from "@/i18n";
import { AiError, requestQuestions } from "./openrouter";
import { parseReply } from "./parseReply";

export { AiError, type AiErrorKind } from "./openrouter";

/**
 * Asks the AI for a fresh round about `topic`. Always resolves to questions
 * or rejects with an AiError, never anything else, so the screen can show
 * its error face instead of crashing.
 */
export async function generateQuestions(topic: string, lang: Language): Promise<Question[]> {
  const reply = await requestQuestions(topic, lang);
  const questions = parseReply(reply, topic, AI_CONFIG.questionCount);
  if (!questions) {
    // An empty list is the model refusing the topic; anything else is a messy reply.
    throw new AiError(/"questions"\s*:\s*\[\s*\]/.test(reply) ? "empty" : "badReply");
  }
  return questions;
}
