export function browserCaptureError(error: unknown): string {
  const name = error instanceof Error ? error.name : "";
  if (name === "NotAllowedError") return "Sharing was cancelled or permission was denied. No new frames were captured.";
  if (name === "NotFoundError") return "No browser tab is available to share. Upload a recording instead.";
  if (name === "NotReadableError") return "The selected tab could not be captured. Check your device’s screen-sharing permissions.";
  if (name === "InvalidStateError") return "Open RECON in an active browser tab and select Share browser tab again.";
  return error instanceof Error ? error.message : "Could not share this browser tab.";
}

/** Must be called directly by a user action; never reuse a previous grant. */
export async function requestBrowserTab(): Promise<MediaStream> {
  if (!window.isSecureContext || !navigator.mediaDevices?.getDisplayMedia) throw new Error("Tab sharing is unavailable in this browser or preview. Open RECON in a browser tab or upload a recording.");
  const media = await navigator.mediaDevices.getDisplayMedia({ video: { displaySurface: "browser" }, audio: false });
  const track = media.getVideoTracks()[0];
  if (!track || track.readyState === "ended") {
    media.getTracks().forEach((t) => t.stop());
    throw new Error("The selected tab is no longer being shared.");
  }
  const surface = track.getSettings().displaySurface;
  if (surface && surface !== "browser") {
    media.getTracks().forEach((t) => t.stop());
    throw new Error("Choose a browser tab rather than an entire screen or window.");
  }
  media.getAudioTracks().forEach((t) => t.stop());
  return media;
}