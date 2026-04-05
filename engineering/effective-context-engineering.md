---
title: "Effective context engineering for AI agents"
source_url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents"
source_type: "web-extracted"
fetched_at: "2026-04-05T00:00:00Z"
category: "engineering"
published: "2025-09-29"
---

# Effective context engineering for AI agents

**Publication Date:** September 29, 2025

Context engineering represents a shift in how teams build with large language models. Rather than focusing solely on prompt wording, engineers must now consider "what configuration of context is most likely to generate our model's desired behavior?"

Context refers to all tokens provided to an LLM during inference. The engineering challenge involves optimizing token utility within LLM constraints to achieve consistent outcomes. This requires "thinking in context"—understanding the complete information state available to the model and its potential behavioral implications.

## Context Engineering vs. Prompt Engineering

Anthropic views context engineering as prompt engineering's natural evolution. While prompt engineering addresses instruction writing and organization, context engineering encompasses broader strategies for maintaining optimal token sets during inference, including system instructions, tools, external data, and message history.

As agents operate over multiple turns, they accumulate data potentially relevant for subsequent inferences. Context engineering represents the "art and science" of determining what information enters the limited context window from constantly evolving possibilities.

## Why Context Engineering Matters

Research on "context rot" demonstrates that model accuracy decreases as context window size increases. Like humans with limited working memory, LLMs have finite "attention budgets." Each added token depletes this budget, necessitating careful curation.

This scarcity stems from transformer architecture constraints. Since every token attends to every other token, n tokens create n² pairwise relationships. As context lengthens, models struggle capturing these relationships. Additionally, models trained on shorter sequences have less experience with long-range dependencies.

## Anatomy of Effective Context

Good context engineering means "find the smallest set of high-signal tokens that maximize the likelihood of your desired outcome."

**System Prompts:** Should be clear, direct, and pitched at the "right altitude"—specific enough to guide behavior but flexible enough to provide strong heuristics.

**Tools:** Should be self-contained, clearly purposeful, and non-overlapping in functionality. Well-designed tools return token-efficient information and encourage efficient agent behaviors.

**Examples:** Few-shot prompting remains valuable. Rather than listing exhaustive edge cases, curate diverse canonical examples.

## Long-Horizon Context Engineering

Extended tasks require specialized techniques:

**Compaction:** Summarizing conversations nearing context limits, then reinitializing with compressed summaries.

**Structured Note-Taking:** Agents maintain persistent external notes providing memory with minimal overhead.

**Sub-agent Architectures:** Specialized sub-agents handle focused tasks with clean context windows, returning condensed summaries.

## Conclusion

Whether implementing compaction, designing token-efficient tools, or enabling just-in-time exploration, the principle remains consistent: maximize desired outcomes using minimal high-signal tokens.
