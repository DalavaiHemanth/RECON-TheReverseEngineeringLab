# RECON full feature build

## More investigation recommendations
- [x] Tailored starting questions and preparation recommendations for all target types
- [x] Report-based next steps and clickable follow-up recommendations
- [x] 11 targeted tests pass; signed-in setup selection and saved report follow-up verified, with no mobile overflow or runtime errors

## Product improvements — full set in stages
- [x] Stage 1: accurate privacy promises, secure GitHub tokens, deletion and retention controls, processing disclosure
- [x] Stage 2: input-aware reports, confidence explanations, stop/retry and reliable error states
- [x] Stage 3: updated home page, simpler setup, neutral charcoal/cyan theme and light mode
- [x] Stage 4: saved-work search/filter/rename and report downloads
- [x] Stage 5: local screenshot crop/redaction and recording moment selection
- [x] Stage 6: evidence-grounded follow-up questions, feature comparisons and suggested build briefs
- [x] Verification: 58 tests pass; signed-in redacted screenshot report, selected MP4 moment, stop/resume/retry, follow-up/brief/comparison persistence, search/rename/delete, retention preference readback, downloads and mobile layouts checked
- [x] Privacy: direct browser token access and unauthorized cleanup rejected; daily retention schedule configured
- [ ] Private GitHub connection verification — needs a real user token; encryption tested with non-secret fixtures

- [x] Visual investigations: screenshot uploads, recording frame extraction, browser-tab capture controls, evidence-backed feature reports; screenshot and WebM reports verified signed-in, 34 tests pass
- [x] MP4 recording upload: native/WASM decode, file recognition, regression tests; signed-in MP4 report verified with 3 frames
- [x] Permission-based browser capture: fresh tab chooser, capture status, stop/revoke cleanup, frame review/removal and approval; real tab capture produced a signed-in analysis report, 44 targeted tests pass

- [x] Report connections: active-filter highlights and per-connection inclusion reasons

- [x] Report graph: node-type and evidence-confidence filters, tests, signed-in verification

- [x] Scanner: Go, Rust, Java, Kotlin, C#, C/C++, Ruby, PHP, Swift + tests
- [x] Binary analyzer: magic bytes, strings, ELF/PE sections, imports + tests
- [x] Web analyzer: crawl pages, forms, scripts, endpoints, headers + tests
- [x] Runtime analyzer: safe read-only probing (GET/HEAD/OPTIONS)
- [x] Tools: per-target tool sets (toolsFor)
- [x] Agent: payload-based tool selection + per-target verification
- [x] Migration: user_secrets table (GitHub token); target_type already existed
- [x] Server fns: web/runtime/binary sources, token-aware GitHub fetch, token save/remove
- [x] UI: selectable target picker, per-type inputs, mode badges, dashboard token card
- [x] Tests pass (26), typecheck clean, build OK
- [x] E2E verified: web, binary, runtime investigations complete with reports
- [ ] Private GitHub repo flow — not tested (needs a real user token)
