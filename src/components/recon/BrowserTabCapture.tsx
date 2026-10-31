import { useCallback, useEffect, useRef, useState } from "react";
import {
  BookOpen,
  Camera,
  ChevronDown,
  Loader2,
  MonitorUp,
  ShieldCheck,
  Square,
  Trash2,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FrameEditor } from "./FrameEditor";
import { captureFrame } from "@/lib/recon/visual-capture";
import { browserCaptureError, requestBrowserTab } from "@/lib/recon/browser-capture";
import { VISUAL_LIMITS, type VisualFrame, type VisualSource } from "@/lib/recon/visual";

export function BrowserTabCapture({
  disabled,
  onChange,
  onBusyChange,
}: {
  disabled: boolean;
  onChange: (value: VisualSource | null) => void;
  onBusyChange: (busy: boolean) => void;
}) {
  const [status, setStatus] = useState<"idle" | "permission" | "sharing" | "review">("idle");
  const [draft, setDraft] = useState<VisualFrame[]>([]);
  const [ready, setReady] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState("");
  const [approved, setApproved] = useState(false);
  const [editing, setEditing] = useState<VisualFrame | null>(null);
  const player = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const generation = useRef(0);
  const alive = useRef(true);
  const started = useRef(0);
  const frameList = useRef<VisualFrame[]>([]);

  const release = useCallback(() => {
    const media = stream.current;
    stream.current = null;
    media?.getTracks().forEach((track) => {
      track.onended = null;
      track.stop();
    });
    if (player.current) player.current.srcObject = null;
  }, []);
  const stop = useCallback(() => {
    generation.current += 1;
    release();
    setReady(false);
    setStatus(frameList.current.length ? "review" : "idle");
  }, [release]);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      generation.current += 1;
      release();
    };
  }, [release]);
  useEffect(() => {
    onBusyChange(
      status === "permission" || status === "sharing" || (status === "review" && !approved),
    );
    return () => onBusyChange(false);
  }, [status, approved, onBusyChange]);
  useEffect(() => {
    if (status !== "sharing") return;
    const timer = setInterval(() => {
      const seconds = (performance.now() - started.current) / 1000;
      setElapsed(Math.floor(seconds));
      if (seconds >= VISUAL_LIMITS.maxDuration) stop();
    }, 250);
    return () => clearInterval(timer);
  }, [status, stop]);

  async function share() {
    const request = ++generation.current;
    setError("");
    setStatus("permission");
    setReady(false);
    try {
      const media = await requestBrowserTab();
      if (!alive.current || request !== generation.current) {
        media.getTracks().forEach((t) => t.stop());
        return;
      }
      stream.current = media;
      frameList.current = [];
      setDraft([]);
      setApproved(false);
      onChange(null);
      started.current = performance.now();
      setElapsed(0);
      const track = media.getVideoTracks()[0];
      if (track) track.onended = stop;
      setStatus("sharing");
      const video = player.current;
      if (!video) throw new Error("Tab preview is unavailable.");
      video.srcObject = media;
      await video.play();
      if (alive.current && request === generation.current)
        setReady(video.readyState >= 2 && video.videoWidth > 0);
    } catch (e) {
      if (!alive.current || request !== generation.current) return;
      release();
      setStatus(frameList.current.length ? "review" : "idle");
      setError(browserCaptureError(e));
    }
  }

  function capture() {
    const video = player.current;
    if (!video || !ready || status !== "sharing") return;
    const seconds = (performance.now() - started.current) / 1000;
    if (
      seconds >= VISUAL_LIMITS.maxDuration ||
      frameList.current.length >= VISUAL_LIMITS.maxFrames
    ) {
      stop();
      return;
    }
    try {
      const frame = captureFrame(
        video,
        video.videoWidth,
        video.videoHeight,
        seconds,
        frameList.current.length,
      );
      frameList.current = [...frameList.current, frame];
      setDraft(frameList.current);
      setError("");
      if (frameList.current.length >= VISUAL_LIMITS.maxFrames) stop();
    } catch (e) {
      setError(browserCaptureError(e));
    }
  }

  function remove(id: string) {
    frameList.current = frameList.current.filter((f) => f.id !== id);
    setDraft(frameList.current);
    setApproved(false);
    onChange(null);
    if (!frameList.current.length) setStatus("idle");
  }
  function approve(checked: boolean) {
    setApproved(checked);
    onChange(
      checked
        ? {
            type: "visual",
            name: "Browser demonstration",
            capture: "browser",
            frames: frameList.current,
          }
        : null,
    );
  }

  return (
    <div className="space-y-3">
      <Collapsible className="border-y border-border py-2">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="group h-auto w-full justify-start whitespace-normal px-0 text-left text-sm"
          >
            <BookOpen className="h-4 w-4 shrink-0" /> Browser demonstration guide
            <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform group-data-[state=open]:rotate-180 motion-reduce:transition-none" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pb-2 pt-3 text-sm text-muted-foreground">
          <ol className="list-decimal space-y-3 pl-5">
            <li>
              <span className="font-medium text-foreground">Prepare the feature.</span> Open the
              website in a separate tab and sign in there if needed. Hide private messages, account
              details, and notifications before sharing.
            </li>
            <li>
              <span className="font-medium text-foreground">Choose the right tab.</span> Click{" "}
              <span className="font-medium text-foreground">Share browser tab</span>. In your
              browser’s chooser, select the tab containing the feature—not this RECON tab—then
              confirm Share. Choose a browser tab, not a window or your entire screen. Cancel if you
              are unsure.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Show the before, action, and result.
              </span>{" "}
              Capture the starting screen, use the feature in the shared tab, then return here and
              click <span className="font-medium text-foreground">Capture frame</span> after each
              important change. Frames are captured only when you click; leave menus and results
              visible long enough to capture them.
            </li>
            <li>
              <span className="font-medium text-foreground">Stop, review, and approve.</span> Click{" "}
              <span className="font-medium text-foreground">Stop sharing</span> or use your
              browser’s stop control. Remove private or unhelpful frames, approve the remaining
              frames, and write a specific investigation question before starting.
            </li>
          </ol>
          <p>
            <span className="font-medium text-foreground">Example:</span> For an Instagram feature,
            capture where you open it, its options, and the final result. Ask: “What changes on
            screen when I use this feature?”
          </p>
          <p>
            Audio is off. Analysis sees captured screens, not clicks or hidden code. You can capture
            up to {VISUAL_LIMITS.maxFrames} frames during {VISUAL_LIMITS.maxDuration / 60} minutes
            of sharing; nothing is sent until you approve and start the investigation.
          </p>
          <p>
            Wrong tab? Stop sharing, then choose another tab; a fresh capture replaces the current
            frames. If tab sharing is unavailable, use a desktop browser that supports it, or upload
            screenshots or an MP4 recording instead.
          </p>
        </CollapsibleContent>
      </Collapsible>
      <div className="flex flex-wrap items-center gap-2">
        {(status === "idle" || status === "review") && (
          <Button variant="outline" disabled={disabled} onClick={share}>
            <MonitorUp />
            {draft.length ? "Share another tab" : "Share browser tab"}
          </Button>
        )}
        {status === "permission" && (
          <>
            <span role="status" className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Waiting for browser permission…
            </span>
            <Button variant="outline" onClick={stop}>
              Cancel
            </Button>
          </>
        )}
        {status === "sharing" && (
          <>
            <Button variant="outline" onClick={capture} disabled={disabled || !ready}>
              <Camera /> Capture frame
            </Button>
            <Button variant="outline" onClick={stop}>
              <Square /> Stop sharing
            </Button>
            <span role="status" className="font-mono text-xs text-primary">
              Sharing tab · {elapsed}s · {draft.length}/{VISUAL_LIMITS.maxFrames} frames
            </span>
          </>
        )}
      </div>
      {status === "idle" && !draft.length && (
        <p className="flex items-start gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 shrink-0" /> Permission is requested by your browser.
          Audio is off; captured frames stay on your device until you approve them and start an
          investigation.
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {error}
        </p>
      )}
      <video
        ref={player}
        muted
        playsInline
        autoPlay
        onLoadedData={() => setReady(true)}
        aria-label="Shared browser tab preview"
        className={
          status === "sharing" ? "aspect-video w-full rounded-md bg-muted object-contain" : "hidden"
        }
      />
      {draft.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-foreground">
            {status === "review" ? "Review captured frames" : "Captured frames"}
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {draft.map((frame) => (
              <figure key={frame.id} className="min-w-0">
                <img
                  src={frame.image}
                  alt={`Captured ${frame.id}`}
                  className="aspect-video w-full rounded border border-border bg-muted object-contain"
                />
                <figcaption className="mt-1 flex items-center justify-between gap-1">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {frame.id} · {frame.timestamp.toFixed(1)}s
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    disabled={disabled || status === "sharing"}
                    title="Crop or redact frame"
                    aria-label={`Edit ${frame.id}`}
                    onClick={() => setEditing(frame)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    disabled={disabled || status === "sharing"}
                    onClick={() => remove(frame.id)}
                    aria-label={`Remove ${frame.id}`}
                    title="Remove frame"
                  >
                    <Trash2 />
                  </Button>
                </figcaption>
              </figure>
            ))}
          </div>
          {status === "review" && (
            <label className="mt-3 flex cursor-pointer items-start gap-2 text-sm text-foreground">
              <Checkbox
                checked={approved}
                disabled={disabled}
                onCheckedChange={(v) => approve(v === true)}
                aria-label="Approve captured frames for analysis"
              />
              <span>
                I reviewed these frames and approve sending them for analysis when I start the
                investigation.
              </span>
            </label>
          )}
        </div>
      )}
      <FrameEditor
        key={editing?.id ?? "none"}
        frame={editing}
        onClose={() => setEditing(null)}
        onSave={(frame) => {
          frameList.current = frameList.current.map((f) => (f.id === frame.id ? frame : f));
          setDraft(frameList.current);
          setApproved(false);
          onChange(null);
        }}
      />
    </div>
  );
}
