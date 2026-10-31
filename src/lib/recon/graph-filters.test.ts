import { describe, expect, it } from "vitest";
import { connectionExplanation, filterGraph, nodeConfidence } from "./graph-filters";
import type { Evidence, Finding, GraphNode, GraphEdge } from "./types";

const nodes: [GraphNode, GraphNode, GraphNode] = [
  { id: "login", label: "login", type: "function", file: "auth.ts" },
  { id: "E1", label: "GET /api/login", type: "endpoint", file: "/api/login" },
  { id: "mystery", label: "mystery", type: "database", file: null },
];
const edges: GraphEdge[] = [{ id: "a", source: "login", target: "E1", label: "requests" }, { id: "b", source: "E1", target: "mystery", label: "reads" }];
const evidence: Evidence[] = [{ id: "E1", kind: "probe", title: "GET /api/login", file: "/api/login", line: null, snippet: "200 OK", tool: "probe", step: 1 }];
const findings: Finding[] = [{ claim: "Login exists", file: "auth.ts", symbol: "login", line: 1, evidence_ids: [], status: "verified" }];

describe("report graph filters", () => {
  it("explains inclusion from both endpoint types and confidence with real references", () => {
    const edge = edges[0];
    if (!edge) throw new Error("Missing test connection");
    const explanation = connectionExplanation(edge, nodes, ["function", "endpoint"], "all", findings, evidence);
    expect(explanation?.included).toBe(true);
    expect(explanation?.endpoints.map((endpoint) => endpoint.status)).toEqual(["verified", "observed"]);
    expect(explanation?.endpoints[1]?.evidence.map((item) => item.id)).toEqual(["E1"]);
    expect(connectionExplanation(edge, nodes, ["function"], "all", findings, evidence)?.included).toBe(false);
    expect(connectionExplanation(edge, nodes, ["function", "endpoint"], "verified", findings, evidence)?.included).toBe(false);
    expect(connectionExplanation(edge, [], ["function"], "all", findings, evidence)).toBeNull();
  });
  it("keeps only selected node types and connections with both endpoints visible", () => {
    const graph = filterGraph(nodes, edges, ["function", "endpoint"], "all", findings, evidence);
    expect(graph.nodes.map((node) => node.id)).toEqual(["login", "E1"]);
    expect(graph.edges.map((edge) => edge.id)).toEqual(["a"]);
  });
  it("filters by evidence confidence independently of node type", () => {
    expect(filterGraph(nodes, edges, ["function", "endpoint"], "verified", findings, evidence).nodes.map((node) => node.id)).toEqual(["login"]);
    expect(nodeConfidence(nodes[1], findings, evidence)).toBe("observed");
    expect(nodeConfidence(nodes[2], findings, evidence)).toBe("unknown");
  });
  it("does not spread a verified symbol's confidence to other symbols in its file", () => {
    expect(nodeConfidence({ id: "logout", label: "logout", type: "function", file: "auth.ts" }, findings, evidence)).toBe("unknown");
  });
  it("supports inferred and unknown filters and an empty type selection", () => {
    const inferred: Finding = { claim: "May call login", file: "/api/login", symbol: null, line: null, evidence_ids: ["E1"], status: "inferred" };
    expect(filterGraph(nodes, edges, ["endpoint"], "inferred", [inferred], evidence).nodes.map((node) => node.id)).toEqual(["E1"]);
    expect(filterGraph(nodes, edges, ["database"], "unknown", findings, evidence).nodes.map((node) => node.id)).toEqual(["mystery"]);
    expect(filterGraph(nodes, edges, [], "all", findings, evidence)).toEqual({ nodes: [], edges: [] });
  });
});