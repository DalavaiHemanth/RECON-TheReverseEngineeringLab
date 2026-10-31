import { describe, it, expect } from "vitest";
import { nextStatus, retentionSchema, expiresAt, groundArtifact, reportTab, checklistSchema, toggleChecklistItem } from "./product";
describe("product rules", () => {
  it("stop pauses an active investigation", () =>
    expect(nextStatus("running", "stop")).toBe("paused"));
  it("resume restarts only a paused investigation", () => {
    expect(nextStatus("paused", "resume")).toBe("running");
    expect(() => nextStatus("completed", "resume")).toThrow();
  });
  it("retry retains a failed investigation lifecycle", () => {
    expect(nextStatus("failed", "retry")).toBe("running");
    expect(() => nextStatus("completed", "retry")).toThrow();
  });
  it("retention allows only offered durations or no expiry", () => {
    expect(retentionSchema.parse(7)).toBe(7);
    expect(retentionSchema.parse(30)).toBe(30);
    expect(retentionSchema.parse(90)).toBe(90);
    expect(retentionSchema.safeParse(1).success).toBe(false);
  });
  it("expiry is measured from creation and keep has no expiry", () => {
    expect(expiresAt("2026-10-25T00:00:00Z", 7)).toBe("2026-11-01T00:00:00.000Z");
    expect(expiresAt("2026-10-25T00:00:00Z", null)).toBeNull();
  });
  it("cross-report refs cannot collide or dangle", () => {
    const value = {
      answer: "answer",
      observations: [
        { text: "a", refs: ["A:E1"] },
        { text: "b", refs: ["B:E1"] },
        { text: "none", refs: [] },
      ],
      suggestions: [],
      unknowns: [],
    };
    expect(groundArtifact(value, ["A:E1"]).observations).toEqual([{ text: "a", refs: ["A:E1"] }]);
  });
  it("report entry matches input", () => {
    expect(reportTab("visual", true)).toBe("screens");
    expect(reportTab("repo", true)).toBe("flow");
    expect(reportTab("runtime", true)).toBe("findings");
  });
  it("checklist items toggle only their own done state", () => {
    const content = checklistSchema.parse({
      items: [
        { id: "gaps", title: "Resolve gaps", note: "", done: false },
        { id: "brief", title: "Build brief", note: "", done: true },
      ],
    });
    const toggled = toggleChecklistItem(content, "gaps");
    expect(toggled.items[0]).toMatchObject({ id: "gaps", done: true });
    expect(toggled.items[1]).toMatchObject({ id: "brief", done: true });
    expect(content.items[0]?.done).toBe(false);
  });
  it("checklist toggle rejects unknown items and empty lists", () => {
    const content = checklistSchema.parse({
      items: [{ id: "gaps", title: "Resolve gaps", note: "", done: false }],
    });
    expect(() => toggleChecklistItem(content, "missing")).toThrow();
    expect(checklistSchema.safeParse({ items: [] }).success).toBe(false);
  });
});
