---
title: "Weekly Update Summary"
date: "2026-07-12"
---

# Weekly Update Summary — 2026-07-12

## What Changed

117 files updated across all 12 categories, +5,346 lines / -2,566 lines.

### SDK & Tool Updates

- **Claude Code CHANGELOG**: 3 new versions (2.1.205-207) — auto mode on Bedrock/Vertex/Foundry without opt-in, `/cd` directory suggestions, `/doctor` CLAUDE.md trimming check, auto mode anti-tampering rule, plugin security fixes
- **Python SDK**: 4 new versions (0.114.0-0.116.0) — claude-sonnet-5 support, managed agents streaming, agent memory beta header
- **TypeScript SDK**: 5 new versions (0.108.0-0.111.0) — dreaming API support, claude-sonnet-5 support, managed agents streaming
- **GitHub repos index**: 78 → 92 repos (14 new including claude-for-legal, financial-services, claudes-c-compiler, defending-code-reference-harness)

### API Documentation — Claude Sonnet 5 Rollout

- All 15 API docs updated for Claude Sonnet 5 support
- **api/overview.md**: New pagination section (page/next_page cursor scheme)
- **api/errors.md**: Added 409 conflict_error, SDK auto-retry behavior
- **api/migration-guide.md**: New Sonnet 5 migration section (breaking: extended thinking error, new tokenizer ~30% more tokens, adaptive thinking on by default) and Mythos 5 migration section
- **api/extended-thinking.md**: Sonnet 5 support, thinking block encryption section
- **api/effort-parameter.md**: xhigh now available on Sonnet 5, new recommended effort levels section
- **api/memory-tool.md**: Expanded tool command documentation, cURL examples, security details
- **api/web-search-tool.md**: Dynamic filtering for Sonnet 5, batch requests section, encrypted_content pass-back

### Models & Deprecations

- **models/overview.md**: Latest models now Fable 5, Opus 4.8, Sonnet 5, Haiku 4.5; added Fable 5/Mythos 5 section; Sonnet 5 introductory pricing ($2/$10 through Aug 31)
- **models/deprecations.md**: Opus 4.1 deprecated (June 5, retiring Aug 5); Opus 4/Sonnet 4 retired (June 15); temperature/top_p/top_k deprecated for Opus 4.7+; Haiku 3 retired

### Engineering (11 content changes)

- **desktop-extensions.md**: Major expansion — complete manifest.json examples, building steps, cross-platform support, Claude Code integration
- **demystifying-evals.md**: Major expansion — YAML task examples, pass@k/pass^k metrics, 9-step roadmap, comparison table
- **effective-context-engineering.md**: Runtime context retrieval, progressive disclosure, hybrid strategies
- **advanced-tool-use.md**: JSON code examples, Opus 4/4.5 accuracy improvements (49%→74%, 79.5%→88.1%)
- **writing-tools-for-agents.md**: Three-phase iterative process, ResponseFormat enum example
- **ai-resistant-technical-evaluations.md**: Version 2/3 modifications, Zachtronics puzzles
- **building-c-compiler.md**: Bash loop example, resource metrics table with token counts

### Research

- **2 new July 2026 papers**: "An off switch for dual-use knowledge in AI models" (Jul 8), "A global workspace in language models" (Jul 6)
- research/alignment.md and research/interpretability.md indexes updated

### Release Notes

- **release-notes/platform.md**: 30+ new entries April-July 2026 — Claude Opus 4.7/4.8, Fable 5, Mythos 5, Sonnet 5, Managed Agents, MCP tunnels, ant CLI, advisor tool, Claude Platform on AWS
- **release-notes/help-center.md**: Cowork GA, Claude Design, Trusted Devices, Claude Tag, Compliance API
- **sdks/other/overview.md**: Restructured to "CLI, SDKs, and Libraries" — now includes ant CLI, Apple Foundation Models Swift package, OpenAI SDK compatibility layer

### Other Updates

- **claude-code/hooks.md**: New StopFailure event matchers (overloaded, oauth_org_not_allowed, etc.), notification matchers (elicitation_complete, agent_needs_input), prompt_id field, CLAUDE_CODE_BRIDGE_SESSION_ID env var
- **claude-code/scheduled-tasks.md**: Major rewrite — scheduling comparison table, seven-day expiry (was 3-day), self-paced mode with Monitor tool
- **news/labor-market-impacts.md**: Added missing Figure 7 correction note from upstream
- **skills/catalog.md**: Stars 156k → 161k

## So What — Why It Matters

- **Claude Sonnet 5 is live** with introductory pricing through Aug 31. Breaking changes: extended thinking now errors (use adaptive), new tokenizer produces ~30% more tokens, adaptive thinking on by default. Migration guide updated.
- **Opus 4.1 is deprecated** (retiring Aug 5, 2026). Opus 4/Sonnet 4 already retired. Use Opus 4.8 as replacement.
- **temperature/top_p/top_k deprecated** for Opus 4.7+ models. Sampling parameters may be rejected.
- **SDK dreaming API** support added in TypeScript SDK — new capability for agent development.
- **Managed Agents streaming** added in both Python and TypeScript SDKs — relevant for agent orchestration.
- **ant CLI** now available as a first-class tool alongside the SDKs.
- **14 new GitHub repos** from Anthropic — notably claude-for-legal and financial-services (industry-specific tooling).

## Action Items

- [ ] Review Sonnet 5 migration guide before upgrading any API integrations
- [ ] Update any code using temperature/top_p/top_k with Opus 4.7+ models
- [ ] Plan migration off Opus 4.1 before Aug 5, 2026 retirement
- [ ] Run full discovery scan (`/update-anthropic-docs --discover`) — ~36 new sources detected but not fully enumerated
- [ ] Consider removing agent-sdk-typescript-v2-preview from manifest (5th consecutive 404)

## Meta-Synthesis

- Applied: Updated 3 agent-sdk source URLs (platform.claude.com → code.claude.com migration)
- agent-sdk-typescript-v2-preview: 5th consecutive 404 — strongly recommend removal
- 2 resource.anthropic.com PDFs still 404ing — CDN URLs may have changed
