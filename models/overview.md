---
title: "Claude Models Overview"
source_url: "https://platform.claude.com/docs/en/about-claude/models/overview"
source_type: "web-extracted"
fetched_at: "2026-07-06T00:00:00Z"
category: "models"
---

# Models Overview

Claude is a family of state-of-the-art large language models developed by Anthropic.

## Choosing a Model

If you're unsure which model to use, start with **Claude Opus 4.8** for complex agentic coding and enterprise work. For workloads that need the highest available capability, use Claude Fable 5.

All current Claude models support text and image input, text output, multilingual capabilities, and vision. Models are available through the Claude API, Claude Platform on AWS, Amazon Bedrock, Google Cloud, and Microsoft Foundry.

### Claude Fable 5 and Claude Mythos 5

Claude Fable 5 (`claude-fable-5`) is Anthropic's most capable widely released model. Claude Mythos 5 (`claude-mythos-5`) shares Claude Fable 5's specs and pricing and joins the invitation-only Claude Mythos Preview within Project Glasswing.

Claude Fable 5 is generally available beginning June 9, 2026. Claude Mythos 5 is limited availability to approved customers in Project Glasswing.

### Latest Models Comparison

| Feature | Claude Fable 5 | Claude Opus 4.8 | Claude Sonnet 5 | Claude Haiku 4.5 |
|:--------|:--------------|:----------------|:----------------|:-----------------|
| **Description** | Next-generation intelligence for long-running agents | For complex agentic coding and enterprise work | Best combination of speed and intelligence | Fastest model with near-frontier intelligence |
| **Claude API ID** | `claude-fable-5` | `claude-opus-4-8` | `claude-sonnet-5` | `claude-haiku-4-5-20251001` |
| **Claude API alias** | `claude-fable-5` | `claude-opus-4-8` | `claude-sonnet-5` | `claude-haiku-4-5` |
| **AWS Bedrock ID** | `anthropic.claude-fable-5` | `anthropic.claude-opus-4-8` | `anthropic.claude-sonnet-5` | `anthropic.claude-haiku-4-5-20251001-v1:0` |
| **GCP Vertex AI ID** | `claude-fable-5` | `claude-opus-4-8` | `claude-sonnet-5` | `claude-haiku-4-5@20251001` |
| **Pricing** | $10 / input MTok, $50 / output MTok | $5 / input MTok, $25 / output MTok | $3 / input MTok, $15 / output MTok (introductory $2/$10 through Aug 31, 2026) | $1 / input MTok, $5 / output MTok |
| **Extended thinking** | No | No | No | Yes |
| **Adaptive thinking** | Yes (always on) | Yes | Yes | No |
| **Comparative latency** | Slower | Moderate | Fast | Fastest |
| **Context window** | 1M tokens | 1M tokens | 1M tokens | 200K tokens |
| **Max output** | 128K tokens | 128K tokens | 128K tokens | 64K tokens |
| **Reliable knowledge cutoff** | Jan 2026 | Jan 2026 | Jan 2026 | Feb 2025 |
| **Training data cutoff** | Jan 2026 | Jan 2026 | Jan 2026 | Jul 2025 |

**Notes:**
- Claude Fable 5, Opus 4.8, and Sonnet 5 are available on Bedrock through Claude in Amazon Bedrock (the Messages-API Bedrock endpoint).
- Fable 5 and Opus 4.7+ use a new tokenizer; compared to earlier models, the same text produces roughly 30% more tokens.
- On Claude Opus 4.8, the `effort` parameter defaults to `high` on all surfaces. On Claude Sonnet 5, it defaults to `high` on the API and Claude Code.
- On the Message Batches API, Opus 4.8, 4.7, 4.6, Sonnet 5, and Sonnet 4.6 support up to 300k output tokens via the `output-300k-2026-03-24` beta header.
- Setting `temperature`, `top_p`, or `top_k` to non-default values returns a 400 error on Opus 4.7+ and Sonnet 5.
- Every Claude model ID is a pinned snapshot. Starting with the 4.6 generation, model IDs use a dateless format that is also a pinned snapshot, not an evergreen pointer.
- Starting with Claude Sonnet 4.5 and all subsequent models, AWS Bedrock and Google Cloud offer global and regional endpoints.

### Fable 5 Key Features

- **Always-on adaptive thinking**: `thinking: {type: "disabled"}` is not supported; manual extended thinking and assistant prefill return 400 error.
- **Thinking display** defaults to `"omitted"`; set `display: "summarized"` to receive readable thinking summaries.
- **Safety classifiers** return `stop_reason: "refusal"` when a request is declined.
- **30-day data retention** required; not available under zero data retention.
- **New tokenizer** producing ~30% more tokens for the same text.

### Opus 4.8 Key Features

- **Adaptive thinking** recommended. Effort defaults to `high`.
- **Mid-conversation system messages**: send `role: "system"` messages after a user turn.
- **Fast mode** (research preview): faster output via the `speed` parameter.
- **High-resolution image input**: up to 2576 pixels on the long edge.
- **Task budgets**: advisory token budget for full agentic loops.
- **Lower prompt caching threshold**: 1,024 tokens minimum.
- Setting `temperature`, `top_p`, `top_k` to non-default values returns 400 error.

## Legacy Models

| Feature | Claude Opus 4.7 | Claude Opus 4.6 | Claude Sonnet 4.6 | Claude Sonnet 4.5 | Claude Opus 4.5 | Claude Opus 4.1 (deprecated) |
|:--------|:----------------|:----------------|:------------------|:------------------|:----------------|:----------------------------|
| **API ID** | `claude-opus-4-7` | `claude-opus-4-6` | `claude-sonnet-4-6` | `claude-sonnet-4-5-20250929` | `claude-opus-4-5-20251101` | `claude-opus-4-1-20250805` |
| **API alias** | `claude-opus-4-7` | `claude-opus-4-6` | `claude-sonnet-4-6` | `claude-sonnet-4-5` | `claude-opus-4-5` | `claude-opus-4-1` |
| **AWS Bedrock ID** | `anthropic.claude-opus-4-7` | `anthropic.claude-opus-4-6-v1` | `anthropic.claude-sonnet-4-6` | `anthropic.claude-sonnet-4-5-20250929-v1:0` | `anthropic.claude-opus-4-5-20251101-v1:0` | `anthropic.claude-opus-4-1-20250805-v1:0` |
| **GCP Vertex AI ID** | `claude-opus-4-7` | `claude-opus-4-6` | `claude-sonnet-4-6` | `claude-sonnet-4-5@20250929` | `claude-opus-4-5@20251101` | `claude-opus-4-1@20250805` |
| **Pricing** | $5/$25 MTok | $5/$25 MTok | $3/$15 MTok | $3/$15 MTok | $5/$25 MTok | $15/$75 MTok |
| **Extended thinking** | No | Yes | Yes | Yes | Yes | Yes |
| **Adaptive thinking** | Yes | Yes | Yes | No | No | No |
| **Context window** | 1M tokens | 1M tokens | 1M tokens | 200K / 1M (beta) | 200K | 200K |
| **Max output** | 128K | 128K | 128K | 64K | 64K | 32K |
| **Reliable knowledge cutoff** | Jan 2026 | May 2025 | Aug 2025 | Jan 2025 | May 2025 | Jan 2025 |
| **Training data cutoff** | Jan 2026 | Aug 2025 | Jan 2026 | Jul 2025 | Aug 2025 | Mar 2025 |

**Warning:** Claude Opus 4.1 (`claude-opus-4-1-20250805`) is deprecated and will be retired on August 5, 2026. Migrate to Claude Opus 4.8.

## Retired Models

- **Claude Sonnet 4** (`claude-sonnet-4-20250514`) -- retired June 15, 2026
- **Claude Opus 4** (`claude-opus-4-20250514`) -- retired June 15, 2026
- **Claude Haiku 3** (`claude-3-haiku-20240307`) -- retired April 20, 2026
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

## Migrating to Claude Opus 4.8

For detailed migration instructions from Claude Opus 4.7 or earlier, see [Migrating to Claude Opus 4.8](https://platform.claude.com/docs/en/about-claude/models/migration-guide#migrating-from-claude-opus-47).

## Migrating to Claude Opus 4.7

For detailed migration instructions from Claude Opus 4.6 or earlier, see [Migrating to Claude Opus 4.7](https://platform.claude.com/docs/en/about-claude/models/migration-guide#migrating-to-claude-opus-4-7).
