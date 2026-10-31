import { z } from "zod";

export const VISUAL_LIMITS = { maxFrames: 12, maxFileBytes: 100_000_000, maxDuration: 180, maxImageChars: 350_000 };
export const visualFrameSchema = z.object({
  id: z.string().regex(/^frame-\d+$/),
  timestamp: z.number().finite().min(0).max(VISUAL_LIMITS.maxDuration),
  image: z.string().max(VISUAL_LIMITS.maxImageChars).regex(/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/),
});
export const visualSourceSchema = z.object({
  type: z.literal("visual"), name: z.string().trim().min(1).max(200),
  capture: z.enum(["screenshots", "recording", "browser"]),
  frames: z.array(visualFrameSchema).min(1).max(VISUAL_LIMITS.maxFrames),
}).superRefine((v, ctx) => {
  if (new Set(v.frames.map((f) => f.id)).size !== v.frames.length) ctx.addIssue({ code: "custom", message: "Frame IDs must be unique." });
  if (v.frames.some((f, i) => i > 0 && f.timestamp < (v.frames[i - 1]?.timestamp ?? 0))) ctx.addIssue({ code: "custom", message: "Frames must be in chronological order." });
});
export type VisualSource = z.infer<typeof visualSourceSchema>;
export type VisualFrame = z.infer<typeof visualFrameSchema>;
export const frameReference = (name: string, frame: VisualFrame) => `${name} · ${frame.id} @ ${frame.timestamp.toFixed(1)}s`;

export function sampleTimes(duration: number): number[] {
  if (!Number.isFinite(duration) || duration <= 0 || duration > VISUAL_LIMITS.maxDuration) throw new Error("Use a recording between 0 and 180 seconds.");
  const count = Math.min(VISUAL_LIMITS.maxFrames, Math.max(2, Math.ceil(duration / 2) + 1));
  return Array.from({ length: count }, (_, i) => i * Math.max(0, duration - 0.05) / (count - 1));
}

export function visualFindingStatus(claimed: string, reference: string | null, ids: string[], evidence: { id: string; file: string | null; kind: string }[]) {
  if (claimed === "unknown") return "unknown" as const;
  const supported = evidence.some((e) => e.kind === "visual_frame" && ids.includes(e.id) && e.file === reference);
  return claimed === "observed" && supported ? "observed" as const : "inferred" as const;
}