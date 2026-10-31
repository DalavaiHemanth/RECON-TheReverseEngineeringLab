// Investigation target payloads — what the agent works on, per target type.
import type { SourceFile } from "./scanner";
import type { WebSite } from "./web";
import type { RuntimeTarget } from "./runtime";
import type { BinaryInfo } from "./binary";
import type { TargetType } from "./types";
import { visualSourceSchema, type VisualSource } from "./visual";

export type TargetPayload =
  | { type: "repo"; files: SourceFile[] }
  | { type: "web"; site: WebSite }
  | { type: "runtime"; target: RuntimeTarget }
  | { type: "binary"; info: BinaryInfo; name: string }
  | VisualSource;

export function payloadType(p: TargetPayload): TargetType {
  return p.type;
}

/** Backward-compatible decode of the stored repo_indexes payload. */
export function decodePayload(stored: unknown): TargetPayload {
  if (Array.isArray(stored)) return { type: "repo", files: stored as SourceFile[] };
  const o = stored as TargetPayload | null;
  if (o?.type === "visual") return visualSourceSchema.parse(o);
  if (o && typeof o === "object" && "type" in o) return o;
  return { type: "repo", files: [] };
}
