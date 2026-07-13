---
# Weekly Update Summary — 2026-07-13

## What Changed

### Content Changes (meaningful updates)

**API Documentation**
- `api/messages-api.md` — Added **Claude Sonnet 5** (`claude-sonnet-5`) to the model table
- `api/adaptive-thinking.md` — Major update: added ZDR eligibility notice, new `thinking.display` parameter (`"summarized"` / `"omitted"`), curl examples, clarified per-model thinking behavior, updated code samples to include `display: "summarized"`

**Claude Code**
- `docs/best-practices-loop-scheduling.md` — Added 14 new CLI flags (`--debug-file`, `--maintenance`, `--cloud`, `--teleport`, `--worktree`, `--chrome`, `--agent`, `--exec`, `--permission-prompt-tool`, `--ax-screen-reader`, `--include-partial-messages`, `--replay-user-messages`, `--prompt-suggestions`), new background agent commands (`respawn`, `rm`, `agents --json`), `manual` permission mode alias
- `claude-code/hooks.md` — Updated `prompt_id` description: now documented as UUID (v2.1.196+)

**Agent SDK**
- `agent-sdk/README.md`, `agent-sdk/quickstart.md` — Naming updates: "Google Vertex AI" -> "Google Cloud's Agent Platform", "Azure AI Foundry" -> "Microsoft Foundry"

**Research**
- `research/papers/index.md` — Added new paper: "Verbalizable Representations Form a Global Workspace in Language Models" (Jul 2026, transformer-circuits.pub) — discovers "J-space" (Jacobian-space), a privileged internal workspace in Claude satisfying Global Workspace Theory properties

**GitHub Repos**
- `github-repos/index.md` — Star counts updated across 92 repos (skills 160.5k->160.8k, claude-code 137.5k->137.7k, cookbooks 48.2k->48.7k)

### Timestamp-Only Updates (27 files)
- 3 release notes (no new entries since July 10)
- 10 API docs (overview, tool-use, vision, streaming, errors, compaction, context-windows, models-overview, migration-guide, effort-parameter)
- 4 claude-code files (README, CHANGELOG, features, mcp-servers, plugins)
- 4 SDK files (Python/TypeScript READMEs and CHANGELOGs)
- 2 agent-sdk files (examples)
- 1 skills README, 1 cookbooks index, 1 best-practices-mcp-credentials, 1 opendev-coding-agents

### SDK Versions (current)
- Claude Code: 2.1.207
- Python SDK: 0.116.0 (Jul 2)
- TypeScript SDK: 0.111.0 (Jul 10)

## So What — Why It Matters

1. **Claude Sonnet 5 is live in the API.** The Messages API model table now lists `claude-sonnet-5`. Discovery found the announcement page — described as "most agentic Sonnet yet" at $2/$10 per M tokens (promo through Aug 31). New model option for all API users.

2. **Adaptive thinking gained the `display` parameter.** The default for newest models is `"omitted"` (thinking blocks returned with empty text). You must set `display: "summarized"` to see thinking output. This is a breaking behavior change for anyone parsing thinking blocks from Opus 4.8, Sonnet 5, or Fable/Mythos models.

3. **Claude Code CLI expanded significantly.** 14 new flags including `--cloud` (web sessions), `--teleport` (resume web sessions locally), `--worktree` (isolated git worktrees), `--chrome` (browser integration), and background agent management commands. Reflects the platform's shift toward long-running autonomous agents.

4. **New interpretability breakthrough: J-space / Global Workspace.** The transformer-circuits.pub paper discovers a privileged internal representation space in Claude where only verbalizable concepts are held, connecting to neuroscience's Global Workspace Theory.

5. **Cloud platform naming changes.** Agent SDK now references "Google Cloud's Agent Platform" (was Vertex AI) and "Microsoft Foundry" (was Azure AI Foundry).

6. **Anthropic filed an S-1 with the SEC** (discovered, not yet tracked). IPO process has begun.

## Discovery: 34 New Items Not Yet Tracked

**Highest priority to add:**
- Claude Sonnet 5 announcement (`models`)
- Managed Agents engineering post (`engineering`)
- Claude Code best practices — deferred for 4 months (`engineering`)
- Anthropic S-1 filing (`news`)
- Claude Science workbench (`news`)
- Redeploying Fable 5 + safeguards framework (`news`)
- "What 81,000 people want from AI" — deferred for 4 months (`research`)

See `tasks/discovery-log.md` for full list.

## Action Items

- [ ] **Breaking change alert:** Adaptive thinking `display` parameter defaults to `"omitted"` on newest models. Any code parsing thinking blocks needs `display: "summarized"` added.
- [ ] **New model available:** Claude Sonnet 5 (`claude-sonnet-5`) — evaluate for use in projects.
- [ ] **Add Claude Sonnet 5 announcement page** to manifest (HIGH priority).
- [ ] **Add Managed Agents engineering post** — documents hosted agent platform capability.
- [ ] **Add Claude Code best practices post** — deferred HIGH for 4 consecutive scans.
- [ ] **Monitor IPO developments** — S-1 filed, may affect API terms/pricing.
