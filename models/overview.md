---
title: "Claude Models Overview"
source_url: "https://platform.claude.com/docs/en/about-claude/models/overview"
source_type: "web-extracted"
fetched_at: "2026-08-10T00:00:00Z"
category: "models"
---

# Models Overview

Claude is a family of state-of-the-art large language models developed by Anthropic. This guide introduces the available models and compares their performance.

## Choosing a Model

If you're unsure which model to use, start with **Claude Opus 5** for complex agentic coding and enterprise work. For workloads that need the highest available capability, use Claude Fable 5.

All current Claude models support text and image input, text output, multilingual capabilities, and vision. Models are available through the Claude API, Claude Platform on AWS, Amazon Bedrock, Google Cloud, and Microsoft Foundry.

### Claude Fable 5 and Claude Mythos 5

Claude Fable 5 (`claude-fable-5`) is Anthropic's most capable widely released model. Claude Mythos 5 (`claude-mythos-5`) shares Claude Fable 5's specs and pricing and joins the invitation-only Claude Mythos Preview (`claude-mythos-preview`) within Project Glasswing. Claude Fable 5 is generally available on the Claude API, Claude Platform on AWS, Amazon Bedrock, Google Cloud, and Microsoft Foundry beginning June 9, 2026. Claude Mythos 5 is not generally available: it is offered in limited availability to approved customers in Project Glasswing, beginning the same day.

### Latest Models Comparison

| Feature                       | Claude Fable 5                                       | Claude Opus 5                                  | Claude Sonnet 5                                                                | Claude Haiku 4.5                                  |
| :---------------------------- | :--------------------------------------------------- | :--------------------------------------------- | :----------------------------------------------------------------------------- | :------------------------------------------------ |
| **Description**               | Next-generation intelligence for long-running agents | For complex agentic coding and enterprise work | The best combination of speed and intelligence                                 | The fastest model with near-frontier intelligence |
| **Claude API ID**             | `claude-fable-5`                                     | `claude-opus-5`                                | `claude-sonnet-5`                                                              | `claude-haiku-4-5-20251001`                       |
| **Claude API alias**          | `claude-fable-5`                                     | `claude-opus-5`                                | `claude-sonnet-5`                                                              | `claude-haiku-4-5`                                |
| **AWS Bedrock ID**            | `anthropic.claude-fable-5`                           | `anthropic.claude-opus-5`                      | `anthropic.claude-sonnet-5`                                                    | `anthropic.claude-haiku-4-5-20251001-v1:0`        |
| **Google Cloud ID**           | `claude-fable-5`                                     | `claude-opus-5`                                | `claude-sonnet-5`                                                              | `claude-haiku-4-5@20251001`                       |
| **Pricing**                   | $10 / input MTok, $50 / output MTok                  | $5 / input MTok, $25 / output MTok             | $3 / input MTok, $15 / output MTok (introductory: $2/$10 through Aug 31, 2026) | $1 / input MTok, $5 / output MTok                 |
| **Extended thinking**         | No                                                   | No                                             | No                                                                             | Yes                                               |
| **Adaptive thinking**         | Yes (always on)                                      | Yes                                            | Yes                                                                            | No                                                |
| **Comparative latency**       | Slower                                               | Moderate                                       | Fast                                                                           | Fastest                                           |
| **Context window**            | 1M tokens                                            | 1M tokens                                      | 1M tokens                                                                      | 200K tokens                                       |
| **Max output**                | 128K tokens                                          | 128K tokens                                    | 128K tokens                                                                    | 64K tokens                                        |
| **Reliable knowledge cutoff** | Jan 2026                                             | May 2026                                       | Jan 2026                                                                       | Feb 2025                                          |
| **Training data cutoff**      | Jan 2026                                             | May 2026                                       | Jan 2026                                                                       | Jul 2025                                          |

**Notes:**

- See Pricing page for complete pricing information including Batch API discounts and prompt caching rates.
- **Reliable knowledge cutoff** indicates the date through which a model's knowledge is most extensive and reliable. **Training data cutoff** is the broader date range of training data used. For more information, see Anthropic's Transparency Hub.
- Claude Fable 5, Claude Opus 5, and Claude Sonnet 5 are available on Bedrock through Claude in Amazon Bedrock (the Messages-API Bedrock endpoint).
- Introductory pricing of $2 / $10 per MTok applies to Claude Sonnet 5 through August 31, 2026.
- Claude Mythos 5 and Claude Mythos Preview are offered separately for defensive cybersecurity workflows as part of Project Glasswing. Access is invitation-only and there is no self-serve sign-up.
- Every Claude model ID is a pinned snapshot. Models with a date in the ID (e.g., `20250929`) are fixed to that specific release. Starting with the Claude 4.6 generation, model IDs use a dateless format that is also a pinned snapshot, not an evergreen pointer.
- Starting with **Claude Sonnet 4.5 and all subsequent models**, Bedrock offers two endpoint types: **global endpoints** (dynamic routing for maximum availability) and **regional endpoints** (guaranteed data routing through specific geographic regions). Google Cloud offers three endpoint types: global endpoints, **multi-region endpoints** (dynamic routing within a geographic area), and regional endpoints.
- **Claude Platform on AWS** uses the same model IDs as the Claude API (e.g., `claude-opus-4-6`), not Bedrock-style IDs. Model lifecycle on Claude Platform on AWS follows Anthropic's first-party Model deprecations, not Bedrock's.
- You can query model capabilities and token limits programmatically with the Models API. The response includes `max_input_tokens`, `max_tokens`, and a `capabilities` object for every available model.
- On Claude Opus 4.8, the `effort` parameter defaults to `high` on all surfaces, including the Claude API, Claude Code, and claude.ai. On Claude Opus 5 and Claude Sonnet 5, it defaults to `high` on the Claude API and Claude Code. Set `effort` explicitly to use a different level.
- The Max output values above apply to the synchronous Messages API. On the Message Batches API, Claude Opus 5, Opus 4.8, Opus 4.7, Opus 4.6, Sonnet 5, and Sonnet 4.6 support up to 300K output tokens by using the `output-300k-2026-03-24` beta header.
- Claude Fable 5 uses the tokenizer introduced with Claude Opus 4.7; compared to models before Claude Opus 4.7, the same text produces roughly 30% more tokens. The exact increase depends on the content.

## Legacy Models

| Feature                       | Claude Opus 4.8             | Claude Opus 4.7             | Claude Opus 4.6                | Claude Sonnet 4.6             | Claude Sonnet 4.5                           | Claude Opus 4.5                           |
| :---------------------------- | :-------------------------- | :-------------------------- | :----------------------------- | :---------------------------- | :------------------------------------------ | :---------------------------------------- |
| **Claude API ID**             | `claude-opus-4-8`           | `claude-opus-4-7`           | `claude-opus-4-6`              | `claude-sonnet-4-6`           | `claude-sonnet-4-5-20250929`                | `claude-opus-4-5-20251101`                |
| **Claude API alias**          | `claude-opus-4-8`           | `claude-opus-4-7`           | `claude-opus-4-6`              | `claude-sonnet-4-6`           | `claude-sonnet-4-5`                         | `claude-opus-4-5`                         |
| **AWS Bedrock ID**            | `anthropic.claude-opus-4-8` | `anthropic.claude-opus-4-7` | `anthropic.claude-opus-4-6-v1` | `anthropic.claude-sonnet-4-6` | `anthropic.claude-sonnet-4-5-20250929-v1:0` | `anthropic.claude-opus-4-5-20251101-v1:0` |
| **Google Cloud ID**           | `claude-opus-4-8`           | `claude-opus-4-7`           | `claude-opus-4-6`              | `claude-sonnet-4-6`           | `claude-sonnet-4-5@20250929`                | `claude-opus-4-5@20251101`                |
| **Pricing**                   | $5/$25 MTok                 | $5/$25 MTok                 | $5/$25 MTok                    | $3/$15 MTok                   | $3/$15 MTok                                 | $5/$25 MTok                               |
| **Extended thinking**         | No                          | No                          | Yes (deprecated)               | Yes (deprecated)              | Yes                                         | Yes                                       |
| **Adaptive thinking**         | Yes                         | Yes                         | Yes                            | Yes                           | No                                          | No                                        |
| **Comparative latency**       | Moderate                    | Moderate                    | Moderate                       | Fast                          | Fast                                        | Moderate                                  |
| **Context window**            | 1M tokens                   | 1M tokens                   | 1M tokens                      | 1M tokens                     | 200K tokens                                 | 200K tokens                               |
| **Max output**                | 128K tokens                 | 128K tokens                 | 128K tokens                    | 128K tokens                   | 64K tokens                                  | 64K tokens                                |
| **Reliable knowledge cutoff** | Jan 2026                    | Jan 2026                    | May 2025                       | Aug 2025                      | Jan 2025                                    | May 2025                                  |
| **Training data cutoff**      | Jan 2026                    | Jan 2026                    | Aug 2025                       | Jan 2026                      | Jul 2025                                    | Aug 2025                                  |

**Notes:**

- Claude Opus 4.7 uses a new tokenizer that increases token consumption approximately 1.0-1.35x depending on content type.
- Claude Opus 4.7 is available on Bedrock through Claude in Amazon Bedrock (the Messages-API Bedrock endpoint).

## Retired Models

- **Claude Opus 4.1** (`claude-opus-4-1-20250805`) -- retired August 5, 2026
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
- **Engaging responses**: Ideal for applications requiring rich, human-like interactions. Adjust prompts to guide output length; see prompt engineering guides for details.
- **Output quality**: Significant improvements when migrating from previous generations

## Migrating to Claude Opus 5

If you're currently using Claude Opus 4.8 or earlier Claude models, see [Migrating to Claude Opus 5](https://platform.claude.com/docs/en/about-claude/models/migration-guide#migrating-from-claude-opus-4-8-to-claude-opus-5).
