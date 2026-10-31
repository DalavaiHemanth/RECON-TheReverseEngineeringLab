import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-ztlTMj4W.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { S as useRouter, _ as createFileRoute, d as Scripts, f as HeadContent, g as lazyRouteComponent, h as Outlet, m as createRouter, q as redirect, v as createRootRouteWithContext, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as Route$8 } from "./investigations._id-CUnTEpS-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Biw_205w.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-CLarTotR.css";
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$7 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "RECON — Autonomous Software Investigation" },
			{
				name: "description",
				content: "AI agent that investigates code repositories and explains how features work, with evidence."
			},
			{
				property: "og:title",
				content: "RECON — Autonomous Software Investigation"
			},
			{
				property: "og:description",
				content: "AI agent that investigates code repositories and explains how features work, with evidence."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "dark",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "font-sans antialiased",
			children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})]
		})]
	});
}
function RootComponent() {
	const { queryClient } = Route$7.useRouteContext();
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		const { data } = supabase.auth.onAuthStateChange((event) => {
			if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
			router.invalidate();
			if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
		});
		return () => data.subscription.unsubscribe();
	}, [router, queryClient]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})]
	});
}
var $$splitComponentImporter$5 = () => import("./routes-CcTCMd8d.mjs");
var Route$6 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "RECON — Investigate software and visible features" },
		{
			name: "description",
			content: "Investigate source code, websites, running applications, binaries, and visual feature demonstrations with evidence-backed reports."
		},
		{
			property: "og:title",
			content: "RECON — Investigate software and visible features"
		},
		{
			property: "og:description",
			content: "Investigate software and visual demonstrations, separating observed evidence from inferred behavior."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./route-BIZARGpX.mjs");
var Route$5 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data } = await supabase.auth.getUser();
		if (!data.user) throw redirect({ to: "/auth" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./auth-B_ij5PH0.mjs");
var Route$4 = createFileRoute("/auth")({
	head: () => ({ meta: [
		{ title: "Sign in — RECON" },
		{
			name: "description",
			content: "Sign in to RECON to run and review your software investigations."
		},
		{
			property: "og:title",
			content: "Sign in — RECON"
		},
		{
			property: "og:description",
			content: "Sign in to RECON to run and review your software investigations."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./dashboard-BgTYl5Ry.mjs");
var Route$3 = createFileRoute("/_authenticated/dashboard")({
	head: () => ({ meta: [
		{ title: "Your investigations — RECON" },
		{
			name: "description",
			content: "Find, organize, and revisit your evidence-backed investigations."
		},
		{
			property: "og:title",
			content: "Your investigations — RECON"
		},
		{
			property: "og:description",
			content: "Find, organize, and revisit your evidence-backed investigations."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./new-BPGnOsyQ.mjs");
var Route$2 = createFileRoute("/_authenticated/new")({
	head: () => ({ meta: [
		{ title: "New investigation — RECON" },
		{
			name: "description",
			content: "Choose a target and ask RECON a question about how it works."
		},
		{
			property: "og:title",
			content: "New investigation — RECON"
		},
		{
			property: "og:description",
			content: "Choose a target and ask RECON a question about how it works."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./settings-DI1kZifc.mjs");
var Route$1 = createFileRoute("/_authenticated/settings")({
	head: () => ({ meta: [
		{ title: "Privacy & settings — RECON" },
		{
			name: "description",
			content: "Control saved investigation data, retention, and your GitHub connection."
		},
		{
			property: "og:title",
			content: "Privacy & settings — RECON"
		},
		{
			property: "og:description",
			content: "Control saved investigation data, retention, and your GitHub connection."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
async function authenticateCronRequest(request) {
	const currentSecret = process.env["CRON_SECRET"] || process.env["LOVABLE_CRON_SECRET"];
	const previousSecret = process.env["CRON_SECRET_PREVIOUS"] || process.env["LOVABLE_CRON_SECRET_PREVIOUS"];
	if (!currentSecret) return new Response("Server configuration error", { status: 500 });
	const token = /^Bearer ([^\s,]+)$/.exec(request.headers.get("authorization") ?? "")?.[1];
	if (!token) return new Response("Unauthorized", { status: 401 });
	const { createHash, timingSafeEqual } = await import("node:crypto");
	const digest = (value) => createHash("sha256").update(value, "utf8").digest();
	const providedDigest = digest(token);
	const currentMatches = timingSafeEqual(providedDigest, digest(currentSecret));
	const previousMatches = timingSafeEqual(providedDigest, digest(previousSecret ?? currentSecret));
	if (!currentMatches && !previousMatches) return new Response("Unauthorized", { status: 401 });
	return null;
}
var Route = createFileRoute("/api/public/jobs/retention")({ server: { handlers: { POST: async ({ request }) => {
	const failure = await authenticateCronRequest(request);
	if (failure) return failure;
	const { supabaseAdmin } = await import("./client.server-Vk42uBn7.mjs");
	const { data, error } = await supabaseAdmin.from("investigations").select("id").lte("expires_at", (/* @__PURE__ */ new Date()).toISOString()).limit(500);
	if (error) return Response.json({ error: "Cleanup could not read expired investigations." }, { status: 500 });
	if (data?.length) {
		const { error: e } = await supabaseAdmin.from("investigations").delete().in("id", data.map((r) => r.id));
		if (e) return Response.json({ error: "Cleanup failed." }, { status: 500 });
	}
	return Response.json({ deleted: data?.length ?? 0 });
} } } });
var IndexRoute = Route$6.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$7
});
var AuthenticatedRouteRoute = Route$5.update({
	id: "/_authenticated",
	getParentRoute: () => Route$7
});
var AuthRoute = Route$4.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$7
});
var AuthenticatedDashboardRoute = Route$3.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedNewRoute = Route$2.update({
	id: "/new",
	path: "/new",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedSettingsRoute = Route$1.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedInvestigationsIdRoute = Route$8.update({
	id: "/investigations/$id",
	path: "/investigations/$id",
	getParentRoute: () => AuthenticatedRouteRoute
});
var ApiPublicJobsRetentionRoute = Route.update({
	id: "/api/public/jobs/retention",
	path: "/api/public/jobs/retention",
	getParentRoute: () => Route$7
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedDashboardRoute,
	AuthenticatedNewRoute,
	AuthenticatedSettingsRoute,
	AuthenticatedInvestigationsIdRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AuthRoute,
	ApiPublicJobsRetentionRoute
};
var routeTree = Route$7._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
