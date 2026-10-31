import { t as createOpenAI } from "../_libs/ai-sdk__openai+zod.mjs";
import { n as output_exports, r as streamText, t as NoObjectGeneratedError } from "../_libs/ai.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.server-DfD20dIJ.js
var directOpenAiKey = process.env["OPENAI_API_KEY"];
var lovableKey = process.env["LOVABLE_API_KEY"];
var MODEL = directOpenAiKey ? process.env["AI_MODEL"] || "gpt-4o" : "openai/gpt-6-astra";
var AiError = class extends Error {
	status;
	constructor(message, status) {
		super(message);
		this.status = status;
	}
};
/** One streamed structured-output call, consumed server-side. */
async function aiObject(opts) {
	const apiKey = directOpenAiKey || lovableKey;
	if (!apiKey) throw new AiError("AI is not configured. Please set OPENAI_API_KEY in your .env file.", 401);
	let runId;
	const provider = createOpenAI(directOpenAiKey ? { apiKey: directOpenAiKey } : {
		baseURL: "https://ai.gateway.lovable.dev/v1",
		apiKey,
		headers: {
			"Lovable-API-Key": apiKey,
			"X-Lovable-AIG-SDK": "vercel-ai-sdk"
		},
		fetch: async (input, init) => {
			const headers = new Headers(init?.headers);
			if (runId) headers.set(RUN_ID, runId);
			const res = await fetch(input, {
				...init,
				headers
			});
			runId ??= res.headers.get(RUN_ID) ?? void 0;
			if (!res.ok) {
				let msg = `AI request failed (${res.status})`;
				try {
					const body = await res.clone().json();
					msg = body?.error?.message ?? body?.message ?? msg;
				} catch {}
				throw new AiError(res.status === 402 ? "Insufficient AI credits or billing not active." : res.status === 429 ? "AI is rate limited, try again shortly." : msg, res.status);
			}
			return res;
		}
	});
	const result = streamText({
		model: directOpenAiKey ? provider(MODEL) : provider.responses(MODEL),
		instructions: opts.instructions,
		...opts.images?.length ? { messages: [{
			role: "user",
			content: [{
				type: "text",
				text: opts.prompt
			}, ...opts.images.map((image) => ({
				type: "image",
				image: new URL(image)
			}))]
		}] } : { prompt: opts.prompt },
		output: output_exports.object({ schema: opts.schema }),
		maxRetries: 0,
		providerOptions: { openai: {
			forceReasoning: true,
			reasoningEffort: opts.effort ?? "low",
			reasoningSummary: "auto",
			store: false,
			include: ["reasoning.encrypted_content"]
		} }
	});
	try {
		return await result.output;
	} catch (e) {
		if (e instanceof AiError) throw e;
		if (NoObjectGeneratedError.isInstance(e)) throw new AiError("The AI returned an unreadable answer for this step.", 500);
		throw e;
	}
}
//#endregion
export { aiObject };
