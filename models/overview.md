---
title: "Claude Models Overview"
source_url: "https://platform.claude.com/docs/en/about-claude/models/overview"
source_type: "web-extracted"
fetched_at: "2026-09-06T00:00:00Z"
category: "models"
---

# Models Overview

Claude is a family of state-of-the-art large language models developed by Anthropic. This guide introduces the available models and compares their performance.

## Choosing a Model

If you're unsure which model to use, start with **Claude Opus 5** for most workloads. Use **Claude Fable 5.1** for demanding reasoning and long-horizon agentic work, or when your evals on Claude Opus 5 at higher effort still fall short.

All current Claude models support text and image input, text output, multilingual capabilities, vision, and tool use. Models are available through the Claude API, Claude Platform on AWS, Amazon Bedrock, Google Cloud, and Microsoft Foundry.

### Claude Fable 5.1 and Claude Mythos 5.1

Claude Fable 5.1 (`claude-fable-5-1`) is Anthropic's most capable widely released model, tuned for demanding reasoning and long-horizon agentic work. It launched September 1, 2026. Compared with Claude Fable 5, it costs roughly 25% less for typical workloads because prompt cache reads are priced at 2.5% of the base input price (down from 10%). Claude Mythos 5.1 (`claude-mythos-5-1`) shares Claude Fable 5.1's specs and pricing (including the 2.5% cache-read rate) and continues the invitation-only Project Glasswing line alongside the deprecated Claude Mythos Preview (`claude-mythos-preview`). Claude Mythos is offered in limited availability to approved customers for defensive cybersecurity workflows; access is invitation-only with no self-serve sign-up.

### Latest Models Comparison

| Feature                       | Claude Fable 5.1                                      | Claude Opus 5                                  | Claude Sonnet 5                                | Claude Haiku 4.5                                  |
| :---------------------------- | :---------------------------------------------------- | :--------------------------------------------- | :--------------------------------------------- | :------------------------------------------------ |
| **Description**               | For demanding reasoning and long-horizon agentic work | For complex agentic coding and enterprise work | The best combination of speed and intelligence | The fastest model with near-frontier intelligence |
| **Claude API ID**             | `claude-fable-5-1`                                    | `claude-opus-5`                                | `claude-sonnet-5`                              | `claude-haiku-4-5-20251001`                       |
| **Claude API alias**          | `claude-fable-5-1`                                    | `claude-opus-5`                                | `claude-sonnet-5`                              | `claude-haiku-4-5`                                |
| **AWS Bedrock ID**            | `anthropic.claude-fable-5-1`                          | `anthropic.claude-opus-5`                      | `anthropic.claude-sonnet-5`                    | `anthropic.claude-haiku-4-5`                      |
| **Google Cloud ID**           | `claude-fable-5-1`                                    | `claude-opus-5`                                | `claude-sonnet-5`                              | `claude-haiku-4-5@20251001`                       |
| **Microsoft Foundry ID**      | `claude-fable-5-1`                                    | `claude-opus-5`                                | `claude-sonnet-5`                              | `claude-haiku-4-5`                                |
| **Pricing**                   | $10 / input MTok, $50 / output MTok                   | $5 / input MTok, $25 / output MTok             | $2 / input MTok, $10 / output MTok             | $1 / input MTok, $5 / output MTok                 |
| **Extended thinking**         | No                                                    | No                                             | No                                             | Yes                                               |
| **Adaptive thinking**         | Yes (always on)                                       | Yes                                            | Yes                                            | No                                                |
| **Comparative latency**       | Slower                                                | Moderate                                       | Fast                                           | Fastest                                           |
| **Context window**            | 1M tokens                                             | 1M tokens                                      | 1M tokens                                      | 200K tokens                                       |
| **Max output**                | 128K tokens                                           | 128K tokens                                    | 128K tokens                                    | 64K tokens                                        |
| **Reliable knowledge cutoff** | Jun 2026                                              | May 2026                                       | Jan 2026                                       | Feb 2025                                          |
| **Training data cutoff**      | Jun 2026                                              | May 2026                                       | Jan 2026                                       | Jul 2025                                          |

**Notes:**

- See Pricing page for complete pricing information including Batch API discounts and prompt caching rates. Batch API requests are 50% off; prompt cache reads cost 10% of the base input price, but only 2.5% on Claude Fable 5.1 and Claude Mythos 5.1 (a cut that makes Claude Fable 5.1 roughly 25% cheaper than Claude Fable 5 for typical workloads).
- **Reliable knowledge cutoff** indicates the date through which a model's knowledge is most extensive and reliable. **Training data cutoff** is the broader date range of training data used. For more information, see Anthropic's Transparency Hub.
- Claude Fable 5.1, Claude Opus 5, and Claude Sonnet 5 are available on Bedrock through Claude in Amazon Bedrock (the Messages-API Bedrock endpoint).
- Claude Sonnet 5 is priced at $2 / $10 per MTok. This was introductory pricing that became the standard price on August 10, 2026 (the previously scheduled increase to $3 / $15 on September 1, 2026 will not occur).
- Claude Mythos 5.1 and Claude Mythos Preview are offered separately for defensive cybersecurity workflows as part of Project Glasswing. Access is invitation-only and there is no self-serve sign-up.
- Every Claude model ID is a pinned snapshot. Models with a date in the ID (e.g., `20250929`) are fixed to that specific release. Starting with the Claude 4.6 generation, model IDs use a dateless format that is also a pinned snapshot, not an evergreen pointer.
- Starting with **Claude Sonnet 4.5 and all subsequent models**, Bedrock offers two endpoint types: **global endpoints** (dynamic routing for maximum availability) and **regional endpoints** (guaranteed data routing through specific geographic regions). Google Cloud offers three endpoint types: global endpoints, **multi-region endpoints** (dynamic routing within a geographic area), and regional endpoints.
- **Claude Platform on AWS** uses the same model IDs as the Claude API (e.g., `claude-opus-4-6`), not Bedrock-style IDs. Model lifecycle on Claude Platform on AWS follows Anthropic's first-party Model deprecations, not Bedrock's.
- You can query model capabilities and token limits programmatically with the Models API. The response includes `max_input_tokens`, `max_tokens`, and a `capabilities` object for every available model.
- On Claude Opus 4.8, the `effort` parameter defaults to `high` on all surfaces, including the Claude API, Claude Code, and claude.ai. On Claude Opus 5 and Claude Sonnet 5, it defaults to `high` on the Claude API and Claude Code. Set `effort` explicitly to use a different level.
- The Max output values above apply to the synchronous Messages API. On the Message Batches API, Claude Opus 5, Opus 4.8, Opus 4.7, Opus 4.6, Sonnet 5, and Sonnet 4.6 support up to 300K output tokens by using the `output-300k-2026-03-24` beta header.
- Claude Fable 5.1 uses the tokenizer introduced with Claude Opus 4.7; compared to models before Claude Opus 4.7, the same text produces roughly 30% more tokens. The exact increase depends on the content.

## Legacy Models

Legacy models remain available. Claude Fable 5 moved to legacy status when Claude Fable 5.1 launched on September 1, 2026.

| Feature                       | Claude Fable 5             | Claude Opus 4.8             | Claude Opus 4.7             | Claude Opus 4.6                | Claude Sonnet 4.6             | Claude Sonnet 4.5                           | Claude Opus 4.5                           |
| :---------------------------- | :------------------------- | :-------------------------- | :-------------------------- | :----------------------------- | :---------------------------- | :------------------------------------------ | :---------------------------------------- |
| **Claude API ID**             | `claude-fable-5`           | `claude-opus-4-8`           | `claude-opus-4-7`           | `claude-opus-4-6`              | `claude-sonnet-4-6`           | `claude-sonnet-4-5-20250929`                | `claude-opus-4-5-20251101`                |
| **Claude API alias**          | `claude-fable-5`           | `claude-opus-4-8`           | `claude-opus-4-7`           | `claude-opus-4-6`              | `claude-sonnet-4-6`           | `claude-sonnet-4-5`                         | `claude-opus-4-5`                         |
| **AWS Bedrock ID**            | `anthropic.claude-fable-5` | `anthropic.claude-opus-4-8` | `anthropic.claude-opus-4-7` | `anthropic.claude-opus-4-6-v1` | `anthropic.claude-sonnet-4-6` | `anthropic.claude-sonnet-4-5-20250929-v1:0` | `anthropic.claude-opus-4-5-20251101-v1:0` |
| **Google Cloud ID**           | `claude-fable-5`           | `claude-opus-4-8`           | `claude-opus-4-7`           | `claude-opus-4-6`              | `claude-sonnet-4-6`           | `claude-sonnet-4-5@20250929`                | `claude-opus-4-5@20251101`                |
| **Pricing**                   | $10/$50 MTok               | $5/$25 MTok                 | $5/$25 MTok                 | $5/$25 MTok                    | $3/$15 MTok                   | $3/$15 MTok                                 | $5/$25 MTok                               |
| **Extended thinking**         | No                         | No                          | No                          | Yes (deprecated)               | Yes (deprecated)              | Yes                                         | Yes                                       |
| **Adaptive thinking**         | Yes (always on)            | Yes                         | Yes                         | Yes                            | Yes                           | No                                          | No                                        |
| **Comparative latency**       | Slower                     | Moderate                    | Moderate                    | Moderate                       | Fast                          | Fast                                        | Moderate                                  |
| **Context window**            | 1M tokens                  | 1M tokens                   | 1M tokens                   | 1M tokens                      | 1M tokens                     | 200K tokens                                 | 200K tokens                               |
| **Max output**                | 128K tokens                | 128K tokens                 | 128K tokens                 | 128K tokens                    | 128K tokens                   | 64K tokens                                  | 64K tokens                                |
| **Reliable knowledge cutoff** | Jan 2026                   | Jan 2026                    | Jan 2026                    | May 2025                       | Aug 2025                      | Jan 2025                                    | May 2025                                  |
| **Training data cutoff**      | Jan 2026                   | Jan 2026                    | Jan 2026                    | Aug 2025                       | Jan 2026                      | Jul 2025                                    | Aug 2025                                  |

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
