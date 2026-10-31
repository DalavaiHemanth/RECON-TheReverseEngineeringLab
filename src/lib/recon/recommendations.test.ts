import { describe, expect, it } from "vitest";
import { STARTING_ADVICE, startingQuestions, reportRecommendations } from "./recommendations";
import type { Report } from "./types";

const report: Report = {
  short_answer: "", flow: [], findings: [], contradictions: [], unknowns: [],
  technical_details: "", graph: { nodes: [], edges: [] },
  confidence: { score: 60, verifiedRatio: 0, evidenceCount: 1, distinctFiles: 1, directObservations: 1, contradictions: 0 },
};
describe("investigation recommendations", () => {
  it("offers more starting angles for every target", () => {
    for (const target of ["repo", "web", "runtime", "binary", "visual"] as const) {
      expect(startingQuestions(target, "").length).toBe(8);
      expect(STARTING_ADVICE[target].preparation.length).toBe(3);
    }
  });
  it("prioritizes questions matching the entered topic", () => {
    expect(startingQuestions("repo", "permissions private")[0]).toContain("permissions");
  });
  it("prioritizes report gaps and never invents evidence references", () => {
    const items = reportRecommendations("visual", { ...report, unknowns: ["Missing final screen"], contradictions: [{ description: "Conflict", evidence_ids: ["missing"] }] }, []);
    expect(items[0]?.id).toBe("gaps");
    expect(items.find((r) => r.id === "contradictions")?.refs).toEqual([]);
    expect(items.find((r) => r.id === "coverage")).toBeDefined();
    expect(items.some((r) => r.action === "brief")).toBe(true);
  });
  it("uses uncertain findings without presenting them as verified", () => {
    const items = reportRecommendations("repo", { ...report, findings: [{ claim: "Maybe cached", status: "inferred", evidence_ids: ["E1", "absent"], file: null, line: null, symbol: null }] }, [{ id: "E1", kind: "source_code", title: "code", file: null, line: null, snippet: "", tool: "read", step: 1 }]);
    expect(items.find((r) => r.id === "validate")?.refs).toEqual(["E1"]);
    expect(items.find((r) => r.id === "coverage")).toBeUndefined();
  });
});