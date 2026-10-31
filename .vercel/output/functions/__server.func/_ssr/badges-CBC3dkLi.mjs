import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as cn } from "./button-DRsC1qZi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badges-CBC3dkLi.js
var import_jsx_runtime = require_jsx_runtime();
var STATUS = {
	verified: "border-success/40 bg-success/10 text-success",
	observed: "border-primary/40 bg-primary/10 text-primary",
	inferred: "border-accent/50 bg-accent/10 text-accent",
	unknown: "border-border bg-muted text-muted-foreground",
	completed: "border-success/40 bg-success/10 text-success",
	running: "border-primary/40 bg-primary/10 text-primary",
	queued: "border-border bg-muted text-muted-foreground",
	failed: "border-destructive/40 bg-destructive/10 text-destructive"
};
function StatusBadge({ status, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider", STATUS[status] ?? STATUS["unknown"], className),
		children: [status === "running" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 animate-pulse rounded-full bg-primary" }), status]
	});
}
var MODE_TONE = {
	"White-box": "border-primary/40 bg-primary/10 text-primary",
	"Black-box": "border-accent/50 bg-accent/10 text-accent",
	"Gray-box": "border-warning/40 bg-warning/10 text-warning",
	Static: "border-success/40 bg-success/10 text-success",
	Visual: "border-accent/50 bg-accent/10 text-accent"
};
function ModeBadge({ mode = "White-box", className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("rounded border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider", MODE_TONE[mode] ?? MODE_TONE["White-box"], className),
		children: mode
	});
}
function ConfidenceMeter({ value }) {
	const v = value ?? 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-1.5 w-20 overflow-hidden rounded-full bg-muted",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("h-full", v >= 70 ? "bg-success" : v >= 40 ? "bg-warning" : "bg-destructive"),
				style: { width: `${v}%` }
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-mono text-xs text-muted-foreground",
			children: value == null ? "—" : `${v}%`
		})]
	});
}
//#endregion
export { ModeBadge as n, StatusBadge as r, ConfidenceMeter as t };
