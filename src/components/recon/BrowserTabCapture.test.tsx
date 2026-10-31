import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BrowserTabCapture } from "./BrowserTabCapture";
import { requestBrowserTab } from "@/lib/recon/browser-capture";
vi.mock("@/lib/recon/browser-capture", async (original) => ({ ...await original<typeof import("@/lib/recon/browser-capture")>(), requestBrowserTab: vi.fn() }));
vi.mock("@/lib/recon/visual-capture", () => ({ captureFrame: vi.fn((_video, _w, _h, timestamp: number, index: number) => ({ id: `frame-${index + 1}`, timestamp, image: "data:image/jpeg;base64,/9j/2Q==" })) }));
function media() {
  const track = { stop: vi.fn(), onended: null as (() => void) | null };
  return { track, stream: { getTracks: () => [track], getVideoTracks: () => [track] } as unknown as MediaStream };
}
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.clearAllMocks(); });
describe("browser tab capture consent", () => {
  it("requests permission only on click and preserves media after denial", async () => {
    const change = vi.fn(); vi.mocked(requestBrowserTab).mockRejectedValue(new DOMException("denied", "NotAllowedError"));
    render(<BrowserTabCapture disabled={false} onChange={change} onBusyChange={vi.fn()} />);
    expect(requestBrowserTab).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Share browser tab" }));
    await screen.findByRole("alert"); expect(change).not.toHaveBeenCalled(); expect(requestBrowserTab).toHaveBeenCalledTimes(1);
  });
  it("requires review approval before sending captured frames", async () => {
    const m = media(); const change = vi.fn(); vi.mocked(requestBrowserTab).mockResolvedValue(m.stream);
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    render(<BrowserTabCapture disabled={false} onChange={change} onBusyChange={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Share browser tab" }));
    await screen.findByRole("button", { name: "Stop sharing" });
    fireEvent.loadedData(screen.getByLabelText("Shared browser tab preview"));
    fireEvent.click(screen.getByRole("button", { name: "Capture frame" }));
    expect(change).toHaveBeenCalledWith(null); expect(change).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: "Stop sharing" })); expect(m.track.stop).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("checkbox", { name: "Approve captured frames for analysis" }));
    expect(change).toHaveBeenLastCalledWith(expect.objectContaining({ capture: "browser", frames: [expect.objectContaining({ id: "frame-1" })] }));
    fireEvent.click(screen.getByRole("button", { name: "Remove frame-1" })); expect(change).toHaveBeenLastCalledWith(null);
  });
  it("releases a late permission grant after cancellation", async () => {
    const m = media(); let grant: ((stream: MediaStream) => void) | undefined;
    vi.mocked(requestBrowserTab).mockReturnValue(new Promise((resolve) => { grant = resolve; }));
    render(<BrowserTabCapture disabled={false} onChange={vi.fn()} onBusyChange={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Share browser tab" })); fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    await act(async () => { grant?.(m.stream); }); expect(m.track.stop).toHaveBeenCalledTimes(1);
  });
  it("releases active capture on unmount", async () => {
    const m = media(); vi.mocked(requestBrowserTab).mockResolvedValue(m.stream); vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    const view = render(<BrowserTabCapture disabled={false} onChange={vi.fn()} onBusyChange={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Share browser tab" })); await waitFor(() => expect(screen.getByRole("button", { name: "Stop sharing" })).toBeInTheDocument());
    view.unmount(); expect(m.track.stop).toHaveBeenCalledTimes(1);
  });
});