---
title: "Streaming API"
source_url: "https://platform.claude.com/docs/en/api/streaming"
source_type: "web-extracted"
fetched_at: "2026-02-16T00:00:00Z"
category: "api"
---

# Streaming Messages

Set `"stream": true` when creating a Message to incrementally stream the response using server-sent events (SSE).

## SDK Streaming

### Python
```python
with client.messages.stream(
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello"}],
    model="claude-opus-4-6",
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

### TypeScript
```typescript
await client.messages.stream({
  messages: [{ role: "user", content: "Hello" }],
  model: "claude-opus-4-6",
  max_tokens: 1024
}).on("text", (text) => { console.log(text); });
```

## Get Final Message Without Events

Use `.stream()` with `.get_final_message()` (Python) or `.finalMessage()` (TypeScript) to get the complete `Message` object without event handling. Useful for large `max_tokens` values where SDKs require streaming to avoid HTTP timeouts.

```python
with client.messages.stream(
    max_tokens=128000,
    messages=[{"role": "user", "content": "Write a detailed analysis..."}],
    model="claude-opus-4-6",
) as stream:
    message = stream.get_final_message()
```

## Event Types

### Event Flow
1. `message_start`: Message object with empty content
2. Content blocks (each with `content_block_start`, `content_block_delta` events, `content_block_stop`)
3. `message_delta`: Top-level changes, cumulative usage
4. `message_stop`: Stream complete

### Ping Events
May appear at any point in the stream.

### Error Events
```json
{"type": "error", "error": {"type": "overloaded_error", "message": "Overloaded"}}
```

## Content Block Delta Types

### Text Delta
```json
{"type": "content_block_delta", "index": 0, "delta": {"type": "text_delta", "text": "ello frien"}}
```

### Input JSON Delta (Tool Use)
Partial JSON strings accumulated until `content_block_stop`. Parse with partial JSON library or SDK helpers.
```json
{"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "{\"location\": \"San Fra"}}
```

### Thinking Delta (Extended Thinking)
```json
{"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "I need to find..."}}
```

A `signature_delta` is sent before `content_block_stop` for thinking blocks:
```json
{"type": "content_block_delta", "index": 0, "delta": {"type": "signature_delta", "signature": "EqQBCgIYAh..."}}
```

## Streaming with Tool Use

Fine-grained streaming supported per tool with `eager_input_streaming`. Tool use blocks stream `input_json_delta` events for partial parameters.

## Streaming with Extended Thinking

Thinking content arrives via `thinking_delta` events followed by `signature_delta`. Handle both event types:

```python
with client.messages.stream(
    model="claude-opus-4-6",
    max_tokens=20000,
    thinking={"type": "enabled", "budget_tokens": 16000},
    messages=[{"role": "user", "content": "What is GCD of 1071 and 462?"}],
) as stream:
    for event in stream:
        if event.type == "content_block_delta":
            if event.delta.type == "thinking_delta":
                print(event.delta.thinking, end="", flush=True)
            elif event.delta.type == "text_delta":
                print(event.delta.text, end="", flush=True)
```

## Streaming with Web Search

Server tool use blocks (`server_tool_use`) and results (`web_search_tool_result`) appear as content blocks in the stream. Usage includes `server_tool_use.web_search_requests` count.

## Error Recovery

For Claude 4.5 models and earlier: capture partial response, construct continuation request with partial assistant message, resume streaming.

For Claude Opus 4.6: add a user message instructing the model to continue from where it left off.

### Best Practices
- Use SDK built-in message accumulation and error handling
- Handle multiple content types (text, tool_use, thinking)
- Tool use and extended thinking blocks cannot be partially recovered
- Resume from the most recent text block
