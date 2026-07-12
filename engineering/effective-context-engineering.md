---
title: "Effective context engineering for AI agents"
source_url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents"
source_type: "web-extracted"
fetched_at: "2026-07-12T00:00:00Z"
category: "engineering"
published: "2025-09-29"
---

# Effective context engineering for AI agents

**Publication Date:** September 29, 2025

Context engineering represents a strategic shift in building with language models, moving beyond traditional prompt engineering to manage the entire token landscape during inference.

## Context Engineering vs. Prompt Engineering

"Context engineering" differs from prompt engineering in scope. While prompt engineering focuses on "writing and organizing LLM instructions for optimal outcomes," context engineering encompasses "strategies for curating and maintaining the optimal set of tokens (information) during LLM inference."

The distinction matters because agents operating in loops generate continuously evolving data that must be cyclically refined. As agents become more sophisticated, managing system instructions, tools, external data, and message history becomes essential.

## Why Context Matters

LLMs exhibit "context rot"—performance degradation as context windows expand. This occurs because transformer architectures create n² pairwise relationships between tokens, stretching the model's attention as sequences lengthen. Additionally, models trained on shorter sequences have fewer specialized parameters for handling extensive context dependencies.

## Anatomy of Effective Context

### System Prompts

Effective prompts strike a balance between specificity and flexibility. They should be "specific enough to guide behavior effectively, yet flexible enough to provide the model with strong heuristics."

Recommended practices include:

- Organizing into distinct sections using XML tags or Markdown headers
- Using simple, direct language at the appropriate abstraction level
- Avoiding hardcoded brittle logic while preventing vague guidance
- Testing minimal prompts first, then adding instructions based on failure modes

### Tools

Tools define the contract between agents and their environment. Optimal tools should be:

- Self-contained and robust to errors
- Clear about intended use
- Free from functional overlap
- Minimal in scope to prevent ambiguous decision-making

"Bloated tool sets that cover too much functionality" represent common failure modes that reduce agent reliability.

### Examples (Few-Shot Prompting)

Rather than documenting exhaustive edge cases, teams should "curate a set of diverse, canonical examples that effectively portray the expected behavior of the agent."

## Runtime Context Retrieval

Modern AI applications increasingly employ "just in time" context strategies rather than pre-processing all relevant data upfront. Agents maintain lightweight identifiers (file paths, URLs, queries) and dynamically load data through tools during execution.

This approach mirrors human cognition—external indexing systems retrieve information on demand rather than memorizing entire corpuses.

### Progressive Disclosure

Agents can discover context incrementally through exploration. File hierarchies, naming conventions, and timestamps provide signals guiding autonomous navigation. This self-managed approach keeps agents focused on relevant subsets.

### Hybrid Strategies

Many effective agents employ hybrid models: retrieving some data preemptively for speed while enabling autonomous exploration when needed. The optimal balance depends on task characteristics and content dynamism.

## Long-Horizon Task Strategies

### Compaction

Compaction involves summarizing conversation history near context limits, then reinitializing with the compressed summary. Implementation requires careful prompt tuning to "maximize recall to ensure your compaction prompt captures every relevant piece of information," then iterating to improve precision.

One technique involves clearing redundant tool results—once a tool has been called, agents typically don't require seeing raw results again.

### Structured Note-Taking

Agents maintain persistent memories outside the context window, pulling them back when relevant. This enables tracking progress across complex tasks without exhausting context limits.

The Claude Developer Platform provides memory tools using file-based systems for storing knowledge bases and project state.

### Sub-Agent Architectures

Specialized sub-agents handle focused tasks with clean context windows, returning condensed summaries (typically 1,000-2,000 tokens) to coordinating agents. This "clear separation of concerns" isolates detailed search context while allowing lead agents to synthesize results.

## Implementation Guidance

The overarching principle remains: identify "the smallest set of high-signal tokens that maximize the likelihood of your desired outcome."

As models improve, they require less prescriptive engineering, enabling greater agent autonomy. However, treating context as a finite resource remains fundamental to building reliable agents.

Developers can begin implementing context engineering through the Claude Developer Platform, with resources available in the memory and context management cookbook and tool-use documentation.
