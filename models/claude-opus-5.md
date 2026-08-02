---
title: "Claude Opus 5"
source_url: "https://www.anthropic.com/news/claude-opus-5"
source_type: "web-extracted"
fetched_at: "2026-08-02T00:00:00Z"
category: "models"
---

# Claude Opus 5

**Release Date:** July 24, 2026

**API Model ID:** `claude-opus-5`

## Positioning

Claude Opus 5 is Anthropic's new flagship Opus model. It is the new **default model on Claude Max** and the **strongest model available on Claude Pro**. Anthropic positions it as delivering "the frontier intelligence of Claude Fable 5 at half the price."

## Pricing & Availability

### Standard Mode

- Input: $5 per million tokens
- Output: $25 per million tokens

### Fast Mode

- Around 2.5x the default speed at twice the base price

Available via the Claude API (`claude-opus-5`), claude.ai (Max/Pro), and Claude Code.

## Technical Specifications

- **Context window:** 1M tokens
- **Max output:** 128K tokens
- **Knowledge cutoff:** May 2026
- **Adaptive thinking:** On by default — Opus 5 dynamically decides how much to reason before responding
- **Effort ladder:** Configurable effort levels — `low`, `medium`, `high`, `xhigh`, `max` — letting users optimize for intelligence or conserve tokens

## Benchmarks Highlighted

### Coding / Software Engineering

- **Frontier-Bench v0.1:** Surpasses all competing models; more than doubles Opus 4.8's score at lower cost
- **CursorBench 3.2:** Within 0.5% of Fable 5's peak score at half the cost
- **ARC-AGI 3:** Scores three times higher than the next-best model

### Knowledge Work

- **Zapier AutomationBench:** Pass rate roughly 1.5x the next-best model at the same cost
- **OSWorld 2.0:** Outperforms all models at a given cost, surpassing Fable 5 at just over a third of the cost

### Scientific Research

- **Organic chemistry:** 10.2 percentage points higher than Opus 4.8
- **Protein prediction:** 7.7 percentage points higher than its predecessor

## Key Capabilities

Opus 5 emphasizes verifying its own work and iterating carefully until it succeeds. Highlighted behaviors include:

- Autonomous problem-solving — e.g., building computer vision pipelines when it cannot directly view output
- Independently debugging complex systems
- Stronger agentic reliability across long, multi-step end-to-end tasks
