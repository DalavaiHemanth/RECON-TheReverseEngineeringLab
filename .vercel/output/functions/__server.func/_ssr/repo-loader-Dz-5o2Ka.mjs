import { t as isIndexable } from "./scanner-w5jtN_vI.mjs";
import { n as unzipSync, t as strFromU8 } from "../_libs/fflate.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/repo-loader-Dz-5o2Ka.js
var LIMITS = {
	maxFiles: 1500,
	maxFileBytes: 2e5,
	maxTotalBytes: 6e6
};
/** Extract indexable source files from a zip, stripping a shared top-level folder. */
function extractZip(bytes) {
	const entries = unzipSync(bytes, { filter: (f) => !f.name.endsWith("/") && f.originalSize <= LIMITS.maxFileBytes && isIndexable(f.name) });
	const names = Object.keys(entries);
	const strip = new Set(names.map((n) => n.split("/")[0] ?? "")).size === 1 && names.every((n) => n.includes("/"));
	const out = [];
	let total = 0;
	for (const name of names.sort()) {
		if (out.length >= LIMITS.maxFiles || total > LIMITS.maxTotalBytes) break;
		const content = strFromU8(entries[name]);
		total += content.length;
		out.push({
			path: strip ? name.split("/").slice(1).join("/") : name,
			content
		});
	}
	return out;
}
function parseGithubUrl(url) {
	const m = /github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:\/tree\/([^/?#]+))?\/?(?:[?#].*)?$/.exec(url.trim());
	return m ? {
		owner: m[1],
		repo: m[2],
		ref: m[3] ?? null
	} : null;
}
//#endregion
export { extractZip, parseGithubUrl };
