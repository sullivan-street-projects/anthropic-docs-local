---
title: "Server-Side Context Compaction"
source_url: "https://platform.claude.com/docs/en/docs/build-with-claude/compaction"
source_type: "web-extracted"
fetched_at: "2026-08-03T00:00:00Z"
category: "api"
---

# Server-Side Context Compaction

Server-side compaction is the recommended strategy for managing context in long-running conversations and agentic workflows. It handles context management automatically with minimal integration work.

Compaction extends the effective context length for long-running conversations and tasks by automatically summarizing older context when approaching the context window limit. This isn't just about staying under a token cap. As conversations get longer, models struggle to maintain focus across the full history. Compaction keeps the active context focused and performant by replacing stale content with concise summaries.

This is ideal for:

- Chat-based, multi-turn conversations where you want users to use one chat for a long period of time
- Task-oriented prompts that require a lot of follow-up work (often tool use) that may exceed the context window

## Beta Status

Compaction is in beta. Include the beta header `compact-2026-01-12` in your API requests to use this feature. It is eligible for Zero Data Retention (ZDR) arrangements.

## Supported Models

Compaction is supported on the following models:

- Claude Fable 5 (`claude-fable-5`)
- Claude Mythos 5 (`claude-mythos-5`)
- Claude Mythos Preview (`claude-mythos-preview`)
- Claude Opus 5 (`claude-opus-5`)
- Claude Opus 4.8 (`claude-opus-4-8`)
- Claude Opus 4.7 (`claude-opus-4-7`)
- Claude Opus 4.6 (`claude-opus-4-6`)
- Claude Sonnet 5 (`claude-sonnet-5`)
- Claude Sonnet 4.6 (`claude-sonnet-4-6`)

## How Compaction Works

When compaction is enabled, Claude automatically summarizes your conversation when it approaches the configured token threshold. The API:

1. Detects when input tokens exceed your specified trigger threshold.
2. Generates a summary of the current conversation.
3. Creates a `compaction` block containing the summary.
4. Continues the response with the compacted context.

On subsequent requests, append the response to your messages. The API automatically drops all message blocks prior to the `compaction` block, continuing the conversation from the summary.

## Basic Usage

Enable compaction by adding the `compact_20260112` strategy to `context_management.edits` in your Messages API request.

```python
client = anthropic.Anthropic()

messages = [{"role": "user", "content": "Help me build a website"}]

response = client.beta.messages.create(
    betas=["compact-2026-01-12"],
    model="claude-opus-4-8",
    max_tokens=4096,
    messages=messages,
    context_management={"edits": [{"type": "compact_20260112"}]},
)

# Append the response (including any compaction block) to continue the conversation
messages.append({"role": "assistant", "content": response.content})
```

```typescript
const client = new Anthropic();

const messages: Anthropic.Beta.Messages.BetaMessageParam[] = [
  { role: "user", content: "Help me build a website" },
];

const response = await client.beta.messages.create({
  betas: ["compact-2026-01-12"],
  model: "claude-opus-4-8",
  max_tokens: 4096,
  messages,
  context_management: {
    edits: [
      {
        type: "compact_20260112",
      },
    ],
  },
});

// Append the response (including any compaction block) to continue the conversation
messages.push({
  role: "assistant",
  content: response.content,
});
```

## Parameters

| Parameter                | Type    | Default        | Description                                                                        |
| :----------------------- | :------ | :------------- | :--------------------------------------------------------------------------------- |
| `type`                   | string  | Required       | Must be `"compact_20260112"`                                                       |
| `trigger`                | object  | 150,000 tokens | When to trigger compaction. Must be at least 50,000 tokens.                        |
| `pause_after_compaction` | boolean | `false`        | Whether to pause after generating the compaction summary                           |
| `instructions`           | string  | `null`         | Custom summarization prompt. Completely replaces the default prompt when provided. |

### Trigger Configuration

Configure when compaction triggers using the `trigger` parameter:

```python
client = anthropic.Anthropic()
messages = [{"role": "user", "content": "Hello, Claude"}]
response = client.beta.messages.create(
    betas=["compact-2026-01-12"],
    model="claude-opus-4-8",
    max_tokens=4096,
    messages=messages,
    context_management={
        "edits": [
            {
                "type": "compact_20260112",
                "trigger": {"type": "input_tokens", "value": 150000},
            }
        ]
    },
)
```

### Custom Summarization Instructions

By default, compaction uses the following summarization prompt:

```
You have written a partial transcript for the initial task above. Please write a summary of the transcript. The purpose of this summary is to provide continuity so you can continue to make progress towards solving the task in a future context, where the raw history above may not be accessible and will be replaced with this summary. Write down anything that would be helpful, including the state, next steps, learnings etc. You must wrap your summary in a <summary></summary> block.
```

You can provide custom instructions via the `instructions` parameter to replace this prompt entirely:

```python
client = anthropic.Anthropic()
messages = [{"role": "user", "content": "Hello, Claude"}]
response = client.beta.messages.create(
    betas=["compact-2026-01-12"],
    model="claude-opus-4-8",
    max_tokens=4096,
    messages=messages,
    context_management={
        "edits": [
            {
                "type": "compact_20260112",
                "instructions": "Focus on preserving code snippets, variable names, and technical decisions.",
            }
        ]
    },
)
```

### Pausing After Compaction

Use `pause_after_compaction` to pause the API after generating the compaction summary. This allows you to add additional content blocks (such as preserving recent messages or specific instruction-oriented messages) before the API continues with the response.

When enabled, the API returns a message with the `compaction` stop reason after generating the compaction block:

```python
client = anthropic.Anthropic()
messages = [{"role": "user", "content": "Hello, Claude"}]
response = client.beta.messages.create(
    betas=["compact-2026-01-12"],
    model="claude-opus-4-8",
    max_tokens=4096,
    messages=messages,
    context_management={
        "edits": [{"type": "compact_20260112", "pause_after_compaction": True}]
    },
)

# Check if compaction triggered a pause
if response.stop_reason == "compaction":
    # Response contains only the compaction block
    messages.append({"role": "assistant", "content": response.content})

    # Continue the request
    response = client.beta.messages.create(
        betas=["compact-2026-01-12"],
        model="claude-opus-4-8",
        max_tokens=4096,
        messages=messages,
        context_management={"edits": [{"type": "compact_20260112"}]},
    )
```

#### Enforcing a Total Token Budget

When a model works on long tasks with many tool-use iterations, total token consumption can grow significantly. You can combine `pause_after_compaction` with a compaction counter to estimate cumulative usage and gracefully wrap up:

```python
client = anthropic.Anthropic()
messages = [{"role": "user", "content": "Hello, Claude"}]
TRIGGER_THRESHOLD = 100_000
TOTAL_TOKEN_BUDGET = 3_000_000
n_compactions = 0

response = client.beta.messages.create(
    betas=["compact-2026-01-12"],
    model="claude-opus-4-8",
    max_tokens=4096,
    messages=messages,
    context_management={
        "edits": [
            {
                "type": "compact_20260112",
                "trigger": {"type": "input_tokens", "value": TRIGGER_THRESHOLD},
                "pause_after_compaction": True,
            }
        ]
    },
)

if response.stop_reason == "compaction":
    n_compactions += 1
    messages.append({"role": "assistant", "content": response.content})

    # Estimate total tokens consumed; prompt wrap-up if over budget
    if n_compactions * TRIGGER_THRESHOLD >= TOTAL_TOKEN_BUDGET:
        messages.append(
            {
                "role": "user",
                "content": "Please wrap up your current work and summarize the final state.",
            }
        )
```

## Working with Compaction Blocks

When compaction is triggered, the API returns a `compaction` block at the start of the assistant response.

```json
{
  "content": [
    {
      "type": "compaction",
      "content": "Summary of the conversation: The user requested help building a web scraper..."
    },
    {
      "type": "text",
      "text": "Based on our conversation so far..."
    }
  ]
}
```

### Passing Compaction Blocks Back

You must pass the `compaction` block back to the API on subsequent requests to continue the conversation with the shortened prompt. When the API receives a `compaction` block, all content blocks before it are ignored. You can either:

- Keep the original messages in your list and let the API handle removing the compacted content
- Manually drop the compacted messages and only include the compaction block onwards

### Streaming

When streaming responses with compaction enabled, you'll receive a `content_block_start` event when compaction begins. The compaction block streams differently from text blocks: you'll receive a `content_block_start` event, followed by a single `content_block_delta` with the complete summary content (no intermediate streaming), and then a `content_block_stop` event.

```python
client = anthropic.Anthropic()
messages = [{"role": "user", "content": "Hello, Claude"}]

with client.beta.messages.stream(
    betas=["compact-2026-01-12"],
    model="claude-opus-4-8",
    max_tokens=4096,
    messages=messages,
    context_management={"edits": [{"type": "compact_20260112"}]},
) as stream:
    for event in stream:
        if event.type == "content_block_start":
            if event.content_block.type == "compaction":
                print("Compaction started...")
            elif event.content_block.type == "text":
                print("Text response started...")

        elif event.type == "content_block_delta":
            if event.delta.type == "compaction_delta":
                print(f"Compaction complete: {len(event.delta.content or '')} chars")
            elif event.delta.type == "text_delta":
                print(event.delta.text, end="", flush=True)

    # Get the final accumulated message
    message = stream.get_final_message()
    messages.append({"role": "assistant", "content": message.content})
```

### Prompt Caching

Compaction works well with prompt caching. You can add a `cache_control` breakpoint on compaction blocks to cache the summarized content. To maximize cache hit rates, add a `cache_control` breakpoint at the end of your system prompt to keep the system prompt cached separately from the conversation.

```json
{
  "role": "assistant",
  "content": [
    {
      "type": "compaction",
      "content": "[summary text]",
      "cache_control": { "type": "ephemeral" }
    },
    {
      "type": "text",
      "text": "Based on our conversation..."
    }
  ]
}
```

## Understanding Usage

Compaction requires an additional sampling step, which contributes to rate limits and billing. The API returns detailed usage information in the response:

```json
{
  "usage": {
    "input_tokens": 23000,
    "output_tokens": 1000,
    "iterations": [
      {
        "type": "compaction",
        "input_tokens": 180000,
        "output_tokens": 3500
      },
      {
        "type": "message",
        "input_tokens": 23000,
        "output_tokens": 1000
      }
    ]
  }
}
```

The `iterations` array shows usage for each sampling iteration. The top-level `input_tokens` and `output_tokens` do not include compaction iteration usage. They reflect the sum of all non-compaction iterations. To calculate total tokens consumed and billed for a request, sum across all entries in the `usage.iterations` array.

## Combining with Other Features

### Server Tools

When using server tools (like web search), the compaction trigger is checked at the start of each sampling iteration. Compaction may occur multiple times within a single request depending on your trigger threshold and the amount of output generated.

### Token Counting

The token counting endpoint (`/v1/messages/count_tokens`) applies existing `compaction` blocks in your prompt but does not trigger new compactions. Use it to check your effective token count after previous compactions.

## Current Limitations

- **Same model for summarization:** The model specified in your request is used for summarization. There is no option to use a different (for example, cheaper) model for the summary.
- **Compaction might fail when tools are defined:** When your request includes `tools`, the model occasionally calls a tool during the internal summarization step instead of writing a summary. When this occurs, the response contains a `compaction` block with `content: null`. To prevent this, set `instructions` to a prompt that explicitly tells the model not to call tools.

## Related Features

- **Context editing:** For more specialized needs, context editing offers tool result clearing and thinking block clearing
- **1M token context window:** Available for Claude Fable 5, Claude Mythos 5, Claude Opus 4.8, Claude Opus 4.7, Opus 4.6, Sonnet 5, and Sonnet 4.6
- **Context awareness:** Sonnet 4.6, Sonnet 4.5, and Haiku 4.5 track their remaining context window throughout a conversation
