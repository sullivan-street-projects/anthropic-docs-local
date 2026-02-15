---
title: "Python SDK README"
source_url: "https://raw.githubusercontent.com/anthropics/anthropic-sdk-python/main/README.md"
source_type: "github-raw"
fetched_at: "2026-02-14T00:00:00Z"
category: "sdks"
---

# Anthropic Python API library

[![PyPI version](https://img.shields.io/pypi/v/anthropic.svg?label=pypi%20(stable))](https://pypi.org/project/anthropic/)

The Anthropic Python library provides convenient access to the Anthropic REST API from any Python 3.9+ application. It includes type definitions for all request params and response fields, and offers both synchronous and asynchronous clients powered by [httpx](https://github.com/encode/httpx).

## Documentation

The REST API documentation can be found on [docs.anthropic.com](https://docs.anthropic.com/claude/reference/). The full API of this library can be found in [api.md](api.md).

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

## Async Usage

```python
import asyncio
from anthropic import AsyncAnthropic

client = AsyncAnthropic()

async def main():
    message = await client.messages.create(
        model="claude-sonnet-4-5-20250929",
        max_tokens=1024,
        messages=[{"role": "user", "content": "Hello, Claude"}]
    )
    print(message.content)

asyncio.run(main())
```

### With aiohttp

For improved concurrency performance:

```bash
pip install anthropic[aiohttp]
```

```python
from anthropic import DefaultAioHttpClient, AsyncAnthropic

async with AsyncAnthropic(http_client=DefaultAioHttpClient()) as client:
    message = await client.messages.create(...)
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

## Tool Helpers

```python
from anthropic import Anthropic, beta_tool

@beta_tool
def get_weather(location: str) -> str:
    """Get the weather for a location."""
    return f"Weather in {location}: Sunny, 68F"

client = Anthropic()
runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    tools=[get_weather],
    messages=[{"role": "user", "content": "What's the weather in SF?"}],
)
for message in runner:
    print(message)
```

## Token Counting

```python
count = client.messages.count_tokens(
    model="claude-sonnet-4-5-20250929",
    messages=[{"role": "user", "content": "Hello, world"}]
)
print(count.input_tokens)  # 10
```

## Message Batches

```python
await client.messages.batches.create(
    requests=[
        {
            "custom_id": "request-1",
            "params": {
                "model": "claude-sonnet-4-5-20250929",
                "max_tokens": 1024,
                "messages": [{"role": "user", "content": "Hello"}],
            },
        },
    ]
)
```

## Platform Support

- **AWS Bedrock**: `pip install anthropic[bedrock]`
- **Google Vertex**: `pip install anthropic[vertex]`

## Error Handling

| Status Code | Error Type              |
|-------------|-------------------------|
| 400         | `BadRequestError`       |
| 401         | `AuthenticationError`   |
| 403         | `PermissionDeniedError` |
| 404         | `NotFoundError`         |
| 429         | `RateLimitError`        |
| >=500       | `InternalServerError`   |

## Requirements

Python 3.9 or higher.

For more information, see [docs.anthropic.com](https://docs.anthropic.com/).
