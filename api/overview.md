---
title: "API Overview"
source_url: "https://platform.claude.com/docs/en/api/overview"
source_type: "web-extracted"
fetched_at: "2026-02-16T00:00:00Z"
category: "api"
---

# API Overview

The Claude API is a RESTful API at `https://api.anthropic.com` that provides programmatic access to Claude models. The primary API is the Messages API (`POST /v1/messages`) for conversational interactions.

## Prerequisites

To use the Claude API, you'll need:

- An [Anthropic Console account](https://platform.claude.com)
- An [API key](https://platform.claude.com/settings/keys)

## Available APIs

**General Availability:**
- **Messages API** (`POST /v1/messages`): Send messages to Claude for conversational interactions
- **Message Batches API** (`POST /v1/messages/batches`): Process large volumes of Messages requests asynchronously with 50% cost reduction
- **Token Counting API** (`POST /v1/messages/count_tokens`): Count tokens in a message before sending to manage costs and rate limits
- **Models API** (`GET /v1/models`): List available Claude models and their details

**Beta:**
- **Files API** (`POST /v1/files`, `GET /v1/files`): Upload and manage files for use across multiple API calls
- **Skills API** (`POST /v1/skills`, `GET /v1/skills`): Create and manage custom agent skills

The Messages API supports an optional `inference_geo` parameter for data residency controls, allowing you to specify where model inference runs.

## Authentication

All requests to the Claude API must include these headers:

| Header | Value | Required |
|--------|-------|----------|
| `x-api-key` | Your API key from Console | Yes |
| `anthropic-version` | API version (e.g., `2023-06-01`) | Yes |
| `content-type` | `application/json` | Yes |

SDKs handle these headers automatically.

## Client SDKs

Official SDKs are available for:
- **Python** — GA
- **TypeScript** — GA
- **Java** — GA
- **Go** — GA
- **Ruby** — GA
- **C#** — Beta
- **PHP** — Beta

Example (Python):
```python
from anthropic import Anthropic

client = Anthropic()  # Reads ANTHROPIC_API_KEY from environment
message = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello, Claude"}],
)
```

## Claude API vs Third-Party Platforms

| Platform | Provider | Best For |
|----------|----------|----------|
| Claude API | Anthropic | Direct access, latest features first |
| Amazon Bedrock | AWS | Existing AWS commitments, consolidated billing |
| Vertex AI | Google Cloud | GCP integrations |
| Azure AI | Microsoft | Azure ecosystem |

## Request Size Limits

| Endpoint | Maximum Size |
|----------|--------------|
| Standard endpoints (Messages, Token Counting) | 32 MB |
| Batch API | 256 MB |
| Files API | 500 MB |

## Response Headers

- `request-id`: A globally unique identifier for the request
- `anthropic-organization-id`: The organization ID associated with the API key

## Rate Limits and Availability

The API enforces rate limits organized into usage tiers that increase automatically. Each tier has spend limits (monthly cost cap), RPM (requests per minute), and TPM (tokens per minute). View current limits in Console. Priority Tier with committed spend is available via sales.

## Basic Example

```bash
curl https://api.anthropic.com/v1/messages \
  --header "x-api-key: $ANTHROPIC_API_KEY" \
  --header "anthropic-version: 2023-06-01" \
  --header "content-type: application/json" \
  --data '{
    "model": "claude-opus-4-6",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Hello, Claude"}
    ]
  }'
```

Response:
```json
{
  "id": "msg_01XFDUDYJgAACzvnptvVoYEL",
  "type": "message",
  "role": "assistant",
  "content": [{"type": "text", "text": "Hello! How can I assist you today?"}],
  "model": "claude-opus-4-6",
  "stop_reason": "end_turn",
  "usage": {"input_tokens": 12, "output_tokens": 8}
}
```
