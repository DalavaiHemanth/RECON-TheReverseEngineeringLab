import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ShieldCheck, KeyRound, Trash2, Clock, Info, ChevronDown, Check } from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  hasGithubToken,
  saveGithubToken,
  removeGithubToken,
} from "@/lib/recon/investigations.functions";
import {
  getPreferences,
  savePreferences,
  deleteAllInvestigations,
} from "@/lib/recon/product.functions";
export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Privacy & settings — RECON" },
      {
        name: "description",
        content: "Control saved investigation data, retention, and your GitHub connection.",
      },
      { property: "og:title", content: "Privacy & settings — RECON" },
      {
        property: "og:description",
        content: "Control saved investigation data, retention, and your GitHub connection.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Settings,
});
function Settings() {
  const qc = useQueryClient();
  const get = useServerFn(getPreferences);
  const save = useServerFn(savePreferences);
  const check = useServerFn(hasGithubToken);
  const connect = useServerFn(saveGithubToken);
  const disconnect = useServerFn(removeGithubToken);
  const erase = useServerFn(deleteAllInvestigations);
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const pref = useQuery({ queryKey: ["preferences"], queryFn: () => get() });
  const gh = useQuery({ queryKey: ["github-token"], queryFn: () => check() });
  async function run(fn: () => Promise<unknown>, message: string) {
    setBusy(true);
    try {
      await fn();
      toast.success(message);
      await qc.invalidateQueries();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wider text-primary font-mono">Preferences</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">Privacy & Settings</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Manage target data retention, external credentials, and storage controls.
        </p>
      </div>

      {/* 1. What happens to your data Card */}
      <section className="rounded-xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-400" /> Data Handling & Privacy
          </h2>
          <span className="font-mono text-[10px] text-muted-foreground uppercase">Zero-persistence option</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Code and binaries remain on your machine or are processed securely server-side with tenant isolation.
        </p>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 pt-1">
          <div className="rounded-lg border border-border/60 bg-muted/20 p-2.5">
            <p className="text-xs font-semibold text-foreground">Local Processing</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">Binaries and screen frames parsed in-browser</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/20 p-2.5">
            <p className="text-xs font-semibold text-foreground">Encrypted Tokens</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">AES-GCM secured server credentials</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/20 p-2.5">
            <p className="text-xs font-semibold text-foreground">Owner Scoped</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">Strict row-level tenant authorization</p>
          </div>
        </div>

        <details className="group rounded-lg border border-border/60 bg-muted/10 p-3">
          <summary className="flex cursor-pointer items-center justify-between text-xs font-medium text-muted-foreground hover:text-foreground">
            <span>Learn more about data handling details</span>
            <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
          </summary>
          <div className="mt-2.5 space-y-2 text-xs text-muted-foreground leading-relaxed">
            <p>
              Screenshots and recordings are prepared locally. Only reviewed JPEG frames are submitted.
              Binary files are analyzed client-side via WebAssembly; raw executables are never uploaded whole.
            </p>
            <p>
              Source code, fetched website endpoints, and approved visual frames are stored under your account.
              Only pertinent evidence snippets are sent to AI reasoning models for verification.
            </p>
            <p>
              Deleting an investigation instantly purges the target payload, raw evidence, and all derived dossiers
              from production databases.
            </p>
          </div>
        </details>
      </section>

      {/* 2. Retention Card */}
      <section className="rounded-xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
            <Clock className="h-4 w-4 text-cyan-400" /> Automatic Data Expiry
          </h2>
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <Info className="h-3.5 w-3.5" /> Retention policy
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-3 text-xs leading-relaxed text-muted-foreground" side="top">
              <p className="font-semibold text-foreground mb-1">Scheduled Purge</p>
              <p>
                Expired investigations are deleted automatically by a daily background task. Selecting a shorter
                retention window retroactively applies to older investigations.
              </p>
            </PopoverContent>
          </Popover>
        </div>
        <p className="text-xs text-muted-foreground">
          Automatically delete saved investigations and evidence after a set timeframe.
        </p>

        {pref.isError ? (
          <Button onClick={() => pref.refetch()} size="sm">Retry settings</Button>
        ) : (
          <div className="flex items-center gap-3">
            <Select
              disabled={busy || pref.isLoading}
              value={String(pref.data?.retentionDays ?? "keep")}
              onValueChange={(v) => {
                if (
                  window.confirm(
                    "Apply this retention choice to all existing and new investigations? Expired work will be deleted.",
                  )
                )
                  void run(
                    () =>
                      save({
                        data: { retentionDays: v === "keep" ? null : (Number(v) as 7 | 30 | 90) },
                      }),
                    "Retention preference saved.",
                  );
              }}
            >
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="keep">Keep until I delete</SelectItem>
                <SelectItem value="7">7 days retention</SelectItem>
                <SelectItem value="30">30 days retention</SelectItem>
                <SelectItem value="90">90 days retention</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground">Rolling daily cleanup</span>
          </div>
        )}
      </section>

      {/* 3. GitHub Connection Card */}
      <section className="rounded-xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
            <KeyRound className="h-4 w-4 text-amber-400" /> GitHub Connection
          </h2>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold uppercase",
              gh.data?.saved
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                : "bg-muted text-muted-foreground border border-border",
            )}
          >
            {gh.isError ? "Unavailable" : gh.data?.saved ? "Connected" : "Not connected"}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Required only for private repositories. Encrypted with AES-GCM and scoped strictly to your account.
        </p>

        <div className="flex flex-wrap gap-2">
          <Input
            type="password"
            aria-label="GitHub access token"
            className="min-w-0 flex-1 font-mono text-xs"
            placeholder="ghp_... (fine-grained personal access token)"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <Button
            size="sm"
            disabled={busy || token.trim().length < 10}
            onClick={() =>
              run(async () => {
                await connect({ data: { token } });
                setToken("");
              }, "GitHub connection saved.")
            }
          >
            Save token
          </Button>
          {gh.data?.saved && (
            <Button
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={() => run(() => disconnect(), "GitHub connection removed.")}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" /> Disconnect
            </Button>
          )}
        </div>
      </section>

      {/* 4. Danger Zone Card */}
      <section className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 space-y-4 shadow-sm">
        <div>
          <h2 className="text-base font-semibold text-destructive">Danger Zone</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Permanently delete all investigations, source indexes, evidence frames, and Q&A history.
          </p>
        </div>

        <Button
          variant="destructive"
          size="sm"
          disabled={busy}
          onClick={() => {
            if (
              window.confirm(
                "Permanently delete ALL investigations and associated data? This cannot be undone.",
              )
            )
              void run(async () => {
                await erase();
                qc.removeQueries({ queryKey: ["investigation"] });
                qc.removeQueries({ queryKey: ["artifacts"] });
              }, "All investigations deleted.");
          }}
        >
          <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete all investigations
        </Button>
      </section>
    </main>
  );
}
