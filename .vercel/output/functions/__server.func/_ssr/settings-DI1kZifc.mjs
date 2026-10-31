import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { k as KeyRound, l as ShieldCheck, o as Trash2 } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useServerFn } from "./createSsrRpc-BLoCzgET.mjs";
import { a as SelectValue, i as SelectTrigger, l as getPreferences, n as SelectContent, o as deleteAllInvestigations, p as savePreferences, r as SelectItem, t as Select } from "./product.functions-DUgLJdx_.mjs";
import { a as saveGithubToken, i as removeGithubToken, r as hasGithubToken } from "./investigations.functions-wzbWpDnv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-DI1kZifc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Settings() {
	const qc = useQueryClient();
	const get = useServerFn(getPreferences);
	const save = useServerFn(savePreferences);
	const check = useServerFn(hasGithubToken);
	const connect = useServerFn(saveGithubToken);
	const disconnect = useServerFn(removeGithubToken);
	const erase = useServerFn(deleteAllInvestigations);
	const [token, setToken] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const pref = useQuery({
		queryKey: ["preferences"],
		queryFn: () => get()
	});
	const gh = useQuery({
		queryKey: ["github-token"],
		queryFn: () => check()
	});
	async function run(fn, message) {
		setBusy(true);
		try {
			await fn();
			toast.success(message);
			await qc.invalidateQueries();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not save.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-3xl px-6 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-primary",
				children: "Your control"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-3xl font-semibold",
				children: "Privacy & settings"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 border-y border-border py-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "flex items-center gap-2 text-xl font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {}), " What happens to your data"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-3 text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Screenshots and recordings are prepared on your device. Only reviewed JPEG frames are submitted when you start. Audio and the original recording are not uploaded. Binary files are processed locally; extracted artifacts are submitted." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Source code, fetched website information, and approved visual frames are saved with your investigation. Relevant evidence is sent to the AI engine to generate findings and answers. Your saved investigations require your account to access." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Deletion removes the investigation, saved source payload, evidence images, and related answers from the app’s active storage. It does not revoke files you downloaded, delete your account, or guarantee immediate removal from backups or AI provider logs." })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "border-b border-border py-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-semibold",
						children: "Automatic deletion"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "my-3 text-sm text-muted-foreground",
						children: "Applies to all existing and new investigations, measured from creation. Expired investigations are removed by a daily cleanup, normally within 24 hours. Saving a shorter duration can make old work eligible for deletion."
					}),
					pref.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => pref.refetch(),
						children: "Retry settings"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						disabled: busy || pref.isLoading,
						value: String(pref.data?.retentionDays ?? "keep"),
						onValueChange: (v) => {
							if (window.confirm("Apply this retention choice to all existing and new investigations? Expired work will be deleted.")) run(() => save({ data: { retentionDays: v === "keep" ? null : Number(v) } }), "Retention preference saved.");
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "max-w-xs",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "keep",
								children: "Keep until I delete"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "7",
								children: "7 days"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "30",
								children: "30 days"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "90",
								children: "90 days"
							})
						] })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "border-b border-border py-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "flex gap-2 text-xl font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, {}), " GitHub connection"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "my-3 text-sm text-muted-foreground",
						children: "Optional for private repositories. Use a fine-grained token with read access only to selected repositories. Tokens are encrypted before storage and retrieved only on the server for your requests. GitHub token validity is checked; access to each repository depends on its permissions."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 text-sm",
						children: gh.isError ? "Connection status unavailable" : gh.data?.saved ? "Connected" : "Not connected"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "password",
								"aria-label": "GitHub access token",
								className: "min-w-0 flex-1",
								placeholder: "GitHub access token",
								value: token,
								onChange: (e) => setToken(e.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								disabled: busy || token.trim().length < 10,
								onClick: () => run(async () => {
									await connect({ data: { token } });
									setToken("");
								}, "GitHub connection saved."),
								children: "Save"
							}),
							gh.data?.saved && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								disabled: busy,
								onClick: () => run(() => disconnect(), "GitHub connection removed."),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {}), " Remove"]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "py-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-semibold",
						children: "Delete saved investigation data"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "my-3 text-sm text-muted-foreground",
						children: "Removes all investigations and their associated source data, evidence, comparisons, and answers. Your account and GitHub connection remain."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "destructive",
						disabled: busy,
						onClick: () => {
							if (window.confirm("Permanently delete ALL investigations and associated data? This cannot be undone.")) run(async () => {
								await erase();
								qc.removeQueries({ queryKey: ["investigation"] });
								qc.removeQueries({ queryKey: ["artifacts"] });
							}, "All investigations deleted.");
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {}), " Delete all investigations"]
					})
				]
			})
		]
	});
}
//#endregion
export { Settings as component };
