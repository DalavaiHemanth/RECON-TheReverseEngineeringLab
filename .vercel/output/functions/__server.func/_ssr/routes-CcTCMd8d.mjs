import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as GitBranch, Q as Binary, d as Server, et as ArrowRight, j as Globe, p as ScanEye } from "../_libs/lucide-react.mjs";
import { n as Logo, r as ThemeToggle } from "./AppHeader-TDt3QDcK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CcTCMd8d.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mx-auto flex h-16 max-w-6xl items-center justify-between px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						children: "Sign in"
					})
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-6xl px-6 py-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-primary",
					children: "Evidence-led investigation"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 text-5xl font-semibold",
					children: "RECON"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-2xl text-xl text-muted-foreground",
					children: "Understand unfamiliar software and visible feature behavior—with findings you can trace back to the evidence."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "lg",
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/new",
						children: ["Start an investigation ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-12 border-t border-border pt-7",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-semibold",
						children: "Choose your starting point"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
						children: [
							{
								icon: GitBranch,
								title: "Source code",
								text: "GitHub repositories or source ZIP files. Python, JS/TS, Go, Rust, Java, Kotlin, C#, C/C++, Ruby, PHP, and Swift."
							},
							{
								icon: ScanEye,
								title: "Visual features",
								text: "Screenshots, MP4 recordings, or a permission-based browser demonstration."
							},
							{
								icon: Globe,
								title: "Public websites",
								text: "Fetched pages, forms, scripts, endpoints, and headers—not an interactive browser session."
							},
							{
								icon: Server,
								title: "Running applications",
								text: "Read-only HTTP requests to inspect exposed paths and responses."
							},
							{
								icon: Binary,
								title: "Binary files",
								text: "Local extraction of file structure, strings, and imports. Files are never executed."
							}
						].map(({ icon: Icon, title, text }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "rounded-lg border border-border bg-card p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-6 w-6 text-primary" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-3 text-lg font-medium",
									children: title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted-foreground",
									children: text
								})
							]
						}, title))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-10 border-t border-border pt-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl font-semibold",
							children: "Evidence, not hidden implementation claims"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-3xl text-muted-foreground",
							children: "Reports separate observed, inferred, and unknown behavior. Reference checks and evidence scores are not guarantees of correctness. Only investigate material you own or have permission to inspect."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-3xl text-sm text-muted-foreground",
							children: "Approved evidence is saved to your account and relevant material is processed by the AI analysis engine. Browser-sharing permission and submission approval remain separate."
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { Home as component };
