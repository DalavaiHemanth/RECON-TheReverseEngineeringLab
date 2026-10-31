import { recordingTimes } from "./media-review";
import { VISUAL_LIMITS, type VisualFrame } from "./visual";

export function isMp4File(file: Pick<File, "name" | "type">): boolean {
  return (
    file.type.toLowerCase() === "video/mp4" ||
    (/\.mp4$/i.test(file.name) &&
      ["", "application/octet-stream", "application/mp4"].includes(file.type.toLowerCase()))
  );
}

export function isRecordingFile(file: Pick<File, "name" | "type">): boolean {
  return file.type.startsWith("video/") || isMp4File(file);
}

function waitForVideo(video: HTMLVideoElement, event: "loadeddata" | "seeked", action: () => void) {
  return new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      clearTimeout(timer);
      video.removeEventListener(event, ready);
      video.removeEventListener("error", fail);
    };
    const ready = () => {
      cleanup();
      resolve();
    };
    const fail = () => {
      cleanup();
      reject(new Error("This browser cannot play the recording."));
    };
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("The recording took too long to load."));
    }, 15_000);
    video.addEventListener(event, ready, { once: true });
    video.addEventListener("error", fail, { once: true });
    action();
  });
}

export function captureFrame(
  source: CanvasImageSource,
  width: number,
  height: number,
  timestamp: number,
  index: number,
): VisualFrame {
  if (!width || !height) throw new Error("The recording has no visible video.");
  const canvas = document.createElement("canvas");
  const scale = Math.min(1, 1280 / Math.max(width, height));
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Image capture is unavailable.");
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  let image = canvas.toDataURL("image/jpeg", 0.8);
  if (image.length > VISUAL_LIMITS.maxImageChars) image = canvas.toDataURL("image/jpeg", 0.5);
  if (image.length > VISUAL_LIMITS.maxImageChars)
    throw new Error("This frame is too detailed. Upload a smaller image.");
  return { id: `frame-${index + 1}`, timestamp, image };
}

export async function extractVisualFiles(
  files: File[],
  onStage?: (stage: string) => void,
  selectedTimes?: number[],
): Promise<{ frames: VisualFrame[]; capture: "screenshots" | "recording"; name: string }> {
  if (!files.length) throw new Error("Choose screenshots or a recording.");
  if (files.length > VISUAL_LIMITS.maxFrames) throw new Error("Choose up to 12 screenshots.");
  if (files.some((f) => !f.size || f.size > VISUAL_LIMITS.maxFileBytes))
    throw new Error("Each file must be non-empty and under 100MB.");
  const videos = files.filter(isRecordingFile);
  if (videos.length && files.length !== 1)
    throw new Error("Upload one recording at a time, or screenshots only.");
  if (videos.length) {
    const file = videos[0];
    if (!file) throw new Error("Recording not found.");
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    try {
      try {
        await waitForVideo(video, "loadeddata", () => {
          video.src = url;
          video.load();
        });
      } catch (error) {
        if (!isMp4File(file)) throw error;
        onStage?.("Decoding MP4…");
        const { decodeMp4 } = await import("./mp4-decoder");
        return {
          frames: await decodeMp4(file, selectedTimes),
          capture: "recording",
          name: file.name,
        };
      }
      const frames: VisualFrame[] = [];
      for (const time of recordingTimes(video.duration, selectedTimes)) {
        if (Math.abs(video.currentTime - time) > 0.001)
          await waitForVideo(video, "seeked", () => {
            video.currentTime = time;
          });
        frames.push(captureFrame(video, video.videoWidth, video.videoHeight, time, frames.length));
      }
      return { frames, capture: "recording", name: file.name };
    } finally {
      video.removeAttribute("src");
      video.load();
      URL.revokeObjectURL(url);
    }
  }
  const frames: VisualFrame[] = [];
  for (const file of files) {
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type))
      throw new Error("Use PNG, JPEG or WebP screenshots, or MP4/WebM video.");
    const image = await createImageBitmap(file);
    try {
      frames.push(captureFrame(image, image.width, image.height, frames.length, frames.length));
    } finally {
      image.close();
    }
  }
  return {
    frames,
    capture: "screenshots",
    name: files.length === 1 ? (files[0]?.name ?? "Screenshot") : `${files.length} screenshots`,
  };
}
