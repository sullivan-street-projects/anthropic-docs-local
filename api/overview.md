---
title: "API Overview"
source_url: "https://platform.claude.com/docs/en/api/overview"
source_type: "web-extracted"
fetched_at: "2026-03-15T00:00:00Z"
category: "api"
---

# API Overview

The Claude API is a RESTful API at `https://api.anthropic.com` that provides programmatic access to Claude models. The primary API is the Messages API (`POST /v1/messages`) for conversational interactions.

## Prerequisites

To use the Claude API, you'll need:

- An [Anthropic Console account](https://platform.claude.com)
- An [API key](https://platform.claude.com/settings/keys)

For step-by-step setup instructions, see [Get started](https://platform.claude.com/docs/en/get-started).

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

### Getting API Keys

The API is made available via the web [Console](https://platform.claude.com). You can use the [Workbench](https://platform.claude.com/workbench) to try out the API in the browser and then generate API keys in [Account Settings](https://platform.claude.com/settings/keys). Use [workspaces](https://platform.claude.com/settings/workspaces) to segment your API keys and control spend by use case.

## Client SDKs

Official SDKs are available in 7 languages:

| SDK | Status | Install Command |
|:----|:-------|:----------------|
| Python | GA | `pip install anthropic` |
| TypeScript | GA | `npm install @anthropic-ai/sdk` |
| Java | GA | Maven/Gradle: `com.anthropic:anthropic-java` |
| Go | GA | `go get github.com/anthropics/anthropic-sdk-go` |
| Ruby | GA | `bundler add anthropic` |
| C# | Beta | `dotnet add package Anthropic` |
| PHP | Beta | `composer require anthropic-ai/sdk` |

**Benefits:**
- Automatic header management (x-api-key, anthropic-version, content-type)
- Type-safe request and response handling
- Built-in retry logic and error handling
- Streaming support
- Request timeouts and connection management

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

### Claude API

- **Direct access** to the latest models and features first
- **Anthropic billing and support**
- **Best for**: New integrations, full feature access, direct relationship with Anthropic

### Third-Party Platform APIs

Access Claude through AWS, Google Cloud, or Microsoft Azure:
- **Integrated** with cloud provider billing and IAM
- **May have feature delays** or differences from the direct API
- **Best for**: Existing cloud commitments, specific compliance requirements, consolidated cloud billing

| Platform | Provider | Best For |
|----------|----------|----------|
| Claude API | Anthropic | Direct access, latest features first |
| Amazon Bedrock | AWS | Existing AWS commitments, consolidated billing |
| Vertex AI | Google Cloud | GCP integrations |
| Azure AI (Foundry) | Microsoft | Azure ecosystem |

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
