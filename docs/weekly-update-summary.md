---
title: "Weekly Update Summary"
fetched_at: "2026-09-06T00:00:00Z"
category: "docs"
---

# Weekly Update Summary — 2026-09-06

**The repo is current and clean: 13 docs refreshed, 23 new first-party sources added, manifest now 150 sources, 0 validation errors.** The week's headline is a new model launch (Fable 5.1 / Mythos 5.1) and the Python SDK crossing into its 1.x major line.

## What Changed

### Models

- **New:** `models/claude-fable-5-1-mythos-5-1.md` — Fable 5.1 / Mythos 5.1 launch (Sept 1, 2026).
- **Refreshed:** `models/overview.md`, `models/deprecations.md`, `api/models-overview.md` — current lineup (Fable 5.1/Mythos 5.1, Opus 5, Sonnet 5, Opus 4.8, Haiku 4.5).

### SDKs (github-raw, content changed)

- `sdks/python/CHANGELOG.md` — **major 1.x release line; top now 1.4.0 (2026-09-04)**, up from 0.122.0.
- `sdks/python/README.md` — min Python 3.9+ → **3.10+**; model example `claude-opus-4-6` → `claude-opus-5`; v1 migration note.
- `sdks/typescript/CHANGELOG.md` — top now **0.124.0 (2026-09-04)**, up from 0.117.1.
- `sdks/typescript/README.md` — min TypeScript ≥ 4.9 → **≥ 5.0**.

### Claude Code (github-raw + manual)

- `claude-code/CHANGELOG.md` — through **2.1.263**: `/skill-doctor`, `bashOutputMaxChars`/`taskOutputMaxChars` settings, `--append-subagent-system-prompt-file`, "Organization policy" in `/status` & `claude doctor`.
- `claude-code/hooks.md` — **expanded to 33 hook events** (new: `PostToolUseFailure`, `PostToolBatch`, `PreModelSwitch`, `TeammateIdle`, `TaskCompleted`, `PermissionRequest`, `PermissionDenied`, `Elicitation`/`ElicitationResult`, `MessageDisplay`, `WorktreeRemove`, `PostCompact`, `InstructionsLoaded`) plus new fields `if`, `statusMessage`, `once`.

### GitHub repos index

- `github-repos/index.md` — **99 → 106 repos**. New: sandbox-runtime, commerce-agents, fermats-last-theorem, formal-math, oncall-kit, xls, claude-tag-wif-gateway-sample, OpenROAD-flow-scripts. Star jumps: skills +5,152 (→174,799), claude-code +2,612 (→144,237).

### Research (10 new posts) + index refresh

New files: riemann-zeta (math), claude-accelerates-protein-design (science), global-workspace (interpretability), formalizing-fermats-last-theorem, automated-researchers-mitigate-alignment-failures, discovering-cryptographic-weaknesses, project-pilot, how-canada-uses-claude, reviewing-the-evidence-on-worker-retraining-programs, enabling-independent-research. `research/index.md` refreshed with the 6 genuinely-new (post-Aug-2) entries.

### News (10 new) + Engineering (2 new)

News: redeploying-fable-5, model-hardware-standard-research-preview, claude-text-watermark, enterprise-frontier-safeguards, improving-alignment-security-efforts, expanding-support-for-scientists, improving-fable-5-s-biology-safeguards, investigating-incidents-cybersecurity-evals, position-open-weights-models, wellbeing-research-grants. Engineering (backfill): april-23-postmortem, swe-bench-sonnet.

## So What — Why It Matters

1. **Fable 5.1 is ~25% cheaper than Fable 5 for typical workloads** (cache-read pricing cut), same model with two safeguard tiers (Fable = GA; Mythos = trusted-access, cyber/bio). It can now discover software vulnerabilities (not develop exploits); cyber safeguards block 60% fewer false positives. If any project is on Fable 5, 5.1 is a low-risk, cheaper drop-in worth testing.
2. **Python SDK 1.x is a breaking major version.** Any pinned `anthropic` dependency below 1.0 should plan a migration pass (min Python is now 3.10+). The README's own v1 migration note is the starting point.
3. **The hooks surface roughly doubled — 33 events now.** New events like `TaskCompleted`, `PreModelSwitch`, `PermissionRequest`/`PermissionDenied`, and `PostToolBatch` open automation points that didn't exist before (e.g. gating on task completion, reacting to model switches, custom permission logic). Worth a look for anyone building Claude Code guards.

## Action Items

- **Optional, low-risk:** evaluate Fable 5.1 as a cheaper replacement wherever Fable 5 is used.
- **If you use the Python SDK below 1.0:** schedule a 1.x migration (min Python 3.10+). No action forced today.
- **Housekeeping (needs your call):** the tracked source `agent-sdk-typescript-v2` (`github.com/anthropics/agent-sdk`) has been 404 for ~8 cycles. It emits one staleness warning per run. A task chip is queued to either remove the entry + `agent-sdk/typescript-v2-preview.md`, or repoint it to the current Agent SDK docs. One click resolves it.
- **Deferred to a PDF-capable run:** the Fable 5.1 / Mythos 5.1 System Card PDF (first-party, on www-cdn.anthropic.com) was found but not ingested.

_Validation: 0 errors, 81 advisory staleness warnings (frozen article snapshots we intentionally don't re-fetch). arXiv: no new Anthropic-authored papers this cycle — recent hits were third-party papers that merely use Claude._
