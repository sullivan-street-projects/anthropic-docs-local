---
title: "Extended Thinking"
source_url: "https://platform.claude.com/docs/en/docs/build-with-claude/extended-thinking"
source_type: "web-extracted"
fetched_at: "2026-07-27T00:00:00Z"
category: "api"
---

# Extended Thinking

Extended thinking gives Claude enhanced reasoning capabilities for complex tasks, while providing varying levels of transparency into its step-by-step thought process before it delivers its final answer.

This feature is eligible for Zero Data Retention (ZDR). When your organization has a ZDR arrangement, data sent through this feature is not stored after the API response is returned.

## Supported Models

Extended thinking is available on all current Claude models. The table below shows support levels:

| Model                           | Manual Extended Thinking (`budget_tokens`) | Recommended                                               |
| ------------------------------- | ------------------------------------------ | --------------------------------------------------------- |
| Claude Fable 5, Claude Mythos 5 | Not supported (400 error)                  | Adaptive thinking, always on; use effort to control depth |
| Claude Mythos Preview           | Supported                                  | Adaptive thinking, on by default                          |
| Claude Opus 4.8                 | Not supported (400 error)                  | Adaptive thinking with effort                             |
| Claude Opus 4.7                 | Not supported (400 error)                  | Adaptive thinking with effort                             |
| Claude Sonnet 5                 | Not supported (400 error)                  | Adaptive thinking with effort                             |
| Claude Opus 4.6                 | Deprecated                                 | Adaptive thinking with effort                             |
| Claude Sonnet 4.6               | Deprecated                                 | Adaptive thinking with effort                             |
| Claude Opus 4.5                 | Supported                                  | N/A                                                       |
| Claude Haiku 4.5                | Supported                                  | N/A                                                       |
| Earlier Claude 4 models         | Supported                                  | N/A                                                       |

With adaptive thinking, the model decides when and how much to think on each request. On Claude Mythos Preview, Claude Fable 5, and Claude Mythos 5, `thinking: {type: "disabled"}` is not supported.

## How Extended Thinking Works

When extended thinking is turned on, Claude creates `thinking` content blocks where it outputs its internal reasoning. Claude incorporates insights from this reasoning before crafting a final response.

The API response includes `thinking` content blocks, followed by `text` content blocks.

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

**Python:**

```python
import anthropic

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

**TypeScript:**

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000,
  },
  messages: [
    {
      role: "user",
      content:
        "Are there an infinite number of prime numbers such that n mod 4 == 3?",
    },
  ],
});

for (const block of response.content) {
  if (block.type === "thinking") {
    console.log(`\nThinking summary: ${block.thinking}`);
  } else if (block.type === "text") {
    console.log(`\nResponse: ${block.text}`);
  }
}
```

**cURL:**

```bash
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
  "model": "claude-sonnet-4-6",
  "max_tokens": 16000,
  "thinking": {
    "type": "enabled",
    "budget_tokens": 10000
  },
  "messages": [
    {
      "role": "user",
      "content": "Are there an infinite number of prime numbers such that n mod 4 == 3?"
    }
  ]
}'
```

### Budget Tokens

The `budget_tokens` parameter sets the maximum number of tokens Claude can use for its internal reasoning process. This limit applies to full thinking tokens, not to the summarized output.

**Key Points:**

- Larger budgets can improve response quality by enabling more thorough analysis for complex problems
- Claude may not use the entire budget allocated, especially at ranges above 32k
- `budget_tokens` must be set to a value less than `max_tokens`
- With interleaved thinking with tools, you can exceed this limit as the token limit becomes your entire context window
- Extended thinking cannot be combined with `max_tokens: 0` (cache pre-warming)

`budget_tokens` is deprecated on Claude Opus 4.6 and Claude Sonnet 4.6 and will be removed in a future model release. Use adaptive thinking with the effort parameter instead.

### Controlling Thinking Display

The `display` field on the thinking configuration controls how thinking content is returned in API responses.

**Display Options:**

- `"summarized"` (default for Claude 4 models): Thinking blocks contain summarized thinking text
- `"omitted"` (default for Claude Fable 5, Claude Mythos 5, Claude Sonnet 5, Claude Opus 4.8, Claude Opus 4.7): Thinking blocks are returned with an empty `thinking` field. The `signature` field still carries the encrypted full thinking for multi-turn continuity

**Benefits of omitted thinking:**
Setting `display: "omitted"` is useful when your application doesn't surface thinking content to users. The primary benefit is **faster time-to-first-text-token when streaming:** the server skips streaming thinking tokens entirely and delivers only the signature.

**Important considerations:**

- You're still charged for the full thinking tokens. Omitting reduces latency, not cost
- If you pass thinking blocks back in multi-turn conversations, pass them unchanged
- `display` is invalid with `thinking.type: "disabled"`
- When using `thinking.type: "adaptive"` and the model skips thinking for a simple request, no thinking block is produced regardless of `display`

```python
client = anthropic.Anthropic()

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

for block in response.content:
    if block.type == "thinking":
        if block.thinking:
            print(f"Thinking: {block.thinking}")
        else:
            print("Thinking: [omitted]")
    elif block.type == "text":
        print(f"Response: {block.text}")
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

Summarized thinking provides the full intelligence benefits of extended thinking, while preventing misuse. This is the default behavior on Claude 4 models when the `display` field is unset or set to `"summarized"`.

**Important considerations:**

- You're charged for the full thinking tokens generated by the original request, not the summary tokens
- The billed output token count will **not match** the count of tokens you see in the response
- On Claude 4 models, the first few lines of thinking output are more verbose, providing detailed reasoning
- Claude Mythos Preview summarizes from the first token, so its thinking blocks do not show this verbose preamble
- Summarization behavior is subject to change as Anthropic improves the feature
- Summarization preserves key ideas with minimal added latency, enabling a streamable user experience
- Summarization is processed by a different model than the one you target in your requests

In rare cases where you need access to full thinking output for Claude 4 models, contact Anthropic sales.

## Streaming Thinking

You can stream extended thinking responses using server-sent events (SSE).

**Python:**

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

**TypeScript:**

```typescript
const client = new Anthropic();

const stream = await client.messages.stream({
  model: "claude-sonnet-4-6",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000,
  },
  messages: [
    {
      role: "user",
      content: "What is the greatest common divisor of 1071 and 462?",
    },
  ],
});

let thinkingStarted = false;
let responseStarted = false;

for await (const event of stream) {
  if (event.type === "content_block_start") {
    console.log(`\nStarting ${event.content_block.type} block...`);
    thinkingStarted = false;
    responseStarted = false;
  } else if (event.type === "content_block_delta") {
    if (event.delta.type === "thinking_delta") {
      if (!thinkingStarted) {
        process.stdout.write("Thinking: ");
        thinkingStarted = true;
      }
      process.stdout.write(event.delta.thinking);
    } else if (event.delta.type === "text_delta") {
      if (!responseStarted) {
        process.stdout.write("Response: ");
        responseStarted = true;
      }
      process.stdout.write(event.delta.text);
    }
  } else if (event.type === "content_block_stop") {
    console.log("\nBlock complete.");
  }
}
```

**Streaming with omitted thinking:**
When `display: "omitted"` is set, the thinking block opens, a single `signature_delta` arrives, and the block closes without any `thinking_delta` events. Text streaming begins immediately after.

When using streaming with thinking enabled, you might notice that text sometimes arrives in larger chunks alternating with smaller, token-by-token delivery. This is expected behavior for optimal performance.

## Extended Thinking with Tool Use

Extended thinking can be used alongside tool use, allowing Claude to reason through tool selection and results processing.

**Limitations:**

1. Tool use with thinking only supports `tool_choice: {"type": "auto"}` (default) or `tool_choice: {"type": "none"}`. Using `tool_choice: {"type": "any"}` or `tool_choice: {"type": "tool", "name": "..."}` will result in an error.
2. During tool use, you must pass `thinking` blocks back to the API for the last assistant message. Include the complete unmodified block to maintain reasoning continuity.

### Toggling Thinking Modes in Conversations

You can't toggle thinking in the middle of an assistant turn, including during tool use loops. The entire assistant turn should operate in a single thinking mode.

Tool use loops are part of the assistant turn from the model's perspective. An assistant turn doesn't complete until Claude finishes its full response, which may include multiple tool calls and results.

When a mid-turn thinking conflict occurs, the API automatically disables thinking for that request. The API may strip thinking blocks from the conversation when they would create an invalid turn structure, or disable thinking when the conversation history is incompatible with thinking being enabled.

**Best practice:** Plan your thinking strategy at the start of each turn rather than trying to toggle mid-turn.

### Tool Use Example with Thinking

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

# First request - Claude responds with thinking and tool request
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 10000},
    tools=[weather_tool],
    messages=[{"role": "user", "content": "What's the weather in Paris?"}],
)

# Extract thinking block and tool use block
thinking_block = next(
    (block for block in response.content if block.type == "thinking"), None
)
tool_use_block = next(
    (block for block in response.content if block.type == "tool_use"), None
)

# Call your actual weather API
weather_data = {"temperature": 88}

# Second request - Include thinking block and tool result
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
                    "content": f"Current temperature: {weather_data['temperature']}F",
                }
            ],
        },
    ],
)
```

### Preserving Thinking Blocks

During tool use, you must pass `thinking` blocks back to the API, and you must include the complete unmodified block. When providing `thinking` blocks, the entire sequence of consecutive `thinking` blocks must match the outputs generated by the model during the original request; you can't rearrange or modify the sequence.

If thinking blocks are modified, the API returns a 400 `invalid_request_error`.

While you can omit `thinking` blocks from prior `assistant` role turns, always pass back all thinking blocks for any multi-turn conversation. The API automatically filters the provided thinking blocks, uses the relevant blocks necessary to preserve reasoning, and only bills for the input tokens for the blocks shown to Claude.

## Interleaved Thinking

Extended thinking with tool use in Claude 4 models supports interleaved thinking, which enables Claude to think between tool calls and make more sophisticated reasoning after receiving tool results.

### Model Support for Interleaved Thinking

| Model                           | Support                                                                                      |
| ------------------------------- | -------------------------------------------------------------------------------------------- |
| Claude Fable 5, Claude Mythos 5 | Automatic with adaptive thinking. No beta header needed.                                     |
| Claude Mythos Preview           | Automatic. No beta header needed or supported.                                               |
| Claude Opus 4.8                 | Automatic with adaptive thinking. No beta header needed.                                     |
| Claude Opus 4.7                 | Automatic with adaptive thinking. No beta header needed.                                     |
| Claude Opus 4.6                 | Automatic with adaptive thinking. Beta header deprecated and safely ignored.                 |
| Claude Sonnet 5                 | Automatic with adaptive thinking. Beta header deprecated and safely ignored.                 |
| Claude Sonnet 4.6               | Automatic with adaptive thinking (recommended). Beta header still functional but deprecated. |
| Claude Opus 4.5                 | Add `interleaved-thinking-2025-05-14` beta header.                                           |
| Claude Haiku 4.5                | Not supported. Header accepted but ignored.                                                  |
| Earlier Claude 4 models         | Add `interleaved-thinking-2025-05-14` beta header.                                           |

**Key Points:**

- With interleaved thinking, the `budget_tokens` can exceed the `max_tokens` parameter, as it represents the total budget across all thinking blocks within one assistant turn
- Interleaved thinking is only supported for tools used via the Messages API
- On partner-operated platforms, if you pass `interleaved-thinking-2025-05-14` to unsupported models, your request will fail

## Extended Thinking with Prompt Caching

Prompt caching with thinking has several important considerations:

**Thinking block context removal:**

- On earlier Opus/Sonnet models and all Haiku models, thinking blocks from previous turns are removed from context, which can affect cache breakpoints
- On Opus 4.5+ and Sonnet 4.6+, they are kept by default
- When continuing conversations with tool use, thinking blocks are cached and count as input tokens when read from cache

**Cache invalidation patterns:**

- Changes to thinking parameters (enabled/disabled or budget allocation) invalidate message cache breakpoints
- Interleaved thinking amplifies cache invalidation, as thinking blocks can occur between multiple tool calls
- System prompts and tools remain cached despite thinking parameter changes or block removal

Extended thinking tasks often take longer than 5 minutes to complete. Consider using the 1-hour cache duration to maintain cache hits across longer thinking sessions and multi-step workflows.

## Thinking Block Encryption

The `signature` field carries encrypted full thinking for multi-turn continuity. The signature is identical whether `display` is `"summarized"` or `"omitted"`. Switching `display` values between turns in a conversation is supported.

When you pass thinking blocks back in multi-turn conversations, pass them unchanged. The server decrypts the `signature` to reconstruct the original thinking for prompt construction.

## Best Practices

1. **Plan thinking strategy early:** Decide whether to enable thinking at the start of each conversation turn rather than trying to toggle mid-turn
2. **Budget allocation:** Start with reasonable `budget_tokens` (10,000-16,000) and adjust based on task complexity
3. **Preserve thinking blocks:** Always pass complete, unmodified thinking blocks back to the API during tool use
4. **Monitor token usage:** Remember that summarized thinking is still billed for full tokens
5. **Use omitted display for latency:** Set `display: "omitted"` in latency-sensitive applications where you don't need to surface thinking to users
6. **Cache considerations:** Plan caching strategy when combining extended thinking with prompt caching
7. **Streaming optimization:** Use streaming with `display: "omitted"` for faster time-to-first-token
