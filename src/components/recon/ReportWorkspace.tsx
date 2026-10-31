import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { MessageCircle, ClipboardList, GitCompareArrows, Loader2, ArrowUpRight, Lightbulb, ListTodo, Check } from "lucide-react";
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
export function ReportWorkspace({ id, target, report, evidence }: { id: string; target: TargetType; report: Report; evidence: Evidence[] }) {
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
  return (
    <section className="mt-10 border-t border-border pt-6 print:hidden">
      <h2 className="text-xl font-semibold">Explore this report</h2>
      <div className="mt-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 font-medium"><Lightbulb className="h-4 w-4 text-primary" /> Recommended next steps</h3>
          <Button size="sm" variant="outline" disabled={listBusy} onClick={() => void saveAsChecklist()}>
            <ListTodo className="h-4 w-4" /> {checklist ? "Update checklist" : "Save as checklist"}
          </Button>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Suggestions, not verified findings. Answers use the evidence already saved in this report.</p>
        {checklist && (
          <div className="mt-3 rounded-lg border border-border bg-card p-4">
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
        <div className="mt-3 grid gap-x-6 sm:grid-cols-2">
          {recommendations.slice(0, showAll ? undefined : 4).map((item) => (
            <article key={item.id} className="min-w-0 border-b border-border py-4">
              <h4 className="break-words text-sm font-medium">{item.title}</h4>
              <p className="mt-1 break-words text-sm text-muted-foreground">{item.reason}</p>
              {item.refs.length > 0 && <p className="mt-2 font-mono text-xs text-primary">Related evidence: {item.refs.join(", ")}</p>}
              <Button size="sm" variant="ghost" className="mt-2" disabled={busy} onClick={() => {
                if (item.action === "brief") { void run("brief"); return; }
                setQuestion(item.question);
                document.getElementById("report-followup")?.focus();
              }}>
                {item.action === "brief" ? <ClipboardList className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                {item.action === "brief" ? "Build brief" : "Use question"}
              </Button>
            </article>
          ))}
        </div>
        {recommendations.length > 4 && <Button size="sm" variant="ghost" className="mt-2" onClick={() => setShowAll(!showAll)}>{showAll ? "Show fewer recommendations" : `More recommendations (${recommendations.length - 4})`}</Button>}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Input
          id="report-followup"
          aria-label="Follow-up question"
          placeholder="Ask a follow-up question…"
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
        <div className="mt-3 flex flex-wrap gap-2">
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
        <p role="status" className="mt-3 flex gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Reviewing retained evidence…
        </p>
      )}
      {history.isError && (
        <Button variant="outline" onClick={() => history.refetch()}>
          Retry loading saved answers
        </Button>
      )}
      <div className="mt-5 space-y-6">
        {history.data?.filter((row) => row.kind !== "checklist").map((row) => {
          const c = row.content as unknown as Content;
          return (
            <article key={row.id} className="border-t border-border pt-5">
              <p className="text-xs uppercase text-primary">
                {row.kind === "brief"
                  ? "Suggested build brief"
                  : row.kind === "comparison"
                    ? "Feature comparison"
                    : "Follow-up"}
              </p>
              {c.sources && (
                <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                  {c.sources.map((source) => (
                    <Link
                      key={source.id}
                      to="/investigations/$id"
                      params={{ id: source.id }}
                      className="underline"
                    >
                      Source {source.label} · {new Date(source.version).toLocaleDateString()}
                    </Link>
                  ))}
                </div>
              )}
              {row.question && <h3 className="mt-2 font-semibold">{row.question}</h3>}
              <p className="mt-2 whitespace-pre-wrap">{c.answer}</p>
              {c.observations?.length > 0 && (
                <>
                  <h4 className="mt-4 font-medium">Evidence-linked observations</h4>
                  <ul className="mt-2 space-y-2">
                    {c.observations.map((o, i) => (
                      <li key={i}>
                        {o.text}{" "}
                        <span className="font-mono text-xs text-primary">{o.refs.join(", ")}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {c.suggestions?.length > 0 && (
                <>
                  <h4 className="mt-4 font-medium">Suggestions — not observed implementation</h4>
                  <ul className="mt-2 list-disc space-y-2 pl-5">
                    {c.suggestions.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </>
              )}
              {c.unknowns?.length > 0 && (
                <>
                  <h4 className="mt-4 font-medium">Unanswered</h4>
                  <ul className="mt-2 list-disc pl-5 text-muted-foreground">
                    {c.unknowns.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
