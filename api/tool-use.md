---
title: "Tool Use Guide"
source_url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview"
source_type: "web-extracted"
fetched_at: "2026-03-10T00:00:00Z"
category: "api"
---

# Tool Use with Claude

Claude can interact with tools and functions, extending its capabilities to perform tasks such as searching the web, executing code, and interacting with external APIs. Each tool defines a contract: you specify what operations are available and what they return; Claude decides when and how to call them. Tool access is one of the highest-leverage primitives you can give an agent. On benchmarks like LAB-Bench FigQA (scientific figure interpretation) and SWE-bench (real-world software engineering), adding even simple tools produces outsized capability gains, often surpassing human expert baselines.

## Tool Types

Claude supports two categories of tools:

### 1. Client Tools

Tools that execute on your infrastructure. You define them, handle invocations, and return results to Claude.

**Sub-types:**

- **User-defined tools**: Custom tools you create with names, descriptions, and JSON schemas.
- **Anthropic-defined tools requiring client implementation**: Tools like computer use, text editor, and bash that have Anthropic-specified schemas but run on your side.

**4-step workflow:**

1. **Provide tools and prompt**: Define tools with names, descriptions, and input schemas alongside the user message.
2. **Claude decides to use a tool**: The response contains a `tool_use` content block and `stop_reason: "tool_use"`.
3. **Execute the tool**: Run the tool on your side and return results in a `tool_result` content block.
4. **Claude responds**: Claude incorporates the tool result into its final response.

### 2. Server Tools

Tools that execute on Anthropic's servers. No client-side implementation is required.

- **Web Search** (`web_search_20260209`): Searches the web and returns results.
- **Web Fetch** (`web_fetch_20260209`): Fetches content from URLs.

**Server tool workflow:**

1. Provide server tools and the user prompt.
2. Claude executes the server tool automatically within a sampling loop (default **10 iterations**).
3. Results are incorporated directly into the response.

If the server-side loop reaches 10 iterations without completion, the API returns `stop_reason: "pause_turn"`. To continue, send the response back as an assistant message followed by a user message to resume.

## Tool Definition

Define tools using JSON Schema for the input parameters:

```json
{
  "tools": [
    {
      "name": "get_weather",
      "description": "Get the current weather in a given location. Returns temperature, conditions, humidity, and wind speed.",
      "input_schema": {
        "type": "object",
        "properties": {
          "location": {
            "type": "string",
            "description": "City and state/country, e.g. 'San Francisco, CA' or 'London, UK'"
          },
          "unit": {
            "type": "string",
            "enum": ["celsius", "fahrenheit"],
            "description": "Temperature unit (default: fahrenheit)"
          }
        },
        "required": ["location"]
      }
    }
  ]
}
```

### Strict Tool Use (Structured Outputs)

Add `strict: true` to a tool definition to guarantee that Claude's tool call input exactly matches the JSON Schema. This enables structured outputs for tool use:

```json
{
  "name": "get_weather",
  "description": "Get the weather for a location",
  "strict": true,
  "input_schema": {
    "type": "object",
    "properties": {
      "location": {"type": "string"},
      "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
    },
    "required": ["location", "unit"],
    "additionalProperties": false
  }
}
```

When `strict: true` is set, the schema must have `additionalProperties: false` and all properties should be listed in `required`.

## Complete Tool Use Example

### Python

```python
import anthropic
import json

client = anthropic.Anthropic()

tools = [
    {
        "name": "get_weather",
        "description": "Get the current weather in a given location",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {"type": "string", "description": "City and state, e.g. San Francisco, CA"}
            },
            "required": ["location"]
        }
    }
]

# Step 1: Send the initial request
response = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=1024,
    tools=tools,
    messages=[{"role": "user", "content": "What's the weather in San Francisco?"}]
)

# Step 2: Check if Claude wants to use a tool
if response.stop_reason == "tool_use":
    tool_use = next(block for block in response.content if block.type == "tool_use")

    # Step 3: Execute the tool (your implementation)
    weather_data = get_weather(tool_use.input["location"])

    # Step 4: Send tool result back to Claude
    final_response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=1024,
        tools=tools,
        messages=[
            {"role": "user", "content": "What's the weather in San Francisco?"},
            {"role": "assistant", "content": response.content},
            {
                "role": "user",
                "content": [
                    {
                        "type": "tool_result",
                        "tool_use_id": tool_use.id,
                        "content": json.dumps(weather_data)
                    }
                ]
            }
        ]
    )
    print(final_response.content[0].text)
```

### TypeScript

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const tools: Anthropic.Tool[] = [
  {
    name: "get_weather",
    description: "Get the current weather in a given location",
    input_schema: {
      type: "object" as const,
      properties: {
        location: { type: "string", description: "City and state, e.g. San Francisco, CA" }
      },
      required: ["location"]
    }
  }
];

// Step 1: Send the initial request
const response = await client.messages.create({
  model: "claude-opus-4-6",
  max_tokens: 1024,
  tools,
  messages: [{ role: "user", content: "What's the weather in San Francisco?" }]
});

// Step 2: Check if Claude wants to use a tool
if (response.stop_reason === "tool_use") {
  const toolUse = response.content.find((block) => block.type === "tool_use");

  // Step 3: Execute the tool
  const weatherData = await getWeather(toolUse.input.location);

  // Step 4: Send tool result back
  const finalResponse = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 1024,
    tools,
    messages: [
      { role: "user", content: "What's the weather in San Francisco?" },
      { role: "assistant", content: response.content },
      {
        role: "user",
        content: [
          {
            type: "tool_result",
            tool_use_id: toolUse.id,
            content: JSON.stringify(weatherData)
          }
        ]
      }
    ]
  });
  console.log(finalResponse.content[0].text);
}
```

## Using MCP Tools

Convert MCP (Model Context Protocol) tool definitions for use with the Messages API by renaming `inputSchema` to `input_schema`:

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

You can also use the MCP connector to connect directly to remote MCP servers without implementing a local client.

## Tool Choice

Control how Claude selects tools:

```json
{"tool_choice": {"type": "auto"}}
```

```json
{"tool_choice": {"type": "any"}}
```

```json
{"tool_choice": {"type": "tool", "name": "get_weather"}}
```

```json
{"tool_choice": {"type": "none"}}
```

| Type | Behavior |
|:-----|:---------|
| `auto` | Claude decides whether to use a tool (default) |
| `any` | Claude must use one of the provided tools |
| `tool` | Claude must use the specific named tool |
| `none` | Claude will not use any tools |

Set `disable_parallel_tool_use: true` within `tool_choice` to force Claude to use at most one tool per response.

## Parallel Tool Use

When multiple operations are independent, Claude can call multiple tools in a single response. All `tool_use` blocks appear in one assistant message. You must return all corresponding `tool_result` blocks in a single user message:

```json
{
  "role": "user",
  "content": [
    {"type": "tool_result", "tool_use_id": "toolu_01AAA", "content": "72°F, sunny"},
    {"type": "tool_result", "tool_use_id": "toolu_01BBB", "content": "45°F, cloudy"}
  ]
}
```

## Sequential Tool Use (Chaining)

For dependent operations where the output of one tool feeds into another, Claude calls tools one at a time across multiple turns. Each turn uses the previous tool's result as context for the next call.

## Missing Information Handling

- **Claude Opus** models are more likely to ask clarifying questions when required parameters are missing.
- **Claude Sonnet** models may attempt to infer values from context.
- Use chain-of-thought prompting to improve parameter assessment accuracy.

## Built-in Tools

### Anthropic-defined tools (versioned types)

| Tool | Type | Description |
|:-----|:-----|:------------|
| Web Search | `web_search_20260209` | Search the web. Options: `max_uses`, `allowed_domains`, `blocked_domains`, `user_location` |
| Web Fetch | `web_fetch_20260209` | Fetch content from URLs (server-side) |
| Code Execution | `code_execution_20260120` | Secure sandboxed code execution |
| Bash | `bash_20250124` | Execute bash commands (client-side) |
| Text Editor | `text_editor_20250728` | View and edit files. Option: `max_characters` |

```json
{
  "tools": [
    {
      "type": "web_search_20260209",
      "name": "web_search",
      "max_uses": 5,
      "allowed_domains": ["docs.anthropic.com", "github.com"],
      "user_location": {"type": "approximate", "city": "San Francisco", "region": "CA", "country": "US"}
    },
    {
      "type": "text_editor_20250728",
      "name": "text_editor",
      "max_characters": 100000
    },
    {
      "type": "bash_20250124",
      "name": "bash"
    },
    {
      "type": "code_execution_20260120",
      "name": "code_execution"
    }
  ]
}
```

## Pricing

Tool use is priced based on total input and output tokens. Additional token usage comes from:

- The `tools` parameter (tool names, descriptions, and schemas are serialized and counted as input tokens).
- `tool_use` content blocks in both requests and responses.
- `tool_result` content blocks provided by the user.
- A system prompt overhead added automatically for tool use enablement.

### Tool Use System Prompt Token Overhead

The system prompt overhead varies by model and tool choice mode:

| Model | auto / none | any / tool |
|:------|:------------|:-----------|
| Claude Opus 4.6 | 346 tokens | 313 tokens |
| Claude Opus 4.5 | 346 tokens | 313 tokens |
| Claude Sonnet 4.5 | 346 tokens | 313 tokens |
| Claude Haiku 4.5 | 346 tokens | 313 tokens |
| Claude Haiku 3.5 | 264 tokens | 340 tokens |

### Server Tool Pricing

Server-side tools may incur additional usage-based charges beyond standard token pricing. For example, web search is billed per search query performed.

## Best Practices

- **Write detailed descriptions**: Tool and parameter descriptions significantly affect Claude's ability to use tools correctly. Explain when to use the tool, what each parameter means, and any constraints.
- **Use `strict: true`** for critical tools where input validation matters.
- **Handle errors gracefully**: Return clear error messages in `tool_result` blocks so Claude can recover.
- **Limit tool count**: Providing too many tools can reduce quality. Group related functionality and only include tools relevant to the current task.
- **Provide examples**: Include example inputs/outputs in tool descriptions for complex tools.
