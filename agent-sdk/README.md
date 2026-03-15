---
title: "Claude Agent SDK"
source_url: "https://platform.claude.com/docs/en/agent-sdk/overview"
source_type: "manual"
fetched_at: "2026-03-15T00:00:00Z"
category: "agent-sdk"
---

# Claude Agent SDK

Build production AI agents with Claude Code as a library. The Agent SDK gives you the same tools, agent loop, and context management that power Claude Code, programmable in Python and TypeScript.

> **Note:** The Claude Code SDK has been renamed to the Claude Agent SDK. See the [Migration Guide](https://platform.claude.com/docs/en/agent-sdk/migration-guide) if migrating from the old SDK.

> **Last updated:** March 15, 2026

## Overview

The Agent SDK enables programmatic access to Claude Code's agentic capabilities:
- Built-in tools for reading files, writing, editing code, running commands, searching the web
- Autonomous task execution with streaming responses
- Multi-agent systems via subagents (delegation pattern)
- Model Context Protocol (MCP) integration for external systems
- Hooks for intercepting and controlling agent behavior (PreToolUse, PostToolUse, Stop, SessionStart, SessionEnd, UserPromptSubmit, and more)
- Session management with context persistence, resumption, and forking
- Permissions control for security and governance
- Filesystem-based configuration (Skills, Slash commands, Memory, Plugins)

## Quick Example

### Python

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions


async def main():
    async for message in query(
        prompt="Find and fix the bug in auth.py",
        options=ClaudeAgentOptions(allowed_tools=["Read", "Edit", "Bash"]),
    ):
        print(message)  # Claude reads the file, finds the bug, edits it


asyncio.run(main())
```

### TypeScript

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Find and fix the bug in auth.py",
  options: { allowedTools: ["Read", "Edit", "Bash"] }
})) {
  console.log(message); // Claude reads the file, finds the bug, edits it
}
```

## When to Use

| Use Case | Recommended |
|----------|-------------|
| CI/CD pipelines | Agent SDK |
| Production AI agents | Agent SDK |
| Custom applications | Agent SDK |
| Interactive development | CLI |
| Quick one-off tasks | CLI |

Many teams use both: CLI for daily development, SDK for production. Workflows translate directly between them.

## Installation

### TypeScript

```bash
npm install @anthropic-ai/claude-agent-sdk
```

### Python (uv -- recommended)

```bash
uv init && uv add claude-agent-sdk
```

### Python (pip)

```bash
python3 -m venv .venv && source .venv/bin/activate
pip3 install claude-agent-sdk
```

## Setup

1. Get API key from [Claude Console](https://platform.claude.com/)
2. Set environment variable: `export ANTHROPIC_API_KEY=your-api-key`
3. Optional third-party providers:
   - **Amazon Bedrock**: set `CLAUDE_CODE_USE_BEDROCK=1` and configure AWS credentials
   - **Google Vertex AI**: set `CLAUDE_CODE_USE_VERTEX=1` and configure Google Cloud credentials
   - **Microsoft Azure**: set `CLAUDE_CODE_USE_FOUNDRY=1` and configure Azure credentials

> **Note:** Unless previously approved, Anthropic does not allow third party developers to offer claude.ai login or rate limits for their products, including agents built on the Claude Agent SDK. Use the API key authentication methods instead.

## Built-in Tools

| Tool | What it does |
|------|--------------|
| **Read** | Read any file in the working directory |
| **Write** | Create new files |
| **Edit** | Make precise edits to existing files |
| **Bash** | Run terminal commands, scripts, git operations |
| **Glob** | Find files by pattern (`**/*.ts`, `src/**/*.py`) |
| **Grep** | Search file contents with regex |
| **WebSearch** | Search the web for current information |
| **WebFetch** | Fetch and parse web page content |
| **Agent** | Spawn subagents for delegation |
| **AskUserQuestion** | Ask the user clarifying questions with multiple choice options |
| **TodoWrite** | Task tracking |

## Capabilities

### Hooks

Run custom code at key points in the agent lifecycle. SDK hooks use callback functions to validate, log, block, or transform agent behavior.

Available hooks: `PreToolUse`, `PostToolUse`, `Stop`, `SessionStart`, `SessionEnd`, `UserPromptSubmit`, and more.

### Subagents

Spawn specialized agents to handle focused subtasks. Your main agent delegates work, and subagents report back with results. Define custom agents with specialized instructions. Include `Agent` in `allowedTools` since subagents are invoked via the Agent tool.

Messages from within a subagent's context include a `parent_tool_use_id` field for tracking.

### MCP Integration

Connect to external systems via the Model Context Protocol: databases, browsers, APIs, and hundreds more. Example: connect the Playwright MCP server for browser automation capabilities.

### Permissions

Control exactly which tools your agent can use. Allow safe operations, block dangerous ones, or require approval for sensitive actions.

### Sessions

Maintain context across multiple exchanges. Claude remembers files read, analysis done, and conversation history. Resume sessions later, or fork them to explore different approaches.

### Claude Code Features

Set `setting_sources=["project"]` (Python) or `settingSources: ['project']` (TypeScript) to enable:

| Feature | Description | Location |
|---------|-------------|----------|
| Skills | Specialized capabilities defined in Markdown | `.claude/skills/SKILL.md` |
| Slash commands | Custom commands for common tasks | `.claude/commands/*.md` |
| Memory | Project context and instructions | `CLAUDE.md` or `.claude/CLAUDE.md` |
| Plugins | Extend with custom commands, agents, and MCP servers | Programmatic via `plugins` option |

## Permission Modes

| Mode | Behavior | Use case |
|------|----------|----------|
| `acceptEdits` | Auto-approves file edits, asks for other actions | Trusted development workflows |
| `dontAsk` (TypeScript only) | Denies anything not in `allowedTools` | Locked-down headless agents |
| `bypassPermissions` | Runs every tool without prompts | Sandboxed CI, fully trusted environments |
| `default` | Requires a `canUseTool` callback to handle approval | Custom approval flows |
| `plan` | Planning mode without execution | Read-only analysis |

## vs Anthropic Client SDK

The Anthropic Client SDK gives you direct API access where you send prompts and implement tool execution yourself. The Agent SDK gives you Claude with built-in tool execution.

| Feature | Client SDK | Agent SDK |
|---------|-----------|-----------|
| Tool execution | You implement the loop | Claude handles autonomously |
| Built-in tools | None | Full set |
| Context management | Manual | Automatic |
| Use case | Custom tool loops | Production agents |

```python
# Client SDK: You implement the tool loop
response = client.messages.create(...)
while response.stop_reason == "tool_use":
    result = your_tool_executor(response.tool_use)
    response = client.messages.create(tool_result=result, **params)

# Agent SDK: Claude handles tools autonomously
async for message in query(prompt="Fix the bug in auth.py"):
    print(message)
```

## Changelog

- **TypeScript SDK**: [CHANGELOG.md](https://github.com/anthropics/claude-agent-sdk-typescript/blob/main/CHANGELOG.md)
- **Python SDK**: [CHANGELOG.md](https://github.com/anthropics/claude-agent-sdk-python/blob/main/CHANGELOG.md)

## Reporting Bugs

- **TypeScript SDK**: [GitHub Issues](https://github.com/anthropics/claude-agent-sdk-typescript/issues)
- **Python SDK**: [GitHub Issues](https://github.com/anthropics/claude-agent-sdk-python/issues)

## Branding Guidelines

For partners integrating the Claude Agent SDK, use of Claude branding is optional. When referencing Claude:

**Allowed:**
- "Claude Agent" (preferred for dropdown menus)
- "Claude" (when within a menu already labeled "Agents")
- "{YourAgentName} Powered by Claude" (if you have an existing agent name)

**Not permitted:**
- "Claude Code" or "Claude Code Agent"
- Claude Code-branded ASCII art or visual elements that mimic Claude Code

## License and Terms

Use of the Claude Agent SDK is governed by [Anthropic's Commercial Terms of Service](https://www.anthropic.com/legal/commercial-terms).

## GitHub Repositories

- Python: [claude-agent-sdk-python](https://github.com/anthropics/claude-agent-sdk-python)
- TypeScript: [claude-agent-sdk-typescript](https://github.com/anthropics/claude-agent-sdk-typescript)
- Demos: [claude-agent-sdk-demos](https://github.com/anthropics/claude-agent-sdk-demos)

## Sources

- [SDK Overview](https://platform.claude.com/docs/en/agent-sdk/overview)
- [Quickstart](https://platform.claude.com/docs/en/agent-sdk/quickstart)
- [Python SDK Reference](https://platform.claude.com/docs/en/agent-sdk/python)
- [TypeScript SDK Reference](https://platform.claude.com/docs/en/agent-sdk/typescript)
