---
title: "Streaming API"
source_url: "https://platform.claude.com/docs/en/api/streaming"
source_type: "web-extracted"
fetched_at: "2026-07-27T00:00:00Z"
category: "api"
---

# Streaming Messages

When creating a Message, you can set `"stream": true` to incrementally stream the response using [server-sent events](https://developer.mozilla.org/en-US/Web/API/Server-sent_events/Using_server-sent_events) (SSE). Streaming allows you to display partial results as they are generated rather than waiting for the complete response.

## SDK Streaming

The Python, TypeScript, PHP, C#, Go, Java, and Ruby SDKs offer multiple ways of streaming.

### Python

```python
import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello"}],
    model="claude-opus-5",
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

### TypeScript

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

await client.messages
  .stream({
    messages: [{ role: "user", content: "Hello" }],
    model: "claude-opus-5",
    max_tokens: 1024,
  })
  .on("text", (text) => {
    console.log(text);
  });
```

### cURL (Raw SSE)

```bash
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-opus-5",
    "max_tokens": 256,
    "stream": true,
    "messages": [
      {"role": "user", "content": "Hello"}
    ]
  }'
```

### Go

```go
client := anthropic.NewClient()

stream := client.Messages.NewStreaming(context.TODO(), anthropic.MessageNewParams{
	Model:     anthropic.ModelClaudeOpus5,
	MaxTokens: 1024,
	Messages: []anthropic.MessageParam{
		anthropic.NewUserMessage(anthropic.NewTextBlock("Hello")),
	},
})

for stream.Next() {
	event := stream.Current()
	switch eventVariant := event.AsAny().(type) {
	case anthropic.ContentBlockDeltaEvent:
		switch deltaVariant := eventVariant.Delta.AsAny().(type) {
		case anthropic.TextDelta:
			fmt.Print(deltaVariant.Text)
		}
	}
}
if err := stream.Err(); err != nil {
	log.Fatal(err)
}
```

## Get Final Message Without Events

If you don't need to process text as it arrives, the SDKs provide a way to use streaming under the hood while returning the complete `Message` object, identical to what `.create()` returns. This is especially useful for requests with large `max_tokens` values, where the SDKs require streaming to avoid HTTP timeouts.

### Python

```python
with client.messages.stream(
    max_tokens=128000,
    messages=[{"role": "user", "content": "Write a detailed analysis of modern architecture."}],
    model="claude-opus-5",
) as stream:
    message = stream.get_final_message()

print(message.content[0].text)
print(f"Input tokens: {message.usage.input_tokens}")
print(f"Output tokens: {message.usage.output_tokens}")
```

### TypeScript

```typescript
const stream = client.messages.stream({
  max_tokens: 128000,
  messages: [
    {
      role: "user",
      content: "Write a detailed analysis of modern architecture.",
    },
  ],
  model: "claude-opus-5",
});

const message = await stream.finalMessage();
const textBlock = message.content.find((block) => block.type === "text");
if (textBlock && textBlock.type === "text") {
  console.log(textBlock.text);
}
```

### Go

```go
client := anthropic.NewClient()

stream := client.Messages.NewStreaming(context.TODO(), anthropic.MessageNewParams{
	Model:     anthropic.ModelClaudeOpus5,
	MaxTokens: 128000,
	Messages: []anthropic.MessageParam{
		anthropic.NewUserMessage(anthropic.NewTextBlock("Write a detailed analysis...")),
	},
})

message := anthropic.Message{}
for stream.Next() {
	event := stream.Current()
	if err := message.Accumulate(event); err != nil {
		log.Fatal(err)
	}
}
if err := stream.Err(); err != nil {
	log.Fatal(err)
}

fmt.Println(message.Content[0].Text)
```

The `.stream()` call keeps the HTTP connection alive with server-sent events, then `.get_final_message()` (Python) or `.finalMessage()` (TypeScript) accumulates all events and returns the complete `Message` object. In Go, you call `message.Accumulate(event)` inside the stream loop to build the same complete `Message`. In Java, use `MessageAccumulator.create()` and call `accumulator.accumulate(event)` on each event. In C#, await the stream's `.Aggregate()` extension method. In Ruby, call `.accumulated_message` on the stream.

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

During server-side fallback responses, a `fallback` content block arrives at each model boundary as a `content_block_start` and `content_block_stop` pair with no deltas in between.

## Event Types

### `message_start`

Contains the initial `Message` object with an empty `content` array:

```json
event: message_start
data: {
  "type": "message_start",
  "message": {
    "id": "msg_1nZdL29xx5MUA1yADyHTEsnR8uuvGzszyY",
    "type": "message",
    "role": "assistant",
    "content": [],
    "model": "claude-opus-5",
    "stop_reason": null,
    "stop_sequence": null,
    "usage": {"input_tokens": 25, "output_tokens": 1}
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
  "delta": { "type": "text_delta", "text": "ello frien" }
}
```

### Input JSON Delta (Tool Use)

Partial JSON strings for tool input. Accumulate these until `content_block_stop`, then parse the complete JSON. Use a partial JSON parsing library or SDK helpers for real-time display.

```json
{
  "type": "content_block_delta",
  "index": 1,
  "delta": {
    "type": "input_json_delta",
    "partial_json": "{\"location\": \"San Fra"
  }
}
```

Note: Current models only support emitting one complete key and value property from `input` at a time. As such, when using tools, there may be delays between streaming events while the model is working.

### Thinking Delta (Extended Thinking)

Incremental thinking content when extended thinking is enabled:

```json
{
  "type": "content_block_delta",
  "index": 0,
  "delta": {
    "type": "thinking_delta",
    "thinking": "I need to find the GCD of 1071 and 462 using the Euclidean algorithm.\n\n1071 = 2 x 462 + 147"
  }
}
```

When `display: "omitted"` is set on the thinking configuration, no `thinking_delta` events are sent. The thinking block opens, receives a single `signature_delta`, and closes.

### Signature Delta

Sent before `content_block_stop` for thinking blocks. Contains a cryptographic signature for the thinking content:

```json
{
  "type": "content_block_delta",
  "index": 0,
  "delta": {
    "type": "signature_delta",
    "signature": "EqQBCgIYAhIM1gbcDa9GJwZA2b3hGgxBdjrkzLoky3dl1pkiMOYds..."
  }
}
```

## Streaming with Tool Use

Tool use blocks appear in the stream with `content_block_start` (type `tool_use`) followed by `input_json_delta` events.

### Fine-grained Tool Streaming

Tool use supports fine-grained streaming for parameter values. Enable it per tool with `eager_input_streaming`.

```python
with client.messages.stream(
    model="claude-opus-5",
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
const stream = client.messages.stream({
  model: "claude-opus-5",
  max_tokens: 1024,
  tools,
  messages: [{ role: "user", content: "What's the weather in SF and NYC?" }],
});

for await (const event of stream) {
  if (
    event.type === "content_block_start" &&
    event.content_block.type === "tool_use"
  ) {
    console.log(`\nTool call: ${event.content_block.name}`);
  } else if (
    event.type === "content_block_delta" &&
    event.delta.type === "input_json_delta"
  ) {
    process.stdout.write(event.delta.partial_json);
  }
}
```

## Streaming with Extended Thinking

When streaming with extended thinking enabled, thinking content arrives via `thinking_delta` events followed by a `signature_delta` before the thinking block closes. Text output follows in subsequent content blocks.

The `display: "summarized"` setting streams a condensed summary of Claude's reasoning rather than the full chain of thought.

```python
with client.messages.stream(
    model="claude-opus-5",
    max_tokens=20000,
    thinking={"type": "adaptive", "display": "summarized"},
    messages=[{"role": "user", "content": "What is the GCD of 1071 and 462?"}],
) as stream:
    for event in stream:
        if event.type == "content_block_delta":
            if event.delta.type == "thinking_delta":
                print(event.delta.thinking, end="", flush=True)
            elif event.delta.type == "text_delta":
                print(event.delta.text, end="", flush=True)
```

```typescript
const stream = client.messages.stream({
  model: "claude-opus-5",
  max_tokens: 20000,
  thinking: { type: "adaptive", display: "summarized" },
  messages: [{ role: "user", content: "What is the GCD of 1071 and 462?" }],
});

for await (const event of stream) {
  if (event.type === "content_block_delta") {
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
    model="claude-opus-5",
    max_tokens=1024,
    tools=[{"type": "web_search_20250305", "name": "web_search", "max_uses": 5}],
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

### Claude 4.5 and Earlier

For Claude 4.5 models and earlier, you can recover a streaming request that was interrupted by resuming from where the stream was interrupted:

1. **Capture the partial response:** Save all content that was successfully received before the error occurred.
2. **Construct a continuation request:** Create a new API request that includes the partial assistant response as the beginning of a new assistant message (prefilling).
3. **Resume streaming:** Continue receiving the rest of the response from where it was interrupted.

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

### Claude 4.6 and Later

For Claude 4.6 and later models, the same capture-and-resume strategy applies, but step 2 changes: instead of placing the partial response in an assistant message, add a user message that instructs the model to continue from where it left off.

1. **Capture the partial response:** Save all content that was successfully received before the error occurred.
2. **Construct a continuation request:** Create a new API request with a user message containing the partial response and an instruction to continue.
3. **Resume streaming:** Continue receiving the rest of the response from where it was interrupted.

```python
# After a stream interruption, send a continuation request
messages = [
    {"role": "user", "content": "Write a detailed essay about renewable energy."},
    {"role": "assistant", "content": partial_text_received},
    {"role": "user", "content": "Your previous response was interrupted. Continue from where you left off."}
]

with client.messages.stream(
    model="claude-opus-5",
    max_tokens=remaining_tokens,
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
- **Handle unknown event types gracefully**: New event types may be added per the versioning policy.
