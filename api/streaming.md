---
title: "Streaming API"
source_url: "https://platform.claude.com/docs/en/api/streaming"
source_type: "web-extracted"
fetched_at: "2026-03-10T00:00:00Z"
category: "api"
---

# Streaming Messages

Set `"stream": true` when creating a Message to incrementally stream the response using server-sent events (SSE). Streaming allows you to display partial results as they are generated rather than waiting for the complete response.

## SDK Streaming

### Python

```python
import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello, Claude"}],
    model="claude-opus-4-6",
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

### TypeScript

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const stream = await client.messages.stream({
  messages: [{ role: "user", content: "Hello, Claude" }],
  model: "claude-opus-4-6",
  max_tokens: 1024,
});

stream.on("text", (text) => {
  process.stdout.write(text);
});

const finalMessage = await stream.finalMessage();
console.log("\n\nFinal usage:", finalMessage.usage);
```

### cURL (Raw SSE)

```bash
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-opus-4-6",
    "max_tokens": 1024,
    "stream": true,
    "messages": [
      {"role": "user", "content": "Hello, Claude"}
    ]
  }'
```

## Get Final Message Without Events

Use `.stream()` with `.get_final_message()` (Python) or `.finalMessage()` (TypeScript) to get the complete `Message` object without processing individual events. This is useful when you need streaming to avoid HTTP timeouts on long responses but do not need incremental display.

### Python

```python
with client.messages.stream(
    max_tokens=128000,
    messages=[{"role": "user", "content": "Write a detailed analysis of modern architecture."}],
    model="claude-opus-4-6",
) as stream:
    message = stream.get_final_message()

print(message.content[0].text)
print(f"Input tokens: {message.usage.input_tokens}")
print(f"Output tokens: {message.usage.output_tokens}")
```

### TypeScript

```typescript
const stream = await client.messages.stream({
  max_tokens: 128000,
  messages: [{ role: "user", content: "Write a detailed analysis of modern architecture." }],
  model: "claude-opus-4-6",
});

const message = await stream.finalMessage();
console.log(message.content[0].text);
console.log(`Input tokens: ${message.usage.input_tokens}`);
console.log(`Output tokens: ${message.usage.output_tokens}`);
```

## Event Flow

The stream emits events in a defined order:

```
message_start
  content_block_start       (for each content block)
    content_block_delta     (one or more per block)
    content_block_delta
    ...
  content_block_stop
  content_block_start       (next content block, if any)
    content_block_delta
    ...
  content_block_stop
message_delta               (top-level changes, cumulative usage)
message_stop
```

**Ping events** (`event: ping`) may appear at any point throughout the stream.

## Event Types

### `message_start`

Contains the initial `Message` object with an empty `content` array:

```json
event: message_start
data: {
  "type": "message_start",
  "message": {
    "id": "msg_01XFDUDYJgAACzvnptvVoYEL",
    "type": "message",
    "role": "assistant",
    "content": [],
    "model": "claude-opus-4-6",
    "stop_reason": null,
    "stop_sequence": null,
    "usage": {"input_tokens": 10, "output_tokens": 1}
  }
}
```

### `content_block_start`

Signals the beginning of a new content block:

```json
event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "text", "text": ""}}
```

### `content_block_delta`

Incremental updates to the current content block. The delta type varies by content block type.

### `content_block_stop`

Marks the end of the current content block:

```json
event: content_block_stop
data: {"type": "content_block_stop", "index": 0}
```

### `message_delta`

Top-level message changes, including `stop_reason` and cumulative `usage`:

```json
event: message_delta
data: {
  "type": "message_delta",
  "delta": {"stop_reason": "end_turn", "stop_sequence": null},
  "usage": {"output_tokens": 15}
}
```

The `usage.output_tokens` in `message_delta` is **cumulative** -- it represents the total output tokens for the entire message, not a delta.

### `message_stop`

The stream is complete:

```json
event: message_stop
data: {"type": "message_stop"}
```

### `ping`

Keep-alive event. May appear at any point:

```json
event: ping
data: {"type": "ping"}
```

### `error`

An error occurred during streaming:

```json
event: error
data: {"type": "error", "error": {"type": "overloaded_error", "message": "Overloaded"}}
```

## Content Block Delta Types

### Text Delta

Incremental text output:

```json
{
  "type": "content_block_delta",
  "index": 0,
  "delta": {"type": "text_delta", "text": "Hello! How can I"}
}
```

### Input JSON Delta (Tool Use)

Partial JSON strings for tool input. Accumulate these until `content_block_stop`, then parse the complete JSON. Use a partial JSON parsing library or SDK helpers for real-time display.

```json
{
  "type": "content_block_delta",
  "index": 1,
  "delta": {"type": "input_json_delta", "partial_json": "{\"location\": \"San Fra"}
}
```

### Thinking Delta (Extended Thinking)

Incremental thinking content when extended thinking is enabled:

```json
{
  "type": "content_block_delta",
  "index": 0,
  "delta": {"type": "thinking_delta", "thinking": "Let me work through this step by step..."}
}
```

### Signature Delta

Sent before `content_block_stop` for thinking blocks. Contains a cryptographic signature for the thinking content:

```json
{
  "type": "content_block_delta",
  "index": 0,
  "delta": {"type": "signature_delta", "signature": "EqQBCgIYAhIM1gbcDa9GJwZKJMPrGg..."}
}
```

## Streaming with Tool Use

Tool use blocks appear in the stream with `content_block_start` (type `tool_use`) followed by `input_json_delta` events.

### Fine-grained Tool Streaming

Use `eager_input_streaming` to receive tool input deltas as they are generated, enabling real-time tool input display:

```python
with client.messages.stream(
    model="claude-opus-4-6",
    max_tokens=1024,
    tools=tools,
    messages=[{"role": "user", "content": "What's the weather in SF and NYC?"}],
) as stream:
    for event in stream:
        if event.type == "content_block_start" and event.content_block.type == "tool_use":
            print(f"\nTool call: {event.content_block.name}")
        elif event.type == "content_block_delta" and event.delta.type == "input_json_delta":
            print(event.delta.partial_json, end="", flush=True)
```

```typescript
const stream = await client.messages.stream({
  model: "claude-opus-4-6",
  max_tokens: 1024,
  tools,
  messages: [{ role: "user", content: "What's the weather in SF and NYC?" }],
});

for await (const event of stream) {
  if (event.type === "content_block_start" && event.content_block.type === "tool_use") {
    console.log(`\nTool call: ${event.content_block.name}`);
  } else if (event.type === "content_block_delta" && event.delta.type === "input_json_delta") {
    process.stdout.write(event.delta.partial_json);
  }
}
```

## Streaming with Extended Thinking

When streaming with extended thinking enabled, thinking content arrives via `thinking_delta` events followed by a `signature_delta` before the thinking block closes. Text output follows in subsequent content blocks.

```python
with client.messages.stream(
    model="claude-opus-4-6",
    max_tokens=20000,
    thinking={"type": "enabled", "budget_tokens": 16000},
    messages=[{"role": "user", "content": "What is the GCD of 1071 and 462?"}],
) as stream:
    for event in stream:
        if event.type == "content_block_start":
            if event.content_block.type == "thinking":
                print("[Thinking] ", end="")
            elif event.content_block.type == "text":
                print("\n[Response] ", end="")
        elif event.type == "content_block_delta":
            if event.delta.type == "thinking_delta":
                print(event.delta.thinking, end="", flush=True)
            elif event.delta.type == "text_delta":
                print(event.delta.text, end="", flush=True)
```

```typescript
const stream = await client.messages.stream({
  model: "claude-opus-4-6",
  max_tokens: 20000,
  thinking: { type: "enabled", budget_tokens: 16000 },
  messages: [{ role: "user", content: "What is the GCD of 1071 and 462?" }],
});

for await (const event of stream) {
  if (event.type === "content_block_start") {
    if (event.content_block.type === "thinking") {
      process.stdout.write("[Thinking] ");
    } else if (event.content_block.type === "text") {
      process.stdout.write("\n[Response] ");
    }
  } else if (event.type === "content_block_delta") {
    if (event.delta.type === "thinking_delta") {
      process.stdout.write(event.delta.thinking);
    } else if (event.delta.type === "text_delta") {
      process.stdout.write(event.delta.text);
    }
  }
}
```

## Streaming with Web Search

Server tool use blocks (`server_tool_use`) and results (`web_search_tool_result`) appear as content blocks within the stream. Usage information includes a `server_tool_use.web_search_requests` count.

```python
with client.messages.stream(
    model="claude-opus-4-6",
    max_tokens=1024,
    tools=[{"type": "web_search_20260209", "name": "web_search"}],
    messages=[{"role": "user", "content": "What is the latest news about AI safety?"}],
) as stream:
    for event in stream:
        if event.type == "content_block_start":
            if hasattr(event.content_block, "type"):
                if event.content_block.type == "server_tool_use":
                    print(f"[Searching: {event.content_block.name}]")
                elif event.content_block.type == "web_search_tool_result":
                    print("[Search results received]")
        elif event.type == "content_block_delta" and event.delta.type == "text_delta":
            print(event.delta.text, end="", flush=True)
```

## Error Recovery

Streaming responses may be interrupted by network errors, timeouts, or server issues. Recovery strategies differ by model.

### Claude Opus 4.6

For Opus 4.6, use a continuation prompt. Add a user message instructing the model to continue from where it left off:

```python
# After a stream interruption, send a continuation request
messages = [
    {"role": "user", "content": "Write a detailed essay about renewable energy."},
    {"role": "assistant", "content": partial_text_received},
    {"role": "user", "content": "Please continue from where you left off."}
]

with client.messages.stream(
    model="claude-opus-4-6",
    max_tokens=remaining_tokens,
    messages=messages,
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

### Claude 4.5 and Earlier

For Claude 4.5 models and earlier, capture the partial response and construct a continuation request with a partial assistant message (prefilling):

```python
# Capture partial response during streaming
partial_response = ""
try:
    with client.messages.stream(
        model="claude-sonnet-4-5-20250929",
        max_tokens=4096,
        messages=[{"role": "user", "content": "Write a detailed essay about renewable energy."}],
    ) as stream:
        for text in stream.text_stream:
            partial_response += text
            print(text, end="", flush=True)
except Exception:
    # Resume with partial assistant message
    messages = [
        {"role": "user", "content": "Write a detailed essay about renewable energy."},
        {"role": "assistant", "content": partial_response},
    ]
    with client.messages.stream(
        model="claude-sonnet-4-5-20250929",
        max_tokens=4096,
        messages=messages,
    ) as stream:
        for text in stream.text_stream:
            print(text, end="", flush=True)
```

### Recovery Best Practices

- Use SDK built-in message accumulation and error handling when available.
- Handle multiple content types (text, tool_use, thinking) in your event processing.
- Tool use and extended thinking blocks **cannot** be partially recovered -- resume from the most recent complete text block.
- Track accumulated text separately from tool use blocks for clean recovery.

## Best Practices

- **Use SDK helpers** (`.stream()`, `.text_stream`) rather than parsing raw SSE events when possible.
- **Handle all delta types**: text_delta, input_json_delta, thinking_delta, and signature_delta.
- **Flush output**: Use `flush=True` (Python) or `process.stdout.write` (Node.js) for real-time display.
- **Use streaming for large outputs**: SDKs may require streaming to avoid HTTP timeouts for large `max_tokens` values.
- **Process `message_delta` for usage**: The cumulative `output_tokens` count is only available in the `message_delta` event.
- **Handle ping events**: Simply ignore them; they are keep-alive signals.
