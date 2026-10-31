import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/recon/AppHeader";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — RECON" },
      { name: "description", content: "Sign in to RECON to run and review your software investigations." },
      { property: "og:title", content: "Sign in — RECON" },
      { property: "og:description", content: "Sign in to RECON to run and review your software investigations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => data.session && navigate({ to: "/dashboard" }));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => s && navigate({ to: "/dashboard" }));
    return () => data.subscription.unsubscribe();
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = mode === "in"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/dashboard" } });
    setBusy(false);
    if (res.error) {
      toast.error(res.error.message);
      return;
    }
    if (mode === "up" && !res.data.session) toast.success("Check your email to confirm your account.");
  }

  async function oauth(p: "google" | "github") {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: p,
      options: { redirectTo: window.location.origin + "/dashboard" },
    });
    if (error) toast.error(error.message ?? "Sign-in failed");
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background bg-hero px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 shadow-glow">
        <Logo />
        <h1 className="mt-6 text-2xl font-semibold text-foreground">{mode === "in" ? "Sign in" : "Create account"}</h1>
        <div className="mt-6 space-y-2">
          <Button variant="outline" className="w-full" onClick={() => oauth("google")}>Continue with Google</Button>
          <Button variant="outline" className="w-full" onClick={() => oauth("github")}>Continue with GitHub</Button>
        </div>
        <div className="my-5 text-center font-mono text-xs text-muted-foreground">or</div>
        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1"><Label htmlFor="email">Email</Label><Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div className="space-y-1"><Label htmlFor="pw">Password</Label><Input id="pw" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <Button type="submit" className="w-full" disabled={busy}>{mode === "in" ? "Sign in" : "Sign up"}</Button>
        </form>
        <button className="mt-4 w-full text-sm text-muted-foreground hover:text-foreground" onClick={() => setMode(mode === "in" ? "up" : "in")}>
          {mode === "in" ? "No account? Sign up" : "Have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
