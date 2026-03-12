# CEV Decision: Research Swarm Gap Remediation

**Date:** 2026-03-05
**Depth:** Analysis
**Evaluated:** 12 recommendations from research swarm (~48 documentation gaps)

## Classifications

### Aligned (10)
1. Add Claude Apps release notes — extends existing release-notes/ pattern
2. Add engineering blog posts (7) — owner identified this gap class in discovery-gaps.md
3. Add research papers/posts (3) — incremental expansion of research/ category
4. Add news/announcements (7) — extends existing model announcement pattern
5. Add platform docs pages (14) — same source type as existing api/ docs
6. Track all SDK changelogs (Java, Go, Ruby, C#, PHP) — consistency with Python/TS pattern
7. Track Agent SDK releases — agent-sdk/ category exists but lacks release tracking
8. Track new GitHub repos — maintenance of existing github-api source
9. (renumbered as 11) Claude Code changelog re-sync with curl — follows established procedure
10. (renumbered as 12, partial) Skills docs update — see Tension below

### Tension (1)
- Skills docs: Completeness vs. overwrite protection (github-raw sources)
- Deferred pending: check if info exists upstream (re-fetch) vs. needs new manual source

### Deferred (2)
- Update skill to check ALL remote branches — valid, lower priority than content gaps
  - Trigger: After content gaps resolved
- Post-update verification step (manifest vs. live indexes) — significant tooling, premature
  - Trigger: If next update cycle produces 10+ missed sources

### Rejected (0)

## Evidence Sources
- CLAUDE.md — "single source of truth" purpose statement
- memory/MEMORY.md — github-raw verbatim rules, branch-checking pain point
- memory/discovery-gaps.md — prevention checklist, prior gap root cause
- manifest.json — existing patterns (source types, categories, coverage boundaries)
- github-repos/index.md — all 7 SDK repos listed

## Override Status
Pending user response. No override recorded yet.
