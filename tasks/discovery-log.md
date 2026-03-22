---
title: "Discovery Log"
created_at: "2026-03-15T00:00:00Z"
---

# Discovery Log

Track new sources found per discovery run. Prevents re-discovering or missing sources across sessions.

## Format

```
### YYYY-MM-DD — Discovery Run
- **New sources found**: N
- **Added**: list of source_ids added to manifest
- **Deferred**: list of URLs found but not added (with reason)
- **Rejected**: list of URLs found but explicitly excluded (with reason)
```

## Log

### 2026-03-22 — Quick Discovery Scan (during weekly update)
- **New sources found**: 16
- **Added**: 0 (automated run — user not present to approve)
- **Deferred (HIGH priority — recommend adding next)**:
  - https://www.anthropic.com/81k-interviews — news — "What 81,000 people want from AI" (major publication)
  - https://www.anthropic.com/engineering/claude-code-best-practices — engineering — "Claude Code: Best practices for agentic coding"
  - https://github.com/anthropics/agent-sdk-workshop — agent-sdk — Official Agent SDK workshop materials
  - https://github.com/anthropics/claude-constitution — models — Claude's foundational values document as a repo
- **Deferred (MEDIUM priority)**:
  - https://www.anthropic.com/research/introspection — research — "Signs of introspection in large language models"
  - https://www.anthropic.com/research/constitutional-classifiers — research — "Constitutional Classifiers: Defending against universal jailbreaks"
  - https://www.anthropic.com/research/alignment-faking — research — "Alignment faking in large language models"
  - https://github.com/anthropics/financial-services-plugins — skills — Financial services plugins repo
  - https://github.com/anthropics/knowledge-work-plugins — skills — Knowledge work plugins repo
  - https://github.com/anthropics/anthropic-cli — github-repos — Anthropic CLI tool
- **Deferred (LOW priority)**:
  - https://www.anthropic.com/engineering/swe-bench-sonnet — engineering — Older (Claude 3.5 era)
  - https://github.com/anthropics/claudes-c-compiler — github-repos — Demo project
  - https://github.com/anthropics/terragrunt — github-repos — Internal fork
  - https://github.com/anthropics/tokio — github-repos — Internal fork
  - https://github.com/anthropics/buffa — github-repos — Internal infra
  - https://github.com/anthropics/connect-rust — github-repos — Internal infra
- **SDK versions**: npm @anthropic-ai/sdk 0.80.0, PyPI anthropic 0.86.0 (changelogs tracked)
- **Staleness alert**: agent-sdk/typescript-v2-preview.md source (github.com/anthropics/agent-sdk) returning 404

### 2026-03-15 — Quick Discovery Scan (during full update)
- **New sources found**: 25
- **Added**: All 25 sources added to manifest and fetched (see below)
- **Deferred (Tier 1 — add immediately)**:
  - https://www.anthropic.com/news/claude-partner-network — news (2026-03-12)
- **Deferred (Tier 2 — March, pre-last-update)**:
  - https://www.anthropic.com/news/where-stand-department-war — news (2026-03-05)
  - https://www.anthropic.com/news/mozilla-firefox-security — news (2026-03-06)
  - https://www.anthropic.com/engineering/eval-awareness-browsecomp — engineering (2026-03-06)
  - https://www.anthropic.com/news/sydney-fourth-office-asia-pacific — news (2026-03-10)
  - https://www.anthropic.com/news/the-anthropic-institute — news (2026-03-11)
- **Deferred (Tier 3 — February, HIGH priority)**:
  - https://www.anthropic.com/news/claude-sonnet-4-6 — models (2026-02-17)
  - https://www.anthropic.com/research/measuring-agent-autonomy — research (2026-02-18)
  - https://www.anthropic.com/engineering/building-c-compiler — engineering (2026-02-05)
  - https://www.anthropic.com/engineering/infrastructure-noise — engineering (2026-02-03)
- **Deferred (Tier 4 — January and older, 15 items)**:
  - Claude is a space to think, Claude's new constitution, advanced tool use, code execution with MCP, Claude Code sandboxing, desktop extensions, think tool, building effective agents, contextual retrieval, India country brief, AI assistance coding skills, disempowerment patterns, assistant axis, Project Vend phase two
- **Notes**: No new arxiv papers found. Run full `/update-anthropic-docs --discover` to add these sources.
