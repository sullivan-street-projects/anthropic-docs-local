---
title: "Server-Side Context Compaction"
source_url: "https://platform.claude.com/docs/en/docs/build-with-claude/compaction"
source_type: "web-extracted"
fetched_at: "2026-04-05T00:00:00Z"
category: "api"
---

# Server-Side Context Compaction

Server-side compaction is the recommended strategy for managing context in long-running conversations and agentic workflows. It handles context management automatically with minimal integration work.

Compaction extends the effective context length by automatically summarizing older context when approaching the context window limit. This keeps the active context focused and performant by replacing stale content with concise summaries.

## Beta Status

Compaction is in beta. Include the beta header `compact-2026-01-12` in your API requests. It is eligible for Zero Data Retention (ZDR) arrangements.

## Supported Models

- Claude Opus 4.6 (`claude-opus-4-6`)
- Claude Sonnet 4.6 (`claude-sonnet-4-6`)

## How Compaction Works

When compaction is enabled, Claude automatically summarizes your conversation when it approaches the configured token threshold. The API:

1. Detects when input tokens exceed your specified trigger threshold.
2. Generates a summary of the current conversation.
3. Creates a `compaction` block containing the summary.
4. Returns a response with the compacted conversation.

## Ideal Use Cases

- Chat-based, multi-turn conversations where users stay in one chat for extended periods
- Task-oriented prompts requiring extensive follow-up work (often tool use) that may exceed the 200K context window

## API Usage

```python
from anthropic import Anthropic

client = Anthropic()

response = client.beta.messages.create(
    model="claude-opus-4-6",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Your message here"}],
    betas=["compact-2026-01-12"],
)
```

## Key Features

- **Automatic triggering:** Compaction activates when input tokens approach your configured threshold
- **Summary preservation:** Important context from earlier in the conversation is preserved in summarized form
- **Transparent operation:** The API returns compaction blocks that you can inspect
- **Context rot prevention:** By summarizing stale content, compaction maintains model focus and accuracy
- **ZDR eligible:** Data sent through this feature is not stored when ZDR is enabled

## Related Features

- **Context editing:** For more specialized needs, context editing offers tool result clearing and thinking block clearing
- **1M token context window:** Available via `context-1m-2025-08-07` beta header for Opus 4.6, Sonnet 4.6, Sonnet 4.5, and Sonnet 4
- **Context awareness:** Sonnet 4.6, Sonnet 4.5, and Haiku 4.5 track their remaining context window throughout a conversation
