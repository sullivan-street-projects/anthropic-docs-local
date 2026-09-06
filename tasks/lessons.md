---
title: "Project Lessons"
created_at: "2026-02-02T00:00:00Z"
---

# Lessons Learned

Accumulated corrections and patterns from working on this repository. Review at session start.

## Source Updates

- **X/Twitter scraping:** WebFetch cannot read tweets directly (requires JS). Use the **fxtwitter API** (`api.fxtwitter.com/user/status/id`) for tweet text extraction — this is the only reliable method as of March 2026. The HTML variants (fxtwitter.com, vxtwitter.com) now redirect back to X. Nitter is dead (503). ThreadReaderApp only works for pre-unrolled threads. For full articles linked from tweets, extract the URL from the fxtwitter API response and fetch that separately.
- **Manual sources depend on model knowledge:** Files with `source_type: manual` are synthesized from Claude's training data, not fetched from URLs. Confidence is capped at 0.7 and `review_status` stays `needs-review`. Always spot-check against official docs.
- **SHA256 hashes in manifest:** These are computed from local file content, not from source URLs. Must recompute after every file write using `shasum -a 256`.

## Architecture Decisions

- **`tasks/` directory is project-portable:** Task tracking files (`todo.md`, `lessons.md`) persist across sessions and users, unlike ephemeral tools. Any Claude session can pick up where the last left off.
- **Star counts in github-repos/index.md drift fast:** Popular repos can gain thousands of stars per week. Refresh on every full update cycle.

## Meta-Synthesis Patterns

- **Most content changes are timestamp-only:** In a full 78-file update, only ~10 files had actual content changes. Phase 4 should quickly filter to just those.
- **CHANGELOG is the richest signal:** New features listed in CHANGELOG often imply documentation updates needed elsewhere (e.g., new hooks → update best practices docs).
- **Hook event changes cascade:** When hooks.md gains new events, check all docs that reference hooks for completeness.
- **Our concurrency design is validated by Anthropic's own multiagent research:** `research/multiagent-systems.md` (Frontier Red Team, 2026-08-13) names the exact failure modes our update pipeline engineers against — "turf wars" over shared state (→ single-writer manifest.json), "epistemic vulnerability to deception" i.e. agents trusting each other's claims (→ recompute sha256 from disk, never trust agent-reported hashes), and "conformity/low-variance collapse" (→ give agents orthogonal, non-overlapping source sets). Keep these three invariants when changing the orchestration: single-writer manifest, verify-from-disk, orthogonal work partitions.
- **The single-writer reconcile clears the timestamp-mismatch warning class:** Syncing manifest `last_fetched` to each file's frontmatter `fetched_at` during the orchestrator's reconcile pass (recompute sha256 + read fetched_at, all from disk) keeps Layer-3 (timestamp) and Layer-4 (integrity) consistent in one step. Run the reconcile script (`--write`) as the ONLY manifest mutation after agents finish; never let agents write manifest.json.
- **Re-verify a suspected-dead source before acting, but don't auto-delete unattended:** For a source flagged stale 3+ cycles, `curl -sL -o /dev/null -w "%{http_code}"` the source_url to confirm 404. If dead, the skill's Phase 4e says log + alert the user (task chip), not auto-remove — permanent deletion needs user confirmation. Auto-deletion of a tracked doc file is out of scope for an unattended scheduled run.

## URL Patterns

- **Always use `www.anthropic.com`:** Some Anthropic URLs 404 without the `www.` prefix. Always use `www.anthropic.com/...` not `anthropic.com/...` for WebFetch calls.
- **resources.anthropic.com PDFs drift:** HubSpot CDN URLs for PDFs can change without notice. As of 2026-04-05, two tracked PDFs (building-skills-guide, how-anthropic-teams-use) are returning 404. Check for new URLs during discovery runs.
- **agent-sdk repo 404:** `github.com/anthropics/agent-sdk` has been 404 for 3 consecutive update cycles (since 2026-03-22). Likely renamed, made private, or consolidated. Consider removing from manifest.

## Workflow Patterns

- **Parallel agent launches save time:** When updating manual sources, launch all claude-code-guide agents in parallel rather than sequentially. 7 agents in parallel completes faster than 7 sequential runs.
- **Discovery mode should run after every full update:** New repos appear frequently. Run `--discover` to catch them before they accumulate.
- **Recompute sha256 from disk, NOT from agent reports:** A PostToolUse markdown formatter hook reflows `.md` files AFTER an update agent writes them, so the sha256 an agent computes right after its Write no longer matches the on-disk bytes. When agents write content files and report hashes, the orchestrator must **recompute every hash from disk** before updating manifest.json (a tiny Node script over `manifest.sources` works well). Trusting agent-reported hashes will produce Layer-4 integrity failures. (Observed 2026-08-02 across 4 agents.)
- **Split "content writes" (parallel) from "manifest bookkeeping" (single-writer):** Have update agents write ONLY their content files and report back {file, changed?, notes}; the orchestrator alone edits manifest.json. N agents concurrently editing manifest.json race and clobber each other. This also pairs with the recompute-from-disk rule above.
- **Don't falsely bump timestamps for unfetched snapshots:** ~65 web-extracted one-off articles (individual news/research/engineering posts) never change after publication. Re-fetching all of them every week burns tokens for near-zero change. It's honest and cheaper to fetch only volatile sources (CHANGELOGs, version data, index/aggregation pages, model pages, manual docs) and leave stable snapshots' `last_fetched` at their real last-fetch date — frontmatter and manifest stay consistent, so validation passes.
- **Background fetch agents stall at the ~600s stream watchdog:** In the 2026-09-06 run, 3 of 6 background `general-purpose` agents failed with "Agent stalled: no progress for 600s (stream watchdog did not recover)" — always on the LAST or second-to-last source of a long serial batch (manual docs, volatile web-extracted). The already-written files persisted; only the final report was lost. Mitigations: (1) keep each background agent's batch small (≤~6 slow WebFetch sources) so it finishes under the watchdog; (2) for volatile web-extracted / manual sets, the orchestrator can fetch inline via WebFetch (the 600s watchdog is background-agent-specific and does NOT apply to the orchestrator's own tool calls); (3) after any stall, `git status` the agent's target paths to see what landed, verify the mid-write file's integrity (frontmatter + no truncation), and finish the remainder directly. Do NOT resume a stalled agent — redo the unfinished items inline.
- **A stalled agent can leave a changed body with an un-bumped `fetched_at`:** The web-extracted agent updated `api/models-overview.md`'s body (correct new-model content) but stalled before writing the frontmatter timestamp, leaving `fetched_at` at the old date while git showed the file modified. During reconcile, don't rely on the agent's timestamp — the finalize script syncs `last_fetched` to frontmatter, but ALSO manually bump `fetched_at` on any file git reports as modified whose timestamp is stale, or the two will disagree.
- **Auto-add really does clear the backlog:** This run auto-added all 22 discovered first-party anthropic.com sources (per the unattended-run rule) with zero validation errors. Confirms the memory rule: during scheduled/unattended runs, add HIGH/MEDIUM first-party sources immediately rather than reporting-only, or they compound week over week.
