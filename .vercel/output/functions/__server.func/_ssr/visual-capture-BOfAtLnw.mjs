import { r as sampleTimes, t as VISUAL_LIMITS } from "./visual-EuFN5w1X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/visual-capture-BOfAtLnw.js
function normalizeRect(a, b) {
	const x = Math.max(0, Math.min(1, Math.min(a.x, b.x)));
	const y = Math.max(0, Math.min(1, Math.min(a.y, b.y)));
	return {
		x,
		y,
		width: Math.max(0, Math.min(1 - x, Math.abs(a.x - b.x))),
		height: Math.max(0, Math.min(1 - y, Math.abs(a.y - b.y)))
	};
}
function recordingTimes(duration, selected) {
	const defaults = sampleTimes(duration);
	if (!selected) return defaults;
	if (!selected.length || selected.length > VISUAL_LIMITS.maxFrames || selected.some((t) => !Number.isFinite(t) || t < 0 || t >= duration)) throw new Error("Choose 1–12 moments within the recording.");
	return [...new Set(selected)].sort((a, b) => a - b);
}
function redactPixels(data, width, height, rect) {
	const left = Math.floor(rect.x * width), top = Math.floor(rect.y * height), right = Math.ceil((rect.x + rect.width) * width), bottom = Math.ceil((rect.y + rect.height) * height);
	for (let y = top; y < bottom; y++) for (let x = left; x < right; x++) {
		const i = (y * width + x) * 4;
		data[i] = 0;
		data[i + 1] = 0;
		data[i + 2] = 0;
		data[i + 3] = 255;
	}
	return data;
}
function isMp4File(file) {
	return file.type.toLowerCase() === "video/mp4" || /\.mp4$/i.test(file.name) && [
		"",
		"application/octet-stream",
		"application/mp4"
	].includes(file.type.toLowerCase());
}
function isRecordingFile(file) {
	return file.type.startsWith("video/") || isMp4File(file);
}
function waitForVideo(video, event, action) {
	return new Promise((resolve, reject) => {
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
			reject(/* @__PURE__ */ new Error("This browser cannot play the recording."));
		};
		const timer = setTimeout(() => {
			cleanup();
			reject(/* @__PURE__ */ new Error("The recording took too long to load."));
		}, 15e3);
		video.addEventListener(event, ready, { once: true });
		video.addEventListener("error", fail, { once: true });
		action();
	});
}
function captureFrame(source, width, height, timestamp, index) {
	if (!width || !height) throw new Error("The recording has no visible video.");
	const canvas = document.createElement("canvas");
	const scale = Math.min(1, 1280 / Math.max(width, height));
	canvas.width = Math.round(width * scale);
	canvas.height = Math.round(height * scale);
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Image capture is unavailable.");
	ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
	let image = canvas.toDataURL("image/jpeg", .8);
	if (image.length > VISUAL_LIMITS.maxImageChars) image = canvas.toDataURL("image/jpeg", .5);
	if (image.length > VISUAL_LIMITS.maxImageChars) throw new Error("This frame is too detailed. Upload a smaller image.");
	return {
		id: `frame-${index + 1}`,
		timestamp,
		image
	};
}
async function extractVisualFiles(files, onStage, selectedTimes) {
	if (!files.length) throw new Error("Choose screenshots or a recording.");
	if (files.length > VISUAL_LIMITS.maxFrames) throw new Error("Choose up to 12 screenshots.");
	if (files.some((f) => !f.size || f.size > VISUAL_LIMITS.maxFileBytes)) throw new Error("Each file must be non-empty and under 100MB.");
	const videos = files.filter(isRecordingFile);
	if (videos.length && files.length !== 1) throw new Error("Upload one recording at a time, or screenshots only.");
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
				const { decodeMp4 } = await import("./mp4-decoder-Vrny8flO.mjs");
				return {
					frames: await decodeMp4(file, selectedTimes),
					capture: "recording",
					name: file.name
				};
			}
			const frames = [];
			for (const time of recordingTimes(video.duration, selectedTimes)) {
				if (Math.abs(video.currentTime - time) > .001) await waitForVideo(video, "seeked", () => {
					video.currentTime = time;
				});
				frames.push(captureFrame(video, video.videoWidth, video.videoHeight, time, frames.length));
			}
			return {
				frames,
				capture: "recording",
				name: file.name
			};
		} finally {
			video.removeAttribute("src");
			video.load();
			URL.revokeObjectURL(url);
		}
	}
	const frames = [];
	for (const file of files) {
		if (![
			"image/png",
			"image/jpeg",
			"image/webp"
		].includes(file.type)) throw new Error("Use PNG, JPEG or WebP screenshots, or MP4/WebM video.");
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
		name: files.length === 1 ? files[0]?.name ?? "Screenshot" : `${files.length} screenshots`
	};
}
//#endregion
export { recordingTimes as a, normalizeRect as i, extractVisualFiles as n, redactPixels as o, isRecordingFile as r, captureFrame as t };
