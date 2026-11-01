import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  FlaskConical,
  Lightbulb,
  ListChecks,
  Loader2,
  Search,
  Wrench,
  FileText,
  Database,
  GitFork,
  Share2,
  FileCode2,
  Image,
  Terminal,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { advanceInvestigation } from "@/lib/recon/investigations.functions";
import type {
  Evidence,
  GraphEdge,
  GraphNode,
  Hypothesis,
  Report,
  Step,
  TargetType,
} from "@/lib/recon/types";
import { TARGET_MODE } from "@/lib/recon/types";
import { ConfidenceMeter, ModeBadge, StatusBadge } from "@/components/recon/badges";
import { FilteredEvidenceGraph } from "@/components/recon/FilteredEvidenceGraph";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { InvestigationActions } from "@/components/recon/InvestigationActions";
import { ReportWorkspace } from "@/components/recon/ReportWorkspace";
import {
  InvestigationExecutiveHUD,
  VisualFlowPipeline,
  VisualFindingsMatrix,
  RichEvidenceItem,
  FormattedTechnicalDetails,
} from "@/components/recon/InvestigationVisuals";
import { reportTab } from "@/lib/recon/product";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/investigations/$id")({
  head: () => ({
    meta: [
      { title: "Investigation — RECON" },
      {
        name: "description",
        content: "Investigation timeline, evidence graph, and evidence-backed findings.",
      },
      { property: "og:title", content: "Investigation — RECON" },
      {
        property: "og:description",
        content: "Investigation timeline, evidence graph, and evidence-backed findings.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InvestigationPage,
});

const STEP_ICON: Record<Step["type"], typeof Search> = {
  plan: ListChecks,
  tool_call: Wrench,
  evidence: Search,
  hypothesis: Lightbulb,
  test: FlaskConical,
  contradiction: AlertTriangle,
  verified: CheckCircle2,
  report: FileText,
  error: AlertTriangle,
};
const STEP_TONE: Partial<Record<Step["type"], string>> = {
  contradiction: "text-warning",
  verified: "text-success",
  error: "text-destructive",
  tool_call: "text-accent",
  plan: "text-primary",
};

function InvestigationPage() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const advance = useServerFn(advanceInvestigation);
  const generation = useRef(0);
  const [working, setWorking] = useState(false);

  const {
    data: inv,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["investigation", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investigations")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const active = inv && (inv.status === "queued" || inv.status === "running");
  useEffect(() => {
    if (!active) return;
    const request = ++generation.current;
    setWorking(true);
    (async () => {
      try {
        for (let i = 0; i < 300 && request === generation.current; i++) {
          const r = await advance({ data: { id } });
          await qc.invalidateQueries({ queryKey: ["investigation", id] });
          if (!["queued", "running"].includes(r.status)) break;
          await new Promise((resolve) => setTimeout(resolve, 750));
        }
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Investigation interrupted. Refresh to continue.",
        );
      } finally {
        if (request === generation.current) setWorking(false);
        qc.invalidateQueries({ queryKey: ["investigations"] });
      }
    })();
    return () => {
      generation.current += 1;
    };
  }, [active, id, advance, qc]);

  const steps = (inv?.steps ?? []) as unknown as Step[];
  const evidence = (inv?.evidence ?? []) as unknown as Evidence[];
  const hypotheses = (inv?.hypotheses ?? []) as unknown as Hypothesis[];
  const report = inv?.report as unknown as Report | null;

  const liveGraph = useMemo(() => {
    if (report) return report.graph;
    const nodes = new Map<string, GraphNode>();
    const edges: GraphEdge[] = [];
    for (const e of evidence) {
      if (e.kind === "call_relationship") {
        const [a = "?", b = "?"] = e.title.split(" → ");
        nodes.set(a, { id: a, label: a, type: "function", file: e.file });
        if (!nodes.has(b)) nodes.set(b, { id: b, label: b, type: "function", file: null });
        edges.push({ id: e.id, source: a, target: b, label: "calls" });
      } else if (
        e.kind === "function" ||
        e.kind === "class" ||
        e.kind === "API_endpoint" ||
        e.kind === "database_reference" ||
        e.kind === "http_endpoint" ||
        e.kind === "form" ||
        e.kind === "probe" ||
        e.kind === "page" ||
        e.kind === "imported_symbol" ||
        e.kind === "visual_frame"
      ) {
        const label = e.title.replace(/^(function|class|method) /, "");
        const id = e.kind === "function" || e.kind === "class" ? label : e.id;
        const type: GraphNode["type"] =
          e.kind === "API_endpoint" ||
          e.kind === "http_endpoint" ||
          e.kind === "form" ||
          e.kind === "probe"
            ? "endpoint"
            : e.kind === "database_reference"
              ? "database"
              : e.kind === "page" || e.kind === "visual_frame"
                ? "page"
                : e.kind === "imported_symbol"
                  ? "binary"
                  : e.kind === "class"
                    ? "class"
                    : "function";
        if (!nodes.has(id)) nodes.set(id, { id, label, type, file: e.file });
      }
    }
    return {
      nodes: [...nodes.values()].slice(0, 40),
      edges: edges.filter((x) => nodes.has(x.source) && nodes.has(x.target)),
    };
  }, [evidence, report]);

  if (isError)
    return (
      <main className="mx-auto max-w-xl p-8">
        <h1 className="text-xl font-semibold">Investigation unavailable</h1>
        <p className="my-4 text-muted-foreground">
          {error instanceof Error
            ? error.message
            : "It may have been deleted or could not be loaded."}
        </p>
        <Button onClick={() => refetch()}>Try again</Button>
        <Button asChild variant="ghost">
          <Link to="/dashboard">Investigations</Link>
        </Button>
      </main>
    );
  if (!inv)
    return (
      <div className="grid h-64 place-items-center">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Investigations
      </Link>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-foreground">{inv.title || inv.question}</h1>
          <p className="mt-1 font-mono text-xs text-muted-foreground">{inv.target_ref}</p>
        </div>
        <div className="flex items-center gap-3">
          <ModeBadge mode={TARGET_MODE[(inv.target_type as TargetType) ?? "repo"] ?? "White-box"} />
          <StatusBadge status={inv.status} />
          <span className="font-mono text-xs text-muted-foreground">
            step {inv.step_count}/{inv.max_steps} · {evidence.length} evidence
          </span>
        </div>
      </div>
      {inv.status === "failed" && (
        <div className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {inv.error}
        </div>
      )}

      <InvestigationActions
        id={id}
        status={inv.status}
        title={inv.title || inv.question}
        report={report}
        evidence={evidence}
      />
      {report && (
        <InvestigationExecutiveHUD
          report={report}
          evidence={evidence}
          hypotheses={hypotheses}
        />
      )}

      {active && (
        <p className="mt-4 text-sm text-muted-foreground">
          Stop prevents subsequent work and saving late results; an already-issued AI request may
          finish. Keep this page open while analysis advances. Leaving stops automatic progress;
          return to continue from saved evidence.
        </p>
      )}
      <div
        className={cn(
          "mt-6 grid grid-cols-[minmax(0,1fr)] gap-6",
          inv.target_type === "visual"
            ? "lg:grid-cols-[240px_minmax(0,1fr)]"
            : "lg:grid-cols-[300px_minmax(0,1fr)]",
        )}
      >
        <section className="min-w-0 rounded-xl border border-border/80 bg-card">
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
            <h2 className="text-sm font-semibold text-foreground">Live Timeline</h2>
            {working && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
          </div>
          <ol className="max-h-[640px] space-y-1 overflow-y-auto p-3">
            {steps.map((s) => (
              <TimelineItem key={s.i} step={s} />
            ))}
            {working && (
              <li className="px-2 py-2 font-mono text-xs text-muted-foreground animate-pulse">agent advancing scan…</li>
            )}
          </ol>
        </section>

        <section className="min-w-0">
          <Tabs
            key={`${id}-${Boolean(report)}`}
            defaultValue={reportTab(inv.target_type, Boolean(report))}
          >
            <TabsList className="h-auto flex-wrap gap-1 rounded-xl border border-border/80 bg-muted/40 p-1">
              {report && (
                <TabsTrigger
                  value="flow"
                  className="flex items-center gap-1.5 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
                >
                  <GitFork className="h-3.5 w-3.5 text-primary" />
                  <span>Flow ({report.flow.length})</span>
                </TabsTrigger>
              )}
              <TabsTrigger
                value="graph"
                className="flex items-center gap-1.5 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
              >
                <Share2 className="h-3.5 w-3.5 text-cyan-400" />
                <span>Graph ({liveGraph.nodes.length})</span>
              </TabsTrigger>
              {report && (
                <TabsTrigger
                  value="findings"
                  className="flex items-center gap-1.5 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Findings ({report.findings.length})</span>
                </TabsTrigger>
              )}
              <TabsTrigger
                value="evidence"
                className="flex items-center gap-1.5 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
              >
                <FileCode2 className="h-3.5 w-3.5 text-primary" />
                <span>Evidence ({evidence.length})</span>
              </TabsTrigger>
              {inv.target_type === "visual" && (
                <TabsTrigger
                  value="screens"
                  className="flex items-center gap-1.5 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
                >
                  <Image className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Screens ({evidence.filter((e) => e.kind === "visual_frame").length})</span>
                </TabsTrigger>
              )}
              <TabsTrigger
                value="hypotheses"
                className="flex items-center gap-1.5 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
              >
                <FlaskConical className="h-3.5 w-3.5 text-purple-400" />
                <span>Hypotheses ({hypotheses.length})</span>
              </TabsTrigger>
              {report && (
                <TabsTrigger
                  value="details"
                  className="flex items-center gap-1.5 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
                >
                  <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Technical Spec</span>
                </TabsTrigger>
              )}
            </TabsList>

            {report && (
              <TabsContent value="flow" className="mt-4">
                <VisualFlowPipeline flow={report.flow} evidence={evidence} />
              </TabsContent>
            )}
            <TabsContent value="graph" className="mt-4">
              <FilteredEvidenceGraph
                key={id}
                nodes={liveGraph.nodes}
                edges={liveGraph.edges}
                findings={report?.findings ?? []}
                evidence={evidence}
              />
            </TabsContent>
            {report && (
              <TabsContent value="findings" className="mt-4">
                <VisualFindingsMatrix report={report} evidence={evidence} />
              </TabsContent>
            )}
            <TabsContent value="evidence" className="mt-4">
              <div className="space-y-2.5">
                {evidence
                  .slice()
                  .reverse()
                  .map((e) => (
                    <RichEvidenceItem key={e.id} e={e} />
                  ))}
              </div>
            </TabsContent>
            {inv.target_type === "visual" && (
              <TabsContent value="screens" className="mt-4">
                <div
                  className={cn(
                    "grid gap-4",
                    evidence.filter((e) => e.kind === "visual_frame").length > 1 &&
                      "sm:grid-cols-2",
                  )}
                >
                  {evidence
                    .filter((e) => e.kind === "visual_frame")
                    .map((e) => (
                      <figure
                        key={e.id}
                        className="min-w-0 overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm"
                      >
                        {e.image && (
                          <img
                            src={e.image}
                            alt={e.title}
                            className="aspect-video w-full bg-muted object-contain"
                          />
                        )}
                        <figcaption className="p-3">
                          <p className="font-mono text-xs text-primary">
                            {e.id} · {e.timestamp?.toFixed(1)}s
                          </p>
                          <p className="mt-1 text-sm font-semibold text-foreground">{e.title}</p>
                          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-muted-foreground">
                            {e.snippet}
                          </p>
                        </figcaption>
                      </figure>
                    ))}
                </div>
              </TabsContent>
            )}
            <TabsContent value="hypotheses" className="mt-4">
              <div className="space-y-2.5">
                {hypotheses.map((h) => (
                  <div key={h.id} className="rounded-xl border border-border/80 bg-card p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{h.id}</span>
                      <StatusBadge
                        status={
                          h.status === "supported"
                            ? "verified"
                            : h.status === "contradicted"
                              ? "failed"
                              : "unknown"
                        }
                      />
                    </div>
                    <p className="mt-2 text-sm text-foreground">{h.statement}</p>
                    {h.evidence_ids.length > 0 && (
                      <p className="mt-1 font-mono text-xs text-muted-foreground">
                        {h.evidence_ids.join(", ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
            {report && (
              <TabsContent value="details" className="mt-4">
                <FormattedTechnicalDetails report={report} />
              </TabsContent>
            )}
          </Tabs>
        </section>
      </div>
      {report && <ReportWorkspace id={id} target={inv.target_type as TargetType} report={report} evidence={evidence} />}
      {report && (
        <section className="print-report hidden">
          <h2>Findings</h2>
          <Findings report={report} />
          <h2>Evidence</h2>
          {evidence.map((e) => (
            <article key={e.id}>
              <h3>
                {e.id}: {e.title}
              </h3>
              {e.image && <img src={e.image} alt={e.title} />}
              <p>{e.snippet}</p>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

function ReportSummary({ report }: { report: Report }) {
  return (
    <section className="mt-6 border-y border-border py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-xs uppercase tracking-widest text-primary">Short answer</p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Evidence score</span>
          <ConfidenceMeter value={report.confidence.score} />
        </div>
      </div>
      <p className="mt-3 text-lg leading-relaxed text-foreground">{report.short_answer}</p>
      <p className="mt-3 text-sm text-muted-foreground">
        This score measures evidence coverage, not the probability that an answer is correct.
        Verified means references were checked; it does not prove every claim.
      </p>
      {report.confidence.score < 40 && (
        <p className="mt-2 text-sm text-warning">
          Limited evidence. Add the starting screen, important changes, and final result for a more
          complete visual investigation, or provide more relevant source evidence.
        </p>
      )}
      {report.unknowns.length > 0 && (
        <details className="mt-3">
          <summary className="cursor-pointer text-sm font-medium">
            What remains unknown ({report.unknowns.length})
          </summary>
          <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
            {report.unknowns.map((u, i) => (
              <li key={i}>{u}</li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}

function Findings({ report }: { report: Report }) {
  const groups = ["verified", "observed", "inferred", "unknown"] as const;
  return (
    <div className="space-y-6">
      {groups.map((g) => {
        const items = report.findings.filter((f) => f.status === g);
        if (!items.length) return null;
        return (
          <div key={g}>
            <StatusBadge status={g} />
            <ul className="mt-2 space-y-2">
              {items.map((f, i) => (
                <li key={i} className="rounded-lg border border-border bg-card p-4">
                  <p className="text-sm text-foreground">{f.claim}</p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    {f.file ?? "no file reference"}
                    {f.line ? `:${f.line}` : ""}
                    {f.symbol ? ` · ${f.symbol}` : ""}
                    {f.evidence_ids.length ? ` · ${f.evidence_ids.join(", ")}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
      {report.contradictions.length > 0 && (
        <div>
          <p className="flex items-center gap-2 text-sm font-medium text-warning">
            <AlertTriangle className="h-4 w-4" /> Contradictions
          </p>
          <ul className="mt-2 space-y-2">
            {report.contradictions.map((c, i) => (
              <li
                key={i}
                className="rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm text-foreground"
              >
                {c.description}{" "}
                <span className="font-mono text-xs text-muted-foreground">
                  {c.evidence_ids.join(", ")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {report.unknowns.length > 0 && (
        <div>
          <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <CircleHelp className="h-4 w-4" /> Unknowns
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-muted-foreground">
            {report.unknowns.map((u, i) => (
              <li key={i}>{u}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function TimelineItem({ step }: { step: Step }) {
  const [open, setOpen] = useState(false);
  const Icon = STEP_ICON[step.type] ?? Search;
  return (
    <li className="rounded-md px-2 py-2 hover:bg-muted/50">
      <button className="flex w-full items-start gap-2 text-left" onClick={() => setOpen(!open)}>
        <Icon
          className={cn("mt-0.5 h-4 w-4 shrink-0 text-muted-foreground", STEP_TONE[step.type])}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-xs text-foreground">{step.title}</p>
          <p className="font-mono text-[10px] uppercase text-muted-foreground">
            {step.type.replace("_", " ")}
          </p>
        </div>
        {step.detail && (
          <ChevronDown
            className={cn(
              "h-3 w-3 text-muted-foreground transition-transform",
              open && "rotate-180",
            )}
          />
        )}
      </button>
      {open && step.detail && (
        <pre className="mt-2 whitespace-pre-wrap rounded bg-background p-2 font-mono text-[11px] text-muted-foreground">
          {step.detail}
        </pre>
      )}
    </li>
  );
}

function EvidenceItem({ e }: { e: Evidence }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-border bg-card">
      <button
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="font-mono text-xs text-primary">{e.id}</span>
        <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] uppercase text-muted-foreground">
          {e.kind === "database_reference" ? <Database className="inline h-3 w-3" /> : null}{" "}
          {e.kind.replace("_", " ")}
        </span>
        <span className="min-w-0 flex-1 truncate font-mono text-xs text-foreground">{e.title}</span>
        <span className="font-mono text-[10px] text-muted-foreground">{e.tool}</span>
        <ChevronDown
          className={cn("h-3 w-3 text-muted-foreground transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <>
          {e.image && (
            <img
              src={e.image}
              alt={e.title}
              className="max-h-96 w-full border-t border-border bg-muted object-contain"
            />
          )}
          <pre className="overflow-x-auto border-t border-border bg-background p-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
            {e.snippet}
          </pre>
        </>
      )}
    </div>
  );
}
