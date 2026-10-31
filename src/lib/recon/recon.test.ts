import { describe, expect, it } from "vitest";
import { scanRepo } from "./scanner";
import { classifyFinding, computeConfidence, verifyReference } from "./confidence";
import { analyzeBinary, extractStrings, searchStrings } from "./binary";
import { isPublicHttpUrl, parsePage } from "./web";

const files = [
  {
    path: "app/auth.py",
    content: `from flask import Flask\nimport bcrypt\n\n@app.post("/login")\ndef login():\n    user = find_user(request.form["email"])\n    return check_password(user)\n\ndef find_user(email):\n    return db.session.query(User).filter_by(email=email).first()\n\ndef check_password(user):\n    return True\n`,
  },
  {
    path: "web/api.ts",
    content: `import express from "express";\nexport async function handleLogin(req, res) {\n  const u = await loadUser(req.body.email);\n  res.json(u);\n}\nconst loadUser = async (email: string) => {\n  return prisma.user.findUnique({ where: { email } });\n};\nrouter.post("/api/login", handleLogin);\n`,
  },
];

describe("scanner", () => {
  const scan = scanRepo(files);
  it("extracts Python and TS functions", () => {
    const names = scan.symbols.map((s) => s.name).sort();
    expect(names).toEqual(["check_password", "find_user", "handleLogin", "loadUser", "login"]);
  });
  it("builds call relationships", () => {
    const edges = scan.calls.map((c) => `${c.from}>${c.to}`).sort();
    expect(edges).toEqual(["handleLogin>loadUser", "login>check_password", "login>find_user"]);
  });
  it("finds routes and db references", () => {
    expect(scan.routes.map((r) => `${r.method} ${r.path}`)).toEqual(["POST /login", "POST /api/login"]);
    expect(scan.dbRefs.length).toBe(2);
  });
});

describe("verification rule", () => {
  const scan = scanRepo(files);
  it("verifies a claim citing a real symbol with evidence", () => {
    expect(classifyFinding(scan, "observed", { file: "app/auth.py", symbol: "find_user", line: 9, evidence_ids: ["E1"] })).toBe("verified");
  });
  it("downgrades a claim citing a symbol that does not exist", () => {
    expect(classifyFinding(scan, "observed", { file: "app/auth.py", symbol: "issue_token", line: 9, evidence_ids: ["E1"] })).toBe("inferred");
  });
  it("does not verify without evidence ids", () => {
    expect(classifyFinding(scan, "observed", { file: "app/auth.py", symbol: "login", line: 5, evidence_ids: [] })).toBe("observed");
  });
});

describe("confidence formula", () => {
  it("scores a fully verified investigation", () => {
    const c = computeConfidence({ findings: [{ status: "verified" }, { status: "verified" }], evidenceCount: 12, distinctFiles: 6, contradictions: 0 });
    expect(c.score).toBe(100);
  });
  it("penalises contradictions and unverified findings", () => {
    const c = computeConfidence({ findings: [{ status: "verified" }, { status: "inferred" }], evidenceCount: 4, distinctFiles: 2, contradictions: 1 });
    // 22.5 + 8 + 8 + 15 - 10 = 43.5 -> 44
    expect(c.score).toBe(44);
  });
  it("is zero with nothing found", () => {
    expect(computeConfidence({ findings: [], evidenceCount: 0, distinctFiles: 0, contradictions: 0 }).score).toBe(0);
  });
});

describe("scanner: additional languages", () => {
  const multi = [
    { path: "main.go", content: `package main\nimport "net/http"\n\nfunc handleLogin(w http.ResponseWriter, r *http.Request) {\n\tcheckUser(r)\n}\n\nfunc checkUser(r *http.Request) {}\n\ntype Server struct{}\n\nfunc main() {\n\thttp.HandleFunc("/login", handleLogin)\n}\n` },
    { path: "lib.rs", content: `use std::io;\n\npub fn verify_token(t: &str) -> bool {\n\tlookup(t)\n}\n\nfn lookup(t: &str) -> bool { true }\n\npub struct Session;\n` },
    { path: "AuthController.java", content: `import org.springframework.web.bind.annotation.*;\n\npublic class AuthController {\n    @PostMapping("/login")\n    public String login(String user) {\n        return authenticate(user);\n    }\n    private String authenticate(String u) { return u; }\n}\n` },
    { path: "app.rb", content: `require "sinatra"\n\nclass App < Sinatra::Base\n  def find_account(email)\n    query_db(email)\n  end\nend\n\nget "/login" do\n  "ok"\nend\n` },
    { path: "routes.php", content: `<?php\nuse App\\Http\\Controllers\\AuthController;\n\nclass AuthController {\n    public function login($req) {\n        return $this->check($req);\n    }\n}\n\nRoute::post("/login", [AuthController::class, "login"]);\n` },
    { path: "main.c", content: `#include <stdio.h>\n\nstatic int verify_pin(int pin) {\n    return pin == 42;\n}\n\nint main(void) {\n    return verify_pin(1);\n}\n` },
  ];
  const scan = scanRepo(multi);

  it("extracts Go symbols, imports and routes", () => {
    const names = scan.symbols.filter((s) => s.lang === "go").map((s) => s.name);
    expect(names).toEqual(expect.arrayContaining(["handleLogin", "checkUser", "main", "Server"]));
    expect(scan.imports.some((i) => i.module === "net/http")).toBe(true);
    expect(scan.routes.some((r) => r.path === "/login")).toBe(true);
  });
  it("extracts Rust symbols and imports", () => {
    const names = scan.symbols.filter((s) => s.lang === "rust").map((s) => s.name);
    expect(names).toEqual(expect.arrayContaining(["verify_token", "lookup", "Session"]));
    expect(scan.imports.some((i) => i.module === "std::io")).toBe(true);
  });
  it("extracts Java class, methods and route", () => {
    const names = scan.symbols.filter((s) => s.lang === "java").map((s) => s.name);
    expect(names).toEqual(expect.arrayContaining(["AuthController", "login", "authenticate"]));
    expect(scan.routes.some((r) => r.method === "POST" && r.path === "/login")).toBe(true);
  });
  it("extracts Ruby symbols and route", () => {
    const names = scan.symbols.filter((s) => s.lang === "ruby").map((s) => s.name);
    expect(names).toEqual(expect.arrayContaining(["App", "find_account"]));
    expect(scan.routes.some((r) => r.method === "GET" && r.path === "/login")).toBe(true);
  });
  it("extracts PHP symbols and route", () => {
    const names = scan.symbols.filter((s) => s.lang === "php").map((s) => s.name);
    expect(names).toEqual(expect.arrayContaining(["AuthController", "login"]));
    expect(scan.routes.some((r) => r.method === "POST" && r.path === "/login")).toBe(true);
  });
  it("extracts C functions and includes", () => {
    const names = scan.symbols.filter((s) => s.lang === "cpp").map((s) => s.name);
    expect(names).toEqual(expect.arrayContaining(["verify_pin", "main"]));
    expect(scan.imports.some((i) => i.module === "stdio.h")).toBe(true);
  });
  it("links calls across languages", () => {
    expect(scan.calls.some((c) => c.from === "handleLogin" && c.to === "checkUser")).toBe(true);
    expect(scan.calls.some((c) => c.from === "main" && c.to === "verify_pin")).toBe(true);
  });
});

describe("binary analysis", () => {
  it("extracts printable strings with a minimum length", () => {
    const bytes = new Uint8Array([0x00, 0x7f, ...[..."hello world"].map((c) => c.charCodeAt(0)), 0x00, 0x01, 0x02, ...[..."ab"].map((c) => c.charCodeAt(0)), 0x00]);
    const strings = extractStrings(bytes, 5);
    expect(strings).toContain("hello world");
    expect(strings).not.toContain("ab");
  });
  it("identifies ELF binaries and parses headers", () => {
    const b = new Uint8Array(64);
    b[0] = 0x7f; b[1] = 0x45; b[2] = 0x4c; b[3] = 0x46; // \x7fELF
    b[4] = 2; // 64-bit
    b[5] = 1; // little-endian
    b[18] = 0x3e; // x86-64
    const info = analyzeBinary(b);
    expect(info.format).toBe("ELF");
    expect(info.bits).toBe(64);
    expect(info.arch).toBe("x86-64");
  });
  it("identifies PE binaries", () => {
    const b = new Uint8Array(0x200);
    b[0] = 0x4d; b[1] = 0x5a; // MZ
    new DataView(b.buffer).setUint32(0x3c, 0x80, true);
    b[0x80] = 0x50; b[0x81] = 0x45; // PE
    new DataView(b.buffer).setUint16(0x80 + 4, 0x8664, true); // x86-64
    new DataView(b.buffer).setUint16(0x80 + 24, 0x20b, true); // PE32+
    const info = analyzeBinary(b);
    expect(info.format).toBe("PE");
    expect(info.arch).toBe("x86-64");
    expect(info.bits).toBe(64);
  });
  it("searches strings case-insensitively", () => {
    const info = analyzeBinary(new Uint8Array([...[..."https://api.example.com/login"].map((c) => c.charCodeAt(0)), 0]));
    expect(searchStrings(info, "API.EXAMPLE").length).toBe(1);
    expect(searchStrings(info, "missing")).toEqual([]);
  });
});

describe("web analysis", () => {
  const html = `<html><head><title>Shop</title><script src="/static/app.js"></script></head><body>
    <form action="/login" method="post"><input name="email"><input name="password"></form>
    <a href="/about">About</a>
    <script>fetch("/api/session")</script>
  </body></html>`;
  const page = parsePage("https://shop.test/", 200, new Headers({ server: "nginx", "content-type": "text/html" }), html);

  it("extracts title, forms, endpoints, scripts and links", () => {
    expect(page.title).toBe("Shop");
    expect(page.forms[0]).toMatchObject({ action: "/login", method: "POST", fields: ["email", "password"] });
    expect(page.endpoints.some((e) => e.url === "/api/session")).toBe(true);
    expect(page.scripts).toContain("/static/app.js");
    expect(page.links).toContain("/about");
    expect(page.headers["server"]).toBe("nginx");
  });
  it("blocks localhost and private IPs", () => {
    expect(isPublicHttpUrl("http://localhost:8080/")).toBe(false);
    expect(isPublicHttpUrl("http://127.0.0.1/")).toBe(false);
    expect(isPublicHttpUrl("http://192.168.1.1/")).toBe(false);
    expect(isPublicHttpUrl("http://10.0.0.5/")).toBe(false);
    expect(isPublicHttpUrl("ftp://example.com/")).toBe(false);
    expect(isPublicHttpUrl("https://example.com/")).toBe(true);
  });
});

describe("verification rule: non-code targets", () => {
  const evidence = [
    { id: "E1", kind: "probe" as const, title: "GET https://app.test/api → 200", file: "https://app.test/api", line: null, snippet: "Status: 200", tool: "probe_endpoint", step: 1 },
  ];
  const ctx = { scan: null, evidence };
  it("verifies a claim whose reference appears in cited evidence", () => {
    expect(verifyReference(ctx, "observed", { file: "https://app.test/api", symbol: null, line: null, evidence_ids: ["E1"] })).toBe("verified");
  });
  it("downgrades a claim citing evidence IDs that do not exist", () => {
    expect(verifyReference(ctx, "observed", { file: "https://app.test/api", symbol: null, line: null, evidence_ids: ["E99"] })).toBe("inferred");
  });
  it("downgrades a claim whose reference was never seen", () => {
    expect(verifyReference(ctx, "observed", { file: "https://app.test/secret", symbol: null, line: null, evidence_ids: ["E1"] })).toBe("inferred");
  });
});
