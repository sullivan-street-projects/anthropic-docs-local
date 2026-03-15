---
title: "Claude Models Overview"
source_url: "https://platform.claude.com/docs/en/about-claude/models/overview"
source_type: "web-extracted"
fetched_at: "2026-03-15T00:00:00Z"
category: "models"
---

# Models Overview

Claude is a family of state-of-the-art large language models developed by Anthropic.

## Choosing a Model

If you're unsure which model to use, we recommend starting with **Claude Opus 4.6** for the most complex tasks. It is our latest generation model with exceptional performance in coding and reasoning.

All current Claude models support text and image input, text output, multilingual capabilities, and vision. Models are available via the Anthropic API, AWS Bedrock, and Google Vertex AI.

### Latest Models Comparison

| Feature | Claude Opus 4.6 | Claude Sonnet 4.6 | Claude Haiku 4.5 |
|:--------|:----------------|:------------------|:-----------------|
| **Description** | Most intelligent model for agents and coding | Best combination of speed and intelligence | Fastest model with near-frontier intelligence |
| **Claude API ID** | `claude-opus-4-6` | `claude-sonnet-4-6` | `claude-haiku-4-5-20251001` |
| **Claude API alias** | `claude-opus-4-6` | `claude-sonnet-4-6` | `claude-haiku-4-5` |
| **AWS Bedrock ID** | `anthropic.claude-opus-4-6-v1` | `anthropic.claude-sonnet-4-6` | `anthropic.claude-haiku-4-5-20251001-v1:0` |
| **GCP Vertex AI ID** | `claude-opus-4-6` | `claude-sonnet-4-6` | `claude-haiku-4-5@20251001` |
| **Pricing** | $5 / input MTok, $25 / output MTok | $3 / input MTok, $15 / output MTok | $1 / input MTok, $5 / output MTok |
| **Extended thinking** | Yes | Yes | Yes |
| **Adaptive thinking** | Yes | Yes | No |
| **Priority Tier** | Yes | Yes | Yes |
| **Comparative latency** | Moderate | Fast | Fastest |
| **Context window** | 1M tokens | 1M tokens | 200K tokens |
| **Max output** | 128K tokens | 64K tokens | 64K tokens |
| **Reliable knowledge cutoff** | May 2025 | Aug 2025 | Feb 2025 |
| **Training data cutoff** | Aug 2025 | Jan 2026 | Jul 2025 |

**Notes:**
- Claude Opus 4.6 and Sonnet 4.6 have a 1M token context window at standard pricing (no beta header required). The 1M context window remains in beta for Claude Sonnet 4.5 and Sonnet 4 (requires `context-1m-2025-08-07` beta header). Long context pricing applies to requests exceeding 200K tokens.
- **Reliable knowledge cutoff** indicates the date through which a model's knowledge is most extensive and reliable. **Training data cutoff** is the broader date range of training data used.
- Models with the same snapshot date (e.g., 20240620) are identical across all platforms and do not change.
- Starting with Claude Sonnet 4.5 and all subsequent models, AWS Bedrock and Google Vertex AI offer two endpoint types: global endpoints (dynamic routing for maximum availability) and regional endpoints (guaranteed data routing through specific geographic regions).

### Opus 4.6 Key Features

- **Adaptive thinking** (`thinking: {type: "adaptive"}`): Recommended for Opus 4.6. Manual thinking (`type: "enabled"` with `budget_tokens`) is deprecated.
- **Fast mode** (research preview): Up to 2.5x faster output via the `speed` parameter at premium pricing.
- **Compaction API** (beta): Server-side context summarization for effectively infinite conversations.
- **Data residency controls**: Specify where model inference runs with the `inference_geo` parameter.
- Does **not** support prefilling assistant messages.

### Sonnet 4.6 Key Features

- Extended thinking and adaptive thinking support with balanced speed and intelligence.
- 1M token context window (beta).
- Generally available web search, code execution, and programmatic tool calling.

## Legacy Models

| Feature | Claude Sonnet 4.5 | Claude Opus 4.5 | Claude Opus 4.1 | Claude Sonnet 4 | Claude Opus 4 | Claude Haiku 3 (deprecated) |
|:--------|:------------------|:----------------|:----------------|:----------------|:--------------|:----------------------------|
| **API ID** | `claude-sonnet-4-5-20250929` | `claude-opus-4-5-20251101` | `claude-opus-4-1-20250805` | `claude-sonnet-4-20250514` | `claude-opus-4-20250514` | `claude-3-haiku-20240307` |
| **API alias** | `claude-sonnet-4-5` | `claude-opus-4-5` | `claude-opus-4-1` | `claude-sonnet-4-0` | `claude-opus-4-0` | -- |
| **AWS Bedrock ID** | `anthropic.claude-sonnet-4-5-20250929-v1:0` | `anthropic.claude-opus-4-5-20251101-v1:0` | `anthropic.claude-opus-4-1-20250805-v1:0` | `anthropic.claude-sonnet-4-20250514-v1:0` | `anthropic.claude-opus-4-20250514-v1:0` | `anthropic.claude-3-haiku-20240307-v1:0` |
| **GCP Vertex AI ID** | `claude-sonnet-4-5@20250929` | `claude-opus-4-5@20251101` | `claude-opus-4-1@20250805` | `claude-sonnet-4@20250514` | `claude-opus-4@20250514` | `claude-3-haiku@20240307` |
| **Pricing** | $3/$15 MTok | $5/$25 MTok | $15/$75 MTok | $3/$15 MTok | $15/$75 MTok | $0.25/$1.25 MTok |
| **Extended thinking** | Yes | Yes | Yes | Yes | Yes | No |
| **Context window** | 200K / 1M (beta) | 200K | 200K | 200K / 1M (beta) | 200K | 200K |
| **Max output** | 64K | 64K | 32K | 64K | 32K | 4K |
| **Reliable knowledge cutoff** | Jan 2025 | May 2025 | Jan 2025 | Jan 2025 | Jan 2025 | -- |
| **Training data cutoff** | Jul 2025 | Aug 2025 | Mar 2025 | Mar 2025 | Mar 2025 | Aug 2023 |
| **Status** | Active | Active | Active | Active | Active | Deprecated (retiring April 2026) |

## Retired Models

- **Claude Sonnet 3.7** (`claude-3-7-sonnet-20250219`) -- retired February 19, 2026
- **Claude Haiku 3.5** (`claude-3-5-haiku-20241022`) -- retired February 19, 2026
- **Claude Opus 3** (`claude-3-opus-20240229`) -- retired January 5, 2026
- **Claude Sonnet 3.5** (`claude-3-5-sonnet-20240620`, `claude-3-5-sonnet-20241022`) -- retired October 28, 2025
- **Claude 2.0, 2.1, Sonnet 3** -- retired July 21, 2025
- **Claude 1, Instant** -- retired November 6, 2024

## Prompt and Output Performance

Claude 4 models excel in:
- **Performance**: Top-tier results in reasoning, coding, multilingual tasks, long-context handling, honesty, and image processing
- **Engaging responses**: Ideal for applications requiring rich, human-like interactions
- **Output quality**: Significant improvements when migrating from previous generations

## Migrating to Claude 4.6

For detailed migration instructions, see [Migrating to Claude 4.6](https://platform.claude.com/docs/en/about-claude/models/migration-guide).
