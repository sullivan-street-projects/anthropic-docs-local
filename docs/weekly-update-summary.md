# Weekly Update Summary — 2026-09-20

## What Changed

**Changelogs (github-raw, verbatim)**

- `claude-code/CHANGELOG.md` — new content: v2.1.271 → v2.1.278
- `sdks/python/CHANGELOG.md` — new content: v1.6.0, v1.7.0
- `sdks/typescript/CHANGELOG.md` — new content: v0.126.0, v0.127.0

**Release notes (web-extracted)**

- `release-notes/api.md`, `release-notes/platform.md` — added Sep 14 (on-demand compaction) and Sep 18 (Claude in Chrome compliance transcripts)
- `release-notes/help-center.md` — added Sep 15 (Salesforce in Claude, beta)

**Indexes**

- `github-repos/index.md` — regenerated, 109 → 111 repos, refreshed star counts
- `research/index.md` — added 2 new research entries

**New sources added (4, all first-party anthropic.com — auto-added per unattended-run policy)**

- `research/claude-uplifts-biomolecular-modeling.md` (Sep 17) — new content
- `news/life-sciences-verification-program.md` (Sep 17) — new content
- `news/accenture-embedded-evaluation.md` (Sep 18) — new content
- `research/measuring-pace-of-ai-development.md` (Aug 2026) — new content

**Verified-current, timestamp only** (fetched and checked against live today, no material drift): 9 manual docs (`claude-code/{features,hooks,mcp-servers,plugins}.md`, `agent-sdk/{README,quickstart,examples}.md`, `docs/best-practices-*.md`), `models/overview.md`, `models/deprecations.md`.

**Infrastructure (meta-synthesis)**

- `scripts/validate.js` — now integrity-checks every hashed source, including the 2 PDFs (was `.md`-only). 165/165 hashes verified.

## So What — Why It Matters

**On-demand conversation compaction is now a first-class API feature.** The Messages API added a `compact-2026-09-04` beta header and a `compaction` parameter that summarizes prior turns into signed compaction blocks; both SDKs added a tool-runner method for it (`compact_before_next_turn()` / `compactBeforeNextTurn()`). For any long-running agent we build on the API, this is the sanctioned way to control context growth and token cost instead of hand-rolling summarization — worth adopting where we run multi-turn agents.

**Claude Code now reads `AGENTS.md` as a fallback when no `CLAUDE.md` exists** (v2.1.277). No action for this repo (it has `CLAUDE.md`, which takes precedence), but relevant for repos that use the `AGENTS.md` convention.

**The `TaskOutput` tool was removed** (v2.1.278); background-task output is now read with the `Read` tool, and `taskOutputMaxChars` / `TASK_MAX_OUTPUT_LENGTH` no longer have any effect. Only matters if a script or agent depended on `TaskOutput`.

**Rate-limit API: `group_type` is deprecated** in favor of a `group` object with `display_name` (Python 1.7.0 / TS 0.127.0). Cosmetic for us; note it if we ever parse rate-limit responses.

**Model lineup and deprecations unchanged this week.** Current lineup stays Fable 5.1 / Opus 5 / Sonnet 5 / Haiku 4.5 at the same pricing; no new models, no new deprecations. Opus 4.1 remains retired (since Aug 5).

**New product/program launches:** Life Sciences Verification Program (biology research access with tailored safeguards, public beta), Salesforce in Claude (beta, 37 sales skills), and an Accenture embedded-evaluation partnership ($1B+ over five years).

## Action Items

- **No breaking changes affect our current workflows.** The Python SDK still requires 3.10+ (unchanged); `temperature`/`top_p`/`top_k` remain removed in Python SDK ≥1.0 and error on Claude 4.7+ models — already known.
- **Consider adopting the compaction API** for any long-horizon agent work built on the Messages API or the tool runner.
- **Pending (deferred):** `news/threat-intelligence-report-september-2026.md` still carries a truncation marker from the Sep 13 fetch; a targeted section-by-section re-fetch would clear the standing validate.js warning.
- **Pending (user action):** the dead `agent-sdk-typescript-v2` source (`github.com/anthropics/agent-sdk`, 404 for ~10 cycles) should be removed from the manifest or repointed to the live `code.claude.com/docs/en/agent-sdk/*` docs (already tracked via the manual agent-sdk sources).
