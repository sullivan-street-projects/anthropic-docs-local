---
title: "Python SDK README"
source_url: "https://raw.githubusercontent.com/anthropics/anthropic-sdk-python/main/README.md"
source_type: "github-raw"
fetched_at: "2026-01-04T05:43:46Z"
category: "sdks"
---

# Anthropic Python API Library

The Anthropic Python library provides developers with convenient access to Claude through the REST API.

## Core Features

**Installation and Setup**: Install via `pip install anthropic` and configure with an API key, preferably through environment variables using python-dotenv.

**Synchronous and Asynchronous Support**: The library offers both `Anthropic` and `AsyncAnthropic` clients, with identical functionality between them.

## API Capabilities

The library supports several important features:

- **Streaming responses** using Server Side Events (SSE) for real-time message generation
- **Tool helpers** enabling developers to "define and run tools as pure python functions" with automatic execution
- **Message batches** for processing multiple requests efficiently
- **Token counting** to estimate API costs before making requests
- **File uploads** accepting bytes, PathLike instances, or tuples with filename and media type

## Advanced Options

**HTTP Customization**: Developers can override the httpx client for proxy support, custom transports, and advanced functionality configuration.

**Error Handling**: The library provides specific error classes (BadRequestError, AuthenticationError, RateLimitError, etc.) for handling different API responses.

**Retry and Timeout Configuration**: Automatic retries with exponential backoff are enabled by default, with configurable timeout settings.

## Platform Support

Beyond the standard Anthropic API, the library extends to AWS Bedrock and Google Vertex platforms through optional extras (`anthropic[bedrock]` and `anthropic[vertex]`).

**Requirement**: Python 3.9 or higher.

## Installation

```bash
pip install anthropic
```

## Basic Usage

```python
import anthropic

client = anthropic.Anthropic()

message = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hello, Claude"}
    ]
)
print(message.content)
```

## Streaming

```python
with client.messages.stream(
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello"}],
    model="claude-sonnet-4-5-20250929",
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

For more information, see the [official documentation](https://docs.anthropic.com/).
