---
title: "Tool Use Guide"
source_url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use"
source_type: "web-extracted"
fetched_at: "2026-01-04T05:55:00Z"
category: "api"
---

# Tool Use with Claude

Claude can interact with tools and functions, extending its capabilities to perform a wider variety of tasks.

## Types of Tools

1. **Client tools**: Execute on your systems
   - User-defined custom tools
   - Anthropic-defined tools (computer use, text editor)

2. **Server tools**: Execute on Anthropic's servers
   - Web search
   - Web fetch

## How It Works

### Client Tools

1. **Provide tools and prompt**: Define tools with names, descriptions, and input schemas
2. **Claude decides to use a tool**: Returns `stop_reason: "tool_use"`
3. **Execute and return results**: Run the tool, return `tool_result`
4. **Claude formulates response**: Uses tool results for final answer

### Server Tools

1. **Provide tools and prompt**: Specify server tools like web search
2. **Claude executes the tool**: Results automatically incorporated
3. **Claude formulates response**: Uses results for final answer

## Defining Tools

```json
{
  "tools": [
    {
      "name": "get_weather",
      "description": "Get the current weather in a given location",
      "input_schema": {
        "type": "object",
        "properties": {
          "location": {
            "type": "string",
            "description": "The city and state, e.g. San Francisco, CA"
          }
        },
        "required": ["location"]
      }
    }
  ]
}
```

## Example Request

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "name": "get_weather",
            "description": "Get the current weather",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {"type": "string"}
                },
                "required": ["location"]
            }
        }
    ],
    messages=[{"role": "user", "content": "What's the weather in SF?"}]
)
```

## Tool Response

```json
{
  "type": "tool_use",
  "id": "toolu_01D7FLrfh4GYq7yT1ULFeyMV",
  "name": "get_weather",
  "input": {"location": "San Francisco, CA"}
}
```

## Providing Tool Results

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01D7FLrfh4GYq7yT1ULFeyMV",
      "content": "Currently 65F and sunny"
    }
  ]
}
```

## Tool Choice Control

```json
{
  "tool_choice": {
    "type": "auto"  // or "any", "none", {"type": "tool", "name": "..."}
  }
}
```

Options:
- `auto`: Let Claude decide (default)
- `any`: Force tool use
- `none`: Prevent tool use
- `tool`: Force specific tool

## Parallel Tool Use

Claude can call multiple tools in a single response. All tool results must be returned in one user message.

```json
{
  "tool_choice": {
    "type": "auto",
    "disable_parallel_tool_use": true  // Optional
  }
}
```

## Sequential Tools

Chain tools together by returning results and letting Claude call the next tool.

Example flow:
1. User asks "What's the weather where I am?"
2. Claude calls `get_location`
3. You return location result
4. Claude calls `get_weather` with that location
5. You return weather result
6. Claude gives final answer

## Structured Outputs (Strict Mode)

Guarantee schema conformance:

```json
{
  "tools": [
    {
      "name": "get_data",
      "strict": true,
      "input_schema": {...}
    }
  ]
}
```

## MCP Tools

Convert MCP tools to Claude format:

```python
async def get_claude_tools(mcp_session):
    mcp_tools = await mcp_session.list_tools()
    return [
        {
            "name": tool.name,
            "description": tool.description or "",
            "input_schema": tool.inputSchema  # Rename to input_schema
        }
        for tool in mcp_tools.tools
    ]
```

## Built-in Tools

### Web Search
```json
{"type": "web_search_20250305", "name": "web_search", "max_uses": 5}
```

### Web Fetch
```json
{"type": "web_fetch_20250305", "name": "web_fetch"}
```

### Computer Use
```json
{"type": "computer_20250124", "name": "computer"}
```

### Text Editor
```json
{"type": "text_editor_20250124", "name": "str_replace_editor"}
```

## Pricing

Tool use adds tokens from:
- Tool definitions (names, descriptions, schemas)
- `tool_use` blocks in responses
- `tool_result` blocks in requests

Server tools may incur additional charges based on usage.

## Best Practices

1. Write clear, detailed tool descriptions
2. Use specific input schemas with descriptions
3. Handle missing parameters gracefully
4. Validate tool inputs before execution
5. Return structured, parseable results
6. Use chain-of-thought prompting for complex decisions
