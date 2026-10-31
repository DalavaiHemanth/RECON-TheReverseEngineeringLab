// Black-box website analysis: fetch pages server-side and extract structure,
// forms, scripts, API calls and headers. No real browser — pattern-based.

export type WebForm = { page: string; action: string; method: string; fields: string[] };
export type WebEndpoint = { page: string; url: string; source: "fetch" | "form" | "link" | "script" };
export type WebPage = {
  url: string;
  status: number;
  title: string;
  headers: Record<string, string>;
  forms: WebForm[];
  endpoints: WebEndpoint[];
  scripts: string[];
  links: string[];
  html: string; // truncated body for evidence snippets
};

export type WebSite = { origin: string; pages: WebPage[]; fetchedAt: string };

export const WEB_LIMITS = { maxPages: 12, maxBodyBytes: 300_000, timeoutMs: 10_000 };

/** Block localhost and private-network targets (SSRF guard). */
export function isPublicHttpUrl(raw: string): boolean {
  let u: URL;
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
    if (a === 10 || a === 127 || a === 0 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 169 && b === 254)) return false;
  }
  if (h === "[::1]" || h.startsWith("[fc") || h.startsWith("[fd") || h.startsWith("[fe80")) return false;
  return true;
}

const HEADER_ALLOWLIST = ["server", "content-type", "content-security-policy", "strict-transport-security", "x-frame-options", "x-content-type-options", "set-cookie", "cache-control", "x-powered-by", "www-authenticate", "access-control-allow-origin"];

export function parsePage(url: string, status: number, headers: Headers, html: string): WebPage {
  const title = /<title[^>]*>([^<]*)<\/title>/i.exec(html)?.[1]?.trim() ?? "";
  const kept: Record<string, string> = {};
  for (const h of HEADER_ALLOWLIST) {
    const v = headers.get(h);
    if (v) kept[h] = v.slice(0, 300);
  }

  const forms: WebForm[] = [];
  const formRe = /<form\b([^>]*)>([\s\S]*?)<\/form>/gi;
  let fm: RegExpExecArray | null;
  while ((fm = formRe.exec(html)) && forms.length < 20) {
    const attrs = fm[1] ?? "";
    const action = /\baction\s*=\s*["']([^"']*)["']/i.exec(attrs)?.[1] ?? url;
    const method = (/\bmethod\s*=\s*["']?(\w+)/i.exec(attrs)?.[1] ?? "GET").toUpperCase();
    const fields = [...(fm[2] ?? "").matchAll(/<(?:input|select|textarea)\b[^>]*\bname\s*=\s*["']([^"']+)["']/gi)].map((m) => m[1]!).slice(0, 30);
    forms.push({ page: url, action, method, fields });
  }

  const endpoints: WebEndpoint[] = [];
  const seen = new Set<string>();
  const addEp = (u: string, source: WebEndpoint["source"]) => {
    if (!u || u.length > 300 || seen.has(u)) return;
    seen.add(u);
    endpoints.push({ page: url, url: u, source });
  };
  for (const m of html.matchAll(/(?:fetch|axios\.\w+|XMLHttpRequest)\s*\(\s*["'`]([^"'`]+)["'`]/g)) addEp(m[1]!, "fetch");
  for (const m of html.matchAll(/["'`](\/api\/[^"'`\s]*)["'`]/g)) addEp(m[1]!, "script");
  for (const f of forms) addEp(f.action, "form");

  const scripts = [...html.matchAll(/<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi)].map((m) => m[1]!).slice(0, 30);
  const links: string[] = [];
  for (const m of html.matchAll(/<a\b[^>]*\bhref\s*=\s*["']([^"'#]+)["']/gi)) {
    const href = m[1]!;
    if (links.length < 60 && !href.startsWith("mailto:") && !href.startsWith("javascript:")) links.push(href);
  }

  return { url, status, title, headers: kept, forms, endpoints, scripts, links, html: html.slice(0, 20_000) };
}

async function fetchPage(url: string): Promise<WebPage | null> {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(WEB_LIMITS.timeoutMs),
      headers: { "User-Agent": "RECON-Investigator/1.0", Accept: "text/html,application/xhtml+xml" },
    });
    const type = res.headers.get("content-type") ?? "";
    const text = type.includes("html") || type.includes("text") ? (await res.text()).slice(0, WEB_LIMITS.maxBodyBytes) : "";
    return parsePage(url, res.status, res.headers, text);
  } catch {
    return null;
  }
}

/** Crawl a site: the entry URL plus same-origin links, up to WEB_LIMITS.maxPages. */
export async function crawlSite(entryUrl: string): Promise<WebSite> {
  const origin = new URL(entryUrl).origin;
  const visited = new Set<string>();
  const queue = [entryUrl];
  const pages: WebPage[] = [];
  while (queue.length && pages.length < WEB_LIMITS.maxPages) {
    const url = queue.shift()!;
    const norm = url.split("#")[0]!;
    if (visited.has(norm)) continue;
    visited.add(norm);
    const page = await fetchPage(norm);
    if (!page) continue;
    pages.push(page);
    for (const link of page.links) {
      try {
        const abs = new URL(link, norm);
        if (abs.origin === origin && !visited.has(abs.href.split("#")[0]!) && !/\.(png|jpe?g|gif|svg|css|js|woff2?|ico|pdf|zip)$/i.test(abs.pathname)) queue.push(abs.href);
      } catch {
        /* bad link */
      }
    }
  }
  return { origin, pages, fetchedAt: new Date().toISOString() };
}
