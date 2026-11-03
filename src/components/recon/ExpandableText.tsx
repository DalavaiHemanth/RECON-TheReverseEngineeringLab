import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ExpandableTextProps {
  text: string;
  lines?: 2 | 3 | 4;
  className?: string;
}

export function ExpandableText({ text, lines = 3, className }: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (ref.current) {
      // Check if scrollHeight is noticeably taller than clientHeight
      setCanExpand(ref.current.scrollHeight > ref.current.clientHeight + 4);
    }
  }, [text, lines]);

  const lineClampClass = {
    2: "line-clamp-2",
    3: "line-clamp-3",
    4: "line-clamp-4",
  }[lines];

  return (
    <div className={cn("relative", className)}>
      <p
        ref={ref}
        className={cn(
          "text-sm leading-relaxed text-muted-foreground transition-all",
          !expanded && lineClampClass,
          expanded && "break-words"
        )}
      >
        {text}
      </p>
      {canExpand && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-1 font-mono text-[11px] font-semibold text-primary hover:underline focus:outline-none"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}
