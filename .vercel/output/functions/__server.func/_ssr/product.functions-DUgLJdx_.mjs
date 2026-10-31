import { i as __toESM } from "../_runtime.mjs";
import { c as stringType, r as enumType, s as objectType } from "../_libs/zod.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as cn } from "./button-DRsC1qZi.mjs";
import { J as ChevronDown, K as ChevronUp, Y as Check } from "../_libs/lucide-react.mjs";
import { l as createServerFn } from "./createServerFn-BhqelEmK.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BLoCzgET.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-mC0fD6Ng.mjs";
import { l as retentionSchema, r as checklistSchema, t as actionSchema } from "./product-BhMcEi5d.mjs";
import { a as SelectItemIndicator, c as SelectPortal, d as SelectSeparator$1, f as SelectTrigger$1, i as SelectItem$1, l as SelectScrollDownButton$1, m as SelectViewport, n as SelectContent$1, o as SelectItemText, p as SelectValue$1, r as SelectIcon, s as SelectLabel$1, t as Select$1, u as SelectScrollUpButton$1 } from "../_libs/@radix-ui/react-select+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product.functions-DUgLJdx_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Select = Select$1;
var SelectValue = SelectValue$1;
var SelectTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
	ref,
	className: cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 opacity-50" })
	})]
}));
SelectTrigger.displayName = SelectTrigger$1.displayName;
var SelectScrollUpButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4" })
}));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
var SelectScrollDownButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
}));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
var SelectContent = import_react.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent$1, {
	ref,
	className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton, {})
	]
}) }));
SelectContent.displayName = SelectContent$1.displayName;
var SelectLabel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", className),
	...props
}));
SelectLabel.displayName = SelectLabel$1.displayName;
var SelectItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
}));
SelectItem.displayName = SelectItem$1.displayName;
var SelectSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
SelectSeparator.displayName = SelectSeparator$1.displayName;
var idSchema = objectType({ id: stringType().uuid() });
var manageInvestigation = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => idSchema.extend({ action: actionSchema }).parse(d)).handler(createSsrRpc("5b2d5560ce0b0569da1ff5e192bed2bffa2cd43cd6e37f975a4fe55774dfd686"));
var deleteInvestigation = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => idSchema.parse(d)).handler(createSsrRpc("b4271e566523f893491d2a739a164b961c8b23c6c0939f995564ca2d79c76529"));
var deleteAllInvestigations = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("38982f6354443e8d3c582756e13c5abf6626a0d8e0c24075dda5aa0388d660ad"));
var renameInvestigation = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => idSchema.extend({ title: stringType().trim().min(1).max(120) }).parse(d)).handler(createSsrRpc("da0a94581bb79c7965827b7926cb30ea2cb59587ecad5f9bf310487761d34a6f"));
var getPreferences = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("e1fb30616ef365e3672c008390a2f5f751f9d6d227243c60014b46b4994a5181"));
var savePreferences = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ retentionDays: retentionSchema }).parse(d)).handler(createSsrRpc("7742e3c275680092cc117a3df0d4a964a3cb8e17c05a44dbf7af0ae6df6e0fb9"));
var generateArtifact = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => idSchema.extend({
	kind: enumType([
		"followup",
		"comparison",
		"brief"
	]),
	question: stringType().trim().max(1e3),
	comparisonId: stringType().uuid().optional()
}).parse(d)).handler(createSsrRpc("ce899095a6c629c8105c7c5dbcc5ec1387e052719b7754d4be3c7128cf4a41a0"));
var saveChecklist = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => idSchema.extend({ content: checklistSchema }).parse(d)).handler(createSsrRpc("7cc1f994a4d1e05160b9c807aa41848461182237778f40a47506b7b04e6c7802"));
var setChecklistItem = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => idSchema.extend({ itemId: stringType().min(1).max(80) }).parse(d)).handler(createSsrRpc("85f398f1c9e1a5a997f159f394ca7633f583e289c8977fdea67cebdc318e4e66"));
//#endregion
export { SelectValue as a, generateArtifact as c, renameInvestigation as d, saveChecklist as f, SelectTrigger as i, getPreferences as l, setChecklistItem as m, SelectContent as n, deleteAllInvestigations as o, savePreferences as p, SelectItem as r, deleteInvestigation as s, Select as t, manageInvestigation as u };
