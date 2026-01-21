---
title: "Claude Models Overview"
source_url: "https://platform.claude.com/docs/en/about-claude/models/overview"
source_type: "web-extracted"
fetched_at: "2026-01-21T00:00:00Z"
category: "models"
---

# Claude Models Overview

Claude is a family of state-of-the-art large language models developed by Anthropic. All current Claude models support text and image input, text output, multilingual capabilities, and vision.

## Choosing a Model

If you're unsure which model to use, start with **Claude Sonnet 4.5**. It offers the best balance of intelligence, speed, and cost for most use cases, with exceptional performance in coding and agentic tasks.

## Current Models Comparison

| Feature | Claude Sonnet 4.5 | Claude Haiku 4.5 | Claude Opus 4.5 |
|:--------|:------------------|:-----------------|:----------------|
| **Description** | Smart model for complex agents and coding | Fastest model with near-frontier intelligence | Premium model combining maximum intelligence with practical performance |
| **API ID** | `claude-sonnet-4-5-20250929` | `claude-haiku-4-5-20251001` | `claude-opus-4-5-20251101` |
| **API Alias** | `claude-sonnet-4-5` | `claude-haiku-4-5` | `claude-opus-4-5` |
| **Pricing** | $3 / MTok input, $15 / MTok output | $1 / MTok input, $5 / MTok output | $5 / MTok input, $25 / MTok output |
| **Extended Thinking** | Yes | Yes | Yes |
| **Priority Tier** | Yes | Yes | Yes |
| **Latency** | Fast | Fastest | Moderate |
| **Context Window** | 200K tokens (1M beta) | 200K tokens | 200K tokens |
| **Max Output** | 64K tokens | 64K tokens | 64K tokens |
| **Reliable Knowledge Cutoff** | Jan 2025 | Feb 2025 | May 2025 |
| **Training Data Cutoff** | Jul 2025 | Jul 2025 | Aug 2025 |

## Legacy Models

| Feature | Claude Opus 4.1 | Claude Sonnet 4 | Claude Sonnet 3.7 | Claude Opus 4 | Claude Haiku 3 |
|:--------|:----------------|:----------------|:------------------|:--------------|:---------------|
| **API ID** | `claude-opus-4-1-20250805` | `claude-sonnet-4-20250514` | `claude-3-7-sonnet-20250219` | `claude-opus-4-20250514` | `claude-3-haiku-20240307` |
| **Pricing** | $15 / $75 MTok | $3 / $15 MTok | $3 / $15 MTok | $15 / $75 MTok | $0.25 / $1.25 MTok |
| **Extended Thinking** | Yes | Yes | Yes | Yes | No |
| **Context Window** | 200K | 200K (1M beta) | 200K | 200K | 200K |
| **Max Output** | 32K | 64K | 64K (128K beta) | 32K | 4K |

## Pricing Comparison

| Model | Input (MTok) | Output (MTok) | Batch Input | Batch Output |
|-------|--------------|---------------|-------------|--------------|
| Opus 4.5 | $5 | $25 | $2.50 | $12.50 |
| Opus 4.1 | $15 | $75 | $7.50 | $37.50 |
| Opus 4 | $15 | $75 | $7.50 | $37.50 |
| Sonnet 4.5 | $3 | $15 | $1.50 | $7.50 |
| Sonnet 4 | $3 | $15 | $1.50 | $7.50 |
| Haiku 4.5 | $1 | $5 | $0.50 | $2.50 |
| Haiku 3.5 | $0.80 | $4 | $0.40 | $2 |
| Haiku 3 | $0.25 | $1.25 | $0.125 | $0.625 |

## Prompt Caching Pricing

| Model | 5m Cache Write | 1h Cache Write | Cache Read |
|-------|----------------|----------------|------------|
| Opus 4.5 | $6.25 / MTok | $10 / MTok | $0.50 / MTok |
| Sonnet 4.5 | $3.75 / MTok | $6 / MTok | $0.30 / MTok |
| Haiku 4.5 | $1.25 / MTok | $2 / MTok | $0.10 / MTok |

## Long Context Pricing (Sonnet 4/4.5)

When using the 1M token context window beta (`context-1m-2025-08-07` header):

| Token Range | Input | Output |
|-------------|-------|--------|
| ≤ 200K | $3 / MTok | $15 / MTok |
| > 200K | $6 / MTok | $22.50 / MTok |

## Capabilities Matrix

| Capability | Opus | Sonnet | Haiku |
|------------|------|--------|-------|
| Vision | Yes | Yes | Yes |
| Extended Thinking | Yes | Yes | Yes (4.5+) |
| Tool Use | Yes | Yes | Yes |
| Computer Use | Yes | Yes | Yes (4.5+) |
| Streaming | Yes | Yes | Yes |
| Batch API | Yes | Yes | Yes |
| Prompt Caching | Yes | Yes | Yes |

## Model Selection Guide

**Choose Opus when:**
- Complex multi-step reasoning required
- Highest accuracy is critical
- Research or analysis tasks
- Cost is not primary concern

**Choose Sonnet when:**
- Coding and development tasks
- Agent workflows
- Computer use automation
- Balance of quality and cost

**Choose Haiku when:**
- High-volume processing
- Real-time responses needed
- Cost optimization priority
- Simple to moderate tasks

## Platform Availability

Claude models are available on:
- **Anthropic API** (direct)
- **AWS Bedrock**
- **Google Vertex AI**
- **Microsoft Foundry**

Third-party platforms offer global endpoints (dynamic routing) and regional endpoints (10% premium for guaranteed geographic routing).

## Notes

- **Aliases** automatically point to the most recent model snapshot. Use specific model versions (e.g., `claude-sonnet-4-5-20250929`) in production for consistent behavior.
- **Reliable knowledge cutoff** indicates the date through which a model's knowledge is most extensive and reliable. Training data cutoff is the broader date range of training data used.
