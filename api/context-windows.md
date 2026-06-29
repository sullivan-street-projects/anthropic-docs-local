---
title: "Context Windows"
source_url: "https://platform.claude.com/docs/en/docs/build-with-claude/context-windows"
source_type: "web-extracted"
fetched_at: "2026-06-28T00:00:00Z"
category: "api"
---

# Context Windows

As conversations grow, you'll eventually approach context window limits. This guide explains how context windows work and introduces strategies for managing them effectively.

For long-running conversations and agentic workflows, [server-side compaction](https://platform.claude.com/docs/en/build-with-claude/compaction) is the primary strategy for context management. For more specialized needs, [context editing](https://platform.claude.com/docs/en/build-with-claude/context-editing) offers additional strategies like tool result clearing and thinking block clearing.

## Understanding the Context Window

The "context window" refers to all the text a language model can reference when generating a response, including the response itself. This is different from the large corpus of data the language model was trained on, and instead represents a "working memory" for the model. A larger context window allows the model to handle more complex and lengthy prompts, but more context isn't automatically better. As token count grows, accuracy and recall degrade, a phenomenon known as *context rot*. This makes curating what's in context just as important as how much space is available.

Claude achieves state-of-the-art results on long-context retrieval benchmarks like MRCR and GraphWalks, but these gains depend on what's in context, not just how much fits.

### Key Concepts

- **Progressive token accumulation:** As the conversation advances through turns, each user message and assistant response accumulates within the context window. Previous turns are preserved completely.
- **Linear growth pattern:** The context usage grows linearly with each turn, with previous turns preserved completely.
- **Context window capacity:** The total available context window (up to 1M tokens) represents the maximum capacity for storing conversation history and generating new output from Claude.
- **Input-output flow:** Each turn consists of an input phase (all previous conversation history plus the current user message) and an output phase (generates a text response that becomes part of a future input).

## Context Window Sizes

Claude Opus 4.8, Claude Mythos Preview, Claude Opus 4.7, Claude Opus 4.6, and Claude Sonnet 4.6 have a 1M-token context window on the Claude API, Amazon Bedrock, and Google Cloud. On Microsoft Foundry, Claude Opus 4.8 has a 200k-token context window. Other Claude models, including Claude Sonnet 4.5, have a 200k-token context window.

Claude Fable 5 and Claude Mythos 5 (`claude-fable-5` and `claude-mythos-5`) have a 1M-token context window on the Claude API. The 1M maximum is also the default, and a single request can generate up to 128k output tokens (`max_tokens`).

A single request can include up to 600 images or PDF pages (100 for models with a 200k-token context window). When sending many images or large documents, you may approach request size limits before the token limit.

## The Context Window with Extended Thinking

When using extended thinking, all input and output tokens, including the tokens used for thinking, count toward the context window limit, with a few nuances in multi-turn situations.

The thinking budget tokens are a subset of your `max_tokens` parameter, are billed as output tokens, and count towards rate limits. With adaptive thinking, Claude dynamically decides its thinking allocation, so actual thinking token usage may vary per request.

However, previous thinking blocks are automatically stripped from the context window calculation by the Claude API and are not part of the conversation history that the model "sees" for subsequent turns, preserving token capacity for actual conversation content.

**Effective calculation:** `context_window = (input_tokens - previous_thinking_tokens) + current_turn_tokens`

Thinking tokens include `thinking` blocks. Extended thinking tokens are billed as output tokens only once, during their generation.

## The Context Window with Extended Thinking and Tool Use

When combining extended thinking with tool use:

1. **First turn:** Input components are tools configuration and user message. Output includes extended thinking + text response + tool use request. All count toward the context window.

2. **Tool result handling:** The extended thinking block **must** be returned with the corresponding tool results. This is the only case where you **have to** return thinking blocks. After tool results have been passed back, Claude responds with only text (unless interleaved thinking is enabled).

3. **New user turn:** Previous thinking blocks can be dropped after the tool use cycle completes. The API will automatically strip them if you pass them back. A new extended thinking block is generated for the new turn.

Considerations:
- When posting tool results, the entire unmodified thinking block (including signature portions) must be included.
- The system uses cryptographic signatures to verify thinking block authenticity. Modifying thinking blocks causes an API error.

Claude 4 models support interleaved thinking, which enables Claude to think between tool calls.

Claude's tool selection is designed to hold with large input documents, choosing the right tool (or correctly abstaining) when the conversation includes 100K+ tokens of non-tool context. For reducing context consumed by tools, see [Manage tool context](https://platform.claude.com/docs/en/agents-and-tools/tool-use/manage-tool-context), or defer tool definitions with the [tool search tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool).

## Context Awareness in Claude Sonnet 4.6, Sonnet 4.5, and Haiku 4.5

Claude Sonnet 4.6, Claude Sonnet 4.5, and Claude Haiku 4.5 feature **context awareness**. This capability lets these models track their remaining context window (that is, "token budget") throughout a conversation.

**How it works:**

At the start of a conversation, Claude receives information about its total context window:

```xml
<budget:token_budget>1000000</budget:token_budget>
```

After each tool call, Claude receives an update on remaining capacity:

```xml
<system_warning>Token usage: 35000/1000000; 965000 remaining</system_warning>
```

This awareness helps Claude determine how much capacity remains for work and enables more effective execution on long-running tasks. Image tokens are included in these budgets.

**Benefits:**

Context awareness is particularly valuable for:

- Long-running agent sessions that require sustained focus
- Multi-context-window workflows where state transitions matter
- Complex tasks requiring careful token management

## Managing Context with Compaction

If your conversations regularly approach context window limits, server-side compaction is the recommended approach. Compaction provides server-side summarization that automatically condenses earlier parts of a conversation, enabling long-running conversations beyond context limits with minimal integration work. It is available in beta for Claude Fable 5, Claude Mythos 5, Claude Opus 4.8, Claude Mythos Preview, Claude Opus 4.7, Claude Opus 4.6, and Claude Sonnet 4.6.

For more specialized needs, context editing offers additional strategies:

- **Tool result clearing** - Clear old tool results in agentic workflows
- **Thinking block clearing** - Manage thinking blocks with extended thinking

## Context Window Overflow Behavior

On Claude 4.5 models and newer, if input tokens plus `max_tokens` exceeds the context window size, the API accepts the request. If generation then reaches the context window limit, it stops with `stop_reason: "model_context_window_exceeded"`. On earlier models, the API returns a validation error instead; opt in to the `model_context_window_exceeded` behavior with the `model-context-window-exceeded-2025-08-26` beta header.

To stay within context window limits, use the token counting API to estimate token usage before sending messages to Claude.
