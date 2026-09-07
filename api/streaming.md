---
title: "Streaming API"
source_url: "https://platform.claude.com/docs/en/api/streaming"
source_type: "web-extracted"
fetched_at: "2026-09-07T00:00:00Z"
category: "api"
---

# Streaming Messages

When creating a Message, you can set `"stream": true` to incrementally stream the response using [server-sent events](https://developer.mozilla.org/en-US/Web/API/Server-sent_events/Using_server-sent_events) (SSE).

## Streaming with SDKs

The Python, TypeScript, PHP, C#, Go, Java, and Ruby SDKs offer multiple ways of streaming. The Python SDK allows both sync and async streams. See the documentation in each SDK for details.

### Python

```python
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

### CLI

```bash
ant messages create --stream --format jsonl \
  --model claude-opus-5 \
  --max-tokens 1024 \
  --message '{role: user, content: "Hello"}' \
  | jq -rj 'select(.delta.type? == "text_delta") | .delta.text'
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

### C#

```csharp
AnthropicClient client = new();

var parameters = new MessageCreateParams
{
    Model = Model.ClaudeOpus5,
    MaxTokens = 1024,
    Messages = [new() { Role = Role.User, Content = "Hello" }]
};

await foreach (var msg in client.Messages.CreateStreaming(parameters))
{
    Console.Write(msg);
}
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

### Java

```java
AnthropicClient client = AnthropicOkHttpClient.fromEnv();

MessageCreateParams params = MessageCreateParams.builder()
    .model(Model.CLAUDE_OPUS_5)
    .maxTokens(1024L)
    .addUserMessage("Hello")
    .build();

try (var streamResponse = client.messages().createStreaming(params)) {
    streamResponse.stream().forEach(event -> {
        event.contentBlockDelta().ifPresent(deltaEvent ->
            deltaEvent.delta().text().ifPresent(td ->
                System.out.print(td.text())
            )
        );
    });
}
```

### PHP

```php
$client = new Client();

$stream = $client->messages->createStream(
    maxTokens: 1024,
    messages: [
        ['role' => 'user', 'content' => 'Hello']
    ],
    model: 'claude-opus-5',
);

foreach ($stream as $message) {
    echo $message;
}
```

### Ruby

```ruby
client = Anthropic::Client.new

stream = client.messages.stream(
  model: "claude-opus-5",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello" }]
)

stream.text.each { |text| print(text) }
```

## Get Final Message Without Events

If you don't need to process text as it arrives, the SDKs provide a way to use streaming internally while returning the complete `Message` object, identical to what `.create()` returns. This is especially useful for requests with large `max_tokens` values, where the SDKs require streaming to avoid HTTP timeouts.

### Python

```python
with client.messages.stream(
    max_tokens=128000,
    messages=[{"role": "user", "content": "Write a detailed analysis..."}],
    model="claude-opus-5",
) as stream:
    message = stream.get_final_message()

for block in message.content:
    if block.type == "text":
        print(block.text)
```

### TypeScript

```typescript
const stream = client.messages.stream({
  max_tokens: 128000,
  messages: [{ role: "user", content: "Write a detailed analysis..." }],
  model: "claude-opus-5"
});

const message = await stream.finalMessage();
const textBlock = message.content.find((block) => block.type === "text");
if (textBlock && textBlock.type === "text") {
  console.log(textBlock.text);
}
```

### Go

```go
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

for _, block := range message.Content {
	if textBlock, ok := block.AsAny().(anthropic.TextBlock); ok {
		fmt.Println(textBlock.Text)
	}
}
```

### Java

```java
MessageAccumulator accumulator = MessageAccumulator.create();
try (var streamResponse = client.messages().createStreaming(params)) {
    streamResponse.stream().forEach(accumulator::accumulate);
}

Message message = accumulator.message();
message.content().stream()
    .flatMap(block -> block.text().stream())
    .forEach(textBlock -> System.out.println(textBlock.text()));
```

### Ruby

```ruby
message = client.messages.stream(
  model: "claude-opus-5",
  max_tokens: 128000,
  messages: [{ role: "user", content: "Write a detailed analysis..." }]
).accumulated_message

message.content.each do |block|
  puts block.text if block.type == :text
end
```

The `.stream()` call keeps the HTTP connection alive with server-sent events, then `.get_final_message()` (Python) or `.finalMessage()` (TypeScript) accumulates all events and returns the complete `Message` object. In Go, call `message.Accumulate(event)` inside the stream loop. In Java, use `MessageAccumulator.create()` and call `accumulator.accumulate(event)` on each event. In C#, await the stream's `.Aggregate()` extension method. In Ruby, call `.accumulated_message` on the stream.

## Event Types

Each server-sent event includes a named event type and associated JSON data.

Each stream uses the following event flow:

1. `message_start`: contains a `Message` object with empty `content`. Under the `thinking-binding-controls-2026-08-01` beta header, this `Message` object also carries the `input_transformations` array.
2. A series of content blocks, each of which has a `content_block_start`, one or more `content_block_delta` events, and a `content_block_stop` event. Each content block has an `index` that corresponds to its index in the final Message `content` array. One exception: during server-side fallback responses, a `fallback` content block arrives at each model boundary as a `content_block_start` and `content_block_stop` pair with no deltas in between.
3. One or more `message_delta` events, indicating top-level changes to the final `Message` object.
4. A final `message_stop` event.

> **Note:** The token counts shown in the `usage` field of the `message_delta` event are *cumulative*.

### Ping Events

Event streams may also include any number of `ping` events (keep-alive signals).

### Error Events

The API may occasionally send errors in the event stream. For example, during periods of high usage, you may receive an `overloaded_error`:

```
event: error
data: {"type": "error", "error": {"type": "overloaded_error", "message": "Overloaded"}}
```

### Other Events

In accordance with the versioning policy, new event types may be added, and your code should handle unknown event types gracefully.

## Content Block Delta Types

Each `content_block_delta` event contains a `delta` of a type that updates the `content` block at a given `index`.

### Text Delta

```json
{
  "type": "content_block_delta",
  "index": 0,
  "delta": { "type": "text_delta", "text": "ello frien" }
}
```

### Input JSON Delta (Tool Use)

The deltas for `tool_use` content blocks correspond to updates for the `input` field. Deltas are *partial JSON strings*; the final `tool_use.input` is always an *object*. Accumulate the string deltas and parse the JSON once you receive a `content_block_stop` event, or use a partial JSON parsing library or SDK helpers for real-time display.

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

When using thinking with streaming enabled, you'll receive thinking content through `thinking_delta` events. These deltas correspond to the `thinking` field of the `thinking` content blocks.

For thinking content, a special `signature_delta` event is sent just before the `content_block_stop` event. This signature is used to verify the integrity of the thinking block.

When `display: "omitted"` is set on the thinking configuration, no `thinking_delta` events are sent. The thinking block opens, receives a single `signature_delta`, and closes. With `display: "updates"` (beta), reasoning blocks stream the same way, and only the progress updates that some models write between tool calls stream `thinking_delta` events.

```json
{
  "type": "content_block_delta",
  "index": 0,
  "delta": {
    "type": "thinking_delta",
    "thinking": "I need to find the GCD of 1071 and 462..."
  }
}
```

### Signature Delta

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

Tool use blocks appear in the stream with `content_block_start` (type `tool_use`) followed by `input_json_delta` events. Tool use supports fine-grained streaming for parameter values. Enable it per tool with `eager_input_streaming`.

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

## Streaming with Web Search

Server tool use blocks (`server_tool_use`) and results (`web_search_tool_result`) appear as content blocks within the stream. Usage information includes a `server_tool_use.web_search_requests` count.

```python
with client.messages.stream(
    model="claude-opus-5",
    max_tokens=1024,
    tools=[{"type": "web_search_20260209", "name": "web_search", "max_uses": 5}],
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

For Claude 4.5 models and earlier, you can recover by resuming from where the stream was interrupted:

1. **Capture the partial response:** Save all content received before the error.
2. **Construct a continuation request:** Include the partial assistant response as the beginning of a new assistant message (prefilling).
3. **Resume streaming:** Continue receiving the rest of the response.

```python
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

For Claude 4.6 and later models, instead of placing the partial response in an assistant message, add a user message that instructs the model to continue from where it left off.

1. **Capture the partial response:** Save all content received before the error.
2. **Construct a continuation request:** Create a new API request with a user message containing the partial response and an instruction to continue.
3. **Resume streaming:** Continue receiving the rest of the response.

```python
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
