---
title: "Agent SDK Quickstart"
source_url: "claude-code-guide-agent"
source_type: "manual"
fetched_at: "2026-01-31T00:00:00Z"
category: "agent-sdk"
---

# Claude Agent SDK Quickstart

Get started building agents with Claude in minutes.

## Installation

### Python

```bash
# With uv (recommended)
uv init && uv add claude-agent-sdk

# With pip
pip install claude-agent-sdk
```

### TypeScript

```bash
npm install @anthropic-ai/claude-agent-sdk
```

## Configuration

Store your API key in `.env`:

```bash
ANTHROPIC_API_KEY=sk-ant-...
```

If using Claude Code CLI authentication, the SDK uses that automatically.

## Basic Agent

### Python

```python
import asyncio
from claude_agent_sdk import query

async def main():
    async for message in query(
        prompt="What is the capital of France?"
    ):
        print(message)

asyncio.run(main())
```

### TypeScript

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "What is the capital of France?"
})) {
  console.log(message);
}
```

## Agent with Tools

### Python

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, TextBlock

async def main():
    options = ClaudeAgentOptions(
        allowed_tools=["Read", "Glob", "Grep"],
        cwd="/path/to/project"
    )

    async for message in query(
        prompt="Find all Python files and show me their sizes",
        options=options
    ):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if isinstance(block, TextBlock):
                    print(block.text)

asyncio.run(main())
```

### TypeScript

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Find all Python files and show me their sizes",
  options: {
    allowedTools: ["Read", "Glob", "Grep"],
    cwd: "/path/to/project"
  }
})) {
  if (message.type === "assistant" && message.message?.content) {
    for (const block of message.message.content) {
      if ("text" in block) console.log(block.text);
    }
  }
}
```

Available built-in tools:
- **Read/Write/Edit**: File operations
- **Bash**: Run terminal commands
- **Glob**: Find files by pattern
- **Grep**: Search file contents
- **WebSearch/WebFetch**: Browse the web
- **AskUserQuestion**: Get user input

## Tool Execution Loop

The SDK handles the agentic loop automatically:

1. Claude requests a tool
2. SDK executes it
3. Results sent back to Claude
4. Loop continues until completion

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, ResultMessage

async def main():
    async for message in query(
        prompt="Read auth.py, find bugs, and fix them",
        options=ClaudeAgentOptions(
            allowed_tools=["Read", "Edit", "Bash"],
            permission_mode="acceptEdits"
        )
    ):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if hasattr(block, "text"):
                    print(block.text)
                elif hasattr(block, "name"):
                    print(f"Tool: {block.name}")
        elif isinstance(message, ResultMessage):
            print(f"Complete: {message.subtype}")

asyncio.run(main())
```

## Custom Tools with MCP

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions, tool, create_sdk_mcp_server

@tool("get_weather", "Get weather for a location", {"lat": float, "lon": float})
async def get_weather(args):
    return {
        "content": [{"type": "text", "text": f"72F at ({args['lat']}, {args['lon']})"}]
    }

async def main():
    weather_server = create_sdk_mcp_server(
        name="weather", version="1.0.0", tools=[get_weather]
    )

    async for message in query(
        prompt="What's the weather at 37.7749, -122.4194?",
        options=ClaudeAgentOptions(
            mcp_servers={"weather": weather_server},
            allowed_tools=["mcp__weather__get_weather"]
        )
    ):
        pass

asyncio.run(main())
```

## Multi-Turn Conversations

### Using ClaudeSDKClient

```python
import asyncio
from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions, AssistantMessage, TextBlock

async def main():
    options = ClaudeAgentOptions(
        allowed_tools=["Read", "Glob"],
        permission_mode="acceptEdits"
    )

    async with ClaudeSDKClient(options=options) as client:
        # Turn 1
        await client.query("Explain the project structure")
        async for message in client.receive_response():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        print(f"Turn 1: {block.text[:100]}...")

        # Turn 2 (Claude remembers context)
        await client.query("What are the main entry points?")
        async for message in client.receive_response():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        print(f"Turn 2: {block.text[:100]}...")

asyncio.run(main())
```

### Using Session Resume

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions, ResultMessage

async def main():
    session_id = None

    # First session
    async for message in query(
        prompt="Analyze the codebase",
        options=ClaudeAgentOptions(allowed_tools=["Read", "Glob"])
    ):
        if isinstance(message, ResultMessage):
            session_id = message.session_id

    # Resume later with full context
    async for message in query(
        prompt="Based on your analysis, suggest improvements",
        options=ClaudeAgentOptions(resume=session_id)
    ):
        pass

asyncio.run(main())
```

## Streaming Responses

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

async def main():
    async for message in query(
        prompt="Explain machine learning in detail",
        options=ClaudeAgentOptions(include_partial_messages=True)
    ):
        if hasattr(message, 'event'):
            event = message.event
            if event.get("type") == "content_block_delta":
                delta = event.get("delta", {})
                if delta.get("type") == "text_delta":
                    print(delta.get("text", ""), end="", flush=True)

asyncio.run(main())
```

## System Prompts

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

async def main():
    async for message in query(
        prompt="Review this Python function for bugs",
        options=ClaudeAgentOptions(
            system_prompt="You are a senior Python developer. Always check for security issues first.",
            allowed_tools=["Read", "Bash"]
        )
    ):
        pass

asyncio.run(main())
```

Or use Claude Code's preset system prompt:

```python
options = ClaudeAgentOptions(
    system_prompt={
        "type": "preset",
        "preset": "claude_code",
        "append": "Always prioritize security."
    }
)
```

## Model Selection

```python
# Opus - most capable, complex reasoning
options = ClaudeAgentOptions(model="claude-opus-4-5-20251101")

# Sonnet - balanced, most tasks (default)
options = ClaudeAgentOptions(model="claude-sonnet-4-5-20250929")

# Haiku - fast and cheap, simple tasks
options = ClaudeAgentOptions(model="claude-haiku-4-5-20251001")
```

| Model | Speed | Cost | Reasoning |
|-------|-------|------|-----------|
| Opus 4.5 | Slower | Higher | Strongest |
| Sonnet 4.5 | Medium | Medium | Very good |
| Haiku 4.5 | Fast | Low | Good |

## Error Handling

```python
import asyncio
from claude_agent_sdk import query, CLINotFoundError, ProcessError, CLIJSONDecodeError

async def main():
    try:
        async for message in query(prompt="Hello"):
            print(message)
    except CLINotFoundError:
        print("Install Claude Code CLI first")
    except ProcessError as e:
        print(f"Process failed (exit {e.exit_code}): {e.stderr}")
    except CLIJSONDecodeError as e:
        print(f"Parse error: {e}")

asyncio.run(main())
```

## Structured Outputs

Get validated JSON responses using `output_format`:

```python
import asyncio
from pydantic import BaseModel
from claude_agent_sdk import query, ClaudeAgentOptions, ResultMessage

class BlogPost(BaseModel):
    title: str
    content: str
    tags: list[str]

async def main():
    async for message in query(
        prompt="Write a blog post about AI agents",
        options=ClaudeAgentOptions(
            output_format={
                "type": "json_schema",
                "schema": BlogPost.model_json_schema()
            }
        )
    ):
        if isinstance(message, ResultMessage) and message.structured_output:
            post = BlogPost.model_validate(message.structured_output)
            print(f"Title: {post.title}")
            print(f"Tags: {', '.join(post.tags)}")

asyncio.run(main())
```

## Extended Thinking

```python
options = ClaudeAgentOptions(
    max_thinking_tokens=10000  # Budget for internal reasoning
)
```

## Permission Modes

```python
# Default - asks for approval
options = ClaudeAgentOptions(permission_mode="default")

# Auto-approve file edits
options = ClaudeAgentOptions(permission_mode="acceptEdits")

# No prompts (CI/CD)
options = ClaudeAgentOptions(permission_mode="bypassPermissions")
```

## Next Steps

- See [Examples](examples.md) for more patterns
- Read the [Python SDK README](../sdks/python/README.md)
- Explore [Tool Use Guide](../api/tool-use.md)
- Official docs: https://platform.claude.com/docs/en/agent-sdk/quickstart
