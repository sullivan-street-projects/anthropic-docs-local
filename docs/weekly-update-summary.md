# Weekly Update Summary — 2026-09-27

## What Changed

### Models (the big one)

- **`models/claude-opus-5-5.md`** — NEW. Claude Opus 5.5 (`claude-opus-5-5`), launched Sep 22, now the default Opus.
- **`models/overview.md`** — Opus 5.5 added to the current lineup as the recommended default; Claude Opus 5 moved to the legacy table.
- **`api/models-overview.md`** — same lineup/legacy shift, "start with Opus 5.5", effort/thinking/cache notes.
- **`models/deprecations.md`** — added `claude-opus-5-5`, plus previously-missing `claude-mythos-5-1`, `claude-mythos-5`, `claude-mythos-preview` status rows.

### SDKs

- **`sdks/python/CHANGELOG.md`** — 1.7.0 → 1.8.0. **`sdks/typescript/CHANGELOG.md`** — 0.127.0 → 0.128.0. Both add `claude-opus-5-5`, inline tool definitions, and MCP tool-list pinning (beta).
- **`sdks/python/README.md`**, **`sdks/typescript/README.md`** — example model bumped to `claude-opus-5-5`.

### Claude Code

- **`claude-code/CHANGELOG.md`** — 2.1.278 → 2.1.283 (new content).
- **`claude-code/hooks.md`** — `Notification` gains `quota_auto_resume_*` matchers; `StopFailure` gains `account_on_hold`.

### Release notes

- **`release-notes/platform.md`**, **`release-notes/api.md`** — Sep 22–24 entries.

### Research (new first-party posts)

- **`research/claude-discovers-novel-enzyme-system.md`** — NEW (Sep 23).
- **`research/project-swap.md`** — NEW (Sep 24).
- **`research/yes-claude-can-do-nine-loops.md`** — NEW (Sep 25).

165 → 169 tracked sources. Validation: 0 errors, 169/169 SHA-256 hashes verified.

## So What — Why It Matters

- **Claude Opus 5.5 is the new default Opus, and it's cheaper.** $4/$20 per MTok (down 20% from Opus 5's $5/$25), cache reads $0.20/MTok (down 60%), ~30% faster output, and Anthropic claims it runs ~40% cheaper than Opus 5 while matching Fable 5.1 on most tasks. For any project picking a model, Opus 5.5 is now the sensible default over Opus 5.
- **Three breaking API behaviors on Opus 5.5** if you migrate code: (1) thinking cannot be disabled — omit `thinking`, steer with `effort` (default `medium`); (2) `tool_choice` `any`/`tool` return 400 — use `auto` with strict tool use; (3) computer use needs the `computer_toolset_20260801` toolset (the old `computer_20251124` returns 400 on the API and Google Cloud, still works on Bedrock).
- **SDKs 1.8.0 / 0.128.0** add two beta capabilities worth knowing: inline tool definitions (define/change a tool mid-conversation without invalidating the prompt cache) and MCP tool-list pinning (record and re-send a server's fetched tool list so it doesn't drift).
- **Cache diagnostics went GA** (no beta header needed); **refusals that arrive before output are now billed** for `bio`/`frontier_llm`/`reasoning_extraction` categories.
- **Research signal, not product:** Claude autonomously found a novel enzyme system (ART, CRISPR-like), computed a nine-loop physics amplitude with independent human verification, and ran an agent-mediated trading study (Project Swap) whose headline lesson — representation quality matters more than bargaining skill — is relevant to anyone building agents that act on a user's behalf.

## Action Items

- **No breaking changes to our own workflows.** Our automation makes no direct Claude API calls, so the Opus 5.5 API constraints are informational.
- **When you next pin a model in code or an SDK example, prefer `claude-opus-5-5`.** The SDK READMEs already use it.
- **Standing cleanup (unchanged):** `agent-sdk-typescript-v2` (`github.com/anthropics/agent-sdk`) is confirmed 404 for the ~11th cycle (175 days stale). It needs a one-time manual removal (manifest entry + `agent-sdk/typescript-v2-preview.md`) or a repoint to the live `code.claude.com/docs/en/agent-sdk/*` docs. Not auto-deleted in unattended runs.
- **Known truncation:** `news/threat-intelligence-report-september-2026.md` still carries a truncation marker from the 2026-09-13 partial WebFetch; a targeted section re-fetch remains outstanding.
