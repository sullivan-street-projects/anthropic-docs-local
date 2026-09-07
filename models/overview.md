---
title: "Claude Models Overview"
source_url: "https://platform.claude.com/docs/en/about-claude/models/overview"
source_type: "web-extracted"
fetched_at: "2026-09-07T00:00:00Z"
category: "models"
---

# Models Overview

Claude is a family of state-of-the-art large language models developed by Anthropic. Compare the current lineup, find the model ID for every platform, and open each model's page for its full specs and resources.

## Choosing a Model

If you're unsure which model to use, start with **Claude Opus 5** for most workloads. Use **Claude Fable 5.1** for demanding reasoning and long-horizon agentic work, or when your evals on Claude Opus 5 at higher effort still fall short.

All current Claude models support text and image input, text output, multilingual capabilities, vision, and tool use. Each model's page lists the platforms it's available on.

### Claude Fable 5.1 and Claude Mythos 5.1

Claude Fable 5.1 (`claude-fable-5-1`) is Anthropic's most capable widely released model, tuned for demanding reasoning and long-horizon agentic work. It launched September 1, 2026. Compared with Claude Fable 5, it costs roughly 25% less for typical workloads because prompt cache reads are priced at 2.5% of the base input price (down from 10%). Claude Mythos 5.1 (`claude-mythos-5-1`) shares Claude Fable 5.1's specs and pricing (including the 2.5% cache-read rate) and continues the invitation-only Project Glasswing line alongside the deprecated Claude Mythos Preview (`claude-mythos-preview`). Claude Mythos is offered in limited availability to approved customers for defensive cybersecurity workflows; access is invitation-only with no self-serve sign-up.

## Compare Models

| Feature | Claude Fable 5.1 | Claude Opus 5 | Claude Sonnet 5 | Claude Haiku 4.5 |
| :--- | :--- | :--- | :--- | :--- |
| **Description** | For demanding reasoning and long-horizon agentic work | For complex agentic coding and enterprise work | The best combination of speed and intelligence | The fastest model with near-frontier intelligence |
| **Claude API ID** | `claude-fable-5-1` | `claude-opus-5` | `claude-sonnet-5` | `claude-haiku-4-5-20251001` |
| **Claude API alias** | `claude-fable-5-1` | `claude-opus-5` | `claude-sonnet-5` | `claude-haiku-4-5` |
| **AWS Bedrock ID** | `anthropic.claude-fable-5-1` | `anthropic.claude-opus-5` | `anthropic.claude-sonnet-5` | `anthropic.claude-haiku-4-5` |
| **Google Cloud ID** | `claude-fable-5-1` | `claude-opus-5` | `claude-sonnet-5` | `claude-haiku-4-5@20251001` |
| **Microsoft Foundry ID** | `claude-fable-5-1` | `claude-opus-5` | `claude-sonnet-5` | `claude-haiku-4-5` |
| **Claude Platform on AWS ID** | `claude-fable-5-1` | — | `claude-sonnet-5` | `claude-haiku-4-5` |
| **Pricing** | $10 / input MTok, $50 / output MTok | $5 / input MTok, $25 / output MTok | $2 / input MTok, $10 / output MTok | $1 / input MTok, $5 / output MTok |
| **Thinking** | Adaptive (always on) | Adaptive | Adaptive | Extended |
| **Default effort** | `high` | `high` | `high` | Not supported |
| **Comparative latency** | Slower | Moderate | Fast | Fastest |
| **Context window** | 1M tokens | 1M tokens | 1M tokens | 200K tokens |
| **Max output** | 128K tokens | 128K tokens | 128K tokens | 64K tokens |
| **Reliable knowledge cutoff** | Jun 2026 | May 2026 | Jan 2026 | Feb 2025 |
| **Training data cutoff** | Jun 2026 | May 2026 | Jan 2026 | Jul 2025 |
| **Retirement** | Not sooner than September 1, 2027 | Not sooner than July 24, 2027 | Not sooner than June 30, 2027 | Not sooner than October 15, 2026 |

**Notes:**

- **Comparative latency:** Relative to the current lineup. Actual latency depends on prompt length, output length, and thinking effort.
- **Pricing:** Base price per million tokens. Batch API requests are 50% off; prompt cache reads cost 10% of the base input price (2.5% on Claude Fable 5.1 and Claude Mythos 5.1). See Pricing for cache writes, long-context, and per-platform pricing.
- **Claude API ID:** Every Claude model ID is a pinned snapshot, including the dateless IDs used from the 4.6 generation on.
- **Thinking:** Adaptive thinking lets the model decide how much to think, steered by effort. Extended thinking is the manual `thinking.type "enabled"` + `budget_tokens` mode on earlier models; it is deprecated on Claude Opus 4.6 and Claude Sonnet 4.6 and not accepted on later models.
- **Default effort:** The effort parameter's default on the Claude API. Set effort explicitly to use a different level.
- **Context window:** 1M tokens is roughly 555k words or 2.5M Unicode characters on the current tokenizer (introduced with Claude Opus 4.7); models before it fit about 750k words in 1M tokens. 200k tokens is roughly 150k words.
- **Max output:** Synchronous Messages API limit. On the Message Batches API, Claude Opus 5, Claude Sonnet 5, Claude Opus 4.8, Claude Opus 4.7, Claude Opus 4.6, and Claude Sonnet 4.6 support up to 300K output tokens with the `output-300k-2026-03-24` beta header.
- **Reliable knowledge cutoff:** The date through which the model's knowledge is most extensive and reliable. Training data cutoff is the broader range of data used. See Anthropic's Transparency Hub for details.
- **Retirement:** Anthropic's commitment for Anthropic-operated platforms (Claude API, Claude Platform on AWS, Microsoft Foundry). Amazon Bedrock and Google Cloud set their own dates.
- **Claude API alias:** For models before the 4.6 generation, the alias is a convenience pointer that resolves to the dated ID. Dateless IDs are their own pinned snapshot; the alias row repeats them.
- **Amazon Bedrock ID:** The ID on Bedrock's Messages-API endpoint (Claude Opus 4.7 and later, plus Claude Haiku 4.5). Bedrock offers global endpoints (dynamic routing) and regional endpoints (guaranteed data routing) for Claude Sonnet 4.5 and later, and sets its own lifecycle dates.
- **Google Cloud ID:** Google Cloud offers global, multi-region, and regional endpoints, and sets its own lifecycle dates.
- **Microsoft Foundry ID:** Foundry deployments default to the Claude API model ID (the alias, where one exists); the deployment name is what you send. Foundry follows the Claude API lifecycle schedule.
- **Claude Platform on AWS ID:** Claude Platform on AWS uses the Claude API model IDs (the dateless form where the Claude API has an alias), not Bedrock-style IDs, and follows Anthropic's first-party model lifecycle.
- Claude Sonnet 5 is priced at $2 / $10 per MTok. This was introductory pricing that became the standard price on August 10, 2026.
- Claude Fable 5.1 uses the tokenizer introduced with Claude Opus 4.7; compared to models before Claude Opus 4.7, the same text produces roughly 30% more tokens. The exact increase depends on the content.
- You can query model capabilities and token limits programmatically with the Models API. The response includes `max_input_tokens`, `max_tokens`, and a `capabilities` object for every available model.

See [Model IDs and versioning](https://platform.claude.com/docs/en/about-claude/models/model-ids-and-versions) and [Pricing](https://platform.claude.com/docs/en/about-claude/pricing).

## Legacy Models

Legacy models (still available): Claude Fable 5, Claude Opus 4.8, Claude Opus 4.7, Claude Opus 4.6, Claude Opus 4.5, Claude Sonnet 4.6, Claude Sonnet 4.5.

| Feature | Claude Fable 5 | Claude Opus 4.8 | Claude Opus 4.7 | Claude Opus 4.6 | Claude Sonnet 4.6 | Claude Sonnet 4.5 | Claude Opus 4.5 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Claude API ID** | `claude-fable-5` | `claude-opus-4-8` | `claude-opus-4-7` | `claude-opus-4-6` | `claude-sonnet-4-6` | `claude-sonnet-4-5-20250929` | `claude-opus-4-5-20251101` |
| **Claude API alias** | `claude-fable-5` | `claude-opus-4-8` | `claude-opus-4-7` | `claude-opus-4-6` | `claude-sonnet-4-6` | `claude-sonnet-4-5` | `claude-opus-4-5` |
| **AWS Bedrock ID** | `anthropic.claude-fable-5` | `anthropic.claude-opus-4-8` | `anthropic.claude-opus-4-7` | `anthropic.claude-opus-4-6-v1` | `anthropic.claude-sonnet-4-6` | `anthropic.claude-sonnet-4-5-20250929-v1:0` | `anthropic.claude-opus-4-5-20251101-v1:0` |
| **Google Cloud ID** | `claude-fable-5` | `claude-opus-4-8` | `claude-opus-4-7` | `claude-opus-4-6` | `claude-sonnet-4-6` | `claude-sonnet-4-5@20250929` | `claude-opus-4-5@20251101` |
| **Pricing** | $10/$50 MTok | $5/$25 MTok | $5/$25 MTok | $5/$25 MTok | $3/$15 MTok | $3/$15 MTok | $5/$25 MTok |
| **Extended thinking** | No | No | No | Yes (deprecated) | Yes (deprecated) | Yes | Yes |
| **Adaptive thinking** | Yes (always on) | Yes | Yes | Yes | Yes | No | No |
| **Comparative latency** | Slower | Moderate | Moderate | Moderate | Fast | Fast | Moderate |
| **Context window** | 1M tokens | 1M tokens | 1M tokens | 1M tokens | 1M tokens | 200K tokens | 200K tokens |
| **Max output** | 128K tokens | 128K tokens | 128K tokens | 128K tokens | 128K tokens | 64K tokens | 64K tokens |
| **Reliable knowledge cutoff** | Jan 2026 | Jan 2026 | Jan 2026 | May 2025 | Aug 2025 | Jan 2025 | May 2025 |
| **Training data cutoff** | Jan 2026 | Jan 2026 | Jan 2026 | Aug 2025 | Jan 2026 | Jul 2025 | Aug 2025 |

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

Current Claude models excel in:

- **Performance**: Top-tier results in reasoning, coding, multilingual tasks, long-context handling, honesty, and image processing. See Prompting best practices for general and model-specific prompting guidance.
- **Engaging responses**: Claude models are ideal for applications that require rich, human-like interactions. If you prefer more concise responses, adjust your prompts to guide the model toward the desired output length. Refer to the prompt engineering guides for details.
- **Output quality**: When migrating from a previous model generation, you may notice larger improvements in overall performance. If you're on Claude Opus 4.8 or earlier, see Migrating to Claude Opus 5.

## Using the Models API

You can query model capabilities and token limits programmatically with the Models API. The response includes `max_input_tokens`, `max_tokens`, and a `capabilities` object for every available model.
