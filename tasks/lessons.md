---
title: "Project Lessons"
created_at: "2026-02-02T00:00:00Z"
---

# Lessons Learned

Accumulated corrections and patterns from working on this repository. Review at session start.

## Source Updates

- **X/Twitter scraping:** WebFetch cannot read tweets (requires JS). Use vxTwitter API (`api.vxtwitter.com`) for single tweet text, ThreadReaderApp via Apify for full threads. Direct Apify tweet scrapers often return `noResults` for individual tweet URLs.
- **Manual sources depend on model knowledge:** Files with `source_type: manual` are synthesized from Claude's training data, not fetched from URLs. Confidence is capped at 0.7 and `review_status` stays `needs-review`. Always spot-check against official docs.
- **SHA256 hashes in manifest:** These are computed from local file content, not from source URLs. Must recompute after every file write using `shasum -a 256`.

## Architecture Decisions

- **`tasks/` directory is project-portable:** Task tracking files (`todo.md`, `lessons.md`) persist across sessions and users, unlike ephemeral tools. Any Claude session can pick up where the last left off.
- **Star counts in github-repos/index.md drift fast:** Popular repos can gain thousands of stars per week. Refresh on every full update cycle.

## Workflow Patterns

- **Parallel agent launches save time:** When updating manual sources, launch all claude-code-guide agents in parallel rather than sequentially. 7 agents in parallel completes faster than 7 sequential runs.
- **Discovery mode should run after every full update:** New repos appear frequently. Run `--discover` to catch them before they accumulate.
