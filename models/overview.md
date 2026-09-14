---
title: "Claude Models Overview"
source_url: "https://platform.claude.com/docs/en/about-claude/models/overview"
source_type: "web-extracted"
fetched_at: "2026-09-14T00:00:00Z"
category: "models"
---

# Models Overview

Claude is a family of state-of-the-art large language models developed by Anthropic. Compare the current lineup, find the model ID for every platform, and open each model's page for its full specs and resources.

## Compare Models

If you're unsure which model to use, start with **Claude Opus 5** for most workloads. Use **Claude Fable 5.1** for demanding reasoning and long-horizon agentic work, or when your evals on Claude Opus 5 at higher effort still fall short. All current models support text and image input, text output, multilingual capabilities, vision, and tool use. Each model's page lists the platforms it's available on.

### Latest Models Comparison

| Feature                       | Claude Fable 5.1                                      | Claude Opus 5                                  | Claude Sonnet 5                                | Claude Haiku 4.5                                  |
| :---------------------------- | :---------------------------------------------------- | :--------------------------------------------- | :--------------------------------------------- | :------------------------------------------------ |
| **Description**               | For demanding reasoning and long-horizon agentic work | For complex agentic coding and enterprise work | The best combination of speed and intelligence | The fastest model with near-frontier intelligence |
| **Comparative latency**       | Slower                                                | Moderate                                       | Fast                                           | Fastest                                           |
| **Pricing**                   | $10 / input MTok, $50 / output MTok                   | $5 / input MTok, $25 / output MTok             | $2 / input MTok, $10 / output MTok             | $1 / input MTok, $5 / output MTok                 |
| **Claude API ID**             | `claude-fable-5-1`                                    | `claude-opus-5`                                | `claude-sonnet-5`                              | `claude-haiku-4-5-20251001`                       |
| **Thinking**                  | Adaptive (always on)                                  | Adaptive                                       | Adaptive                                       | Extended                                          |
| **Default effort**            | `high`                                                | `high`                                         | `high`                                         | Not supported                                     |
| **Context window**            | 1M tokens                                             | 1M tokens                                      | 1M tokens                                      | 200K tokens                                       |
| **Max output**                | 128K tokens                                           | 128K tokens                                    | 128K tokens                                    | 64K tokens                                        |
| **Reliable knowledge cutoff** | Jun 2026                                              | May 2026                                       | Jan 2026                                       | Feb 2025                                          |
| **Training data cutoff**      | Jun 2026                                              | May 2026                                       | Jan 2026                                       | Jul 2025                                          |
| **Retirement**                | Not sooner than September 1, 2027                     | Not sooner than July 24, 2027                  | Not sooner than June 30, 2027                  | Not sooner than October 15, 2026                  |
| **Claude API alias**          | `claude-fable-5-1`                                    | `claude-opus-5`                                | `claude-sonnet-5`                              | `claude-haiku-4-5`                                |
| **AWS Bedrock ID**            | `anthropic.claude-fable-5-1`                          | `anthropic.claude-opus-5`                      | `anthropic.claude-sonnet-5`                    | `anthropic.claude-haiku-4-5`                      |
| **Google Cloud ID**           | `claude-fable-5-1`                                    | `claude-opus-5`                                | `claude-sonnet-5`                              | `claude-haiku-4-5@20251001`                       |
| **Microsoft Foundry ID**      | `claude-fable-5-1`                                    | `claude-opus-5`                                | `claude-sonnet-5`                              | `claude-haiku-4-5`                                |
| **Claude Platform on AWS ID** | `claude-fable-5-1`                                    | ---                                            | `claude-sonnet-5`                              | `claude-haiku-4-5`                                |

**Notes:**

- **Comparative latency:** Relative to the current lineup. Actual latency depends on prompt length, output length, and thinking effort.
- **Pricing:** Base price per million tokens. Batch API requests are 50% off; prompt cache reads cost 10% of the base input price (2.5% on Claude Fable 5.1 and Claude Mythos 5.1). See Pricing page for cache writes, long-context, and per-platform pricing.
- **Claude API ID:** Every Claude model ID is a pinned snapshot, including the dateless IDs used from the 4.6 generation on.
- **Thinking:** Adaptive thinking lets the model decide how much to think, steered by effort. Extended thinking is the manual `thinking.type: "enabled"` + `budget_tokens` mode on earlier models; it is deprecated on Claude Opus 4.6 and Claude Sonnet 4.6 and not accepted on later models.
- **Default effort:** The effort parameter's default on the Claude API. Set effort explicitly to use a different level.
- **Context window:** 1M tokens is roughly 555k words or 2.5M Unicode characters on the current tokenizer (introduced with Claude Opus 4.7); models before it fit about 750k words in 1M tokens. 200K tokens is roughly 150k words.
- **Max output:** Synchronous Messages API limit. On the Message Batches API, Claude Opus 5, Sonnet 5, Opus 4.8, Opus 4.7, Opus 4.6, and Sonnet 4.6 support up to 300K output tokens with the `output-300k-2026-03-24` beta header.
- **Reliable knowledge cutoff** indicates the date through which a model's knowledge is most extensive and reliable. **Training data cutoff** is the broader range of data used. See Anthropic's Transparency Hub.
- **Retirement:** Anthropic's commitment for Anthropic-operated platforms (Claude API, Claude Platform on AWS, Microsoft Foundry). Amazon Bedrock and Google Cloud set their own dates.
- Claude Sonnet 5 is priced at $2 / $10 per MTok. This was introductory pricing that became the standard price on August 10, 2026 (the previously scheduled increase to $3 / $15 on September 1, 2026 will not occur).
- Claude Mythos 5.1 and Claude Mythos Preview are offered separately for defensive cybersecurity workflows as part of Project Glasswing. Access is invitation-only and there is no self-serve sign-up.
- **Claude Platform on AWS** uses the same model IDs as the Claude API (e.g., `claude-opus-4-6`), not Bedrock-style IDs. Model lifecycle on Claude Platform on AWS follows Anthropic's first-party Model deprecations, not Bedrock's.
- You can query model capabilities and token limits programmatically with the Models API. The response includes `max_input_tokens`, `max_tokens`, and a `capabilities` object for every available model.
- On Claude Opus 4.8, the `effort` parameter defaults to `high` on all surfaces, including the Claude API, Claude Code, and claude.ai. On Claude Opus 5 and Claude Sonnet 5, it defaults to `high` on the Claude API and Claude Code. Set `effort` explicitly to use a different level.

## Legacy Models

Legacy models (still available): Claude Fable 5, Claude Opus 4.8, Claude Opus 4.7, Claude Opus 4.6, Claude Opus 4.5, Claude Sonnet 4.6, Claude Sonnet 4.5. Claude Fable 5 moved to legacy status when Claude Fable 5.1 launched on September 1, 2026. See each model's page for full specs and platform IDs.

## Using the Models API

You can query model capabilities and token limits programmatically with the [Models API](https://platform.claude.com/docs/en/api/models/list). The response includes `max_input_tokens`, `max_tokens`, and a `capabilities` object for every available model.

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
