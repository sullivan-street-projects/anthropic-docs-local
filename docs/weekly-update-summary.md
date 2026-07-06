---
title: "Weekly Update Summary"
date: "2026-07-06"
---

# Weekly Update Summary — 2026-07-06

## What Changed

### Claude Code (7 files)
- **CHANGELOG.md** — 6 new releases (v2.1.196–v2.1.201): Sonnet 5 as default model, background agent improvements, Chrome GA, permission mode renamed from "auto" to "trusted", many bug fixes
- **scheduled-tasks.md** — Major rewrite: new scheduling comparison table (Cloud/Desktop/loop), dynamic intervals (Claude picks 1m–1h), 7-day expiry (was 3), jitter up to 30min (was 15), skill invocation support, Routines/Channels references
- **mcp-servers.md** — Two new features: root-level JSON Schema combinator handling for tool input schemas, `requiresUserInteraction` annotation for MCP tools
- **features.md, hooks.md, plugins.md, context-engineering.md** — Timestamp refreshes

### SDKs (5 files)
- **Python CHANGELOG** — v0.114.0–v0.116.0: `claude-sonnet-5` model alias, Managed Agents event delta streaming, agent-memory beta header
- **TypeScript CHANGELOG** — v0.108.0–v0.110.0: same features as Python SDK
- **Python README** — Minor whitespace changes
- **SDKs overview** — Restructured to "CLI, SDKs, and Libraries": added `ant` CLI section, Apple Foundation Models library, OpenAI SDK compatibility layer, Claude Platform on AWS

### Models (5 files)
- **overview.md** — Complete restructure. Flagship models now: **Fable 5, Opus 4.8, Sonnet 5, Haiku 4.5**. Legacy table now includes Opus 4.7. Opus 4.6/Sonnet 4.6 moved to legacy.
- **deprecations.md** — Opus 4.1 deprecated (Jun 5). Sonnet 4/Opus 4 retired (Jun 15). Haiku 3 retired (Apr 20). New API parameter deprecations section.
- **claude-opus-4-6.md** — Context window changed from "200K (1M beta)" to **"1M (GA)"**
- **claude-opus-4-5.md, claude-sonnet-4-6.md** — Timestamp refreshes

### Release Notes (3 files)
- **platform.md** — 37 new entries (Apr–Jul 2026): Fable 5, Mythos 5, Opus 4.8, Opus 4.7, Sonnet 5, Managed Agents, ant CLI, Claude Platform on AWS, advisor tool, WIF GA, cache diagnostics
- **help-center.md** — 16 new entries: Fable 5, Opus 4.8/4.7, Sonnet 5, Claude Design, Cowork GA, Trusted Devices, Claude Tag for Slack
- **api.md** — 37 new entries matching platform release notes

### Agent SDK (3 files)
- **README.md, quickstart.md** — Provider naming updates: "Google Vertex AI" → "Google Cloud's Agent Platform", updated Foundry link text
- **examples.md** — Timestamp refresh

### GitHub Repos (1 file)
- **index.md** — Major refresh: total repos 78→70 (some removed/renamed). Star count growth: skills 110K→158K, claude-code 109K→136K. 13 new repos including `financial-services` (33K stars), `claude-for-legal` (8.6K), `defending-code-reference-harness` (6.3K), `ClaudeForFoundationModels`, `launch-your-agent`

### Research (2 files)
- **papers/index.md** — 1 new paper: "How AI Impacts Skill Formation" (arXiv:2601.20245)
- **opendev-coding-agents.md** — Timestamp refresh

### Engineering (2 files)
- **effective-context-engineering.md, effective-harnesses-for-long-running-agents.md** — Timestamp refreshes

### Infrastructure (2 files)
- **manifest.json** — 29 entries updated with new hashes and timestamps, last_full_update set to 2026-07-06
- **docs/architecture.md** — Auto-regenerated

## So What — Why It Matters

### New Model Landscape (HIGH IMPACT)
The model lineup has shifted significantly since the last full update (April 2026):
- **Sonnet 5** launched Jun 30 — new flagship for speed/cost balance. SDK aliases already support `claude-sonnet-5`.
- **Opus 4.8** is the new top-tier model. Opus 4.7 is now legacy.
- **Fable 5** and **Mythos 5** are a new model tier (creative/research).
- **Opus 4.1 deprecated, Sonnet 4/Opus 4 retired** — migration away from these is now mandatory.
- The 1M context window for Opus 4.6 is now GA (no longer beta).

### SDK Updates (MEDIUM IMPACT)
- Both Python (0.116.0) and TypeScript (0.110.0) SDKs now support Sonnet 5 and Managed Agents event streaming.
- A new `ant` CLI tool exists for API interaction.
- Apple Foundation Models integration library is now official.

### Claude Code Changes (MEDIUM IMPACT)
- Permission mode renamed from "auto" to "trusted" — may affect scripts/configs that reference the old name.
- Scheduled tasks now support 7-day expiry (up from 3) and dynamic intervals.
- MCP servers gained `requiresUserInteraction` annotation — useful for tools that need user confirmation.

### New GitHub Repos (LOW-MEDIUM IMPACT)
- `financial-services` (33K stars) and `claude-for-legal` (8.6K) are new industry-specific plugin repos.
- `ClaudeForFoundationModels` indicates Apple integration.
- `defending-code-reference-harness` (6.3K) is relevant to security work.

## Discovery: New Untracked Content

29 new sources were discovered but not yet added to the manifest:

**HIGH Priority (add next):**
- **Claude Sonnet 5 announcement** — https://www.anthropic.com/news/claude-sonnet-5
- **Redeploying Fable 5** — https://www.anthropic.com/news/redeploying-fable-5
- **Claude Code: Best practices for agentic coding** — https://www.anthropic.com/engineering/claude-code-best-practices (deferred since March)
- **How we contain Claude across products** — https://www.anthropic.com/engineering/how-we-contain-claude
- **Scaling Managed Agents** — https://www.anthropic.com/engineering/managed-agents
- **Claude Code auto mode** — https://www.anthropic.com/engineering/claude-code-auto-mode
- **Harness design for long-running apps** — https://www.anthropic.com/engineering/harness-design-long-running-apps
- **April 23 postmortem** — https://www.anthropic.com/engineering/april-23-postmortem
- **Agent Skills engineering** — https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills

**MEDIUM Priority:**
- Claude Science workbench, Fable safeguards/jailbreak framework, AI Exponential policy, Anthropic Public Record, Project Glasswing, N-day exploits research, and 8 more research/news articles

**SDK versions (current):**
- npm @anthropic-ai/sdk: 0.110.0
- PyPI anthropic: 0.116.0

## Action Items

- [ ] **Breaking**: Audit configs for "auto" permission mode references — now called "trusted"
- [ ] **Migration**: Ensure no projects depend on Opus 4.1 (deprecated Jun 5) or Sonnet 4/Opus 4 (retired Jun 15)
- [ ] **Add high-priority sources**: Claude Sonnet 5 announcement and the 8 HIGH-priority engineering posts should be added to the manifest
- [ ] **Consider**: The `ant` CLI tool and Apple Foundation Models library may be worth tracking as new sources
- [ ] **Stale sources**: 41 static articles still show April 2026 timestamps (content unchanged — these are published articles)
- [ ] **Known 404**: agent-sdk-typescript-v2 source (github.com/anthropics/agent-sdk) still returning 404 — 4th consecutive cycle, recommend removal
