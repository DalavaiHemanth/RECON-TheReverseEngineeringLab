import { a as nullType, c as stringType, i as literalType, l as unionType, n as booleanType, r as enumType, s as objectType, t as arrayType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product-BhMcEi5d.js
var retentionSchema = unionType([
	literalType(7),
	literalType(30),
	literalType(90),
	nullType()
]);
var actionSchema = enumType([
	"stop",
	"resume",
	"retry"
]);
function nextStatus(status, action) {
	if (action === "stop" && ["queued", "running"].includes(status)) return "paused";
	if (action === "resume" && status === "paused") return "running";
	if (action === "retry" && status === "failed") return "running";
	throw new Error("This action is not available for the current investigation.");
}
function reportTab(target, ready) {
	return target === "visual" ? "screens" : ready ? target === "repo" ? "flow" : "findings" : "graph";
}
var artifactSchema = objectType({
	answer: stringType().max(12e3),
	observations: arrayType(objectType({
		text: stringType().max(2e3),
		refs: arrayType(stringType()).max(20)
	})).max(20),
	suggestions: arrayType(stringType().max(2e3)).max(20),
	unknowns: arrayType(stringType().max(2e3)).max(20)
});
function groundArtifact(value, allowed) {
	const ids = new Set(allowed);
	return {
		...value,
		observations: value.observations.filter((o) => o.refs.length > 0 && o.refs.every((r) => ids.has(r)))
	};
}
var checklistSchema = objectType({ items: arrayType(objectType({
	id: stringType().min(1).max(80),
	title: stringType().min(1).max(300),
	note: stringType().max(1e3),
	done: booleanType()
})).min(1).max(30) });
function toggleChecklistItem(content, itemId) {
	if (!content.items.some((i) => i.id === itemId)) throw new Error("Checklist item not found.");
	return { items: content.items.map((i) => i.id === itemId ? {
		...i,
		done: !i.done
	} : i) };
}
function reportMarkdown(title, report, evidence) {
	return `# ${title}\n\n${report.short_answer}\n\n## Evidence score\n${report.confidence.score}/100 — heuristic evidence coverage, not a correctness probability.\n\n## Findings\n${report.findings.map((f) => `- [${f.status}] ${f.claim} (${f.evidence_ids.join(", ")})`).join("\n")}\n\n## Flow\n${report.flow.map((f) => `${f.order}. ${f.title}: ${f.description}`).join("\n")}\n\n## Unknowns\n${report.unknowns.map((u) => `- ${u}`).join("\n")}\n\n## Evidence\n${evidence.map((e) => `### ${e.id}: ${e.title}\n${e.file ?? ""}\n\n${e.snippet}`).join("\n\n")}\n\n## Technical detail\n${report.technical_details}`;
}
function downloadText(text, filename, type) {
	const url = URL.createObjectURL(new Blob([text], { type }));
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 3e4);
}
//#endregion
export { groundArtifact as a, reportTab as c, downloadText as i, retentionSchema as l, artifactSchema as n, nextStatus as o, checklistSchema as r, reportMarkdown as s, actionSchema as t, toggleChecklistItem as u };
