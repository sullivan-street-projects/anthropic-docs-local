# Weekly Update Summary — 2026-09-13

## What Changed

**SDK / CLI changelogs (content):**

- `claude-code/CHANGELOG.md` — up to **v2.1.270**
- `sdks/python/CHANGELOG.md` — **v1.5.0** (2026-09-10)
- `sdks/typescript/CHANGELOG.md` — **v0.125.0** (2026-09-10)

**Claude Code docs (manual, content):**

- `claude-code/features.md` — added Dynamic Workflows, Cross-Session Messaging
- `claude-code/hooks.md` — added `cloud_credential_error` StopFailure matcher (v2.1.267), `scratchpad_dir` input (v2.1.257)
- `claude-code/plugins.md` — documented `claude plugin eval`, "Load a Folder of Plugins"

**Platform / API (web-extracted, content):**

- `release-notes/platform.md`, `release-notes/api.md`, `release-notes/help-center.md` — new entries through Sep 10
- `api/overview.md` — pagination/cursor-scheme clarifications

**Index (github-api):**

- `github-repos/index.md` — **109 repos** (was 106); refreshed star counts

**New sources auto-added (discovery, first-party):**

- `news/threat-intelligence-report-september-2026.md` — Detecting and Countering Misuse of AI: September 2026
- `research/alignment-assessment-cybersecurity-incidents.md` — Sep 9
- `research/intelligence-targeting-conventional-weapons-capabilities.md` — Sep 10 (Frontier Red Team)
- `news/tino-cuellar.md` — Chief Global Affairs Officer hire (Aug 4)

**Verified unchanged (no false timestamp bump):** `models/overview.md`, `api/models-overview.md`, `models/deprecations.md`, `sdks/other/overview.md`, `claude-code/mcp-servers.md`, `agent-sdk/README.md`, `agent-sdk/quickstart.md`, all SDK/skills/cookbooks READMEs, `research/papers/index.md` (no new Anthropic-authored arXiv papers).

## So What — Why It Matters

- **Claude Code 2.1.270 adds real, usable features.** `claude plugin eval` gives scored, reproducible plugin eval suites (JSON+HTML); `/output-style [name]` switches output styles (works headless/Remote Control); `CLAUDE_CODE_WORKFLOW_MAX_CONCURRENT_AGENTS` (1–256) raises the Workflow fan-out limit for inference-bound work; `/focus` gives a minimal prompt+summary view. Many prompt-cache-reuse and permission-rule fixes landed too.
- **SDK 1.5.0 / 0.125.0 track new API surface.** Auto-mode tool permissions for Managed Agents (server evaluates each tool call → run/deny/pause), a `content_too_large` web_fetch error code, a `user-profiles-2026-09-04` beta, and mounting public GitHub repos without an auth token in Managed Agents sessions. Python also hardened credentials handling (refuses credentials files readable by group/others).
- **Managed Agents matured on the platform.** The `auto` permission policy and `ant beta:sessions connect` (attach a terminal to a live session; `--web` serves the Console viewer) plus `ant apply` + `claude-lock.json` (declarative, idempotent resource management) are the notable platform additions. **Personal keys and service-account keys** are now creatable in the Console; the **Admin API** is now in the `ant` CLI and all SDKs.
- **No model or pricing changes this week.** The current lineup (Fable 5.1, Opus 5, Sonnet 5, Haiku 4.5) and all deprecation dates were already current; those pages were left untouched. Fable/Mythos 5.1 (Sep 1) was already tracked.
- **Two notable safety/security research posts.** The alignment assessment of recent cybersecurity incidents (naming "biased reasoning" and "recklessness" failure modes) and the Frontier Red Team's intelligence-targeting/conventional-weapons capability evals.

## Action Items

- **No breaking changes affecting our workflows.** The SDK bumps are additive; nothing forces a migration.
- **`CLAUDE_CODE_WORKFLOW_MAX_CONCURRENT_AGENTS`** is worth knowing for any future Workflow-tool fan-outs in our repos (raises the per-run concurrent-agent cap).
- **Console key model change** — personal keys and service-account keys now exist and stop working when the linked account leaves the org; relevant if any SSP automation uses workspace API keys (still supported as legacy).
- **One data-quality flag (self-inflicted, tracked):** the September threat-intelligence report was truncated by WebFetch and is stored partial with a truncation note; `validate.js` now flags it for a targeted re-fetch of the Surveillance/later sections.
- **Overdue cleanup (needs your OK):** `agent-sdk-typescript-v2` (`github.com/anthropics/agent-sdk`) has been 404 for ~9 cycles (161 days). Remove the manifest entry + `agent-sdk/typescript-v2-preview.md`, or repoint to `code.claude.com/docs/en/agent-sdk/*`.
