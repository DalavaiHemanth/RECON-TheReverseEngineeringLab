import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Binary, Globe, GitBranch, Loader2, Server, Upload, ScanEye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { ModeBadge } from "@/components/recon/badges";
import { createInvestigation } from "@/lib/recon/investigations.functions";
import { extractZip } from "@/lib/recon/repo-loader";
import { analyzeBinary, BINARY_LIMITS } from "@/lib/recon/binary";
import { TARGET_MODE, type TargetType } from "@/lib/recon/types";
import { VisualInput } from "@/components/recon/VisualInput";
import { visualSourceSchema, type VisualSource } from "@/lib/recon/visual";
import { STARTING_ADVICE, startingQuestions } from "@/lib/recon/recommendations";

export const Route = createFileRoute("/_authenticated/new")({
  head: () => ({
    meta: [
      { title: "New investigation — RECON" },
      {
        name: "description",
        content: "Choose a target and ask RECON a question about how it works.",
      },
      { property: "og:title", content: "New investigation — RECON" },
      {
        property: "og:description",
        content: "Choose a target and ask RECON a question about how it works.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NewInvestigation,
});

const TARGETS: { id: TargetType; label: string; icon: typeof GitBranch; hint: string }[] = [
  { id: "repo", label: "Source code", icon: GitBranch, hint: "GitHub link or .zip upload" },
  { id: "web", label: "Website URL", icon: Globe, hint: "Public pages, forms, and scripts" },
  { id: "runtime", label: "Running application", icon: Server, hint: "API paths and responses" },
  {
    id: "binary",
    label: "Binary / executable",
    icon: Binary,
    hint: "File structure, strings, imports",
  },
  {
    id: "visual",
    label: "Visual feature",
    icon: ScanEye,
    hint: "Screenshots, recordings, browser demo",
  },
];

const TARGET_NOTE: Record<TargetType, string> = {
  visual:
    "Up to 12 screenshots or one recording (100MB, 3 minutes). Recordings are sampled into up to 12 frames; audio and between-frame actions are not analyzed. Only reviewed frames are sent for analysis. Remove private information first. Visual evidence cannot prove hidden implementation or a feature’s release date.",
  repo: "Public repositories work out of the box; save a GitHub token in Settings for private ones. Python, JavaScript/TypeScript, Go, Rust, Java, Kotlin, C#, C/C++, Ruby, PHP and Swift files are indexed (up to 1,500 files). Code is read, never executed.",
  web: "The site is crawled server-side (same-origin pages only, up to 12 pages). No real browser is used; analysis is based on fetched HTML, headers and scripts.",
  runtime:
    "Only safe read-only requests (GET/HEAD/OPTIONS) are sent — never POST, PUT or DELETE. Only probe applications you own or have permission to test.",
  binary: `The file is analyzed statically in your browser — strings, sections and imports are extracted, nothing is uploaded whole or executed. Max ${Math.round(BINARY_LIMITS.maxBytes / 1_000_000)}MB.`,
};

function NewInvestigation() {
  const navigate = useNavigate();
  const create = useServerFn(createInvestigation);
  const [target, setTarget] = useState<TargetType>("repo");
  const [source, setSource] = useState<"github" | "upload">("github");
  const [url, setUrl] = useState("");
  const [zip, setZip] = useState<File | null>(null);
  const [bin, setBin] = useState<File | null>(null);
  const [visual, setVisual] = useState<VisualSource | null>(null);
  const [visualBusy, setVisualBusy] = useState(false);
  const [question, setQuestion] = useState("");
  const [steps, setSteps] = useState(10);
  const [busy, setBusy] = useState(false);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const suggestions = startingQuestions(target, question);

  async function start() {
    if (target === "visual" && visualBusy) return;
    if (question.trim().length < 5) {
      toast.error("Ask a more specific question.");
      return;
    }
    setBusy(true);
    try {
      let src: Parameters<typeof create>[0]["data"]["source"];
      if (target === "repo") {
        if (source === "github") {
          if (!url) throw new Error("Paste a GitHub repository link.");
          src = { type: "github", url };
        } else {
          if (!zip) throw new Error("Choose a .zip file.");
          const files = extractZip(new Uint8Array(await zip.arrayBuffer()));
          src = { type: "upload", name: zip.name, files };
        }
      } else if (target === "web" || target === "runtime") {
        if (!url) throw new Error("Enter a URL.");
        src = { type: target, url };
      } else if (target === "visual") {
        if (!visual) throw new Error("Upload media or capture a browser demonstration.");
        src = visualSourceSchema.parse(visual);
      } else {
        if (!bin) throw new Error("Choose a binary file.");
        const bytes = new Uint8Array(await bin.arrayBuffer());
        if (bytes.length > BINARY_LIMITS.maxBytes)
          throw new Error(
            `File too large (max ${Math.round(BINARY_LIMITS.maxBytes / 1_000_000)}MB).`,
          );
        src = { type: "binary", name: bin.name, info: analyzeBinary(bytes) };
      }
      const res = await create({
        data: { question: question.trim(), source: src, maxSteps: steps },
      });
      toast.success(
        target === "visual"
          ? `Prepared ${res.fileCount} visual frames`
          : target === "repo"
            ? `Indexed ${res.fileCount} source files`
            : target === "binary"
              ? `Extracted ${res.fileCount} strings`
              : `Fetched ${res.fileCount} ${target === "web" ? "pages" : "probes"}`,
      );
      navigate({ to: "/investigations/$id", params: { id: res.id } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not start");
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-foreground">New investigation</h1>
        <ModeBadge mode={TARGET_MODE[target]} />
      </div>

      <section className="mt-8">
        <Label>Target type</Label>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {TARGETS.map((t) => (
            <Button
              variant="outline"
              key={t.id}
              disabled={busy}
              onClick={() => { setTarget(t.id); setShowAllQuestions(false); }}
              className={cn(
                "h-auto min-w-0 flex-col items-start whitespace-normal rounded-lg p-3 text-left transition-colors",
                target === t.id
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/50",
              )}
            >
              <t.icon
                className={cn(
                  "h-4 w-4",
                  target === t.id ? "text-primary" : "text-muted-foreground",
                )}
              />
              <p className="mt-2 text-sm text-foreground">{t.label}</p>
              <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{t.hint}</p>
            </Button>
          ))}
        </div>
      </section>

      <section className="mt-6 border-y border-border py-5">
        {target === "repo" && (
          <>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={source === "github" ? "default" : "outline"}
                onClick={() => setSource("github")}
              >
                <GitBranch className="h-4 w-4" /> GitHub link
              </Button>
              <Button
                size="sm"
                variant={source === "upload" ? "default" : "outline"}
                onClick={() => setSource("upload")}
              >
                <Upload className="h-4 w-4" /> Upload .zip
              </Button>
            </div>
            {source === "github" ? (
              <Input
                className="mt-4 font-mono"
                placeholder="https://github.com/owner/repo"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            ) : (
              <Input
                className="mt-4"
                type="file"
                accept=".zip"
                onChange={(e) => setZip(e.target.files?.[0] ?? null)}
              />
            )}
          </>
        )}
        {(target === "web" || target === "runtime") && (
          <Input
            className="font-mono"
            placeholder={target === "web" ? "https://example.com" : "https://api.example.com"}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        )}
        {target === "binary" && (
          <Input
            type="file"
            accept=".exe,.elf,.so,.dll,.bin,.dylib,.o,.a"
            onChange={(e) => setBin(e.target.files?.[0] ?? null)}
          />
        )}
        {target === "visual" && (
          <VisualInput
            value={visual}
            onChange={setVisual}
            disabled={busy}
            onBusyChange={setVisualBusy}
          />
        )}
        <p className="mt-2 text-xs text-muted-foreground">{TARGET_NOTE[target]}</p>
      </section>

      <section className="mt-6">
        <Label htmlFor="q">Investigation question</Label>
        <Textarea
          id="q"
          className="mt-2"
          rows={3}
          placeholder={STARTING_ADVICE[target].questions[0]}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <h2 className="mt-4 text-sm font-medium">Suggested investigation angles</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {suggestions.slice(0, showAllQuestions ? undefined : 4).map((s) => (
            <Button
              variant="outline"
              key={s}
              disabled={busy}
              onClick={() => setQuestion(s)}
              className="h-auto max-w-full whitespace-normal rounded-md px-3 py-1 text-left text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
            >
              {s}
            </Button>
          ))}
        </div>
        <Button variant="ghost" size="sm" className="mt-2" onClick={() => setShowAllQuestions(!showAllQuestions)}>
          {showAllQuestions ? "Show fewer suggestions" : "More suggestions"}
        </Button>
        <div className="mt-4 border-l-2 border-primary pl-4">
          <h2 className="text-sm font-medium">Useful details to include</h2>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
            {STARTING_ADVICE[target].preparation.map((tip) => <li key={tip}>{tip}</li>)}
          </ul>
        </div>
      </section>

      <details className="mt-6">
        <summary className="cursor-pointer text-sm text-muted-foreground">Advanced options</summary>
        <Label>Investigation depth: {steps} steps</Label>
        <Slider
          className="mt-3"
          min={4}
          max={20}
          step={1}
          value={[steps]}
          onValueChange={(v) => setSteps(v[0] ?? 10)}
        />
      </details>

      <p className="mt-6 text-sm text-muted-foreground">
        Starting saves your submitted evidence and sends relevant material to the AI engine. You can
        delete saved investigations in Privacy & settings.
      </p>
      <Button
        size="lg"
        className="mt-4 w-full"
        disabled={busy || (target === "visual" && (visualBusy || !visual))}
        onClick={start}
      >
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Preparing target…
          </>
        ) : (
          "Start investigation"
        )}
      </Button>
    </main>
  );
}
