---
title: "Tool Use Guide"
source_url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview"
source_type: "web-extracted"
fetched_at: "2026-08-24T00:00:00Z"
category: "api"
---

# Tool Use with Claude

Tool use lets Claude call functions that you define or that Anthropic provides. Claude determines when to call a tool based on the user's request and the tool's description. It then returns a structured call that your application executes (client tools) or that Anthropic executes (server tools).

## Tool Types

Claude supports two categories of tools:

### 1. Client Tools

Tools that execute on your infrastructure. You define them, handle invocations, and return results to Claude.

**Sub-types:**

- **User-defined tools**: Custom tools you create with names, descriptions, and JSON schemas.
- **Anthropic-schema client tools**: Tools like computer use, text editor, bash, and memory that have Anthropic-specified schemas but run on your side.

**4-step workflow:**

1. **Provide tools and prompt**: Define tools with names, descriptions, and input schemas alongside the user message.
2. **Claude decides to use a tool**: The response contains a `tool_use` content block and `stop_reason: "tool_use"`.
3. **Execute the tool**: Run the tool on your side and return results in a `tool_result` content block.
4. **Claude responds**: Claude incorporates the tool result into its final response.

### 2. Server Tools

Tools that execute on Anthropic's infrastructure. No client-side implementation is required.

- **Web Search** (`web_search_20260209`): Searches the web and returns results.
- **Web Fetch** (`web_fetch_20260209`): Fetches content from URLs.
- **Code Execution** (`code_execution_20260120`): Runs Python and bash code in a sandboxed container.
- **Advisor**: Lets a faster executor model consult a higher-intelligence advisor model mid-generation.
- **Tool Search**: Work with thousands of tools by discovering and loading them on demand.

**Server tool workflow:**

1. Provide server tools and the user prompt.
2. Claude executes the server tool automatically within a sampling loop.
3. Results are incorporated directly into the response.

If the server-side loop reaches its iteration limit without completion, the API returns `stop_reason: "pause_turn"`. To continue, send the response back as an assistant message followed by a user message to resume.

## When Claude Uses Tools

With the default `tool_choice` of `{"type": "auto"}`, Claude determines on each turn whether to call a tool or respond directly. It calls a tool when the request maps to that tool's described capability and the answer isn't already in context. It responds directly for stable knowledge, creative tasks, and conversational turns.

This boundary is steerable through your system prompt. If Claude isn't calling tools when you expect, a light instruction such as `"Use the tools to investigate before responding."` increases tool use. A stronger form such as `"Always call a tool first before responding."` pushes further. Conversely, `"Use your judgment about whether to call a tool or respond directly."` keeps triggering behavior conservative.

To require a tool call rather than rely on prompting, set `tool_choice`.

### Missing Information Handling

- **Claude Opus** models are more likely to ask clarifying questions when required parameters are missing.
- **Claude Sonnet** models may attempt to infer values from context.
- Use chain-of-thought prompting to improve parameter assessment accuracy.

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
      "location": { "type": "string" },
      "unit": { "type": "string", "enum": ["celsius", "fahrenheit"] }
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
    model="claude-opus-4-8",
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
        model="claude-opus-4-8",
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
        location: {
          type: "string",
          description: "City and state, e.g. San Francisco, CA",
        },
      },
      required: ["location"],
    },
  },
];

// Step 1: Send the initial request
const response = await client.messages.create({
  model: "claude-opus-4-8",
  max_tokens: 1024,
  tools,
  messages: [{ role: "user", content: "What's the weather in San Francisco?" }],
});

// Step 2: Check if Claude wants to use a tool
if (response.stop_reason === "tool_use") {
  const toolUse = response.content.find((block) => block.type === "tool_use");

  // Step 3: Execute the tool
  const weatherData = await getWeather(toolUse.input.location);

  // Step 4: Send tool result back
  const finalResponse = await client.messages.create({
    model: "claude-opus-4-8",
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
            content: JSON.stringify(weatherData),
          },
        ],
      },
    ],
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
{ "tool_choice": { "type": "auto" } }
```

```json
{ "tool_choice": { "type": "any" } }
```

```json
{ "tool_choice": { "type": "tool", "name": "get_weather" } }
```

```json
{ "tool_choice": { "type": "none" } }
```

| Type   | Behavior                                       |
| :----- | :--------------------------------------------- |
| `auto` | Claude decides whether to use a tool (default) |
| `any`  | Claude must use one of the provided tools      |
| `tool` | Claude must use the specific named tool        |
| `none` | Claude will not use any tools                  |

Set `disable_parallel_tool_use: true` within `tool_choice` to force Claude to use at most one tool per response.

## Parallel Tool Use

When multiple operations are independent, Claude can call multiple tools in a single response. All `tool_use` blocks appear in one assistant message. You must return all corresponding `tool_result` blocks in a single user message:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01AAA",
      "content": "72°F, sunny"
    },
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01BBB",
      "content": "45°F, cloudy"
    }
  ]
}
```

## Sequential Tool Use (Chaining)

For dependent operations where the output of one tool feeds into another, Claude calls tools one at a time across multiple turns. Each turn uses the previous tool's result as context for the next call.

## Choose a Tool

### Your Own Tools

For tools you define, you write the schema and your application executes each call.

### Anthropic-Schema Client Tools

Anthropic publishes the schema and trains Claude on it. Your application still executes each call and returns the `tool_result`.

- **Memory tool**: Store and retrieve information across conversations in files you control.
- **Bash tool** (`bash_20250124`): Run shell commands in a persistent session that maintains state.
- **Text Editor tool** (`text_editor_20250728`): View and modify text files to debug, fix, and improve code.
- **Computer Use tool**: Take screenshots and control the mouse and keyboard in a desktop environment.
- **Browser Use tool** (`browser_toolset_20260801`): Navigate, read, and interact with webpages in your own browser environment.

### Server Tools

Server tools run on Anthropic's infrastructure, with no handler code in your application.

- **Web Search tool** (`web_search_20260209`): Search the web for information beyond the knowledge cutoff, with cited sources.
- **Web Fetch tool** (`web_fetch_20260209`): Retrieve the full content of specified web pages and PDF documents.
- **Code Execution tool** (`code_execution_20260120`): Run Python and bash code in a sandboxed container to analyze data and generate files.
- **Advisor tool**: Let a faster executor model consult a higher-intelligence advisor model mid-generation.
- **Tool Search tool**: Work with thousands of tools by discovering and loading them on demand.
- **MCP connector**: Connect to remote MCP servers from the Messages API without a separate MCP client.

## Pricing

Tool use requests are priced based on:

1. The total number of input tokens sent to the model (including in the `tools` parameter)
2. The number of output tokens generated
3. For server-side tools, additional usage-based pricing (e.g., web search charges per search performed)

The additional tokens from tool use come from:

- The `tools` parameter in API requests (tool names, descriptions, and schemas)
- `tool_use` content blocks in API requests and responses
- `tool_result` content blocks in API requests

### Tool Use System Prompt Token Overhead

When you use `tools`, the API automatically includes a special system prompt that enables tool use. The number of tool use tokens required for each model are listed below (assumes at least 1 tool is provided):

| Model             | auto / none | any / tool |
| :---------------- | :---------- | :--------- |
| Claude Opus 5     | 286 tokens  | 406 tokens |
| Claude Opus 4.8   | 290 tokens  | 410 tokens |
| Claude Opus 4.7   | 675 tokens  | 804 tokens |
| Claude Opus 4.6   | 497 tokens  | 589 tokens |
| Claude Opus 4.5   | 496 tokens  | 588 tokens |
| Claude Opus 4.1 (retired, except on Bedrock and Google Cloud) | 313 tokens  | 315 tokens |
| Claude Opus 4 (retired, except on Google Cloud)   | 313 tokens  | 315 tokens |
| Claude Sonnet 5   | 354 tokens  | 474 tokens |
| Claude Sonnet 4.6 | 497 tokens  | 589 tokens |
| Claude Sonnet 4.5 | 496 tokens  | 588 tokens |
| Claude Sonnet 4 (retired, except on Bedrock and Google Cloud) | 313 tokens  | 315 tokens |
| Claude Haiku 4.5  | 496 tokens  | 588 tokens |
| Claude Haiku 3.5 (retired, except on Bedrock and Google Cloud) | 264 tokens  | 355 tokens |

### Server Tool Pricing

Server-side tools may incur additional usage-based charges beyond standard token pricing. For example, web search is billed per search query performed.

## Best Practices

- **Write detailed descriptions**: Tool and parameter descriptions significantly affect Claude's ability to use tools correctly. Explain when to use the tool, what each parameter means, and any constraints.
- **Use `strict: true`** for critical tools where input validation matters.
- **Handle errors gracefully**: Return clear error messages in `tool_result` blocks so Claude can recover.
- **Limit tool count**: Providing too many tools can reduce quality. Group related functionality and only include tools relevant to the current task.
- **Provide examples**: Include example inputs/outputs in tool descriptions for complex tools.
