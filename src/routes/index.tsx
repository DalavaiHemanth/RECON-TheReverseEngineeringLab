import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Binary, GitBranch, Globe, ScanEye, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/recon/AppHeader";
import { ThemeToggle } from "@/components/recon/ThemeToggle";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RECON — Investigate software and visible features" },
      {
        name: "description",
        content:
          "Investigate source code, websites, running applications, binaries, and visual feature demonstrations with evidence-backed reports.",
      },
      { property: "og:title", content: "RECON — Investigate software and visible features" },
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
function Home() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Logo />
        <div className="flex gap-2">
          <ThemeToggle />
          <Button asChild variant="outline">
            <Link to="/auth">Sign in</Link>
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-sm text-primary">Evidence-led investigation</p>
        <h1 className="mt-3 text-5xl font-semibold">RECON</h1>
        <p className="mt-4 max-w-2xl text-xl text-muted-foreground">
          Understand unfamiliar software and visible feature behavior—with findings you can trace
          back to the evidence.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link to="/new">
            Start an investigation <ArrowRight />
          </Link>
        </Button>
        <section className="mt-12 border-t border-border pt-7">
          <h2 className="text-xl font-semibold">Choose your starting point</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: GitBranch,
                title: "Source code",
                text: "GitHub repositories or source ZIP files. Python, JS/TS, Go, Rust, Java, Kotlin, C#, C/C++, Ruby, PHP, and Swift.",
              },
              {
                icon: ScanEye,
                title: "Visual features",
                text: "Screenshots, MP4 recordings, or a permission-based browser demonstration.",
              },
              {
                icon: Globe,
                title: "Public websites",
                text: "Fetched pages, forms, scripts, endpoints, and headers—not an interactive browser session.",
              },
              {
                icon: Server,
                title: "Running applications",
                text: "Read-only HTTP requests to inspect exposed paths and responses.",
              },
              {
                icon: Binary,
                title: "Binary files",
                text: "Local extraction of file structure, strings, and imports. Files are never executed.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-lg border border-border bg-card p-5">
                <Icon className="h-6 w-6 text-primary" />
                <h3 className="mt-3 text-lg font-medium">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="mt-10 border-t border-border pt-6">
          <h2 className="text-xl font-semibold">Evidence, not hidden implementation claims</h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Reports separate observed, inferred, and unknown behavior. Reference checks and evidence
            scores are not guarantees of correctness. Only investigate material you own or have
            permission to inspect.
          </p>
          <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
            Approved evidence is saved to your account and relevant material is processed by the AI
            analysis engine. Browser-sharing permission and submission approval remain separate.
          </p>
        </section>
      </main>
    </div>
  );
}
