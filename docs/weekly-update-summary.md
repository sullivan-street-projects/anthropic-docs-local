# Weekly Update Summary — 2026-10-12

High-signal week for Claude Code manual sources — Output Styles, new hook fields, MCP credential protection, plugin Marketplace Tiers, and 16 new CLI flags. API docs expanded significantly with Models API capabilities and per-model migration guides. 26 files changed, 2 new sources auto-added (186 total). 186/186 SHA-256 hashes verified; validate.js reports 0 errors.

## What Changed

### Claude Code (8 files changed)
- **claude-code/features.md** — Output Styles feature added (extension architecture, build-your-setup table, CLAUDE.md vs Output Style comparison)
- **claude-code/hooks.md** — New hook fields: `onFailure` for HTTP hooks, `PreModelSwitch` with permissionDecision output, `Stop/SubagentStop` additionalContext, `SessionStart` resume/fork context fields (v2.1.251+), `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB` env var; TeammateIdle matcher changed
- **claude-code/mcp-servers.md** — SSE transport deprecation (HTTP fallback on v2.1.265+), credential variable protection blocking ANTHROPIC_API_KEY in remote URLs/headers, `managedMcpServers` scope, `/mcp reconnect all` command, MCP Runtimes v1/v2 section, output limits (50K+ chars, 16MB HTTP)
- **claude-code/plugins.md** — Hooks module concept, Marketplace Tiers (Official/Community/Third-party), Context Cost of Enabled Plugins, Cloud Sessions note
- **claude-code/CHANGELOG.md** — Frontmatter timestamp bumped (no new upstream releases)
- **docs/best-practices-loop-scheduling.md** — 16 new CLI flags (--advisor, --cloud, --desktop, --exec, --worktree, --teammate-mode, etc.), new commands (claude respawn, claude rm, claude daemon logs, claude doctor)
- **docs/best-practices-mcp-credentials.md** — Credential Variable Protection section, server disabling with disabledMcpjsonServers

### API (5 files changed)
- **api/errors.md** — Expanded 400/429 errors with spend limits and Claude Code workspace info; SDK retry parameters and per-language error classes; 3 new validation errors (forced tool use, computer use version, thinking block mismatch); thinking-cannot-be-disabled expanded for Sonnet 5.5 between_tools and Haiku 5.5
- **api/context-windows.md** — Updated for Fable 5.1, Mythos 5.1, Opus 5.5, Sonnet 5.5, Haiku 5.5; Haiku 5.5 long-context pricing; thinking block preservation updates
- **api/models-overview.md** — "Using the Models API" section with `line`, `thinking.types.disabled`, `server_tools`, `code_execution` capability fields; context awareness task-budget distinction
- **api/migration-guide.md** — Links to 4 new per-model migration guides (Fable 5.1/Mythos 5.1, Opus 5.5, Sonnet 5.5, Haiku 5.5); page restructured as hub
- **sdks/other/overview.md** — Title/URL updated to match current source

### Models (2 files changed)
- **models/deprecations.md** — Sonnet 4, Sonnet 3.7, Sonnet 3.5, Sonnet 3 now recommend `claude-sonnet-5-5` as replacement; Claude 1/Instant retirement table expanded to individual entries
- **models/overview.md** — Effort default note updated to include Haiku 5.5 and Sonnet 5.5

### Agent SDK (2 files changed)
- **agent-sdk/README.md** — Restructured from three sections to unified "You want to..." comparison table (Client SDK, CLI, Managed Agents); capabilities in table format; new source links (Migration Guide, Agent Loop, Agent Harness Design)
- **agent-sdk/quickstart.md** — Binary bundling edge cases (ARM64 Windows, --omit=optional); Configure your agent and Troubleshooting added to next steps

### Release Notes (2 files changed)
- **release-notes/platform.md** — Added Sep 9 cache fingerprints entry
- **release-notes/api.md** — Added Sep 9 cache fingerprints entry

### Research (2 files changed + 1 new)
- **research/index.md** — 9 new publications added (Sep 24 – Oct 9): Investigating unintended model actions, Missing map of the sky, OSS vulnerability-finding service, Claude-shaped science, What work can robots do?, What do you want from AI?, GLM-5.3 cyber capabilities, Nine Loops, Project Swap
- **research/econ-scenarios.md** — NEW: "Scenarios for our Economic Future" from anthropic.com/institute

### News (1 new)
- **news/ebola-response.md** — NEW: "The Situation Report" — Anthropic's ebola response feature page

### SDKs (2 files changed)
- **sdks/python/CHANGELOG.md** — Frontmatter timestamp bumped (latest: v1.13.0, Oct 9)
- **sdks/typescript/CHANGELOG.md** — Frontmatter timestamp bumped (latest: v0.133.0, Oct 9)

### Infrastructure (2 files changed)
- **manifest.json** — 22 sources updated, 2 new sources added (186 total)
- **docs/architecture.md** — Regenerated

## So What — Why It Matters

**Output Styles is a new Claude Code feature** that lets users configure how Claude formats its responses — worth understanding if you build Claude Code workflows or custom output formatting.

**MCP credential protection is a security hardening** — Claude Code now blocks sensitive variables (ANTHROPIC_API_KEY, etc.) from being passed in remote MCP server URLs/headers. If you configure MCP servers with credentials, review how they're passed.

**16 new CLI flags** expand Claude Code's automation surface: `--cloud`, `--desktop`, `--exec`, `--worktree`, `--teammate-mode` are notable for scripted/headless usage. `claude respawn` and `claude doctor` are new diagnostic commands.

**Models API capability fields** (`line`, `thinking.types.disabled`, `server_tools`, `code_execution`) let you programmatically discover what each model supports — useful if you build model-selection logic.

**Deprecation replacements updated to Sonnet 5.5** — if you're on Sonnet 4 or earlier, the recommended upgrade path is now `claude-sonnet-5-5`.

**Per-model migration guides** — the deprecations page is now a hub linking to individual model guides. If you're planning a migration, these targeted guides are more actionable than the single combined page.

**Plugin Marketplace Tiers** — plugins now have trust levels (Official, Community, Third-party). Context cost documentation helps estimate the token overhead of enabled plugins.

## Action Items

- **Review MCP credential protection** if you use remote MCP servers — ensure sensitive variables aren't being leaked
- **Check Sonnet deprecation timeline** — Sonnet 4 and earlier now recommend `claude-sonnet-5-5` as replacement
- **Explore Output Styles** if you need customized Claude Code response formatting
- **Note the 16 new CLI flags** for automation — especially `--exec`, `--cloud`, and `--worktree`
- **agent-sdk-typescript-v2 still 404** (13th consecutive cycle, 190 days) — needs manual removal from manifest or repointing to current Agent SDK docs
- **threat-intelligence-report-september-2026.md** still truncated from Sep 13 — needs targeted re-fetch of missing sections
