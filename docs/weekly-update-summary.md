# Weekly Update Summary — 2026-08-24

**Bottom line:** 29 files modified across all source types. The headline: **Python SDK 1.0.0 is a breaking release** (httpx2, Python 3.10+). Also: Extended Thinking now shows a deprecation banner, Files/Skills/Admin APIs are GA, browser use tool launched, and Claude Code gained Dynamic Workflows + Background Agents.

## What Changed

### SDK Changes (BREAKING)
- `sdks/python/CHANGELOG.md` — **Python SDK 1.0.0 released** (Aug 20): breaking upgrade to httpx2, Python 3.10+ now required
- `sdks/python/README.md` — Model example updated to `claude-opus-5`, Python 3.10+ requirement, added v1 migration guide link
- `sdks/python/CHANGELOG.md` — Also added versions 0.123.0, 0.124.0, 0.125.0 leading up to v1.0
- `sdks/typescript/CHANGELOG.md` — 3 new versions: 0.118.0, 0.119.0, 0.120.0

### Claude Code (8 new versions: 2.1.234–2.1.241)
- `claude-code/CHANGELOG.md` — 8 new releases
- `claude-code/features.md` — Added Dynamic Workflows, Cross-Session Messaging, Background Agents, Safe Mode, `manual` permission mode, `/doctor`, `/context`, `/add-dir` commands, Self-Hosted Runner support
- `claude-code/hooks.md` — Added `continueAgentic` field, HTTP Hook Allowlists, Path Placeholders, expanded decision control fields, plugin MCP scoped naming, debugging section, new hook patterns
- `claude-code/mcp-servers.md` — Added `roots/list` request support (v2.1.203+)
- `claude-code/plugins.md` — Added `monitors/` directory to plugin structure

### API Documentation
- `api/overview.md` — Files API and Skills API moved from Beta to GA; Workbench renamed to Playground
- `api/errors.md` — Expanded error details for 400, 403, 404, 429, 500, 504 codes
- `api/streaming.md` — Model references updated from `claude-opus-4-8` to `claude-opus-5`
- `api/tool-use.md` — Added browser use tool; updated tool token overhead table with retired models
- `api/extended-thinking.md` — Added deprecation notice banner; migration guidance
- `api/effort-parameter.md` — Added Compatibility section; `xhigh` availability note; examples updated to `claude-opus-5`

### Platform & Release Notes
- `release-notes/platform.md` — 3 new entries (Aug 18–20): Python SDK v1.0, computer use out of beta, browser use tool, Files API GA, Skills API GA, Workbench → Playground

### Models
- `models/deprecations.md` — Python SDK v1.0 `TypeError` note

### Agent SDK
- `agent-sdk/README.md` — Dynamic workflows, cross-session messaging; expanded comparison table

### Best Practices
- `docs/best-practices-loop-scheduling.md` — 15+ new CLI flags; `--effort` now includes `ultracode`; `claude respawn` and `claude rm` commands

### GitHub Repos
- `github-repos/index.md` — Full refresh with new repos (oncall-kit, claude-plugins-community, OpenROAD-flow-scripts)

### Research
- `research/papers/index.md` — New paper: "Mind Viruses: Self-Propagating Ideas in Multi-Agent LLM Systems" (arXiv 2608.10218)

## So What — Why It Matters

### 🔴 Python SDK 1.0.0 — Breaking Change
Breaking upgrade to httpx2, Python 3.10+ required. Any project using `anthropic` < 1.0 needs migration. The v1 migration guide is linked from the README.

### 🟡 Extended Thinking Deprecation
Deprecation banner now live. Migrate to adaptive thinking / effort parameter.

### 🟡 APIs Moving to GA
Files API, Skills API, Admin API user management, browser use, and computer use are all GA. Drop beta headers.

### 🟢 Claude Code Dynamic Workflows + Background Agents
Major new automation capabilities. `continueAgentic` hook field enables sophisticated automation patterns.

### 🟢 Workbench → Playground
Rename in any docs or workflows referencing the old name.

## Action Items
1. **[URGENT] Review Python SDK 1.0 migration** — Breaking change affecting httpx2 and Python 3.10+ requirement
2. **Plan extended thinking migration** — Deprecation notice is live
3. **Drop beta headers** for Files API, Skills API, Admin API user management, computer use, browser use
4. **Update Workbench references** → Playground
5. **[INFO] 28 new untracked sources discovered** — 3 HIGH priority post-Aug-16
6. **[INFO] `agent-sdk-typescript-v2` still dead** — 141 days stale, recommend removal
