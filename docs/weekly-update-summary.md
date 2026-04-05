---
title: "Weekly Update Summary"
date: "2026-04-05"
---

# Weekly Update Summary — 2026-04-05

## What Changed

### Claude Code (claude-code/)
- **CHANGELOG.md**: +305 lines covering versions 2.1.88–2.1.92
- **features.md**: Added `auto` permission mode, Channels (research preview), Bare Mode (`--bare`), Teleport (`--teleport`), `/plugin` command
- **hooks.md**: 5 new hook events (`PermissionDenied`, `TaskCreated`, `CwdChanged`, `FileChanged`, `resume` matcher for SessionEnd), new `if` field for conditional filtering, `shell` field, `defer` permission decision, `${CLAUDE_PLUGIN_DATA}` env var. Event count 22→27.
- **plugins.md**: New `bin/` directory — plugins can bundle executables added to Bash PATH
- **mcp-servers.md**: Cleaned up duplicate sections (OAuth Metadata Discovery, MCP Elicitation)

### SDKs (sdks/)
- **Python CHANGELOG.md**: +63 lines (versions 0.86.0–0.89.0)
- **TypeScript CHANGELOG.md**: +62 lines (versions 0.79.0–0.83.0)

### Agent SDK (agent-sdk/)
- **README.md** & **quickstart.md**: Added `auto` permission mode documentation

### Release Notes (release-notes/)
- **Platform**: 3 new entries — 300k max_tokens on Batches API (Opus 4.6/Sonnet 4.6), Models API capability fields, `display` field for extended thinking
- **Help Center**: 3 new entries — interactive apps on iOS/Android, computer use in Cowork, phone control for Cowork
- **API**: Same 3 platform entries + corrected Haiku 3 retirement date (April 19→20)

### API (api/)
- **context-windows.md**: Added April 30, 2026 retirement date for 1M beta on Sonnet 4.5/4

### GitHub Repos (github-repos/)
- **index.md**: 77→78 repos (new: `claude-plugins-community`). Major star surges: claude-code 81K→109K (+34%), skills 99K→111K, cookbooks 35K→37K

### Skills (skills/)
- **catalog.md**: Stars 70.5K→111K (+57%), forks 7.2K→12.5K

### Best Practices (docs/)
- **best-practices-loop-scheduling.md**: Added `auto` permission mode, 3 new CLI flags (`--bare`, `--no-session-persistence`, `--json-schema`)

## So What — Why It Matters

### Auto Permission Mode (HIGH IMPACT)
A new `auto` permission mode uses a model-based classifier to approve/deny tool calls autonomously. Requires Team, Enterprise, or API plan + Sonnet 4.6 or Opus 4.6. This is the biggest workflow change — it enables fully autonomous agent runs without `--dangerously-skip-permissions`. Documented across features, Agent SDK, and CLI docs.

### 5 New Hook Events (HIGH IMPACT)
- `PermissionDenied`: Fires on auto-mode classifier denials — return `{retry: true}` to let the model retry
- `TaskCreated`: Fires when tasks are created, supports blocking
- `CwdChanged`/`FileChanged`: Enable reactive environment management (e.g., auto-load `.envrc` on directory change)
- `resume` matcher for `SessionEnd`: Detect session resume vs. clear
- New `if` field for conditional hook filtering using permission rule syntax
- New `defer` permission decision for headless sessions

### 1M Context Window Beta Retiring (ACTION NEEDED)
The 1M token beta for Sonnet 4.5 and Sonnet 4 retires **April 30, 2026**. After that, `context-1m-2025-08-07` beta header has no effect. Migrate to Sonnet 4.6 or Opus 4.6 for 1M context (available at standard pricing, no header needed).

### 300k max_tokens on Batches API
Opus 4.6 and Sonnet 4.6 can now generate up to 300k tokens in batch mode. Include `output-300k-2026-03-24` beta header.

### Models API Capability Discovery
`GET /v1/models` and `GET /v1/models/{model_id}` now return `max_input_tokens`, `max_tokens`, and a `capabilities` object. Useful for dynamic model selection in agents.

### Extended Thinking Display Control
New `thinking.display: "omitted"` option lets you skip thinking content in responses for faster streaming while preserving the signature for multi-turn continuity.

### Plugin Executables (`bin/` directory)
Plugins can now ship executables that get added to Bash PATH. Enables richer plugin ecosystems.

### Computer Use in Cowork
Research preview — Pro/Max users can grant Claude computer access (open files, run dev tools, point-and-click navigation).

### claude-code Starcount Surge
81K→109K stars in 2 weeks (+34%). Skills repo also surged 99K→111K. Indicates rapidly growing adoption.

## Action Items

- **April 30 deadline**: Review any code using `context-1m-2025-08-07` beta header with Sonnet 4.5/4 and migrate to Sonnet 4.6 or Opus 4.6
- **Auto mode evaluation**: Test `auto` permission mode for agent workflows — could replace `--dangerously-skip-permissions` in production
- **New hook events**: `CwdChanged` and `FileChanged` could improve reactive development workflows
- **61 new sources discovered**: Run `/update-anthropic-docs --discover` to review and add — includes official Claude Code best practices guide, alignment faking research, emotion concepts paper, and 9 alignment blog posts
- **Staleness**: `agent-sdk-typescript-v2-preview` has been 404 for 3 consecutive cycles — recommend removing from manifest
- **PDF staleness**: 2 resources.anthropic.com PDFs returning 404 — check if moved to new URLs

## Discovery Highlights (61 new sources found)

Top recommendations for next add:
1. `engineering/claude-code-best-practices` — Official agentic coding best practices (HIGH, deferred 2 cycles)
2. `engineering/claude-code-auto-mode` — Auto mode documentation (HIGH)
3. `engineering/harness-design-long-running-apps` — Multi-agent harness design (HIGH)
4. `research/reasoning-models-dont-say-think` — CoT faithfulness research (HIGH)
5. `research/emotion-concepts-function` — 171 emotion concepts in LLMs (HIGH)
6. 9 alignment blog posts at alignment.anthropic.com (MEDIUM-HIGH)
7. 3 red team blog posts at red.anthropic.com (MEDIUM-HIGH)
