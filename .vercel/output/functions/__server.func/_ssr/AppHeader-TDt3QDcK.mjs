import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-ztlTMj4W.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { A as History, _ as Plus, h as Radar, s as Sun, u as Settings, w as LogOut, x as Moon } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AppHeader-TDt3QDcK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ThemeToggle() {
	const [light, setLight] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const value = localStorage.getItem("recon-theme") === "light";
		setLight(value);
		document.documentElement.classList.toggle("light", value);
		document.documentElement.classList.toggle("dark", !value);
	}, []);
	function toggle() {
		const value = !light;
		setLight(value);
		document.documentElement.classList.toggle("light", value);
		document.documentElement.classList.toggle("dark", !value);
		localStorage.setItem("recon-theme", value ? "light" : "dark");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		size: "icon",
		variant: "ghost",
		title: light ? "Use dark theme" : "Use light theme",
		"aria-label": light ? "Use dark theme" : "Use light theme",
		onClick: toggle,
		children: light ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, {})
	});
}
function Logo() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "flex items-center gap-2 font-semibold tracking-[0.2em] text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid h-8 w-8 place-items-center rounded-md bg-gradient-primary text-primary-foreground",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radar, { className: "h-4 w-4" })
		}), "RECON"]
	});
}
function AppHeader() {
	const qc = useQueryClient();
	const navigate = useNavigate();
	async function signOut() {
		await qc.cancelQueries();
		qc.clear();
		await supabase.auth.signOut();
		navigate({
			to: "/auth",
			replace: true
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "border-b border-border/60 bg-background/60 backdrop-blur",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-14 max-w-7xl items-center justify-between px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/dashboard",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1 sm:gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "ghost",
						size: "icon",
						title: "Investigations",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dashboard",
							"aria-label": "Investigations",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, {})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "ghost",
						size: "icon",
						title: "Privacy & settings",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/settings",
							"aria-label": "Privacy & settings",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, {})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/new",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "New investigation"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: signOut,
						"aria-label": "Sign out",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" })
					})
				]
			})]
		})
	});
}
//#endregion
export { Logo as n, ThemeToggle as r, AppHeader as t };
