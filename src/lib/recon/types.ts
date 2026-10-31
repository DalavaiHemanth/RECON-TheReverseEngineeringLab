export type EvidenceKind =
  | "source_code"
  | "function"
  | "class"
  | "API_endpoint"
  | "dependency"
  | "call_relationship"
  | "database_reference"
  | "string"
  | "http_endpoint"
  | "form"
  | "header"
  | "script"
  | "page"
  | "probe"
  | "binary_string"
  | "binary_section"
  | "imported_symbol"
  | "visual_frame";

export type Evidence = {
  id: string;
  kind: EvidenceKind;
  title: string;
  file: string | null;
  line: number | null;
  snippet: string;
  tool: string;
  step: number;
  image?: string;
  timestamp?: number;
};

export type StepType = "plan" | "tool_call" | "evidence" | "hypothesis" | "test" | "contradiction" | "verified" | "report" | "error";

export type Step = { i: number; type: StepType; title: string; detail: string; at: string };

export type Hypothesis = {
  id: string;
  statement: string;
  status: "proposed" | "supported" | "contradicted";
  evidence_ids: string[];
};

export type FindingStatus = "verified" | "observed" | "inferred" | "unknown";

export type Finding = {
  claim: string;
  file: string | null;
  line: number | null;
  symbol: string | null;
  evidence_ids: string[];
  status: FindingStatus;
};

export type FlowStep = {
  order: number;
  title: string;
  description: string;
  file: string | null;
  line: number | null;
  symbol: string | null;
  verified: boolean;
};

export type GraphNode = { id: string; label: string; type: "function" | "class" | "file" | "endpoint" | "database" | "page" | "binary"; file: string | null };
export type GraphEdge = { id: string; source: string; target: string; label: "calls" | "leads_to" | "imports" | "reads" | "writes" | "links_to" | "requests" };

export type ConfidenceBreakdown = {
  score: number;
  verifiedRatio: number;
  evidenceCount: number;
  distinctFiles: number;
  directObservations: number;
  contradictions: number;
};

export type Report = {
  short_answer: string;
  flow: FlowStep[];
  findings: Finding[];
  contradictions: { description: string; evidence_ids: string[] }[];
  unknowns: string[];
  technical_details: string;
  graph: { nodes: GraphNode[]; edges: GraphEdge[] };
  confidence: ConfidenceBreakdown;
};

export type Plan = { objective: string; steps: string[]; search_terms: string[] };

export type TargetType = "repo" | "web" | "runtime" | "binary" | "visual";

export const TARGET_MODE: Record<TargetType, string> = {
  repo: "White-box",
  web: "Black-box",
  runtime: "Gray-box",
  binary: "Static",
  visual: "Visual",
};
