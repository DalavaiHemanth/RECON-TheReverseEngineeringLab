import { describe, expect, it, vi, afterEach } from "vitest";
import { extractVisualFiles, isMp4File, isRecordingFile } from "./visual-capture";
vi.mock("./mp4-decoder", () => ({ decodeMp4: vi.fn(async () => [{ id: "frame-1", timestamp: 0, image: "data:image/jpeg;base64,/9j/2Q==" }]) }));
afterEach(() => vi.restoreAllMocks());
describe("MP4 recording support", () => {
  it("recognizes MP4 with video MIME type", () => { expect(isMp4File({ name: "recording", type: "video/mp4" })).toBe(true); });
  it("recognizes MP4 uploads with missing or generic MIME metadata", () => {
    expect(isRecordingFile({ name: "Instagram.MP4", type: "" })).toBe(true);
    expect(isRecordingFile({ name: "feature.mp4", type: "application/octet-stream" })).toBe(true);
    expect(isMp4File({ name: "feature.mp4", type: "image/png" })).toBe(false);
    expect(isRecordingFile({ name: "feature.txt", type: "" })).toBe(false);
  });
  it("falls back to local MP4 decoding when native playback fails", async () => {
    const video = document.createElement("video");
    vi.spyOn(video, "load").mockImplementation(() => { queueMicrotask(() => video.dispatchEvent(new Event("error"))); });
    vi.spyOn(document, "createElement").mockReturnValue(video);
    vi.stubGlobal("URL", { createObjectURL: () => "blob:recording", revokeObjectURL: vi.fn() });
    const stage = vi.fn();
    const result = await extractVisualFiles([new File(["mp4"], "feature.mp4", { type: "video/mp4" })], stage);
    expect(stage).toHaveBeenCalledWith("Decoding MP4…");
    expect(result.capture).toBe("recording"); expect(result.frames).toHaveLength(1);
    vi.unstubAllGlobals();
  });
  it("rejects multiple recordings before decoding", async () => {
    await expect(extractVisualFiles([new File(["x"], "one.mp4"), new File(["x"], "two.mp4")])).rejects.toThrow("one recording at a time");
  });
});