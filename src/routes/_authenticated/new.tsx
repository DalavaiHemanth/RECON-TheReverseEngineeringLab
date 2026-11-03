import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Binary,
  Globe,
  GitBranch,
  Loader2,
  Server,
  Upload,
  ScanEye,
  Info,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
  const [step, setStep] = useState<1 | 2 | 3>(1);
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

  const canProceedFromStep2 = () => {
    if (target === "repo") {
      return source === "github" ? url.trim().length > 0 : Boolean(zip);
    }
    if (target === "web" || target === "runtime") {
      return url.trim().length > 0;
    }
    if (target === "binary") {
      return Boolean(bin);
    }
    if (target === "visual") {
      return Boolean(visual) && !visualBusy;
    }
    return true;
  };

  async function start() {
    if (target === "visual" && visualBusy) return;
    if (question.trim().length < 5) {
      toast.error("Ask a more specific question (at least 5 characters).");
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

  const stepsList = [
    { num: 1, label: "Choose target" },
    { num: 2, label: "Provide input" },
    { num: 3, label: "Ask question" },
  ];

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">New Investigation</h1>
          <p className="mt-1 text-xs text-muted-foreground">Step {step} of 3: {stepsList[step - 1].label}</p>
        </div>
        <ModeBadge mode={TARGET_MODE[target]} />
      </div>

      {/* Wizard Step Indicator */}
      <div className="mt-6 flex items-center justify-between border-b border-border/60 pb-4">
        {stepsList.map((s, idx) => {
          const isCurrent = step === s.num;
          const isComplete = step > s.num;

          return (
            <div key={s.num} className="flex items-center gap-2">
              <button
                type="button"
                disabled={busy || (!isComplete && !isCurrent)}
                onClick={() => setStep(s.num as 1 | 2 | 3)}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-all",
                  isCurrent
                    ? "border-2 border-primary bg-primary/20 text-primary"
                    : isComplete
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-muted/40 text-muted-foreground",
                )}
              >
                {isComplete ? <Check className="h-3.5 w-3.5" /> : s.num}
              </button>
              <span
                className={cn(
                  "hidden text-xs font-medium sm:inline-block",
                  isCurrent ? "text-foreground font-semibold" : "text-muted-foreground",
                )}
              >
                {s.label}
              </span>
              {idx < stepsList.length - 1 && (
                <div className="mx-2 hidden h-px w-8 bg-border sm:block" />
              )}
            </div>
          );
        })}
      </div>

      {/* Step 1: Choose target */}
      {step === 1 && (
        <section className="mt-6 space-y-4">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            Select software target type
          </Label>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {TARGETS.map((t) => (
              <button
                type="button"
                key={t.id}
                disabled={busy}
                onClick={() => {
                  setTarget(t.id);
                  setShowAllQuestions(false);
                }}
                className={cn(
                  "flex items-start gap-3 rounded-lg border p-3.5 text-left transition-all hover:border-primary/60",
                  target === t.id
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border bg-card",
                )}
              >
                <t.icon
                  className={cn(
                    "mt-0.5 h-4 w-4 shrink-0",
                    target === t.id ? "text-primary" : "text-muted-foreground",
                  )}
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{t.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{t.hint}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              type="button"
              onClick={() => setStep(2)}
              className="gap-1.5"
            >
              Continue to input <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </section>
      )}

      {/* Step 2: Provide input */}
      {step === 2 && (
        <section className="mt-6 space-y-5">
          <div className="flex items-center justify-between">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Provide {TARGETS.find((t) => t.id === target)?.label} source
            </Label>
            {/* Disclosure in single-line Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Info className="h-3.5 w-3.5" /> Target details & limits
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-3 text-xs leading-relaxed text-muted-foreground" side="bottom">
                <p className="font-semibold text-foreground mb-1">Target Disclosures</p>
                <p>{TARGET_NOTE[target]}</p>
              </PopoverContent>
            </Popover>
          </div>

          <div className="rounded-lg border border-border/80 bg-card p-4 space-y-3">
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
                    className="font-mono text-sm"
                    placeholder="https://github.com/owner/repo"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                ) : (
                  <Input
                    type="file"
                    accept=".zip"
                    onChange={(e) => setZip(e.target.files?.[0] ?? null)}
                  />
                )}
              </>
            )}

            {(target === "web" || target === "runtime") && (
              <Input
                className="font-mono text-sm"
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
          </div>

          <div className="pt-4 flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              className="gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button
              type="button"
              disabled={!canProceedFromStep2()}
              onClick={() => setStep(3)}
              className="gap-1.5"
            >
              Continue to question <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </section>
      )}

      {/* Step 3: Ask question & Launch */}
      {step === 3 && (
        <section className="mt-6 space-y-5">
          <div>
            <Label htmlFor="q" className="text-xs uppercase tracking-wider text-muted-foreground">
              Investigation question
            </Label>
            <Textarea
              id="q"
              className="mt-2 text-sm"
              rows={3}
              placeholder={STARTING_ADVICE[target].questions[0]}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          {/* Suggested question chips (show 4, "+ more") */}
          <div>
            <p className="text-xs font-medium text-muted-foreground">Suggested angles:</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {suggestions.slice(0, showAllQuestions ? undefined : 4).map((s) => (
                <button
                  type="button"
                  key={s}
                  disabled={busy}
                  onClick={() => setQuestion(s)}
                  className="rounded-md border border-border/80 bg-card px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground text-left"
                >
                  {s}
                </button>
              ))}
              {suggestions.length > 4 && (
                <button
                  type="button"
                  onClick={() => setShowAllQuestions(!showAllQuestions)}
                  className="rounded-md border border-dashed border-border px-2 py-1 text-xs text-primary hover:border-primary"
                >
                  {showAllQuestions ? "Show fewer" : `+${suggestions.length - 4} more`}
                </button>
              )}
            </div>
          </div>

          {/* Useful details to include — collapsed by default */}
          <details className="group rounded-lg border border-border/60 bg-muted/20 p-3">
            <summary className="flex cursor-pointer items-center justify-between text-xs font-medium text-muted-foreground hover:text-foreground">
              <span>Useful details to include for this target</span>
              <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
            </summary>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-muted-foreground">
              {STARTING_ADVICE[target].preparation.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </details>

          {/* Advanced options — depth slider in collapsed details */}
          <details className="group rounded-lg border border-border/60 bg-muted/20 p-3">
            <summary className="flex cursor-pointer items-center justify-between text-xs font-medium text-muted-foreground hover:text-foreground">
              <span>Advanced options (depth: {steps} steps)</span>
              <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-3 space-y-2">
              <Label className="text-xs text-muted-foreground">Investigation depth: {steps} steps</Label>
              <Slider
                min={4}
                max={20}
                step={1}
                value={[steps]}
                onValueChange={(v) => setSteps(v[0] ?? 10)}
              />
            </div>
          </details>

          {/* Privacy disclosure in a single-line info popover */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Info className="h-3.5 w-3.5 shrink-0" />
            <span>Submitted data is processed for analysis.</span>
            <Popover>
              <PopoverTrigger asChild>
                <button type="button" className="underline hover:text-foreground">
                  Learn more
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-3 text-xs leading-relaxed text-muted-foreground" side="top">
                <p className="font-semibold text-foreground mb-1">Privacy Notice</p>
                <p>
                  Submitted evidence is saved to your account and relevant source snippets are sent to the AI
                  analysis engine. You can delete saved investigations at any time in Settings.
                </p>
              </PopoverContent>
            </Popover>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() => setStep(2)}
              className="gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button
              type="button"
              size="lg"
              disabled={busy || question.trim().length < 5}
              onClick={start}
              className="min-w-36"
            >
              {busy ? (
                <>
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Preparing…
                </>
              ) : (
                "Start investigation"
              )}
            </Button>
          </div>
        </section>
      )}
    </main>
  );
}
