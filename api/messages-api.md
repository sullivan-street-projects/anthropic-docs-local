---
title: "Messages API"
source_url: "https://platform.claude.com/docs/en/api/messages"
source_type: "web-extracted"
fetched_at: "2026-03-10T00:00:00Z"
category: "api"
---

# Messages API

**POST** `/v1/messages`

Send structured input messages and receive model-generated responses. The Messages API is the primary interface for interacting with Claude models.

## Authentication

All requests require an API key and version header:

```
x-api-key: $ANTHROPIC_API_KEY
anthropic-version: 2023-06-01
content-type: application/json
```

## Basic Examples

### Python

```python
import anthropic

client = anthropic.Anthropic()

message = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hello, Claude"}
    ]
)
print(message.content[0].text)
```

### TypeScript

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const message = await client.messages.create({
  model: "claude-opus-4-6",
  max_tokens: 1024,
  messages: [
    { role: "user", content: "Hello, Claude" }
  ]
});
console.log(message.content[0].text);
```

### cURL

```bash
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-opus-4-6",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Hello, Claude"}
    ]
  }'
```

## Required Parameters

### `model` (string)

The model to use for the response. Available models:

| Model | Model ID |
|:------|:---------|
| Claude Opus 4.6 | `claude-opus-4-6` |
| Claude Sonnet 4.6 | `claude-sonnet-4-6` |
| Claude Haiku 4.5 | `claude-haiku-4-5` |

Dated model versions (e.g., `claude-opus-4-5-20251101`, `claude-sonnet-4-5-20250929`, `claude-haiku-4-5-20251001`) are also available for pinning to a specific snapshot.

### `max_tokens` (number)

Maximum number of tokens to generate before stopping. The model may stop before reaching this limit if it produces a natural end of turn or hits a stop sequence.

### `messages` (array)

An array of input message objects. Each message has:

- `role` (string, required): Either `"user"` or `"assistant"`.
- `content` (string or array): The message content. Can be a plain string or an array of content blocks.

Messages must alternate between `user` and `assistant` roles. Consecutive same-role messages are automatically combined. The first message must have `role: "user"`.

Maximum of **100,000 messages** per request.

## Content Block Types

### Text Content

```json
{"type": "text", "text": "Hello, Claude"}
```

Optional `cache_control` field for prompt caching.

### Image Content

Supports base64, URL, and Files API sources:

```json
{"type": "image", "source": {"type": "base64", "media_type": "image/jpeg", "data": "<base64>"}}
```

```json
{"type": "image", "source": {"type": "url", "url": "https://example.com/image.jpg"}}
```

```json
{"type": "image", "source": {"type": "file", "file_id": "file_abc123"}}
```

Supported formats: JPEG, PNG, GIF, WebP.

### Document Content

Supports base64, URL, and plain text sources:

```json
{"type": "document", "source": {"type": "base64", "media_type": "application/pdf", "data": "<base64>"}}
```

```json
{"type": "document", "source": {"type": "url", "url": "https://example.com/document.pdf"}}
```

```json
{"type": "document", "source": {"type": "text", "data": "Plain text content..."}}
```

### Tool Use Block

Returned by Claude when invoking a tool:

```json
{"type": "tool_use", "id": "toolu_01A09q90qw90lq917835lq9", "name": "get_stock_price", "input": {"ticker": "^GSPC"}}
```

### Tool Result Block

Provided by the user after executing a tool:

```json
{"type": "tool_result", "tool_use_id": "toolu_01A09q90qw90lq917835lq9", "content": "259.75 USD"}
```

The `content` field can be a string or an array of content blocks (text, image).

### Thinking Block

Returned when extended thinking is enabled:

```json
{"type": "thinking", "thinking": "Let me analyze this step by step...", "signature": "EqQBCgIYAh..."}
```

### Search Result Block

Returned when web search is used:

```json
{
  "type": "search_result",
  "title": "Example Result",
  "source": "https://example.com",
  "content": [{"type": "text", "text": "Relevant information..."}]
}
```

## Optional Parameters

### `system` (string or array)

System prompt providing context and instructions for the conversation. Can be a plain string or an array of content blocks with optional `cache_control`.

```json
{
  "system": [
    {
      "type": "text",
      "text": "You are a helpful coding assistant.",
      "cache_control": {"type": "ephemeral"}
    }
  ]
}
```

### `temperature` (number, default: 1.0)

Controls randomness of sampling. Range: 0.0 to 1.0.

- `0.0`: More deterministic, best for analytical and factual tasks
- `1.0`: More creative and varied output

### `top_p` (number)

Nucleus sampling threshold. Use either `top_p` or `temperature`, not both.

### `top_k` (number)

Only sample from the top K most likely options at each step.

### `stop_sequences` (array of strings)

Custom sequences that cause the model to stop generating. The stop sequence itself is not included in the response.

### `stream` (boolean)

Enable incremental streaming of the response using server-sent events (SSE). See the Streaming documentation for details.

### `metadata` (object)

- `user_id` (string): An external identifier for the user making the request. Used for abuse detection. Do not include PII.

### `inference_geo` (string)

Geographic region for inference processing (e.g., `"us"`). Falls back to workspace default if not specified.

### `service_tier` (string)

- `"auto"`: Use priority capacity if available, fall back to standard.
- `"standard_only"`: Only use standard capacity.

### `container` (object)

Container configuration for sandboxed code execution environments.

## Extended Thinking

Extended thinking allows Claude to perform step-by-step reasoning before responding.

```json
{
  "thinking": {"type": "enabled", "budget_tokens": 10000}
}
```

```json
{
  "thinking": {"type": "disabled"}
}
```

```json
{
  "thinking": {"type": "adaptive"}
}
```

**Configuration details:**

- `"enabled"`: Thinking is always active. Requires `budget_tokens` (minimum 1024).
- `"disabled"`: Thinking is turned off.
- `"adaptive"`: Claude decides whether to use thinking on a per-request basis. Recommended for Claude Opus 4.6.
- `budget_tokens` must be less than `max_tokens`.
- Thinking tokens count toward `max_tokens`.
- When thinking is enabled, `temperature` must be set to 1.0 (default).

## Output Configuration

Control the output format and effort level:

```json
{
  "output_config": {
    "format": {
      "type": "json_schema",
      "schema": {
        "type": "object",
        "properties": {
          "answer": {"type": "string"},
          "confidence": {"type": "number"}
        },
        "required": ["answer", "confidence"]
      }
    },
    "effort": "high"
  }
}
```

**Effort levels:**

| Level | Description |
|:------|:------------|
| `"low"` | Minimal processing, fastest response |
| `"medium"` | Balanced processing |
| `"high"` | Thorough processing (default) |
| `"max"` | Maximum effort, most thorough |

## Tool Use

Define tools that Claude can invoke during the conversation:

```json
{
  "tools": [
    {
      "name": "get_weather",
      "description": "Get the current weather for a given location",
      "input_schema": {
        "type": "object",
        "properties": {
          "location": {"type": "string", "description": "City and state, e.g. San Francisco, CA"}
        },
        "required": ["location"]
      }
    }
  ],
  "tool_choice": {"type": "auto", "disable_parallel_tool_use": false}
}
```

**Tool choice types:**

- `"auto"`: Claude decides whether to use a tool (default).
- `"any"`: Claude must use one of the provided tools.
- `"tool"`: Claude must use the specific tool named in `name`.
- `"none"`: Claude will not use any tools.

### Built-in Tools

Built-in tools are versioned and specified by `type` rather than `name` and `input_schema`:

| Tool | Type | Description |
|:-----|:-----|:------------|
| Web Search | `web_search_20260209` | Search the web for information. Options: `max_uses`, `allowed_domains`, `blocked_domains`, `user_location` |
| Web Fetch | `web_fetch_20260209` | Fetch content from URLs. Server-side execution |
| Code Execution | `code_execution_20260120` | Sandboxed code execution environment |
| Bash | `bash_20250124` | Execute bash commands |
| Text Editor | `text_editor_20250728` | File viewing and editing. Option: `max_characters` |

```json
{
  "tools": [
    {"type": "web_search_20260209", "name": "web_search", "max_uses": 5},
    {"type": "text_editor_20250728", "name": "text_editor"}
  ]
}
```

## Cache Control

Enable prompt caching to reduce costs for repeated context:

```json
{"cache_control": {"type": "ephemeral", "ttl": "5m"}}
```

**TTL options:**

- `"5m"` (default): 5-minute cache lifetime
- `"1h"`: 1-hour cache lifetime

Cache control can be applied to system prompts, messages, tool definitions, and images.

## Response Format

```json
{
  "id": "msg_01XFDUDYJgAACzvnptvVoYEL",
  "type": "message",
  "role": "assistant",
  "model": "claude-opus-4-6",
  "content": [
    {"type": "text", "text": "Hello! How can I help you today?"}
  ],
  "stop_reason": "end_turn",
  "stop_sequence": null,
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

| Reason | Description |
|:-------|:------------|
| `"end_turn"` | Natural stopping point reached |
| `"max_tokens"` | Reached the `max_tokens` limit |
| `"stop_sequence"` | Hit a custom stop sequence |
| `"tool_use"` | Model invoked one or more client tools |
| `"pause_turn"` | Long-running server tool loop paused (exceeded iteration limit) |
| `"refusal"` | Content policy violation detected |

### Response Content Block Types

| Block Type | Description |
|:-----------|:------------|
| `TextBlock` | Text output, optionally with citations |
| `ThinkingBlock` | Extended thinking content with cryptographic signature |
| `RedactedThinkingBlock` | Thinking block redacted for policy reasons |
| `ToolUseBlock` | Client tool invocation with `id`, `name`, `input` |
| `ServerToolUseBlock` | Server-side tool invocation (web search, web fetch) |
| `WebSearchToolResultBlock` | Results from web search tool |

## Token Counting

**POST** `/v1/messages/count_tokens`

Count tokens for a request without generating a response:

```python
response = client.messages.count_tokens(
    model="claude-opus-4-6",
    messages=[{"role": "user", "content": "Hello, Claude"}]
)
print(response.input_tokens)  # 10
```

```json
{
  "model": "claude-opus-4-6",
  "messages": [{"role": "user", "content": "Hello, Claude"}]
}
```

Response:

```json
{"input_tokens": 10}
```

The token counting endpoint accepts the same parameters as the Messages API (including `system`, `tools`, etc.) and returns the total input token count.

## Key Notes

- Consecutive same-role turns are automatically combined.
- Maximum **100,000 messages** per request.
- Results are not fully deterministic even with `temperature: 0.0`.
- Thinking tokens count toward `max_tokens`.
- **Claude Opus 4.6 does not support prefilling assistant messages.** For earlier models, you can prefill by ending the `messages` array with a partial `assistant` message.
- When using extended thinking, the `temperature` parameter must remain at the default value of 1.0.
- The `anthropic-version` header must be set to `2023-06-01` or later.
