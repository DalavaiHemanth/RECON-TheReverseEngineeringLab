import { unzipSync, strFromU8 } from "fflate";
import { isIndexable, type SourceFile } from "./scanner";

export const LIMITS = { maxFiles: 1500, maxFileBytes: 200_000, maxTotalBytes: 6_000_000 };

/** Extract indexable source files from a zip, stripping a shared top-level folder. */
export function extractZip(bytes: Uint8Array): SourceFile[] {
  const entries = unzipSync(bytes, {
    filter: (f) => !f.name.endsWith("/") && f.originalSize <= LIMITS.maxFileBytes && isIndexable(f.name),
  });
  const names = Object.keys(entries);
  const tops = new Set(names.map((n) => n.split("/")[0] ?? ""));
  const strip = tops.size === 1 && names.every((n) => n.includes("/"));
  const out: SourceFile[] = [];
  let total = 0;
  for (const name of names.sort()) {
    if (out.length >= LIMITS.maxFiles || total > LIMITS.maxTotalBytes) break;
    const content = strFromU8(entries[name]!);
    total += content.length;
    out.push({ path: strip ? name.split("/").slice(1).join("/") : name, content });
  }
  return out;
}

export function parseGithubUrl(url: string): { owner: string; repo: string; ref: string | null } | null {
  const m = /github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:\/tree\/([^/?#]+))?\/?(?:[?#].*)?$/.exec(url.trim());
  return m ? { owner: m[1]!, repo: m[2]!, ref: m[3] ?? null } : null;
}
