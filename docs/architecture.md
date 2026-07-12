---
title: "Architecture Overview"
generated_at: "2026-07-12T15:50:08.463Z"
generator: "scripts/generate-architecture.js"
---

# Anthropic Docs Local - Architecture

> Auto-generated from manifest.json on 2026-07-12

## Overview

| Metric | Value |
|--------|-------|
| Total Sources | 117 |
| Research Papers | 14 |
| Categories | 12 |
| Schema Version | 1.0.0 |
| Last Full Update | 2026-07-12T00:00:00Z |
| Last Discovery Run | N/A |

## Source Types Distribution

| Type | Count | Description |
|------|-------|-------------|
| github-raw | 8 | Direct fetch from GitHub raw URLs |
| github-api | 1 | GitHub API endpoint parsing |
| web-extracted | 97 | WebFetch with content extraction |
| manual | 9 | Agent-synthesized from internal docs |
| arxiv-pdfs | 2 | Downloaded PDF papers |

## Review Status Distribution

| Status | Count | Description |
|--------|-------|-------------|
| auto | 94 | High-confidence sources, auto-trusted |
| needs-review | 0 | Should be periodically human-verified |
| human-verified | 0 | Recently verified by human |

## Categories

### agent-sdk

| File | Source Type | Confidence |
|------|-------------|------------|
| [Agent SDK README](../agent-sdk/README.md) | manual | 0.85 |
| [Agent SDK Quickstart](../agent-sdk/quickstart.md) | manual | 0.85 |
| [Agent SDK Examples](../agent-sdk/examples.md) | manual | 0.85 |
| [Agent SDK - TypeScript v2 Preview](../agent-sdk/typescript-v2-preview.md) | web-extracted | 0.7 |

### api

| File | Source Type | Confidence |
|------|-------------|------------|
| [API Overview](../api/overview.md) | web-extracted | 0.85 |
| [Messages API](../api/messages-api.md) | web-extracted | 0.85 |
| [Tool Use Guide](../api/tool-use.md) | web-extracted | 0.85 |
| [Vision API](../api/vision.md) | web-extracted | 0.85 |
| [Streaming API](../api/streaming.md) | web-extracted | 0.85 |
| [API Errors](../api/errors.md) | web-extracted | 0.85 |
| [Adaptive Thinking](../api/adaptive-thinking.md) | web-extracted | 0.9 |
| [Server-Side Context Compaction](../api/compaction.md) | web-extracted | 0.9 |
| [Context Windows](../api/context-windows.md) | web-extracted | 0.9 |
| [Models Overview](../api/models-overview.md) | web-extracted | 0.9 |
| [Migration Guide - Claude 4.6](../api/migration-guide.md) | web-extracted | 0.9 |
| [Extended Thinking](../api/extended-thinking.md) | web-extracted | 0.9 |
| [Effort Parameter (Fast Mode)](../api/effort-parameter.md) | web-extracted | 0.9 |
| [Memory Tool](../api/memory-tool.md) | web-extracted | 0.9 |
| [Web Search Tool](../api/web-search-tool.md) | web-extracted | 0.9 |

### claude-code

| File | Source Type | Confidence |
|------|-------------|------------|
| [Claude Code README](../claude-code/README.md) | github-raw | 0.95 |
| [Claude Code CHANGELOG](../claude-code/CHANGELOG.md) | github-raw | 0.95 |
| [Claude Code Features](../claude-code/features.md) | manual | 0.85 |
| [Claude Code Hooks](../claude-code/hooks.md) | manual | 0.85 |
| [Claude Code MCP Servers](../claude-code/mcp-servers.md) | manual | 0.85 |
| [Claude Code Plugins](../claude-code/plugins.md) | manual | 0.85 |
| [Boris Cherny Personal Setup (Jan 2)](../claude-code/best-practices.md) | web-extracted | 0.9 |
| [Boris Cherny Team Tips (Jan 31)](../claude-code/boris-thread-jan31.md) | web-extracted | 0.9 |
| [CLAUDE.md Instructions Template (Community)](../claude-code/claude-md-instructions.md) | web-extracted | 0.85 |
| [Claude Code Guide for Designers — Felix Lee](../claude-code/felix-lee-designer-guide.md) | web-extracted | 0.9 |
| [Best Practices: /loop Command & Scheduling](../docs/best-practices-loop-scheduling.md) | manual | 0.9 |
| [Best Practices: MCP Credential Management & Access Control](../docs/best-practices-mcp-credentials.md) | manual | 0.9 |
| [Claude Code Scheduled Tasks](../claude-code/scheduled-tasks.md) | web-extracted | 0.9 |
| [Effective Context Engineering for AI Agents](../claude-code/context-engineering.md) | web-extracted | 0.9 |
| [How Anthropic Teams Use Claude Code](../claude-code/how-anthropic-teams-use-claude-code.md) | web-extracted | 0.9 |
| [How Anthropic Teams Use Claude Code (PDF)](../claude-code/how-anthropic-teams-use-claude-code.pdf) | web-extracted | 1 |

### cookbooks

| File | Source Type | Confidence |
|------|-------------|------------|
| [Cookbooks Index](../cookbooks/index.md) | github-raw | 0.95 |

### engineering

| File | Source Type | Confidence |
|------|-------------|------------|
| [Effective context engineering for AI agents](../engineering/effective-context-engineering.md) | web-extracted | 0.85 |
| [Effective harnesses for long-running agents](../engineering/effective-harnesses-for-long-running-agents.md) | web-extracted | 0.85 |
| [How we built our multi-agent research system](../engineering/multi-agent-research-system.md) | web-extracted | 0.85 |
| [Writing Effective Tools for Agents](../engineering/writing-tools-for-agents.md) | web-extracted | 0.85 |
| [Designing AI-resistant technical evaluations](../engineering/ai-resistant-technical-evaluations.md) | web-extracted | 0.85 |
| [A postmortem of three recent issues](../engineering/postmortem-three-recent-issues.md) | web-extracted | 0.85 |
| [Demystifying Evals for AI Agents](../engineering/demystifying-evals-for-ai-agents.md) | web-extracted | 0.85 |
| [Eval awareness in Claude Opus 4.6's BrowseComp performance](../engineering/eval-awareness-browsecomp.md) | web-extracted | 0.85 |
| [Building a C compiler with a team of parallel Claudes](../engineering/building-c-compiler.md) | web-extracted | 0.85 |
| [Quantifying infrastructure noise in agentic coding evals](../engineering/infrastructure-noise.md) | web-extracted | 0.85 |
| [Introducing advanced tool use on the Claude Developer Platform](../engineering/advanced-tool-use.md) | web-extracted | 0.85 |
| [Code execution with MCP: Building more efficient agents](../engineering/code-execution-with-mcp.md) | web-extracted | 0.85 |
| [Beyond permission prompts: making Claude Code more secure and autonomous](../engineering/claude-code-sandboxing.md) | web-extracted | 0.85 |
| [Desktop Extensions: One-click MCP server installation](../engineering/desktop-extensions.md) | web-extracted | 0.85 |
| [The think tool](../engineering/claude-think-tool.md) | web-extracted | 0.85 |
| [Building effective agents](../engineering/building-effective-agents.md) | web-extracted | 0.85 |
| [Contextual Retrieval](../engineering/contextual-retrieval.md) | web-extracted | 0.85 |

### github-repos

| File | Source Type | Confidence |
|------|-------------|------------|
| [GitHub Repos Index](../github-repos/index.md) | github-api | 0.9 |

### models

| File | Source Type | Confidence |
|------|-------------|------------|
| [Models Overview](../models/overview.md) | web-extracted | 0.85 |
| [Claude Opus 4.6](../models/claude-opus-4-6.md) | web-extracted | 0.85 |
| [Claude Opus 4.5](../models/claude-opus-4-5.md) | web-extracted | 0.85 |
| [Claude Sonnet 4.5](../models/claude-sonnet-4-5.md) | web-extracted | 0.85 |
| [Claude Haiku 4.5](../models/claude-haiku-4-5.md) | web-extracted | 0.85 |
| [Model Deprecations](../models/deprecations.md) | web-extracted | 0.85 |
| [Claude Sonnet 4.6](../models/claude-sonnet-4-6.md) | web-extracted | 0.85 |
| [Claude Fable 5 and Claude Mythos 5](../models/claude-fable-5-mythos-5.md) | web-extracted | 0.85 |
| [Introducing Claude Opus 4.7](../models/claude-opus-4-7.md) | web-extracted | 0.85 |
| [Claude Opus 4.8](../models/claude-opus-4-8.md) | web-extracted | 0.85 |

### news

| File | Source Type | Confidence |
|------|-------------|------------|
| [Claude Code Security: Frontier Cybersecurity Now Available](../news/claude-code-security.md) | web-extracted | 0.85 |
| [Detecting and Preventing Distillation Attacks](../news/detecting-distillation-attacks.md) | web-extracted | 0.85 |
| [Responsible Scaling Policy Version 3.0](../news/responsible-scaling-policy-v3.md) | web-extracted | 0.85 |
| [Anthropic Acquires Vercept](../news/acquires-vercept.md) | web-extracted | 0.85 |
| [Statement from Dario Amodei on Department of War](../news/statement-department-of-war.md) | web-extracted | 0.85 |
| [Statement on Secretary of War Comments](../news/statement-secretary-war-comments.md) | web-extracted | 0.85 |
| [Labor Market Impacts of AI](../news/labor-market-impacts.md) | web-extracted | 0.85 |
| [Anthropic invests $100M into the Claude Partner Network](../news/claude-partner-network.md) | web-extracted | 0.85 |
| [Where things stand with the Department of War](../news/where-stand-department-war.md) | web-extracted | 0.85 |
| [Partnering with Mozilla to improve Firefox's security](../news/mozilla-firefox-security.md) | web-extracted | 0.85 |
| [Sydney will become Anthropic's fourth office in Asia-Pacific](../news/sydney-fourth-office-asia-pacific.md) | web-extracted | 0.85 |
| [Introducing The Anthropic Institute](../news/the-anthropic-institute.md) | web-extracted | 0.85 |
| [Claude is a space to think](../news/claude-is-a-space-to-think.md) | web-extracted | 0.85 |
| [Claude's new constitution](../news/claude-new-constitution.md) | web-extracted | 0.85 |
| [Claude on Mars](../news/claude-on-mars.md) | web-extracted | 0.85 |
| [Introducing Claude Corps](../news/claude-corps.md) | web-extracted | 0.85 |
| [Introducing Claude Opus 4.8](../news/claude-opus-4-8.md) | web-extracted | 0.85 |
| [Statement on Fable 5 / Mythos 5 access](../news/fable-mythos-access.md) | web-extracted | 0.85 |
| [Introducing Claude Tag](../news/introducing-claude-tag.md) | web-extracted | 0.85 |
| [Anthropic raises $65B in Series H](../news/series-h.md) | web-extracted | 0.85 |

### release-notes

| File | Source Type | Confidence |
|------|-------------|------------|
| [Platform Release Notes](../release-notes/platform.md) | web-extracted | 0.85 |
| [API Release Notes](../release-notes/api.md) | web-extracted | 0.85 |
| [Help Center Release Notes](../release-notes/help-center.md) | web-extracted | 0.85 |

### research

| File | Source Type | Confidence |
|------|-------------|------------|
| [Research Index](../research/index.md) | web-extracted | 0.85 |
| [Alignment Research](../research/alignment.md) | web-extracted | 0.85 |
| [Interpretability Research](../research/interpretability.md) | web-extracted | 0.85 |
| [Societal Impacts Research](../research/societal-impacts.md) | web-extracted | 0.85 |
| [Policy Research](../research/policy.md) | web-extracted | 0.85 |
| [Research Papers Index](../research/papers/index.md) | arxiv-pdfs | 0.95 |
| [Deprecation Updates for Claude Opus 3](../research/deprecation-updates-opus-3.md) | web-extracted | 0.85 |
| [The Persona Selection Model](../research/persona-selection-model.md) | web-extracted | 0.85 |
| [The AI Fluency Index](../research/ai-fluency-index.md) | web-extracted | 0.85 |
| [OpenDev: Building Effective AI Coding Agents for the Terminal](../research/opendev-coding-agents.md) | arxiv-pdfs | 0.9 |
| [Measuring AI agent autonomy in practice](../research/measuring-agent-autonomy.md) | web-extracted | 0.85 |
| [India Country Brief: The Anthropic Economic Index](../research/india-brief-economic-index.md) | web-extracted | 0.85 |
| [How AI assistance impacts the formation of coding skills](../research/ai-assistance-coding-skills.md) | web-extracted | 0.85 |
| [Disempowerment patterns in real-world AI usage](../research/disempowerment-patterns.md) | web-extracted | 0.85 |
| [The assistant axis: situating and stabilizing character in LLMs](../research/assistant-axis.md) | web-extracted | 0.85 |
| [Project Vend: Phase two](../research/project-vend-2.md) | web-extracted | 0.85 |
| [Paving the way for agents in biology](../research/agents-in-biology.md) | web-extracted | 0.85 |
| [Agentic coding and persistent returns to expertise](../research/claude-code-expertise.md) | web-extracted | 0.85 |
| [Anthropic Economic Index: Cadences (June 2026)](../research/economic-index-june-2026.md) | web-extracted | 0.85 |
| [Natural Language Autoencoders](../research/natural-language-autoencoders.md) | web-extracted | 0.85 |
| [Teaching Claude why](../research/teaching-claude-why.md) | web-extracted | 0.85 |

### sdks

| File | Source Type | Confidence |
|------|-------------|------------|
| [Python SDK README](../sdks/python/README.md) | github-raw | 0.95 |
| [Python SDK CHANGELOG](../sdks/python/CHANGELOG.md) | github-raw | 0.95 |
| [TypeScript SDK README](../sdks/typescript/README.md) | github-raw | 0.95 |
| [TypeScript SDK CHANGELOG](../sdks/typescript/CHANGELOG.md) | github-raw | 0.95 |
| [Other SDKs Overview](../sdks/other/overview.md) | web-extracted | 0.85 |

### skills

| File | Source Type | Confidence |
|------|-------------|------------|
| [Skills README](../skills/README.md) | github-raw | 0.95 |
| [Skills Catalog](../skills/catalog.md) | web-extracted | 0.85 |
| [The Complete Guide to Building Skills for Claude](../skills/building-skills-guide.md) | web-extracted | 0.95 |
| [Building Skills Guide (PDF)](../skills/building-skills-guide.pdf) | web-extracted | 1 |

## Directory Structure

```
anthropic-docs-local/
├── manifest.json           # Central registry
├── CLAUDE.md               # Project constitution
├── schemas/
│   ├── manifest.schema.json
│   └── frontmatter.schema.json
├── scripts/
│   ├── validate.js
│   └── generate-architecture.js
├── docs/
│   └── architecture.md     # This file (auto-generated)
├── agent-sdk/
│   ├── README.md
│   ├── quickstart.md
│   ├── examples.md
│   └── typescript-v2-preview.md
├── api/
│   ├── overview.md
│   ├── messages-api.md
│   ├── tool-use.md
│   ├── vision.md
│   ├── streaming.md
│   ├── errors.md
│   ├── adaptive-thinking.md
│   ├── compaction.md
│   ├── context-windows.md
│   ├── models-overview.md
│   ├── migration-guide.md
│   ├── extended-thinking.md
│   ├── effort-parameter.md
│   ├── memory-tool.md
│   └── web-search-tool.md
├── claude-code/
│   ├── README.md
│   ├── CHANGELOG.md
│   ├── features.md
│   ├── hooks.md
│   ├── mcp-servers.md
│   ├── plugins.md
│   ├── best-practices.md
│   ├── boris-thread-jan31.md
│   ├── claude-md-instructions.md
│   ├── felix-lee-designer-guide.md
│   ├── best-practices-loop-scheduling.md
│   ├── best-practices-mcp-credentials.md
│   ├── scheduled-tasks.md
│   ├── context-engineering.md
│   ├── how-anthropic-teams-use-claude-code.md
│   └── how-anthropic-teams-use-claude-code.pdf
├── cookbooks/
│   └── index.md
├── engineering/
│   ├── effective-context-engineering.md
│   ├── effective-harnesses-for-long-running-agents.md
│   ├── multi-agent-research-system.md
│   ├── writing-tools-for-agents.md
│   ├── ai-resistant-technical-evaluations.md
│   ├── postmortem-three-recent-issues.md
│   ├── demystifying-evals-for-ai-agents.md
│   ├── eval-awareness-browsecomp.md
│   ├── building-c-compiler.md
│   ├── infrastructure-noise.md
│   ├── advanced-tool-use.md
│   ├── code-execution-with-mcp.md
│   ├── claude-code-sandboxing.md
│   ├── desktop-extensions.md
│   ├── claude-think-tool.md
│   ├── building-effective-agents.md
│   └── contextual-retrieval.md
├── github-repos/
│   └── index.md
├── models/
│   ├── overview.md
│   ├── claude-opus-4-6.md
│   ├── claude-opus-4-5.md
│   ├── claude-sonnet-4-5.md
│   ├── claude-haiku-4-5.md
│   ├── deprecations.md
│   ├── claude-sonnet-4-6.md
│   ├── claude-fable-5-mythos-5.md
│   ├── claude-opus-4-7.md
│   └── claude-opus-4-8.md
├── news/
│   ├── claude-code-security.md
│   ├── detecting-distillation-attacks.md
│   ├── responsible-scaling-policy-v3.md
│   ├── acquires-vercept.md
│   ├── statement-department-of-war.md
│   ├── statement-secretary-war-comments.md
│   ├── labor-market-impacts.md
│   ├── claude-partner-network.md
│   ├── where-stand-department-war.md
│   ├── mozilla-firefox-security.md
│   ├── sydney-fourth-office-asia-pacific.md
│   ├── the-anthropic-institute.md
│   ├── claude-is-a-space-to-think.md
│   ├── claude-new-constitution.md
│   ├── claude-on-mars.md
│   ├── claude-corps.md
│   ├── claude-opus-4-8.md
│   ├── fable-mythos-access.md
│   ├── introducing-claude-tag.md
│   └── series-h.md
├── release-notes/
│   ├── platform.md
│   ├── api.md
│   └── help-center.md
├── research/
│   ├── index.md
│   ├── alignment.md
│   ├── interpretability.md
│   ├── societal-impacts.md
│   ├── policy.md
│   ├── index.md
│   ├── deprecation-updates-opus-3.md
│   ├── persona-selection-model.md
│   ├── ai-fluency-index.md
│   ├── opendev-coding-agents.md
│   ├── measuring-agent-autonomy.md
│   ├── india-brief-economic-index.md
│   ├── ai-assistance-coding-skills.md
│   ├── disempowerment-patterns.md
│   ├── assistant-axis.md
│   ├── project-vend-2.md
│   ├── agents-in-biology.md
│   ├── claude-code-expertise.md
│   ├── economic-index-june-2026.md
│   ├── natural-language-autoencoders.md
│   └── teaching-claude-why.md
├── sdks/
│   ├── README.md
│   ├── CHANGELOG.md
│   ├── README.md
│   ├── CHANGELOG.md
│   └── overview.md
├── skills/
│   ├── README.md
│   ├── catalog.md
│   ├── building-skills-guide.md
│   └── building-skills-guide.pdf
```

## Validation

Run validation to ensure consistency:

```bash
node scripts/validate.js
```

## Regenerating This Document

```bash
node scripts/generate-architecture.js
```
