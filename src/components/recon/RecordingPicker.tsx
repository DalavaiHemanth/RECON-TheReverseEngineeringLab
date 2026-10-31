import { useEffect, useState, useRef } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { VISUAL_LIMITS } from "@/lib/recon/visual";
export function RecordingPicker({
  file,
  busy,
  onExtract,
  onCancel,
}: {
  file: File;
  busy: boolean;
  onExtract: (times?: number[]) => void;
  onCancel: () => void;
}) {
  const [url, setUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [playable, setPlayable] = useState(true);
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);
  function add() {
    if (times.length >= 12) return;
    setTimes((v) => [...new Set([...v, time])].sort((a, b) => a - b));
  }
  return (
    <section className="space-y-3 border-y border-border py-4">
      <h3 className="font-medium">Choose recording moments</h3>
      {url && (
        <video
          ref={video}
          src={url}
          muted
          playsInline
          controls
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          onError={() => setPlayable(false)}
          className="max-h-80 w-full bg-muted"
        />
      )}
      {duration > VISUAL_LIMITS.maxDuration && (
        <p role="alert" className="text-destructive">
          Use a recording no longer than 3 minutes.
        </p>
      )}
      {playable && duration > 0 ? (
        <Slider
          aria-label="Recording moment"
          min={0}
          max={Math.max(0, duration - 0.05)}
          step={0.1}
          value={[time]}
          onValueChange={(v) => {
            const t = v[0] ?? 0;
            setTime(t);
            if (video.current) video.current.currentTime = t;
          }}
        />
      ) : (
        <Input
          aria-label="Moment in seconds"
          type="number"
          min={0}
          max={179.9}
          step={0.1}
          value={time}
          onChange={(e) => setTime(Number(e.target.value))}
        />
      )}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">{time.toFixed(1)}s</span>
        <Button variant="outline" disabled={busy || times.length >= 12} onClick={add}>
          <Plus /> Add moment
        </Button>
        {times.map((t) => (
          <Button
            key={t}
            variant="outline"
            size="sm"
            title="Remove moment"
            onClick={() => setTimes((v) => v.filter((n) => n !== t))}
          >
            {t.toFixed(1)}s <Trash2 className="h-3 w-3" />
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          disabled={busy || duration > 180}
          onClick={() => onExtract(times.length ? times : undefined)}
        >
          {times.length ? `Extract ${times.length} selected moments` : "Extract automatic samples"}
        </Button>
        <Button disabled={busy} variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </section>
  );
}
