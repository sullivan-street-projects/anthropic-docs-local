---
title: "Messages API"
source_url: "https://docs.anthropic.com/en/api/messages"
source_type: "web-extracted"
fetched_at: "2026-01-04T05:55:00Z"
category: "api"
---

# Messages API Documentation

The Messages API is the core interface for interacting with Claude models. It supports single queries and stateless multi-turn conversations.

## Endpoint

**POST** `/v1/messages`

## Required Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `model` | string | Model ID (e.g., `claude-sonnet-4-5-20250929`) |
| `max_tokens` | number | Maximum tokens to generate |
| `messages` | array | Array of message objects |

## Message Structure

```json
{
  "role": "user",
  "content": "Hello, Claude"
}
```

Content can be a string or array of content blocks (text, images, documents).

## Optional Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `system` | string/array | - | System prompt |
| `temperature` | number | 1.0 | Randomness (0.0-1.0) |
| `top_p` | number | - | Nucleus sampling |
| `top_k` | number | - | Top-K sampling |
| `stop_sequences` | array | - | Custom stop sequences |
| `stream` | boolean | false | Enable streaming |
| `tools` | array | - | Tool definitions |
| `tool_choice` | object | - | Tool usage control |
| `thinking` | object | - | Extended thinking config |

## Example Request

```bash
curl https://api.anthropic.com/v1/messages \
  -H 'Content-Type: application/json' \
  -H 'anthropic-version: 2023-06-01' \
  -H "X-Api-Key: $ANTHROPIC_API_KEY" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Hello, Claude"}
    ]
  }'
```

## Response Format

```json
{
  "id": "msg_...",
  "type": "message",
  "role": "assistant",
  "content": [
    {"type": "text", "text": "Response text"}
  ],
  "model": "claude-sonnet-4-5-20250929",
  "stop_reason": "end_turn",
  "usage": {
    "input_tokens": 10,
    "output_tokens": 20
  }
}
```

## Stop Reasons

| Reason | Description |
|--------|-------------|
| `end_turn` | Natural stopping point |
| `max_tokens` | Token limit reached |
| `stop_sequence` | Hit custom stop sequence |
| `tool_use` | Model invoked a tool |

## Multi-turn Conversations

```json
{
  "messages": [
    {"role": "user", "content": "Hello"},
    {"role": "assistant", "content": "Hi! How can I help?"},
    {"role": "user", "content": "Explain LLMs"}
  ]
}
```

## Content Block Types

### Text
```json
{"type": "text", "text": "Hello"}
```

### Images (Base64)
```json
{
  "type": "image",
  "source": {
    "type": "base64",
    "media_type": "image/jpeg",
    "data": "base64_string"
  }
}
```

### Images (URL)
```json
{
  "type": "image",
  "source": {
    "type": "url",
    "url": "https://example.com/image.jpg"
  }
}
```

### Documents (PDF)
```json
{
  "type": "document",
  "source": {
    "type": "base64",
    "media_type": "application/pdf",
    "data": "base64_pdf"
  }
}
```

## Token Counting

**POST** `/v1/messages/count_tokens`

```json
{
  "model": "claude-sonnet-4-5-20250929",
  "messages": [{"role": "user", "content": "Hello"}]
}
```

Response: `{"input_tokens": 10}`

## Batch Processing

**POST** `/v1/messages/batches`

Process multiple requests asynchronously at 50% cost.

```json
{
  "requests": [
    {
      "custom_id": "request-1",
      "params": {
        "model": "claude-sonnet-4-5-20250929",
        "max_tokens": 1024,
        "messages": [{"role": "user", "content": "First request"}]
      }
    }
  ]
}
```

## Extended Thinking

```json
{
  "thinking": {
    "type": "enabled",
    "budget_tokens": 2048
  }
}
```

## Prompt Caching

```json
{
  "type": "text",
  "text": "Large prompt",
  "cache_control": {"type": "ephemeral", "ttl": "5m"}
}
```

## Best Practices

1. Use `count_tokens` before requests to budget tokens
2. Provide clear system prompts
3. Use 0.0 temperature for analytical tasks
4. Implement retry logic for rate limits
5. Use caching for large reusable contexts
6. Use batches for non-urgent bulk processing
