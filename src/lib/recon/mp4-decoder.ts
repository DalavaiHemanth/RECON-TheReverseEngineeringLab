import wasmAsset from "../../../public/vendor/ffmpeg/ffmpeg-core.wasm.asset.json";
import { recordingTimes } from "./media-review";
import { type VisualFrame } from "./visual";
import { captureFrame } from "./visual-capture";

/** Browser-only, single-thread WASM fallback. No recording leaves this device. */
export async function decodeMp4(file: File, selectedTimes?: number[]): Promise<VisualFrame[]> {
  const { FFmpeg } = await import("@ffmpeg/ffmpeg");
  const decoder = new FFmpeg();
  const frames: VisualFrame[] = [];
  const timer = setTimeout(() => decoder.terminate(), 120_000);
  try {
    await decoder.load({
      classWorkerURL: new URL("/vendor/ffmpeg/worker.js", window.location.origin).href,
      coreURL: new URL("/vendor/ffmpeg/ffmpeg-core.js", window.location.origin).href,
      wasmURL: new URL(wasmAsset.url, window.location.origin).href,
    });
    await decoder.writeFile("input.mp4", new Uint8Array(await file.arrayBuffer()));
    // This WASM build can return -1 after writing valid ffprobe output; validate the output instead.
    await decoder.ffprobe([
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "json",
      "input.mp4",
      "-o",
      "duration.json",
    ]);
    const metadata = JSON.parse((await decoder.readFile("duration.json", "utf8")) as string) as {
      format?: { duration?: string };
    };
    const times = recordingTimes(Number(metadata.format?.duration), selectedTimes);
    for (const time of times) {
      const code = await decoder.exec([
        "-ss",
        String(time),
        "-i",
        "input.mp4",
        "-frames:v",
        "1",
        "-vf",
        "scale=1280:1280:force_original_aspect_ratio=decrease",
        "-q:v",
        "3",
        "-y",
        "frame.jpg",
      ]);
      if (code !== 0) throw new Error("Could not extract a visible MP4 frame.");
      const bytes = await decoder.readFile("frame.jpg");
      if (!(bytes instanceof Uint8Array)) throw new Error("The MP4 frame is unreadable.");
      const image = await createImageBitmap(
        new Blob([new Uint8Array(bytes)], { type: "image/jpeg" }),
      );
      try {
        frames.push(captureFrame(image, image.width, image.height, time, frames.length));
      } finally {
        image.close();
      }
    }
    return frames;
  } catch (error) {
    if (
      error instanceof Error &&
      /180 seconds|visible MP4 frame|could not be read/.test(error.message)
    )
      throw error;
    throw new Error(
      "Could not decode this MP4. It may be damaged, encrypted, or too complex for this device. Try a shorter recording.",
    );
  } finally {
    clearTimeout(timer);
    decoder.terminate();
  }
}
