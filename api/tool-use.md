---
title: "Tool Use Guide"
source_url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview"
source_type: "web-extracted"
fetched_at: "2026-02-16T00:00:00Z"
category: "api"
---

# Tool Use with Claude

Claude can interact with tools and functions, extending its capabilities to perform a wider variety of tasks.

## How Tool Use Works

Claude supports two types of tools:

### 1. Client Tools
Tools that execute on your systems:
- User-defined custom tools you create and implement
- Anthropic-defined tools like computer use and text editor that require client implementation

**Workflow:**
1. Provide Claude with tools and a user prompt (define tools with names, descriptions, and input schemas)
2. Claude decides to use a tool (response has `stop_reason: "tool_use"`)
3. Execute the tool and return results in a `tool_result` content block
4. Claude uses tool result to formulate a response

### 2. Server Tools
Tools that execute on Anthropic's servers (web search, web fetch). No client implementation needed.

**Workflow:**
1. Provide tools and user prompt
2. Claude executes the server tool (up to 10 iterations in sampling loop)
3. Results automatically incorporated into response

**Note:** If the server-side loop reaches 10 iterations, the API returns `stop_reason="pause_turn"`. Continue the conversation by sending the response back.

## Using MCP Tools

Convert MCP tool definitions by renaming `inputSchema` to `input_schema`:

```python
claude_tools = [
    {
        "name": tool.name,
        "description": tool.description or "",
        "input_schema": tool.inputSchema,  # Rename inputSchema to input_schema
    }
    for tool in mcp_tools.tools
]
```

Use the MCP connector to connect directly to remote MCP servers without implementing a client.

## Tool Definition

```json
{
  "tools": [{
    "name": "get_weather",
    "description": "Get the current weather in a given location",
    "input_schema": {
      "type": "object",
      "properties": {
        "location": {"type": "string", "description": "City and state, e.g. San Francisco, CA"}
      },
      "required": ["location"]
    }
  }]
}
```

Add `strict: true` to tool definitions for guaranteed schema validation via Structured Outputs.

## Tool Choice

```json
{"tool_choice": {"type": "auto"}}
{"tool_choice": {"type": "any"}}
{"tool_choice": {"type": "tool", "name": "get_weather"}}
{"tool_choice": {"type": "none"}}
```

Set `disable_parallel_tool_use: true` to limit to one tool per response.

## Parallel Tool Use

Claude can call multiple tools in a single response when operations are independent. All `tool_use` blocks appear in one assistant message; return all `tool_result` blocks in the subsequent user message.

## Sequential Tool Use

For dependent operations, Claude calls tools one at a time, using output from one as input to the next.

## Missing Information

Claude Opus is more likely to ask for missing required parameters. Claude Sonnet may attempt to infer values. Use chain-of-thought prompting to improve parameter assessment.

## Built-in Tools

### Anthropic-defined tools (versioned types):
- **Web Search**: `web_search_20250305` — with `max_uses`, `allowed_domains`, `blocked_domains`, `user_location`
- **Web Fetch**: Server-side URL fetching
- **Text Editor**: `text_editor_20250728` — with optional `max_characters`
- **Bash**: `bash_20250124`
- **Computer Use**: `computer_20250124`
- **Code Execution**: Secure sandboxed code execution (v2 beta)
- **MCP Connector**: Direct connection to remote MCP servers

## Pricing

Tool use is priced based on total input and output tokens. Additional tokens come from:
- The `tools` parameter (names, descriptions, schemas)
- `tool_use` content blocks in requests and responses
- `tool_result` content blocks
- System prompt for tool use enablement

### Tool Use System Prompt Tokens

| Model | auto/none | any/tool |
|:------|:----------|:---------|
| Claude Opus 4.6 | 346 tokens | 313 tokens |
| Claude Opus 4.5 | 346 tokens | 313 tokens |
| Claude Sonnet 4.5 | 346 tokens | 313 tokens |
| Claude Haiku 4.5 | 346 tokens | 313 tokens |
| Claude Haiku 3.5 | 264 tokens | 340 tokens |

Server-side tools may incur additional usage-based charges (e.g., web search charges per search performed).
