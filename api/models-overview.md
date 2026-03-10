---
title: "Models Overview"
source_url: "https://platform.claude.com/docs/en/docs/about-claude/models"
source_type: "web-extracted"
fetched_at: "2026-03-10T00:00:00Z"
category: "api"
---

# Models Overview

Claude is a family of state-of-the-art large language models developed by Anthropic. All current Claude models support text and image input, text output, multilingual capabilities, and vision.

## Latest Models (Recommended)

| Feature | Claude Opus 4.6 | Claude Sonnet 4.6 | Claude Haiku 4.5 |
|:--------|:----------------|:------------------|:-----------------|
| **Description** | Most intelligent — agents and coding | Best speed/intelligence balance | Fastest, near-frontier intelligence |
| **API ID** | claude-opus-4-6 | claude-sonnet-4-6 | claude-haiku-4-5-20251001 |
| **Pricing** | $5/$25 per MTok (in/out) | $3/$15 per MTok | $1/$5 per MTok |
| **Extended thinking** | Yes (adaptive) | Yes | Yes |
| **Adaptive thinking** | Yes | Yes | No |
| **Context window** | 200K / 1M (beta) | 200K / 1M (beta) | 200K |
| **Max output** | 128K tokens | 64K tokens | 64K tokens |
| **Reliable knowledge cutoff** | May 2025 | Aug 2025 | Feb 2025 |
| **Training data cutoff** | Aug 2025 | Jan 2026 | Jul 2025 |

## Legacy Models (Still Available)

| Feature | Claude Sonnet 4.5 | Claude Opus 4.5 | Claude Opus 4.1 | Claude Sonnet 4 | Claude Opus 4 |
|:--------|:------------------|:----------------|:----------------|:----------------|:--------------|
| **API ID** | claude-sonnet-4-5-20250929 | claude-opus-4-5-20251101 | claude-opus-4-1-20250805 | claude-sonnet-4-20250514 | claude-opus-4-20250514 |
| **Pricing** | $3/$15 | $5/$25 | $15/$75 | $3/$15 | $15/$75 |
| **Context** | 200K/1M | 200K | 200K | 200K/1M | 200K |
| **Max output** | 64K | 64K | 32K | 64K | 32K |

**Deprecated:** Claude Haiku 3 (`claude-3-haiku-20240307`) — retiring April 19, 2026. Migrate to Haiku 4.5.

## Platform Availability

Models are available via:
- Claude API (direct)
- AWS Bedrock
- Google Vertex AI
- Microsoft Foundry (select models)

Starting with Claude Sonnet 4.5 and subsequent models, AWS Bedrock and Google Vertex AI offer two endpoint types: **global endpoints** (dynamic routing) and **regional endpoints** (guaranteed geographic routing).

## Key Capabilities

- **Performance:** Top-tier results in reasoning, coding, multilingual tasks, long-context handling, honesty, and image processing
- **Adaptive thinking:** Opus 4.6 and Sonnet 4.6 support dynamic thinking allocation
- **1M context:** Beta support for 1M token context window on select models
- **Context awareness:** Sonnet 4.6, Sonnet 4.5, and Haiku 4.5 track remaining context budget

## Migration

For migration guides, see the [migration guide](https://platform.claude.com/docs/en/docs/about-claude/models/migration-guide).
