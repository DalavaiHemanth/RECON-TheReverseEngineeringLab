import type { Evidence, Finding, FindingStatus, GraphEdge, GraphNode } from "./types";

export const GRAPH_NODE_TYPES: GraphNode["type"][] = ["function", "class", "file", "endpoint", "database", "page", "binary"];
export const GRAPH_CONFIDENCE: FindingStatus[] = ["verified", "observed", "inferred", "unknown"];

/** Associate confidence with explicit references, never with the report-wide score. */
export function nodeAssessment(node: GraphNode, findings: Finding[], evidence: Evidence[]) {
  const related = evidence.filter((item) => {
    if (node.file && item.file !== node.file) return false;
    return item.id === node.id || item.file === node.id ||
      `ep:${item.title}` === node.id || `b:${item.title}` === node.id ||
      `db:${item.file}:${item.line}` === node.id ||
      item.title === node.label || item.title.replace(/^(function|class|method) /, "") === node.label ||
      ((node.type === "file" || node.type === "page") && item.file === node.label);
  });
  const matchedFindings = findings.filter((finding) => {
    const sameFile = !node.file || finding.file === node.file;
    if (finding.symbol) return sameFile && (finding.symbol === node.label || finding.symbol === node.id);
    if (finding.file && finding.file === node.id) return true;
    if ((node.type === "file" || node.type === "page") && finding.file === node.label) return true;
    return related.some((item) => finding.evidence_ids.includes(item.id));
  });
  const statuses = matchedFindings.map((finding) => finding.status);
  const status = GRAPH_CONFIDENCE.find((value) => statuses.includes(value)) ?? (related.length ? "observed" : "unknown");
  return { status, evidence: related, findings: matchedFindings.filter((finding) => finding.status === status) };
}

export function nodeConfidence(node: GraphNode, findings: Finding[], evidence: Evidence[]): FindingStatus {
  return nodeAssessment(node, findings, evidence).status;
}

export function connectionExplanation(edge: GraphEdge, nodes: GraphNode[], types: GraphNode["type"][], confidence: FindingStatus | "all", findings: Finding[], evidence: Evidence[]) {
  const source = nodes.find((node) => node.id === edge.source);
  const target = nodes.find((node) => node.id === edge.target);
  if (!source || !target) return null;
  const endpoints = [source, target].map((node) => ({ node, ...nodeAssessment(node, findings, evidence) }));
  const included = endpoints.every(({ node, status }) => types.includes(node.type) && (confidence === "all" || status === confidence));
  return { included, endpoints, confidence };
}

export function filterGraph(nodes: GraphNode[], edges: GraphEdge[], types: GraphNode["type"][], confidence: FindingStatus | "all", findings: Finding[], evidence: Evidence[]) {
  const visible = nodes.filter((node) => types.includes(node.type) && (confidence === "all" || nodeConfidence(node, findings, evidence) === confidence));
  const ids = new Set(visible.map((node) => node.id));
  return { nodes: visible, edges: edges.filter((edge) => ids.has(edge.source) && ids.has(edge.target)) };
}