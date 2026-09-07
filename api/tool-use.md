---
title: "Tool Use Guide"
source_url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview"
source_type: "web-extracted"
fetched_at: "2026-09-07T00:00:00Z"
category: "api"
---

# Tool Use with Claude

Tool use (also called function calling) lets Claude call functions that you define or that Anthropic provides. Claude determines when to call a tool based on the user's request and the tool's description. It then returns a structured call that your application executes (client tools) or that Anthropic executes (server tools).

Here's a minimal example using a server tool, the [Web search tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool), which Anthropic executes for you:

```python
client = anthropic.Anthropic()
response = client.messages.create(
    model="claude-opus-5",
    max_tokens=1024,
    tools=[{"type": "web_search_20260209", "name": "web_search"}],
    messages=[{"role": "user", "content": "What's the latest on the Mars rover?"}],
)
print(response.content)
```

```typescript
const client = new Anthropic();
const response = await client.messages.create({
  model: "claude-opus-5",
  max_tokens: 1024,
  tools: [{ type: "web_search_20260209", name: "web_search" }],
  messages: [{ role: "user", content: "What's the latest on the Mars rover?" }]
});
console.log(response.content);
```

Claude runs the search on Anthropic's infrastructure and returns the cited results in the same response. To have Claude call a function that you define, pass a tool with an `input_schema`, then execute the call when Claude returns a `tool_use` block.

## How Tool Use Works

Tools differ primarily by where the code executes. **Client tools** (including user-defined tools and tools with Anthropic-defined schemas, such as `bash` and `text_editor`) run in your application. Claude responds with `stop_reason: "tool_use"` and one or more `tool_use` blocks. Your code executes the operation and sends back a `tool_result`. **Server tools** (such as `web_search`, `web_fetch`, `code_execution`, and `tool_search`) run on Anthropic's infrastructure: you see the results directly without handling execution.

### Complete Client Tool Example

The first request defines a `get_weather` tool, and Claude answers the question by calling it: the response carries a `tool_use` block, your code runs the lookup, and a second request sends the result back in a `tool_result` block so Claude can reply with the answer.

#### Python

```python
client = anthropic.Anthropic()

tools = [
    {
        "name": "get_weather",
        "description": "Get the current weather for a given location.",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "City and state, e.g. San Francisco, CA",
                }
            },
            "required": ["location"],
        },
    }
]
messages = [{"role": "user", "content": "What's the weather in San Francisco?"}]

# Claude replies with a tool_use block naming the tool and its arguments.
response = client.messages.create(
    model="claude-opus-5",
    max_tokens=1024,
    tools=tools,
    # Ask for at most one tool call per turn.
    tool_choice={"type": "auto", "disable_parallel_tool_use": True},
    messages=messages,
)
tool_use = next(block for block in response.content if block.type == "tool_use")
print(f"Claude called {tool_use.name} with {json.dumps(tool_use.input)}")

# Run the tool, then send the result back in a tool_result block.
weather = "15 degrees Celsius, partly cloudy"  # your weather lookup goes here
messages += [
    {"role": "assistant", "content": response.content},
    {
        "role": "user",
        "content": [
            {"type": "tool_result", "tool_use_id": tool_use.id, "content": weather}
        ],
    },
]
followup = client.messages.create(
    model="claude-opus-5",
    max_tokens=1024,
    tools=tools,
    tool_choice={"type": "auto", "disable_parallel_tool_use": True},
    messages=messages,
)

# Claude uses the result to answer the original question.
final_text = next(block for block in followup.content if block.type == "text")
print(final_text.text)
```

#### TypeScript

```typescript
const client = new Anthropic();

const tools: Anthropic.Tool[] = [
  {
    name: "get_weather",
    description: "Get the current weather for a given location.",
    input_schema: {
      type: "object",
      properties: {
        location: { type: "string", description: "City and state, e.g. San Francisco, CA" }
      },
      required: ["location"]
    }
  }
];
const messages: Anthropic.MessageParam[] = [
  { role: "user", content: "What's the weather in San Francisco?" }
];

// Claude replies with a tool_use block naming the tool and its arguments.
const response = await client.messages.create({
  model: "claude-opus-5",
  max_tokens: 1024,
  tools,
  // Ask for at most one tool call per turn.
  tool_choice: { type: "auto", disable_parallel_tool_use: true },
  messages
});
const toolUse = response.content.find(
  (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
)!;
console.log(`Claude called ${toolUse.name} with ${JSON.stringify(toolUse.input)}`);

// Run the tool, then send the result back in a tool_result block.
const weather = "15 degrees Celsius, partly cloudy"; // your weather lookup goes here
messages.push(
  { role: "assistant", content: response.content },
  {
    role: "user",
    content: [{ type: "tool_result", tool_use_id: toolUse.id, content: weather }]
  }
);
const followup = await client.messages.create({
  model: "claude-opus-5",
  max_tokens: 1024,
  tools,
  tool_choice: { type: "auto", disable_parallel_tool_use: true },
  messages
});

// Claude uses the result to answer the original question.
const finalText = followup.content.find(
  (block): block is Anthropic.TextBlock => block.type === "text"
)!;
console.log(finalText.text);
```

## When Claude Uses Tools

With the default `tool_choice` of `{"type": "auto"}`, Claude determines on each turn whether to call a tool or respond directly. It calls a tool when the request maps to that tool's described capability and the answer isn't already in context. It responds directly for stable knowledge, creative tasks, and conversational turns.

This boundary is steerable through your system prompt. If Claude isn't calling tools when you expect, a light instruction such as `"Use the tools to investigate before responding."` increases tool use. A stronger form such as `"Always call a tool first before responding."` pushes further. Conversely, `"Use your judgment about whether to call a tool or respond directly."` keeps triggering behavior conservative.

To require a tool call rather than rely on prompting, set [`tool_choice`](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools#forcing-tool-use).

> **Guarantee schema conformance with strict tool use:** Add `strict: true` to your custom tool definitions to ensure Claude's tool calls always match your schema exactly. See [Strict tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/strict-tool-use).

### Missing Information Handling

If the user's prompt doesn't include enough information to fill all the required parameters for a tool, Claude Opus is much more likely to recognize that a parameter is missing and ask for it. Claude Sonnet might ask, especially when prompted to think before outputting a tool request, but it might also infer a reasonable value.

## Choose a Tool

For `type` strings, versions, and beta headers, see [Tool reference](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-reference).

### Your Own Tools

For tools you define, you write the schema and your application executes each call.

- **[Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools)**: Specify tool schemas, write descriptions, and control when Claude calls your tools.
- **[Handle tool calls](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls)**: Parse `tool_use` blocks, format `tool_result` responses, and handle errors.

### Anthropic-Schema Client Tools

Anthropic publishes the schema and trains Claude on it. Your application still executes each call and returns the `tool_result`.

- **[Memory tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool)**: Store and retrieve information across conversations in files you control.
- **[Bash tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/bash-tool)**: Run shell commands in a persistent session that maintains state.
- **[Text Editor tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/text-editor-tool)**: View and modify text files to debug, fix, and improve code.
- **[Computer Use tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool)**: Take screenshots and control the mouse and keyboard in a desktop environment.
- **[Browser Use tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/browser-use-tool)**: Navigate, read, and interact with webpages in your own browser environment.

### Server Tools

Server tools run on Anthropic's infrastructure, with no handler code in your application. See [Server tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/server-tools) for the mechanics they share.

- **[Web Search tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool)**: Search the web for information beyond the knowledge cutoff, with cited sources.
- **[Web Fetch tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-fetch-tool)**: Retrieve the full content of specified web pages and PDF documents.
- **[Code Execution tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool)**: Run Python and bash code in a sandboxed container to analyze data and generate files.
- **[Advisor tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/advisor-tool)**: Let a faster executor model consult a higher-intelligence advisor model mid-generation.
- **[Tool Search tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool)**: Work with thousands of tools by discovering and loading them on demand.
- **[MCP connector](https://platform.claude.com/docs/en/agents-and-tools/mcp-connector)**: Connect to remote MCP servers from the Messages API without a separate MCP client.

> [Claude Managed Agents](https://platform.claude.com/docs/en/managed-agents/overview) provides a built-in toolset that Claude uses autonomously within a session. For that toolset and the Managed Agents way to add custom tools, see its [Tools](https://platform.claude.com/docs/en/managed-agents/tools) page.

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

Set `disable_parallel_tool_use: true` within `tool_choice` to force Claude to use at most one tool per response.

## Tool Choice

Control how Claude selects tools:

| Type   | Behavior                                       |
| :----- | :--------------------------------------------- |
| `auto` | Claude decides whether to use a tool (default) |
| `any`  | Claude must use one of the provided tools      |
| `tool` | Claude must use the specific named tool        |
| `none` | Claude will not use any tools                  |

## Pricing

Tool use requests are priced based on:

1. The total number of input tokens sent to the model (including in the `tools` parameter)
2. The number of output tokens generated
3. For server-side tools, additional usage-based pricing (e.g., web search charges per search performed)

The additional tokens from tool use come from:

- The `tools` parameter in API requests (tool names, descriptions, and schemas)
- `tool_use` content blocks in API requests and responses
- `tool_result` content blocks in API requests

When you use `tools`, the API also automatically includes a special system prompt for the model that enables tool use. The number of tool use tokens required for each model is listed in the following table (assumes at least 1 tool is provided). If no `tools` are provided, then a tool choice of `none` uses 0 additional system prompt tokens.

| Model             | auto / none | any / tool |
| :---------------- | :---------- | :--------- |
| Claude Opus 5     | 286 tokens  | 406 tokens |
| Claude Opus 4.8   | 290 tokens  | 410 tokens |
| Claude Opus 4.7   | 675 tokens  | 804 tokens |
| Claude Opus 4.6   | 497 tokens  | 589 tokens |
| Claude Opus 4.5   | 496 tokens  | 588 tokens |
| Claude Sonnet 5   | 354 tokens  | 474 tokens |
| Claude Sonnet 4.6 | 497 tokens  | 589 tokens |
| Claude Sonnet 4.5 | 496 tokens  | 588 tokens |
| Claude Haiku 4.5  | 496 tokens  | 588 tokens |
| Claude Haiku 3.5  | 264 tokens  | 355 tokens |

These token counts are added to your normal input and output tokens to calculate the total cost of a request. See the [Models overview](https://platform.claude.com/docs/en/models/overview#latest-models-comparison) table for current per-model prices.

Some server tools add usage-based charges on top of tokens: see [Web search tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool#usage-and-pricing) and [Code execution tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool#usage-and-pricing) for their rates.

## Best Practices

- **Write detailed descriptions**: Tool and parameter descriptions significantly affect Claude's ability to use tools correctly. Explain when to use the tool, what each parameter means, and any constraints.
- **Use `strict: true`** for critical tools where input validation matters.
- **Handle errors gracefully**: Return clear error messages in `tool_result` blocks so Claude can recover.
- **Limit tool count**: Providing too many tools can reduce quality. Group related functionality and only include tools relevant to the current task.
- **Provide examples**: Include example inputs/outputs in tool descriptions for complex tools.
