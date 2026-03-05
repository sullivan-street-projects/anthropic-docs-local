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

## Workflow Patterns

- **Parallel agent launches save time:** When updating manual sources, launch all claude-code-guide agents in parallel rather than sequentially. 7 agents in parallel completes faster than 7 sequential runs.
- **Discovery mode should run after every full update:** New repos appear frequently. Run `--discover` to catch them before they accumulate.
