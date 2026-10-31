import { afterEach, describe, expect, it, vi } from "vitest";
import { requestBrowserTab } from "./browser-capture";
afterEach(() => vi.restoreAllMocks());
describe("browser capture permission boundary", () => {
  it("requests tab-only video without audio", async () => {
    const track = { readyState: "live", getSettings: () => ({ displaySurface: "browser" }), stop: vi.fn() };
    const media = { getVideoTracks: () => [track], getAudioTracks: () => [], getTracks: () => [track] };
    const getDisplayMedia = vi.fn().mockResolvedValue(media);
    Object.defineProperty(window, "isSecureContext", { configurable: true, get: () => true });
    Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: { getDisplayMedia } });
    expect(await requestBrowserTab()).toBe(media);
    expect(getDisplayMedia).toHaveBeenCalledWith({ video: { displaySurface: "browser" }, audio: false });
  });
  it("stops screen/window capture instead of accepting broader access", async () => {
    const track = { readyState: "live", getSettings: () => ({ displaySurface: "monitor" }), stop: vi.fn() };
    Object.defineProperty(window, "isSecureContext", { configurable: true, get: () => true });
    Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: { getDisplayMedia: vi.fn().mockResolvedValue({ getVideoTracks: () => [track], getTracks: () => [track] }) } });
    await expect(requestBrowserTab()).rejects.toThrow("rather than an entire screen"); expect(track.stop).toHaveBeenCalledTimes(1);
  });
});