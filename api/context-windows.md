---
title: "Context Windows"
source_url: "https://platform.claude.com/docs/en/docs/build-with-claude/context-windows"
source_type: "web-extracted"
fetched_at: "2026-03-10T00:00:00Z"
category: "api"
---

# Context Windows

The "context window" refers to all the text a language model can reference when generating a response, including the response itself. This is different from the training corpus — it represents a "working memory" for the model.

## Key Concepts

- **Progressive token accumulation:** As conversations advance, each message accumulates within the context window. Previous turns are preserved completely.
- **200K token capacity:** Standard context window is 200,000 tokens.
- **Context rot:** As token count grows, accuracy and recall degrade. Curating what's in context is as important as capacity.

## 1M Token Context Window (Beta)

Claude Opus 4.6, Sonnet 4.6, Sonnet 4.5, and Sonnet 4 support a 1-million token context window.

**Requirements:**
- Beta header: `context-1m-2025-08-07`
- Usage tier 4 or custom rate limits
- Available on Claude API, Microsoft Foundry, Amazon Bedrock, and Vertex AI

**Pricing:** Requests exceeding 200K tokens are charged at premium rates (2x input, 1.5x output pricing).

```python
from anthropic import Anthropic

client = Anthropic()

response = client.beta.messages.create(
    model="claude-opus-4-6",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Process this large document..."}],
    betas=["context-1m-2025-08-07"],
)
```

## Context Awareness

Claude Sonnet 4.6, Sonnet 4.5, and Haiku 4.5 feature context awareness — they track their remaining context window throughout a conversation.

At conversation start, Claude receives its total budget:
```xml
<budget:token_budget>200000</budget:token_budget>
```

After each tool call, Claude receives remaining capacity updates:
```xml
<system_warning>Token usage: 35000/200000; 165000 remaining</system_warning>
```

This enables effective execution on long-running tasks and multi-context-window workflows.

## Extended Thinking and Context

When using extended thinking, all tokens (including thinking) count toward the context window limit. However, previous thinking blocks are automatically stripped from context window calculations — they are not carried forward as input tokens for subsequent turns.

**Effective calculation:** `context_window = (input_tokens - previous_thinking_tokens) + current_turn_tokens`

## Managing Context with Compaction

For conversations that regularly approach context window limits, server-side compaction (beta header `compact-2026-01-12`) provides automatic summarization. Currently available for Claude Opus 4.6 and Sonnet 4.6.

For more specialized needs, context editing offers:
- **Tool result clearing** — Clear old tool results in agentic workflows
- **Thinking block clearing** — Manage thinking blocks with extended thinking

## Context Window Sizes by Model

| Model | Context Window | Max Output |
|-------|---------------|------------|
| Claude Opus 4.6 | 200K / 1M (beta) | 128K tokens |
| Claude Sonnet 4.6 | 200K / 1M (beta) | 64K tokens |
| Claude Haiku 4.5 | 200K | 64K tokens |
| Claude Sonnet 4.5 | 200K / 1M (beta) | 64K tokens |
| Claude Opus 4.5 | 200K | 64K tokens |
| Claude Sonnet 4 | 200K / 1M (beta) | 64K tokens |
| Claude Opus 4 | 200K | 32K tokens |
