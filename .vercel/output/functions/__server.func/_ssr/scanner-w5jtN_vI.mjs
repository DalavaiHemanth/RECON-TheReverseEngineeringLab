//#region node_modules/.nitro/vite/services/ssr/assets/scanner-w5jtN_vI.js
var KEYWORDS = /* @__PURE__ */ new Set([
	"if",
	"for",
	"while",
	"switch",
	"catch",
	"return",
	"function",
	"typeof",
	"new",
	"await",
	"print",
	"len",
	"str",
	"int",
	"dict",
	"list",
	"set",
	"super",
	"constructor",
	"else",
	"with",
	"elif",
	"def",
	"class",
	"import",
	"from",
	"async",
	"yield",
	"lambda",
	"not",
	"and",
	"or",
	"in",
	"require",
	"console",
	"isinstance",
	"range",
	"tuple",
	"float",
	"bool",
	"object",
	"type",
	"map",
	"filter",
	"then",
	"get",
	"set",
	"push",
	"toString",
	"JSON",
	"Object",
	"Array",
	"Promise",
	"func",
	"fn",
	"struct",
	"impl",
	"pub",
	"mut",
	"let",
	"use",
	"package",
	"void",
	"static",
	"final",
	"override",
	"string",
	"var",
	"val",
	"fun",
	"end",
	"do",
	"begin",
	"include",
	"namespace",
	"using",
	"printf",
	"println",
	"fmt",
	"log",
	"self",
	"this",
	"nil",
	"null",
	"true",
	"false",
	"echo",
	"sizeof",
	"interface",
	"enum",
	"match",
	"where",
	"defer",
	"go"
]);
var LANGUAGES = [
	{
		id: "python",
		exts: [".py"],
		symbols: [{
			re: /^(\s*)(?:async\s+)?def\s+([A-Za-z_]\w*)\s*\(/,
			kind: "function",
			group: 2
		}, {
			re: /^(\s*)class\s+([A-Za-z_]\w*)/,
			kind: "class",
			group: 2
		}],
		imports: [{
			re: /^\s*from\s+([\w.]+)\s+import\s+/,
			group: 1
		}, {
			re: /^\s*import\s+([\w.]+)/,
			group: 1
		}],
		routes: [{
			re: /@\w+\.(get|post|put|delete|patch|route)\(\s*['"]([^'"]+)['"]/i,
			method: 1,
			path: 2
		}, {
			re: /\bpath\(\s*['"]([^'"]*)['"]/,
			method: 0,
			path: 1
		}]
	},
	{
		id: "typescript",
		exts: [
			".ts",
			".tsx",
			".js",
			".jsx",
			".mjs",
			".cjs"
		],
		symbols: [
			{
				re: /^(\s*)(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)\s*\(/,
				kind: "function",
				group: 2
			},
			{
				re: /^(\s*)(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*(?::[^=]+)?=\s*(?:async\s*)?(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*(?::[^=]+)?=>/,
				kind: "function",
				group: 2
			},
			{
				re: /^(\s*)(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s+)?function\b/,
				kind: "function",
				group: 2
			},
			{
				re: /^(\s*)(?:export\s+)?(?:default\s+)?(?:abstract\s+)?class\s+([A-Za-z_$][\w$]*)/,
				kind: "class",
				group: 2
			},
			{
				re: /^(\s+)(?:public\s+|private\s+|protected\s+|static\s+)*(?:async\s+)?([A-Za-z_$][\w$]*)\s*\([^)]*\)\s*(?::\s*[^{]+)?\{\s*$/,
				kind: "method",
				group: 2
			}
		],
		imports: [{
			re: /^\s*import\s+(?:[^'"]+\s+from\s+)?['"]([^'"]+)['"]/,
			group: 1
		}, {
			re: /require\(\s*['"]([^'"]+)['"]\s*\)/,
			group: 1
		}],
		routes: [
			{
				re: /\b(?:app|router|server|api|route)\.(get|post|put|delete|patch|all)\(\s*['"`](\/[^'"`]*)['"`]/i,
				method: 1,
				path: 2
			},
			{
				re: /createFileRoute\(\s*['"]([^'"]+)['"]/,
				method: 0,
				path: 1
			},
			{
				re: /fetch\(\s*['"`]([^'"`]*\/api\/[^'"`]*)['"`]/,
				method: 0,
				path: 1
			}
		]
	},
	{
		id: "go",
		exts: [".go"],
		symbols: [{
			re: /^func\s+(?:\([^)]*\)\s+)?([A-Za-z_]\w*)\s*\(/,
			kind: "function",
			group: 1
		}, {
			re: /^type\s+([A-Za-z_]\w*)\s+(?:struct|interface)\b/,
			kind: "class",
			group: 1
		}],
		imports: [{
			re: /^\s*import\s+"([^"]+)"/,
			group: 1
		}, {
			re: /^\s+"([\w./-]+)"/,
			group: 1
		}],
		routes: [{
			re: /\b(?:r|router|mux|app|e|srv)\.(GET|POST|PUT|DELETE|PATCH|Handle|HandleFunc|Any)\(\s*"([^"]+)"/,
			method: 1,
			path: 2
		}, {
			re: /http\.HandleFunc\(\s*"([^"]+)"/,
			method: 0,
			path: 1
		}]
	},
	{
		id: "rust",
		exts: [".rs"],
		symbols: [{
			re: /^\s*(?:pub(?:\(\w+\))?\s+)?(?:async\s+)?fn\s+([A-Za-z_]\w*)\s*[<(]/,
			kind: "function",
			group: 1
		}, {
			re: /^\s*(?:pub\s+)?(?:struct|enum|trait)\s+([A-Za-z_]\w*)/,
			kind: "class",
			group: 1
		}],
		imports: [{
			re: /^\s*use\s+([\w:]+)/,
			group: 1
		}],
		routes: [{
			re: /\.route\(\s*"([^"]+)"\s*,\s*(get|post|put|delete|patch)/i,
			method: 2,
			path: 1
		}, {
			re: /#\[(get|post|put|delete|patch)\(\s*"([^"]+)"/i,
			method: 1,
			path: 2
		}]
	},
	{
		id: "java",
		exts: [".java"],
		symbols: [{
			re: /^\s*(?:public|private|protected)?\s*(?:static\s+)?(?:final\s+)?class\s+([A-Za-z_]\w*)/,
			kind: "class",
			group: 1
		}, {
			re: /^\s+(?:public|private|protected)\s+(?:static\s+)?(?:[\w<>\[\],.?]+\s+)+([A-Za-z_]\w*)\s*\([^)]*\)\s*(?:throws\s+[\w,.\s]+)?\{?/,
			kind: "method",
			group: 1
		}],
		imports: [{
			re: /^\s*import\s+([\w.]+)\s*;/,
			group: 1
		}],
		routes: [{
			re: /@(Get|Post|Put|Delete|Patch|Request)Mapping\(\s*(?:value\s*=\s*)?"([^"]*)"/,
			method: 1,
			path: 2
		}]
	},
	{
		id: "kotlin",
		exts: [".kt", ".kts"],
		symbols: [{
			re: /^\s*(?:suspend\s+)?fun\s+(?:[\w.]+\.)?([A-Za-z_]\w*)\s*\(/,
			kind: "function",
			group: 1
		}, {
			re: /^\s*(?:data\s+)?(?:class|object|interface)\s+([A-Za-z_]\w*)/,
			kind: "class",
			group: 1
		}],
		imports: [{
			re: /^\s*import\s+([\w.]+)/,
			group: 1
		}],
		routes: [{
			re: /@(Get|Post|Put|Delete|Patch)Mapping\(\s*"([^"]*)"/,
			method: 1,
			path: 2
		}, {
			re: /\b(get|post|put|delete|patch)\(\s*"(\/[^"]*)"/,
			method: 1,
			path: 2
		}]
	},
	{
		id: "csharp",
		exts: [".cs"],
		symbols: [{
			re: /^\s*(?:public|internal|private)?\s*(?:partial\s+)?(?:class|record|struct|interface)\s+([A-Za-z_]\w*)/,
			kind: "class",
			group: 1
		}, {
			re: /^\s+(?:public|private|protected|internal)\s+(?:static\s+)?(?:async\s+)?(?:[\w<>\[\],.?]+\s+)+([A-Za-z_]\w*)\s*\([^)]*\)\s*\{?\s*$/,
			kind: "method",
			group: 1
		}],
		imports: [{
			re: /^\s*using\s+([\w.]+)\s*;/,
			group: 1
		}],
		routes: [{
			re: /\[Http(Get|Post|Put|Delete|Patch)(?:\(\s*"([^"]*)")?/,
			method: 1,
			path: 2
		}, {
			re: /\[Route\(\s*"([^"]+)"/,
			method: 0,
			path: 1
		}]
	},
	{
		id: "cpp",
		exts: [
			".c",
			".cc",
			".cpp",
			".cxx",
			".h",
			".hpp"
		],
		symbols: [{
			re: /^(?:[\w:*&<>~]+\s+)+([A-Za-z_]\w*)\s*\([^;{}]*\)\s*(?:const\s*)?\{?\s*$/,
			kind: "function",
			group: 1
		}, {
			re: /^\s*(?:class|struct)\s+([A-Za-z_]\w*)/,
			kind: "class",
			group: 1
		}],
		imports: [{
			re: /^\s*#\s*include\s*[<"]([^>"]+)[>"]/,
			group: 1
		}],
		routes: []
	},
	{
		id: "ruby",
		exts: [".rb"],
		symbols: [
			{
				re: /^\s*def\s+(?:self\.)?([A-Za-z_]\w*[!?=]?)/,
				kind: "function",
				group: 1
			},
			{
				re: /^\s*class\s+([A-Za-z_]\w*)/,
				kind: "class",
				group: 1
			},
			{
				re: /^\s*module\s+([A-Za-z_]\w*)/,
				kind: "class",
				group: 1
			}
		],
		imports: [{
			re: /^\s*require(?:_relative)?\s+['"]([^'"]+)['"]/,
			group: 1
		}],
		routes: [{
			re: /^\s*(get|post|put|delete|patch)\s+['"](\/[^'"]*)['"]/i,
			method: 1,
			path: 2
		}]
	},
	{
		id: "php",
		exts: [".php"],
		symbols: [{
			re: /^\s*(?:public|private|protected)?\s*(?:static\s+)?function\s+([A-Za-z_]\w*)\s*\(/,
			kind: "function",
			group: 1
		}, {
			re: /^\s*(?:abstract\s+|final\s+)?class\s+([A-Za-z_]\w*)/,
			kind: "class",
			group: 1
		}],
		imports: [{
			re: /^\s*use\s+([\w\\]+)\s*;/,
			group: 1
		}, {
			re: /require(?:_once)?\s*\(?\s*['"]([^'"]+)['"]/,
			group: 1
		}],
		routes: [{
			re: /Route::(get|post|put|delete|patch)\(\s*['"]([^'"]+)['"]/i,
			method: 1,
			path: 2
		}]
	},
	{
		id: "swift",
		exts: [".swift"],
		symbols: [{
			re: /^\s*(?:public|private|internal|fileprivate)?\s*(?:static\s+)?func\s+([A-Za-z_]\w*)\s*\(/,
			kind: "function",
			group: 1
		}, {
			re: /^\s*(?:public|private|internal)?\s*(?:class|struct|enum|protocol)\s+([A-Za-z_]\w*)/,
			kind: "class",
			group: 1
		}],
		imports: [{
			re: /^\s*import\s+(\w+)/,
			group: 1
		}],
		routes: []
	}
];
var DB_RE = /\b(SELECT\s+.+\s+FROM|INSERT\s+INTO|UPDATE\s+\w+\s+SET|DELETE\s+FROM)\b|\.from\(\s*['"]\w+['"]\s*\)|\bprisma\.\w+|session\.query\(|\.objects\.(?:get|filter|create|all)\(|\.(?:findOne|findMany|findUnique|insertOne|updateOne)\(|\bcursor\.execute\(/i;
function langFor(path) {
	const lower = path.toLowerCase();
	return LANGUAGES.find((l) => l.exts.some((e) => lower.endsWith(e)));
}
function isIndexable(path) {
	if (/(^|\/)(node_modules|dist|build|\.git|__pycache__|venv|\.venv|\.next|coverage)\//.test(path)) return false;
	if (/\.min\.js$|\.d\.ts$/.test(path)) return false;
	return !!langFor(path);
}
function scanRepo(files) {
	const scan = {
		files: [],
		symbols: [],
		imports: [],
		routes: [],
		dbRefs: [],
		calls: []
	};
	const perFile = [];
	for (const file of files) {
		const spec = langFor(file.path);
		if (!spec) continue;
		const lines = file.content.split("\n");
		scan.files.push({
			path: file.path,
			lang: spec.id,
			lines: lines.length
		});
		const syms = [];
		lines.forEach((text, i) => {
			for (const s of spec.symbols) {
				const m = s.re.exec(text);
				const nm = m?.[s.group];
				if (m && nm && !KEYWORDS.has(nm)) {
					syms.push({
						name: nm,
						kind: s.kind,
						file: file.path,
						line: i + 1,
						endLine: i + 1,
						lang: spec.id
					});
					break;
				}
			}
			for (const imp of spec.imports) {
				const m = imp.re.exec(text);
				if (m) {
					scan.imports.push({
						file: file.path,
						line: i + 1,
						module: m[imp.group] ?? ""
					});
					break;
				}
			}
			for (const r of spec.routes) {
				const m = r.re.exec(text);
				if (m) {
					scan.routes.push({
						file: file.path,
						line: i + 1,
						method: r.method ? (m[r.method] ?? "").toUpperCase() : "ANY",
						path: m[r.path] ?? ""
					});
					break;
				}
			}
			if (DB_RE.test(text)) scan.dbRefs.push({
				file: file.path,
				line: i + 1,
				text: text.trim().slice(0, 160)
			});
		});
		syms.forEach((s, idx) => {
			const next = syms[idx + 1];
			s.endLine = Math.min(next ? next.line - 1 : lines.length, s.line + 120);
		});
		scan.symbols.push(...syms);
		perFile.push({
			file,
			lines,
			syms
		});
	}
	const byName = /* @__PURE__ */ new Map();
	for (const s of scan.symbols) {
		const list = byName.get(s.name) ?? [];
		list.push(s);
		byName.set(s.name, list);
	}
	const callRe = /([A-Za-z_$][\w$]*)\s*\(/g;
	for (const { lines, syms } of perFile) for (const s of syms) {
		const seen = /* @__PURE__ */ new Set();
		for (let ln = s.line; ln < s.endLine; ln++) {
			const text = lines[ln] ?? "";
			callRe.lastIndex = 0;
			let m;
			while (m = callRe.exec(text)) {
				const name = m[1] ?? "";
				if (name === s.name || KEYWORDS.has(name) || seen.has(name)) continue;
				const targets = byName.get(name);
				if (!targets) continue;
				seen.add(name);
				const target = targets.find((t) => t.file === s.file) ?? targets[0];
				scan.calls.push({
					from: s.name,
					fromFile: s.file,
					to: target.name,
					toFile: target.file,
					line: ln + 1
				});
			}
		}
	}
	return scan;
}
/** True when `symbol` is declared in `file` within `tolerance` lines of `line` (or anywhere if line is null). */
function symbolExistsAt(scan, file, symbol, line, tolerance = 15) {
	if (!scan.files.some((f) => f.path === file)) return false;
	if (!symbol) return line == null || line <= (scan.files.find((f) => f.path === file)?.lines ?? 0);
	return scan.symbols.some((s) => s.file === file && s.name === symbol && (line == null || Math.abs(s.line - line) <= tolerance || line >= s.line && line <= s.endLine));
}
//#endregion
export { scanRepo as n, symbolExistsAt as r, isIndexable as t };
