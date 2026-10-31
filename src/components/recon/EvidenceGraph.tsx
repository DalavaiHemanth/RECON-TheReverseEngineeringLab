import { useEffect, useMemo } from "react";
import { ReactFlow, ReactFlowProvider, Background, Controls, MarkerType, useReactFlow, type Edge, type Node } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { GraphEdge, GraphNode } from "@/lib/recon/types";

const TYPE_CLASS: Record<GraphNode["type"], string> = {
  function: "border-primary/60 text-primary",
  class: "border-accent/60 text-accent",
  file: "border-border text-foreground",
  endpoint: "border-warning/60 text-warning",
  database: "border-success/60 text-success",
  page: "border-accent/60 text-accent",
  binary: "border-success/60 text-success",
};

type GraphProps = { nodes: GraphNode[]; edges: GraphEdge[]; highlightMatches?: boolean; selectedEdgeId?: string | undefined; onSelectEdge?: (id: string) => void };

function GraphCanvas({ nodes, edges, highlightMatches, selectedEdgeId, onSelectEdge }: GraphProps) {
  const { fitView } = useReactFlow();

  const { rfNodes, rfEdges } = useMemo(() => {
    // Layered layout: depth = longest path from a root.
    const depth = new Map<string, number>(nodes.map((n) => [n.id, 0]));
    for (let k = 0; k < nodes.length; k++)
      for (const e of edges) {
        const d = (depth.get(e.source) ?? 0) + 1;
        if (d > (depth.get(e.target) ?? 0) && d < nodes.length) depth.set(e.target, d);
      }
    const cols = new Map<number, number>();
    const rfNodes: Node[] = nodes.map((n) => {
      const d = depth.get(n.id) ?? 0;
      const row = cols.get(d) ?? 0;
      cols.set(d, row + 1);
      return {
        id: n.id,
        position: { x: row * 230, y: d * 110 },
        data: {
          label: (
            <div className={`rounded-md border bg-card px-3 py-2 text-left ${TYPE_CLASS[n.type]}`}>
              <div className="font-mono text-[10px] uppercase opacity-70">{n.type}</div>
              <div className="truncate font-mono text-xs">{n.label}</div>
              {n.file && <div className="truncate text-[10px] text-muted-foreground">{n.file}</div>}
            </div>
          ),
        },
        style: { background: "transparent", border: "none", padding: 0, width: 200 },
      };
    });
    const rfEdges: Edge[] = edges.map((e) => ({
      id: e.id, source: e.source, target: e.target, label: e.label, animated: e.label === "leads_to",
      ariaLabel: `Connection: ${nodes.find((node) => node.id === e.source)?.label ?? e.source} ${e.label} ${nodes.find((node) => node.id === e.target)?.label ?? e.target}`,
      focusable: true,
      interactionWidth: 24,
      markerEnd: { type: MarkerType.ArrowClosed, color: e.id === selectedEdgeId ? "var(--accent)" : highlightMatches ? "var(--warning)" : "var(--primary)" },
      style: { stroke: e.id === selectedEdgeId ? "var(--accent)" : highlightMatches ? "var(--warning)" : e.label === "calls" ? "var(--accent)" : "var(--primary)", strokeWidth: e.id === selectedEdgeId ? 4 : highlightMatches ? 3 : 1 },
      labelStyle: { fill: highlightMatches ? "var(--warning)" : "var(--muted-foreground)", fontSize: 10 },
      labelBgStyle: { fill: "var(--background)" },
    }));
    return { rfNodes, rfEdges };
  }, [nodes, edges, highlightMatches, selectedEdgeId]);

  // Refit whenever the graph content changes — nodes may arrive after mount
  // (report loads async) and the initial fitView would otherwise frame nothing.
  useEffect(() => {
    if (!rfNodes.length) return;
    const t = setTimeout(() => fitView({ padding: 0.2 }), 50);
    return () => clearTimeout(t);
  }, [nodes, edges, fitView]);

  return (
    <ReactFlow nodes={rfNodes} edges={rfEdges} onEdgeClick={(_, edge) => onSelectEdge?.(edge.id)} fitView proOptions={{ hideAttribution: true }} colorMode="dark">
      <Background color="var(--border)" gap={24} />
      <Controls showInteractive={false} />
    </ReactFlow>
  );
}

export function EvidenceGraph({ nodes, edges, ...props }: GraphProps) {
  if (!nodes.length) return <div className="grid h-full place-items-center text-sm text-muted-foreground">Graph builds as evidence arrives</div>;
  return (
    <ReactFlowProvider>
      <GraphCanvas nodes={nodes} edges={edges} {...props} />
    </ReactFlowProvider>
  );
}
