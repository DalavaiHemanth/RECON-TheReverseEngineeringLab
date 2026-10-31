import { n as __exportAll$1 } from "../_runtime.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/web-Cd3d0zEp.js
var web_Cd3d0zEp_exports = /* @__PURE__ */ __exportAll$1({
	i: () => __exportAll,
	n: () => parsePage,
	r: () => web_exports,
	t: () => isPublicHttpUrl
});
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var web_exports = /* @__PURE__ */ __exportAll({
	WEB_LIMITS: () => WEB_LIMITS,
	crawlSite: () => crawlSite,
	isPublicHttpUrl: () => isPublicHttpUrl,
	parsePage: () => parsePage
});
var WEB_LIMITS = {
	maxPages: 12,
	maxBodyBytes: 3e5,
	timeoutMs: 1e4
};
/** Block localhost and private-network targets (SSRF guard). */
function isPublicHttpUrl(raw) {
	let u;
	try {
		u = new URL(raw);
	} catch {
		return false;
	}
	if (u.protocol !== "http:" && u.protocol !== "https:") return false;
	const h = u.hostname.toLowerCase();
	if (h === "localhost" || h.endsWith(".local") || h.endsWith(".internal")) return false;
	const m = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/.exec(h);
	if (m) {
		const [a, b] = [Number(m[1]), Number(m[2])];
		if (a === 10 || a === 127 || a === 0 || a === 172 && b >= 16 && b <= 31 || a === 192 && b === 168 || a === 169 && b === 254) return false;
	}
	if (h === "[::1]" || h.startsWith("[fc") || h.startsWith("[fd") || h.startsWith("[fe80")) return false;
	return true;
}
var HEADER_ALLOWLIST = [
	"server",
	"content-type",
	"content-security-policy",
	"strict-transport-security",
	"x-frame-options",
	"x-content-type-options",
	"set-cookie",
	"cache-control",
	"x-powered-by",
	"www-authenticate",
	"access-control-allow-origin"
];
function parsePage(url, status, headers, html) {
	const title = /<title[^>]*>([^<]*)<\/title>/i.exec(html)?.[1]?.trim() ?? "";
	const kept = {};
	for (const h of HEADER_ALLOWLIST) {
		const v = headers.get(h);
		if (v) kept[h] = v.slice(0, 300);
	}
	const forms = [];
	const formRe = /<form\b([^>]*)>([\s\S]*?)<\/form>/gi;
	let fm;
	while ((fm = formRe.exec(html)) && forms.length < 20) {
		const attrs = fm[1] ?? "";
		const action = /\baction\s*=\s*["']([^"']*)["']/i.exec(attrs)?.[1] ?? url;
		const method = (/\bmethod\s*=\s*["']?(\w+)/i.exec(attrs)?.[1] ?? "GET").toUpperCase();
		const fields = [...(fm[2] ?? "").matchAll(/<(?:input|select|textarea)\b[^>]*\bname\s*=\s*["']([^"']+)["']/gi)].map((m) => m[1]).slice(0, 30);
		forms.push({
			page: url,
			action,
			method,
			fields
		});
	}
	const endpoints = [];
	const seen = /* @__PURE__ */ new Set();
	const addEp = (u, source) => {
		if (!u || u.length > 300 || seen.has(u)) return;
		seen.add(u);
		endpoints.push({
			page: url,
			url: u,
			source
		});
	};
	for (const m of html.matchAll(/(?:fetch|axios\.\w+|XMLHttpRequest)\s*\(\s*["'`]([^"'`]+)["'`]/g)) addEp(m[1], "fetch");
	for (const m of html.matchAll(/["'`](\/api\/[^"'`\s]*)["'`]/g)) addEp(m[1], "script");
	for (const f of forms) addEp(f.action, "form");
	const scripts = [...html.matchAll(/<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi)].map((m) => m[1]).slice(0, 30);
	const links = [];
	for (const m of html.matchAll(/<a\b[^>]*\bhref\s*=\s*["']([^"'#]+)["']/gi)) {
		const href = m[1];
		if (links.length < 60 && !href.startsWith("mailto:") && !href.startsWith("javascript:")) links.push(href);
	}
	return {
		url,
		status,
		title,
		headers: kept,
		forms,
		endpoints,
		scripts,
		links,
		html: html.slice(0, 2e4)
	};
}
async function fetchPage(url) {
	try {
		const res = await fetch(url, {
			redirect: "follow",
			signal: AbortSignal.timeout(WEB_LIMITS.timeoutMs),
			headers: {
				"User-Agent": "RECON-Investigator/1.0",
				Accept: "text/html,application/xhtml+xml"
			}
		});
		const type = res.headers.get("content-type") ?? "";
		const text = type.includes("html") || type.includes("text") ? (await res.text()).slice(0, WEB_LIMITS.maxBodyBytes) : "";
		return parsePage(url, res.status, res.headers, text);
	} catch {
		return null;
	}
}
/** Crawl a site: the entry URL plus same-origin links, up to WEB_LIMITS.maxPages. */
async function crawlSite(entryUrl) {
	const origin = new URL(entryUrl).origin;
	const visited = /* @__PURE__ */ new Set();
	const queue = [entryUrl];
	const pages = [];
	while (queue.length && pages.length < WEB_LIMITS.maxPages) {
		const norm = queue.shift().split("#")[0];
		if (visited.has(norm)) continue;
		visited.add(norm);
		const page = await fetchPage(norm);
		if (!page) continue;
		pages.push(page);
		for (const link of page.links) try {
			const abs = new URL(link, norm);
			if (abs.origin === origin && !visited.has(abs.href.split("#")[0]) && !/\.(png|jpe?g|gif|svg|css|js|woff2?|ico|pdf|zip)$/i.test(abs.pathname)) queue.push(abs.href);
		} catch {}
	}
	return {
		origin,
		pages,
		fetchedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
//#endregion
export { web_Cd3d0zEp_exports as i, isPublicHttpUrl as n, parsePage as r, __exportAll as t };
