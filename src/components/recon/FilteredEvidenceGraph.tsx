import { useMemo, useState } from "react";
import { ArrowRight, Filter, RotateCcw } from "lucide-react";
import type { Evidence, Finding, FindingStatus, GraphEdge, GraphNode } from "@/lib/recon/types";
import { connectionExplanation, filterGraph, GRAPH_CONFIDENCE, GRAPH_NODE_TYPES } from "@/lib/recon/graph-filters";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EvidenceGraph } from "./EvidenceGraph";
import { StatusBadge } from "./badges";

export function FilteredEvidenceGraph({ nodes, edges, findings, evidence }: { nodes: GraphNode[]; edges: GraphEdge[]; findings: Finding[]; evidence: Evidence[] }) {
  const [types, setTypes] = useState<GraphNode["type"][]>(GRAPH_NODE_TYPES);
  const [confidence, setConfidence] = useState<FindingStatus | "all">("all");
  const [selectedEdgeId, setSelectedEdgeId] = useState<string>();
  const available = GRAPH_NODE_TYPES.filter((type) => nodes.some((node) => node.type === type));
  const selectedCount = available.filter((type) => types.includes(type)).length;
  const filtered = useMemo(() => filterGraph(nodes, edges, types, confidence, findings, evidence), [nodes, edges, types, confidence, findings, evidence]);
  const active = selectedCount !== available.length || confidence !== "all";
  const selectedEdge = filtered.edges.find((edge) => edge.id === selectedEdgeId) ?? filtered.edges[0];
  const explanation = selectedEdge ? connectionExplanation(selectedEdge, nodes, types, confidence, findings, evidence) : null;
  const reset = () => { setTypes(GRAPH_NODE_TYPES); setConfidence("all"); setSelectedEdgeId(undefined); };

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex flex-wrap items-center gap-3 border-b border-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" aria-label="Filter node types"><Filter />Node types{selectedCount !== available.length ? ` (${selectedCount}/${available.length})` : ""}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Node types</DropdownMenuLabel>
            {available.map((type) => <DropdownMenuCheckboxItem key={type} checked={types.includes(type)} onSelect={(event) => event.preventDefault()} onCheckedChange={(checked) => setTypes((current) => checked ? [...current, type] : current.filter((value) => value !== type))}>
              <span className="capitalize">{type}</span><span className="ml-4 font-mono text-xs text-muted-foreground">{nodes.filter((node) => node.type === type).length}</span>
            </DropdownMenuCheckboxItem>)}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center gap-2">
          <span id="graph-confidence-label" className="text-xs text-muted-foreground">Evidence confidence</span>
          <Select value={confidence} onValueChange={(value) => { if (value === "all" || GRAPH_CONFIDENCE.includes(value as FindingStatus)) setConfidence(value as FindingStatus | "all"); }}>
            <SelectTrigger aria-labelledby="graph-confidence-label" className="h-8 w-36 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">All confidence</SelectItem>{GRAPH_CONFIDENCE.map((status) => <SelectItem key={status} value={status}><span className="capitalize">{status}</span></SelectItem>)}</SelectContent>
          </Select>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!active} aria-label="Reset graph filters" title="Reset graph filters" onClick={reset}><RotateCcw /></Button>
        <span role="status" aria-live="polite" className="font-mono text-xs text-muted-foreground">{filtered.nodes.length}/{nodes.length} nodes · {filtered.edges.length}/{edges.length} connections</span>
      </div>
      <div className="h-[600px]">
        {filtered.nodes.length ? <EvidenceGraph nodes={filtered.nodes} edges={filtered.edges} highlightMatches={active} selectedEdgeId={selectedEdge?.id} onSelectEdge={setSelectedEdgeId} /> : nodes.length ?
          <div className="grid h-full place-content-center justify-items-center gap-3 text-sm text-muted-foreground"><p>No nodes match these filters</p><Button variant="outline" size="sm" onClick={reset}><RotateCcw />Reset filters</Button></div> :
          <EvidenceGraph nodes={nodes} edges={edges} />}
      </div>
      {selectedEdge && explanation && (
        <section aria-label="Connection inclusion details" className="border-t border-border p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-medium text-foreground">Why this connection is included</h3>
            <Select value={selectedEdge.id} onValueChange={setSelectedEdgeId}>
              <SelectTrigger aria-label="Inspect connection" className="w-full min-w-0 sm:max-w-sm"><SelectValue /></SelectTrigger>
              <SelectContent>{filtered.edges.map((edge, index) => <SelectItem key={edge.id} value={edge.id}>{index + 1}. {nodes.find((node) => node.id === edge.source)?.label} → {nodes.find((node) => node.id === edge.target)?.label} ({edge.label})</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><ArrowRight className="h-4 w-4 shrink-0" />{selectedEdge.label.replaceAll("_", " ")} · Both endpoint types are selected; {confidence === "all" ? "all confidence levels are included." : `both endpoints match ${confidence} confidence.`}</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {explanation.endpoints.map(({ node, status, evidence: supportingEvidence, findings: supportingFindings }, index) => (
              <div key={`${index}-${node.id}`} className="min-w-0">
                <p className="text-xs text-muted-foreground">{index === 0 ? "Source" : "Target"} · <span className="capitalize">{node.type}</span></p>
                <p className="mt-1 break-words font-mono text-xs text-foreground">{node.label}</p>
                <p className="mt-1 break-all font-mono text-[11px] text-muted-foreground">{node.file ?? node.id}</p>
                <div className="mt-2"><StatusBadge status={status} /></div>
                {supportingFindings.length ? <ul className="mt-2 space-y-2 text-xs text-muted-foreground">{supportingFindings.map((finding, i) => <li key={i} className="break-words">{finding.claim}{finding.evidence_ids.length > 0 && <span className="font-mono"> · {finding.evidence_ids.join(", ")}</span>}</li>)}</ul> : <p className="mt-2 text-xs text-muted-foreground">{supportingEvidence.length ? "Collected evidence; no matching report finding." : "No associated evidence or report finding."}</p>}
                {supportingEvidence.map((item) => <details key={item.id} className="mt-2 text-xs text-muted-foreground"><summary className="cursor-pointer break-words"><span className="font-mono text-primary">{item.id}</span> · {item.title}</summary><pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-words font-mono text-[11px]">{item.snippet}</pre></details>)}
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Inclusion follows endpoint filters; it does not independently verify the relationship.</p>
        </section>
      )}
    </div>
  );
}