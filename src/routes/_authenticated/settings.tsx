import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ShieldCheck, KeyRound, Trash2 } from "lucide-react";
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
    <main className="mx-auto max-w-3xl px-6 py-10">
      <p className="text-sm text-primary">Your control</p>
      <h1 className="mt-2 text-3xl font-semibold">Privacy & settings</h1>
      <section className="mt-8 border-y border-border py-6">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <ShieldCheck /> What happens to your data
        </h2>
        <div className="mt-4 space-y-3 text-muted-foreground">
          <p>
            Screenshots and recordings are prepared on your device. Only reviewed JPEG frames are
            submitted when you start. Audio and the original recording are not uploaded. Binary
            files are processed locally; extracted artifacts are submitted.
          </p>
          <p>
            Source code, fetched website information, and approved visual frames are saved with your
            investigation. Relevant evidence is sent to the AI engine to generate findings and answers.
            Your saved investigations require your account to access.
          </p>
          <p>
            Deletion removes the investigation, saved source payload, evidence images, and related
            answers from the app’s active storage. It does not revoke files you downloaded, delete
            your account, or guarantee immediate removal from backups or AI provider logs.
          </p>
        </div>
      </section>
      <section className="border-b border-border py-6">
        <h2 className="text-xl font-semibold">Automatic deletion</h2>
        <p className="my-3 text-sm text-muted-foreground">
          Applies to all existing and new investigations, measured from creation. Expired
          investigations are removed by a daily cleanup, normally within 24 hours. Saving a shorter
          duration can make old work eligible for deletion.
        </p>
        {pref.isError ? (
          <Button onClick={() => pref.refetch()}>Retry settings</Button>
        ) : (
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
            <SelectTrigger className="max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="keep">Keep until I delete</SelectItem>
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
            </SelectContent>
          </Select>
        )}
      </section>
      <section className="border-b border-border py-6">
        <h2 className="flex gap-2 text-xl font-semibold">
          <KeyRound /> GitHub connection
        </h2>
        <p className="my-3 text-sm text-muted-foreground">
          Optional for private repositories. Use a fine-grained token with read access only to
          selected repositories. Tokens are encrypted before storage and retrieved only on the
          server for your requests. GitHub token validity is checked; access to each repository
          depends on its permissions.
        </p>
        <p className="mb-3 text-sm">
          {gh.isError
            ? "Connection status unavailable"
            : gh.data?.saved
              ? "Connected"
              : "Not connected"}
        </p>
        <div className="flex flex-wrap gap-2">
          <Input
            type="password"
            aria-label="GitHub access token"
            className="min-w-0 flex-1"
            placeholder="GitHub access token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <Button
            disabled={busy || token.trim().length < 10}
            onClick={() =>
              run(async () => {
                await connect({ data: { token } });
                setToken("");
              }, "GitHub connection saved.")
            }
          >
            Save
          </Button>
          {gh.data?.saved && (
            <Button
              variant="outline"
              disabled={busy}
              onClick={() => run(() => disconnect(), "GitHub connection removed.")}
            >
              <Trash2 /> Remove
            </Button>
          )}
        </div>
      </section>
      <section className="py-6">
        <h2 className="text-xl font-semibold">Delete saved investigation data</h2>
        <p className="my-3 text-sm text-muted-foreground">
          Removes all investigations and their associated source data, evidence, comparisons, and
          answers. Your account and GitHub connection remain.
        </p>
        <Button
          variant="destructive"
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
          <Trash2 /> Delete all investigations
        </Button>
      </section>
    </main>
  );
}
