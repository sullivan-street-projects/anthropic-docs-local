---
title: "Models Overview"
source_url: "https://platform.claude.com/docs/en/docs/about-claude/models"
source_type: "web-extracted"
fetched_at: "2026-06-28T00:00:00Z"
category: "api"
---

# Models Overview

Claude is a family of state-of-the-art large language models developed by Anthropic. All current Claude models support text and image input, text output, multilingual capabilities, and vision. Models are available through the Claude API, Claude Platform on AWS, Amazon Bedrock, Google Cloud, and Microsoft Foundry.

## Claude Fable 5 and Claude Mythos 5

Claude Fable 5 (`claude-fable-5`) is Anthropic's most capable widely released model. Claude Mythos 5 (`claude-mythos-5`) joins the invitation-only Claude Mythos Preview (`claude-mythos-preview`) within Project Glasswing.

| Feature | Claude Fable 5 | Claude Mythos 5 |
|:--------|:---------------|:----------------|
| **Description** | Most capable widely released model, for demanding reasoning and long-horizon agentic work | Available through Project Glasswing. Successor to Claude Mythos Preview. |
| **Claude API ID** | `claude-fable-5` | `claude-mythos-5` |
| **AWS Bedrock ID** | anthropic.claude-fable-5 | Limited availability |
| **Google Cloud ID** | claude-fable-5 | Limited availability |
| **Extended thinking** | No | No |
| **Adaptive thinking** | Yes (always on) | Yes (always on) |
| **Context window** | 1M tokens | 1M tokens |
| **Max output** | 128k tokens | 128k tokens |
| **Pricing** | $10 / $50 per MTok (input / output) | $10 / $50 per MTok (input / output) |

Claude Fable 5 is generally available on the Claude API, Claude Platform on AWS, Amazon Bedrock, Google Cloud, and Microsoft Foundry beginning June 9, 2026. Claude Mythos 5 is not generally available: it is offered in limited availability to approved customers in Project Glasswing.

> **Note:** Claude Fable 5 and Claude Mythos 5 use the tokenizer introduced with Claude Opus 4.7. Compared to models before Claude Opus 4.7, the same text produces roughly 30% more tokens.

## Latest Models (Recommended)

| Feature | Claude Opus 4.8 | Claude Sonnet 4.6 | Claude Haiku 4.5 |
|:--------|:----------------|:------------------|:-----------------|
| **Description** | Most capable Opus-tier model for complex reasoning and agentic coding | Best combination of speed and intelligence | Fastest model with near-frontier intelligence |
| **Claude API ID** | claude-opus-4-8 | claude-sonnet-4-6 | claude-haiku-4-5-20251001 |
| **Pricing** | $5/$25 per MTok (in/out) | $3/$15 per MTok | $1/$5 per MTok |
| **Extended thinking** | No | Yes | Yes |
| **Adaptive thinking** | Yes | Yes | No |
| **Comparative latency** | Moderate | Fast | Fastest |
| **Context window** | 1M tokens | 1M tokens | 200K |
| **Max output** | 128K tokens | 128K tokens | 64K tokens |
| **Reliable knowledge cutoff** | Jan 2026 | Aug 2025 | Feb 2025 |
| **Training data cutoff** | Jan 2026 | Jan 2026 | Jul 2025 |

> **Note:** On Claude Opus 4.8, the `effort` parameter defaults to `high` on all surfaces, including the Claude API and Claude Code. Set `effort` explicitly to use a different level.

> **Note:** The Max output values above apply to the synchronous Messages API. On the Message Batches API, Claude Opus 4.8, Opus 4.7, Opus 4.6, and Sonnet 4.6 support up to 300k output tokens by using the `output-300k-2026-03-24` beta header.

> **Note:** On Microsoft Foundry, Claude Opus 4.8 has a 200k-token context window.

Claude Mythos Preview is offered separately as a research preview model for defensive cybersecurity workflows as part of Project Glasswing. Access is invitation-only and there is no self-serve sign-up.

## Legacy Models (Still Available)

| Feature | Claude Opus 4.7 | Claude Opus 4.6 | Claude Sonnet 4.5 | Claude Opus 4.5 | Claude Opus 4.1 (deprecated) |
|:--------|:----------------|:----------------|:------------------|:----------------|:----------------------------|
| **Claude API ID** | claude-opus-4-7 | claude-opus-4-6 | claude-sonnet-4-5-20250929 | claude-opus-4-5-20251101 | claude-opus-4-1-20250805 |
| **Pricing** | $5/$25 | $5/$25 | $3/$15 | $5/$25 | $15/$75 |
| **Extended thinking** | No | Yes | Yes | Yes | Yes |
| **Adaptive thinking** | Yes | Yes | No | No | No |
| **Context** | 1M | 1M | 200K | 200K | 200K |
| **Max output** | 128K | 128K | 64K | 64K | 32K |
| **Reliable knowledge cutoff** | Jan 2026 | May 2025 | Jan 2025 | May 2025 | Jan 2025 |
| **Training data cutoff** | Jan 2026 | Aug 2025 | Jul 2025 | Aug 2025 | Mar 2025 |

> **Warning:** Claude Opus 4.1 (`claude-opus-4-1-20250805`) is deprecated and will be retired on August 5, 2026. Migrate to Claude Opus 4.8 before the retirement date.

## Model IDs and Versioning

Every Claude model ID is a pinned snapshot. Models with a date in the ID (for example, `20250929`) are fixed to that specific release. Starting with the Claude 4.6 generation, model IDs use a dateless format that is also a pinned snapshot, not an evergreen pointer. For models before the 4.6 generation, entries in the Claude API alias column are convenience pointers that resolve to a dated model ID.

You can query model capabilities and token limits programmatically with the Models API. The response includes `max_input_tokens`, `max_tokens`, and a `capabilities` object for every available model.

## Platform Availability

Models are available via:
- Claude API (direct)
- Claude Platform on AWS
- AWS Bedrock
- Google Vertex AI
- Microsoft Foundry (select models)

Starting with Claude Sonnet 4.5 and subsequent models, Bedrock offers two endpoint types: **global endpoints** (dynamic routing for maximum availability) and **regional endpoints** (guaranteed data routing through specific geographic regions). Google Cloud offers three endpoint types: global endpoints, **multi-region endpoints**, and regional endpoints.

Claude Platform on AWS uses the same model IDs as the Claude API (for example, `claude-opus-4-6`), not Bedrock-style IDs.

## Key Capabilities

- **Performance:** Top-tier results in reasoning, coding, multilingual tasks, long-context handling, honesty, and image processing
- **Adaptive thinking:** Opus 4.8, Opus 4.7, Opus 4.6, and Sonnet 4.6 support dynamic thinking allocation; Fable 5 and Mythos 5 have always-on adaptive thinking
- **1M context:** 1M token context window on Claude Fable 5, Mythos 5, Opus 4.8, Opus 4.7, Opus 4.6, and Sonnet 4.6
- **Context awareness:** Sonnet 4.6, Sonnet 4.5, and Haiku 4.5 track remaining context budget

## Migration

- For migrating to Claude Opus 4.8, see [Migrating to Claude Opus 4.8](https://platform.claude.com/docs/en/about-claude/models/migration-guide#migrating-from-claude-opus-47)
- For migrating to Claude Opus 4.7, see [Migrating to Claude Opus 4.7](https://platform.claude.com/docs/en/about-claude/models/migration-guide#migrating-to-claude-opus-4-7)
