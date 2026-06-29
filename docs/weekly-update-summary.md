---
title: "Weekly Update Summary"
date: "2026-06-28"
---

# Weekly Update Summary — 2026-06-28

## What Changed

44 files updated across 7 categories, +6,172 lines / -1,258 lines.

### API Documentation (15 files — all had substantial content changes)
- `api/overview.md` — Added Claude Managed Agents, Bearer token auth, Sessions/Agents/Environments APIs, renamed "Cloud Platform APIs"
- `api/messages-api.md` — New models (Fable 5, Mythos 5, Opus 4.8, 4.7), `stop_details` with refusal categories, `xhigh` effort, `display` for thinking, `web_fetch_20260309`
- `api/tool-use.md` — Restructured as conceptual overview, added Advisor/Tool Search/Memory tools, updated token overhead table with Opus 4.8/4.7
- `api/vision.md` — Files API as image source, high-res tier (2576px, Fable 5/Mythos/Opus 4.8/4.7), 28x28 pixel patch token calc, 10MB limit
- `api/streaming.md` — C#/Go/Java/PHP/Ruby SDK examples, `ant` CLI examples, split error recovery by model generation
- `api/errors.md` — New 402 `billing_error` and 504 `timeout_error`, Claude Platform on AWS auth notes, SDK error type links
- `api/migration-guide.md` — Expanded from 1 to 7 migration paths (Mythos Preview→5, Opus 4.8→Fable 5, 4.6→4.7, 4.5→4.7, 4.1→4.7, Sonnet 4.5→4.6)
- `api/extended-thinking.md` — Fable 5/Mythos 5/Opus 4.8/4.7 support, `display: "summarized"/"omitted"`, streaming thinking examples
- `api/effort-parameter.md` — `xhigh` effort level, per-model guidance sections, ultracode mode note
- `api/memory-tool.md` — Complete tool command specs (view/create/str_replace/insert/delete/rename), SDK helpers for 6 languages
- `api/web-search-tool.md` — `web_search_20260318` with `response_inclusion`, dynamic filtering, `pause_turn` stop reason, batch API
- `api/adaptive-thinking.md` — 5 new model entries, `xhigh` effort, streaming section, thinking encryption, per-message steering
- `api/compaction.md` — Complete rewrite with `context_management.edits`, `pause_after_compaction`, streaming, prompt caching integration
- `api/context-windows.md` — Fable 5/Mythos 5/Opus 4.8/4.7 windows, 1M GA, overflow behavior, tool context management
- `api/models-overview.md` — Fable 5 and Mythos 5 ($10/$50, 1M context, 128K output), Opus 4.8 recommended, Opus 4.1 deprecated (Aug 5, 2026)

### Claude Code (4 files)
- `claude-code/CHANGELOG.md` — **+1,865 lines** of new releases since April (versions through 2.1.195+)
- `claude-code/README.md` — Timestamp refresh
- `claude-code/features.md` — Updated feature descriptions
- `claude-code/hooks.md` — Updated hook event documentation

### SDK Documentation (6 files)
- `sdks/python/CHANGELOG.md` — **+398 lines** through v0.113.0
- `sdks/typescript/CHANGELOG.md` — **+430 lines** through v0.107.0
- `sdks/typescript/README.md` — Requirements updated: TS >= 4.9, Node.js 20 LTS, Deno, Bun, Cloudflare Workers
- `sdks/python/README.md` — Timestamp refresh

### Agent SDK (3 files)
- `agent-sdk/README.md` — Managed Agents comparison, Monitor tool, Claude Platform on AWS, `plan` permission mode
- `agent-sdk/quickstart.md` — Windows PowerShell instructions, `.env` note, `uv run` recommended, TypeScript setup split
- `agent-sdk/examples.md` — Session resumption API updated, Managed Agents reference

### Best Practices (2 files)
- `docs/best-practices-mcp-credentials.md` — OAuth CLI (`claude mcp login`), `headersHelper`, WebSocket transport, 5-level scope hierarchy, claude.ai connectors, idle timeout
- `docs/best-practices-loop-scheduling.md` — Background Agents section, ~20 new CLI flags, `xhigh` effort

### Research (8 files)
- Updated content across: alignment, AI fluency index, measuring agent autonomy, India economic index, AI assistance coding skills, disempowerment patterns, assistant axis, project vend 2, deprecation updates opus 3, persona selection model

### Skills (2 files)
- `skills/README.md` — Added skills.sh badge
- `skills/catalog.md` — Updated catalog listings

## So What — Why It Matters

### New Model Family: Fable 5 and Mythos 5
Anthropic launched two new top-tier model families since our last update. Fable 5 and Mythos 5 are priced at $10/$50 per MTok with 1M context and 128K output. The migration guide now covers 7 upgrade paths. **Opus 4.1 is deprecated and retiring August 5, 2026.**

### API Capabilities Expanded Significantly
- **`xhigh` effort level** is new between `high` and `max` — relevant for coding agents
- **Memory tool** went from overview to full command reference with 6-language SDK support
- **Compaction API** was completely rewritten with new `context_management.edits` format
- **Bearer token auth** via Workload Identity Federation — alternative to `x-api-key`
- **Managed Agents** — new hosted REST API where Anthropic runs the agent loop and sandbox

### Claude Code Massive Update
+1,865 lines of CHANGELOG entries represent ~3 months of rapid development. Key additions include Background Agents (`--bg`), the `plan` permission mode, ~20 new CLI flags, and the `xhigh` effort level for ultracode mode.

### SDK Breaking Changes Watch
- TypeScript SDK now requires TS >= 4.9 and Node.js 20 LTS (was Node 18+)
- Opus 4.7+ tokenizer produces ~30% more tokens — affects cost estimates

### MCP Credential Management Overhaul
New OAuth CLI commands, `headersHelper` for dynamic headers, WebSocket transport support, and a 5-level scope hierarchy. The `claude mcp login` command enables headless/SSH authentication.

## Action Items

- [ ] **URGENT:** Claude Opus 4.1 retiring August 5, 2026 — verify no projects depend on it
- [ ] Review the 7 new migration paths in `api/migration-guide.md` for any active integrations
- [ ] Update any hardcoded model IDs — Opus 4.8 is now recommended over 4.6
- [ ] Test `xhigh` effort level for coding agent workloads
- [ ] Investigate Managed Agents API for potential use cases
- [ ] ~60 sources not updated this cycle due to rate limits (news, engineering, most models, github-repos). Run a follow-up update to catch these.
- [x] 17 unmerged remote branches — merged to master, cleanup pending user approval for remote deletion
- [x] 13 new sources recovered from unmerged branch (Fable 5, Opus 4.7/4.8, Claude Corps, Claude Tag, Series H, 5 research papers)
- [x] Scheduled task updated: Phase 4 meta-synthesis now runs every cycle, auto-merge to master after each run

## Incomplete Sources (Rate Limited)

The following source types were NOT updated due to hitting the weekly API rate limit mid-run:
- **News** (13 sources) — all news articles
- **Engineering** (17 sources) — all engineering blog posts  
- **Models** (7 sources) — individual model announcement pages
- **GitHub Repos** (1 source) — repo index
- **Release Notes** (3 sources) — platform, API, help center
- **Discovery scan** — not completed

These will be caught in the next weekly update cycle.
