---
title: "Web Search Tool"
source_url: "https://platform.claude.com/docs/en/docs/agents-and-tools/tool-use/web-search-tool"
source_type: "web-extracted"
fetched_at: "2026-03-22T00:00:00Z"
category: "api"
---

# Web Search Tool

The web search tool gives Claude direct access to real-time web content, with automatic source citations.

## Tool Versions

- **`web_search_20260209`** (latest): Supports **dynamic filtering** with Opus 4.6 and Sonnet 4.6. Claude writes and executes code to filter search results before loading them into context.
- **`web_search_20250305`**: Basic web search without dynamic filtering.

## Supported Models

All current Claude models: Opus 4.6, Opus 4.5, Opus 4.1, Opus 4, Sonnet 4.6, Sonnet 4.5, Sonnet 4, Haiku 4.5.

## How It Works

1. Claude decides when to search based on the prompt
2. The API executes searches and provides results
3. Claude responds with cited sources

## Dynamic Filtering (v20260209)

With `web_search_20260209`, Claude can post-process query results using code execution. Instead of reasoning over full HTML, Claude dynamically filters results before loading into context.

Requires code execution tool to be enabled. Effective for:
- Technical documentation search
- Literature review and citation verification
- Technical research
- Response grounding and verification

## Usage

```python
import anthropic
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=1024,
    messages=[{"role": "user", "content": "What's the weather in NYC?"}],
    tools=[{"type": "web_search_20250305", "name": "web_search", "max_uses": 5}],
)
```

## Tool Parameters

```json
{
  "type": "web_search_20250305",
  "name": "web_search",
  "max_uses": 5,
  "allowed_domains": ["example.com"],
  "blocked_domains": ["untrustedsource.com"],
  "user_location": {
    "type": "approximate",
    "city": "San Francisco",
    "region": "California",
    "country": "US",
    "timezone": "America/Los_Angeles"
  }
}
```

## Domain Filtering

- Domains should not include HTTP/HTTPS scheme
- Subdomains are automatically included
- Subpaths are supported
- Use either `allowed_domains` or `blocked_domains`, not both
- Single wildcard (`*`) supported in path portion only

## Pricing

$10 per 1,000 searches, plus standard token costs for search-generated content. Search results count as input tokens. Failed searches are not billed.

## Citations

Always enabled for web search. Each citation includes URL, title, encrypted_index, and up to 150 characters of cited_text. Citation fields do not count toward token usage.

## Features

- Works with prompt caching
- Supports streaming
- Available in Batch API
- ZDR eligible
