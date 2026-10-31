import { createOpenAI } from "@ai-sdk/openai";
import { streamText, Output, NoObjectGeneratedError } from "ai";
import type { z } from "zod";

const directOpenAiKey = process.env["OPENAI_API_KEY"];
const lovableKey = process.env["LOVABLE_API_KEY"];
export const MODEL = directOpenAiKey ? (process.env["AI_MODEL"] || "gpt-4o") : "openai/gpt-6-astra";

export class AiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

/** One streamed structured-output call, consumed server-side. */
export async function aiObject<T>(opts: { schema: z.ZodType<T>; instructions: string; prompt: string; effort?: "low" | "medium"; images?: string[] }): Promise<T> {
  const apiKey = directOpenAiKey || lovableKey;
  if (!apiKey) throw new AiError("AI is not configured. Please set OPENAI_API_KEY in your .env file.", 401);
  let runId: string | undefined;
  const provider = createOpenAI(
    directOpenAiKey
      ? { apiKey: directOpenAiKey }
      : {
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey,
          headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
          fetch: async (input, init) => {
            const headers = new Headers(init?.headers);
            if (runId) headers.set(RUN_ID, runId);
            const res = await fetch(input, { ...init, headers });
            runId ??= res.headers.get(RUN_ID) ?? undefined;
            if (!res.ok) {
              let msg = `AI request failed (${res.status})`;
              try {
                const body = await res.clone().json();
                msg = body?.error?.message ?? body?.message ?? msg;
              } catch {}
              throw new AiError(res.status === 402 ? "Insufficient AI credits or billing not active." : res.status === 429 ? "AI is rate limited, try again shortly." : msg, res.status);
            }
            return res;
          },
        }
  );
  const result = streamText({
    model: directOpenAiKey ? provider(MODEL) : provider.responses(MODEL),
    instructions: opts.instructions,
    ...(opts.images?.length ? { messages: [{ role: "user" as const, content: [{ type: "text" as const, text: opts.prompt }, ...opts.images.map((image) => ({ type: "image" as const, image: new URL(image) }))] }] } : { prompt: opts.prompt }),
    output: Output.object({ schema: opts.schema }),
    maxRetries: 0,
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: opts.effort ?? "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  } as Parameters<typeof streamText>[0]);
  try {
    return (await result.output) as T;
  } catch (e) {
    if (e instanceof AiError) throw e;
    if (NoObjectGeneratedError.isInstance(e)) throw new AiError("The AI returned an unreadable answer for this step.", 500);
    throw e;
  }
}
