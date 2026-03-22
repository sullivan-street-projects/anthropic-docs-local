---
title: "Weekly Update Summary"
date: "2026-03-22"
---

# Weekly Update Summary — 2026-03-22

## What Changed

### github-raw (8 files — all content changed)
- `claude-code/CHANGELOG.md` — 4 new versions (2.1.78–2.1.81) with 50+ changes
- `claude-code/README.md` — Updated
- `sdks/python/README.md` + `CHANGELOG.md` — Updated
- `sdks/typescript/README.md` + `CHANGELOG.md` — Updated
- `skills/README.md` — Updated
- `cookbooks/index.md` — Updated

### manual (7 content changes, 4 timestamp-only)
- `claude-code/hooks.md` — New `StopFailure` event (22 total); `InstructionsLoaded` now has matcher support
- `claude-code/features.md` — Added MCP vs Skill comparison; subagent→agent team transition guidance
- `claude-code/mcp-servers.md` — Added OAuth metadata discovery override (`authServerMetadataUrl`)
- `docs/best-practices-loop-scheduling.md` — 3 new CLI flags: `--max-budget-usd`, `--fallback-model`, `--effort`
- `docs/best-practices-mcp-credentials.md` — Pre-configured OAuth CLI example; OAuth metadata override
- `research/papers/index.md` — Updated check date (no new papers)
- `research/opendev-coding-agents.md` — Paper version v2→v3 (March 13, 2026)

### github-api (1 file — content changed)
- `github-repos/index.md` — 1 new repo (`terragrunt` fork), significant star increases across board

### web-extracted (84 files — all timestamp-only)
- No content drift detected in any web-extracted source

### arxiv-pdfs (2 files — minor updates)
- No new Anthropic papers on arXiv since last week

## So What — Why It Matters

### Claude Code 2.1.78–2.1.81 (HIGH IMPACT)
- **`--bare` flag** — New way to run Claude Code in scripted/headless mode. Skips hooks, LSP, plugins. Useful for CI/CD pipelines.
- **`--channels` permission relay** — MCP servers can push messages into sessions; permission prompts can forward to phone.
- **`StopFailure` hook event** — Can now detect and respond to API errors (rate limits, auth failures) programmatically.
- **`effort` frontmatter for skills/agents** — Override model effort level per-skill or per-agent.
- **`source: 'settings'` plugins** — Declare plugin entries inline in settings.json without a separate repo.
- **`InstructionsLoaded` matcher support** — Hooks can now filter by load reason (session_start, nested_traversal, path_glob_match).
- **Line-by-line response streaming** — Responses now stream line-by-line (disabled on Windows/WSL).
- **`/remote-control`** — Bridge VSCode sessions to claude.ai/code for browser/phone continuation.
- **Security fix** — Silent sandbox disable now shows visible warning when dependencies are missing.

### New CLI Flags
- `--max-budget-usd` — Set spend caps for automated runs
- `--fallback-model` — Specify fallback model when primary is unavailable
- `--effort` — Set reasoning effort from CLI

### MCP OAuth Improvements
- OAuth metadata discovery override via `authServerMetadataUrl`
- Client ID Metadata Document (CIMD / SEP-991) support for servers without Dynamic Client Registration

### Research
- OpenDev coding agents paper updated to v3

## Discovery — New Content Found (Not Yet Added)

### HIGH Priority (recommend adding)
1. **"What 81,000 people want from AI"** — Major new Anthropic publication (anthropic.com/81k-interviews)
2. **"Claude Code: Best practices for agentic coding"** — Engineering guide (anthropic.com/engineering/claude-code-best-practices)
3. **agent-sdk-workshop** — Official Agent SDK workshop repo on GitHub
4. **claude-constitution** — Claude's values document published as a GitHub repo

### MEDIUM Priority
5. "Signs of introspection in LLMs", "Constitutional Classifiers", "Alignment faking" — research articles
6. financial-services-plugins, knowledge-work-plugins — plugin repos
7. anthropic-cli — CLI tool repo

## Action Items
- [ ] Add 4 HIGH priority discovered sources to manifest
- [ ] Investigate `agent-sdk` repo 404 (typescript-v2-preview source) — may have been renamed/reorganized
- [ ] Consider using `--bare` flag for scripted update operations
- [ ] Unmerged remote branch: `origin/claude/focused-cohen` — review and merge or delete

## Stats
- Files changed: 105
- Insertions: 752
- Deletions: 1,196
- Content changes: 16 files
- Timestamp-only: 89 files
