---
title: "Streaming API"
source_url: "https://platform.claude.com/docs/en/api/streaming"
source_type: "web-extracted"
fetched_at: "2026-01-31T00:00:00Z"
category: "api"
---

# Streaming Messages

Set `"stream": true` to incrementally stream responses using server-sent events (SSE).

## SDK Streaming

### Python

```python
import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello"}],
    model="claude-sonnet-4-5",
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

### TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

await client.messages.stream({
    messages: [{role: 'user', content: "Hello"}],
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
}).on('text', (text) => {
    console.log(text);
});
```

## Event Types

Stream event flow:

1. `message_start` - Contains `Message` object with empty content
2. Content blocks (for each):
   - `content_block_start`
   - `content_block_delta` (one or more)
   - `content_block_stop`
3. `message_delta` - Top-level message changes
4. `message_stop` - Final event

### Event Format

```json
event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "text_delta", "text": "Hello"}}
```

## Delta Types

### Text Delta

```json
{
  "type": "content_block_delta",
  "index": 0,
  "delta": {"type": "text_delta", "text": "ello frien"}
}
```

### Input JSON Delta (Tool Use)

```json
{
  "type": "content_block_delta",
  "index": 1,
  "delta": {"type": "input_json_delta", "partial_json": "{\"location\": \"San Fra"}
}
```

Note: Accumulate partial JSON strings and parse after `content_block_stop`.

### Thinking Delta (Extended Thinking)

```json
{
  "type": "content_block_delta",
  "index": 0,
  "delta": {"type": "thinking_delta", "thinking": "Let me solve this step by step..."}
}
```

### Signature Delta

Sent before `content_block_stop` for thinking blocks:

```json
{
  "type": "content_block_delta",
  "index": 0,
  "delta": {"type": "signature_delta", "signature": "EqQBCgIYAhIM..."}
}
```

## Ping Events

Streams may include `ping` events to keep connections alive.

## Error Events

Errors can occur during streaming:

```json
event: error
data: {"type": "error", "error": {"type": "overloaded_error", "message": "Overloaded"}}
```

## Basic Streaming Request

```bash
curl https://api.anthropic.com/v1/messages \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --data '{
       "model": "claude-sonnet-4-5",
       "messages": [{"role": "user", "content": "Hello"}],
       "max_tokens": 256,
       "stream": true
     }'
```

## Example Response

```
event: message_start
data: {"type": "message_start", "message": {"id": "msg_...", ...}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "text", "text": ""}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "text_delta", "text": "Hello"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "text_delta", "text": "!"}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 0}

event: message_delta
data: {"type": "message_delta", "delta": {"stop_reason": "end_turn"}, "usage": {"output_tokens": 15}}

event: message_stop
data: {"type": "message_stop"}
```

## Streaming with Tools

Tool use blocks stream with `input_json_delta`:

```json
event: content_block_start
data: {"type":"content_block_start","index":1,"content_block":{"type":"tool_use","id":"toolu_...","name":"get_weather","input":{}}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"{\"location\":"}}
```

## Streaming with Extended Thinking

```python
with client.messages.stream(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={"type": "enabled", "budget_tokens": 16000},
    messages=[{"role": "user", "content": "What is 27 * 453?"}],
) as stream:
    for event in stream:
        if event.type == "content_block_delta":
            if event.delta.type == "thinking_delta":
                print(event.delta.thinking, end="")
            elif event.delta.type == "text_delta":
                print(event.delta.text, end="")
```

## Error Recovery

When streaming is interrupted:

1. **Capture partial response**: Save all received content
2. **Construct continuation request**: Include partial assistant response
3. **Resume streaming**: Continue from interruption point

Best practices:
- Use SDK's built-in accumulation
- Handle all content types (text, tool_use, thinking)
- Tool use and thinking blocks cannot be partially recovered
- Resume from the most recent text block
