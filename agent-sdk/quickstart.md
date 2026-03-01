---
title: "Agent SDK Quickstart"
source_url: "https://platform.claude.com/docs/en/agent-sdk/quickstart"
source_type: "manual"
fetched_at: "2026-02-28T00:00:00Z"
category: "agent-sdk"
---

# Claude Agent SDK Quickstart

Get started building autonomous agents with the Claude Agent SDK in Python or TypeScript.

> **Last updated:** February 16, 2026

## Prerequisites

- API key from https://platform.claude.com
- Environment variable: `ANTHROPIC_API_KEY=your-api-key`
- Python 3.10+ or Node.js 18+

## Installation

### Python

```bash
# Using uv (recommended)
uv init && uv add claude-agent-sdk

# Using pip
python3 -m venv .venv && source .venv/bin/activate
pip3 install claude-agent-sdk
```

### TypeScript

```bash
npm install @anthropic-ai/claude-agent-sdk
```

## Basic Agent — Python

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

async def main():
    async for message in query(
        prompt="Find and fix the bug in auth.py",
        options=ClaudeAgentOptions(
            allowed_tools=["Read", "Edit", "Bash"]
        )
    ):
        if hasattr(message, "result"):
            print(message.result)

asyncio.run(main())
```

## Basic Agent — TypeScript

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Find and fix the bug in auth.py",
  options: {
    allowedTools: ["Read", "Edit", "Bash"]
  }
})) {
  if ("result" in message) {
    console.log(message.result);
  }
}
```

## Streaming Progress

### Python

```python
async for message in query(
    prompt="Refactor the authentication module",
    options=ClaudeAgentOptions(
        allowed_tools=["Read", "Edit", "Glob", "Grep", "Bash"]
    )
):
    if hasattr(message, "content"):
        for block in message.content:
            if hasattr(block, "text"):
                print(block.text, end="", flush=True)
    if hasattr(message, "result"):
        print(f"\nDone! Cost: ${message.cost_usd:.4f}")
```

### TypeScript

```typescript
for await (const message of query({
  prompt: "Refactor the authentication module",
  options: {
    allowedTools: ["Read", "Edit", "Glob", "Grep", "Bash"]
  }
})) {
  if ("content" in message) {
    for (const block of message.content) {
      if ("text" in block) process.stdout.write(block.text);
    }
  }
  if ("result" in message) {
    console.log(`\nDone! Cost: $${message.costUsd.toFixed(4)}`);
  }
}
```

## With Permission Callbacks

### Python

```python
async def can_use_tool(tool: str, input: dict) -> bool:
    if tool == "Bash" and "rm " in input.get("command", ""):
        print(f"Blocked dangerous command: {input['command']}")
        return False
    return True

async for message in query(
    prompt="Clean up temporary files",
    options=ClaudeAgentOptions(
        allowed_tools=["Read", "Bash", "Glob"],
        permission_mode="default",
        can_use_tool=can_use_tool
    )
):
    pass
```

## With MCP Servers

### Python

```python
async for message in query(
    prompt="List open issues and create a summary",
    options=ClaudeAgentOptions(
        allowed_tools=["Read", "mcp__github__list_issues"],
        mcp_servers={
            "github": {
                "command": "npx",
                "args": ["-y", "@modelcontextprotocol/server-github"],
                "env": {"GITHUB_TOKEN": os.environ["GITHUB_TOKEN"]}
            }
        }
    )
):
    pass
```

## With Subagents

### Python

```python
from claude_agent_sdk import query, ClaudeAgentOptions, AgentDefinition

async for message in query(
    prompt="Review and improve the codebase quality",
    options=ClaudeAgentOptions(
        allowed_tools=["Read", "Glob", "Grep", "Task"],
        agents={
            "code-reviewer": AgentDefinition(
                description="Expert code reviewer",
                prompt="Analyze code quality and suggest improvements",
                tools=["Read", "Glob", "Grep"]
            )
        }
    )
):
    pass
```

## Session Resumption

### Python

```python
# First query — capture session ID
session_id = None
async for message in query(
    prompt="Read the authentication module",
    options=ClaudeAgentOptions(allowed_tools=["Read", "Glob"])
):
    if message.subtype == "init":
        session_id = message.session_id

# Resume with full context
async for message in query(
    prompt="Now find all places that call it",
    options=ClaudeAgentOptions(resume=session_id)
):
    pass
```

## Cost & Turn Limits

```python
async for message in query(
    prompt="Implement the feature described in SPEC.md",
    options=ClaudeAgentOptions(
        allowed_tools=["Read", "Write", "Edit", "Bash"],
        max_turns=50,
        max_budget_usd=5.00
    )
):
    pass
```

## Loading Project Settings

```python
# Load CLAUDE.md from project directory
async for message in query(
    prompt="Follow the project conventions and add tests",
    options=ClaudeAgentOptions(
        allowed_tools=["Read", "Write", "Edit", "Bash"],
        setting_sources=["project"],
        cwd="/path/to/project"
    )
):
    pass
```

## Next Steps

- [Agent SDK Overview](https://platform.claude.com/docs/en/agent-sdk/overview) — Architecture and concepts
- [Python Reference](https://platform.claude.com/docs/en/agent-sdk/python) — Full Python API
- [TypeScript Reference](https://platform.claude.com/docs/en/agent-sdk/typescript) — Full TypeScript API
- [Example Agents](https://github.com/anthropics/claude-agent-sdk-demos) — Production-ready examples
