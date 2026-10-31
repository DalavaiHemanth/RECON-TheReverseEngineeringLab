import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, Output, NoObjectGeneratedError } from "ai";
import type { z } from "zod";

export class AiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

/** One structured-output call, consumed server-side. Supports OpenAI and Google Gemini. */
export async function aiObject<T>(opts: {
  schema: z.ZodType<T>;
  instructions: string;
  prompt: string;
  effort?: "low" | "medium";
  images?: string[];
}): Promise<T> {
  const geminiKey = process.env["GEMINI_API_KEY"] || process.env["GOOGLE_GENERATIVE_AI_API_KEY"];
  const openAiKey = process.env["OPENAI_API_KEY"];
  const lovableKey = process.env["LOVABLE_API_KEY"];

  if (!geminiKey && !openAiKey && !lovableKey) {
    throw new AiError(
      "AI is not configured. Please add OPENAI_API_KEY or GEMINI_API_KEY in your environment.",
      401,
    );
  }

  let model: Parameters<typeof streamText>[0]["model"];

  if (geminiKey) {
    const google = createGoogleGenerativeAI({ apiKey: geminiKey });
    const modelName = process.env["AI_MODEL"] || "gemini-2.0-flash";
    model = google(modelName);
  } else if (openAiKey) {
    const openai = createOpenAI({ apiKey: openAiKey });
    const modelName = process.env["AI_MODEL"] || "gpt-4o";
    model = openai(modelName);
  } else {
    // Legacy Lovable gateway fallback
    const provider = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey: lovableKey,
      headers: { "Lovable-API-Key": lovableKey!, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    });
    model = provider.responses("openai/gpt-6-astra");
  }

  const result = streamText({
    model,
    instructions: opts.instructions,
    ...(opts.images?.length
      ? {
          messages: [
            {
              role: "user" as const,
              content: [
                { type: "text" as const, text: opts.prompt },
                ...opts.images.map((image) => ({ type: "image" as const, image: new URL(image) })),
              ],
            },
          ],
        }
      : { prompt: opts.prompt }),
    output: Output.object({ schema: opts.schema }),
    maxRetries: 1,
  } as Parameters<typeof streamText>[0]);

  try {
    return (await result.output) as T;
  } catch (e: any) {
    if (e instanceof AiError) throw e;

    // Extract underlying error details from OpenAI / Gemini APIs
    const apiError = e?.data?.error?.message || e?.error?.message || e?.cause?.message;
    if (apiError) {
      if (apiError.includes("insufficient_quota") || apiError.includes("no credits remaining")) {
        throw new AiError(
          "OpenAI account has no credits remaining. Please add credits at platform.openai.com/settings/organization/billing or use a free GEMINI_API_KEY.",
          402,
        );
      }
      throw new AiError(`AI Provider Error: ${apiError}`, 500);
    }

    if (e?.statusCode === 429) {
      throw new AiError("AI rate limit reached. Please wait a moment and retry.", 429);
    }

    if (NoObjectGeneratedError.isInstance(e)) {
      throw new AiError(
        e.message || "The AI returned an unreadable answer for this step.",
        500,
      );
    }

    throw new AiError(e?.message || "Failed to generate investigation step from AI.", 500);
  }
}
