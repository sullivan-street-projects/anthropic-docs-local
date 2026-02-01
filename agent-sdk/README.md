---
title: "Claude Agent SDK"
source_url: "claude-code-guide-agent"
source_type: "manual"
fetched_at: "2026-01-31T00:00:00Z"
category: "agent-sdk"
---

# Claude Agent SDK

The Claude Agent SDK is Anthropic's official framework for building production-grade AI agents powered by Claude. Unlike the base Anthropic Client SDK which requires manual tool execution loops, the Agent SDK handles tool orchestration automatically.

## Overview

The Agent SDK provides a structured approach to creating autonomous agents that can:

- Reason about complex problems using Claude's language understanding
- Use multiple tools and integrate with external systems
- Maintain state and context across interactions
- Execute code, interact with files, search the web, and access custom tools
- Make decisions and take actions with minimal human intervention
- Return structured, schema-validated outputs

## Use Cases

**Automation**
- Document processing and analysis
- Customer support automation
- Data extraction and transformation

**Research & Analysis**
- Code analysis and optimization
- Content research and summarization
- Document review and compliance

**Development Tools**
- AI-powered code generation and review
- Automated testing and validation
- Technical documentation generation

## Installation

### Prerequisites

- Node.js 18+ or Python 3.10+
- Claude Code CLI installed on your system

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

### Configuration

```bash
export ANTHROPIC_API_KEY="your-api-key"
```

If authenticated via Claude Code CLI, the SDK uses that automatically.

## Quick Start

### Python

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, ResultMessage

async def main():
    async for message in query(
        prompt="Review utils.py for bugs. Fix any issues you find.",
        options=ClaudeAgentOptions(
            allowed_tools=["Read", "Edit", "Glob"],
            permission_mode="acceptEdits"
        )
    ):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if hasattr(block, "text"):
                    print(block.text)
        elif isinstance(message, ResultMessage):
            print(f"Done: {message.subtype}")

asyncio.run(main())
```

### TypeScript

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Review utils.py for bugs. Fix any issues you find.",
  options: {
    allowedTools: ["Read", "Edit", "Glob"],
    permissionMode: "acceptEdits"
  }
})) {
  if (message.type === "assistant" && message.message?.content) {
    for (const block of message.message.content) {
      if ("text" in block) console.log(block.text);
    }
  } else if (message.type === "result") {
    console.log(`Done: ${message.subtype}`);
  }
}
```

## Core Concepts

### Messages

| Message Type | When | Content |
|---|---|---|
| **AssistantMessage** | Claude thinking/using tools | Reasoning text, tool calls |
| **UserMessage** | User input | Prompt text |
| **SystemMessage** | Internal metadata | Session init, status |
| **ResultMessage** | Task completion | Final result, cost, duration |

### Tools

**Built-in Tools**:

| Category | Tools |
|---|---|
| File Reading | `Read`, `Glob`, `Grep` |
| File Writing | `Write`, `Edit` |
| Command Execution | `Bash` |
| Web Access | `WebSearch`, `WebFetch` |
| User Interaction | `AskUserQuestion` |
| Notebooks | `NotebookEdit` |
| Advanced | `Task` (subagents), `ListMcpResources`, `ReadMcpResource` |

**Custom Tools**: Define via MCP (Model Context Protocol)

### Permission Modes

| Mode | Behavior | Use Case |
|---|---|---|
| `default` | Asks for approval | Interactive workflows |
| `acceptEdits` | Auto-approves file edits | Development workflows |
| `plan` | Plan-only, no execution | Preview what agent would do |
| `bypassPermissions` | No prompts | CI/CD, full automation |

### Sessions and State

```python
# Resume a previous session
async for message in query(
    prompt="Continue the analysis",
    options=ClaudeAgentOptions(resume=session_id)
):
    pass
```

### Streaming

Messages arrive as an async iterator in real-time:

```python
async for message in query(prompt="Analyze codebase"):
    print(message)  # Each message as it arrives
```

## Architecture

```
┌─────────────────────────────────────┐
│   Your Agent Application            │
│   (Business Logic & Workflows)      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Agent SDK Framework Layer         │
│   - Tool orchestration              │
│   - Session persistence             │
│   - Permissions & security          │
│   - Cost tracking                   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Claude Code CLI + Anthropic API   │
│   - Message creation & routing      │
│   - Token management                │
│   - MCP server connections          │
└─────────────────────────────────────┘
```

## Key Features

- **Declarative Tool Definition**: Specify available tools; Claude decides when/how to use them
- **Streaming First**: Real-time responses with live progress monitoring
- **Reliability**: Automatic retries, session checkpointing, file change tracking
- **Efficiency**: Token counting, budget limits (`max_budget_usd`), turn limits (`max_turns`)
- **Flexibility**: Custom system prompts, env vars, subagent definitions, hooks
- **Observability**: Cost tracking, token usage, duration metrics

## Model Selection

| Model | ID | Best For |
|---|---|---|
| Opus 4.5 | `claude-opus-4-5-20251101` | Complex reasoning, multi-step planning |
| Sonnet 4.5 | `claude-sonnet-4-5-20250929` | Balanced, most use cases |
| Haiku 4.5 | `claude-haiku-4-5-20251001` | Simple tasks, cost optimization |

## Advanced Features

### Structured Outputs

Get validated JSON from agent workflows:

```python
from pydantic import BaseModel

class CompanyInfo(BaseModel):
    company_name: str
    founded_year: int

async for message in query(
    prompt="Research Anthropic",
    options=ClaudeAgentOptions(
        output_format={
            "type": "json_schema",
            "schema": CompanyInfo.model_json_schema()
        }
    )
):
    if isinstance(message, ResultMessage) and message.structured_output:
        company = CompanyInfo.model_validate(message.structured_output)
```

### Custom Tools via MCP

```python
from claude_agent_sdk import tool, create_sdk_mcp_server

@tool("get_weather", "Get weather for a location", {"location": str})
async def get_weather(args):
    return {"content": [{"type": "text", "text": f"72F in {args['location']}"}]}

weather_server = create_sdk_mcp_server(name="weather", tools=[get_weather])
```

### Subagents

```python
from claude_agent_sdk import AgentDefinition

options = ClaudeAgentOptions(
    agents={
        "code-reviewer": AgentDefinition(
            description="Expert code reviewer",
            prompt="Analyze code quality",
            tools=["Read", "Glob", "Grep"]
        )
    }
)
```

### Hooks

Intercept events in the agent lifecycle for auditing, validation, and control.

### Sandbox

Isolate command execution for security:

```python
options = ClaudeAgentOptions(
    sandbox={"enabled": True, "autoAllowBashIfSandboxed": True}
)
```

## Recent Updates

- **Structured Outputs (GA)**: Python SDK v0.77.0+, TypeScript SDK v0.72.0+ via `output_config`
- **MCP SDK Helper Functions**: TypeScript v0.72.0+
- **Foundation SDK Integration**: Cloud provider support (Bedrock, Vertex AI)
- **Server-Side Tools**: Web search, text editor, bash execute on Anthropic servers
- **Binary Request Streaming**: Python v0.76.0+

## Next Steps

- See [Quickstart Guide](quickstart.md) for setup instructions
- See [Examples](examples.md) for code samples
- Read the [Anthropic Python SDK](../sdks/python/README.md) documentation
- Official docs: https://platform.claude.com/docs/en/agent-sdk/overview
