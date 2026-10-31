import { cn } from "@/lib/utils";

const STATUS: Record<string, string> = {
  verified: "border-success/40 bg-success/10 text-success",
  observed: "border-primary/40 bg-primary/10 text-primary",
  inferred: "border-accent/50 bg-accent/10 text-accent",
  unknown: "border-border bg-muted text-muted-foreground",
  completed: "border-success/40 bg-success/10 text-success",
  running: "border-primary/40 bg-primary/10 text-primary",
  queued: "border-border bg-muted text-muted-foreground",
  failed: "border-destructive/40 bg-destructive/10 text-destructive",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider", STATUS[status] ?? STATUS["unknown"], className)}>
      {status === "running" && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />}
      {status}
    </span>
  );
}

const MODE_TONE: Record<string, string> = {
  "White-box": "border-primary/40 bg-primary/10 text-primary",
  "Black-box": "border-accent/50 bg-accent/10 text-accent",
  "Gray-box": "border-warning/40 bg-warning/10 text-warning",
  Static: "border-success/40 bg-success/10 text-success",
  Visual: "border-accent/50 bg-accent/10 text-accent",
};

export function ModeBadge({ mode = "White-box", className }: { mode?: string; className?: string }) {
  return <span className={cn("rounded border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider", MODE_TONE[mode] ?? MODE_TONE["White-box"], className)}>{mode}</span>;
}

export function ConfidenceMeter({ value }: { value: number | null }) {
  const v = value ?? 0;
  const tone = v >= 70 ? "bg-success" : v >= 40 ? "bg-warning" : "bg-destructive";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted"><div className={cn("h-full", tone)} style={{ width: `${v}%` }} /></div>
      <span className="font-mono text-xs text-muted-foreground">{value == null ? "—" : `${v}%`}</span>
    </div>
  );
}
