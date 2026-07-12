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

### 2026-07-12 — Weekly Update (manual + arXiv + partial discovery)

- **Manual sources refreshed**: 9 (1 content-changed, 8 timestamp-only)
  - CONTENT_CHANGED: claude-code/hooks.md (expanded StopFailure matchers: overloaded, oauth_org_not_allowed, invalid_request, model_not_found, server_error, max_output_tokens, unknown; expanded Notification matchers: elicitation_complete, elicitation_response, agent_needs_input, agent_completed; added prompt_id common input field; added CLAUDE_CODE_BRIDGE_SESSION_ID env var)
  - TIMESTAMP_ONLY: features.md, mcp-servers.md, plugins.md, agent-sdk/README.md, agent-sdk/quickstart.md, agent-sdk/examples.md, best-practices-loop-scheduling.md, best-practices-mcp-credentials.md
- **arXiv papers**: 1 new paper added to index
  - NEW: 2601.20245 "How AI Assistance Impacts the Formation of Coding Skills" (Shen, Tamkin, Jan 2026)
- **Discovery scan**: Started but results lost to context compaction; needs follow-up run
- **Agent SDK docs**: Confirmed redirect from platform.claude.com to code.claude.com (301/307); existing content still current
- **Notes**: Manifest updated with new sha256 hashes for all 11 modified files. Validation passes with expected hash warnings for files modified by parallel update agents.

### 2026-04-05 — Quick Discovery Scan (during weekly update)

- **New sources found**: 61
- **Added**: 0 (automated run — user not present to approve)
- **Deferred (HIGH priority — recommend adding next)**:
  - https://www.anthropic.com/engineering/claude-code-best-practices — engineering — "Claude Code: Best practices for agentic coding" (STILL UNTRACKED from 03-22)
  - https://www.anthropic.com/engineering/claude-code-auto-mode — engineering — "Claude Code auto mode: a safer way to skip permissions"
  - https://www.anthropic.com/engineering/harness-design-long-running-apps — engineering — "Harness design for long-running application development"
  - https://www.anthropic.com/news/apple-xcode-claude-agent-sdk — news — "Apple's Xcode now supports the Claude Agent SDK"
  - https://www.anthropic.com/news/anthropic-raises-30-billion-series-g-funding-380-billion-post-money-valuation — news — "$30B Series G at $380B"
  - https://www.anthropic.com/news/australia-MOU — news — "Australian government AI safety MOU"
  - https://www.anthropic.com/research/emotion-concepts-function — research — "Emotion concepts and their function in a large language model"
  - https://www.anthropic.com/research/reasoning-models-dont-say-think — research — "Reasoning Models Don't Always Say What They Think"
  - https://www.anthropic.com/research/introspection — research — "Signs of introspection in large language models" (STILL UNTRACKED from 03-22)
  - https://www.anthropic.com/research/constitutional-classifiers — research — "Constitutional Classifiers" (STILL UNTRACKED from 03-22)
  - https://www.anthropic.com/research/alignment-faking — research — "Alignment faking in large language models" (STILL UNTRACKED from 03-22)
  - https://www.anthropic.com/research/long-running-Claude — research — "Long-running Claude for scientific computing"
  - https://www.anthropic.com/research/introducing-anthropic-science — research — "Introducing our Science Blog"
  - https://www.anthropic.com/research/economic-index-march-2026-report — research — "Economic Index: Learning curves (March 2026)"
  - https://www.anthropic.com/research/how-australia-uses-claude — research — "How Australia Uses Claude"
  - https://www.anthropic.com/81k-interviews — news — "What 81,000 people want from AI" (STILL UNTRACKED from 03-22)
  - https://github.com/anthropics/agent-sdk-workshop — agent-sdk — Workshop materials (STILL UNTRACKED from 03-22)
  - https://github.com/anthropics/claude-constitution — models — Constitution repo (STILL UNTRACKED from 03-22)
- **Deferred (MEDIUM priority)**:
  - 9 alignment blog posts at alignment.anthropic.com/2026/ (abstractive-red-teaming, coding-audit-realism, automated-alignment-agent, auditbench, challenges-hopes, psm, hot-mess-of-ai, auditing-overt-saboteur, petri-v2)
  - 3 red team blog posts at red.anthropic.com/2026/ (exploit, cyber-toolkits-update, critical-infrastructure-defense)
  - https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation — news — MCP donated to Agentic AI Foundation
  - 10 additional news articles (partnerships, offices, board appointments)
  - https://www.anthropic.com/engineering/swe-bench-sonnet — engineering — SWE-bench results
  - 5 research articles (vibe-physics, diff-tool, estimating-productivity-gains, how-ai-is-transforming-work, exploring-model-welfare)
  - https://github.com/anthropics/financial-services-plugins — skills (STILL UNTRACKED)
  - https://github.com/anthropics/knowledge-work-plugins — skills (STILL UNTRACKED)
  - https://github.com/anthropics/anthropic-cli — github-repos (STILL UNTRACKED)
- **Deferred (LOW priority)**:
  - 13 news articles (electricity prices, donations, appointments, case studies, compliance)
- **PDF staleness**: resources.anthropic.com returning 404 for 2 tracked PDFs — may need URL updates
- **Staleness alert**: agent-sdk/typescript-v2-preview.md source returning 404 (3rd consecutive cycle — recommend removal)

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
