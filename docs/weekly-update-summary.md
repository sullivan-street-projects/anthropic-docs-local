---
title: "Weekly Update Summary"
date: "2026-07-27"
---

# Weekly Update Summary — 2026-07-27

## What Changed

116 files updated across all 12 categories, +1,049 lines / -456 lines.

### Claude Opus 5 Launch (July 24)

- **release-notes/platform.md**: Claude Opus 5 launched at $5/$25 per MTok, 1M context, 128k output, thinking on by default
- **claude-code/CHANGELOG.md**: Opus 5 set as default Opus model in Claude Code (v2.1.219)
- **sdks/python/CHANGELOG.md**: Opus 5 model ID constants added (v0.120.0)
- **sdks/typescript/CHANGELOG.md**: Opus 5 support added (v0.115.0)

### Claude Code Updates (v2.1.217–2.1.220)

- Subagent nesting depth tripled (1 → 3)
- `/code-review` now runs as background subagent
- `/deep-research` no longer auto-launches; manual only
- Dynamic workflows default to medium size guideline (< 15 agents)
- Emoji shortcode autocomplete (`:heart:`)
- Numerous bug fixes: Windows path corruption, Vim mode, screen reader, auto-compact on Bedrock, background shell isolation

### Platform Release Notes (6 new entries)

- July 24: Opus 5 launch; breaking: `thinking: disabled` at effort `xhigh`/`max` returns 400
- July 24: Fast mode removed for Opus 4.7 (errors, no fallback)
- July 22: Mid-conversation tool changes beta (Fable 5, Mythos 5, Opus 4.8, Opus 5)
- July 22: `fallbacks` parameter `"default"` mode; Managed Agents enhancements
- July 17: Legacy Workbench sunset August 17; experimental prompt tools APIs retiring
- July 14: Admin API beta for Enterprise user management

### SDK Updates

- **Python SDK** (v0.114.0–0.120.0): Opus 5 support, Dreams API, managed agents streaming
- **TypeScript SDK** (v0.109.0–0.115.0): Opus 5 support, Dreams API, managed agents streaming

### Help Center Release Notes

- July 24: Opus 5 available on all plan tiers
- July 14: HIPAA self-serve configuration
- July 10: Updated memory system

### Other

- **github-repos/index.md**: Star counts and metadata refreshed
- **claude-code/scheduled-tasks.md**: Minor content update
- 96 files: timestamp-only updates

## So What — Why It Matters

### BREAKING: Opus 5 Thinking Constraint
Cannot disable thinking at `xhigh` or `max` effort on Opus 5. Any workflow using `thinking: {"type": "disabled"}` with high effort will get 400 errors on the new model.

### BREAKING: Opus 4.7 Fast Mode Removed
`speed: "fast"` on Opus 4.7 now returns an error (unlike 4.6, which fell back to standard speed). Must migrate to Opus 5 or 4.8.

### Legacy Workbench Sunset — August 17
Old Workbench in Claude Console retiring. Saved prompts, variables, and evals won't carry over. Export before August 17.

### Mid-Conversation Tool Changes (Beta)
Dynamically add/remove tools mid-conversation. Useful for agent architectures that scope tools based on conversation state. Requires beta header.

### 36 New Sources Discovered
Discovery scan found 36 new URLs not yet tracked, including:
- Claude Opus 5 and Sonnet 5 announcement pages
- "How we contain Claude across products" (engineering — security architecture)
- "Scaling Managed Agents" (engineering — agent infrastructure)
- "A global workspace in language models" (research — interpretability)
- "Claude for Teachers", "Claude Science" (new product verticals)
- Multiple research papers on robotics, values, dual-use knowledge

## Action Items

- [ ] **URGENT**: Audit code using `thinking: disabled` with `xhigh`/`max` effort — breaks on Opus 5
- [ ] **URGENT**: Migrate Opus 4.7 fast mode usage to Opus 5 or 4.8
- [ ] **Before Aug 17**: Export saved prompts/evals from legacy Workbench
- [ ] Evaluate Claude Opus 5 for production (same price as 4.8, "step-change improvement")
- [ ] Run `/update-anthropic-docs --discover` to add 36 new sources (Opus 5/Sonnet 5 pages, engineering posts, research)
- [ ] Consider removing agent-sdk-typescript-v2-preview from manifest (6th consecutive 404)
- [ ] Test mid-conversation tool changes beta if relevant to agent workflows
- [ ] Consider `fallbacks: "default"` for simpler refusal handling
