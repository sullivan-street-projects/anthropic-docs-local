---
title: "Messages API"
source_url: "https://platform.claude.com/docs/en/api/messages"
source_type: "web-extracted"
fetched_at: "2026-02-16T00:00:00Z"
category: "api"
---

# Messages API

**POST** `/v1/messages`

Send structured input messages and receive model-generated responses.

## Authentication

```
x-api-key: $ANTHROPIC_API_KEY
anthropic-version: 2023-06-01
content-type: application/json
```

## Required Parameters

### `model` (string)
Available models: `claude-opus-4-6`, `claude-opus-4-5-20251101`, `claude-sonnet-4-5-20250929`, `claude-haiku-4-5-20251001`

### `max_tokens` (number)
Maximum tokens to generate before stopping.

### `messages` (array)
Array of message objects with `role` ("user" or "assistant") and `content` (string or array of content blocks).

## Content Block Types

### Text Content
```json
{"type": "text", "text": "Hello, Claude"}
```

### Image Content (base64 or URL)
```json
{"type": "image", "source": {"type": "base64", "media_type": "image/jpeg", "data": "<base64>"}}
{"type": "image", "source": {"type": "url", "url": "https://example.com/image.jpg"}}
```

### Document Content (PDF or plain text)
```json
{"type": "document", "source": {"type": "base64", "media_type": "application/pdf", "data": "<base64>"}}
```

### Tool Use / Tool Result
```json
{"type": "tool_use", "id": "toolu_...", "name": "get_stock_price", "input": {"ticker": "^GSPC"}}
{"type": "tool_result", "tool_use_id": "toolu_...", "content": "259.75 USD"}
```

### Thinking Block
```json
{"type": "thinking", "thinking": "...", "signature": "..."}
```

### Search Result Block
```json
{"type": "search_result", "title": "...", "source": "https://...", "content": [{"type": "text", "text": "..."}]}
```

## Optional Parameters

### `system` (string or array)
System prompt for the conversation. Supports cache control.

### `temperature` (number, default: 1.0)
Range 0.0-1.0. Use 0.0 for analytical, 1.0 for creative.

### `top_p` (number)
Nucleus sampling. Use either `top_p` OR `temperature`, not both.

### `top_k` (number)
Sample from top K options only.

### `stop_sequences` (array of strings)
Model stops when encountering these sequences.

### `stream` (boolean)
Enable incremental streaming via server-sent events.

### `metadata` (object)
- `user_id`: External identifier for abuse detection (no PII).

### `inference_geo` (string)
Geographic region for inference (e.g., `"us"`). Falls back to workspace default.

### `service_tier` (string)
`"auto"` (use priority if available) or `"standard_only"`.

## Extended Thinking

```json
{"thinking": {"type": "enabled", "budget_tokens": 5000}}
{"thinking": {"type": "disabled"}}
{"thinking": {"type": "adaptive"}}
```

- Minimum `budget_tokens`: 1024
- Must be less than `max_tokens`
- Thinking tokens count toward `max_tokens`
- `"adaptive"` recommended for Opus 4.6

## Output Configuration

```json
{
  "output_config": {
    "format": {"type": "json_schema", "schema": {...}},
    "effort": "high"
  }
}
```

Effort levels: `"low"`, `"medium"`, `"high"` (default), `"max"`.

## Tool Use

```json
{
  "tools": [{"name": "...", "description": "...", "input_schema": {...}}],
  "tool_choice": {"type": "auto", "disable_parallel_tool_use": false}
}
```

Tool choice types: `"auto"`, `"any"`, `"tool"` (with `name`), `"none"`.

### Built-in Tools

- **Web Search**: `type: "web_search_20250305"` with `max_uses`, `allowed_domains`, `blocked_domains`, `user_location`
- **Text Editor**: `type: "text_editor_20250728"` with optional `max_characters`
- **Bash**: `type: "bash_20250124"`

## Cache Control

```json
{"cache_control": {"type": "ephemeral", "ttl": "5m"}}
```

TTL options: `"5m"` (default), `"1h"`.

## Response Format

```json
{
  "id": "msg_...",
  "type": "message",
  "role": "assistant",
  "model": "claude-opus-4-6",
  "content": [{"type": "text", "text": "..."}],
  "stop_reason": "end_turn",
  "usage": {
    "input_tokens": 10,
    "output_tokens": 15,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 0,
    "inference_geo": "us",
    "service_tier": "standard"
  }
}
```

### Stop Reasons
- `"end_turn"`: Natural stopping point
- `"max_tokens"`: Reached token limit
- `"stop_sequence"`: Hit custom stop sequence
- `"tool_use"`: Model invoked tools
- `"pause_turn"`: Long-running turn paused
- `"refusal"`: Policy violation detected

### Response Content Types
- `TextBlock`: text with optional citations
- `ThinkingBlock`: thinking with signature
- `RedactedThinkingBlock`: redacted thinking data
- `ToolUseBlock`: tool call with id, name, input
- `ServerToolUseBlock`: server-side tool use
- `WebSearchToolResultBlock`: web search results

## Token Counting

**POST** `/v1/messages/count_tokens`

```json
{"messages": [{"role": "user", "content": "Hello, Claude"}]}
```

Response: `{"input_tokens": 10}`

## Key Notes

- Consecutive same-role turns are combined
- Maximum 100,000 messages per request
- Results not fully deterministic even with temperature 0.0
- Thinking tokens count toward max_tokens
- Claude Opus 4.6 does not support prefilling assistant messages
