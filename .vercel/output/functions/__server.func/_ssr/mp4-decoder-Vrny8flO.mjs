import { a as recordingTimes, t as captureFrame } from "./visual-capture-BOfAtLnw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mp4-decoder-Vrny8flO.js
var ffmpeg_core_wasm_asset_default = {
	version: 1,
	asset_id: "b93b4bd9-4d89-4680-bd1f-25ac0a85a329",
	project_id: "42688e32-bd79-4904-a13e-8af7e696263f",
	url: "/__l5e/assets-v1/b93b4bd9-4d89-4680-bd1f-25ac0a85a329/ffmpeg-core.wasm",
	r2_key: "a/v1/42688e32-bd79-4904-a13e-8af7e696263f/b93b4bd9-4d89-4680-bd1f-25ac0a85a329/ffmpeg-core.wasm",
	original_filename: "ffmpeg-core.wasm",
	size: 32232419,
	content_type: "application/wasm",
	created_at: "2026-10-25T06:06:06Z"
};
/** Browser-only, single-thread WASM fallback. No recording leaves this device. */
async function decodeMp4(file, selectedTimes) {
	const { FFmpeg } = await import("../_libs/ffmpeg__ffmpeg.mjs").then((n) => n.t);
	const decoder = new FFmpeg();
	const frames = [];
	const timer = setTimeout(() => decoder.terminate(), 12e4);
	try {
		await decoder.load({
			classWorkerURL: new URL("/vendor/ffmpeg/worker.js", window.location.origin).href,
			coreURL: new URL("/vendor/ffmpeg/ffmpeg-core.js", window.location.origin).href,
			wasmURL: new URL(ffmpeg_core_wasm_asset_default.url, window.location.origin).href
		});
		await decoder.writeFile("input.mp4", new Uint8Array(await file.arrayBuffer()));
		await decoder.ffprobe([
			"-v",
			"error",
			"-show_entries",
			"format=duration",
			"-of",
			"json",
			"input.mp4",
			"-o",
			"duration.json"
		]);
		const metadata = JSON.parse(await decoder.readFile("duration.json", "utf8"));
		const times = recordingTimes(Number(metadata.format?.duration), selectedTimes);
		for (const time of times) {
			if (await decoder.exec([
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
				"frame.jpg"
			]) !== 0) throw new Error("Could not extract a visible MP4 frame.");
			const bytes = await decoder.readFile("frame.jpg");
			if (!(bytes instanceof Uint8Array)) throw new Error("The MP4 frame is unreadable.");
			const image = await createImageBitmap(new Blob([new Uint8Array(bytes)], { type: "image/jpeg" }));
			try {
				frames.push(captureFrame(image, image.width, image.height, time, frames.length));
			} finally {
				image.close();
			}
		}
		return frames;
	} catch (error) {
		if (error instanceof Error && /180 seconds|visible MP4 frame|could not be read/.test(error.message)) throw error;
		throw new Error("Could not decode this MP4. It may be damaged, encrypted, or too complex for this device. Try a shorter recording.");
	} finally {
		clearTimeout(timer);
		decoder.terminate();
	}
}
//#endregion
export { decodeMp4 };
