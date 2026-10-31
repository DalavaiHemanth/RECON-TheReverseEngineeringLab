import { c as stringType, i as literalType, o as numberType, r as enumType, s as objectType, t as arrayType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/visual-EuFN5w1X.js
var VISUAL_LIMITS = {
	maxFrames: 12,
	maxFileBytes: 1e8,
	maxDuration: 180,
	maxImageChars: 35e4
};
var visualFrameSchema = objectType({
	id: stringType().regex(/^frame-\d+$/),
	timestamp: numberType().finite().min(0).max(VISUAL_LIMITS.maxDuration),
	image: stringType().max(VISUAL_LIMITS.maxImageChars).regex(/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/)
});
var visualSourceSchema = objectType({
	type: literalType("visual"),
	name: stringType().trim().min(1).max(200),
	capture: enumType([
		"screenshots",
		"recording",
		"browser"
	]),
	frames: arrayType(visualFrameSchema).min(1).max(VISUAL_LIMITS.maxFrames)
}).superRefine((v, ctx) => {
	if (new Set(v.frames.map((f) => f.id)).size !== v.frames.length) ctx.addIssue({
		code: "custom",
		message: "Frame IDs must be unique."
	});
	if (v.frames.some((f, i) => i > 0 && f.timestamp < (v.frames[i - 1]?.timestamp ?? 0))) ctx.addIssue({
		code: "custom",
		message: "Frames must be in chronological order."
	});
});
var frameReference = (name, frame) => `${name} · ${frame.id} @ ${frame.timestamp.toFixed(1)}s`;
function sampleTimes(duration) {
	if (!Number.isFinite(duration) || duration <= 0 || duration > VISUAL_LIMITS.maxDuration) throw new Error("Use a recording between 0 and 180 seconds.");
	const count = Math.min(VISUAL_LIMITS.maxFrames, Math.max(2, Math.ceil(duration / 2) + 1));
	return Array.from({ length: count }, (_, i) => i * Math.max(0, duration - .05) / (count - 1));
}
function visualFindingStatus(claimed, reference, ids, evidence) {
	if (claimed === "unknown") return "unknown";
	const supported = evidence.some((e) => e.kind === "visual_frame" && ids.includes(e.id) && e.file === reference);
	return claimed === "observed" && supported ? "observed" : "inferred";
}
//#endregion
export { visualSourceSchema as a, visualFindingStatus as i, frameReference as n, sampleTimes as r, VISUAL_LIMITS as t };
