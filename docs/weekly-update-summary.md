# Weekly Update Summary — 2026-10-11

Two model launches (Claude Sonnet 5.5 and Claude Haiku 5.5) had stacked up since the last run on 2026-09-27 (the 10-04 run was skipped), so this was a high-signal refresh. 32 files changed, 15 new first-party sources auto-added, one validation check added to catch the recurring model-launch cascade. 184/184 SHA-256 hashes verified; validate.js reports 0 errors.

## What Changed

### Models (cascade across 3 lineup files)
- `models/overview.md`, `api/models-overview.md`, `models/deprecations.md` — current lineup updated to **Fable 5.1 / Opus 5.5 / Sonnet 5.5 / Haiku 5.5**. Sonnet 5 and Haiku 4.5 moved to legacy; Sonnet 4.5 marked **Deprecated** (retires Nov 30, 2026). Added `claude-mythos-5` to the Mythos note (was Active but undocumented).
- `models/claude-sonnet-5-5.md` — **new** model page.
- `models/claude-haiku-5-5.md` — **new** model page.

### Release notes
- `release-notes/api.md`, `release-notes/platform.md` — new entries Sep 28–Oct 9 (Sonnet 5.5, Haiku 5.5, Admin API GA, Managed Agents dynamic workflows, Models API `line`/`capabilities` fields).
- `release-notes/help-center.md` — new entries Sep 16–Oct 7 (Haiku 5.5, Max/Team API credits, Sonnet 5.5, plugin developer portal, Cowork/Design/Slides/Docs in every conversation).

### SDKs & Claude Code (github-raw, stored verbatim)
- Python SDK CHANGELOG/README: **1.8.0 → 1.13.0**. TypeScript SDK: **0.128.0 → 0.133.0**. Claude Code CHANGELOG: **2.1.283 → 2.1.296**. `skills/README.md` gained a skill-frontmatter example + partner section. `cookbooks/index.md` refreshed.

### GitHub repos index (github-api)
- `github-repos/index.md` regenerated — 115 repos, refreshed star counts (skills 180.4k, claude-code 150.2k).

### Manual docs
- `claude-code/hooks.md` — verified current against live (all 33 hook events present); added the new `onFailure` command-hook field (v2.1.295+).

### Research (new)
- `investigating-unintended-model-actions`, `glm-5-3-advanced-cyber-capabilities`, `the-missing-map-of-the-sky`, `launching-opt-in-vuln-finding-service-oss`, `claude-shaped-science`, `what-work-can-robots-do`, `your-thoughts-on-ai`.

### News (new)
- `2026-usage-policy-update`, `anthropic-cyber-mission`, `cyber-verification-program`, `genesis-mission-commitment`, `claude-frontier-academy`, `barclays-scales-claude`.

### Infrastructure
- `scripts/validate.js` — new Layer-4 **model-lineup consistency check** (every Active model in deprecations.md must appear in both overview files).

## So What — Why It Matters

- **New default-tier models.** The current lineup is now the full 5.5/5.1 generation: Opus 5.5 (default), Sonnet 5.5 ($2/$10, ~30% fewer tokens/task than Sonnet 5), and Haiku 5.5 — the first Haiku with a **1M context window, 128K output, adaptive thinking, and an effort parameter**, starting at **$0.10/$0.50 per MTok** (~75% cheaper than Haiku 4.5). For any project picking a cheap/fast model, Haiku 5.5 is the new floor.
- **Sonnet 4.5 is on the clock.** `claude-sonnet-4-5-20250929` is deprecated and **retires Nov 30, 2026** — anything pinned to it must move to `claude-sonnet-5-5`.
- **Breaking API behaviors on the new models.** Haiku 5.5 rejects `budget_tokens`/`temperature`/`top_p`/`top_k`/assistant prefill (400); Sonnet 5.5 uses `thinking: {"type": "between_tools"}` to turn off up-front thinking (not `"disabled"`), and `tool_choice` `any`/`tool` return 400. Computer use needs `computer_toolset_20260801` on the Claude API and Google Cloud.
- **SDK deprecations.** The Text Completions API is marked deprecated; Sonnet 4.5 is deprecated at the client level; the Admin API is now GA (`client.organization`). Typed computer/browser toolset classes are new in both SDKs (beta).
- **Usage Policy changes effective Nov 12, 2026.** New deceptive-activity and surveillance sections, explicit weapons/autonomous-hardware rules, and a new prohibition on sustained model abuse. Relevant to any outbound or agentic deployment.

## Action Items

- **If any workflow pins `claude-sonnet-4-5`**, migrate to `claude-sonnet-5-5` before **Nov 30, 2026**.
- **Consider Haiku 5.5** for high-volume/latency-sensitive subtasks (classification, extraction, routing) — materially cheaper and now 1M-context.
- **No breaking changes to this repo's tooling.** The new validate.js lineup check is additive and passing.
- **Pending (user action):** remove the dead `agent-sdk-typescript-v2` manifest entry + `agent-sdk/typescript-v2-preview.md` (404 for ~12 cycles), or repoint to the live Agent SDK docs. This is the only recurring staleness warning that needs a human decision.
