// Tool abstraction layer. Each tool takes a query, examines the target, and
// returns evidence. All analyzers (code, web, runtime, binary) implement the
// same ToolDef shape; the agent picks from the set matching its target type.
import type { Evidence } from "./types";
import type { RepoScan, SourceFile } from "./scanner";
import type { TargetPayload } from "./payload";
import { searchStrings } from "./binary";
import { discoveredPaths, probe } from "./runtime";
import { frameReference } from "./visual";

export type ToolContext = { payload: TargetPayload; scan: RepoScan | null; step: number; nextId: () => string; question?: string };
export type ToolResult = { summary: string; evidence: Evidence[] };
export type ToolDef = { name: string; description: string; run: (query: string, ctx: ToolContext) => ToolResult | Promise<ToolResult> };

function snippetOf(files: SourceFile[], path: string, line: number, before = 3, after = 14) {
  const f = files.find((x) => x.path === path);
  if (!f) return "";
  const lines = f.content.split("\n");
  const start = Math.max(0, line - 1 - before);
  return lines
    .slice(start, Math.min(lines.length, line - 1 + after))
    .map((t, i) => `${start + i + 1}: ${t}`)
    .join("\n")
    .slice(0, 1800);
}

const terms = (q: string) => q.toLowerCase().split(/[^a-z0-9_]+/).filter((t) => t.length > 1);

// ---------- Source-code tools (white-box) ----------

const CODE_TOOLS: ToolDef[] = [
  {
    name: "search_symbols",
    description: "Find functions/classes whose name or file path matches the given keywords.",
    run(query, ctx) {
      const ts = terms(query);
      const scored = ctx.scan!.symbols
        .map((s) => {
          const hay = `${s.name} ${s.file}`.toLowerCase();
          return { s, score: ts.reduce((n, t) => n + (s.name.toLowerCase().includes(t) ? 3 : hay.includes(t) ? 1 : 0), 0) };
        })
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8);
      const files = ctx.payload.type === "repo" ? ctx.payload.files : [];
      const evidence = scored.map(({ s }) => ({
        id: ctx.nextId(), kind: s.kind === "class" ? ("class" as const) : ("function" as const),
        title: `${s.kind} ${s.name}`, file: s.file, line: s.line,
        snippet: snippetOf(files, s.file, s.line), tool: "search_symbols", step: ctx.step,
      }));
      return { summary: `${scored.length} symbols matched "${query}"`, evidence };
    },
  },
  {
    name: "read_file",
    description: "Read a file. Query is 'path' or 'path:line'.",
    run(query, ctx) {
      const files = ctx.payload.type === "repo" ? ctx.payload.files : [];
      const [path = "", ln] = query.trim().split(":");
      const f = files.find((x) => x.path === path) ?? files.find((x) => x.path.endsWith(path));
      if (!f) return { summary: `File not found: ${path}`, evidence: [] };
      const line = Number(ln) || 1;
      return {
        summary: `Read ${f.path} around line ${line}`,
        evidence: [{ id: ctx.nextId(), kind: "source_code", title: `${f.path}:${line}`, file: f.path, line, snippet: snippetOf(files, f.path, line, 5, 60), tool: "read_file", step: ctx.step }],
      };
    },
  },
  {
    name: "find_callers",
    description: "List functions that call the given symbol name.",
    run(query, ctx) {
      const name = query.trim();
      const files = ctx.payload.type === "repo" ? ctx.payload.files : [];
      const edges = ctx.scan!.calls.filter((c) => c.to === name).slice(0, 10);
      return {
        summary: `${edges.length} callers of ${name}`,
        evidence: edges.map((e) => ({ id: ctx.nextId(), kind: "call_relationship", title: `${e.from} → ${e.to}`, file: e.fromFile, line: e.line, snippet: snippetOf(files, e.fromFile, e.line, 2, 4), tool: "find_callers", step: ctx.step })),
      };
    },
  },
  {
    name: "find_callees",
    description: "List functions called by the given symbol name.",
    run(query, ctx) {
      const name = query.trim();
      const files = ctx.payload.type === "repo" ? ctx.payload.files : [];
      const edges = ctx.scan!.calls.filter((c) => c.from === name).slice(0, 10);
      return {
        summary: `${name} calls ${edges.length} known functions`,
        evidence: edges.map((e) => ({ id: ctx.nextId(), kind: "call_relationship", title: `${e.from} → ${e.to}`, file: e.fromFile, line: e.line, snippet: snippetOf(files, e.fromFile, e.line, 2, 4), tool: "find_callees", step: ctx.step })),
      };
    },
  },
  {
    name: "list_routes",
    description: "List API routes/endpoints. Optional keyword filter.",
    run(query, ctx) {
      const ts = terms(query);
      const files = ctx.payload.type === "repo" ? ctx.payload.files : [];
      const routes = ctx.scan!.routes.filter((r) => !ts.length || ts.some((t) => `${r.path} ${r.file}`.toLowerCase().includes(t))).slice(0, 12);
      return {
        summary: `${routes.length} routes found`,
        evidence: routes.map((r) => ({ id: ctx.nextId(), kind: "API_endpoint", title: `${r.method} ${r.path}`, file: r.file, line: r.line, snippet: snippetOf(files, r.file, r.line, 1, 8), tool: "list_routes", step: ctx.step })),
      };
    },
  },
  {
    name: "grep",
    description: "Case-insensitive text search across all files. Also surfaces database queries and imports.",
    run(query, ctx) {
      const q = query.toLowerCase().trim();
      const hits: Evidence[] = [];
      if (!q) return { summary: "Empty query", evidence: [] };
      const files = ctx.payload.type === "repo" ? ctx.payload.files : [];
      for (const f of files) {
        const lines = f.content.split("\n");
        for (let i = 0; i < lines.length && hits.length < 10; i++) {
          if ((lines[i] ?? "").toLowerCase().includes(q)) {
            const isDb = ctx.scan!.dbRefs.some((d) => d.file === f.path && d.line === i + 1);
            const isImport = ctx.scan!.imports.some((d) => d.file === f.path && d.line === i + 1);
            hits.push({ id: ctx.nextId(), kind: isDb ? "database_reference" : isImport ? "dependency" : "string", title: `"${query}" in ${f.path}:${i + 1}`, file: f.path, line: i + 1, snippet: snippetOf(files, f.path, i + 1, 2, 5), tool: "grep", step: ctx.step });
          }
        }
        if (hits.length >= 10) break;
      }
      return { summary: `${hits.length} matches for "${query}"`, evidence: hits };
    },
  },
];

// ---------- Website tools (black-box) ----------

const WEB_TOOLS: ToolDef[] = [
  {
    name: "crawl_page",
    description: "Read a crawled page. Query is a URL or path keyword.",
    run(query, ctx) {
      if (ctx.payload.type !== "web") return { summary: "No site loaded", evidence: [] };
      const q = query.toLowerCase().trim();
      const page = ctx.payload.site.pages.find((p) => p.url.toLowerCase().includes(q)) ?? ctx.payload.site.pages[0];
      if (!page) return { summary: `No page matching "${query}"`, evidence: [] };
      return {
        summary: `Read ${page.url} (${page.status})`,
        evidence: [{ id: ctx.nextId(), kind: "page", title: `${page.url} — ${page.title || page.status}`, file: page.url, line: null, snippet: page.html.slice(0, 1800), tool: "crawl_page", step: ctx.step }],
      };
    },
  },
  {
    name: "list_endpoints",
    description: "List URLs the site calls (fetch/XHR/API paths) and form actions. Optional keyword filter.",
    run(query, ctx) {
      if (ctx.payload.type !== "web") return { summary: "No site loaded", evidence: [] };
      const ts = terms(query);
      const eps = ctx.payload.site.pages
        .flatMap((p) => p.endpoints)
        .filter((e) => !ts.length || ts.some((t) => e.url.toLowerCase().includes(t)))
        .slice(0, 12);
      return {
        summary: `${eps.length} endpoints found`,
        evidence: eps.map((e) => ({ id: ctx.nextId(), kind: "http_endpoint", title: `${e.url} (${e.source})`, file: e.page, line: null, snippet: `Found on ${e.page}\nSource: ${e.source}\nURL: ${e.url}`, tool: "list_endpoints", step: ctx.step })),
      };
    },
  },
  {
    name: "list_forms",
    description: "List HTML forms with their fields and submit targets. Optional keyword filter.",
    run(query, ctx) {
      if (ctx.payload.type !== "web") return { summary: "No site loaded", evidence: [] };
      const ts = terms(query);
      const forms = ctx.payload.site.pages
        .flatMap((p) => p.forms)
        .filter((f) => !ts.length || ts.some((t) => `${f.action} ${f.fields.join(" ")}`.toLowerCase().includes(t)))
        .slice(0, 10);
      return {
        summary: `${forms.length} forms found`,
        evidence: forms.map((f) => ({ id: ctx.nextId(), kind: "form", title: `${f.method} ${f.action}`, file: f.page, line: null, snippet: `Page: ${f.page}\nMethod: ${f.method}\nAction: ${f.action}\nFields: ${f.fields.join(", ") || "(none)"}`, tool: "list_forms", step: ctx.step })),
      };
    },
  },
  {
    name: "inspect_headers",
    description: "Show response headers and scripts for a page. Query is a URL or path keyword.",
    run(query, ctx) {
      if (ctx.payload.type !== "web") return { summary: "No site loaded", evidence: [] };
      const q = query.toLowerCase().trim();
      const page = ctx.payload.site.pages.find((p) => p.url.toLowerCase().includes(q)) ?? ctx.payload.site.pages[0];
      if (!page) return { summary: `No page matching "${query}"`, evidence: [] };
      const evidence: Evidence[] = [];
      const headerText = Object.entries(page.headers).map(([k, v]) => `${k}: ${v}`).join("\n");
      if (headerText) evidence.push({ id: ctx.nextId(), kind: "header", title: `Headers of ${page.url}`, file: page.url, line: null, snippet: headerText, tool: "inspect_headers", step: ctx.step });
      for (const s of page.scripts.slice(0, 6)) evidence.push({ id: ctx.nextId(), kind: "script", title: s, file: page.url, line: null, snippet: `Script loaded by ${page.url}:\n${s}`, tool: "inspect_headers", step: ctx.step });
      return { summary: `${page.url}: ${Object.keys(page.headers).length} headers, ${page.scripts.length} scripts`, evidence };
    },
  },
];

// ---------- Runtime tools (gray-box) ----------

const RUNTIME_TOOLS: ToolDef[] = [
  {
    name: "probe_endpoint",
    description: "Send a safe read-only request (GET) to a path on the running app. Query is a path like /api/users.",
    async run(query, ctx) {
      if (ctx.payload.type !== "runtime") return { summary: "No runtime target", evidence: [] };
      const base = ctx.payload.target.baseUrl;
      let path = query.trim() || "/";
      if (!path.startsWith("http")) path = `${base}${path.startsWith("/") ? path : `/${path}`}`;
      if (!path.startsWith(base)) return { summary: "Refused: path must stay on the target origin", evidence: [] };
      const r = await probe(path, "GET");
      const snippet = r.ok
        ? `GET ${path}\nStatus: ${r.status}\n${Object.entries(r.headers).map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${r.bodySnippet}`
        : `GET ${path} failed: ${r.error}`;
      return {
        summary: r.ok ? `GET ${path} → ${r.status}` : `GET ${path} failed`,
        evidence: [{ id: ctx.nextId(), kind: "probe", title: `GET ${path} → ${r.status || "error"}`, file: path, line: null, snippet, tool: "probe_endpoint", step: ctx.step }],
      };
    },
  },
  {
    name: "list_probes",
    description: "Show results of the initial fingerprint probes and discovered paths (robots.txt, sitemap).",
    run(_query, ctx) {
      if (ctx.payload.type !== "runtime") return { summary: "No runtime target", evidence: [] };
      const t = ctx.payload.target;
      const evidence: Evidence[] = t.probes.slice(0, 10).map((p) => ({
        id: ctx.nextId(), kind: "probe", title: `${p.method} ${p.url} → ${p.status || "error"}`, file: p.url, line: null,
        snippet: `${p.method} ${p.url}\nStatus: ${p.status}\n${Object.entries(p.headers).map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${p.bodySnippet.slice(0, 800)}`,
        tool: "list_probes", step: ctx.step,
      }));
      const paths = discoveredPaths(t);
      if (paths.length) evidence.push({ id: ctx.nextId(), kind: "http_endpoint", title: `${paths.length} paths from robots/sitemap`, file: t.baseUrl, line: null, snippet: paths.join("\n"), tool: "list_probes", step: ctx.step });
      if (t.robots) evidence.push({ id: ctx.nextId(), kind: "page", title: "robots.txt", file: `${t.baseUrl}/robots.txt`, line: null, snippet: t.robots.slice(0, 1500), tool: "list_probes", step: ctx.step });
      return { summary: `${t.probes.length} fingerprint probes, ${paths.length} discovered paths`, evidence };
    },
  },
  {
    name: "check_methods",
    description: "Check which HTTP methods a path allows (OPTIONS request). Query is a path.",
    async run(query, ctx) {
      if (ctx.payload.type !== "runtime") return { summary: "No runtime target", evidence: [] };
      const base = ctx.payload.target.baseUrl;
      let path = query.trim() || "/";
      if (!path.startsWith("http")) path = `${base}${path.startsWith("/") ? path : `/${path}`}`;
      if (!path.startsWith(base)) return { summary: "Refused: path must stay on the target origin", evidence: [] };
      const r = await probe(path, "OPTIONS");
      return {
        summary: `OPTIONS ${path} → ${r.status || "error"}${r.allow ? ` (Allow: ${r.allow})` : ""}`,
        evidence: [{ id: ctx.nextId(), kind: "probe", title: `OPTIONS ${path} → ${r.status || "error"}`, file: path, line: null, snippet: `OPTIONS ${path}\nStatus: ${r.status}\nAllow: ${r.allow ?? "(not reported)"}\n${Object.entries(r.headers).map(([k, v]) => `${k}: ${v}`).join("\n")}`, tool: "check_methods", step: ctx.step }],
      };
    },
  },
];

// ---------- Binary tools (static) ----------

const BINARY_TOOLS: ToolDef[] = [
  {
    name: "strings_search",
    description: "Search printable strings inside the binary for a keyword (e.g. a URL, error message, or command name).",
    run(query, ctx) {
      if (ctx.payload.type !== "binary") return { summary: "No binary loaded", evidence: [] };
      const hits = searchStrings(ctx.payload.info, query);
      return {
        summary: `${hits.length} strings matched "${query}"`,
        evidence: hits.map((s) => ({ id: ctx.nextId(), kind: "binary_string", title: s.slice(0, 120), file: ctx.payload.type === "binary" ? ctx.payload.name : null, line: null, snippet: s, tool: "strings_search", step: ctx.step })),
      };
    },
  },
  {
    name: "list_imports",
    description: "List imported libraries and well-known API/function names found in the binary.",
    run(_query, ctx) {
      if (ctx.payload.type !== "binary") return { summary: "No binary loaded", evidence: [] };
      const { info, name } = ctx.payload;
      return {
        summary: `${info.imports.length} import hints`,
        evidence: info.imports.slice(0, 15).map((s) => ({ id: ctx.nextId(), kind: "imported_symbol", title: s.slice(0, 120), file: name, line: null, snippet: s, tool: "list_imports", step: ctx.step })),
      };
    },
  },
  {
    name: "binary_sections",
    description: "Show the binary's format, architecture and section headers.",
    run(_query, ctx) {
      if (ctx.payload.type !== "binary") return { summary: "No binary loaded", evidence: [] };
      const { info, name } = ctx.payload;
      const header = `Format: ${info.format}\nArchitecture: ${info.arch} (${info.bits ?? "?"}-bit)\nSize: ${info.sizeBytes} bytes`;
      const evidence: Evidence[] = [{ id: ctx.nextId(), kind: "binary_section", title: `${info.format} ${info.arch} ${info.bits ?? "?"}-bit`, file: name, line: null, snippet: header, tool: "binary_sections", step: ctx.step }];
      for (const s of info.sections.slice(0, 20)) {
        evidence.push({ id: ctx.nextId(), kind: "binary_section", title: `section ${s.name} (${s.size} bytes)`, file: name, line: null, snippet: `Name: ${s.name}\nSize: ${s.size}\nOffset: ${s.offset}`, tool: "binary_sections", step: ctx.step });
      }
      return { summary: `${info.format} ${info.arch}, ${info.sections.length} sections`, evidence };
    },
  },
];

const VISUAL_TOOLS: ToolDef[] = [{
  name: "inspect_visual_frame",
  description: "Inspect the visible controls and state of one frame. Query is its frame ID; no hidden implementation is observable.",
  async run(query, ctx) {
    if (ctx.payload.type !== "visual") return { summary: "No visual target", evidence: [] };
    const frame = ctx.payload.frames.find((f) => f.id === query);
    if (!frame) return { summary: "Frame not found", evidence: [] };
    const { observeFrame } = await import("./visual.server");
    const observation = await observeFrame(frame, ctx.question ?? ctx.payload.name);
    return { summary: observation.title, evidence: [{ id: ctx.nextId(), kind: "visual_frame", title: observation.title, file: frameReference(ctx.payload.name, frame), line: null, snippet: observation.snippet, tool: "inspect_visual_frame", step: ctx.step, image: frame.image, timestamp: frame.timestamp }] };
  },
}];

export function toolsFor(payload: TargetPayload): ToolDef[] {
  switch (payload.type) {
    case "repo": return CODE_TOOLS;
    case "web": return WEB_TOOLS;
    case "runtime": return RUNTIME_TOOLS;
    case "binary": return BINARY_TOOLS;
    case "visual": return VISUAL_TOOLS;
  }
}

export const TOOLS = CODE_TOOLS;
export const TOOL_NAMES = CODE_TOOLS.map((t) => t.name);
