import { i as __toESM } from "../_runtime.mjs";
import { n as analyzeBinary, t as BINARY_LIMITS } from "./binary-D7d1B_nr.mjs";
import { a as visualSourceSchema, t as VISUAL_LIMITS } from "./visual-EuFN5w1X.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as CheckboxIndicator, p as require_jsx_runtime, t as Checkbox$1 } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { J as ChevronDown, N as GitBranch, Q as Binary, R as EyeOff, S as MonitorUp, T as LoaderCircle, V as Crop, X as Camera, Y as Check, Z as BookOpen, _ as Plus, c as Square, d as Server, i as Undo2, j as Globe, l as ShieldCheck, o as Trash2, p as ScanEye, r as Upload, t as X, y as Pencil } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useServerFn } from "./createSsrRpc-BLoCzgET.mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as CollapsibleContent$1, r as CollapsibleTrigger$1, t as Collapsible$1 } from "../_libs/@radix-ui/react-collapsible+[...].mjs";
import { n as ModeBadge } from "./badges-CBC3dkLi.mjs";
import { n as createInvestigation } from "./investigations.functions-wzbWpDnv.mjs";
import { i as startingQuestions, n as TARGET_MODE, t as STARTING_ADVICE } from "./recommendations-Dv7KIYGT.mjs";
import { i as normalizeRect, n as extractVisualFiles, o as redactPixels, r as isRecordingFile, t as captureFrame } from "./visual-capture-BOfAtLnw.mjs";
import { extractZip } from "./repo-loader-Dz-5o2Ka.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/radix-ui__react-slider.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/new-BPGnOsyQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
var Slider = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
	ref,
	className: cn("relative flex w-full touch-none select-none items-center", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
		className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-primary" })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" })]
}));
Slider.displayName = Slider$1.displayName;
var Checkbox = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
	ref,
	className: cn("grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxIndicator, {
		className: cn("grid place-content-center text-current"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
	})
}));
Checkbox.displayName = Checkbox$1.displayName;
var Collapsible = Collapsible$1;
var CollapsibleTrigger = CollapsibleTrigger$1;
var CollapsibleContent = CollapsibleContent$1;
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
function FrameEditor({ frame, onSave, onClose }) {
	const [mode, setMode] = (0, import_react.useState)("redact");
	const [selection, setSelection] = (0, import_react.useState)(null);
	const [edited, setEdited] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const start = (0, import_react.useRef)(null);
	const image = (0, import_react.useRef)(null);
	function point(e) {
		const r = e.currentTarget.getBoundingClientRect();
		return {
			x: (e.clientX - r.left) / r.width,
			y: (e.clientY - r.top) / r.height
		};
	}
	async function apply() {
		if (!frame || !selection || !image.current) return;
		try {
			const img = image.current;
			await img.decode();
			const c = document.createElement("canvas");
			c.width = img.naturalWidth;
			c.height = img.naturalHeight;
			const ctx = c.getContext("2d");
			if (!ctx) throw new Error("Image editing unavailable.");
			ctx.drawImage(img, 0, 0);
			if (mode === "redact") {
				const pixels = ctx.getImageData(0, 0, c.width, c.height);
				redactPixels(pixels.data, c.width, c.height, selection);
				ctx.putImageData(pixels, 0, 0);
			} else {
				const crop = document.createElement("canvas");
				crop.width = Math.max(1, Math.round(selection.width * c.width));
				crop.height = Math.max(1, Math.round(selection.height * c.height));
				const dest = crop.getContext("2d");
				if (!dest) throw new Error("Image editing unavailable.");
				dest.drawImage(c, selection.x * c.width, selection.y * c.height, selection.width * c.width, selection.height * c.height, 0, 0, crop.width, crop.height);
				c.width = crop.width;
				c.height = crop.height;
				ctx.drawImage(crop, 0, 0);
			}
			setEdited(captureFrame(c, c.width, c.height, frame.timestamp, 0).image);
			setSelection(null);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Could not edit frame.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: Boolean(frame),
		onOpenChange: (open) => {
			if (!open) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90vh] max-w-3xl overflow-y-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Edit private areas" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: mode === "redact" ? "default" : "outline",
							onClick: () => setMode("redact"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, {}), " Redact"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: mode === "crop" ? "default" : "outline",
							onClick: () => setMode("crop"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crop, {}), " Crop"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							title: "Undo all edits",
							"aria-label": "Undo all edits",
							onClick: () => {
								setEdited(null);
								setSelection(null);
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, {})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto w-fit max-w-full touch-none select-none",
					onPointerDown: (e) => {
						start.current = point(e);
						e.currentTarget.setPointerCapture(e.pointerId);
						setSelection(null);
					},
					onPointerMove: (e) => {
						if (start.current) setSelection(normalizeRect(start.current, point(e)));
					},
					onPointerUp: () => {
						start.current = null;
					},
					children: [frame && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						ref: image,
						src: edited ?? frame.image,
						alt: "Frame to edit",
						draggable: false,
						className: "max-h-[55vh] max-w-full"
					}), selection && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pointer-events-none absolute border-2 border-primary bg-primary/20",
						style: {
							left: `${selection.x * 100}%`,
							top: `${selection.y * 100}%`,
							width: `${selection.width * 100}%`,
							height: `${selection.height * 100}%`
						}
					})]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "text-destructive",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						disabled: !selection || selection.width < .01 || selection.height < .01,
						onClick: apply,
						children: "Apply selection"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => {
							if (frame) onSave({
								...frame,
								image: edited ?? frame.image
							});
							onClose();
						},
						children: "Save edited frame"
					})]
				})
			]
		})
	});
}
function browserCaptureError(error) {
	const name = error instanceof Error ? error.name : "";
	if (name === "NotAllowedError") return "Sharing was cancelled or permission was denied. No new frames were captured.";
	if (name === "NotFoundError") return "No browser tab is available to share. Upload a recording instead.";
	if (name === "NotReadableError") return "The selected tab could not be captured. Check your device’s screen-sharing permissions.";
	if (name === "InvalidStateError") return "Open RECON in an active browser tab and select Share browser tab again.";
	return error instanceof Error ? error.message : "Could not share this browser tab.";
}
/** Must be called directly by a user action; never reuse a previous grant. */
async function requestBrowserTab() {
	if (!window.isSecureContext || !navigator.mediaDevices?.getDisplayMedia) throw new Error("Tab sharing is unavailable in this browser or preview. Open RECON in a browser tab or upload a recording.");
	const media = await navigator.mediaDevices.getDisplayMedia({
		video: { displaySurface: "browser" },
		audio: false
	});
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
function BrowserTabCapture({ disabled, onChange, onBusyChange }) {
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [draft, setDraft] = (0, import_react.useState)([]);
	const [ready, setReady] = (0, import_react.useState)(false);
	const [elapsed, setElapsed] = (0, import_react.useState)(0);
	const [error, setError] = (0, import_react.useState)("");
	const [approved, setApproved] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const player = (0, import_react.useRef)(null);
	const stream = (0, import_react.useRef)(null);
	const generation = (0, import_react.useRef)(0);
	const alive = (0, import_react.useRef)(true);
	const started = (0, import_react.useRef)(0);
	const frameList = (0, import_react.useRef)([]);
	const release = (0, import_react.useCallback)(() => {
		const media = stream.current;
		stream.current = null;
		media?.getTracks().forEach((track) => {
			track.onended = null;
			track.stop();
		});
		if (player.current) player.current.srcObject = null;
	}, []);
	const stop = (0, import_react.useCallback)(() => {
		generation.current += 1;
		release();
		setReady(false);
		setStatus(frameList.current.length ? "review" : "idle");
	}, [release]);
	(0, import_react.useEffect)(() => {
		alive.current = true;
		return () => {
			alive.current = false;
			generation.current += 1;
			release();
		};
	}, [release]);
	(0, import_react.useEffect)(() => {
		onBusyChange(status === "permission" || status === "sharing" || status === "review" && !approved);
		return () => onBusyChange(false);
	}, [
		status,
		approved,
		onBusyChange
	]);
	(0, import_react.useEffect)(() => {
		if (status !== "sharing") return;
		const timer = setInterval(() => {
			const seconds = (performance.now() - started.current) / 1e3;
			setElapsed(Math.floor(seconds));
			if (seconds >= VISUAL_LIMITS.maxDuration) stop();
		}, 250);
		return () => clearInterval(timer);
	}, [status, stop]);
	async function share() {
		const request = ++generation.current;
		setError("");
		setStatus("permission");
		setReady(false);
		try {
			const media = await requestBrowserTab();
			if (!alive.current || request !== generation.current) {
				media.getTracks().forEach((t) => t.stop());
				return;
			}
			stream.current = media;
			frameList.current = [];
			setDraft([]);
			setApproved(false);
			onChange(null);
			started.current = performance.now();
			setElapsed(0);
			const track = media.getVideoTracks()[0];
			if (track) track.onended = stop;
			setStatus("sharing");
			const video = player.current;
			if (!video) throw new Error("Tab preview is unavailable.");
			video.srcObject = media;
			await video.play();
			if (alive.current && request === generation.current) setReady(video.readyState >= 2 && video.videoWidth > 0);
		} catch (e) {
			if (!alive.current || request !== generation.current) return;
			release();
			setStatus(frameList.current.length ? "review" : "idle");
			setError(browserCaptureError(e));
		}
	}
	function capture() {
		const video = player.current;
		if (!video || !ready || status !== "sharing") return;
		const seconds = (performance.now() - started.current) / 1e3;
		if (seconds >= VISUAL_LIMITS.maxDuration || frameList.current.length >= VISUAL_LIMITS.maxFrames) {
			stop();
			return;
		}
		try {
			const frame = captureFrame(video, video.videoWidth, video.videoHeight, seconds, frameList.current.length);
			frameList.current = [...frameList.current, frame];
			setDraft(frameList.current);
			setError("");
			if (frameList.current.length >= VISUAL_LIMITS.maxFrames) stop();
		} catch (e) {
			setError(browserCaptureError(e));
		}
	}
	function remove(id) {
		frameList.current = frameList.current.filter((f) => f.id !== id);
		setDraft(frameList.current);
		setApproved(false);
		onChange(null);
		if (!frameList.current.length) setStatus("idle");
	}
	function approve(checked) {
		setApproved(checked);
		onChange(checked ? {
			type: "visual",
			name: "Browser demonstration",
			capture: "browser",
			frames: frameList.current
		} : null);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Collapsible, {
				className: "border-y border-border py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollapsibleTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						className: "group h-auto w-full justify-start whitespace-normal px-0 text-left text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-4 w-4 shrink-0" }),
							" Browser demonstration guide",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "ml-auto h-4 w-4 shrink-0 transition-transform group-data-[state=open]:rotate-180 motion-reduce:transition-none" })
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CollapsibleContent, {
					className: "space-y-3 pb-2 pt-3 text-sm text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
							className: "list-decimal space-y-3 pl-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-foreground",
									children: "Prepare the feature."
								}), " Open the website in a separate tab and sign in there if needed. Hide private messages, account details, and notifications before sharing."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: "Choose the right tab."
									}),
									" Click",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: "Share browser tab"
									}),
									". In your browser’s chooser, select the tab containing the feature—not this RECON tab—then confirm Share. Choose a browser tab, not a window or your entire screen. Cancel if you are unsure."
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: "Show the before, action, and result."
									}),
									" ",
									"Capture the starting screen, use the feature in the shared tab, then return here and click ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: "Capture frame"
									}),
									" after each important change. Frames are captured only when you click; leave menus and results visible long enough to capture them."
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: "Stop, review, and approve."
									}),
									" Click",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: "Stop sharing"
									}),
									" or use your browser’s stop control. Remove private or unhelpful frames, approve the remaining frames, and write a specific investigation question before starting."
								] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-foreground",
							children: "Example:"
						}), " For an Instagram feature, capture where you open it, its options, and the final result. Ask: “What changes on screen when I use this feature?”"] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"Audio is off. Analysis sees captured screens, not clicks or hidden code. You can capture up to ",
							VISUAL_LIMITS.maxFrames,
							" frames during ",
							VISUAL_LIMITS.maxDuration / 60,
							" minutes of sharing; nothing is sent until you approve and start the investigation."
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Wrong tab? Stop sharing, then choose another tab; a fresh capture replaces the current frames. If tab sharing is unavailable, use a desktop browser that supports it, or upload screenshots or an MP4 recording instead." })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					(status === "idle" || status === "review") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						disabled,
						onClick: share,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonitorUp, {}), draft.length ? "Share another tab" : "Share browser tab"]
					}),
					status === "permission" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						role: "status",
						className: "flex items-center gap-2 text-sm text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Waiting for browser permission…"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: stop,
						children: "Cancel"
					})] }),
					status === "sharing" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: capture,
							disabled: disabled || !ready,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, {}), " Capture frame"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: stop,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, {}), " Stop sharing"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							role: "status",
							className: "font-mono text-xs text-primary",
							children: [
								"Sharing tab · ",
								elapsed,
								"s · ",
								draft.length,
								"/",
								VISUAL_LIMITS.maxFrames,
								" frames"
							]
						})
					] })
				]
			}),
			status === "idle" && !draft.length && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "flex items-start gap-2 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 shrink-0" }), " Permission is requested by your browser. Audio is off; captured frames stay on your device until you approve them and start an investigation."]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				ref: player,
				muted: true,
				playsInline: true,
				autoPlay: true,
				onLoadedData: () => setReady(true),
				"aria-label": "Shared browser tab preview",
				className: status === "sharing" ? "aspect-video w-full rounded-md bg-muted object-contain" : "hidden"
			}),
			draft.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-sm font-medium text-foreground",
					children: status === "review" ? "Review captured frames" : "Captured frames"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-2 sm:grid-cols-3",
					children: draft.map((frame) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: frame.image,
							alt: `Captured ${frame.id}`,
							className: "aspect-video w-full rounded border border-border bg-muted object-contain"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
							className: "mt-1 flex items-center justify-between gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-[10px] text-muted-foreground",
									children: [
										frame.id,
										" · ",
										frame.timestamp.toFixed(1),
										"s"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "ghost",
									className: "h-7 w-7",
									disabled: disabled || status === "sharing",
									title: "Crop or redact frame",
									"aria-label": `Edit ${frame.id}`,
									onClick: () => setEditing(frame),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "ghost",
									className: "h-7 w-7",
									disabled: disabled || status === "sharing",
									onClick: () => remove(frame.id),
									"aria-label": `Remove ${frame.id}`,
									title: "Remove frame",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
								})
							]
						})]
					}, frame.id))
				}),
				status === "review" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-3 flex cursor-pointer items-start gap-2 text-sm text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
						checked: approved,
						disabled,
						onCheckedChange: (v) => approve(v === true),
						"aria-label": "Approve captured frames for analysis"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "I reviewed these frames and approve sending them for analysis when I start the investigation." })]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FrameEditor, {
				frame: editing,
				onClose: () => setEditing(null),
				onSave: (frame) => {
					frameList.current = frameList.current.map((f) => f.id === frame.id ? frame : f);
					setDraft(frameList.current);
					setApproved(false);
					onChange(null);
				}
			}, editing?.id ?? "none")
		]
	});
}
function RecordingPicker({ file, busy, onExtract, onCancel }) {
	const [url, setUrl] = (0, import_react.useState)("");
	const [duration, setDuration] = (0, import_react.useState)(0);
	const [time, setTime] = (0, import_react.useState)(0);
	const [times, setTimes] = (0, import_react.useState)([]);
	const [playable, setPlayable] = (0, import_react.useState)(true);
	const video = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const u = URL.createObjectURL(file);
		setUrl(u);
		return () => URL.revokeObjectURL(u);
	}, [file]);
	function add() {
		if (times.length >= 12) return;
		setTimes((v) => [.../* @__PURE__ */ new Set([...v, time])].sort((a, b) => a - b));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-3 border-y border-border py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-medium",
				children: "Choose recording moments"
			}),
			url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				ref: video,
				src: url,
				muted: true,
				playsInline: true,
				controls: true,
				onLoadedMetadata: (e) => setDuration(e.currentTarget.duration),
				onTimeUpdate: (e) => setTime(e.currentTarget.currentTime),
				onError: () => setPlayable(false),
				className: "max-h-80 w-full bg-muted"
			}),
			duration > VISUAL_LIMITS.maxDuration && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "text-destructive",
				children: "Use a recording no longer than 3 minutes."
			}),
			playable && duration > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
				"aria-label": "Recording moment",
				min: 0,
				max: Math.max(0, duration - .05),
				step: .1,
				value: [time],
				onValueChange: (v) => {
					const t = v[0] ?? 0;
					setTime(t);
					if (video.current) video.current.currentTime = t;
				}
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				"aria-label": "Moment in seconds",
				type: "number",
				min: 0,
				max: 179.9,
				step: .1,
				value: time,
				onChange: (e) => setTime(Number(e.target.value))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm text-muted-foreground",
						children: [time.toFixed(1), "s"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						disabled: busy || times.length >= 12,
						onClick: add,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), " Add moment"]
					}),
					times.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						title: "Remove moment",
						onClick: () => setTimes((v) => v.filter((n) => n !== t)),
						children: [
							t.toFixed(1),
							"s ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" })
						]
					}, t))
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: busy || duration > 180,
					onClick: () => onExtract(times.length ? times : void 0),
					children: times.length ? `Extract ${times.length} selected moments` : "Extract automatic samples"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: busy,
					variant: "ghost",
					onClick: onCancel,
					children: "Cancel"
				})]
			})
		]
	});
}
function VisualInput({ value, onChange, disabled, onBusyChange }) {
	const [processing, setProcessing] = (0, import_react.useState)(false);
	const [stage, setStage] = (0, import_react.useState)("Reading frames…");
	const [captureBusy, setCaptureBusy] = (0, import_react.useState)(false);
	const [captureVersion, setCaptureVersion] = (0, import_react.useState)(0);
	const [draft, setDraft] = (0, import_react.useState)(null);
	const [approved, setApproved] = (0, import_react.useState)(false);
	const [recording, setRecording] = (0, import_react.useState)(null);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const generation = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		onBusyChange(processing || captureBusy || Boolean(recording) || Boolean(draft && !approved));
		return () => onBusyChange(false);
	}, [
		processing,
		captureBusy,
		recording,
		draft,
		approved,
		onBusyChange
	]);
	(0, import_react.useEffect)(() => () => {
		generation.current += 1;
	}, []);
	async function upload(files, times) {
		const request = ++generation.current;
		setProcessing(true);
		setStage("Reading frames…");
		onChange(null);
		setApproved(false);
		try {
			const result = await extractVisualFiles(files, setStage, times);
			if (request !== generation.current) return;
			setCaptureVersion((v) => v + 1);
			setDraft({
				type: "visual",
				...result
			});
			setRecording(null);
		} catch (e) {
			if (request === generation.current) toast.error(e instanceof Error ? e.message : "Could not read media.");
		} finally {
			if (request === generation.current) setProcessing(false);
		}
	}
	function changeFrames(frames) {
		setDraft((d) => d ? {
			...d,
			frames
		} : null);
		setApproved(false);
		onChange(null);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						disabled: disabled || processing || captureBusy,
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							htmlFor: "visual-files",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {}), " Upload media"]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "visual-files",
						className: "hidden",
						type: "file",
						multiple: true,
						accept: "image/png,image/jpeg,image/webp,video/mp4,.mp4,video/webm,video/quicktime",
						disabled: disabled || processing || captureBusy,
						onChange: (e) => {
							const files = Array.from(e.target.files ?? []);
							e.target.value = "";
							if (files.length === 1 && files[0] && isRecordingFile(files[0])) {
								setRecording(files[0]);
								setDraft(null);
								setApproved(false);
								onChange(null);
								setCaptureVersion((v) => v + 1);
							} else upload(files);
						}
					}),
					(value || draft || recording) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						title: "Remove media",
						"aria-label": "Remove media",
						disabled: disabled || processing || captureBusy,
						onClick: () => {
							generation.current += 1;
							setCaptureVersion((v) => v + 1);
							setDraft(null);
							setRecording(null);
							setApproved(false);
							onChange(null);
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
					}),
					processing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						role: "status",
						className: "flex items-center gap-2 text-sm text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), stage]
					})
				]
			}),
			recording && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordingPicker, {
				file: recording,
				busy: processing,
				onExtract: (times) => upload([recording], times),
				onCancel: () => setRecording(null)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrowserTabCapture, {
				disabled: disabled || processing || Boolean(recording),
				onChange: (v) => {
					if (v) {
						setDraft(null);
						setApproved(false);
					}
					onChange(v);
				},
				onBusyChange: setCaptureBusy
			}, captureVersion),
			draft && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "font-medium",
					children: ["Review uploaded frames · ", draft.frames.length]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-3 sm:grid-cols-3",
					children: draft.frames.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: f.image,
							alt: `Preview ${f.id}`,
							className: "aspect-video w-full rounded border border-border bg-muted object-contain"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
							className: "mt-1 flex items-center justify-between gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground",
								children: [f.id, draft.capture === "recording" ? ` · ${f.timestamp.toFixed(1)}s` : ""]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "ghost",
									className: "h-7 w-7",
									"aria-label": `Edit ${f.id}`,
									title: "Crop or redact frame",
									disabled,
									onClick: () => setEditing(f),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "ghost",
									className: "h-7 w-7",
									"aria-label": `Remove ${f.id}`,
									disabled,
									onClick: () => changeFrames(draft.frames.filter((n) => n.id !== f.id)),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
								})]
							})]
						})]
					}, f.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-start gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
						"aria-label": "Approve uploaded frames for analysis",
						disabled: disabled || !draft.frames.length,
						checked: approved,
						onCheckedChange: (v) => {
							setApproved(v === true);
							onChange(v === true ? draft : null);
						}
					}), "I reviewed these frames and approve sending them for analysis when I start."]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FrameEditor, {
				frame: editing,
				onClose: () => setEditing(null),
				onSave: (f) => {
					if (draft) changeFrames(draft.frames.map((n) => n.id === f.id ? f : n));
				}
			}, editing?.id ?? "none")
		]
	});
}
var TARGETS = [
	{
		id: "repo",
		label: "Source code",
		icon: GitBranch,
		hint: "GitHub link or .zip upload"
	},
	{
		id: "web",
		label: "Website URL",
		icon: Globe,
		hint: "Public pages, forms, and scripts"
	},
	{
		id: "runtime",
		label: "Running application",
		icon: Server,
		hint: "API paths and responses"
	},
	{
		id: "binary",
		label: "Binary / executable",
		icon: Binary,
		hint: "File structure, strings, imports"
	},
	{
		id: "visual",
		label: "Visual feature",
		icon: ScanEye,
		hint: "Screenshots, recordings, browser demo"
	}
];
var TARGET_NOTE = {
	visual: "Up to 12 screenshots or one recording (100MB, 3 minutes). Recordings are sampled into up to 12 frames; audio and between-frame actions are not analyzed. Only reviewed frames are sent for analysis. Remove private information first. Visual evidence cannot prove hidden implementation or a feature’s release date.",
	repo: "Public repositories work out of the box; save a GitHub token in Settings for private ones. Python, JavaScript/TypeScript, Go, Rust, Java, Kotlin, C#, C/C++, Ruby, PHP and Swift files are indexed (up to 1,500 files). Code is read, never executed.",
	web: "The site is crawled server-side (same-origin pages only, up to 12 pages). No real browser is used; analysis is based on fetched HTML, headers and scripts.",
	runtime: "Only safe read-only requests (GET/HEAD/OPTIONS) are sent — never POST, PUT or DELETE. Only probe applications you own or have permission to test.",
	binary: `The file is analyzed statically in your browser — strings, sections and imports are extracted, nothing is uploaded whole or executed. Max ${Math.round(BINARY_LIMITS.maxBytes / 1e6)}MB.`
};
function NewInvestigation() {
	const navigate = useNavigate();
	const create = useServerFn(createInvestigation);
	const [target, setTarget] = (0, import_react.useState)("repo");
	const [source, setSource] = (0, import_react.useState)("github");
	const [url, setUrl] = (0, import_react.useState)("");
	const [zip, setZip] = (0, import_react.useState)(null);
	const [bin, setBin] = (0, import_react.useState)(null);
	const [visual, setVisual] = (0, import_react.useState)(null);
	const [visualBusy, setVisualBusy] = (0, import_react.useState)(false);
	const [question, setQuestion] = (0, import_react.useState)("");
	const [steps, setSteps] = (0, import_react.useState)(10);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [showAllQuestions, setShowAllQuestions] = (0, import_react.useState)(false);
	const suggestions = startingQuestions(target, question);
	async function start() {
		if (target === "visual" && visualBusy) return;
		if (question.trim().length < 5) {
			toast.error("Ask a more specific question.");
			return;
		}
		setBusy(true);
		try {
			let src;
			if (target === "repo") if (source === "github") {
				if (!url) throw new Error("Paste a GitHub repository link.");
				src = {
					type: "github",
					url
				};
			} else {
				if (!zip) throw new Error("Choose a .zip file.");
				const files = extractZip(new Uint8Array(await zip.arrayBuffer()));
				src = {
					type: "upload",
					name: zip.name,
					files
				};
			}
			else if (target === "web" || target === "runtime") {
				if (!url) throw new Error("Enter a URL.");
				src = {
					type: target,
					url
				};
			} else if (target === "visual") {
				if (!visual) throw new Error("Upload media or capture a browser demonstration.");
				src = visualSourceSchema.parse(visual);
			} else {
				if (!bin) throw new Error("Choose a binary file.");
				const bytes = new Uint8Array(await bin.arrayBuffer());
				if (bytes.length > BINARY_LIMITS.maxBytes) throw new Error(`File too large (max ${Math.round(BINARY_LIMITS.maxBytes / 1e6)}MB).`);
				src = {
					type: "binary",
					name: bin.name,
					info: analyzeBinary(bytes)
				};
			}
			const res = await create({ data: {
				question: question.trim(),
				source: src,
				maxSteps: steps
			} });
			toast.success(target === "visual" ? `Prepared ${res.fileCount} visual frames` : target === "repo" ? `Indexed ${res.fileCount} source files` : target === "binary" ? `Extracted ${res.fileCount} strings` : `Fetched ${res.fileCount} ${target === "web" ? "pages" : "probes"}`);
			navigate({
				to: "/investigations/$id",
				params: { id: res.id }
			});
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not start");
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-3xl px-6 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-semibold text-foreground",
					children: "New investigation"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeBadge, { mode: TARGET_MODE[target] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Target type" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3",
					children: TARGETS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						disabled: busy,
						onClick: () => {
							setTarget(t.id);
							setShowAllQuestions(false);
						},
						className: cn("h-auto min-w-0 flex-col items-start whitespace-normal rounded-lg p-3 text-left transition-colors", target === t.id ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/50"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(t.icon, { className: cn("h-4 w-4", target === t.id ? "text-primary" : "text-muted-foreground") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-foreground",
								children: t.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 font-mono text-[10px] text-muted-foreground",
								children: t.hint
							})
						]
					}, t.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 border-y border-border py-5",
				children: [
					target === "repo" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: source === "github" ? "default" : "outline",
							onClick: () => setSource("github"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GitBranch, { className: "h-4 w-4" }), " GitHub link"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: source === "upload" ? "default" : "outline",
							onClick: () => setSource("upload"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }), " Upload .zip"]
						})]
					}), source === "github" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-4 font-mono",
						placeholder: "https://github.com/owner/repo",
						value: url,
						onChange: (e) => setUrl(e.target.value)
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-4",
						type: "file",
						accept: ".zip",
						onChange: (e) => setZip(e.target.files?.[0] ?? null)
					})] }),
					(target === "web" || target === "runtime") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "font-mono",
						placeholder: target === "web" ? "https://example.com" : "https://api.example.com",
						value: url,
						onChange: (e) => setUrl(e.target.value)
					}),
					target === "binary" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "file",
						accept: ".exe,.elf,.so,.dll,.bin,.dylib,.o,.a",
						onChange: (e) => setBin(e.target.files?.[0] ?? null)
					}),
					target === "visual" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VisualInput, {
						value: visual,
						onChange: setVisual,
						disabled: busy,
						onBusyChange: setVisualBusy
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: TARGET_NOTE[target]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "q",
						children: "Investigation question"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "q",
						className: "mt-2",
						rows: 3,
						placeholder: STARTING_ADVICE[target].questions[0],
						value: question,
						onChange: (e) => setQuestion(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-4 text-sm font-medium",
						children: "Suggested investigation angles"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex flex-wrap gap-2",
						children: suggestions.slice(0, showAllQuestions ? void 0 : 4).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							disabled: busy,
							onClick: () => setQuestion(s),
							className: "h-auto max-w-full whitespace-normal rounded-md px-3 py-1 text-left text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground",
							children: s
						}, s))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						className: "mt-2",
						onClick: () => setShowAllQuestions(!showAllQuestions),
						children: showAllQuestions ? "Show fewer suggestions" : "More suggestions"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 border-l-2 border-primary pl-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium",
							children: "Useful details to include"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 list-disc space-y-1 pl-4 text-sm text-muted-foreground",
							children: STARTING_ADVICE[target].preparation.map((tip) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: tip }, tip))
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
				className: "mt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
						className: "cursor-pointer text-sm text-muted-foreground",
						children: "Advanced options"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: [
						"Investigation depth: ",
						steps,
						" steps"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						className: "mt-3",
						min: 4,
						max: 20,
						step: 1,
						value: [steps],
						onValueChange: (v) => setSteps(v[0] ?? 10)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-sm text-muted-foreground",
				children: "Starting saves your submitted evidence and sends relevant material to the AI engine. You can delete saved investigations in Privacy & settings."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "lg",
				className: "mt-4 w-full",
				disabled: busy || target === "visual" && (visualBusy || !visual),
				onClick: start,
				children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Preparing target…"] }) : "Start investigation"
			})
		]
	});
}
//#endregion
export { NewInvestigation as component };
