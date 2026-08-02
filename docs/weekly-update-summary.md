---
title: "Weekly Update Summary"
date: "2026-08-02"
---

# Weekly Update Summary — 2026-08-02

## What Changed

### Models (major)

- **`models/claude-opus-5.md`** — NEW. Claude Opus 5 (`claude-opus-5`), launched 2026-07-24, now the **default Opus model**. $5/$25 per MTok (same as Opus 4.8), 1M context, 128k max output, knowledge cutoff May 2026, adaptive thinking on by default.
- **`models/claude-sonnet-5.md`** — NEW. Claude Sonnet 5 (`claude-sonnet-5`), launched 2026-06-30, most-agentic Sonnet yet; intro pricing $2/$10 through Aug 31 2026 then $3/$15. Default for Free & Pro.
- `models/overview.md`, `api/models-overview.md` — content refresh: Opus 5 promoted to Latest table as default/recommended; Opus 4.8 moved to Legacy; Opus 4.6 / Sonnet 4.6 extended thinking marked deprecated.
- `models/deprecations.md` — added Fable 5 / Opus 5 / Sonnet 5 rows; Mythos Preview reclassified to "deprecated."
- `api/migration-guide.md` — new "Migrating to Claude Opus 5" section (drop-in from Opus 4.8; breaking change: disabling thinking allowed only at effort `high` or below).
- `api/messages-api.md`, `api/tool-use.md` — added `claude-opus-5` to model tables.

### Claude Code

- `claude-code/CHANGELOG.md` — refreshed through **v2.1.220** (verbatim). Opus 5 default + fast mode; nested subagents now spawn to depth 3 by default; `/code-review` runs as a background subagent; new `DirectoryAdded` hook; new `sandbox.network.strictAllowlist` and `workflowSizeGuideline` settings; dynamic workflows default to <15 agents; accessibility + Windows path fixes.
- `claude-code/hooks.md` — content changed: 35 documented hook events; `SessionStart` gains a `fork` source; new SessionStart/Setup/SubagentStart output fields (`initialUserMessage`, `watchPaths`, `sessionTitle`, `reloadSkills`); **behavior change (v2.1.214): a hook exiting 2 with invalid JSON now BLOCKS the action.**
- `claude-code/plugins.md` — multi-`--plugin-url` support; `claude plugin validate --strict`.
- `engineering/claude-code-best-practices.md` — NEW (long-standing backlog item, ~5 cycles). Anthropic's agentic-coding best-practices guide.

### SDKs

- `sdks/python/CHANGELOG.md` — through **0.120.2** (2026-07-28).
- `sdks/typescript/CHANGELOG.md` — through **0.115.0** (2026-07-24); README copy fix.
- `agent-sdk/README.md`, `agent-sdk/quickstart.md` — **both TS and Python SDKs now bundle the native Claude Code binary** (was TS-only).

### Research / Release Notes / Repos

- `research/index.md`, `research/societal-impacts.md`, `research/policy.md` — new July posts (Frontier Red Team: cryptographic weaknesses, Project Pilot drone, Claude plays robotics; How Canada uses Claude; Claude's values across models and languages).
- `research/papers/index.md` — added interpretability paper "Verbalizable Representations Form a Global Workspace in Language Models" (transformer-circuits.pub, Jul 6).
- `release-notes/{platform,api,help-center}.md` — Opus 5 launch, fast mode removed for Opus 4.7, Workbench sunset (Aug 17), Enterprise Admin API, HIPAA self-serve, memory-system revamp.
- `github-repos/index.md` — star refresh + 4 new repos (92 → 96): code-migration-kit-with-claude-code, cryptography-research-demo, k12-teacher-skills, rayon.
- `skills/catalog.md` — star count 161k → 166k.

## So What — Why It Matters

- **Opus 5 is the new default Opus.** Any project pinning `claude-opus-4-8` or relying on the "default Opus" will now resolve differently. The one breaking change to note: with Opus 5 you can only disable extended thinking at effort `high` or below — `thinking:{type:"disabled"}` at `xhigh`/`max` returns HTTP 400.
- **Sonnet 5 is the new Free/Pro default** and carries promotional pricing ($2/$10) only through Aug 31, 2026 — relevant for cost estimates on Sonnet-tier workloads.
- **Hooks behavior change (v2.1.214):** a hook that exits 2 with malformed JSON now _blocks_ the action instead of being ignored. If any of our automation relies on hooks, malformed output is now a hard stop, not a silent pass.
- **Both Agent SDKs bundle the native binary now** — Python users no longer need a separate Claude Code install.
- **Deprecations:** Opus 4.1 still retires **Aug 5, 2026** (3 days out); replacement pointer is now Opus 5. Legacy Workbench + experimental prompt-tools APIs retire **Aug 17, 2026** (new Workbench at `/playground`).

## Action Items

- **[Aug 5, 2026 — imminent]** Claude Opus 4.1 retires in 3 days. Anything still on `claude-opus-4-1` must migrate (recommended target: Opus 5).
- **[Aug 17, 2026]** Legacy Workbench + experimental prompt-tools APIs retire. Migrate to `/playground` if used.
- **[Stale source — 6th consecutive cycle]** `agent-sdk-typescript-v2-preview` (`agent-sdk/typescript-v2-preview.md`, source `github.com/anthropics/agent-sdk`) has been 404 for 6 cycles and produces a recurring validation warning. Recommend removing the manifest entry + local file. Flagged as a background task rather than deleted during this unattended run.
- **[Discovery backlog]** ~16 untracked engineering/research posts surfaced (see `tasks/discovery-log.md`) — e.g. claude-code-auto-mode, harness-design-long-running-apps, managed-agents, how-we-contain-claude. Top 3 auto-added this cycle; remainder deferred for review.
- **No breaking changes to our own tooling.** The update pipeline, validation, and schemas are unaffected.
