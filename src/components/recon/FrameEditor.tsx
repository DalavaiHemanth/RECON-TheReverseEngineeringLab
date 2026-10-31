import { useRef, useState } from "react";
import { Crop, EyeOff, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { captureFrame } from "@/lib/recon/visual-capture";
import { normalizeRect, redactPixels, type Rect } from "@/lib/recon/media-review";
import type { VisualFrame } from "@/lib/recon/visual";
export function FrameEditor({
  frame,
  onSave,
  onClose,
}: {
  frame: VisualFrame | null;
  onSave: (frame: VisualFrame) => void;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<"crop" | "redact">("redact");
  const [selection, setSelection] = useState<Rect | null>(null);
  const [edited, setEdited] = useState<string | null>(null);
  const [error, setError] = useState("");
  const start = useRef<{ x: number; y: number } | null>(null);
  const image = useRef<HTMLImageElement>(null);
  function point(e: React.PointerEvent) {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
  }
  async function apply() {
    if (!frame || !selection || !image.current) return;
    try {
      const img = image.current;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext("2d");
      if (!ctx) throw new Error("Image editing unavailable.");
      ctx.drawImage(img, 0, 0);
      if (mode === "redact") {
        const pixels = ctx.getImageData(0, 0, c.width, c.height);
        redactPixels(pixels.data, c.width, c.height, selection);
        ctx.putImageData(pixels, 0, 0);
      } else {
        const crop = document.createElement("canvas");
        crop.width = Math.max(1, Math.round(selection.width * c.width));
        crop.height = Math.max(1, Math.round(selection.height * c.height));
        const dest = crop.getContext("2d");
        if (!dest) throw new Error("Image editing unavailable.");
        dest.drawImage(
          c,
          selection.x * c.width,
          selection.y * c.height,
          selection.width * c.width,
          selection.height * c.height,
          0,
          0,
          crop.width,
          crop.height,
        );
        c.width = crop.width;
        c.height = crop.height;
        ctx.drawImage(crop, 0, 0);
      }
      setEdited(captureFrame(c, c.width, c.height, frame.timestamp, 0).image);
      setSelection(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not edit frame.");
    }
  }
  return (
    <Dialog
      open={Boolean(frame)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit private areas</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2">
          <Button
            variant={mode === "redact" ? "default" : "outline"}
            onClick={() => setMode("redact")}
          >
            <EyeOff /> Redact
          </Button>
          <Button variant={mode === "crop" ? "default" : "outline"} onClick={() => setMode("crop")}>
            <Crop /> Crop
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Undo all edits"
            aria-label="Undo all edits"
            onClick={() => {
              setEdited(null);
              setSelection(null);
            }}
          >
            <Undo2 />
          </Button>
        </div>
        <div
          className="relative mx-auto w-fit max-w-full touch-none select-none"
          onPointerDown={(e) => {
            start.current = point(e);
            e.currentTarget.setPointerCapture(e.pointerId);
            setSelection(null);
          }}
          onPointerMove={(e) => {
            if (start.current) setSelection(normalizeRect(start.current, point(e)));
          }}
          onPointerUp={() => {
            start.current = null;
          }}
        >
          {frame && (
            <img
              ref={image}
              src={edited ?? frame.image}
              alt="Frame to edit"
              draggable={false}
              className="max-h-[55vh] max-w-full"
            />
          )}
          {selection && (
            <div
              className="pointer-events-none absolute border-2 border-primary bg-primary/20"
              style={{
                left: `${selection.x * 100}%`,
                top: `${selection.y * 100}%`,
                width: `${selection.width * 100}%`,
                height: `${selection.height * 100}%`,
              }}
            />
          )}
        </div>
        {error && (
          <p role="alert" className="text-destructive">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            disabled={!selection || selection.width < 0.01 || selection.height < 0.01}
            onClick={apply}
          >
            Apply selection
          </Button>
          <Button
            onClick={() => {
              if (frame) onSave({ ...frame, image: edited ?? frame.image });
              onClose();
            }}
          >
            Save edited frame
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
