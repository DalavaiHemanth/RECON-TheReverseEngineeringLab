// Gray-box runtime analysis: probe a running application with safe, read-only
// HTTP requests (GET/HEAD/OPTIONS only — never POST/PUT/DELETE).

import { isPublicHttpUrl, parsePage, type WebPage } from "./web";

export type ProbeResult = {
  url: string;
  method: "GET" | "HEAD" | "OPTIONS";
  status: number;
  headers: Record<string, string>;
  allow: string | null;
  bodySnippet: string;
  ok: boolean;
  error?: string;
};

export type RuntimeTarget = {
  baseUrl: string;
  entry: WebPage | null;
  robots: string | null;
  sitemap: string | null;
  probes: ProbeResult[];
  fetchedAt: string;
};

const RUNTIME_LIMITS = { timeoutMs: 8_000, maxBody: 60_000, maxProbes: 30 };

const COMMON_PATHS = ["/api", "/api/health", "/health", "/status", "/version", "/api/v1", "/login", "/admin", "/.well-known/security.txt"];

const KEEP_HEADERS = ["server", "content-type", "allow", "x-powered-by", "www-authenticate", "access-control-allow-origin", "content-security-policy", "set-cookie"];

export async function probe(url: string, method: ProbeResult["method"] = "GET"): Promise<ProbeResult> {
  try {
    const res = await fetch(url, {
      method,
      redirect: "follow",
      signal: AbortSignal.timeout(RUNTIME_LIMITS.timeoutMs),
      headers: { "User-Agent": "RECON-Investigator/1.0" },
    });
    const headers: Record<string, string> = {};
    for (const h of KEEP_HEADERS) {
      const v = res.headers.get(h);
      if (v) headers[h] = v.slice(0, 300);
    }
    const body = method === "GET" ? (await res.text()).slice(0, RUNTIME_LIMITS.maxBody) : "";
    return { url, method, status: res.status, headers, allow: res.headers.get("allow"), bodySnippet: body.slice(0, 1500), ok: true };
  } catch (e) {
    return { url, method, status: 0, headers: {}, allow: null, bodySnippet: "", ok: false, error: e instanceof Error ? e.message : "request failed" };
  }
}

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(RUNTIME_LIMITS.timeoutMs), headers: { "User-Agent": "RECON-Investigator/1.0" } });
    if (!res.ok) return null;
    return (await res.text()).slice(0, 50_000);
  } catch {
    return null;
  }
}

/** Initial fingerprint of a running app: entry page, robots.txt, sitemap, common paths. */
export async function fingerprint(baseUrl: string): Promise<RuntimeTarget> {
  const base = new URL(baseUrl).origin;
  const entryRes = await probe(base, "GET");
  const entry = entryRes.ok ? parsePage(base, entryRes.status, new Headers(entryRes.headers), entryRes.bodySnippet) : null;
  const [robots, sitemap] = await Promise.all([fetchText(`${base}/robots.txt`), fetchText(`${base}/sitemap.xml`)]);
  const probes: ProbeResult[] = [entryRes];
  for (const p of COMMON_PATHS.slice(0, 6)) probes.push(await probe(`${base}${p}`, "GET"));
  return { baseUrl: base, entry, robots, sitemap, probes, fetchedAt: new Date().toISOString() };
}

/** Paths discovered from robots.txt / sitemap that are worth probing. */
export function discoveredPaths(target: RuntimeTarget): string[] {
  const out = new Set<string>();
  for (const m of target.robots?.matchAll(/(?:Disallow|Allow):\s*(\/[^\s]*)/g) ?? []) out.add(m[1]!);
  for (const m of target.sitemap?.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g) ?? []) {
    try {
      const u = new URL(m[1]!);
      if (u.origin === target.baseUrl) out.add(u.pathname);
    } catch {
      /* ignore */
    }
  }
  return [...out].filter((p) => p && p !== "/" && !p.includes("*")).slice(0, RUNTIME_LIMITS.maxProbes);
}

export { isPublicHttpUrl };
