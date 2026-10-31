import type { ConfidenceBreakdown, Evidence, Finding, FindingStatus } from "./types";
import { symbolExistsAt, type RepoScan } from "./scanner";

/**
 * Deterministic confidence score (0-100). Never taken from the model.
 *  45 * share of findings that are verified
 *  + 2 per supporting evidence item (max 20)
 *  + 4 per independent file (max 20)
 *  + 15 if at least one direct observation exists
 *  - 10 per contradiction
 */
export function computeConfidence(input: {
  findings: Pick<Finding, "status">[];
  evidenceCount: number;
  distinctFiles: number;
  contradictions: number;
}): ConfidenceBreakdown {
  const total = input.findings.length;
  const verified = input.findings.filter((f) => f.status === "verified").length;
  const direct = input.findings.filter((f) => f.status === "verified" || f.status === "observed").length;
  const verifiedRatio = total ? verified / total : 0;
  const raw =
    45 * verifiedRatio +
    Math.min(20, input.evidenceCount * 2) +
    Math.min(20, input.distinctFiles * 4) +
    (direct > 0 ? 15 : 0) -
    10 * input.contradictions;
  return {
    score: Math.max(0, Math.min(100, Math.round(raw))),
    verifiedRatio,
    evidenceCount: input.evidenceCount,
    distinctFiles: input.distinctFiles,
    directObservations: direct,
    contradictions: input.contradictions,
  };
}

/**
 * Promotion rule: a claim is "verified" only when it cites a file the scanner
 * indexed, the cited symbol is declared there, and it is backed by evidence.
 * Claims whose reference fails the check are downgraded to "inferred".
 */
export function classifyFinding(
  scan: RepoScan,
  claimed: FindingStatus,
  ref: { file: string | null; symbol: string | null; line: number | null; evidence_ids: string[] },
): FindingStatus {
  if (claimed === "unknown") return "unknown";
  if (!ref.file) return claimed === "observed" ? "inferred" : claimed;
  const ok = symbolExistsAt(scan, ref.file, ref.symbol, ref.line);
  if (ok && ref.evidence_ids.length > 0) return "verified";
  if (ok) return "observed";
  return "inferred";
}

export type VerifyContext = { scan: RepoScan | null; evidence: Evidence[] };

/**
 * Promotion rule for non-code targets (web, runtime, binary): a claim is
 * "verified" only when its cited reference (URL, path, or binary name) appears
 * in collected evidence and it cites at least one real evidence ID.
 */
export function verifyReference(
  ctx: VerifyContext,
  claimed: FindingStatus,
  ref: { file: string | null; symbol: string | null; line: number | null; evidence_ids: string[] },
): FindingStatus {
  if (ctx.scan) return classifyFinding(ctx.scan, claimed, ref);
  if (claimed === "unknown") return "unknown";
  const cited = ref.evidence_ids.some((id) => ctx.evidence.some((e) => e.id === id));
  if (!cited) return claimed === "observed" ? "inferred" : claimed;
  if (!ref.file) return claimed;
  const refSeen = ctx.evidence.some((e) => e.file === ref.file || e.title.includes(ref.file!) || e.snippet.includes(ref.file!));
  if (refSeen) return "verified";
  return claimed === "observed" ? "inferred" : claimed;
}
