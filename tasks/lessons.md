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
