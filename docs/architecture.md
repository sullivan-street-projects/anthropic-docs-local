---
title: "Architecture Overview"
generated_at: "2026-01-11T16:48:41.988Z"
generator: "scripts/generate-architecture.js"
---

# Anthropic Docs Local - Architecture

> Auto-generated from manifest.json on 2026-01-11

## Overview

| Metric | Value |
|--------|-------|
| Total Sources | 39 |
| Research Papers | 14 |
| Categories | 10 |
| Schema Version | 1.0.0 |
| Last Full Update | 2026-01-10T00:00:00Z |

## Source Types Distribution

| Type | Count | Description |
|------|-------|-------------|
| github-raw | 8 | Direct fetch from GitHub raw URLs |
| github-api | 1 | GitHub API endpoint parsing |
| web-extracted | 22 | WebFetch with content extraction |
| manual | 7 | Agent-synthesized from internal docs |
| arxiv-pdfs | 1 | Downloaded PDF papers |

## Review Status Distribution

| Status | Count | Description |
|--------|-------|-------------|
| auto | 10 | High-confidence sources, auto-trusted |
| needs-review | 29 | Should be periodically human-verified |
| human-verified | 0 | Recently verified by human |

## Categories

### agent-sdk

| File | Source Type | Confidence |
|------|-------------|------------|
| [Agent SDK README](../agent-sdk/README.md) | manual | 0.7 |
| [Agent SDK Quickstart](../agent-sdk/quickstart.md) | manual | 0.7 |
| [Agent SDK Examples](../agent-sdk/examples.md) | manual | 0.7 |

### api

| File | Source Type | Confidence |
|------|-------------|------------|
| [API Overview](../api/overview.md) | web-extracted | 0.75 |
| [Messages API](../api/messages-api.md) | web-extracted | 0.75 |
| [Tool Use Guide](../api/tool-use.md) | web-extracted | 0.75 |
| [Vision API](../api/vision.md) | web-extracted | 0.75 |
| [Streaming API](../api/streaming.md) | web-extracted | 0.75 |
| [API Errors](../api/errors.md) | web-extracted | 0.75 |

### claude-code

| File | Source Type | Confidence |
|------|-------------|------------|
| [Claude Code README](../claude-code/README.md) | github-raw | 0.95 |
| [Claude Code CHANGELOG](../claude-code/CHANGELOG.md) | github-raw | 0.95 |
| [Claude Code Features](../claude-code/features.md) | manual | 0.7 |
| [Claude Code Hooks](../claude-code/hooks.md) | manual | 0.7 |
| [Claude Code MCP Servers](../claude-code/mcp-servers.md) | manual | 0.7 |
| [Claude Code Plugins](../claude-code/plugins.md) | manual | 0.7 |
| [Claude Code Best Practices](../claude-code/best-practices.md) | web-extracted | 0.75 |

### cookbooks

| File | Source Type | Confidence |
|------|-------------|------------|
| [Cookbooks Index](../cookbooks/index.md) | github-raw | 0.95 |

### github-repos

| File | Source Type | Confidence |
|------|-------------|------------|
| [GitHub Repos Index](../github-repos/index.md) | github-api | 0.9 |

### models

| File | Source Type | Confidence |
|------|-------------|------------|
| [Models Overview](../models/overview.md) | web-extracted | 0.75 |
| [Claude Opus 4.5](../models/claude-opus-4-5.md) | web-extracted | 0.75 |
| [Claude Sonnet 4.5](../models/claude-sonnet-4-5.md) | web-extracted | 0.75 |
| [Claude Haiku 4.5](../models/claude-haiku-4-5.md) | web-extracted | 0.75 |
| [Model Deprecations](../models/deprecations.md) | web-extracted | 0.75 |

### release-notes

| File | Source Type | Confidence |
|------|-------------|------------|
| [Platform Release Notes](../release-notes/platform.md) | web-extracted | 0.75 |
| [API Release Notes](../release-notes/api.md) | web-extracted | 0.75 |
| [Help Center Release Notes](../release-notes/help-center.md) | web-extracted | 0.75 |

### research

| File | Source Type | Confidence |
|------|-------------|------------|
| [Research Index](../research/index.md) | web-extracted | 0.75 |
| [Alignment Research](../research/alignment.md) | web-extracted | 0.75 |
| [Interpretability Research](../research/interpretability.md) | web-extracted | 0.75 |
| [Societal Impacts Research](../research/societal-impacts.md) | web-extracted | 0.75 |
| [Policy Research](../research/policy.md) | web-extracted | 0.75 |
| [Research Papers Index](../research/papers/index.md) | arxiv-pdfs | 0.95 |

### sdks

| File | Source Type | Confidence |
|------|-------------|------------|
| [Python SDK README](../sdks/python/README.md) | github-raw | 0.95 |
| [Python SDK CHANGELOG](../sdks/python/CHANGELOG.md) | github-raw | 0.95 |
| [TypeScript SDK README](../sdks/typescript/README.md) | github-raw | 0.95 |
| [TypeScript SDK CHANGELOG](../sdks/typescript/CHANGELOG.md) | github-raw | 0.95 |
| [Other SDKs Overview](../sdks/other/overview.md) | web-extracted | 0.75 |

### skills

| File | Source Type | Confidence |
|------|-------------|------------|
| [Skills README](../skills/README.md) | github-raw | 0.95 |
| [Skills Catalog](../skills/catalog.md) | web-extracted | 0.75 |

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
│   └── examples.md
├── api/
│   ├── overview.md
│   ├── messages-api.md
│   ├── tool-use.md
│   ├── vision.md
│   ├── streaming.md
│   └── errors.md
├── claude-code/
│   ├── README.md
│   ├── CHANGELOG.md
│   ├── features.md
│   ├── hooks.md
│   ├── mcp-servers.md
│   ├── plugins.md
│   └── best-practices.md
├── cookbooks/
│   └── index.md
├── github-repos/
│   └── index.md
├── models/
│   ├── overview.md
│   ├── claude-opus-4-5.md
│   ├── claude-sonnet-4-5.md
│   ├── claude-haiku-4-5.md
│   └── deprecations.md
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
│   └── index.md
├── sdks/
│   ├── README.md
│   ├── CHANGELOG.md
│   ├── README.md
│   ├── CHANGELOG.md
│   └── overview.md
├── skills/
│   ├── README.md
│   └── catalog.md
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
