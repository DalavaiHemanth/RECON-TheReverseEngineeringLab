import { describe, expect, it } from "vitest";
import { frameReference, sampleTimes, visualFindingStatus, visualSourceSchema } from "./visual";
import { toolsFor } from "./tools";
const frame = { id: "frame-1", timestamp: 0, image: "data:image/jpeg;base64,/9j/2Q==" };
describe("visual investigation", () => {
  it("accepts screenshots as visual evidence", () => {
    const payload = visualSourceSchema.parse({ type: "visual", name: "Instagram feature", capture: "screenshots", frames: [frame] });
    expect(toolsFor(payload).map((t) => t.name)).toContain("inspect_visual_frame");
    expect(frameReference(payload.name, frame)).toBe("Instagram feature · frame-1 @ 0.0s");
  });
  it("bounds recording samples while covering the timeline", () => {
    const times = sampleTimes(180); expect(times).toHaveLength(12); expect(times[0]).toBe(0); expect(times[11]).toBeCloseTo(179.95);
    expect(() => sampleTimes(181)).toThrow();
  });
  it("rejects external image URLs and duplicate frame IDs", () => {
    const source = { type: "visual", name: "Feature", capture: "browser", frames: [frame] };
    expect(visualSourceSchema.safeParse({ ...source, frames: [{ ...frame, image: "https://example.com/private.png" }] }).success).toBe(false);
    expect(visualSourceSchema.safeParse({ ...source, frames: [frame, frame] }).success).toBe(false);
  });
  it("visual evidence supports observations but never verifies implementation", () => {
    const evidence = [{ id: "E1", file: "frame-1", kind: "visual_frame" }];
    expect(visualFindingStatus("observed", "frame-1", ["E1"], evidence)).toBe("observed");
    expect(visualFindingStatus("inferred", "frame-1", ["E1"], evidence)).toBe("inferred");
    expect(visualFindingStatus("observed", "frame-1", ["E2"], evidence)).toBe("inferred");
  });
});