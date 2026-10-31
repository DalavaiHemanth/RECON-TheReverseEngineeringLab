import { _ as createFileRoute, g as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/investigations._id-CUnTEpS-.js
var $$splitComponentImporter = () => import("./investigations._id-DMbA6ufc.mjs");
var Route = createFileRoute("/_authenticated/investigations/$id")({
	head: () => ({ meta: [
		{ title: "Investigation — RECON" },
		{
			name: "description",
			content: "Investigation timeline, evidence graph, and evidence-backed findings."
		},
		{
			property: "og:title",
			content: "Investigation — RECON"
		},
		{
			property: "og:description",
			content: "Investigation timeline, evidence graph, and evidence-backed findings."
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
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
