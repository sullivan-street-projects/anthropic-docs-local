---
title: "Weekly Update Summary"
date: "2026-03-15"
---

# Weekly Update Summary — 2026-03-15

## What Changed

### claude-code (8 files)
- **CHANGELOG.md** — New versions v2.1.75 and v2.1.76 with MCP elicitation support, `-n`/`--name` CLI flag, `/effort` slash command, `worktree.sparsePaths` setting, `PostCompact` hook, and numerous bug fixes
- **features.md** — Added Remote Control and Chrome Integration to platform support; renamed "Task" tool to "Agent"; added `/loop` and `/resume` slash commands
- **hooks.md** — Added 3 new hook events: `PostCompact`, `Elicitation`, `ElicitationResult` (18 → 21 total). Full documentation with JSON schemas for each
- **mcp-servers.md** — Added new "MCP Elicitation" section documenting form-mode and URL-mode elicitation support
- **plugins.md** — Timestamp refresh
- **scheduled-tasks.md** — Added version requirement note (v2.1.72+)
- **README.md**, static community posts — Timestamp refresh

### api (15 files)
- **context-windows.md** — Updated to reflect 1M context window GA for Opus 4.6 and Sonnet 4.6 (no more beta header)
- **vision.md** — Image limit raised from 100 to 600 (100 for 200k-token context models)
- All other API docs — Timestamp refresh

### models (6 files)
- **overview.md** — Updated context window from "200K / 1M (beta)" to "1M tokens" (now GA)
- Model pages and deprecations — Timestamp refresh

### release-notes (3 files)
- **platform.md** — Added March 13 entry: 1M token context window GA, removed dedicated 1M rate limits, raised media limit to 600
- **api.md** — Same March 13 entry added
- **help-center.md** — Added March 12 (inline charts/diagrams) and March 11 (Excel/PowerPoint add-in, LLM gateway connectivity for Bedrock/Vertex/Foundry)

### agent-sdk (4 files)
- **README.md** — Renamed "Task" tool to "Agent" tool throughout
- **examples.md** — Updated all `allowedTools`/`allowed_tools` arrays from "Task" to "Agent"
- **quickstart.md**, **typescript-v2-preview.md** — Timestamp refresh

### github-repos (1 file)
- **index.md** — 3 new repos (73 → 76 total), star counts updated across all repos (skills: 91K→94K, claude-code: 77K→78K)

### sdks (4 files), skills (3 files), cookbooks (1 file), research (8 files), news (7 files), engineering (7 files)
- All timestamp refreshes; no content changes detected

### manifest.json
- `last_full_update` set to `2026-03-15T00:00:00Z`
- All 77 source `last_fetched` timestamps updated

## So What — Why It Matters

1. **1M context window is now GA** — The biggest change this week. Opus 4.6 and Sonnet 4.6 no longer need the `anthropic-beta: max-tokens-3-5-sonnet-2025-04-14` header for 1M context. This simplifies API integration and removes the dedicated 1M rate limit tier. If you're using extended context, update your code to remove the beta header.

2. **Media limit raised 6x (100 → 600)** — You can now send up to 600 images or PDF pages in a single request with 1M-context models. This is significant for document processing and multi-image analysis workflows.

3. **MCP Elicitation** — New protocol feature allowing MCP servers to request structured input from users mid-task (form fields, URL-mode). Three new hook events (`PostCompact`, `Elicitation`, `ElicitationResult`) enable automation of these interactions. This unlocks more sophisticated MCP server workflows.

4. **Tool rename: "Task" → "Agent"** — The subagent spawning tool has been renamed across both Claude Code and Agent SDK. If you have code or documentation referencing the "Task" tool, update references to "Agent".

5. **Remote Control & Chrome Integration** — New platform features for controlling Claude Code from Claude.ai (`claude remote-control`) and browser automation via `--chrome` flag.

6. **Claude Code v2.1.75-v2.1.76** — Notable additions: `/effort` slash command for adjusting reasoning effort, `worktree.sparsePaths` for limiting worktree scope, `-n`/`--name` flag for naming sessions.

## Action Items

- **Remove beta headers** for 1M context window usage — now GA, no header required
- **Update tool references** from "Task" to "Agent" in any custom integrations
- **Review MCP elicitation hooks** if building MCP servers that need user input
- **Note**: `agent-sdk` GitHub repo returned 404 — may have been renamed or moved; investigate source URL

## Errors

- `agent-sdk/typescript-v2-preview.md`: Source URL `https://github.com/anthropics/agent-sdk` returned 404. Content not refreshed, timestamp updated.
