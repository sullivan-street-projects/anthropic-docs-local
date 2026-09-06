---
title: "Update Failure Log"
created_at: "2026-03-15T00:00:00Z"
---

# Update Failure Log

Track source-specific failures with resolutions. Review at session start to avoid repeating mistakes.

## Format

```
### YYYY-MM-DD — source_id
- **Error**: What went wrong
- **Resolution**: What fixed it
- **Prevention**: Rule to add to lessons.md or validate.js if recurring
```

## Log

### 2026-03-22 — agent-sdk-typescript-v2-preview

- **Error**: WebFetch of `https://github.com/anthropics/agent-sdk` returned 404. The repository may have been renamed, made private, or reorganized.
- **Resolution**: Skipped update for this source. Existing local content preserved unchanged; only `fetched_at` timestamp updated.
- **Prevention**: Check repository status before future update runs. If 404 persists across multiple cycles, consider removing from manifest or updating the source_url.

### 2026-04-05 — agent-sdk-typescript-v2-preview

- **Error**: WebFetch of `https://github.com/anthropics/agent-sdk` returned 404 again (second consecutive cycle).
- **Resolution**: Skipped update. Existing local content preserved; only `fetched_at` timestamp updated.
- **Prevention**: Repository has been 404 for 2 consecutive cycles. Consider removing from manifest or marking as archived. May have been consolidated into the main anthropic-sdk repos.

### 2026-04-05 — skills-building-skills-guide (PDF)

- **Error**: `curl -sL` of `https://resources.anthropic.com/hubfs/Building-effective-agents-using-skills-for-Claude.pdf` returned 404 HTML page (102 bytes). PDF no longer hosted at this URL.
- **Resolution**: Skipped update. Existing local content preserved; only `fetched_at` timestamp updated.
- **Prevention**: Check if PDF moved to a new URL on resources.anthropic.com. The HubSpot CDN may have reorganized.

### 2026-04-05 — how-anthropic-teams-use-claude-code (PDF)

- **Error**: `curl -sL` of `https://resources.anthropic.com/hubfs/anthropic-how-teams-use-claude-code.pdf` returned 404 HTML page (102 bytes). PDF no longer hosted at this URL.
- **Resolution**: Skipped update. Existing local content preserved; only `fetched_at` timestamp updated.
- **Prevention**: Check if PDF moved to a new URL on resources.anthropic.com. The HubSpot CDN may have reorganized.

### 2026-04-05 — skills-catalog (GitHub)

- **Error**: WebFetch of `https://github.com/anthropics/anthropic-cookbook/tree/main/misc/prompt_caching/skills` returned 404. Path may have been removed or reorganized.
- **Resolution**: Updated skills/catalog.md from `https://github.com/anthropics/skills` instead (the correct current source). Star count updated from 70.5k to 111k.
- **Prevention**: The source_url in manifest may be stale — the skills repo moved to `github.com/anthropics/skills`. Update manifest source_url if recurring.

### 2026-04-05 — research index pages (interpretability, alignment, societal-impacts, policy)

- **Error**: Multiple research URLs returned 404 without `www.` prefix. E.g., `anthropic.com/research/mapping-the-mind-of-a-large-language-model` 404'd but `www.anthropic.com/research/team/interpretability` worked.
- **Resolution**: Fetched team-level pages successfully. Existing research category files already have richer content than the team overview pages, so no content updates needed.
- **Prevention**: Always use `www.anthropic.com` prefix for Anthropic website URLs. Some paths require it.

### 2026-04-05 — where-stand-department-war

- **Error**: URL without `www.` prefix returned 404. `www.anthropic.com/news/where-stand-department-war` succeeded.
- **Resolution**: Fetched successfully with `www.` prefix. Existing content matches fetched content; no update needed.
- **Prevention**: Ensure all `anthropic.com` URLs use `www.` prefix.

### 2026-08-02 — agent-sdk-typescript-v2-preview (6th consecutive)

- **Error**: `github.com/anthropics/agent-sdk` remains 404 — now 6 consecutive full-update cycles (03-22, 04-05, 07-12, 08-02 confirmed; flagged every cycle). Also produces a recurring Layer-3 validation warning (frontmatter=2026-04-05 vs manifest last_fetched=2026-07-12).
- **Resolution**: Existing local content preserved; timestamps left untouched (source not re-fetchable). NOT deleted during this unattended run.
- **Prevention**: Removal is overdue — flagged as a background task chip for the user to remove the manifest entry (`agent-sdk-typescript-v2-preview`) AND the local file `agent-sdk/typescript-v2-preview.md` in one action. Once removed, the recurring warning disappears. Do not keep re-flagging beyond this — escalate to removal.

### 2026-08-16 — agent-sdk-typescript-v2 (confirmed 404, removal escalated)

- **Error**: `https://github.com/anthropics/agent-sdk` returns HTTP 404 (re-verified this cycle via curl). Source now 133 days stale. Manifest id is `agent-sdk-typescript-v2` (the earlier failures log referenced it as `...-v2-preview`; a separate `-preview` id was already removed). Local file `agent-sdk/typescript-v2-preview.md` is still validly tracked by the `agent-sdk-typescript-v2` entry (not an orphan).
- **Resolution**: NOT re-fetched (known dead, correctly excluded from fetch agents). NOT auto-deleted in this unattended run — the update skill's Phase 4e protocol says a 404 gets logged + user-alerted, not auto-removed, and permanent deletion needs user confirmation. Re-surfaced as a one-click removal task chip for the user.
- **Prevention**: This is the concrete case motivating optimizations plan item #18 (`lifecycle_status`). Until #18 lands, a confirmed-404 source will keep emitting one staleness warning per cycle. User action: remove the `agent-sdk-typescript-v2` manifest entry + `agent-sdk/typescript-v2-preview.md`, OR repoint to the current Agent SDK docs (code.claude.com/docs/en/agent-sdk/*).

### 2026-08-16 — no fetch failures (actively-fetched sources)

- **Note**: All actively-fetched sources succeeded (8 github-raw, 9 manual, 14 volatile web-extracted, github-repos API, arXiv search, 7 new-source fetches). No 404s on code.claude.com, platform.claude.com, or the 7 new anthropic.com posts. The only 404 was the already-known dead `agent-sdk-typescript-v2` (above), which is intentionally not fetched. 0 sha256 mismatches after single-writer reconcile.

### 2026-08-02 — no fetch failures

- **Note**: All actively-fetched sources (github-raw, github-api, manual, arxiv, volatile web-extracted) succeeded this cycle. No 404s on code.claude.com or platform.claude.com. Dual model launch (Opus 5 / Sonnet 5) made this an unusually high-signal week (26 content-changed files, 0 timestamp-only).

### 2026-09-06 — three background agents stalled (600s watchdog)
- **Error**: 3 of 6 background `general-purpose` fetch agents failed with "Agent stalled: no progress for 600s (stream watchdog did not recover)": (1) volatile web-extracted+arxiv (1st attempt), (2) manual docs, (3) volatile web-extracted (replacement). Each stalled on the final/near-final source of its serial batch; the report was lost but written files persisted.
- **Resolution**: Recovered by `git status` on each agent's target paths, verifying what landed, then finishing the remainder inline via the orchestrator's own WebFetch (not subject to the background watchdog): confirmed `api/models-overview.md` body was complete and bumped its stale `fetched_at`; confirmed `api/migration-guide.md` already carried Opus 5 content (no change needed); added the 6 genuinely-new post rows to `research/index.md`. `claude-code/hooks.md` (the one manual change) landed fine. Net: no content lost.
- **Prevention**: See new lessons.md entries — cap background-agent batch sizes and/or fetch volatile sets inline. (Observed 2026-09-06.)

### 2026-09-06 — agent-sdk-typescript-v2 (confirmed 404, ~8th cycle)
- **Error**: `https://github.com/anthropics/agent-sdk` returns HTTP 404 (re-verified this cycle via curl). Source last_fetched 2026-04-05 (~154 days stale). Emits one Layer-4 staleness warning per cycle.
- **Resolution**: NOT re-fetched (known dead, excluded from fetch agents). NOT auto-deleted (Phase 4e: 404 → log + user-alert; permanent deletion needs user confirmation). Re-surfaced as a one-click removal task chip.
- **Prevention**: Overdue for removal — remove the `agent-sdk-typescript-v2` manifest entry + `agent-sdk/typescript-v2-preview.md`, OR repoint to current Agent SDK docs (code.claude.com/docs/en/agent-sdk/*). This is the concrete case for optimizations item #18 (lifecycle_status).
