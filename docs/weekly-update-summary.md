---
title: "Weekly Update Summary"
fetched_at: "2026-09-07T00:00:00Z"
category: "docs"
---

# Weekly Update Summary — 2026-09-07

**High-signal week: 63 files updated, ~30 with real content changes. The API docs saw a near-complete rewrite (9-language examples, GA promotions, deprecated features). Extended Thinking is deprecated in favor of Steering Thinking. Sonnet 5 price increase cancelled.**

## What Changed

### API Documentation (15 files — all content changed)
- **api/overview.md** — Files API & Skills API moved from beta to **GA**; auth restructured (Authorization header now primary, x-api-key is legacy); `anthropic-workspace-id` header added; Workbench→Playground rename
- **api/tool-use.md** — **Complete rewrite** with 9-language code examples; Browser Use tool added; MCP connector listed as server tool
- **api/streaming.md** — Major expansion with all SDK languages; streaming with web search and thinking; `display: "updates"` beta
- **api/adaptive-thinking.md** — **Renamed to "Steering Thinking"**; restructured with effort levels, per-message steering, pricing comparison
- **api/extended-thinking.md** — **Marked deprecated**; rewritten as legacy mode docs with migration guide to Steering Thinking
- **api/messages-api.md** — Fable 5.1, Mythos 5.1, Sonnet 5 added; `temperature`/`top_p`/`top_k` deprecated for recent models
- **api/models-overview.md** — Unified comparison table with retirement dates, platform IDs, Models API section
- **api/migration-guide.md** — Now a hub page linking 5 per-model migration guides
- **api/errors.md** — New validation errors for Fable/Mythos 5.1; spend limit details
- **api/vision.md** — Files API image example; Image Quality Guidance section
- **api/compaction.md** — Fable 5.1, Mythos 5.1, Opus 5 added; Token Counting + Cache Hits sections
- **api/context-windows.md** — New models in 1M list; task budgets for Opus 4.7+
- **api/effort-parameter.md** — Per-message effort beta; Fable 5.1/Mythos 5.1 support; 9 languages
- **api/memory-tool.md** — 9-language examples; model updated to Opus 5
- **api/web-search-tool.md** — 9-language examples; Managed Agents domain settings; Foundry distinction

### Models (13 files — 7 content changed)
- **models/claude-sonnet-5.md** — **Pricing permanently locked at $2/$10** (scheduled increase to $3/$15 cancelled); prompt injection resistance; agentic capabilities
- **models/claude-opus-5.md** — Claude Cowork availability; new Safety & Alignment section
- **models/claude-fable-5-1-mythos-5-1.md** — New benchmarks: GDPval-AA v2 (1853), HLE (60.9%/65.0%), Terminal-Bench 4.0; EFS rollout
- **models/claude-fable-5-mythos-5.md** — Knowledge Work, genomics research, safety architecture (zero compliance across 30 jailbreak techniques)
- **models/overview.md** — Table restructured with AWS IDs, retirement dates, footnotes
- **models/deprecations.md** — Reordered; Mythos Preview migration note
- 6 older model pages: timestamp-only

### Release Notes (3 files — all content changed)
- **release-notes/platform.md** — 15+ new entries (Aug 11–Sep 3): Fable 5.1/Mythos 5.1, ant CLI 1.30.0 (`ant apply`), Python SDK v1.0, Files/Skills/Computer Use/Browser Use GA, Playground rename, Compliance API, inference hooks, per-message effort beta
- **release-notes/api.md** — 7 new entries (Aug 18–Sep 3)
- **release-notes/help-center.md** — September 2026 section

### Claude Code (7 files — 4 content changed)
- **claude-code/mcp-servers.md** — MCP v2 runtime (default v2.1.232+), server status indicators, configuration warnings, org controls, `requiresUserInteraction`, tool input schema handling, auto-backgrounding
- **claude-code/features.md** — Dynamic Workflows, Cross-session Messaging
- **claude-code/hooks.md** — Agent type example updated
- **engineering/claude-code-best-practices.md** — `/verify`, `/doctor`, `/btw`, auto mode default, `/batch` fan-out, parallel sessions, skill/subagent YAML, CLAUDE.md guidance

### Agent SDK & Best Practices (5 files — all content changed)
- **agent-sdk/quickstart.md** — ARM64 Windows; simplified Permission Modes; streaming note
- **agent-sdk/examples.md** — Restructured to routing page (demo repos instead of inline code)
- **agent-sdk/README.md** — URL fix; new links
- **docs/best-practices-loop-scheduling.md** — Verification gates (`/verify`), `/batch` fan-out, Agent View/Teams
- **docs/best-practices-mcp-credentials.md** — `requiresUserInteraction`, MCP output limits, timeout reference, org controls, auto-backgrounding

### Research & GitHub (7 files — 3 content changed)
- **research/papers/index.md** — New paper: 2608.28945 "Automated Researchers Can Mitigate Alignment Failures" (Aug 28)
- **research/ai-fluency-index.md** — Enriched with prevalence data table, iteration correlation
- **github-repos/index.md** — Star counts updated (skills 175k, claude-code 144k, fermats-last-theorem 900)
- **skills/catalog.md** — Stars 166k→175k

### SDKs (5 files — timestamp only)
- SDK READMEs and CHANGELOGs confirmed current (npm 0.124.0, PyPI 1.4.0)

### Discovery: 9 New Sources Found
- 2 HIGH: Anthropic Economic Index connector, Anthropic Institute agenda
- 5 MEDIUM: Tino Cuéllar hire, Public Record, Economic Futures Fund, Google/Broadcom compute, Economic Index reports
- Being auto-added this run per unattended policy

---

## So What — Why It Matters

### 🔴 Breaking / Action Required
- **Extended Thinking is deprecated.** The manual `type: "enabled"` with `budget_tokens` approach is now legacy. Migrate to "Steering Thinking" (renamed from Adaptive Thinking) which uses effort levels. Updated docs include before/after migration examples.
- **API auth changing.** `x-api-key` header is now legacy fallback; `Authorization: Bearer` is the primary method.
- **`temperature`/`top_p`/`top_k` deprecated** for recent models in the Messages API.

### 🟡 Important Updates
- **Sonnet 5 pricing locked at $2/$10 permanently.** The previously announced increase to $3/$15 will not happen.
- **Files API, Skills API, Agent Skills, Computer Use, Browser Use — all GA.** Production-ready, no longer beta.
- **MCP v2 runtime is now default** (v2.1.232+). Check compatibility with custom MCP servers.
- **Workbench renamed to Playground** across the entire platform.
- **Per-message effort beta** — change thinking effort mid-conversation.
- **ant CLI 1.30.0** ships `ant apply`.

### 🟢 New Capabilities
- **9-language code examples** across API docs (C#, Go, Java, PHP, Ruby added).
- **Claude Code commands:** `/verify`, `/doctor`, `/btw`, `/batch`. Auto mode now default on Pro/Max/Team.
- **Dynamic Workflows** and **Cross-session Messaging** in Claude Code.
- **Browser Use tool** now in API tool use.
- **Fable 5.1/Mythos 5.1 benchmarks**: GDPval-AA v2 (1853), HLE (60.9%/65.0%).
- **Opus 5**: Claude Cowork, Safety & Alignment improvements.
- **New arXiv paper**: Automated Researchers for alignment failure mitigation (2608.28945).

---

## Action Items
- [ ] **Migrate Extended Thinking → Steering Thinking** — update code using `type: "enabled"` with `budget_tokens` to effort levels
- [ ] **Update API auth** — switch from `x-api-key` to `Authorization: Bearer`
- [ ] **Test MCP v2 runtime** if using custom MCP servers (now default)
- [ ] **Update Sonnet 5 cost projections** — price stays at $2/$10
- [ ] **Adopt GA APIs** — Files, Skills, Computer Use, Browser Use are production-ready
- [ ] **Housekeeping:** remove `agent-sdk-typescript-v2` (404 for ~8 cycles). Needs user confirmation.
- [ ] **Deferred:** Fable 5.1/Mythos 5.1 System Card PDF not yet ingested

_Validation: 0 errors, 59 advisory staleness warnings (frozen article snapshots intentionally not re-fetched). 148 SHA-256 hashes verified._
