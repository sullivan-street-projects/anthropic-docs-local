---
title: "Claude Opus 5.5"
source_url: "https://www.anthropic.com/claude-opus-5-5"
source_type: "web-extracted"
fetched_at: "2026-09-27T00:00:00Z"
category: "models"
---

# Claude Opus 5.5

Claude Opus 5.5 (`claude-opus-5-5`), released **September 22, 2026**, is the first model in Anthropic's Claude 5.5 family and the new default Opus. It is positioned for long-running agentic coding and knowledge work, delivering a major capability upgrade while cutting cost relative to Claude Opus 5.

## Headline claims

- Performs at the level of **Claude Fable 5.1** on most tasks while costing **~40% less to run than Claude Opus 5**.
- Achieved the top score on Anthropic's automated behavioral audit — described as "the strongest-performing model we've tested to date" for alignment measures.
- Output generation is **~30% faster** than Claude Opus 5.

## Specifications

| Attribute                 | Value                                                               |
| :------------------------ | :------------------------------------------------------------------ |
| Claude API ID / alias     | `claude-opus-5-5`                                                   |
| Context window            | 1M tokens (default)                                                 |
| Max output                | 128K tokens (300K on the Batches API with `output-300k-2026-03-24`) |
| Thinking                  | Always-on adaptive thinking (cannot be disabled)                    |
| Default effort            | `medium`                                                            |
| Reliable knowledge cutoff | Jun 2026                                                            |
| Retirement                | Not sooner than September 22, 2027                                  |

### Pricing (vs. Claude Opus 5)

|             | Opus 5.5                                      | Opus 5       |
| :---------- | :-------------------------------------------- | :----------- |
| Input       | **$4 / MTok** (20% less)                      | $5 / MTok    |
| Output      | **$20 / MTok** (20% less)                     | $25 / MTok   |
| Cache reads | **$0.20 / MTok** (60% less; 5% of base input) | $0.25 / MTok |

## Benchmarks

- **Terminal-Bench 4.0** (agentic coding): 66.4%
- **GDPval-AA v2.1** (knowledge work across 44 occupations): 1846 Elo
- **OSWorld 2.0** (computer use, partial credit): 81.8%
- On FrontierCode agentic coding, reported to outperform "GPT-6 Astra" at roughly 20% of the cost.

## Agentic coding and knowledge work

- An early tester completed a **680,000-line code migration in under a day** — work estimated at weeks for an engineering team.
- On a web performance optimization task, succeeded **39 of 40 times**.
- On financial research tasks, cleared quality standards **16 of 18 times**, where neither Fable 5.1 nor Opus 5 met the bar in any attempt; it also caught an error in a quantitative research firm's evaluation instructions that no previously tested model had found.
- Communicates "more naturally than prior models" — clearer writing that puts the most important information up front.

## API changes (migrating from Claude Opus 5)

- **Thinking cannot be disabled.** `thinking: {"type": "disabled"}` and the manual `thinking: {"type": "enabled", ...}` form both return a 400 error. Omit `thinking` and steer depth with the `effort` parameter (default `medium`).
- **`tool_choice`** types `any` and `tool` return a 400 error. Use `auto` with strict tool use.
- **Computer use** requires the `computer_toolset_20260801` toolset on the Claude API and Google Cloud; the earlier `computer_20251124` tool returns 400 (it keeps working on Amazon Bedrock).
- **Fast mode** (research preview) is available for Claude Opus 5.5 on the Claude API.

## Safety

Enhanced defenses against prompt injection, matching or beating Claude Opus 5 across all tested settings. Ships with cybersecurity and biology safeguards; verified users can access fuller capabilities through verification programs.

## Availability

Available immediately on the Claude API, Amazon Bedrock, Claude Platform on AWS, Google Cloud, and Microsoft Foundry, via `claude-opus-5-5`.

For migration guidance, see [Migrating to Claude Opus 5.5](https://platform.claude.com/docs/en/models/opus-5-5/migration-guide).
