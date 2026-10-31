import type { Evidence, Report, TargetType } from "./types";

type StartingAdvice = { questions: string[]; preparation: string[] };
export const STARTING_ADVICE: Record<TargetType, StartingAdvice> = {
  repo: {
    questions: [
      "How does authentication and login work?",
      "Which function handles file upload, and what validation does it perform?",
      "What happens when a user submits the main form?",
      "Which modules read or write database records?",
      "Which API routes exist, and what do they call?",
      "Where are permissions checked before accessing private data?",
      "How are errors and retries handled?",
      "Which parts would need to change to add a similar feature?",
    ],
    preparation: ["Include the feature’s entry point and related modules.", "Include configuration examples with secrets removed.", "Name the action, expected result, and any failure you want investigated."],
  },
  web: {
    questions: [
      "What forms are visible, and where do they submit?",
      "Which API references appear in the fetched HTML and scripts?",
      "What third-party scripts does the site load?",
      "What security headers are present or missing?",
      "How are the public pages connected?",
      "What accessibility issues can be identified in the fetched markup?",
      "What does the markup reveal about the main user journey?",
      "What evidence is missing to understand this feature fully?",
    ],
    preparation: ["Use the public page closest to the feature, rather than only the homepage.", "Name the page or form you want examined.", "Use screenshots or a recording for interactions that fetched pages cannot show."],
  },
  runtime: {
    questions: [
      "Which API paths can be identified from the read-only probes?",
      "How does the app respond to unauthenticated requests?",
      "What does robots.txt reveal about publicly listed paths?",
      "Which HTTP methods are advertised by OPTIONS responses?",
      "What response headers affect caching or security?",
      "How do observed error responses differ across probed paths?",
      "What can the observed responses reveal about the service?",
      "What further checks would require permission or a different input?",
    ],
    preparation: ["Use a public application address you own or have permission to test.", "Name the API path or response behavior you care about.", "Remove credentials from URLs; these probes do not submit forms or change data."],
  },
  binary: {
    questions: [
      "What does this binary appear to do based on its extracted artifacts?",
      "Which libraries and system APIs does it reference?",
      "Are there embedded URLs or file paths?",
      "What format and architecture is this file?",
      "What do the sections reveal about the file structure?",
      "Which strings are relevant to network behavior?",
      "What can static evidence suggest about file operations?",
      "Which conclusions cannot be established without execution?",
    ],
    preparation: ["Provide the original executable or library rather than an archive.", "Explain where the file came from and the behavior you want to understand.", "Review sensitive strings; the file is never executed, but extracted artifacts are analyzed."],
  },
  visual: {
    questions: [
      "Explain the feature shown in these screenshots or this recording.",
      "What user flow and screen changes are visible?",
      "What would I need to build a similar feature?",
      "Which loading, empty, success, and error states are demonstrated?",
      "What usability improvements could be proposed for the visible flow?",
      "Which controls and feedback are visible at each step?",
      "What privacy or permission choices are visible?",
      "What extra screens would help resolve the missing details?",
    ],
    preparation: ["Capture the starting screen, important changes, and final result.", "Include loading or error states if they are relevant to your question.", "Crop or redact private details and approve only the frames you want shared."],
  },
};

export function startingQuestions(target: TargetType, question: string) {
  const words = question.toLowerCase().match(/[a-z]{4,}/g) ?? [];
  return STARTING_ADVICE[target].questions
    .map((text, index) => ({ text, index, score: words.filter((word) => text.toLowerCase().includes(word)).length }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ text }) => text);
}

export type Recommendation = {
  id: string;
  title: string;
  reason: string;
  question: string;
  refs: string[];
  action: "followup" | "brief";
};

export function reportRecommendations(target: TargetType, report: Report, evidence: Evidence[]): Recommendation[] {
  const items: Recommendation[] = [];
  const ids = new Set(evidence.map((e) => e.id));
  if (report.unknowns.length) {
    items.push({ id: "gaps", title: "Resolve the unanswered questions", reason: report.unknowns.slice(0, 2).join(" · "), question: `What additional evidence would help resolve these unknowns? ${report.unknowns.slice(0, 2).join("; ").slice(0, 650)}`, refs: [], action: "followup" });
  }
  if (report.contradictions.length) {
    const c = report.contradictions[0];
    if (c) items.push({ id: "contradictions", title: "Examine conflicting evidence", reason: c.description, question: `Explain this conflict, separating supported conclusions from uncertainty: ${c.description.slice(0, 700)}`, refs: c.evidence_ids.filter((id) => ids.has(id)), action: "followup" });
  }
  const inferred = report.findings.find((f) => f.status === "inferred" || f.status === "unknown");
  if (inferred) items.push({ id: "validate", title: "Check an uncertain finding", reason: inferred.claim, question: `What supports this finding, what is inferred, and what evidence would confirm or challenge it? ${inferred.claim.slice(0, 650)}`, refs: inferred.evidence_ids.filter((id) => ids.has(id)), action: "followup" });
  if (report.confidence.score < 40 || evidence.length === 0) {
    items.push({ id: "coverage", title: "Plan stronger evidence coverage", reason: "Evidence coverage is limited; more suggestions are not a substitute for more evidence.", question: `What additional ${target === "visual" ? "screens or recording moments" : "source material"} should I provide to improve this investigation? Prioritize the most useful gaps.`, refs: [], action: "followup" });
  }
  const contextual = STARTING_ADVICE[target].questions.slice(3, 7);
  contextual.forEach((question, i) => items.push({ id: `explore-${i}`, title: question, reason: "Suggested angle for this target; the retained evidence may not answer it.", question, refs: [], action: "followup" }));
  items.push({ id: "brief", title: "Turn the report into a build plan", reason: "Propose screens or modules, interactions, edge cases, and acceptance criteria—not claims about the original implementation.", question: "", refs: [], action: "brief" });
  return items;
}