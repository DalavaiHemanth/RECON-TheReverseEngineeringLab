import { VISUAL_LIMITS, sampleTimes } from "./visual";
export type Rect = { x: number; y: number; width: number; height: number };
export function normalizeRect(a: { x: number; y: number }, b: { x: number; y: number }): Rect {
  const x = Math.max(0, Math.min(1, Math.min(a.x, b.x)));
  const y = Math.max(0, Math.min(1, Math.min(a.y, b.y)));
  return {
    x,
    y,
    width: Math.max(0, Math.min(1 - x, Math.abs(a.x - b.x))),
    height: Math.max(0, Math.min(1 - y, Math.abs(a.y - b.y))),
  };
}
export function recordingTimes(duration: number, selected?: number[]) {
  const defaults = sampleTimes(duration);
  if (!selected) return defaults;
  if (
    !selected.length ||
    selected.length > VISUAL_LIMITS.maxFrames ||
    selected.some((t) => !Number.isFinite(t) || t < 0 || t >= duration)
  )
    throw new Error("Choose 1–12 moments within the recording.");
  return [...new Set(selected)].sort((a, b) => a - b);
}
export function redactPixels(data: Uint8ClampedArray, width: number, height: number, rect: Rect) {
  const left = Math.floor(rect.x * width),
    top = Math.floor(rect.y * height),
    right = Math.ceil((rect.x + rect.width) * width),
    bottom = Math.ceil((rect.y + rect.height) * height);
  for (let y = top; y < bottom; y++)
    for (let x = left; x < right; x++) {
      const i = (y * width + x) * 4;
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
      data[i + 3] = 255;
    }
  return data;
}
