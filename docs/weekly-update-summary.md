# Weekly Update Summary — 2026-11-08

## What Changed

**github-raw (direct fetch, verbatim):**
- `sdks/python/CHANGELOG.md` + `README.md` — Python SDK 2.4.0 → 2.6.0 (content changed)
- `sdks/typescript/CHANGELOG.md` + `README.md` — TypeScript SDK 1.4.0 → 1.6.0 (content changed)
- `claude-code/CHANGELOG.md` — v2.1.311 → 2.1.319 (content changed)
- `claude-code/README.md` — plugins-repo pointer updated (content changed)
- `skills/README.md`, `cookbooks/index.md` — wording + one new recipe (content changed)

**github-api:**
- `github-repos/index.md` — regenerated, 116 → **117** repos (new repo `FlashProve`; star counts refreshed)

**manual (re-synthesized from live docs):**
- `claude-code/hooks.md` — version-note rows (v2.1.314 / 304 / 295)
- `claude-code/mcp-servers.md` — MCP description-length limits, tool-behavior hints, output caps, managedMcpServers
- `agent-sdk/quickstart.md` — Node 18.14+; no-bundled-binary install cases
- `docs/best-practices-loop-scheduling.md` — `claude respawn` / `rm` / `daemon logs`
- 5 other manual docs re-checked and left honestly unchanged

**web-extracted release-notes (new dated entries):**
- `release-notes/platform.md`, `release-notes/api.md`, `release-notes/help-center.md` — Nov 2–6 entries

**New sources added (10):**
- research (8): early-progress-drug-development, investigating-vault-particles, how-researchers-use-claude, agents-judgment-calls, teaching-ai-to-build-scientific-models, provable-inference, components-of-agent-memory, project-eve-claude-plays-mmorpgs
- engineering (1): confidential-inference-trusted-vms (backfill of a Jun-2025 post, not new)
- news (1): s1-sec (Anthropic S-1 IPO filing)

**Infrastructure (meta-synthesis):**
- `scripts/validate.js` — new `local_path` path-containment guard
- `tasks/` logs updated (meta-synthesis-log, lessons, discovery-log)

Totals: 201 → **211** tracked sources; 211/211 hashes verified; `validate.js` passes with 0 errors.

## So What — Why It Matters

**No new model this cycle.** The SDK CHANGELOGs carry no `add support for claude-*` line, so the lineup is unchanged (Opus 5.5 / Fable 5.1 / Sonnet 5.5 / Haiku 5.5) and the model pages were correctly left untouched. npm (1.6.0) and PyPI (2.6.0) confirm the local SDK CHANGELOGs are current.

**The dominant SDK signal is structured API error handling.** Both SDKs added per-HTTP-status and per-API-code error classes, `error_code` / `details` / `api_message` fields, and new error type values — including `tool_use_limit_reached_error` and `compaction_limit_reached_error` session errors, plus new ramp-limit / External-Key-validation / CMEK codes. They also made response parsing thread-safe and now **reject injected path parameters** (`".;x"`, `"..;x"`), and shipped GA methods for analytics, spend limits, and RBAC. If you write code against the Anthropic SDK, you can now branch on typed error classes instead of string-matching messages.

**Claude Code: MCP tool calls can now run as background tasks.** v2.1.311–2.1.319 moves an MCP tool call that a server runs as a task into the background automatically (`CLAUDE_CODE_DISABLE_MCP_TASK_BACKGROUND` to opt out), adds `permissions.denyInsteadOfPrompting` (a would-be prompt is denied and the turn continues — useful for unattended/subagent runs), `/claude-api latency-optimize`, a `/tasks` "Earlier in this session" row to reopen finished subagents, plus server-side auto-mode safety behind gateways and many diff/auto-mode fixes.

**Platform/API deltas worth noting:** max request size raised 32 MB → 128 MB; message threads beta; Usage & Cost **Analytics** API beta (old Usage & Cost API now legacy); Claude Tag API GA for Enterprise; IP allowlisting beta; text watermarking on several models; **fast mode deprecated for Opus 4.8** (removal Nov 30); project tags / cost-code spend tracking; Personal Finance in Claude beta (Pro/Max/Ultra, US only).

**Early-November research cluster** (now mirrored): provable inference / FlashProve (verifiable attestation of model inference), a 207K-session study of how researchers use Claude, the first prokaryotic vault-particle structure, agent-memory "dreaming" consolidation, and how AI agents shape experts' judgment calls. **Corporate:** Anthropic filed an S-1 with the SEC for a proposed IPO (Nasdaq "ANT").

**Infrastructure hardened.** Meta-synthesis turned the SDKs' path-injection fix into a local defense: `validate.js` now blocks any `local_path` that is absolute or escapes the repo root — closing a fetch-and-write-outside-repo gap in the update pipeline.

## Action Items

- **No breaking changes to our workflows.** No model migration needed; the lineup is unchanged.
- **If/when we build against the Anthropic SDK:** adopt the new typed error classes (`error_code` / typed `*_error` values) rather than parsing message strings; note the 32 MB → 128 MB request-size increase.
- **Opus 4.8 fast mode is deprecated (removal Nov 30, 2026).** If any of our tooling relies on fast mode for Opus 4.8 specifically, plan for its removal.
- **Follow-up for a future run:** add an `alignment.anthropic.com` discovery pass — its November posts (multi-agent welfare, model-character red-teaming, the "A3" alignment agent, the Residency) are untracked, and that domain is flagged in MEMORY.md but not yet in the manifest. Confirmed-URL only; see `tasks/discovery-log.md`.
- **Known advisory (pre-existing):** `news/threat-intelligence-report-september-2026.md` still carries a truncation marker — a targeted re-fetch of its missing sections is a separate task.
