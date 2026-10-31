import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-ztlTMj4W.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { $ as ArrowUpRight, _ as Plus, f as Search, o as Trash2, y as Pencil } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useServerFn } from "./createSsrRpc-BLoCzgET.mjs";
import { a as SelectValue, d as renameInvestigation, i as SelectTrigger, n as SelectContent, r as SelectItem, s as deleteInvestigation, t as Select } from "./product.functions-DUgLJdx_.mjs";
import { r as StatusBadge, t as ConfidenceMeter } from "./badges-CBC3dkLi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-BgTYl5Ry.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Dashboard() {
	const qc = useQueryClient();
	const remove = useServerFn(deleteInvestigation);
	const rename = useServerFn(renameInvestigation);
	const [search, setSearch] = (0, import_react.useState)("");
	const [target, setTarget] = (0, import_react.useState)("all");
	const [status, setStatus] = (0, import_react.useState)("all");
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [title, setTitle] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const { data, isLoading, isError, refetch } = useQuery({
		queryKey: ["investigations"],
		queryFn: async () => {
			const { data, error } = await supabase.from("investigations").select("id,title,question,target_ref,target_type,status,confidence,created_at").order("created_at", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
	async function erase(id) {
		if (!window.confirm("Delete this investigation, source data, evidence, and saved answers?")) return;
		setBusy(true);
		try {
			await remove({ data: { id } });
			qc.removeQueries({ queryKey: ["investigation", id] });
			await qc.invalidateQueries({ queryKey: ["investigations"] });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not delete.");
		} finally {
			setBusy(false);
		}
	}
	async function save() {
		if (!editing) return;
		setBusy(true);
		try {
			await rename({ data: {
				id: editing,
				title
			} });
			setEditing(null);
			await qc.invalidateQueries({ queryKey: ["investigations"] });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not rename.");
		} finally {
			setBusy(false);
		}
	}
	const rows = data?.filter((r) => (target === "all" || r.target_type === target) && (status === "all" || r.status === status) && `${r.title} ${r.question} ${r.target_ref}`.toLowerCase().includes(search.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-6 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-primary",
					children: "Your workspace"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 text-3xl font-semibold",
					children: "Investigations"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/new",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), " New investigation"]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 flex gap-8 border-y border-border py-5",
				children: [
					["Total", data?.length ?? 0],
					["Completed", data?.filter((r) => r.status === "completed").length ?? 0],
					["In progress", data?.filter((r) => ["running", "queued"].includes(r.status)).length ?? 0]
				].map(([label, n]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-2xl font-semibold",
					children: n
				})] }, label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "my-6 flex flex-wrap gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							"aria-label": "Search investigations",
							className: "pl-10",
							placeholder: "Search investigations…",
							value: search,
							onChange: (e) => setSearch(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: target,
						onValueChange: setTarget,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-44",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
							["all", "All targets"],
							["repo", "Source code"],
							["visual", "Visual features"],
							["web", "Websites"],
							["runtime", "Running apps"],
							["binary", "Binaries"]
						].map(([v, l]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: v,
							children: l
						}, v)) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: status,
						onValueChange: setStatus,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-40",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
							"all",
							"completed",
							"running",
							"queued",
							"paused",
							"failed"
						].map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: v,
							children: v === "all" ? "All statuses" : v
						}, v)) })]
					})
				]
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "status",
				children: "Loading investigations…"
			}) : isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Investigations could not be loaded." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-3",
				onClick: () => refetch(),
				children: "Try again"
			})] }) : !data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-12 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "mx-auto h-8 w-8 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-4 text-xl",
						children: "No investigations yet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "mt-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/new",
							children: "Start your first"
						})
					})
				]
			}) : !rows?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-8 text-muted-foreground",
				children: "No investigations match these filters."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-border",
				children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-wrap items-center gap-3 py-5",
					children: [
						editing === r.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 flex-1 gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									"aria-label": "Investigation name",
									value: title,
									onChange: (e) => setTitle(e.target.value)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									disabled: busy || !title.trim(),
									onClick: save,
									children: "Save"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									onClick: () => setEditing(null),
									children: "Cancel"
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/investigations/$id",
							params: { id: r.id },
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center gap-2 font-medium",
								children: [r.title || r.question, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4 shrink-0 text-muted-foreground" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 truncate text-sm text-muted-foreground",
								children: [
									r.target_ref,
									" · ",
									new Date(r.created_at).toLocaleDateString()
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: r.status }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfidenceMeter, { value: r.confidence == null ? null : Number(r.confidence) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							title: "Rename investigation",
							"aria-label": `Rename ${r.title || r.question}`,
							onClick: () => {
								setEditing(r.id);
								setTitle(r.title || r.question);
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							disabled: busy,
							title: "Delete investigation",
							"aria-label": `Delete ${r.title || r.question}`,
							onClick: () => erase(r.id),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
						})
					]
				}, r.id))
			})
		]
	});
}
//#endregion
export { Dashboard as component };
