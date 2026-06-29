---
title: "Extended Thinking"
source_url: "https://platform.claude.com/docs/en/docs/build-with-claude/extended-thinking"
source_type: "web-extracted"
fetched_at: "2026-06-28T00:00:00Z"
category: "api"
---

# Extended Thinking

Extended thinking gives Claude enhanced reasoning capabilities for complex tasks, while providing varying levels of transparency into its step-by-step thought process before it delivers its final answer.

**Key Features:**
- Enhanced reasoning for complex problems
- Control over thinking content display
- Support for streaming thinking blocks
- Integration with tool use and prompt caching
- Zero Data Retention (ZDR) eligible

## Supported Models

| Model | Manual Extended Thinking (`budget_tokens`) | Recommended |
|-------|-------------------------------------------|-------------|
| Claude Fable 5 & Claude Mythos 5 | Not supported (400 error) | Adaptive thinking (always on); use effort to control depth |
| Claude Mythos Preview | Supported | Adaptive thinking (on by default) |
| Claude Opus 4.8 | Not supported (400 error) | Adaptive thinking with effort |
| Claude Opus 4.7 | Not supported (400 error) | Adaptive thinking with effort |
| Claude Opus 4.6 | Deprecated | Adaptive thinking with effort |
| Claude Sonnet 4.6 | Deprecated | Adaptive thinking with effort |
| Claude Opus 4.5 | Supported | N/A |
| Claude Haiku 4.5 | Supported | N/A |
| Earlier Claude 4 models | Supported | N/A |

## How Extended Thinking Works

When extended thinking is enabled, Claude creates `thinking` content blocks containing its internal reasoning. The API response includes `thinking` blocks followed by `text` blocks.

**Example Response Format:**

```json
{
  "content": [
    {
      "type": "thinking",
      "thinking": "Let me analyze this step by step...",
      "signature": "WaUjzkypQ2mUEVM36O2TxuC06KN8xyfbJwyem2dw3URve/op91XWHOEBLLqIOMfFG/UvLEczmEsUjavL...."
    },
    {
      "type": "text",
      "text": "Based on my analysis..."
    }
  ]
}
```

## How to Use Extended Thinking

### Basic Setup

Add a `thinking` object with `type: "enabled"` and a `budget_tokens` value:

```python
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 10000},
    messages=[
        {
            "role": "user",
            "content": "Are there an infinite number of prime numbers such that n mod 4 == 3?",
        }
    ],
)

for block in response.content:
    if block.type == "thinking":
        print(f"\nThinking summary: {block.thinking}")
    elif block.type == "text":
        print(f"\nResponse: {block.text}")
```

**Key Parameters:**
- `budget_tokens`: Maximum tokens for internal reasoning (must be less than `max_tokens`)
- Larger budgets can improve response quality but Claude may not use the entire budget, especially above 32k

### Controlling Thinking Display

The `display` field controls how thinking content is returned:

**Options:**
- `"summarized"` (default on Claude 4 models): Returns summarized thinking text
- `"omitted"` (default on Claude Fable 5, Mythos 5, Opus 4.8+): Returns empty `thinking` field with encrypted `signature`

**Benefits of `display: "omitted"`:**
- Faster time-to-first-text-token when streaming
- Useful for applications that don't surface thinking to users
- Still charged for full thinking tokens

```python
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000,
        "display": "omitted",
    },
    messages=[
        {"role": "user", "content": "What is 27 * 453?"},
    ],
)
```

**Response with `display: "omitted"`:**

```json
{
  "content": [
    {
      "type": "thinking",
      "thinking": "",
      "signature": "EosnCkYICxIMMb3LzNrMu..."
    },
    {
      "type": "text",
      "text": "The answer is 12,231."
    }
  ]
}
```

### Summarized Thinking

With `display: "summarized"` (default on Claude 4 models):
- Returns a summary of Claude's full thinking process
- You're charged for full thinking tokens, not summary tokens
- Billed output token count won't match visible response tokens
- First few lines are more verbose on Claude 4 models
- Claude Mythos Preview summarizes from the first token

## Streaming Thinking

Stream extended thinking using server-sent events (SSE):

```python
client = anthropic.Anthropic()

with client.messages.stream(
    model="claude-sonnet-4-6",
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 10000},
    messages=[
        {
            "role": "user",
            "content": "What is the greatest common divisor of 1071 and 462?",
        }
    ],
) as stream:
    thinking_started = False
    response_started = False

    for event in stream:
        if event.type == "content_block_start":
            print(f"\nStarting {event.content_block.type} block...")
            thinking_started = False
            response_started = False
        elif event.type == "content_block_delta":
            if event.delta.type == "thinking_delta":
                if not thinking_started:
                    print("Thinking: ", end="", flush=True)
                    thinking_started = True
                print(event.delta.thinking, end="", flush=True)
            elif event.delta.type == "text_delta":
                if not response_started:
                    print("Response: ", end="", flush=True)
                    response_started = True
                print(event.delta.text, end="", flush=True)
        elif event.type == "content_block_stop":
            print("\nBlock complete.")
```

**Streaming Behavior:**
- When `display: "omitted"`, no `thinking_delta` events are emitted
- Thinking block opens, `signature_delta` arrives, block closes
- Text streaming begins immediately after

## Extended Thinking with Tool Use

Extended thinking integrates with tool use:

**Limitations:**
1. Only supports `tool_choice: {"type": "auto"}` (default) or `tool_choice: {"type": "none"}`
2. Cannot use `tool_choice: {"type": "any"}` or `tool_choice: {"type": "tool", "name": "..."}`
3. Must preserve thinking blocks during tool use loops

### Preserving Thinking Blocks

When providing tool results, you must pass thinking blocks back unchanged:

```python
client = anthropic.Anthropic()

weather_tool = {
    "name": "get_weather",
    "description": "Get current weather for a location",
    "input_schema": {
        "type": "object",
        "properties": {"location": {"type": "string", "description": "City name"}},
        "required": ["location"],
    },
}

# First request
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 10000},
    tools=[weather_tool],
    messages=[{"role": "user", "content": "What's the weather in Paris?"}],
)

# Extract blocks
thinking_block = next(
    (block for block in response.content if block.type == "thinking"), None
)
tool_use_block = next(
    (block for block in response.content if block.type == "tool_use"), None
)

# Second request - include thinking block with tool result
continuation = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 10000},
    tools=[weather_tool],
    messages=[
        {"role": "user", "content": "What's the weather in Paris?"},
        {"role": "assistant", "content": [thinking_block, tool_use_block]},
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": tool_use_block.id,
                    "content": "Current temperature: 88F",
                }
            ],
        },
    ],
)
```

### Toggling Thinking Modes in Conversations

**Important:** Tool use loops are part of a single assistant turn. Cannot toggle thinking mid-turn.

**Graceful Degradation:**
- API automatically disables thinking if mid-turn conflict occurs
- May strip thinking blocks from conversation history
- To confirm if thinking was active, check for `thinking` blocks in response

**Best Practice:** Plan thinking strategy at start of each turn rather than toggling mid-turn.

### Interleaved Thinking

Enables Claude to think between tool calls:

| Model | Support |
|-------|---------|
| Claude Fable 5, Mythos 5 | Automatic with adaptive thinking |
| Claude Mythos Preview | Automatic |
| Claude Opus 4.8, 4.7 | Automatic with adaptive thinking |
| Claude Opus 4.6 | Automatic with adaptive thinking |
| Claude Sonnet 4.6 | Automatic with adaptive thinking (recommended) |
| Claude Opus 4.5 | Add `interleaved-thinking-2025-05-14` beta header |
| Claude Haiku 4.5 | Not supported |

**Key Points:**
- `budget_tokens` can exceed `max_tokens` (total across all thinking blocks)
- Only supported with Messages API tools
- API accepts header on any model without error; ignores where not supported

**Without Interleaved Thinking:**
```
User: "What's the weather in Paris?"
Turn 1: [thinking] -> [tool_use: calculator]
Turn 2: [tool_use: database] (no thinking)
Turn 3: [text] (no thinking)
```

**With Interleaved Thinking:**
```
User: "What's the weather in Paris?"
Turn 1: [thinking] -> [tool_use: calculator]
Turn 2: [thinking] -> [tool_use: database]
Turn 3: [thinking] -> [text]
```

## Extended Thinking with Prompt Caching

**Important Considerations:**

**Thinking Block Context Removal:**
- On earlier Opus/Sonnet models and Haiku: thinking blocks removed from context
- On Opus 4.5+ and Sonnet 4.6+: thinking blocks kept by default
- Affects cache breakpoints during tool use

**Cache Invalidation:**
- Changes to thinking parameters (enabled/disabled or budget) invalidate message cache
- System prompts and tools remain cached despite thinking changes
- Interleaved thinking amplifies cache invalidation

**Caching Behavior with Tool Use:**
1. Caching occurs when making subsequent request with tool results
2. Cached thinking blocks count as input tokens when read from cache
3. When non-tool-result user block included:
   - Opus 4.5+ and Sonnet 4.6+: previous thinking blocks kept
   - Earlier Opus/Sonnet and Haiku: previous thinking blocks stripped

## Important Notes

- **Token Counting:** Summarized thinking charged at full thinking token count, not summary token count
- **Signature Field:** Carries encrypted full thinking for multi-turn continuity
- **Cache Duration:** Extended thinking tasks often take 5+ minutes; consider 1-hour cache duration
- **ZDR Eligible:** Data not stored after API response when ZDR arrangement in place
- **Output Tokens:** Claude Mythos Preview, Opus 4.8, 4.7, 4.6, and Sonnet 4.6 support 128k; Haiku 4.5 supports 64k

## All Supported SDKs

Extended thinking examples available for: cURL, CLI, Python, TypeScript, C#, Go, Java, PHP, Ruby.
