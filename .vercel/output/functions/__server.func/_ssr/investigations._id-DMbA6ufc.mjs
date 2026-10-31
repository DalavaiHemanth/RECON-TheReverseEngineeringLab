import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-ztlTMj4W.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { $ as ArrowUpRight, B as Database, C as MessageCircle, D as ListChecks, E as ListTodo, F as FlaskConical, G as CircleCheck, H as ClipboardList, I as FileText, J as ChevronDown, L as FileBraces, M as GitCompareArrows, O as Lightbulb, P as Funnel, T as LoaderCircle, U as Circle, W as CircleQuestionMark, Y as Check, a as TriangleAlert, b as Pause, et as ArrowRight, f as Search, g as Printer, m as RotateCcw, n as Wrench, o as Trash2, q as ChevronRight, tt as ArrowLeft, v as Play, z as Download } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useServerFn } from "./createSsrRpc-BLoCzgET.mjs";
import { c as reportTab, i as downloadText, s as reportMarkdown } from "./product-BhMcEi5d.mjs";
import { a as DropdownMenuItemIndicator, c as DropdownMenuRadioItem$1, d as DropdownMenuSubTrigger$1, f as DropdownMenuTrigger$1, i as DropdownMenuItem$1, l as DropdownMenuSeparator$1, n as DropdownMenuCheckboxItem$1, o as DropdownMenuLabel$1, r as DropdownMenuContent$1, s as DropdownMenuPortal, t as DropdownMenu$1, u as DropdownMenuSubContent$1 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { a as SelectValue, c as generateArtifact, f as saveChecklist, i as SelectTrigger, m as setChecklistItem, n as SelectContent, r as SelectItem, s as deleteInvestigation, t as Select, u as manageInvestigation } from "./product.functions-DUgLJdx_.mjs";
import { n as ModeBadge, r as StatusBadge, t as ConfidenceMeter } from "./badges-CBC3dkLi.mjs";
import { t as Route } from "./investigations._id-CUnTEpS-.mjs";
import { t as advanceInvestigation } from "./investigations.functions-wzbWpDnv.mjs";
import { n as TARGET_MODE, r as reportRecommendations } from "./recommendations-Dv7KIYGT.mjs";
import { a as useReactFlow, i as index, n as Controls, o as MarkerType, r as ReactFlowProvider, t as Background } from "../_libs/@xyflow/react+[...].mjs";
import { i as TabsTrigger$1, n as TabsContent$1, r as TabsList$1, t as Tabs$1 } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/investigations._id-DMbA6ufc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var GRAPH_NODE_TYPES = [
	"function",
	"class",
	"file",
	"endpoint",
	"database",
	"page",
	"binary"
];
var GRAPH_CONFIDENCE = [
	"verified",
	"observed",
	"inferred",
	"unknown"
];
/** Associate confidence with explicit references, never with the report-wide score. */
function nodeAssessment(node, findings, evidence) {
	const related = evidence.filter((item) => {
		if (node.file && item.file !== node.file) return false;
		return item.id === node.id || item.file === node.id || `ep:${item.title}` === node.id || `b:${item.title}` === node.id || `db:${item.file}:${item.line}` === node.id || item.title === node.label || item.title.replace(/^(function|class|method) /, "") === node.label || (node.type === "file" || node.type === "page") && item.file === node.label;
	});
	const matchedFindings = findings.filter((finding) => {
		const sameFile = !node.file || finding.file === node.file;
		if (finding.symbol) return sameFile && (finding.symbol === node.label || finding.symbol === node.id);
		if (finding.file && finding.file === node.id) return true;
		if ((node.type === "file" || node.type === "page") && finding.file === node.label) return true;
		return related.some((item) => finding.evidence_ids.includes(item.id));
	});
	const statuses = matchedFindings.map((finding) => finding.status);
	const status = GRAPH_CONFIDENCE.find((value) => statuses.includes(value)) ?? (related.length ? "observed" : "unknown");
	return {
		status,
		evidence: related,
		findings: matchedFindings.filter((finding) => finding.status === status)
	};
}
function nodeConfidence(node, findings, evidence) {
	return nodeAssessment(node, findings, evidence).status;
}
function connectionExplanation(edge, nodes, types, confidence, findings, evidence) {
	const source = nodes.find((node) => node.id === edge.source);
	const target = nodes.find((node) => node.id === edge.target);
	if (!source || !target) return null;
	const endpoints = [source, target].map((node) => ({
		node,
		...nodeAssessment(node, findings, evidence)
	}));
	return {
		included: endpoints.every(({ node, status }) => types.includes(node.type) && (confidence === "all" || status === confidence)),
		endpoints,
		confidence
	};
}
function filterGraph(nodes, edges, types, confidence, findings, evidence) {
	const visible = nodes.filter((node) => types.includes(node.type) && (confidence === "all" || nodeConfidence(node, findings, evidence) === confidence));
	const ids = new Set(visible.map((node) => node.id));
	return {
		nodes: visible,
		edges: edges.filter((edge) => ids.has(edge.source) && ids.has(edge.target))
	};
}
var DropdownMenu = DropdownMenu$1;
var DropdownMenuTrigger = DropdownMenuTrigger$1;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuSubTrigger$1, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = DropdownMenuSubTrigger$1.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSubContent$1, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = DropdownMenuSubContent$1.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuContent$1, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = DropdownMenuContent$1.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem$1, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = DropdownMenuItem$1.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuCheckboxItem$1, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = DropdownMenuCheckboxItem$1.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuRadioItem$1, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = DropdownMenuRadioItem$1.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = DropdownMenuLabel$1.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = DropdownMenuSeparator$1.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
var TYPE_CLASS = {
	function: "border-primary/60 text-primary",
	class: "border-accent/60 text-accent",
	file: "border-border text-foreground",
	endpoint: "border-warning/60 text-warning",
	database: "border-success/60 text-success",
	page: "border-accent/60 text-accent",
	binary: "border-success/60 text-success"
};
function GraphCanvas({ nodes, edges, highlightMatches, selectedEdgeId, onSelectEdge }) {
	const { fitView } = useReactFlow();
	const { rfNodes, rfEdges } = (0, import_react.useMemo)(() => {
		const depth = new Map(nodes.map((n) => [n.id, 0]));
		for (let k = 0; k < nodes.length; k++) for (const e of edges) {
			const d = (depth.get(e.source) ?? 0) + 1;
			if (d > (depth.get(e.target) ?? 0) && d < nodes.length) depth.set(e.target, d);
		}
		const cols = /* @__PURE__ */ new Map();
		return {
			rfNodes: nodes.map((n) => {
				const d = depth.get(n.id) ?? 0;
				const row = cols.get(d) ?? 0;
				cols.set(d, row + 1);
				return {
					id: n.id,
					position: {
						x: row * 230,
						y: d * 110
					},
					data: { label: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `rounded-md border bg-card px-3 py-2 text-left ${TYPE_CLASS[n.type]}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono text-[10px] uppercase opacity-70",
								children: n.type
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate font-mono text-xs",
								children: n.label
							}),
							n.file && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate text-[10px] text-muted-foreground",
								children: n.file
							})
						]
					}) },
					style: {
						background: "transparent",
						border: "none",
						padding: 0,
						width: 200
					}
				};
			}),
			rfEdges: edges.map((e) => ({
				id: e.id,
				source: e.source,
				target: e.target,
				label: e.label,
				animated: e.label === "leads_to",
				ariaLabel: `Connection: ${nodes.find((node) => node.id === e.source)?.label ?? e.source} ${e.label} ${nodes.find((node) => node.id === e.target)?.label ?? e.target}`,
				focusable: true,
				interactionWidth: 24,
				markerEnd: {
					type: MarkerType.ArrowClosed,
					color: e.id === selectedEdgeId ? "var(--accent)" : highlightMatches ? "var(--warning)" : "var(--primary)"
				},
				style: {
					stroke: e.id === selectedEdgeId ? "var(--accent)" : highlightMatches ? "var(--warning)" : e.label === "calls" ? "var(--accent)" : "var(--primary)",
					strokeWidth: e.id === selectedEdgeId ? 4 : highlightMatches ? 3 : 1
				},
				labelStyle: {
					fill: highlightMatches ? "var(--warning)" : "var(--muted-foreground)",
					fontSize: 10
				},
				labelBgStyle: { fill: "var(--background)" }
			}))
		};
	}, [
		nodes,
		edges,
		highlightMatches,
		selectedEdgeId
	]);
	(0, import_react.useEffect)(() => {
		if (!rfNodes.length) return;
		const t = setTimeout(() => fitView({ padding: .2 }), 50);
		return () => clearTimeout(t);
	}, [
		nodes,
		edges,
		fitView
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(index, {
		nodes: rfNodes,
		edges: rfEdges,
		onEdgeClick: (_, edge) => onSelectEdge?.(edge.id),
		fitView: true,
		proOptions: { hideAttribution: true },
		colorMode: "dark",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Background, {
			color: "var(--border)",
			gap: 24
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controls, { showInteractive: false })]
	});
}
function EvidenceGraph({ nodes, edges, ...props }) {
	if (!nodes.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid h-full place-items-center text-sm text-muted-foreground",
		children: "Graph builds as evidence arrives"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReactFlowProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraphCanvas, {
		nodes,
		edges,
		...props
	}) });
}
function FilteredEvidenceGraph({ nodes, edges, findings, evidence }) {
	const [types, setTypes] = (0, import_react.useState)(GRAPH_NODE_TYPES);
	const [confidence, setConfidence] = (0, import_react.useState)("all");
	const [selectedEdgeId, setSelectedEdgeId] = (0, import_react.useState)();
	const available = GRAPH_NODE_TYPES.filter((type) => nodes.some((node) => node.type === type));
	const selectedCount = available.filter((type) => types.includes(type)).length;
	const filtered = (0, import_react.useMemo)(() => filterGraph(nodes, edges, types, confidence, findings, evidence), [
		nodes,
		edges,
		types,
		confidence,
		findings,
		evidence
	]);
	const active = selectedCount !== available.length || confidence !== "all";
	const selectedEdge = filtered.edges.find((edge) => edge.id === selectedEdgeId) ?? filtered.edges[0];
	const explanation = selectedEdge ? connectionExplanation(selectedEdge, nodes, types, confidence, findings, evidence) : null;
	const reset = () => {
		setTypes(GRAPH_NODE_TYPES);
		setConfidence("all");
		setSelectedEdgeId(void 0);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-hidden rounded-lg border border-border bg-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3 border-b border-border p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							"aria-label": "Filter node types",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, {}),
								"Node types",
								selectedCount !== available.length ? ` (${selectedCount}/${available.length})` : ""
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
						align: "start",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, { children: "Node types" }), available.map((type) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuCheckboxItem, {
							checked: types.includes(type),
							onSelect: (event) => event.preventDefault(),
							onCheckedChange: (checked) => setTypes((current) => checked ? [...current, type] : current.filter((value) => value !== type)),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "capitalize",
								children: type
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-4 font-mono text-xs text-muted-foreground",
								children: nodes.filter((node) => node.type === type).length
							})]
						}, type))]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							id: "graph-confidence-label",
							className: "text-xs text-muted-foreground",
							children: "Evidence confidence"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: confidence,
							onValueChange: (value) => {
								if (value === "all" || GRAPH_CONFIDENCE.includes(value)) setConfidence(value);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								"aria-labelledby": "graph-confidence-label",
								className: "h-8 w-36 text-xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "All confidence"
							}), GRAPH_CONFIDENCE.map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: status,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "capitalize",
									children: status
								})
							}, status))] })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						className: "h-8 w-8",
						disabled: !active,
						"aria-label": "Reset graph filters",
						title: "Reset graph filters",
						onClick: reset,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						role: "status",
						"aria-live": "polite",
						className: "font-mono text-xs text-muted-foreground",
						children: [
							filtered.nodes.length,
							"/",
							nodes.length,
							" nodes · ",
							filtered.edges.length,
							"/",
							edges.length,
							" connections"
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-[600px]",
				children: filtered.nodes.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EvidenceGraph, {
					nodes: filtered.nodes,
					edges: filtered.edges,
					highlightMatches: active,
					selectedEdgeId: selectedEdge?.id,
					onSelectEdge: setSelectedEdgeId
				}) : nodes.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid h-full place-content-center justify-items-center gap-3 text-sm text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "No nodes match these filters" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: reset,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {}), "Reset filters"]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EvidenceGraph, {
					nodes,
					edges
				})
			}),
			selectedEdge && explanation && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				"aria-label": "Connection inclusion details",
				className: "border-t border-border p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-medium text-foreground",
							children: "Why this connection is included"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: selectedEdge.id,
							onValueChange: setSelectedEdgeId,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								"aria-label": "Inspect connection",
								className: "w-full min-w-0 sm:max-w-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: filtered.edges.map((edge, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
								value: edge.id,
								children: [
									index + 1,
									". ",
									nodes.find((node) => node.id === edge.source)?.label,
									" → ",
									nodes.find((node) => node.id === edge.target)?.label,
									" (",
									edge.label,
									")"
								]
							}, edge.id)) })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 flex items-center gap-2 text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 shrink-0" }),
							selectedEdge.label.replaceAll("_", " "),
							" · Both endpoint types are selected; ",
							confidence === "all" ? "all confidence levels are included." : `both endpoints match ${confidence} confidence.`
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 grid gap-4 sm:grid-cols-2",
						children: explanation.endpoints.map(({ node, status, evidence: supportingEvidence, findings: supportingFindings }, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										index === 0 ? "Source" : "Target",
										" · ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "capitalize",
											children: node.type
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 break-words font-mono text-xs text-foreground",
									children: node.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 break-all font-mono text-[11px] text-muted-foreground",
									children: node.file ?? node.id
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status })
								}),
								supportingFindings.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-2 space-y-2 text-xs text-muted-foreground",
									children: supportingFindings.map((finding, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "break-words",
										children: [finding.claim, finding.evidence_ids.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono",
											children: [" · ", finding.evidence_ids.join(", ")]
										})]
									}, i))
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs text-muted-foreground",
									children: supportingEvidence.length ? "Collected evidence; no matching report finding." : "No associated evidence or report finding."
								}),
								supportingEvidence.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
									className: "mt-2 text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
										className: "cursor-pointer break-words",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-primary",
												children: item.id
											}),
											" · ",
											item.title
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
										className: "mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-words font-mono text-[11px]",
										children: item.snippet
									})]
								}, item.id))
							]
						}, `${index}-${node.id}`))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-xs text-muted-foreground",
						children: "Inclusion follows endpoint filters; it does not independently verify the relationship."
					})
				]
			})
		]
	});
}
var Tabs = Tabs$1;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList$1, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = TabsList$1.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger$1, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = TabsTrigger$1.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent$1, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = TabsContent$1.displayName;
function InvestigationActions({ id, status, title, report, evidence }) {
	const manage = useServerFn(manageInvestigation);
	const remove = useServerFn(deleteInvestigation);
	const qc = useQueryClient();
	const navigate = useNavigate();
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function action(kind) {
		setBusy(true);
		try {
			await manage({ data: {
				id,
				action: kind
			} });
			await qc.invalidateQueries({ queryKey: ["investigation", id] });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not update investigation.");
		} finally {
			setBusy(false);
		}
	}
	async function erase() {
		if (!window.confirm("Delete this investigation, its source data, evidence, and saved answers? This cannot be undone.")) return;
		setBusy(true);
		try {
			await remove({ data: { id } });
			qc.removeQueries({ queryKey: ["investigation", id] });
			await qc.invalidateQueries({ queryKey: ["investigations"] });
			navigate({ to: "/dashboard" });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not delete.");
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "my-4 flex flex-wrap gap-2 print:hidden",
		children: [
			["running", "queued"].includes(status) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				disabled: busy,
				onClick: () => action("stop"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {}), " Stop"]
			}),
			status === "paused" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				disabled: busy,
				onClick: () => action("resume"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {}), " Resume"]
			}),
			status === "failed" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				disabled: busy,
				onClick: () => action("retry"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {}), " Retry from checkpoint"]
			}),
			report && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => downloadText(reportMarkdown(title, report, evidence), "recon-report.md", "text/markdown;charset=utf-8"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), " Report"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					title: "Download structured evidence",
					onClick: () => downloadText(JSON.stringify({
						title,
						report,
						evidence
					}, null, 2), "recon-evidence.json", "application/json"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileBraces, {}), " Evidence"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					title: "Print or save as PDF",
					onClick: () => window.print(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, {}), " Print / PDF"]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "icon",
				"aria-label": "Delete investigation",
				title: "Delete investigation",
				disabled: busy,
				onClick: erase,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
			})
		]
	});
}
function ReportWorkspace({ id, target, report, evidence }) {
	const visual = target === "visual";
	const generate = useServerFn(generateArtifact);
	const saveList = useServerFn(saveChecklist);
	const toggleItem = useServerFn(setChecklistItem);
	const qc = useQueryClient();
	const [question, setQuestion] = (0, import_react.useState)("");
	const [other, setOther] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [listBusy, setListBusy] = (0, import_react.useState)(false);
	const [showAll, setShowAll] = (0, import_react.useState)(false);
	const recommendations = reportRecommendations(target, report, evidence);
	const history = useQuery({
		queryKey: ["artifacts", id],
		queryFn: async () => {
			const { data, error } = await supabase.from("recon_artifacts").select("*").eq("investigation_id", id).order("created_at");
			if (error) throw error;
			return data;
		}
	});
	const candidates = useQuery({
		queryKey: ["visual-comparisons", id],
		enabled: visual,
		queryFn: async () => {
			const { data, error } = await supabase.from("investigations").select("id,title,question").eq("target_type", "visual").eq("status", "completed").neq("id", id);
			if (error) throw error;
			return data;
		}
	});
	async function run(kind) {
		setBusy(true);
		try {
			await generate({ data: {
				id,
				kind,
				question: kind === "followup" ? question : "",
				...kind === "comparison" ? { comparisonId: other } : {}
			} });
			setQuestion("");
			await qc.invalidateQueries({ queryKey: ["artifacts", id] });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not generate answer.");
		} finally {
			setBusy(false);
		}
	}
	const checklist = (history.data?.find((row) => row.kind === "checklist"))?.content ?? null;
	const doneCount = checklist?.items.filter((i) => i.done).length ?? 0;
	async function saveAsChecklist() {
		setListBusy(true);
		try {
			const existing = new Map(checklist?.items.map((i) => [i.id, i.done]) ?? []);
			await saveList({ data: {
				id,
				content: { items: recommendations.map((r) => ({
					id: r.id,
					title: r.title,
					note: r.reason,
					done: existing.get(r.id) ?? false
				})) }
			} });
			await qc.invalidateQueries({ queryKey: ["artifacts", id] });
			toast.success("Checklist saved.");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not save the checklist.");
		} finally {
			setListBusy(false);
		}
	}
	async function toggle(itemId) {
		setListBusy(true);
		try {
			await toggleItem({ data: {
				id,
				itemId
			} });
			await qc.invalidateQueries({ queryKey: ["artifacts", id] });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not update the checklist.");
		} finally {
			setListBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-10 border-t border-border pt-6 print:hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-semibold",
				children: "Explore this report"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "flex items-center gap-2 font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { className: "h-4 w-4 text-primary" }), " Recommended next steps"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							disabled: listBusy,
							onClick: () => void saveAsChecklist(),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListTodo, { className: "h-4 w-4" }),
								" ",
								checklist ? "Update checklist" : "Save as checklist"
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Suggestions, not verified findings. Answers use the evidence already saved in this report."
					}),
					checklist && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 rounded-lg border border-border bg-card p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm font-medium",
							children: [
								"Checklist — ",
								doneCount,
								"/",
								checklist.items.length,
								" complete"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-1",
							children: checklist.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "flex w-full items-start gap-3 rounded-md px-2 py-2 text-left hover:bg-muted/50 disabled:opacity-60",
								disabled: listBusy,
								onClick: () => void toggle(item.id),
								"aria-pressed": item.done,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border border-border", item.done && "border-primary bg-primary text-primary-foreground"),
									children: item.done && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("block text-sm", item.done ? "text-muted-foreground line-through" : "text-foreground"),
										children: item.title
									}), item.note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-xs text-muted-foreground",
										children: item.note
									})]
								})]
							}) }, item.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 grid gap-x-6 sm:grid-cols-2",
						children: recommendations.slice(0, showAll ? void 0 : 4).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "min-w-0 border-b border-border py-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "break-words text-sm font-medium",
									children: item.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 break-words text-sm text-muted-foreground",
									children: item.reason
								}),
								item.refs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 font-mono text-xs text-primary",
									children: ["Related evidence: ", item.refs.join(", ")]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "ghost",
									className: "mt-2",
									disabled: busy,
									onClick: () => {
										if (item.action === "brief") {
											run("brief");
											return;
										}
										setQuestion(item.question);
										document.getElementById("report-followup")?.focus();
									},
									children: [item.action === "brief" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4" }), item.action === "brief" ? "Build brief" : "Use question"]
								})
							]
						}, item.id))
					}),
					recommendations.length > 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						className: "mt-2",
						onClick: () => setShowAll(!showAll),
						children: showAll ? "Show fewer recommendations" : `More recommendations (${recommendations.length - 4})`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "report-followup",
						"aria-label": "Follow-up question",
						placeholder: "Ask a follow-up question…",
						className: "min-w-0 flex-1",
						value: question,
						onChange: (e) => setQuestion(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						disabled: busy || question.trim().length < 5,
						onClick: () => run("followup"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {}), " Ask"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						disabled: busy,
						onClick: () => run("brief"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, {}), " Build brief"]
					})
				]
			}),
			visual && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: other,
					onValueChange: setOther,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "w-full sm:w-80",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose another visual report" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: candidates.data?.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: r.id,
						children: r.title || r.question
					}, r.id)) })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					disabled: busy || !other,
					onClick: () => run("comparison"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GitCompareArrows, {}), " Compare"]
				})]
			}),
			busy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				role: "status",
				className: "mt-3 flex gap-2 text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Reviewing retained evidence…"]
			}),
			history.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: () => history.refetch(),
				children: "Retry loading saved answers"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 space-y-6",
				children: history.data?.filter((row) => row.kind !== "checklist").map((row) => {
					const c = row.content;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "border-t border-border pt-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase text-primary",
								children: row.kind === "brief" ? "Suggested build brief" : row.kind === "comparison" ? "Feature comparison" : "Follow-up"
							}),
							c.sources && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground",
								children: c.sources.map((source) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/investigations/$id",
									params: { id: source.id },
									className: "underline",
									children: [
										"Source ",
										source.label,
										" · ",
										new Date(source.version).toLocaleDateString()
									]
								}, source.id))
							}),
							row.question && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-2 font-semibold",
								children: row.question
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 whitespace-pre-wrap",
								children: c.answer
							}),
							c.observations?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "mt-4 font-medium",
								children: "Evidence-linked observations"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-2 space-y-2",
								children: c.observations.map((o, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									o.text,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-xs text-primary",
										children: o.refs.join(", ")
									})
								] }, i))
							})] }),
							c.suggestions?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "mt-4 font-medium",
								children: "Suggestions — not observed implementation"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-2 list-disc space-y-2 pl-5",
								children: c.suggestions.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: s }, i))
							})] }),
							c.unknowns?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "mt-4 font-medium",
								children: "Unanswered"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-2 list-disc pl-5 text-muted-foreground",
								children: c.unknowns.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: s }, i))
							})] })
						]
					}, row.id);
				})
			})
		]
	});
}
var STEP_ICON = {
	plan: ListChecks,
	tool_call: Wrench,
	evidence: Search,
	hypothesis: Lightbulb,
	test: FlaskConical,
	contradiction: TriangleAlert,
	verified: CircleCheck,
	report: FileText,
	error: TriangleAlert
};
var STEP_TONE = {
	contradiction: "text-warning",
	verified: "text-success",
	error: "text-destructive",
	tool_call: "text-accent",
	plan: "text-primary"
};
function InvestigationPage() {
	const { id } = Route.useParams();
	const qc = useQueryClient();
	const advance = useServerFn(advanceInvestigation);
	const generation = (0, import_react.useRef)(0);
	const [working, setWorking] = (0, import_react.useState)(false);
	const { data: inv, isError, error, refetch } = useQuery({
		queryKey: ["investigation", id],
		queryFn: async () => {
			const { data, error } = await supabase.from("investigations").select("*").eq("id", id).single();
			if (error) throw error;
			return data;
		}
	});
	const active = inv && (inv.status === "queued" || inv.status === "running");
	(0, import_react.useEffect)(() => {
		if (!active) return;
		const request = ++generation.current;
		setWorking(true);
		(async () => {
			try {
				for (let i = 0; i < 300 && request === generation.current; i++) {
					const r = await advance({ data: { id } });
					await qc.invalidateQueries({ queryKey: ["investigation", id] });
					if (!["queued", "running"].includes(r.status)) break;
					await new Promise((resolve) => setTimeout(resolve, 750));
				}
			} catch (error) {
				toast.error(error instanceof Error ? error.message : "Investigation interrupted. Refresh to continue.");
			} finally {
				if (request === generation.current) setWorking(false);
				qc.invalidateQueries({ queryKey: ["investigations"] });
			}
		})();
		return () => {
			generation.current += 1;
		};
	}, [
		active,
		id,
		advance,
		qc
	]);
	const steps = inv?.steps ?? [];
	const evidence = inv?.evidence ?? [];
	const hypotheses = inv?.hypotheses ?? [];
	const report = inv?.report;
	const liveGraph = (0, import_react.useMemo)(() => {
		if (report) return report.graph;
		const nodes = /* @__PURE__ */ new Map();
		const edges = [];
		for (const e of evidence) if (e.kind === "call_relationship") {
			const [a = "?", b = "?"] = e.title.split(" → ");
			nodes.set(a, {
				id: a,
				label: a,
				type: "function",
				file: e.file
			});
			if (!nodes.has(b)) nodes.set(b, {
				id: b,
				label: b,
				type: "function",
				file: null
			});
			edges.push({
				id: e.id,
				source: a,
				target: b,
				label: "calls"
			});
		} else if (e.kind === "function" || e.kind === "class" || e.kind === "API_endpoint" || e.kind === "database_reference" || e.kind === "http_endpoint" || e.kind === "form" || e.kind === "probe" || e.kind === "page" || e.kind === "imported_symbol" || e.kind === "visual_frame") {
			const label = e.title.replace(/^(function|class|method) /, "");
			const id = e.kind === "function" || e.kind === "class" ? label : e.id;
			const type = e.kind === "API_endpoint" || e.kind === "http_endpoint" || e.kind === "form" || e.kind === "probe" ? "endpoint" : e.kind === "database_reference" ? "database" : e.kind === "page" || e.kind === "visual_frame" ? "page" : e.kind === "imported_symbol" ? "binary" : e.kind === "class" ? "class" : "function";
			if (!nodes.has(id)) nodes.set(id, {
				id,
				label,
				type,
				file: e.file
			});
		}
		return {
			nodes: [...nodes.values()].slice(0, 40),
			edges: edges.filter((x) => nodes.has(x.source) && nodes.has(x.target))
		};
	}, [evidence, report]);
	if (isError) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-xl p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-semibold",
				children: "Investigation unavailable"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "my-4 text-muted-foreground",
				children: error instanceof Error ? error.message : "It may have been deleted or could not be loaded."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => refetch(),
				children: "Try again"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "ghost",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/dashboard",
					children: "Investigations"
				})
			})
		]
	});
	if (!inv) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid h-64 place-items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin text-primary" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-7xl px-6 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/dashboard",
				className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Investigations"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-semibold text-foreground",
						children: inv.title || inv.question
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-mono text-xs text-muted-foreground",
						children: inv.target_ref
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeBadge, { mode: TARGET_MODE[inv.target_type ?? "repo"] ?? "White-box" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: inv.status }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-xs text-muted-foreground",
							children: [
								"step ",
								inv.step_count,
								"/",
								inv.max_steps,
								" · ",
								evidence.length,
								" evidence"
							]
						})
					]
				})]
			}),
			inv.status === "failed" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive",
				children: inv.error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InvestigationActions, {
				id,
				status: inv.status,
				title: inv.title || inv.question,
				report,
				evidence
			}),
			report && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportSummary, { report }),
			active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Stop prevents subsequent work and saving late results; an already-issued AI request may finish. Keep this page open while analysis advances. Leaving stops automatic progress; return to continue from saved evidence."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("mt-6 grid grid-cols-[minmax(0,1fr)] gap-6", inv.target_type === "visual" ? "lg:grid-cols-[240px_minmax(0,1fr)]" : "lg:grid-cols-[300px_minmax(0,1fr)]"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "min-w-0 rounded-lg border border-border bg-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-border px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium text-foreground",
							children: "Timeline"
						}), working && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin text-primary" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
						className: "max-h-[640px] space-y-1 overflow-y-auto p-3",
						children: [steps.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimelineItem, { step: s }, s.i)), working && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "px-2 py-2 font-mono text-xs text-muted-foreground",
							children: "agent working…"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "min-w-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
						defaultValue: reportTab(inv.target_type, Boolean(report)),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
								className: "h-auto flex-wrap justify-start",
								children: [
									report && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "flow",
										children: "Flow"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "graph",
										children: "Graph"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
										value: "evidence",
										children: [
											"Evidence (",
											evidence.length,
											")"
										]
									}),
									inv.target_type === "visual" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "screens",
										children: "Screens"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
										value: "hypotheses",
										children: [
											"Hypotheses (",
											hypotheses.length,
											")"
										]
									}),
									report && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "findings",
										children: "Findings"
									}),
									report && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "details",
										children: "Technical"
									})
								]
							}),
							report && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "flow",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
									className: "space-y-2",
									children: report.flow.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex gap-3 rounded-lg border border-border bg-card p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-primary font-mono text-xs text-primary-foreground",
											children: f.order
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-wrap items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "font-medium text-foreground",
														children: f.title
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: f.verified ? "verified" : "inferred" })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-1 text-sm text-muted-foreground",
													children: f.description
												}),
												f.file && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "mt-1 font-mono text-xs text-primary",
													children: [
														f.file,
														f.line ? `:${f.line}` : "",
														f.symbol ? ` · ${f.symbol}` : ""
													]
												})
											]
										})]
									}, f.order))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "graph",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilteredEvidenceGraph, {
									nodes: liveGraph.nodes,
									edges: liveGraph.edges,
									findings: report?.findings ?? [],
									evidence
								}, id)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "evidence",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-2",
									children: evidence.slice().reverse().map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EvidenceItem, { e }, e.id))
								})
							}),
							inv.target_type === "visual" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "screens",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: cn("grid gap-4", evidence.filter((e) => e.kind === "visual_frame").length > 1 && "sm:grid-cols-2"),
									children: evidence.filter((e) => e.kind === "visual_frame").map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
										className: "min-w-0 overflow-hidden rounded-lg border border-border bg-card",
										children: [e.image && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: e.image,
											alt: e.title,
											className: "aspect-video w-full bg-muted object-contain"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
											className: "p-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "font-mono text-xs text-primary",
													children: [
														e.id,
														" · ",
														e.timestamp?.toFixed(1),
														"s"
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-1 text-sm font-medium text-foreground",
													children: e.title
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-muted-foreground",
													children: e.snippet
												})
											]
										})]
									}, e.id))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "hypotheses",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-2",
									children: hypotheses.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg border border-border bg-card p-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono text-xs text-muted-foreground",
													children: h.id
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: h.status === "supported" ? "verified" : h.status === "contradicted" ? "failed" : "unknown" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-2 text-sm text-foreground",
												children: h.statement
											}),
											h.evidence_ids.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 font-mono text-xs text-muted-foreground",
												children: h.evidence_ids.join(", ")
											})
										]
									}, h.id))
								})
							}),
							report && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "findings",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Findings, { report })
							}),
							report && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "details",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg border border-border bg-card p-5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "whitespace-pre-wrap text-sm text-foreground",
											children: report.technical_details
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "mt-6 text-sm font-medium text-foreground",
											children: "Confidence breakdown"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
											className: "mt-2 grid grid-cols-2 gap-2 font-mono text-xs text-muted-foreground sm:grid-cols-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
													"verified ratio: ",
													(report.confidence.verifiedRatio * 100).toFixed(0),
													"%"
												] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["evidence items: ", report.confidence.evidenceCount] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["independent files: ", report.confidence.distinctFiles] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["direct observations: ", report.confidence.directObservations] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["contradictions: ", report.confidence.contradictions] })
											]
										})
									]
								})
							})
						]
					}, `${id}-${Boolean(report)}`)
				})]
			}),
			report && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportWorkspace, {
				id,
				target: inv.target_type,
				report,
				evidence
			}),
			report && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "print-report hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Findings" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Findings, { report }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Evidence" }),
					evidence.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { children: [
							e.id,
							": ",
							e.title
						] }),
						e.image && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: e.image,
							alt: e.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: e.snippet })
					] }, e.id))
				]
			})
		]
	});
}
function ReportSummary({ report }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-6 border-y border-border py-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs uppercase tracking-widest text-primary",
					children: "Short answer"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: "Evidence score"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfidenceMeter, { value: report.confidence.score })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-lg leading-relaxed text-foreground",
				children: report.short_answer
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: "This score measures evidence coverage, not the probability that an answer is correct. Verified means references were checked; it does not prove every claim."
			}),
			report.confidence.score < 40 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-warning",
				children: "Limited evidence. Add the starting screen, important changes, and final result for a more complete visual investigation, or provide more relevant source evidence."
			}),
			report.unknowns.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
				className: "mt-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
					className: "cursor-pointer text-sm font-medium",
					children: [
						"What remains unknown (",
						report.unknowns.length,
						")"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 list-disc pl-5 text-sm text-muted-foreground",
					children: report.unknowns.map((u, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: u }, i))
				})]
			})
		]
	});
}
function Findings({ report }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			[
				"verified",
				"observed",
				"inferred",
				"unknown"
			].map((g) => {
				const items = report.findings.filter((f) => f.status === g);
				if (!items.length) return null;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: g }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 space-y-2",
					children: items.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-lg border border-border bg-card p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-foreground",
							children: f.claim
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 font-mono text-xs text-muted-foreground",
							children: [
								f.file ?? "no file reference",
								f.line ? `:${f.line}` : "",
								f.symbol ? ` · ${f.symbol}` : "",
								f.evidence_ids.length ? ` · ${f.evidence_ids.join(", ")}` : ""
							]
						})]
					}, i))
				})] }, g);
			}),
			report.contradictions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "flex items-center gap-2 text-sm font-medium text-warning",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4" }), " Contradictions"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 space-y-2",
				children: report.contradictions.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm text-foreground",
					children: [
						c.description,
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-xs text-muted-foreground",
							children: c.evidence_ids.join(", ")
						})
					]
				}, i))
			})] }),
			report.unknowns.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "flex items-center gap-2 text-sm font-medium text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-4 w-4" }), " Unknowns"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 list-disc space-y-1 pl-6 text-sm text-muted-foreground",
				children: report.unknowns.map((u, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: u }, i))
			})] })
		]
	});
}
function TimelineItem({ step }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const Icon = STEP_ICON[step.type] ?? Search;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "rounded-md px-2 py-2 hover:bg-muted/50",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			className: "flex w-full items-start gap-2 text-left",
			onClick: () => setOpen(!open),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: cn("mt-0.5 h-4 w-4 shrink-0 text-muted-foreground", STEP_TONE[step.type]) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate font-mono text-xs text-foreground",
						children: step.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[10px] uppercase text-muted-foreground",
						children: step.type.replace("_", " ")
					})]
				}),
				step.detail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("h-3 w-3 text-muted-foreground transition-transform", open && "rotate-180") })
			]
		}), open && step.detail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
			className: "mt-2 whitespace-pre-wrap rounded bg-background p-2 font-mono text-[11px] text-muted-foreground",
			children: step.detail
		})]
	});
}
function EvidenceItem({ e }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			className: "flex w-full items-center gap-3 px-4 py-3 text-left",
			onClick: () => setOpen(!open),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-xs text-primary",
					children: e.id
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "rounded border border-border px-1.5 py-0.5 font-mono text-[10px] uppercase text-muted-foreground",
					children: [
						e.kind === "database_reference" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "inline h-3 w-3" }) : null,
						" ",
						e.kind.replace("_", " ")
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "min-w-0 flex-1 truncate font-mono text-xs text-foreground",
					children: e.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-[10px] text-muted-foreground",
					children: e.tool
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("h-3 w-3 text-muted-foreground transition-transform", open && "rotate-180") })
			]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [e.image && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: e.image,
			alt: e.title,
			className: "max-h-96 w-full border-t border-border bg-muted object-contain"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
			className: "overflow-x-auto border-t border-border bg-background p-3 font-mono text-[11px] leading-relaxed text-muted-foreground",
			children: e.snippet
		})] })]
	});
}
//#endregion
export { InvestigationPage as component };
