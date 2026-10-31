import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Radar, Plus, LogOut, Settings, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { supabase } from "@/integrations/supabase/client";

export function Logo() {
  return (
    <span className="flex items-center gap-2 font-semibold tracking-[0.2em] text-foreground">
      <span className="grid h-8 w-8 place-items-center rounded-md bg-gradient-primary text-primary-foreground">
        <Radar className="h-4 w-4" />
      </span>
      RECON
    </span>
  );
}

export function AppHeader() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }
  return (
    <header className="border-b border-border/60 bg-background/60 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <Link to="/dashboard">
          <Logo />
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button asChild variant="ghost" size="icon" title="Investigations">
            <Link to="/dashboard" aria-label="Investigations">
              <History />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" title="Privacy & settings">
            <Link to="/settings" aria-label="Privacy & settings">
              <Settings />
            </Link>
          </Button>
          <ThemeToggle />
          <Button asChild size="sm">
            <Link to="/new">
              <Plus className="h-4 w-4" />{" "}
              <span className="hidden sm:inline">New investigation</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={signOut} aria-label="Sign out">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
