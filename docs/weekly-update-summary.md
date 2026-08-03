---
title: "Weekly Update Summary"
date: "2026-08-03"
---

# Weekly Update Summary — 2026-08-03

## What Changed

### API Documentation (12 files)
- **api/effort-parameter.md** — Added Claude Opus 5 to supported models, xhigh availability, new Opus 5 effort guidance section
- **api/errors.md** — Added extended/adaptive thinking validation errors, "thinking cannot be disabled" error
- **api/context-windows.md** — Added Claude Opus 5 to model lists, new "Context Window Overflow Behavior" section
- **api/adaptive-thinking.md** — Added Claude Opus 5 to supported models
- **api/compaction.md** — Added Claude Opus 5 to supported models
- **api/extended-thinking.md** — Updated intro noting deprecation status, clarified manual mode purpose
- **api/messages-api.md** — Added Claude Sonnet 5 to model table, new `model_context_window_exceeded` stop reason, `general_harms` refusal category
- **api/overview.md** — Updated Workbench URL to /playground, reordered cloud platform table
- **api/streaming.md** — Updated all model references from claude-opus-4-8 to claude-opus-5
- **api/tool-use.md** — Added MCP Connector to server tools list, updated tool versions
- **api/vision.md** — Updated model references to claude-opus-5, updated high-res models to "Claude 4.7 and later"
- **api/web-search-tool.md** — Updated model references to claude-opus-5, simplified dynamic filtering model list
- **api/memory-tool.md** — Timestamp updated

### Claude Code (1 file)
- **claude-code/mcp-servers.md** — Major update: auto-backgrounding of long MCP tool calls, disable server without removing, tool input schema combinators, `require_approval` annotation, organization controls on connector tools, expanded reserved server names, roots/list for stdio servers, idle timeout, reconnection failure reporting, new env var `CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS`

### Agent SDK (2 files)
- **agent-sdk/README.md** — Google Vertex AI renamed to "Google Cloud's Agent Platform", Microsoft Azure renamed to "Microsoft Foundry", updated Plugins capability description, added Next Steps section
- **agent-sdk/quickstart.md** — Same provider name changes (Vertex AI -> Agent Platform, Azure -> Foundry)

### Models (1 file)
- **models/deprecations.md** — Added "Deprecation Downsides and Mitigations" section

### Release Notes (2 files)
- **release-notes/platform.md** — Added Dreams research preview entry (July 10, 2026)
- **release-notes/api.md** — Added Dreams research preview entry (July 10, 2026)

### Best Practices (2 files)
- **docs/best-practices-loop-scheduling.md** — Added `ultracode` effort level, `claude respawn` and `claude rm` commands, updated verification table
- **docs/best-practices-mcp-credentials.md** — Updated env var expansion behavior (now warns instead of failing), expanded reserved server names list

### Research (1 file)
- **research/papers/index.md** — Confirmed arXiv ID 2607.15495 for "Verbalizable Representations Form a Global Workspace in Language Models", moved to arXiv table

### GitHub Repos (1 file)
- **github-repos/index.md** — Star count updates (skills: 165.9k, claude-code: 140.1k, cookbooks: 50.9k)

### Skills (1 file)
- **skills/catalog.md** — Fork count updated from 18.9k to 19.7k

### Unchanged (all github-raw sources)
- Claude Code README, CHANGELOG (v2.1.220)
- Python SDK README, CHANGELOG (v0.120.2)
- TypeScript SDK README, CHANGELOG (v0.115.0)
- Skills README, Cookbooks index

## So What — Why It Matters

### Opus 5 is now the default across API docs
All API documentation pages have been updated to reference Claude Opus 5 as the current flagship model. The effort parameter docs now include Opus 5-specific guidance and xhigh availability. If you're building with the API, model references in examples are now current.

### New API error types for thinking configuration
Three new validation errors related to extended/adaptive thinking. If your code handles thinking parameters, you may see new error shapes. `general_harms` refusal category and `model_context_window_exceeded` stop reason are also new.

### MCP Servers got a major feature dump
Auto-backgrounding of long MCP tool calls (configurable via `CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS`), organization-level controls on connector tools, `require_approval` annotation, and expanded reserved server names. If you maintain MCP servers or set org-wide policies, review the updated mcp-servers.md.

### Cloud platform rebranding
Google Vertex AI is now "Google Cloud's Agent Platform" and Microsoft Azure is now "Microsoft Foundry" in the Agent SDK docs. Update any documentation or tooling that references the old names.

### Dreams research preview launched
A new "Dreams" research preview appeared in both platform and API release notes (July 10, 2026). Worth monitoring if you track Anthropic's experimental features.

### Context window overflow behavior documented
New section in context-windows.md explains what happens when you exceed the context window — useful for building robust applications.

## Action Items

- **Review MCP server docs** if you manage Claude Code MCP configurations — the auto-backgrounding and org controls are significant new capabilities
- **Update provider references** in any docs that mention "Vertex AI" or "Azure" in the context of Anthropic's Agent SDK — they're now "Agent Platform" and "Foundry"
- **Monitor Dreams research preview** — new experimental feature that may affect API behavior
- **agent-sdk-typescript-v2-preview removal overdue** — 7th consecutive 404; should be removed from manifest in next attended session
- **9 HIGH-priority untracked sources** found in discovery scan — recommend adding engineering posts (how-we-contain-claude, managed-agents, claude-code-auto-mode) and research articles next cycle
