import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { MessageCircle, ClipboardList, GitCompareArrows, Loader2, ArrowUpRight, Lightbulb, ListTodo, Check, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { generateArtifact, saveChecklist, setChecklistItem } from "@/lib/recon/product.functions";
import { reportRecommendations } from "@/lib/recon/recommendations";
import { ExpandableText } from "@/components/recon/ExpandableText";
import type { ChecklistContent } from "@/lib/recon/product";
import type { Evidence, Report, TargetType } from "@/lib/recon/types";
import { cn } from "@/lib/utils";
type Content = {
  answer: string;
  observations: { text: string; refs: string[] }[];
  suggestions: string[];
  unknowns: string[];
  sources?: { id: string; version: string; label: string }[];
};
export function ReportWorkspace({
  id,
  target,
  report,
  evidence,
  section = "all",
}: {
  id: string;
  target: TargetType;
  report: Report;
  evidence: Evidence[];
  section?: "all" | "next_steps" | "qa";
}) {
  const visual = target === "visual";
  const generate = useServerFn(generateArtifact);
  const saveList = useServerFn(saveChecklist);
  const toggleItem = useServerFn(setChecklistItem);
  const qc = useQueryClient();
  const [question, setQuestion] = useState("");
  const [other, setOther] = useState("");
  const [busy, setBusy] = useState(false);
  const [listBusy, setListBusy] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [expandedRecId, setExpandedRecId] = useState<string | null>(null);
  const recommendations = reportRecommendations(target, report, evidence);
  const history = useQuery({
    queryKey: ["artifacts", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recon_artifacts")
        .select("*")
        .eq("investigation_id", id)
        .order("created_at");
      if (error) throw error;
      return data;
    },
  });
  const candidates = useQuery({
    queryKey: ["visual-comparisons", id],
    enabled: visual,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investigations")
        .select("id,title,question")
        .eq("target_type", "visual")
        .eq("status", "completed")
        .neq("id", id);
      if (error) throw error;
      return data;
    },
  });
  async function run(kind: "followup" | "brief" | "comparison") {
    setBusy(true);
    try {
      await generate({
        data: {
          id,
          kind,
          question: kind === "followup" ? question : "",
          ...(kind === "comparison" ? { comparisonId: other } : {}),
        },
      });
      setQuestion("");
      await qc.invalidateQueries({ queryKey: ["artifacts", id] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not generate answer.");
    } finally {
      setBusy(false);
    }
  }
  const checklistRow = history.data?.find((row) => row.kind === "checklist");
  const checklist = (checklistRow?.content as unknown as ChecklistContent | undefined) ?? null;
  const doneCount = checklist?.items.filter((i) => i.done).length ?? 0;
  async function saveAsChecklist() {
    setListBusy(true);
    try {
      const existing = new Map(checklist?.items.map((i) => [i.id, i.done]) ?? []);
      await saveList({
        data: {
          id,
          content: {
            items: recommendations.map((r) => ({
              id: r.id,
              title: r.title,
              note: r.reason,
              done: existing.get(r.id) ?? false,
            })),
          },
        },
      });
      await qc.invalidateQueries({ queryKey: ["artifacts", id] });
      toast.success("Checklist saved.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save the checklist.");
    } finally {
      setListBusy(false);
    }
  }
  async function toggle(itemId: string) {
    setListBusy(true);
    try {
      await toggleItem({ data: { id, itemId } });
      await qc.invalidateQueries({ queryKey: ["artifacts", id] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update the checklist.");
    } finally {
      setListBusy(false);
    }
  }
  const showNextSteps = section === "all" || section === "next_steps";
  const showQA = section === "all" || section === "qa";

  return (
    <div className={cn("space-y-8 print:hidden", section === "all" && "mt-10 border-t border-border pt-6")}>
      {showNextSteps && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
              <Lightbulb className="h-4 w-4 text-primary" /> Recommended Next Steps
            </h3>
            <Button size="sm" variant="outline" disabled={listBusy} onClick={() => void saveAsChecklist()}>
              <ListTodo className="h-4 w-4" /> {checklist ? "Update checklist" : "Save as checklist"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Suggestions based on collected evidence. Click any card to see details and action buttons.
          </p>

          {checklist && (
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-sm font-medium">
                Checklist — {doneCount}/{checklist.items.length} complete
              </p>
              <ul className="mt-2 space-y-1">
                {checklist.items.map((item) => (
                  <li key={item.id}>
                    <button
                      className="flex w-full items-start gap-3 rounded-md px-2 py-2 text-left hover:bg-muted/50 disabled:opacity-60"
                      disabled={listBusy}
                      onClick={() => void toggle(item.id)}
                      aria-pressed={item.done}
                    >
                      <span
                        className={cn(
                          "mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border border-border",
                          item.done && "border-primary bg-primary text-primary-foreground",
                        )}
                      >
                        {item.done && <Check className="h-3 w-3" />}
                      </span>
                      <span className="min-w-0">
                        <span className={cn("block text-sm", item.done ? "text-muted-foreground line-through" : "text-foreground")}>
                          {item.title}
                        </span>
                        {item.note && <span className="block text-xs text-muted-foreground">{item.note}</span>}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Compact recommendation cards: top 3 by default */}
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.slice(0, showAll ? undefined : 3).map((item) => {
              const isExpanded = expandedRecId === item.id;
              return (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-lg border border-border/80 bg-card transition-all hover:border-primary/40"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedRecId(isExpanded ? null : item.id)}
                    className="flex w-full items-center justify-between gap-2 p-3 text-left hover:bg-muted/30"
                  >
                    <span className="text-xs font-semibold text-foreground line-clamp-2">{item.title}</span>
                    <ChevronDown
                      className={cn("h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform", isExpanded && "rotate-180")}
                    />
                  </button>

                  {isExpanded && (
                    <div className="border-t border-border/60 bg-muted/20 p-3 pt-2 text-xs space-y-2">
                      <p className="text-muted-foreground leading-relaxed">{item.reason}</p>
                      {item.refs.length > 0 && (
                        <p className="font-mono text-[11px] text-primary">
                          Refs: {item.refs.join(", ")}
                        </p>
                      )}
                      <div className="pt-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-7 text-xs"
                          disabled={busy}
                          onClick={() => {
                            if (item.action === "brief") {
                              void run("brief");
                              return;
                            }
                            setQuestion(item.question);
                            document.getElementById("report-followup")?.focus();
                          }}
                        >
                          {item.action === "brief" ? (
                            <ClipboardList className="mr-1 h-3.5 w-3.5" />
                          ) : (
                            <ArrowUpRight className="mr-1 h-3.5 w-3.5" />
                          )}
                          {item.action === "brief" ? "Build brief" : "Use question"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {recommendations.length > 3 && (
            <Button
              size="sm"
              variant="ghost"
              className="text-xs text-muted-foreground"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Show top 3 recommendations" : `+${recommendations.length - 3} more recommendations`}
            </Button>
          )}
        </section>
      )}

      {showQA && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
              <MessageCircle className="h-4 w-4 text-primary" /> Follow-Up Investigation & Q&A
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <Input
              id="report-followup"
              aria-label="Follow-up question"
              placeholder="Ask a follow-up question using current evidence…"
              className="min-w-0 flex-1"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <Button disabled={busy || question.trim().length < 5} onClick={() => run("followup")}>
              <MessageCircle /> Ask
            </Button>
            <Button variant="outline" disabled={busy} onClick={() => run("brief")}>
              <ClipboardList /> Build brief
            </Button>
          </div>
          {visual && (
            <div className="flex flex-wrap gap-2">
              <Select value={other} onValueChange={setOther}>
                <SelectTrigger className="w-full sm:w-80">
                  <SelectValue placeholder="Choose another visual report" />
                </SelectTrigger>
                <SelectContent>
                  {candidates.data?.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.title || r.question}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" disabled={busy || !other} onClick={() => run("comparison")}>
                <GitCompareArrows /> Compare
              </Button>
            </div>
          )}
          {busy && (
            <p role="status" className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-primary" /> Reviewing retained evidence…
            </p>
          )}
          {history.isError && (
            <Button variant="outline" size="sm" onClick={() => history.refetch()}>
              Retry loading saved answers
            </Button>
          )}

          <div className="space-y-4 pt-2">
            {history.data
              ?.filter((row) => row.kind !== "checklist")
              .map((row) => {
                const c = row.content as unknown as Content;
                return (
                  <article key={row.id} className="rounded-lg border border-border/80 bg-card p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-primary">
                        {row.kind === "brief"
                          ? "Suggested build brief"
                          : row.kind === "comparison"
                            ? "Feature comparison"
                            : "Follow-up"}
                      </span>
                    </div>

                    {c.sources && (
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {c.sources.map((source) => (
                          <Link
                            key={source.id}
                            to="/investigations/$id"
                            params={{ id: source.id }}
                            className="underline hover:text-foreground"
                          >
                            Source {source.label} · {new Date(source.version).toLocaleDateString()}
                          </Link>
                        ))}
                      </div>
                    )}

                    {row.question && <h4 className="font-semibold text-sm text-foreground">{row.question}</h4>}

                    <ExpandableText text={c.answer} lines={3} className="text-sm leading-relaxed text-foreground" />

                    {/* Observations collapsed under count header */}
                    {c.observations?.length > 0 && (
                      <details className="group rounded-md border border-border/60 bg-muted/20 p-2.5">
                        <summary className="flex cursor-pointer items-center justify-between font-mono text-xs font-medium text-muted-foreground hover:text-foreground">
                          <span>Evidence-linked observations ({c.observations.length})</span>
                          <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
                        </summary>
                        <ul className="mt-2.5 space-y-2 text-xs">
                          {c.observations.map((o, i) => (
                            <li key={i} className="text-muted-foreground">
                              {o.text}{" "}
                              <span className="font-mono text-primary font-semibold">[{o.refs.join(", ")}]</span>
                            </li>
                          ))}
                        </ul>
                      </details>
                    )}

                    {/* Suggestions collapsed under count header */}
                    {c.suggestions?.length > 0 && (
                      <details className="group rounded-md border border-border/60 bg-muted/20 p-2.5">
                        <summary className="flex cursor-pointer items-center justify-between font-mono text-xs font-medium text-amber-400/90 hover:text-amber-400">
                          <span>Suggestions — not observed ({c.suggestions.length})</span>
                          <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
                        </summary>
                        <ul className="mt-2.5 list-disc space-y-1.5 pl-4 text-xs text-muted-foreground">
                          {c.suggestions.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </details>
                    )}

                    {/* Unknowns collapsed under count header */}
                    {c.unknowns?.length > 0 && (
                      <details className="group rounded-md border border-border/60 bg-muted/20 p-2.5">
                        <summary className="flex cursor-pointer items-center justify-between font-mono text-xs font-medium text-muted-foreground hover:text-foreground">
                          <span>Unanswered questions ({c.unknowns.length})</span>
                          <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
                        </summary>
                        <ul className="mt-2.5 list-disc space-y-1.5 pl-4 text-xs text-muted-foreground">
                          {c.unknowns.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </details>
                    )}
                  </article>
                );
              })}
          </div>
        </section>
      )}
    </div>
  );
}
