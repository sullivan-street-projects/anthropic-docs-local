---
title: "Claude Agent SDK"
source_url: "https://platform.claude.com/docs/en/agent-sdk/overview"
source_type: "manual"
fetched_at: "2026-08-16T00:00:00Z"
category: "agent-sdk"
---

# Claude Agent SDK

Build production AI agents with Claude Code as a library. The Agent SDK gives you the same tools, agent loop, and context management that power Claude Code, programmable in Python and TypeScript.

> **Note:** The Claude Code SDK has been renamed to the Claude Agent SDK. See the [Migration Guide](https://code.claude.com/docs/en/agent-sdk/migration-guide) if migrating from the old SDK.

> **Last updated:** August 16, 2026

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
  prompt: "Find and fix the bug in auth.ts",
  options: { allowedTools: ["Read", "Edit", "Bash"] },
})) {
  console.log(message); // Claude reads the file, finds the bug, edits it
}
```

## When to Use

| Use Case                                                           | Recommended    |
| ------------------------------------------------------------------ | -------------- |
| CI/CD pipelines                                                    | Agent SDK      |
| Production AI agents                                               | Agent SDK      |
| Custom applications                                                | Agent SDK      |
| Interactive development                                            | CLI            |
| Quick one-off tasks                                                | CLI            |
| Production agents without operating sandbox/session infrastructure | Managed Agents |

Many teams use both: CLI for daily development, SDK for production. Workflows translate directly between them.

## Installation

### TypeScript

```bash
npm install @anthropic-ai/claude-agent-sdk
```

> **Note:** Both the TypeScript and Python SDKs now bundle a native Claude Code binary for your platform, so you don't need to install Claude Code separately.

### Python (uv -- recommended)

```bash
uv init && uv add claude-agent-sdk
```

### Python (pip)

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install claude-agent-sdk
```

The Python package requires Python 3.10 or later. If pip reports "No matching distribution found for claude-agent-sdk", your interpreter is older than 3.10.

## Setup

1. Get API key from [Claude Console](https://platform.claude.com/)
2. Set environment variable: `export ANTHROPIC_API_KEY=your-api-key`
3. Optional third-party providers:
   - **Amazon Bedrock**: set `CLAUDE_CODE_USE_BEDROCK=1` and configure AWS credentials
   - **Claude Platform on AWS**: set `CLAUDE_CODE_USE_ANTHROPIC_AWS=1` and `ANTHROPIC_AWS_WORKSPACE_ID`, then configure AWS credentials
   - **Google Cloud's Agent Platform** (Vertex AI): set `CLAUDE_CODE_USE_VERTEX=1` and configure Google Cloud credentials
   - **Microsoft Foundry** (Azure): set `CLAUDE_CODE_USE_FOUNDRY=1` and configure Azure credentials

See the setup guides for [Bedrock](https://code.claude.com/docs/en/amazon-bedrock), [Claude Platform on AWS](https://code.claude.com/docs/en/claude-platform-on-aws), [Vertex AI](https://code.claude.com/docs/en/google-vertex-ai), or [Azure AI Foundry](https://code.claude.com/docs/en/microsoft-foundry) for details.

> **Note:** Unless previously approved, Anthropic does not allow third party developers to offer claude.ai login or rate limits for their products, including agents built on the Claude Agent SDK. Use the API key authentication methods instead.

## Built-in Tools

| Tool                                                                                                    | What it does                                                        |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| **Read**                                                                                                | Read any file in the working directory                              |
| **Write**                                                                                               | Create new files                                                    |
| **Edit**                                                                                                | Make precise edits to existing files                                |
| **Bash**                                                                                                | Run terminal commands, scripts, git operations                      |
| **Monitor**                                                                                             | Watch a background script and react to each output line as an event |
| **Glob**                                                                                                | Find files by pattern (`**/*.ts`, `src/**/*.py`)                    |
| **Grep**                                                                                                | Search file contents with regex                                     |
| **WebSearch**                                                                                           | Search the web for current information                              |
| **WebFetch**                                                                                            | Fetch and parse web page content                                    |
| **[AskUserQuestion](https://code.claude.com/docs/en/agent-sdk/user-input#handle-clarifying-questions)** | Ask the user clarifying questions with multiple choice options      |

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

Control exactly which tools your agent can use. Allow safe operations, block dangerous ones, or require approval for sensitive actions. For interactive approval prompts and the `AskUserQuestion` tool, see [Handle approvals and user input](https://code.claude.com/docs/en/agent-sdk/user-input).

### Sessions

Maintain context across multiple exchanges. Claude remembers files read, analysis done, and conversation history. Resume sessions later, or fork them to explore different approaches.

### Claude Code Features

Set `setting_sources=["project"]` (Python) or `settingSources: ['project']` (TypeScript) to enable. With default options the SDK loads these from `.claude/` in your working directory and `~/.claude/`.

| Feature                                                                      | Description                                                                   | Location                           |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ---------------------------------- |
| [Skills](https://code.claude.com/docs/en/agent-sdk/skills)                   | Specialized capabilities Claude uses automatically or you invoke with `/name` | `.claude/skills/*/SKILL.md`        |
| [Commands](https://code.claude.com/docs/en/agent-sdk/slash-commands)         | Custom commands in the legacy format. Use skills for new custom commands      | `.claude/commands/*.md`            |
| [Memory](https://code.claude.com/docs/en/agent-sdk/modifying-system-prompts) | Project context and instructions                                              | `CLAUDE.md` or `.claude/CLAUDE.md` |
| [Plugins](https://code.claude.com/docs/en/agent-sdk/plugins)                 | Extend with skills, agents, hooks, and MCP servers                            | Programmatic via `plugins` option  |

## Permission Modes

| Mode                | Behavior                                                                                      | Use case                                  |
| ------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `acceptEdits`       | Auto-approves file edits and common filesystem commands, asks for other actions               | Trusted development workflows             |
| `plan`              | Runs read-only tools; file edits are never auto-approved and reach your `canUseTool` callback | Scoping a task before approving execution |
| `auto`              | A model classifier approves or denies each tool call                                          | Autonomous agents with safety guardrails  |
| `dontAsk`           | Denies anything not in `allowedTools`                                                         | Locked-down headless agents               |
| `bypassPermissions` | Runs every tool without prompting, unless an explicit `ask` rule matches                      | Sandboxed CI, fully trusted environments  |
| `default`           | Requires a `canUseTool` callback to handle approval                                           | Custom approval flows                     |

## Compare the Agent SDK to Other Claude Tools

### vs Anthropic Client SDK

The Anthropic Client SDK gives you direct API access where you send prompts and implement tool execution yourself. The Agent SDK gives you Claude with built-in tool execution.

| Feature            | Client SDK             | Agent SDK                   |
| ------------------ | ---------------------- | --------------------------- |
| Tool execution     | You implement the loop | Claude handles autonomously |
| Built-in tools     | None                   | Full set                    |
| Context management | Manual                 | Automatic                   |
| Use case           | Custom tool loops      | Production agents           |

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

### vs Claude Code CLI

Same capabilities, different interface. Many teams use both: CLI for daily development, SDK for production.

| Use case                | Best choice |
| ----------------------- | ----------- |
| Interactive development | CLI         |
| CI/CD pipelines         | SDK         |
| Custom applications     | SDK         |
| One-off tasks           | CLI         |
| Production automation   | SDK         |

### vs Managed Agents

[Managed Agents](https://platform.claude.com/docs/en/managed-agents/overview) is a hosted REST API: Anthropic runs the agent and the sandbox, and your application sends events and streams back results. The Agent SDK is a library that runs the agent loop inside your own process.

|                    | Agent SDK                                                                    | Managed Agents                                                                                                |
| ------------------ | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Runs in**        | Your process, your infrastructure                                            | Anthropic-managed infrastructure                                                                              |
| **Interface**      | Python or TypeScript library                                                 | REST API                                                                                                      |
| **Agent works on** | Files on your infrastructure                                                 | A managed sandbox per session                                                                                 |
| **Session state**  | JSONL on your filesystem                                                     | Anthropic-hosted event log                                                                                    |
| **Custom tools**   | In-process Python or TypeScript functions                                    | Claude triggers the tool; you execute and return results                                                      |
| **Best for**       | Local prototyping, agents that work directly on your filesystem and services | Production agents without operating sandbox or session infrastructure, long-running and asynchronous sessions |

A common path is to prototype with the Agent SDK locally, then move to Managed Agents for production.

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

Your product should maintain its own branding and not appear to be Claude Code or any Anthropic product. For questions about branding compliance, contact the Anthropic [sales team](https://www.anthropic.com/contact-sales).

## License and Terms

Use of the Claude Agent SDK is governed by [Anthropic's Commercial Terms of Service](https://www.anthropic.com/legal/commercial-terms), including when you use it to power products and services that you make available to your own customers and end users, except to the extent a specific component or dependency is covered by a different license as indicated in that component's LICENSE file.

## GitHub Repositories

- Python: [claude-agent-sdk-python](https://github.com/anthropics/claude-agent-sdk-python)
- TypeScript: [claude-agent-sdk-typescript](https://github.com/anthropics/claude-agent-sdk-typescript)
- Demos: [claude-agent-sdk-demos](https://github.com/anthropics/claude-agent-sdk-demos)

## Sources

- [SDK Overview](https://code.claude.com/docs/en/agent-sdk/overview)
- [Quickstart](https://code.claude.com/docs/en/agent-sdk/quickstart)
- [Python SDK Reference](https://code.claude.com/docs/en/agent-sdk/python)
- [TypeScript SDK Reference](https://code.claude.com/docs/en/agent-sdk/typescript)
