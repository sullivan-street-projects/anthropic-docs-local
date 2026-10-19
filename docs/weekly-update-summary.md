---
title: "Weekly Update Summary"
date: "2026-10-19"
category: "meta"
---

# Weekly Update Summary — 2026-10-19

**Quiet week upstream. No new model and no SDK release. The main work was re-syncing nine hand-maintained Claude Code and Agent SDK docs against the live docs; three of them had wrong statements.** 13 files changed: 9 manual docs plus the Claude Code CHANGELOG were updated, and 2 new sources were added. Validation is clean: 197/197 hashes verified, the model-lineup consistency check passes, 0 errors.

> This run came one day after the 2026-10-18 refresh, so very little upstream content had time to change.

## What Changed

### Updated (content refresh)
- **claude-code/**
  - `hooks.md`: the `onFailure: "block"` fail-closed hooks (v2.1.295+); the PostToolUse `classifierContext` field; `mcp_server` provenance; `agent_id` on TaskCreated, TaskCompleted and TeammateIdle; a corrected `onFailure` description.
  - `mcp-servers.md`: the largest change. See "Corrections" below.
  - `features.md`: output styles are now a first-class feature; hooks can run an MCP tool call; what a subagent or fork loads (`omitClaudeMd`).
  - `plugins.md`: three marketplace tiers (official, community, third-party); "mods" (plugins with a hooks module); install scopes; cloud sessions don't load locally installed plugins.
  - `CHANGELOG.md`: v2.1.303, bug fixes only.
- **agent-sdk/**
  - `README.md`: Managed Agents can now run in a **self-hosted sandbox** and are reachable from the language SDKs and the `ant` CLI. Also added the CLI-as-subprocess option for other languages.
  - `quickstart.md`: installs without a bundled binary (ARM64 Windows source build; `npm --omit=optional` needs `pathToClaudeCodeExecutable`).
- **docs/** (best-practice guides)
  - `best-practices-loop-scheduling.md`: rewritten against the live scheduled-tasks page.
  - `best-practices-mcp-credentials.md`: the unset-variable behavior and the `headersHelper` trust rules.
- **manifest.json** (2 new sources, hashes and timestamps reconciled) and **docs/architecture.md** (regenerated).

### New sources
- `news/public-benefit-fund.md`: *Investing in the public benefit* (Oct 18)
- `research/econ-scenarios.md`: *Scenarios for our Economic Future* (Econ Scenario Explorer v1.0)

### Verified unchanged
SDK READMEs and CHANGELOGs (Python 1.15.0, TypeScript 0.135.0), the release notes (newest entry Oct 15), the model lineup and deprecations, cookbooks, the skills README, the arXiv index (no new Anthropic-authored papers) and the GitHub repo list (115 repos, no new names).

## So What — Why It Matters

- **Corrections to our own reference docs (highest impact).**
  - The loop-scheduling guide said `/loop` tasks don't persist and that a `w` (weeks) interval exists. Both are wrong:
    - Tasks are restored on `--resume`.
    - Recurring tasks **expire after 7 days**.
    - Intervals are `s/m/h/d` only.
    - A session holds at most 50 tasks.
  - The MCP docs said an unset `${VAR}` breaks config parsing. It now loads with a warning and leaves the text as written, so a missing secret can fail *silently* at connect time instead of loudly at startup.
  - The MCP **discovery cache is now off by default** (since v2.1.238). Set `MCP_DISCOVERY_CACHE=1` to turn it on.
- **Fail-closed hooks.** `onFailure: "block"` lets a security hook stop an action when the hook itself crashes or times out. Before, a broken guard hook silently let the action through.
- **Per-project MCP disable.** `disabledMcpServers` / `enabledMcpServers` switch a server off for one project without removing it.
- **Managed Agents in a self-hosted sandbox.** Agents can run on infrastructure you control, which matters for any client work with data-residency limits.
- **Anthropic Public Benefit Fund.** 5% of shares at the start, plus 2% for each 50% gain in company value. With the founders' pledges and the employee match, about 20% of equity goes to the public good. This is governance news with no API impact.
- **Econ Scenario Explorer.** Anthropic's own modest, substantial and extreme scenarios for 2030: GDP +1.6% / +8.3% / +32.4%, and in the extreme case knowledge-worker wages fall more than 10%. Useful framing for client conversations about AI and the workforce.

## Action Items

- **Recurring `/loop` jobs expire after 7 days.** If anything relies on an in-session `/loop` running for weeks, move it to Routines or a Desktop scheduled task. The cloud routine that produces this summary isn't affected.
- **Security-relevant hooks:** consider adding `"onFailure": "block"` (Claude Code v2.1.295+) so they fail closed.
- **MCP configs that rely on `${VAR}` secrets:** a missing variable no longer stops startup. Check the `/mcp` status and warnings when a server misbehaves.
- **Check `docs/best-practices-mcp-credentials.md`:** it says Claude Code reads `.env` from the project root automatically. The live MCP page doesn't say so, and the Agent SDK quickstart says the SDK does *not* load `.env`. Treat that line as unconfirmed.
- **Watch item:** `claude-haiku-4-5-20251001` still shows as Active, with retirement "not sooner than October 15, 2026", a date that has passed. A deprecation notice may come soon, so plan the migration to `claude-haiku-5-5`.
- **No breaking SDK changes this week.**
