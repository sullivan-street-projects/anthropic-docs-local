---
title: "Web Search Tool"
source_url: "https://platform.claude.com/docs/en/docs/agents-and-tools/tool-use/web-search-tool"
source_type: "web-extracted"
fetched_at: "2026-06-28T00:00:00Z"
category: "api"
---

# Web Search Tool

The web search tool gives Claude direct access to real-time web content, allowing it to answer questions with up-to-date information beyond its knowledge cutoff. The response includes citations for sources drawn from search results.

## Tool Versions

- **`web_search_20260318`** (latest): Supports **dynamic filtering** with Claude Fable 5, Claude Opus 4.8, Claude Mythos 5, Claude Mythos Preview, Claude Opus 4.7, Claude Opus 4.6, and Claude Sonnet 4.6. Also adds **response inclusion** control for agentic workflows.
- **`web_search_20260209`**: Dynamic filtering without response inclusion control.
- **`web_search_20250305`**: Basic web search without dynamic filtering.

For Claude Mythos Preview, web search is supported on the Claude API, Google Cloud, and Microsoft Foundry. Web search is not available for Mythos Preview on Amazon Bedrock or Claude Platform on AWS.

## Supported Models

All current Claude models: Opus 4.8, Opus 4.7, Opus 4.6, Opus 4.5, Opus 4.1, Opus 4, Sonnet 4.6, Sonnet 4.5, Sonnet 4, Haiku 4.5, Fable 5, Mythos 5, Mythos Preview.

## How Web Search Works

When you add the web search tool to your API request:

1. Claude decides when to search based on the prompt.
2. The API executes the searches and provides Claude with the results. This process may repeat multiple times throughout a single request.
3. At the end of its turn, Claude provides a final response with cited sources.

### When Claude Searches

Claude searches when the request depends on information that is current, changing, or outside its training data:

- Recent events, news, or announcements
- Current prices, rates, scores, or statistics
- Information about specific organizations, people, or products that might have changed
- Explicit requests to search or look something up

Claude answers directly without searching when the request draws on stable knowledge:

- Established facts, math, science fundamentals, or coding concepts
- Creative writing or brainstorming
- Analysis of content already provided in the conversation
- Conversational turns and greetings

Triggering is steerable through your system prompt. For a hard constraint, use `max_uses` to cap the number of searches per request.

### Dynamic Filtering

Web search is a token-intensive task. With basic web search, Claude needs to pull search results into context, fetch full HTML from multiple websites, and reason over all of it before arriving at an answer.

With `web_search_20260209` or later, Claude can write and execute code to post-process query results. Instead of reasoning over full HTML files, Claude dynamically filters search results before loading them into context, keeping only what's relevant and discarding the rest.

Dynamic filtering requires the code execution tool to be enabled. Effective for:

- Searching through technical documentation
- Literature review and citation verification
- Technical research
- Response grounding and verification

Dynamic filtering is available on the Claude API, Claude Platform on AWS, and Microsoft Foundry. On Google Cloud, only basic web search (without dynamic filtering) is available. Web search is not available on Amazon Bedrock.

## Usage

```python
import anthropic
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    messages=[{"role": "user", "content": "What's the weather in NYC?"}],
    tools=[{"type": "web_search_20250305", "name": "web_search", "max_uses": 5}],
)
```

### Dynamic Filtering Example

```python
response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Search for the current prices of AAPL and GOOGL, then calculate which has a better P/E ratio.",
        }
    ],
    tools=[{"type": "web_search_20260209", "name": "web_search"}],
)
```

## Tool Definition

The web search tool supports the following parameters:

```json
{
  "type": "web_search_20250305",
  "name": "web_search",
  "max_uses": 5,
  "allowed_domains": ["example.com", "trusteddomain.org"],
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

### Max Uses

The `max_uses` parameter limits the number of searches performed. Simple factual queries typically use 1-3 searches; comparative or multi-entity research can use 10 or more. For latency-sensitive lookups, `max_uses: 3` bounds cost while rarely truncating. For research agents, set `max_uses` to 15-20 or omit it entirely.

### Domain Filtering

- Domains should not include HTTP/HTTPS scheme
- Subdomains are automatically included
- Subpaths are supported
- Use either `allowed_domains` or `blocked_domains`, not both
- Single wildcard (`*`) supported in path portion only

### Localization

The `user_location` parameter allows you to localize search results:

- `type`: The type of location (must be `approximate`)
- `city`: The city name
- `region`: The region or state
- `country`: The country
- `timezone`: The IANA timezone ID

### Response Inclusion

Requires `web_search_20260318` or later. The `response_inclusion` parameter controls how search result blocks appear in the API response when the result was consumed by a completed code execution call in the same turn. Set `"response_inclusion": "excluded"` to drop consumed result block pairs from the response, reducing output token costs for agentic workflows. Default is `"full"`.

```json
{
  "tools": [
    {
      "type": "web_search_20260318",
      "name": "web_search",
      "response_inclusion": "excluded"
    }
  ]
}
```

## Response

Example response structure:

```json
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I'll search for when Claude Shannon was born."
    },
    {
      "type": "server_tool_use",
      "id": "srvtoolu_01WYG3ziw53XMcoyKL4XcZmE",
      "name": "web_search",
      "input": {
        "query": "claude shannon birth date"
      }
    },
    {
      "type": "web_search_tool_result",
      "tool_use_id": "srvtoolu_01WYG3ziw53XMcoyKL4XcZmE",
      "content": [
        {
          "type": "web_search_result",
          "url": "https://en.wikipedia.org/wiki/Claude_Shannon",
          "title": "Claude Shannon - Wikipedia",
          "encrypted_content": "EqgfCioIARgBIiQ3YTAwMjY1Mi1mZjM5LTQ1NGUtODgxNC1kNjNjNTk1ZWI3Y...",
          "page_age": "April 30, 2025"
        }
      ]
    },
    {
      "text": "Claude Shannon was born on April 30, 1916, in Petoskey, Michigan",
      "type": "text",
      "citations": [
        {
          "type": "web_search_result_location",
          "url": "https://en.wikipedia.org/wiki/Claude_Shannon",
          "title": "Claude Shannon - Wikipedia",
          "encrypted_index": "Eo8BCioIAhgBIiQyYjQ0OWJmZi1lNm..",
          "cited_text": "Claude Elwood Shannon (April 30, 1916 - February 24, 2001) was an American mathematician..."
        }
      ]
    }
  ],
  "usage": {
    "input_tokens": 6039,
    "output_tokens": 931,
    "server_tool_use": {
      "web_search_requests": 1
    }
  },
  "stop_reason": "end_turn"
}
```

### Search Results

Search results include:
- `url`: The URL of the source page
- `title`: The title of the source page
- `page_age`: When the site was last updated
- `encrypted_content`: Encrypted content for multi-turn citation continuity

### Citations

Always enabled for web search. Each `web_search_result_location` includes:
- `url`: The URL of the cited source
- `title`: The title of the cited source
- `encrypted_index`: Reference for multi-turn conversations
- `cited_text`: Up to 150 characters of the cited content

Citation fields `cited_text`, `title`, and `url` do not count towards token usage.

### Errors

When the web search tool encounters an error, the Claude API still returns a 200 (success) response with the error in the response body:

```json
{
  "type": "web_search_tool_result",
  "tool_use_id": "srvtoolu_a93jad",
  "content": {
    "type": "web_search_tool_result_error",
    "error_code": "max_uses_exceeded"
  }
}
```

Possible error codes:
- `too_many_requests`: Rate limit exceeded
- `invalid_input`: Invalid search query parameter
- `max_uses_exceeded`: Maximum web search tool uses exceeded
- `query_too_long`: Query exceeds maximum length
- `unavailable`: An internal error occurred

## Pricing

$10 per 1,000 searches, plus standard token costs for search-generated content. Search results count as input tokens, both in search iterations during a single turn and in subsequent conversation turns. Each web search counts as one use regardless of results returned. Failed searches are not billed.

## Features

- Works with prompt caching
- Supports streaming
- Available in Batch API (throttled per organization for shared capacity)
- ZDR eligible (see server tools documentation for `allowed_callers` workaround)
- `pause_turn` stop reason supported (see server tools documentation)
