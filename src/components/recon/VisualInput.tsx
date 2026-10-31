import { useEffect, useRef, useState } from "react";
import { Loader2, Trash2, Upload, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { extractVisualFiles, isRecordingFile } from "@/lib/recon/visual-capture";
import { type VisualSource, type VisualFrame } from "@/lib/recon/visual";
import { BrowserTabCapture } from "./BrowserTabCapture";
import { RecordingPicker } from "./RecordingPicker";
import { FrameEditor } from "./FrameEditor";
export function VisualInput({
  value,
  onChange,
  disabled,
  onBusyChange,
}: {
  value: VisualSource | null;
  onChange: (value: VisualSource | null) => void;
  disabled: boolean;
  onBusyChange: (busy: boolean) => void;
}) {
  const [processing, setProcessing] = useState(false);
  const [stage, setStage] = useState("Reading frames…");
  const [captureBusy, setCaptureBusy] = useState(false);
  const [captureVersion, setCaptureVersion] = useState(0);
  const [draft, setDraft] = useState<VisualSource | null>(null);
  const [approved, setApproved] = useState(false);
  const [recording, setRecording] = useState<File | null>(null);
  const [editing, setEditing] = useState<VisualFrame | null>(null);
  const generation = useRef(0);
  useEffect(() => {
    onBusyChange(processing || captureBusy || Boolean(recording) || Boolean(draft && !approved));
    return () => onBusyChange(false);
  }, [processing, captureBusy, recording, draft, approved, onBusyChange]);
  useEffect(
    () => () => {
      generation.current += 1;
    },
    [],
  );
  async function upload(files: File[], times?: number[]) {
    const request = ++generation.current;
    setProcessing(true);
    setStage("Reading frames…");
    onChange(null);
    setApproved(false);
    try {
      const result = await extractVisualFiles(files, setStage, times);
      if (request !== generation.current) return;
      setCaptureVersion((v) => v + 1);
      setDraft({ type: "visual", ...result });
      setRecording(null);
    } catch (e) {
      if (request === generation.current)
        toast.error(e instanceof Error ? e.message : "Could not read media.");
    } finally {
      if (request === generation.current) setProcessing(false);
    }
  }
  function changeFrames(frames: VisualFrame[]) {
    setDraft((d) => (d ? { ...d, frames } : null));
    setApproved(false);
    onChange(null);
  }
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" disabled={disabled || processing || captureBusy} asChild>
          <label htmlFor="visual-files">
            <Upload /> Upload media
          </label>
        </Button>
        <Input
          id="visual-files"
          className="hidden"
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp,video/mp4,.mp4,video/webm,video/quicktime"
          disabled={disabled || processing || captureBusy}
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            e.target.value = "";
            if (files.length === 1 && files[0] && isRecordingFile(files[0])) {
              setRecording(files[0]);
              setDraft(null);
              setApproved(false);
              onChange(null);
              setCaptureVersion((v) => v + 1);
            } else void upload(files);
          }}
        />
        {(value || draft || recording) && (
          <Button
            size="icon"
            variant="ghost"
            title="Remove media"
            aria-label="Remove media"
            disabled={disabled || processing || captureBusy}
            onClick={() => {
              generation.current += 1;
              setCaptureVersion((v) => v + 1);
              setDraft(null);
              setRecording(null);
              setApproved(false);
              onChange(null);
            }}
          >
            <Trash2 />
          </Button>
        )}
        {processing && (
          <span role="status" className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            {stage}
          </span>
        )}
      </div>
      {recording && (
        <RecordingPicker
          file={recording}
          busy={processing}
          onExtract={(times) => upload([recording], times)}
          onCancel={() => setRecording(null)}
        />
      )}
      <BrowserTabCapture
        key={captureVersion}
        disabled={disabled || processing || Boolean(recording)}
        onChange={(v) => {
          if (v) {
            setDraft(null);
            setApproved(false);
          }
          onChange(v);
        }}
        onBusyChange={setCaptureBusy}
      />
      {draft && (
        <>
          <h3 className="font-medium">Review uploaded frames · {draft.frames.length}</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {draft.frames.map((f) => (
              <figure key={f.id} className="min-w-0">
                <img
                  src={f.image}
                  alt={`Preview ${f.id}`}
                  className="aspect-video w-full rounded border border-border bg-muted object-contain"
                />
                <figcaption className="mt-1 flex items-center justify-between gap-1">
                  <span className="text-xs text-muted-foreground">
                    {f.id}
                    {draft.capture === "recording" ? ` · ${f.timestamp.toFixed(1)}s` : ""}
                  </span>
                  <div className="flex">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      aria-label={`Edit ${f.id}`}
                      title="Crop or redact frame"
                      disabled={disabled}
                      onClick={() => setEditing(f)}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      aria-label={`Remove ${f.id}`}
                      disabled={disabled}
                      onClick={() => changeFrames(draft.frames.filter((n) => n.id !== f.id))}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
          <label className="flex items-start gap-2 text-sm">
            <Checkbox
              aria-label="Approve uploaded frames for analysis"
              disabled={disabled || !draft.frames.length}
              checked={approved}
              onCheckedChange={(v) => {
                setApproved(v === true);
                onChange(v === true ? draft : null);
              }}
            />
            I reviewed these frames and approve sending them for analysis when I start.
          </label>
        </>
      )}
      <FrameEditor
        key={editing?.id ?? "none"}
        frame={editing}
        onClose={() => setEditing(null)}
        onSave={(f) => {
          if (draft) changeFrames(draft.frames.map((n) => (n.id === f.id ? f : n)));
        }}
      />
    </div>
  );
}
