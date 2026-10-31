import { a as visualSourceSchema } from "./visual-EuFN5w1X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/payload-5vQGPBXj.js
/** Backward-compatible decode of the stored repo_indexes payload. */
function decodePayload(stored) {
	if (Array.isArray(stored)) return {
		type: "repo",
		files: stored
	};
	const o = stored;
	if (o?.type === "visual") return visualSourceSchema.parse(o);
	if (o && typeof o === "object" && "type" in o) return o;
	return {
		type: "repo",
		files: []
	};
}
//#endregion
export { decodePayload };
