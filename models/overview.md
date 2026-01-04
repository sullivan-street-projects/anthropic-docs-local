---
title: "Claude Models Overview"
source_url: "https://platform.claude.com/docs/en/about-claude/pricing"
source_type: "web-extracted"
fetched_at: "2026-01-04T06:05:00Z"
category: "models"
---

# Claude Models Overview

Anthropic offers a family of Claude models designed for different use cases, balancing capability, speed, and cost.

## Model Tiers

| Tier | Model | Best For |
|------|-------|----------|
| **Premium** | Opus 4.5, Opus 4.1, Opus 4 | Complex reasoning, research, agentic tasks |
| **Balanced** | Sonnet 4.5, Sonnet 4 | General coding, agents, computer use |
| **Efficient** | Haiku 4.5, Haiku 3.5 | Fast responses, high-volume, cost-sensitive |

## Current Models (2025)

### Claude Opus 4.5 (Latest Premium)
- **Model ID**: `claude-opus-4-5-20251101`
- **Context Window**: 200K tokens
- **Max Output**: 16K tokens
- **Pricing**: $5 / MTok input, $25 / MTok output
- **Features**: Hybrid reasoning, extended thinking, vision

### Claude Sonnet 4.5 (Latest Balanced)
- **Model ID**: `claude-sonnet-4-5-20250929`
- **Context Window**: 200K tokens (1M beta available)
- **Max Output**: 16K tokens
- **Pricing**: $3 / MTok input, $15 / MTok output
- **Features**: Best coding performance, computer use, agents

### Claude Haiku 4.5 (Latest Efficient)
- **Model ID**: `claude-haiku-4-5-20251001`
- **Context Window**: 200K tokens
- **Max Output**: 64K tokens
- **Pricing**: $1 / MTok input, $5 / MTok output
- **Features**: Fastest model, extended thinking, computer use

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

## Long Context Pricing (Sonnet 4/4.5 only)

When using the 1M token context window beta:

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

Third-party platforms may have different pricing, especially for regional vs. global endpoints (10% premium for regional).
