import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Download, FileJson, Pause, Play, Printer, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { manageInvestigation, deleteInvestigation } from "@/lib/recon/product.functions";
import { downloadText, reportMarkdown } from "@/lib/recon/product";
import type { Report, Evidence } from "@/lib/recon/types";
export function InvestigationActions({
  id,
  status,
  title,
  report,
  evidence,
}: {
  id: string;
  status: string;
  title: string;
  report: Report | null;
  evidence: Evidence[];
}) {
  const manage = useServerFn(manageInvestigation);
  const remove = useServerFn(deleteInvestigation);
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  async function action(kind: "stop" | "resume" | "retry") {
    setBusy(true);
    try {
      await manage({ data: { id, action: kind } });
      await qc.invalidateQueries({ queryKey: ["investigation", id] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update investigation.");
    } finally {
      setBusy(false);
    }
  }
  async function erase() {
    if (
      !window.confirm(
        "Delete this investigation, its source data, evidence, and saved answers? This cannot be undone.",
      )
    )
      return;
    setBusy(true);
    try {
      await remove({ data: { id } });
      qc.removeQueries({ queryKey: ["investigation", id] });
      await qc.invalidateQueries({ queryKey: ["investigations"] });
      navigate({ to: "/dashboard" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete.");
      setBusy(false);
    }
  }
  return (
    <div className="my-4 flex flex-wrap gap-2 print:hidden">
      {["running", "queued"].includes(status) && (
        <Button variant="outline" disabled={busy} onClick={() => action("stop")}>
          <Pause /> Stop
        </Button>
      )}
      {status === "paused" && (
        <Button disabled={busy} onClick={() => action("resume")}>
          <Play /> Resume
        </Button>
      )}
      {status === "failed" && (
        <Button disabled={busy} onClick={() => action("retry")}>
          <RotateCcw /> Retry from checkpoint
        </Button>
      )}
      {report && (
        <>
          <Button
            variant="outline"
            onClick={() =>
              downloadText(
                reportMarkdown(title, report, evidence),
                "recon-report.md",
                "text/markdown;charset=utf-8",
              )
            }
          >
            <Download /> Report
          </Button>
          <Button
            variant="outline"
            title="Download structured evidence"
            onClick={() =>
              downloadText(
                JSON.stringify({ title, report, evidence }, null, 2),
                "recon-evidence.json",
                "application/json",
              )
            }
          >
            <FileJson /> Evidence
          </Button>
          <Button variant="outline" title="Print or save as PDF" onClick={() => window.print()}>
            <Printer /> Print / PDF
          </Button>
        </>
      )}
      <Button
        variant="ghost"
        size="icon"
        aria-label="Delete investigation"
        title="Delete investigation"
        disabled={busy}
        onClick={erase}
      >
        <Trash2 />
      </Button>
    </div>
  );
}
