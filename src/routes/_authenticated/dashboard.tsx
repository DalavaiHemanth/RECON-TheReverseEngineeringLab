import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Search, Pencil, Trash2, Plus, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfidenceMeter, StatusBadge } from "@/components/recon/badges";
import { deleteInvestigation, renameInvestigation } from "@/lib/recon/product.functions";
export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Your investigations — RECON" },
      {
        name: "description",
        content: "Find, organize, and revisit your evidence-backed investigations.",
      },
      { property: "og:title", content: "Your investigations — RECON" },
      {
        property: "og:description",
        content: "Find, organize, and revisit your evidence-backed investigations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});
function Dashboard() {
  const qc = useQueryClient();
  const remove = useServerFn(deleteInvestigation);
  const rename = useServerFn(renameInvestigation);
  const [search, setSearch] = useState("");
  const [target, setTarget] = useState("all");
  const [status, setStatus] = useState("all");
  const [editing, setEditing] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["investigations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investigations")
        .select("id,title,question,target_ref,target_type,status,confidence,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  async function erase(id: string) {
    if (!window.confirm("Delete this investigation, source data, evidence, and saved answers?"))
      return;
    setBusy(true);
    try {
      await remove({ data: { id } });
      qc.removeQueries({ queryKey: ["investigation", id] });
      await qc.invalidateQueries({ queryKey: ["investigations"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete.");
    } finally {
      setBusy(false);
    }
  }
  async function save() {
    if (!editing) return;
    setBusy(true);
    try {
      await rename({ data: { id: editing, title } });
      setEditing(null);
      await qc.invalidateQueries({ queryKey: ["investigations"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not rename.");
    } finally {
      setBusy(false);
    }
  }
  const rows = data?.filter(
    (r) =>
      (target === "all" || r.target_type === target) &&
      (status === "all" || r.status === status) &&
      `${r.title} ${r.question} ${r.target_ref}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-primary">Your workspace</p>
          <h1 className="mt-2 text-3xl font-semibold">Investigations</h1>
        </div>
        <Button asChild>
          <Link to="/new">
            <Plus /> New investigation
          </Link>
        </Button>
      </div>
      <div className="mt-8 flex gap-8 border-y border-border py-5">
        {[
          ["Total", data?.length ?? 0],
          ["Completed", data?.filter((r) => r.status === "completed").length ?? 0],
          [
            "In progress",
            data?.filter((r) => ["running", "queued"].includes(r.status)).length ?? 0,
          ],
        ].map(([label, n]) => (
          <div key={label}>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-semibold">{n}</p>
          </div>
        ))}
      </div>
      <div className="my-6 flex flex-wrap gap-3">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            aria-label="Search investigations"
            className="pl-10"
            placeholder="Search investigations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={target} onValueChange={setTarget}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(
              [
                ["all", "All targets"],
                ["repo", "Source code"],
                ["visual", "Visual features"],
                ["web", "Websites"],
                ["runtime", "Running apps"],
                ["binary", "Binaries"],
              ] as const
            ).map(([v, l]) => (
              <SelectItem key={v} value={v}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["all", "completed", "running", "queued", "paused", "failed"].map((v) => (
              <SelectItem key={v} value={v}>
                {v === "all" ? "All statuses" : v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {isLoading ? (
        <p role="status">Loading investigations…</p>
      ) : isError ? (
        <div>
          <p>Investigations could not be loaded.</p>
          <Button className="mt-3" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : !data?.length ? (
        <div className="py-12 text-center">
          <Search className="mx-auto h-8 w-8 text-muted-foreground" />
          <h2 className="mt-4 text-xl">No investigations yet</h2>
          <Button asChild className="mt-5">
            <Link to="/new">Start your first</Link>
          </Button>
        </div>
      ) : !rows?.length ? (
        <p className="py-8 text-muted-foreground">No investigations match these filters.</p>
      ) : (
        <ul className="divide-y divide-border">
          {rows.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center gap-3 py-5">
              {editing === r.id ? (
                <div className="flex min-w-0 flex-1 gap-2">
                  <Input
                    aria-label="Investigation name"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <Button disabled={busy || !title.trim()} onClick={save}>
                    Save
                  </Button>
                  <Button variant="ghost" onClick={() => setEditing(null)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Link to="/investigations/$id" params={{ id: r.id }} className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 font-medium">
                    {r.title || r.question}
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </p>
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {r.target_ref} · {new Date(r.created_at).toLocaleDateString()}
                  </p>
                </Link>
              )}
              <StatusBadge status={r.status} />
              <ConfidenceMeter value={r.confidence == null ? null : Number(r.confidence)} />
              <Button
                size="icon"
                variant="ghost"
                title="Rename investigation"
                aria-label={`Rename ${r.title || r.question}`}
                onClick={() => {
                  setEditing(r.id);
                  setTitle(r.title || r.question);
                }}
              >
                <Pencil />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                disabled={busy}
                title="Delete investigation"
                aria-label={`Delete ${r.title || r.question}`}
                onClick={() => erase(r.id)}
              >
                <Trash2 />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
