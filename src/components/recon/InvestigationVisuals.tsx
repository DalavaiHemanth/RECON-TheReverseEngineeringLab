import { useState } from "react";
import {
  AlertTriangle,
  Check,
  ChevronDown,
  CircleHelp,
  Code2,
  Copy,
  Cpu,
  Database,
  Eye,
  FileCode2,
  Globe,
  KeyRound,
  Layers,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/recon/badges";
import type { Evidence, FlowStep, Hypothesis, Report } from "@/lib/recon/types";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// 1. EXECUTIVE HUD (Radial Score, Visual Breakdown, Architecture Verdict)
// ---------------------------------------------------------------------------
export function InvestigationExecutiveHUD({
  report,
  evidence = [],
  hypotheses = [],
}: {
  report: Report;
  evidence?: Evidence[];
  hypotheses?: Hypothesis[];
}) {
  const [copied, setCopied] = useState(false);
  const [unknownsOpen, setUnknownsOpen] = useState(false);

  const score = report?.confidence?.score ?? 0;
  const findings = Array.isArray(report?.findings) ? report.findings : [];
  const verifiedCount = findings.filter((f) => f.status === "verified").length;
  const observedCount = findings.filter((f) => f.status === "observed").length;
  const inferredCount = findings.filter((f) => f.status === "inferred").length;
  const unknowns = Array.isArray(report?.unknowns) ? report.unknowns : [];
  const safeEvidence = Array.isArray(evidence) ? evidence : [];
  const safeHypotheses = Array.isArray(hypotheses) ? hypotheses : [];
  const distinctFiles = report?.confidence?.distinctFiles ?? 0;
  const shortAnswer = report?.short_answer || "Investigation completed. See flow, graph, and findings below.";

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const scoreTone =
    score >= 70
      ? { stroke: "#10b981", text: "text-emerald-400", label: "HIGH CONFIDENCE" }
      : score >= 40
        ? { stroke: "#f59e0b", text: "text-amber-400", label: "MODERATE COVERAGE" }
        : { stroke: "#ef4444", text: "text-red-400", label: "LIMITED EVIDENCE" };

  const handleCopy = () => {
    void navigator.clipboard.writeText(shortAnswer);
    setCopied(true);
    toast.success("Short answer copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="mt-6 rounded-xl border border-border/80 bg-gradient-to-b from-card/90 to-card/40 p-5 shadow-lg backdrop-blur">
      <div className="grid gap-6 lg:grid-cols-[220px_1fr_260px]">
        {/* Radial Score Gauge */}
        <div className="flex flex-col items-center justify-center rounded-lg border border-border/50 bg-background/50 p-4 text-center">
          <p className="font-mono text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            Evidence Score
          </p>
          <div className="relative my-3 flex items-center justify-center">
            <svg className="h-28 w-28 -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-muted/30"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke={scoreTone.stroke}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className={cn("font-mono text-2xl font-bold tracking-tight", scoreTone.text)}>
                {score}%
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                GROUNDED
              </span>
            </div>
          </div>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 font-mono text-[10px] font-medium tracking-wide",
              scoreTone.text,
              "border border-current/30 bg-current/10",
            )}
          >
            {scoreTone.label}
          </span>
        </div>

        {/* Verdict & Short Answer */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
                <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
                  Executive Verdict
                </h2>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded border border-border/60 bg-muted/30 px-2 py-1 font-mono text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                title="Copy short answer"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="mt-2 text-base leading-relaxed font-medium text-foreground">
              {shortAnswer}
            </p>
          </div>

          {/* Unknowns drawer */}
          {unknowns.length > 0 && (
            <div className="mt-4 border-t border-border/60 pt-3">
              <button
                onClick={() => setUnknownsOpen(!unknownsOpen)}
                className="flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <CircleHelp className="h-3.5 w-3.5 text-amber-400" />
                <span>
                  {unknowns.length} unresolved area{unknowns.length > 1 ? "s" : ""}
                </span>
                <ChevronDown
                  className={cn("h-3 w-3 transition-transform", unknownsOpen && "rotate-180")}
                />
              </button>
              {unknownsOpen && (
                <ul className="mt-2 space-y-1.5 rounded-lg border border-border/50 bg-background/60 p-3 text-xs text-muted-foreground">
                  {unknowns.map((u, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400/80" />
                      <span>{u}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Scan Architecture Metrics */}
        <div className="flex flex-col justify-between rounded-lg border border-border/50 bg-background/50 p-4">
          <p className="font-mono text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            Evidence Profile
          </p>
          <div className="grid grid-cols-2 gap-2 my-2">
            <div className="rounded border border-border/60 bg-card/60 p-2.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <FileCode2 className="h-3.5 w-3.5 text-primary" />
                <span>Evidence</span>
              </div>
              <p className="mt-1 font-mono text-lg font-bold text-foreground">
                {safeEvidence.length}
              </p>
            </div>
            <div className="rounded border border-border/60 bg-card/60 p-2.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Verified</span>
              </div>
              <p className="mt-1 font-mono text-lg font-bold text-emerald-400">
                {verifiedCount}
              </p>
            </div>
            <div className="rounded border border-border/60 bg-card/60 p-2.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Eye className="h-3.5 w-3.5 text-cyan-400" />
                <span>Observed</span>
              </div>
              <p className="mt-1 font-mono text-lg font-bold text-cyan-400">
                {observedCount}
              </p>
            </div>
            <div className="rounded border border-border/60 bg-card/60 p-2.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Layers className="h-3.5 w-3.5 text-amber-400" />
                <span>Inferred</span>
              </div>
              <p className="mt-1 font-mono text-lg font-bold text-amber-400">
                {inferredCount}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-border/50 pt-2 font-mono text-[11px] text-muted-foreground">
            <span>Hypotheses: {safeHypotheses.length}</span>
            <span>Files: {distinctFiles}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 2. INTERACTIVE VISUAL FLOW PIPELINE
// ---------------------------------------------------------------------------
export function VisualFlowPipeline({
  flow = [],
  evidence = [],
}: {
  flow: FlowStep[];
  evidence: Evidence[];
}) {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const getStepIcon = (title: string = "") => {
    const t = (title || "").toLowerCase();
    if (t.includes("auth") || t.includes("login") || t.includes("token") || t.includes("secret"))
      return KeyRound;
    if (t.includes("api") || t.includes("route") || t.includes("request") || t.includes("endpoint") || t.includes("http"))
      return Globe;
    if (t.includes("db") || t.includes("database") || t.includes("query") || t.includes("table") || t.includes("sql"))
      return Database;
    if (t.includes("ui") || t.includes("view") || t.includes("render") || t.includes("screen") || t.includes("click"))
      return Eye;
    if (t.includes("state") || t.includes("memory") || t.includes("worker") || t.includes("logic"))
      return Cpu;
    return Code2;
  };

  const safeFlow = Array.isArray(flow) ? flow : [];
  const safeEvidence = Array.isArray(evidence) ? evidence : [];

  if (safeFlow.length === 0) {
    return (
      <div className="rounded-xl border border-border/80 bg-card p-6 text-center text-sm text-muted-foreground">
        No flow steps generated for this target yet. Explore the Graph or Findings tabs.
      </div>
    );
  }

  return (
    <div className="relative pl-6 before:absolute before:bottom-3 before:left-3 before:top-3 before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-border before:to-transparent">
      <div className="space-y-4">
        {safeFlow.map((f, idx) => {
          const stepOrder = f.order ?? idx + 1;
          const Icon = getStepIcon(f.title);
          const isExpanded = expandedStep === stepOrder;

          // Safe matching for supporting evidence
          const stepEvidenceIds: string[] = (f as unknown as { evidence_ids?: string[] }).evidence_ids ?? [];
          const citedEvidence = safeEvidence.filter((e) => {
            if (stepEvidenceIds.length > 0 && stepEvidenceIds.includes(e.id)) return true;
            if (f.file && e.file && (e.file.includes(f.file) || f.file.includes(e.file))) return true;
            if (f.symbol && e.snippet && e.snippet.includes(f.symbol)) return true;
            return false;
          });

          return (
            <div
              key={stepOrder}
              className={cn(
                "group relative rounded-xl border border-border/80 bg-card p-4 transition-all duration-200 hover:border-primary/50 hover:shadow-md",
                f.verified ? "border-l-4 border-l-emerald-500" : "border-l-4 border-l-amber-500",
              )}
            >
              {/* Step indicator dot on timeline */}
              <span className="absolute -left-[30px] top-4.5 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background font-mono text-xs font-semibold text-foreground shadow-sm">
                {stepOrder}
              </span>

              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="rounded-md border border-border/60 bg-muted/40 p-1.5 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
                    {f.file && (
                      <p className="font-mono text-xs text-primary/90">
                        {f.file}
                        {f.line ? `:${f.line}` : ""}
                        {f.symbol ? ` · ${f.symbol}` : ""}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={f.verified ? "verified" : "inferred"} />
                </div>
              </div>

              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{f.description}</p>

              {/* Supporting evidence chips if any match */}
              {citedEvidence.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/50 pt-2.5">
                  <span className="font-mono text-[10px] uppercase text-muted-foreground">
                    Supporting Evidence:
                  </span>
                  {citedEvidence.slice(0, 4).map((ev) => (
                    <button
                      key={ev.id}
                      onClick={() => setExpandedStep(isExpanded ? null : stepOrder)}
                      className="rounded border border-primary/30 bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] text-primary hover:bg-primary/20"
                    >
                      {ev.id}
                    </button>
                  ))}
                  <button
                    onClick={() => setExpandedStep(isExpanded ? null : stepOrder)}
                    className="ml-auto flex items-center gap-1 font-mono text-[11px] text-muted-foreground hover:text-foreground"
                  >
                    <span>{isExpanded ? "Hide" : "Inspect"} snippet</span>
                    <ChevronDown
                      className={cn("h-3 w-3 transition-transform", isExpanded && "rotate-180")}
                    />
                  </button>
                </div>
              )}

              {/* Inline snippet preview */}
              {isExpanded && citedEvidence.length > 0 && (
                <div className="mt-3 space-y-2 rounded-lg border border-border/80 bg-background/80 p-3">
                  {citedEvidence.map((ev) => (
                    <div key={ev.id} className="min-w-0">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-medium text-primary">
                          {ev.id}: {ev.title}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground uppercase">
                          {(ev.kind || "").replace("_", " ")}
                        </span>
                      </div>
                      <pre className="mt-1.5 max-h-48 overflow-x-auto rounded bg-card p-2.5 font-mono text-[11px] leading-relaxed text-muted-foreground">
                        {ev.snippet}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. VISUAL FINDINGS MATRIX (Interactive Cards Grouped by Verification)
// ---------------------------------------------------------------------------
export function VisualFindingsMatrix({
  report,
  evidence = [],
}: {
  report: Report;
  evidence?: Evidence[];
}) {
  const [inspectedEvId, setInspectedEvId] = useState<string | null>(null);
  const groups = [
    { key: "verified", title: "Verified Findings", tone: "border-emerald-500/40 bg-emerald-500/5" },
    { key: "observed", title: "Direct Observations", tone: "border-cyan-500/40 bg-cyan-500/5" },
    { key: "inferred", title: "Inferred Claims", tone: "border-amber-500/40 bg-amber-500/5" },
    { key: "unknown", title: "Unconfirmed Areas", tone: "border-slate-500/40 bg-slate-500/5" },
  ] as const;

  const findings = Array.isArray(report?.findings) ? report.findings : [];
  const safeEvidence = Array.isArray(evidence) ? evidence : [];
  const contradictions = Array.isArray(report?.contradictions) ? report.contradictions : [];
  const inspectedEvidence = safeEvidence.find((e) => e.id === inspectedEvId);

  return (
    <div className="space-y-6">
      {groups.map((g) => {
        const items = findings.filter((f) => f.status === g.key);
        if (!items.length) return null;

        return (
          <section key={g.key} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusBadge status={g.key} />
                <h3 className="text-sm font-semibold text-foreground">{g.title}</h3>
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                {items.length} item{items.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {items.map((f, i) => {
                const evidenceIds = Array.isArray(f.evidence_ids) ? f.evidence_ids : [];

                return (
                  <div
                    key={i}
                    className={cn(
                      "flex flex-col justify-between rounded-xl border p-4 transition-all hover:shadow-md",
                      g.tone,
                    )}
                  >
                    <div>
                      <p className="text-sm font-medium leading-snug text-foreground">{f.claim}</p>
                      {f.file && (
                        <p className="mt-2 font-mono text-xs text-primary">
                          {f.file}
                          {f.line ? `:${f.line}` : ""}
                          {f.symbol ? ` · ${f.symbol}` : ""}
                        </p>
                      )}
                    </div>

                    {evidenceIds.length > 0 && (
                      <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-border/40 pt-2 font-mono text-[10px]">
                        <span className="text-muted-foreground">Refs:</span>
                        {evidenceIds.map((id) => (
                          <button
                            key={id}
                            onClick={() => setInspectedEvId(inspectedEvId === id ? null : id)}
                            className={cn(
                              "rounded border px-1.5 py-0.5 transition-colors",
                              inspectedEvId === id
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border/60 bg-muted/40 text-muted-foreground hover:border-primary/60 hover:text-foreground",
                            )}
                          >
                            {id}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Floating or pinned Evidence Inspector Drawer */}
      {inspectedEvidence && (
        <div className="rounded-xl border border-primary/40 bg-card p-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-primary">{inspectedEvidence.id}</span>
              <span className="text-xs font-medium text-foreground">{inspectedEvidence.title}</span>
            </div>
            <button
              onClick={() => setInspectedEvId(null)}
              className="font-mono text-xs text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
          </div>
          <pre className="mt-2 max-h-60 overflow-x-auto rounded bg-background p-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
            {inspectedEvidence.snippet}
          </pre>
        </div>
      )}

      {/* Contradictions */}
      {contradictions.length > 0 && (
        <section className="space-y-2">
          <p className="flex items-center gap-2 text-sm font-semibold text-amber-400">
            <AlertTriangle className="h-4 w-4" /> Detected Inconsistencies & Contradictions
          </p>
          <div className="space-y-2">
            {contradictions.map((c, i) => {
              const evidenceIds = Array.isArray(c.evidence_ids) ? c.evidence_ids : [];

              return (
                <div
                  key={i}
                  className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-foreground"
                >
                  <p>{c.description}</p>
                  {evidenceIds.length > 0 && (
                    <p className="mt-1 font-mono text-xs text-muted-foreground">
                      Cited evidence: {evidenceIds.join(", ")}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4. RICH VISUAL EVIDENCE ITEM (Mock IDE / HTTP / Visual Frames)
// ---------------------------------------------------------------------------
export function RichEvidenceItem({ e }: { e: Evidence }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const title = e?.title || "";
  const snippet = e?.snippet || "";
  const kind = e?.kind || "";

  const isHttp =
    kind === "http_probe" ||
    kind === "web_fetch" ||
    title.toLowerCase().startsWith("get ") ||
    title.toLowerCase().startsWith("post ");

  const isCode = kind === "repo_file" || e?.line != null || e?.symbol != null;
  const isVisual = kind === "visual_frame" || Boolean(e?.image);

  const getMethodBadge = (t: string) => {
    if (t.toUpperCase().startsWith("GET"))
      return "border-emerald-500/40 bg-emerald-500/10 text-emerald-400";
    if (t.toUpperCase().startsWith("POST"))
      return "border-blue-500/40 bg-blue-500/10 text-blue-400";
    if (t.toUpperCase().startsWith("DELETE"))
      return "border-red-500/40 bg-red-500/10 text-red-400";
    return "border-primary/40 bg-primary/10 text-primary";
  };

  const copySnippet = (ev: React.MouseEvent) => {
    ev.stopPropagation();
    void navigator.clipboard.writeText(snippet);
    setCopied(true);
    toast.success("Snippet copied");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border/80 bg-card transition-all hover:border-primary/40">
      <button
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/30"
        onClick={() => setOpen(!open)}
      >
        <span className="font-mono text-xs font-bold text-primary">{e.id}</span>

        {isHttp ? (
          <span
            className={cn(
              "rounded border px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase",
              getMethodBadge(title),
            )}
          >
            HTTP
          </span>
        ) : isCode ? (
          <span className="flex items-center gap-1 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground uppercase">
            <Code2 className="h-3 w-3 text-primary" /> Code
          </span>
        ) : isVisual ? (
          <span className="flex items-center gap-1 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-cyan-400 uppercase">
            <Eye className="h-3 w-3" /> Screen
          </span>
        ) : (
          <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground uppercase">
            {kind.replace("_", " ")}
          </span>
        )}

        <span className="min-w-0 flex-1 truncate font-mono text-xs text-foreground">{title}</span>

        {e.timestamp != null && (
          <span className="font-mono text-[10px] text-muted-foreground">
            {e.timestamp.toFixed(1)}s
          </span>
        )}

        <button
          onClick={copySnippet}
          className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title="Copy snippet"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
        </button>

        <ChevronDown
          className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="border-t border-border/60 bg-background/80">
          {/* Header bar styled like terminal chrome */}
          <div className="flex items-center justify-between border-b border-border/40 px-3 py-1.5 bg-muted/20 font-mono text-[11px] text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-red-500/60" />
                <span className="h-2 w-2 rounded-full bg-amber-500/60" />
                <span className="h-2 w-2 rounded-full bg-emerald-500/60" />
              </span>
              <span>{e.tool || "evidence_viewer"}</span>
            </div>
            {e.file && <span className="truncate max-w-xs">{e.file}</span>}
          </div>

          {e.image && (
            <div className="border-b border-border/60 bg-black/40 p-2">
              <img
                src={e.image}
                alt={title}
                className="max-h-96 w-full rounded object-contain"
              />
            </div>
          )}

          <pre className="max-h-80 overflow-x-auto p-4 font-mono text-[11px] leading-relaxed text-muted-foreground">
            {snippet}
          </pre>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 5. TECHNICAL DETAILS VIEW (Structured Sections instead of Wall of Text)
// ---------------------------------------------------------------------------
export function FormattedTechnicalDetails({ report }: { report: Report }) {
  const technicalDetails = report?.technical_details || "No technical specification provided.";
  const sections = technicalDetails
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const verifiedRatio = report?.confidence?.verifiedRatio ?? 0;
  const evidenceCount = report?.confidence?.evidenceCount ?? 0;
  const distinctFiles = report?.confidence?.distinctFiles ?? 0;
  const directObservations = report?.confidence?.directObservations ?? 0;
  const contradictions = report?.confidence?.contradictions ?? 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-border/80 bg-card p-4">
          <p className="font-mono text-xs text-muted-foreground">Verified Claims Ratio</p>
          <p className="mt-1 font-mono text-2xl font-bold text-emerald-400">
            {(verifiedRatio * 100).toFixed(0)}%
          </p>
        </div>
        <div className="rounded-xl border border-border/80 bg-card p-4">
          <p className="font-mono text-xs text-muted-foreground">Total Evidence Checked</p>
          <p className="mt-1 font-mono text-2xl font-bold text-foreground">
            {evidenceCount}
          </p>
        </div>
        <div className="rounded-xl border border-border/80 bg-card p-4">
          <p className="font-mono text-xs text-muted-foreground">Distinct Source Files</p>
          <p className="mt-1 font-mono text-2xl font-bold text-primary">
            {distinctFiles}
          </p>
        </div>
        <div className="rounded-xl border border-border/80 bg-card p-4">
          <p className="font-mono text-xs text-muted-foreground">Direct Observations</p>
          <p className="mt-1 font-mono text-2xl font-bold text-cyan-400">
            {directObservations}
          </p>
        </div>
        <div className="rounded-xl border border-border/80 bg-card p-4">
          <p className="font-mono text-xs text-muted-foreground">Contradictions</p>
          <p
            className={cn(
              "mt-1 font-mono text-2xl font-bold",
              contradictions > 0 ? "text-red-400" : "text-muted-foreground",
            )}
          >
            {contradictions}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border/80 bg-card p-5">
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          <Terminal className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Technical Specification & Trace</h3>
        </div>
        <div className="mt-4 space-y-3">
          {sections.map((sec, i) => (
            <p key={i} className="text-sm leading-relaxed text-muted-foreground">
              {sec}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
