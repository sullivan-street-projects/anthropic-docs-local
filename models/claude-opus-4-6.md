---
title: "Claude Opus 4.6"
source_url: "https://www.anthropic.com/news/claude-opus-4-6"
source_type: "web-extracted"
fetched_at: "2026-07-27T00:00:00Z"
category: "models"
---

# Claude Opus 4.6

Claude Opus 4.6 is Anthropic's most advanced model, demonstrating significant improvements in coding, reasoning, and agentic tasks. It achieves the highest score on the agentic coding evaluation Terminal-Bench 2.0 and leads all other frontier models on Humanity's Last Exam.

## Model IDs

| Platform      | Model ID                       |
| :------------ | :----------------------------- |
| Claude API    | `claude-opus-4-6`              |
| AWS Bedrock   | `anthropic.claude-opus-4-6-v1` |
| GCP Vertex AI | `claude-opus-4-6`              |

## Pricing

| Tier                        | Input      | Output        |
| :-------------------------- | :--------- | :------------ |
| Standard (≤200K tokens)     | $5 / MTok  | $25 / MTok    |
| Long context (>200K tokens) | $10 / MTok | $37.50 / MTok |

## Specifications

| Feature                       | Detail                          |
| :---------------------------- | :------------------------------ |
| Context window                | 200K tokens (1M tokens in beta) |
| Max output                    | 128K tokens                     |
| Reliable knowledge cutoff     | May 2025                        |
| Training data cutoff          | August 2025                     |
| Extended thinking             | Yes                             |
| Adaptive thinking             | Yes (recommended)               |
| Vision                        | Yes                             |
| Prefilling assistant messages | Not supported                   |

## Performance

- **GDPval-AA**: Outperforms GPT-5.2 by approximately 144 Elo points (70% win rate) and predecessor Opus 4.5 by 190 points on economically valuable knowledge work tasks
- **Terminal-Bench 2.0**: Industry-leading agentic coding and system task performance
- **BrowseComp**: Best performance for locating hard-to-find information online
- **Multilingual coding**: Resolves engineering issues across programming languages
- **Life sciences**: Nearly 2x better performance than Opus 4.5 on computational biology, structural biology, organic chemistry, and phylogenetics

## Key Features

### Adaptive Thinking

Recommended for Opus 4.6 (`thinking: {type: "adaptive"}`). The model autonomously selects when deeper reasoning proves beneficial, adjusting based on contextual clues about task complexity. Manual thinking (`type: "enabled"` with `budget_tokens`) is deprecated for this model.

### Effort Controls

Four configurable levels via the `effort` parameter — `low`, `medium`, `high` (default), and `max` — allowing developers to balance intelligence, speed, and cost. The effort parameter is now generally available (no beta header required).

### Fast Mode (Research Preview)

Up to 2.5x faster output token generation via the `speed` parameter at premium pricing. Launched February 7, 2026.

### Compaction API (Beta)

Server-side context summarization for effectively infinite conversations. Automatically summarizes and replaces older context when conversations approach configurable thresholds, enabling longer-running tasks.

### Data Residency Controls

Specify where model inference runs with the `inference_geo` parameter. US-only inference available at 1.1x token pricing.

### 1M Token Context Window (Beta)

Available via the `context-1m-2025-08-07` beta header. Long context pricing applies to requests exceeding 200K input tokens.

### Agent Teams (Claude Code)

Developers can deploy multiple coordinating agents working in parallel for independent, read-heavy tasks.

## Safety

Opus 4.6 demonstrates alignment comparable to Opus 4.5 with low rates of misaligned behavior across safety evaluations and the lowest rate of over-refusals among recent Claude models. Six new cybersecurity probes were implemented to monitor potential misuse.

## Product Integrations

- **Claude in Excel**: Enhanced long-running task handling with improved data ingestion
- **Claude in PowerPoint**: Research preview supporting brand consistency through layout and font preservation

## Migration

For detailed migration instructions, see the [Migration guide](https://platform.claude.com/docs/en/about-claude/models/migration-guide).

The recommended replacement for all deprecated models is now `claude-opus-4-6`:

- Claude Sonnet 3.7 → `claude-opus-4-6`
- Claude Sonnet 3.5 → `claude-opus-4-6`
- Claude Opus 3 → `claude-opus-4-6`
- Claude 2.x / Sonnet 3 → `claude-opus-4-6`
