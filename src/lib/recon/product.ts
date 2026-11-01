import { z } from "zod";
import type { Evidence, Report } from "./types";
export const retentionSchema = z.union([z.literal(7), z.literal(30), z.literal(90), z.null()]);
export const actionSchema = z.enum(["stop", "resume", "retry"]);
export function nextStatus(status: string, action: z.infer<typeof actionSchema>) {
  if (action === "stop" && ["queued", "running"].includes(status)) return "paused";
  if (action === "resume" && status === "paused") return "running";
  if (action === "retry" && status === "failed") return "running";
  throw new Error("This action is not available for the current investigation.");
}
export function expiresAt(created: string, days: number | null) {
  return days === null
    ? null
    : new Date(new Date(created).getTime() + days * 86400000).toISOString();
}
export function reportTab(target: string, ready: boolean) {
  return target === "visual"
    ? "screens"
    : ready
      ? target === "repo"
        ? "flow"
        : "findings"
      : "graph";
}
export const artifactSchema = z.object({
  answer: z.string(),
  observations: z.array(
    z.object({
      text: z.string(),
      refs: z.array(z.string()),
    }),
  ),
  suggestions: z.array(z.string()),
  unknowns: z.array(z.string()),
});
export function groundArtifact(value: z.infer<typeof artifactSchema>, allowed: string[]) {
  const ids = new Set(allowed);
  return {
    ...value,
    observations: value.observations.filter(
      (o) => o.refs.length > 0 && o.refs.every((r) => ids.has(r)),
    ),
  };
}
export const checklistSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().min(1).max(80),
        title: z.string().min(1).max(300),
        note: z.string().max(1000),
        done: z.boolean(),
      }),
    )
    .min(1)
    .max(30),
});
export type ChecklistContent = z.infer<typeof checklistSchema>;
export function toggleChecklistItem(content: ChecklistContent, itemId: string) {
  if (!content.items.some((i) => i.id === itemId)) throw new Error("Checklist item not found.");
  return {
    items: content.items.map((i) => (i.id === itemId ? { ...i, done: !i.done } : i)),
  };
}
export function reportMarkdown(title: string, report: Report, evidence: Evidence[]) {
  return `# ${title}\n\n${report.short_answer}\n\n## Evidence score\n${report.confidence.score}/100 — heuristic evidence coverage, not a correctness probability.\n\n## Findings\n${report.findings.map((f) => `- [${f.status}] ${f.claim} (${f.evidence_ids.join(", ")})`).join("\n")}\n\n## Flow\n${report.flow.map((f) => `${f.order}. ${f.title}: ${f.description}`).join("\n")}\n\n## Unknowns\n${report.unknowns.map((u) => `- ${u}`).join("\n")}\n\n## Evidence\n${evidence.map((e) => `### ${e.id}: ${e.title}\n${e.file ?? ""}\n\n${e.snippet}`).join("\n\n")}\n\n## Technical detail\n${report.technical_details}`;
}
export function downloadText(text: string, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
