---
title: "Models Overview"
source_url: "https://platform.claude.com/docs/en/docs/about-claude/models"
source_type: "web-extracted"
fetched_at: "2026-08-24T00:00:00Z"
category: "api"
---

# Models Overview

Claude is a family of state-of-the-art large language models developed by Anthropic. If you're unsure which model to use, start with **Claude Opus 5** for complex agentic coding and enterprise work. For workloads that need the highest available capability, use Claude Fable 5.

All current Claude models support text and image input, text output, multilingual capabilities, and vision. Models are available through the Claude API, Claude Platform on AWS, Amazon Bedrock, Google Cloud, and Microsoft Foundry.

## Claude Fable 5 and Claude Mythos 5

Claude Fable 5 (`claude-fable-5`) is Anthropic's most capable widely released model. Claude Mythos 5 (`claude-mythos-5`) shares Claude Fable 5's specs and pricing and joins the invitation-only Claude Mythos Preview (`claude-mythos-preview`) within Project Glasswing. See the introducing blog post for launch details and API changes.

Claude Fable 5 is generally available on the Claude API, Claude Platform on AWS, Amazon Bedrock, Google Cloud, and Microsoft Foundry beginning June 9, 2026. Claude Mythos 5 is not generally available: it is offered in limited availability to approved customers in Project Glasswing, beginning the same day.

## Latest Models (Recommended)

| Feature                       | Claude Fable 5                                       | Claude Opus 5                                  | Claude Sonnet 5                                | Claude Haiku 4.5                                  |
| :---------------------------- | :--------------------------------------------------- | :--------------------------------------------- | :--------------------------------------------- | :------------------------------------------------ |
| **Description**               | Next-generation intelligence for long-running agents | For complex agentic coding and enterprise work | The best combination of speed and intelligence | The fastest model with near-frontier intelligence |
| **Claude API ID**             | claude-fable-5                                       | claude-opus-5                                  | claude-sonnet-5                                | claude-haiku-4-5-20251001                         |
| **Claude API alias**          | claude-fable-5                                       | claude-opus-5                                  | claude-sonnet-5                                | claude-haiku-4-5                                  |
| **AWS Bedrock ID**            | anthropic.claude-fable-5                             | anthropic.claude-opus-5                        | anthropic.claude-sonnet-5                      | anthropic.claude-haiku-4-5-20251001-v1:0          |
| **Google Cloud ID**           | claude-fable-5                                       | claude-opus-5                                  | claude-sonnet-5                                | claude-haiku-4-5@20251001                         |
| **Pricing**                   | $10 / $50 per MTok (input / output)                  | $5 / $25 per MTok                              | $2 / $10 per MTok                              | $1 / $5 per MTok                                  |
| **Extended thinking**         | No                                                   | No                                             | No                                             | Yes                                               |
| **Adaptive thinking**         | Yes (always on)                                      | Yes                                            | Yes                                            | No                                                |
| **Comparative latency**       | Slower                                               | Moderate                                       | Fast                                           | Fastest                                           |
| **Context window**            | 1M tokens                                            | 1M tokens                                      | 1M tokens                                      | 200k tokens                                       |
| **Max output**                | 128k tokens                                          | 128k tokens                                    | 128k tokens                                    | 64k tokens                                        |
| **Reliable knowledge cutoff** | Jan 2026                                             | May 2026                                       | Jan 2026                                       | Feb 2025                                          |
| **Training data cutoff**      | Jan 2026                                             | May 2026                                       | Jan 2026                                       | Jul 2025                                          |

> **Note:** Claude Fable 5 and Claude Mythos 5 use the tokenizer introduced with Claude Opus 4.7. Compared to models before Claude Opus 4.7, the same text produces roughly 30% more tokens. The exact increase depends on the content.

> **Note:** Claude Fable 5, Claude Opus 5, and Claude Sonnet 5 are available on Bedrock through Claude in Amazon Bedrock (the Messages-API Bedrock endpoint).

> **Note:** On Claude Opus 4.8, the `effort` parameter defaults to `high` on all surfaces, including the Claude API, Claude Code, and claude.ai. On Claude Opus 5 and Claude Sonnet 5, it defaults to `high` on the Claude API and Claude Code. Set `effort` explicitly to use a different level.

> **Note:** The Max output values above apply to the synchronous Messages API. On the Message Batches API, Claude Opus 5, Opus 4.8, Opus 4.7, Opus 4.6, Sonnet 5, and Sonnet 4.6 support up to 300k output tokens by using the `output-300k-2026-03-24` beta header.

> **Note:** On Microsoft Foundry, Claude Opus 4.8 has a 200k-token context window.

Claude Mythos 5 and Claude Mythos Preview are offered separately for defensive cybersecurity workflows as part of Project Glasswing. Access is invitation-only and there is no self-serve sign-up.

## Legacy Models (Still Available)

| Feature                       | Claude Opus 4.8           | Claude Opus 4.7           | Claude Opus 4.6              | Claude Sonnet 4.6           | Claude Sonnet 4.5                         | Claude Opus 4.5                         |
| :---------------------------- | :------------------------ | :------------------------ | :--------------------------- | :-------------------------- | :---------------------------------------- | :-------------------------------------- |
| **Claude API ID**             | claude-opus-4-8           | claude-opus-4-7           | claude-opus-4-6              | claude-sonnet-4-6           | claude-sonnet-4-5-20250929                | claude-opus-4-5-20251101                |
| **Claude API alias**          | claude-opus-4-8           | claude-opus-4-7           | claude-opus-4-6              | claude-sonnet-4-6           | claude-sonnet-4-5                         | claude-opus-4-5                         |
| **AWS Bedrock ID**            | anthropic.claude-opus-4-8 | anthropic.claude-opus-4-7 | anthropic.claude-opus-4-6-v1 | anthropic.claude-sonnet-4-6 | anthropic.claude-sonnet-4-5-20250929-v1:0 | anthropic.claude-opus-4-5-20251101-v1:0 |
| **Google Cloud ID**           | claude-opus-4-8           | claude-opus-4-7           | claude-opus-4-6              | claude-sonnet-4-6           | claude-sonnet-4-5@20250929                | claude-opus-4-5@20251101                |
| **Pricing**                   | $5/$25                    | $5/$25                    | $5/$25                       | $3/$15                      | $3/$15                                    | $5/$25                                  |
| **Extended thinking**         | No                        | No                        | Yes (deprecated)             | Yes (deprecated)            | Yes                                       | Yes                                     |
| **Adaptive thinking**         | Yes                       | Yes                       | Yes                          | Yes                         | No                                        | No                                      |
| **Comparative latency**       | Moderate                  | Moderate                  | Moderate                     | Fast                        | Fast                                      | Moderate                                |
| **Context window**            | 1M                        | 1M                        | 1M                           | 1M                          | 200K                                      | 200K                                    |
| **Max output**                | 128K                      | 128K                      | 128K                         | 128K                        | 64K                                       | 64K                                     |
| **Reliable knowledge cutoff** | Jan 2026                  | Jan 2026                  | May 2025                     | Aug 2025                    | Jan 2025                                  | May 2025                                |
| **Training data cutoff**      | Jan 2026                  | Jan 2026                  | Aug 2025                     | Jan 2026                    | Jul 2025                                  | Aug 2025                                |

> **Note:** Claude Opus 4.1 (`claude-opus-4-1-20250805`) was retired on August 5, 2026. Requests to this model now return an error; migrate to Claude Opus 5.

## Model IDs and Versioning

Every Claude model ID is a pinned snapshot. Models with a date in the ID (for example, `20250929`) are fixed to that specific release. Starting with the Claude 4.6 generation, model IDs use a dateless format that is also a pinned snapshot, not an evergreen pointer. For models before the 4.6 generation, entries in the Claude API alias column are convenience pointers that resolve to a dated model ID.

You can query model capabilities and token limits programmatically with the Models API. The response includes `max_input_tokens`, `max_tokens`, and a `capabilities` object for every available model.

## Platform Availability

Models are available via:

- Claude API (direct)
- Claude Platform on AWS
- Amazon Bedrock
- Google Cloud
- Microsoft Foundry (select models)

Starting with Claude Sonnet 4.5 and all subsequent models (including Claude Sonnet 4.6), Bedrock offers two endpoint types: **global endpoints** (dynamic routing for maximum availability) and **regional endpoints** (guaranteed data routing through specific geographic regions). Google Cloud offers three endpoint types: global endpoints, **multi-region endpoints** (dynamic routing within a geographic area), and regional endpoints.

Claude Platform on AWS uses the same model IDs as the Claude API (for example, `claude-opus-4-6`), not Bedrock-style IDs. Model lifecycle on Claude Platform on AWS follows Anthropic's first-party model deprecations, not Bedrock's.

## Key Capabilities

- **Performance:** Top-tier results in reasoning, coding, multilingual tasks, long-context handling, honesty, and image processing
- **Adaptive thinking:** Opus 5, Opus 4.8, Opus 4.7, Opus 4.6, Sonnet 5, and Sonnet 4.6 support dynamic thinking allocation; Fable 5 and Mythos 5 have always-on adaptive thinking
- **1M context:** 1M token context window on Claude Fable 5, Mythos 5, Opus 5, Opus 4.8, Opus 4.7, Opus 4.6, Sonnet 5, and Sonnet 4.6
- **Context awareness:** Sonnet 5, Sonnet 4.6, Sonnet 4.5, and Haiku 4.5 track remaining context budget

## Migration

- For migrating to Claude Opus 5, see [Migrating to Claude Opus 5](https://platform.claude.com/docs/en/about-claude/models/migration-guide#migrating-from-claude-opus-4-8-to-claude-opus-5)
