---
title: "Server-Side Context Compaction"
source_url: "https://platform.claude.com/docs/en/docs/build-with-claude/compaction"
source_type: "web-extracted"
fetched_at: "2026-09-07T00:00:00Z"
category: "api"
---

# Server-Side Context Compaction

Server-side context compaction automatically summarizes older conversation context when approaching the context window limit, extending effective context length for long-running conversations and agentic workflows.

## Beta Status

Compaction is in beta. Include the beta header `compact-2026-01-12` in your API requests to use this feature.

## Supported Models

Compaction is supported on the following models:

- Claude Fable 5.1 (`claude-fable-5-1`)
- Claude Mythos 5.1 (`claude-mythos-5-1`)
- Claude Fable 5 (`claude-fable-5`)
- Claude Mythos 5 (`claude-mythos-5`)
- Claude Mythos Preview (`claude-mythos-preview`)
- Claude Opus 5 (`claude-opus-5`)
- Claude Opus 4.8 (`claude-opus-4-8`)
- Claude Opus 4.7 (`claude-opus-4-7`)
- Claude Opus 4.6 (`claude-opus-4-6`)
- Claude Sonnet 5 (`claude-sonnet-5`)
- Claude Sonnet 4.6 (`claude-sonnet-4-6`)

**Platforms:** Claude API, Claude Platform on AWS, Amazon Bedrock, Google Cloud, Microsoft Foundry (all beta).

## How Compaction Works

When compaction is enabled, Claude automatically summarizes your conversation when it approaches the configured token threshold. The API:

1. Detects when input tokens reach the specified trigger threshold.
2. Generates a summary of the current conversation.
3. Creates a `compaction` block containing the summary.
4. Continues the response with the compacted context.
5. On subsequent requests, the API automatically drops content prior to the compaction block.

## Basic Usage

Enable compaction by adding the `compact_20260112` strategy to `context_management.edits`:

```python
client = anthropic.Anthropic()

messages = [{"role": "user", "content": "Help me build a website"}]

response = client.beta.messages.create(
    betas=["compact-2026-01-12"],
    model="claude-opus-5",
    max_tokens=4096,
    messages=messages,
    context_management={"edits": [{"type": "compact_20260112"}]},
)

messages.append({"role": "assistant", "content": response.content})
```

## Parameters

| Parameter                | Type    | Default                                                  | Description                                                                        |
| :----------------------- | :------ | :------------------------------------------------------- | :--------------------------------------------------------------------------------- |
| `type`                   | string  | Required                                                 | Must be `"compact_20260112"`                                                       |
| `trigger`                | object  | `{"type": "input_tokens", "value": 150000}`              | When to trigger compaction. `input_tokens` is the only supported type. Value must be >= 50,000 tokens. |
| `pause_after_compaction` | boolean | `false`                                                  | Whether to pause after generating the compaction summary.                          |
| `instructions`           | string  | `null`                                                   | Custom summarization prompt. Completely replaces the default prompt when provided. |

### Trigger Configuration

```python
response = client.beta.messages.create(
    betas=["compact-2026-01-12"],
    model="claude-opus-5",
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

```python
response = client.beta.messages.create(
    betas=["compact-2026-01-12"],
    model="claude-opus-5",
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

Default summarization prompt:

> "You have written a partial transcript for the initial task above. Please write a summary of the transcript...Write down anything that would be helpful, including the state, next steps, learnings etc. You must wrap your summary in a `<summary></summary>` block."

### Pausing After Compaction

```python
response = client.beta.messages.create(
    betas=["compact-2026-01-12"],
    model="claude-opus-5",
    max_tokens=4096,
    messages=messages,
    context_management={
        "edits": [{"type": "compact_20260112", "pause_after_compaction": True}]
    },
)

if response.stop_reason == "compaction":
    messages.append({"role": "assistant", "content": response.content})

    # Continue the request
    response = client.beta.messages.create(
        betas=["compact-2026-01-12"],
        model="claude-opus-5",
        max_tokens=4096,
        messages=messages,
        context_management={"edits": [{"type": "compact_20260112"}]},
    )
```

## Working with Compaction Blocks

### Response Structure

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

Always append the entire response (including compaction blocks) to messages:

```python
messages.append({"role": "assistant", "content": response.content})

# Continue the conversation
messages.append({"role": "user", "content": "Now add error handling"})

response = client.beta.messages.create(
    betas=["compact-2026-01-12"],
    model="claude-opus-5",
    max_tokens=4096,
    messages=messages,
    context_management={"edits": [{"type": "compact_20260112"}]},
)
```

The API automatically drops all content prior to the compaction block when processing subsequent requests.

### Streaming

Compaction blocks stream differently from text blocks:

```python
with client.beta.messages.stream(
    betas=["compact-2026-01-12"],
    model="claude-opus-5",
    max_tokens=4096,
    messages=messages,
    context_management={"edits": [{"type": "compact_20260112"}]},
) as stream:
    for event in stream:
        if event.type == "content_block_start":
            if event.content_block.type == "compaction":
                print("Compaction started...")
        elif event.type == "content_block_delta":
            if event.delta.type == "compaction_delta":
                print(f"Compaction complete: {len(event.delta.content or '')} chars")
            elif event.delta.type == "text_delta":
                print(event.delta.text, end="", flush=True)
```

## Token Usage

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

**Important:** Top-level `input_tokens` and `output_tokens` do NOT include compaction iteration usage. Sum all entries in `usage.iterations` for total tokens consumed and billed.

## Token Counting with Compaction

```python
count_response = client.beta.messages.count_tokens(
    betas=["compact-2026-01-12"],
    model="claude-opus-5",
    messages=messages,
    context_management={"edits": [{"type": "compact_20260112"}]},
)

print(f"Current tokens: {count_response.input_tokens}")
print(f"Original tokens: {count_response.context_management.original_input_tokens}")
```

## Prompt Caching Integration

Add `cache_control` to compaction blocks:

```json
{
  "role": "assistant",
  "content": [
    {
      "type": "compaction",
      "content": "[summary text]",
      "cache_control": { "type": "ephemeral" }
    }
  ]
}
```

### Maximizing Cache Hits

Add a cache breakpoint at the end of your system prompt to keep the system prompt cached separately, so compaction doesn't invalidate the system prompt cache:

```python
response = client.beta.messages.create(
    betas=["compact-2026-01-12"],
    model="claude-opus-5",
    max_tokens=4096,
    system=[
        {
            "type": "text",
            "text": "You are a helpful coding assistant...",
            "cache_control": {"type": "ephemeral"},
        }
    ],
    messages=messages,
    context_management={"edits": [{"type": "compact_20260112"}]},
)
```

## Complete Example: Long-Running Conversation

```python
client = anthropic.Anthropic()
messages: list[dict] = []

def chat(user_message: str) -> str:
    messages.append({"role": "user", "content": user_message})

    response = client.beta.messages.create(
        betas=["compact-2026-01-12"],
        model="claude-opus-5",
        max_tokens=4096,
        messages=messages,
        context_management={
            "edits": [
                {
                    "type": "compact_20260112",
                    "trigger": {"type": "input_tokens", "value": 100000},
                }
            ]
        },
    )

    messages.append({"role": "assistant", "content": response.content})
    return next(block.text for block in response.content if block.type == "text")

# Run a long conversation
print(chat("Help me build a Python web scraper"))
print(chat("Add support for JavaScript-rendered pages"))
print(chat("Now add rate limiting and error handling"))
```

## Key Features

- **Automatic summarization** when approaching token limits
- **Keeps active context small** for better response quality
- **No client-side code needed** for context management
- **Compatible with streaming** and other Claude features
- **Works with prompt caching** for optimized token usage
- **Configurable triggers** and custom instructions
- **Pausable after compaction** for manual message adjustment
