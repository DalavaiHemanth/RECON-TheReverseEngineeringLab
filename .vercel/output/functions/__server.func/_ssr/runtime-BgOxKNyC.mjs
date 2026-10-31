import { n as isPublicHttpUrl, r as parsePage, t as __exportAll } from "./web-Cd3d0zEp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/runtime-BgOxKNyC.js
var runtime_exports = /* @__PURE__ */ __exportAll({
	discoveredPaths: () => discoveredPaths,
	fingerprint: () => fingerprint,
	isPublicHttpUrl: () => isPublicHttpUrl,
	probe: () => probe
});
var RUNTIME_LIMITS = {
	timeoutMs: 8e3,
	maxBody: 6e4,
	maxProbes: 30
};
var COMMON_PATHS = [
	"/api",
	"/api/health",
	"/health",
	"/status",
	"/version",
	"/api/v1",
	"/login",
	"/admin",
	"/.well-known/security.txt"
];
var KEEP_HEADERS = [
	"server",
	"content-type",
	"allow",
	"x-powered-by",
	"www-authenticate",
	"access-control-allow-origin",
	"content-security-policy",
	"set-cookie"
];
async function probe(url, method = "GET") {
	try {
		const res = await fetch(url, {
			method,
			redirect: "follow",
			signal: AbortSignal.timeout(RUNTIME_LIMITS.timeoutMs),
			headers: { "User-Agent": "RECON-Investigator/1.0" }
		});
		const headers = {};
		for (const h of KEEP_HEADERS) {
			const v = res.headers.get(h);
			if (v) headers[h] = v.slice(0, 300);
		}
		const body = method === "GET" ? (await res.text()).slice(0, RUNTIME_LIMITS.maxBody) : "";
		return {
			url,
			method,
			status: res.status,
			headers,
			allow: res.headers.get("allow"),
			bodySnippet: body.slice(0, 1500),
			ok: true
		};
	} catch (e) {
		return {
			url,
			method,
			status: 0,
			headers: {},
			allow: null,
			bodySnippet: "",
			ok: false,
			error: e instanceof Error ? e.message : "request failed"
		};
	}
}
async function fetchText(url) {
	try {
		const res = await fetch(url, {
			signal: AbortSignal.timeout(RUNTIME_LIMITS.timeoutMs),
			headers: { "User-Agent": "RECON-Investigator/1.0" }
		});
		if (!res.ok) return null;
		return (await res.text()).slice(0, 5e4);
	} catch {
		return null;
	}
}
/** Initial fingerprint of a running app: entry page, robots.txt, sitemap, common paths. */
async function fingerprint(baseUrl) {
	const base = new URL(baseUrl).origin;
	const entryRes = await probe(base, "GET");
	const entry = entryRes.ok ? parsePage(base, entryRes.status, new Headers(entryRes.headers), entryRes.bodySnippet) : null;
	const [robots, sitemap] = await Promise.all([fetchText(`${base}/robots.txt`), fetchText(`${base}/sitemap.xml`)]);
	const probes = [entryRes];
	for (const p of COMMON_PATHS.slice(0, 6)) probes.push(await probe(`${base}${p}`, "GET"));
	return {
		baseUrl: base,
		entry,
		robots,
		sitemap,
		probes,
		fetchedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
/** Paths discovered from robots.txt / sitemap that are worth probing. */
function discoveredPaths(target) {
	const out = /* @__PURE__ */ new Set();
	for (const m of target.robots?.matchAll(/(?:Disallow|Allow):\s*(\/[^\s]*)/g) ?? []) out.add(m[1]);
	for (const m of target.sitemap?.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g) ?? []) try {
		const u = new URL(m[1]);
		if (u.origin === target.baseUrl) out.add(u.pathname);
	} catch {}
	return [...out].filter((p) => p && p !== "/" && !p.includes("*")).slice(0, RUNTIME_LIMITS.maxProbes);
}
//#endregion
export { probe as n, runtime_exports as r, discoveredPaths as t };
