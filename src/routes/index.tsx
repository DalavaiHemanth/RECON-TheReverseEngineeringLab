import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Binary,
  CheckCircle2,
  Code2,
  Cpu,
  FileCode2,
  GitBranch,
  Globe,
  Layers,
  Lock,
  Play,
  Radar,
  ScanEye,
  Search,
  Server,
  Shield,
  ShieldCheck,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/recon/AppHeader";
import { ThemeToggle } from "@/components/recon/ThemeToggle";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RECON — The Autonomous Reverse Engineering Lab" },
      {
        name: "description",
        content:
          "Investigate source code, websites, runtime APIs, binaries, and visual screen recordings with evidence-backed AI reports.",
      },
      { property: "og:title", content: "RECON — The Autonomous Reverse Engineering Lab" },
      {
        property: "og:description",
        content:
          "Investigate software and visual demonstrations, separating observed evidence from inferred behavior.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

type TargetMode = "repo" | "web" | "visual" | "binary";

function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TargetMode>("repo");
  const [targetInput, setTargetInput] = useState("");
  const [questionInput, setQuestionInput] = useState("");

  const tabConfig = {
    repo: {
      label: "Git Repo",
      icon: GitBranch,
      placeholder: "e.g. https://github.com/expressjs/express or user/repo",
      questionPlaceholder: "e.g. How does request routing and middleware work?",
      badge: "White-box Analysis",
      samples: ["expressjs/express", "fastapi/fastapi", "pallets/flask"],
    },
    web: {
      label: "Web / API",
      icon: Globe,
      placeholder: "e.g. https://api.github.com or https://example.com",
      questionPlaceholder: "e.g. What public endpoints and auth headers are exposed?",
      badge: "Black-box Probing",
      samples: ["https://httpbin.org", "https://api.github.com"],
    },
    visual: {
      label: "UI Recording",
      icon: ScanEye,
      placeholder: "Select or upload an MP4 screen recording or browser session",
      questionPlaceholder: "e.g. What state transitions happen during checkout?",
      badge: "Visual Decompilation",
      samples: ["Login & OAuth flow", "Settings state modal"],
    },
    binary: {
      label: "Binary File",
      icon: Binary,
      placeholder: "Select an ELF, PE (.exe), or Mach-O executable",
      questionPlaceholder: "e.g. What network libraries and strings are referenced?",
      badge: "Static Safe Sandbox",
      samples: ["app.exe (PE64)", "cli-tool (ELF)"],
    },
  };

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    void navigate({
      to: "/new",
      search: {
        ...(targetInput ? { target: targetInput } : {}),
        ...(questionInput ? { q: questionInput } : {}),
      } as any,
    });
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Subtle Background Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-primary/15 via-cyan-500/10 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-[700px] right-0 -z-10 h-[400px] w-[500px] rounded-full bg-primary/10 blur-3xl" />

      {/* 1. FLOATING MODERN NAVBAR (Figma Travel style) */}
      <header className="sticky top-4 z-50 mx-auto max-w-6xl px-4">
        <nav className="flex h-16 items-center justify-between rounded-full border border-border/80 bg-background/80 px-6 shadow-lg shadow-black/5 backdrop-blur-md">
          <Link to="/" className="flex items-center gap-2">
            <Logo />
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#launcher" className="transition-colors hover:text-foreground">
              Launcher
            </a>
            <a href="#capabilities" className="transition-colors hover:text-foreground">
              Capabilities
            </a>
            <a href="#preview" className="transition-colors hover:text-foreground">
              Visual Workspace
            </a>
            <a href="#comparison" className="transition-colors hover:text-foreground">
              Why RECON
            </a>
          </div>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/auth">Sign in</Link>
            </Button>
            <Button asChild size="sm" className="rounded-full shadow-md shadow-primary/20">
              <Link to="/new">
                Launch Lab <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* 2. HERO SECTION */}
      <main className="mx-auto max-w-6xl px-4 pt-16 pb-24 sm:pt-20">
        <div className="text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 font-mono text-xs font-semibold text-primary shadow-inner">
            <Sparkles className="h-3.5 w-3.5" />
            <span>THE AUTONOMOUS REVERSE ENGINEERING LAB</span>
          </div>

          {/* Hero Headline */}
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl">
            Deconstruct Any Software.
            <br />
            <span className="bg-gradient-to-r from-primary via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              With Evidence-Backed Truth.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            An autonomous AI investigation engine that dissects GitHub repos, public APIs, browser
            recordings, and binary files into interactive execution flow diagrams, call hierarchies,
            and zero-hallucination proof.
          </p>
        </div>

        {/* 3. INTERACTIVE TARGET LAUNCHER (The Figma "Booking Widget" equivalent) */}
        <section id="launcher" className="relative mt-12 scroll-mt-24">
          {/* Floating Metric Badges */}
          <div className="hidden lg:flex items-center gap-2 absolute -left-8 -top-6 rounded-full border border-emerald-500/30 bg-background/90 px-3 py-1.5 shadow-lg backdrop-blur">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span className="font-mono text-xs font-semibold text-foreground">99.4% Verified Precision</span>
          </div>
          <div className="hidden lg:flex items-center gap-2 absolute -right-8 -top-6 rounded-full border border-cyan-500/30 bg-background/90 px-3 py-1.5 shadow-lg backdrop-blur">
            <Zap className="h-4 w-4 text-cyan-400" />
            <span className="font-mono text-xs font-semibold text-foreground">Automated Call Graph</span>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card/90 p-4 shadow-2xl backdrop-blur sm:p-6">
            {/* Target Mode Tabs (Flights / Hotels style) */}
            <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-4">
              {(Object.keys(tabConfig) as TargetMode[]).map((mode) => {
                const conf = tabConfig[mode];
                const Icon = conf.icon;
                const isSelected = activeTab === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => setActiveTab(mode)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all",
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{conf.label}</span>
                  </button>
                );
              })}
              <div className="ml-auto hidden sm:flex items-center">
                <span className="rounded-full border border-border bg-muted/40 px-2.5 py-0.5 font-mono text-[11px] uppercase text-muted-foreground">
                  {tabConfig[activeTab].badge}
                </span>
              </div>
            </div>

            {/* Launch Form Controls */}
            <form onSubmit={handleLaunch} className="mt-5 space-y-4">
              <div className="grid gap-3 sm:grid-cols-[1.5fr_1.5fr_auto]">
                <div className="space-y-1">
                  <label className="font-mono text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                    Target Reference
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder={tabConfig[activeTab].placeholder}
                      value={targetInput}
                      onChange={(e) => setTargetInput(e.target.value)}
                      className="pl-9 font-mono text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                    Investigation Query
                  </label>
                  <Input
                    placeholder={tabConfig[activeTab].questionPlaceholder}
                    value={questionInput}
                    onChange={(e) => setQuestionInput(e.target.value)}
                    className="text-xs sm:text-sm"
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full gap-2 rounded-xl font-semibold shadow-lg shadow-primary/20 sm:w-auto"
                  >
                    <span>Analyze</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Sample Quick Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-muted-foreground">
                <span className="font-medium">Try quick samples:</span>
                {tabConfig[activeTab].samples.map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => setTargetInput(sample)}
                    className="rounded-md border border-border/60 bg-muted/30 px-2 py-0.5 font-mono text-[11px] transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </section>

        {/* 4. VISUAL PRODUCT WORKSPACE SHOWCASE (Destination Spotlight style) */}
        <section id="preview" className="mt-24 scroll-mt-24">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Inspect Results As Interactive Architecture
            </h2>
            <p className="mt-2 text-muted-foreground">
              No wall of plain text. RECON synthesizes findings into visual HUD gauges, connected
              execution pipelines, and live graph nodes.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xl">
            {/* Mock Window Chrome */}
            <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-4 py-3 font-mono text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-500/70" />
                  <span className="h-3 w-3 rounded-full bg-amber-500/70" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
                </span>
                <span className="ml-2 font-semibold text-foreground">
                  investigation/auth-flow-analysis
                </span>
              </div>
              <span className="rounded bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                STATUS: COMPLETED
              </span>
            </div>

            {/* Mock HUD Preview */}
            <div className="grid gap-4 p-5 lg:grid-cols-[180px_1fr_220px] bg-gradient-to-b from-card to-background">
              <div className="flex flex-col items-center justify-center rounded-xl border border-border/60 bg-card/60 p-4 text-center">
                <p className="font-mono text-[10px] uppercase text-muted-foreground">Evidence Score</p>
                <div className="my-2 flex h-16 w-16 items-center justify-center rounded-full border-4 border-emerald-400 bg-emerald-500/10 font-mono text-xl font-bold text-emerald-400">
                  92%
                </div>
                <span className="font-mono text-[10px] text-emerald-400">HIGH CONFIDENCE</span>
              </div>

              <div className="rounded-xl border border-border/60 bg-card/60 p-4">
                <p className="font-mono text-xs font-semibold text-primary uppercase">Executive Verdict</p>
                <p className="mt-2 text-sm leading-relaxed text-foreground">
                  The target exposes a session-based authentication gateway via{" "}
                  <code className="rounded bg-muted px-1 font-mono text-xs text-primary">/api/auth/session</code>{" "}
                  backed by Supabase RLS. Tokens are AES-GCM encrypted server-side and never exposed to the client.
                </p>
                <div className="mt-3 flex items-center gap-2 font-mono text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>3 distinct files referenced · 8 code assertions verified</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 rounded-xl border border-border/60 bg-card/60 p-3 font-mono text-xs">
                <div className="rounded border border-border/50 bg-background/50 p-2 text-center">
                  <p className="text-[10px] text-muted-foreground">Evidence</p>
                  <p className="text-base font-bold text-foreground">16 items</p>
                </div>
                <div className="rounded border border-border/50 bg-background/50 p-2 text-center">
                  <p className="text-[10px] text-muted-foreground">Verified</p>
                  <p className="text-base font-bold text-emerald-400">12 claims</p>
                </div>
                <div className="rounded border border-border/50 bg-background/50 p-2 text-center">
                  <p className="text-[10px] text-muted-foreground">Direct Obs.</p>
                  <p className="text-base font-bold text-cyan-400">9</p>
                </div>
                <div className="rounded border border-border/50 bg-background/50 p-2 text-center">
                  <p className="text-[10px] text-muted-foreground">Contradictions</p>
                  <p className="text-base font-bold text-muted-foreground">0</p>
                </div>
              </div>
            </div>

            {/* Mock Step Pipeline */}
            <div className="border-t border-border/60 p-5 bg-card/40">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Execution Pipeline Tracing
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-black">
                      1
                    </span>
                    <span className="text-xs font-semibold text-foreground">Endpoint Ingestion</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Matches <code className="font-mono text-[10px] text-primary">POST /api/v1/auth</code> in routes.
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-black">
                      2
                    </span>
                    <span className="text-xs font-semibold text-foreground">Token Verification</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Validates bearer JWT signature against public JWKS key.
                  </p>
                </div>

                <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-black">
                      3
                    </span>
                    <span className="text-xs font-semibold text-foreground">Database RLS Policy</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Applies tenant-scoped row isolation on user records.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. CAPABILITIES GRID ("Popular Destinations" cards style) */}
        <section id="capabilities" className="mt-24 scroll-mt-24">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Engineered For 4 Target Vectors
            </h2>
            <p className="mt-2 text-muted-foreground">
              Select your attack surface. RECON adapts its toolset, scanner, and evidence grounding per target.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: GitBranch,
                title: "Source Repositories",
                mode: "White-box AST",
                desc: "Scans AST across 12 languages (TS/JS, Python, Go, Rust, Java, C#, C/C++). Maps call hierarchies, secrets, and routes.",
                color: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-400",
              },
              {
                icon: Globe,
                title: "Websites & APIs",
                mode: "Black-box Probing",
                desc: "Crawls HTML structure, scripts, form schemas, headers, robots.txt, and REST endpoints with strict SSRF protection.",
                color: "from-blue-500/20 to-blue-500/5 border-blue-500/30 text-blue-400",
              },
              {
                icon: ScanEye,
                title: "Visual Screen Capture",
                mode: "Visual Decompilation",
                desc: "Captures tab recordings or bounded frames. Deconstructs visible controls, interaction steps, and state machines.",
                color: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-400",
              },
              {
                icon: Binary,
                title: "Binary Executables",
                mode: "Static Safe Dissection",
                desc: "Pure TypeScript client-side parsing of PE and ELF headers, memory sections, extracted strings, and dynamic imports.",
                color: "from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-400",
              },
            ].map(({ icon: Icon, title, mode, desc, color }) => (
              <div
                key={title}
                className={cn(
                  "group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-gradient-to-b p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                  color,
                )}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-xl border border-current/30 bg-current/10 p-2.5">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {mode}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-foreground">{title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{desc}</p>
                </div>

                <div className="mt-6 border-t border-border/40 pt-3">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between p-0 text-xs font-semibold hover:bg-transparent hover:text-primary"
                  >
                    <Link to="/new">
                      <span>Investigate this target</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. WHY RECON COMPARISON SECTION */}
        <section id="comparison" className="mt-24 scroll-mt-24">
          <div className="rounded-3xl border border-border/80 bg-gradient-to-b from-card to-background p-8 shadow-xl sm:p-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Evidence-Grounded Intelligence vs. Generic AI
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
                Generic chatbots hallucinate implementation details. RECON computes confidence
                deterministically in code and binds every claim to cited proof.
              </p>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
                <p className="font-mono text-xs font-bold text-destructive uppercase">Traditional Chatbots</p>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-destructive">✕</span>
                    <span>Invents fake file paths and non-existent functions.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive">✕</span>
                    <span>No verification of whether cited code actually exists.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive">✕</span>
                    <span>Outputs monolithic unformatted text paragraphs.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive">✕</span>
                    <span>Executes untrusted code or requires risky native privileges.</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-primary/40 bg-primary/5 p-6 shadow-md">
                <p className="font-mono text-xs font-bold text-primary uppercase">RECON Autonomous Lab</p>
                <ul className="mt-4 space-y-3 text-sm text-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    <span>Every finding cites an exact, verified file and line number.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    <span>Confidence and status are calculated by code, not the LLM.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    <span>Interactive visual node graphs and execution pipelines.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    <span>Safe static extraction: binaries and scripts are never executed.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 7. BOTTOM CALL TO ACTION */}
        <section className="mt-24 text-center">
          <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-r from-card via-primary/10 to-card p-10 shadow-2xl sm:p-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Ready to dissect your software?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
              Paste a repository, test an endpoint, or record a browser flow. Get an evidence-backed
              reverse engineering dossier in seconds.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="rounded-full font-semibold shadow-xl shadow-primary/25">
                <Link to="/new">
                  Start Free Investigation <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link to="/auth">Sign In to Workspace</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* 8. FOOTER */}
      <footer className="border-t border-border/60 bg-muted/20 py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Radar className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">RECON</span>
            <span>— Autonomous Reverse Engineering Lab</span>
          </div>
          <p>© {new Date().getFullYear()} RECON Lab. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
