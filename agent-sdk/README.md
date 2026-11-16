---
title: "Claude Agent SDK"
source_url: "https://platform.claude.com/docs/en/agent-sdk/overview"
source_type: "manual"
fetched_at: "2026-11-16T00:00:00Z"
category: "agent-sdk"
---

# Claude Agent SDK

Build production AI agents with Claude Code as a library.

An agent is an application that completes a task by planning its own steps and calling tools that read files, run commands, or edit code. The Agent SDK gives you the same tools, [agent loop](https://code.claude.com/docs/en/agent-sdk/agent-loop), and context management that power Claude Code, programmable in Python and TypeScript.

> **Note:** The Claude Code SDK has been renamed to the Claude Agent SDK. See the [Migration Guide](https://code.claude.com/docs/en/agent-sdk/migration-guide) if migrating from the old SDK.

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

## Compare the Agent SDK to Other Claude Tools

The Agent SDK, the CLI, the Client SDK, and Managed Agents differ in who runs the agent, what comes built in, and how you reach it.

| You want to | Use | What you get |
| ----------- | --- | ------------ |
| Embed Claude Code's agent in your own Python or TypeScript application, in a process you operate | **Agent SDK** | A library that runs the Claude Code binary, with Claude Code's capabilities, such as built-in tools, permissions, sessions, and hooks |
| Do interactive development or run one-off tasks from a terminal | [**Claude Code CLI**](https://code.claude.com/docs/en/overview) | The terminal interface, built for daily interactive use |
| Call the Claude API directly from your own code | [**Client SDK**](https://platform.claude.com/docs/en/cli-sdks-libraries/overview) | Direct access to the Claude API from any of the client SDK languages. You write the tool loop yourself, or let the client SDK's beta [tool runner](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-runner) drive it |
| Have Anthropic host the agent, configured through the Claude API | [**Managed Agents**](https://platform.claude.com/docs/en/managed-agents/overview) | A hosted agent harness that runs the agent loop, with sessions in an Anthropic-managed cloud sandbox or a [self-hosted sandbox](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes) on your own infrastructure. Use it from the [SDK for your language](https://platform.claude.com/docs/en/managed-agents/quickstart#install-the-sdk), the `ant` CLI, or the REST API |

To drive the same agent loop from a language other than Python or TypeScript, [run the CLI as a subprocess](https://code.claude.com/docs/en/headless) with the `-p` flag and `--output-format json`.

## Installation

### TypeScript

```bash
npm install @anthropic-ai/claude-agent-sdk
```

> **Note:** Both the TypeScript and Python SDKs bundle a native Claude Code binary, so most installs need no separate Claude Code install. Exceptions: a Python source-distribution install (for example on ARM64 Windows) or a TypeScript install that skips npm optional dependencies (for example `npm ci --omit=optional`) gets no bundled binary; see the [Quickstart](https://code.claude.com/docs/en/agent-sdk/quickstart).

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

These Claude Code capabilities are available in the SDK:

| Capability | What it does | Learn more |
| ---------- | ------------ | ---------- |
| Built-in tools | Read, write, edit files, run commands, and search the web | [Tools reference](https://code.claude.com/docs/en/tools-reference) |
| Hooks | Run custom code at key points in the agent lifecycle | [Hooks](https://code.claude.com/docs/en/agent-sdk/hooks) |
| Subagents | Spawn specialized agents for focused subtasks | [Subagents](https://code.claude.com/docs/en/agent-sdk/subagents) |
| MCP | Connect external tools and data sources via the Model Context Protocol | [MCP](https://code.claude.com/docs/en/agent-sdk/mcp) |
| Permissions | Control which tools run automatically, which need approval | [Permissions](https://code.claude.com/docs/en/agent-sdk/permissions) |
| Sessions | Maintain context across exchanges, resume or fork later | [Sessions](https://code.claude.com/docs/en/agent-sdk/sessions) |
| Skills, commands, and memory | Load automatically from your project's `.claude/` and from `~/.claude/`, same as Claude Code | [Skills](https://code.claude.com/docs/en/agent-sdk/skills), [Commands](https://code.claude.com/docs/en/agent-sdk/skills#commands-in-agent-sdk-sessions), [Memory](https://code.claude.com/docs/en/agent-sdk/modifying-system-prompts), [Configuration loading](https://code.claude.com/docs/en/agent-sdk/claude-code-features) |
| Plugins | Package skills, agents, hooks, and MCP servers, and load them by local path | [Plugins](https://code.claude.com/docs/en/agent-sdk/plugins) |

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

These load automatically from your project's `.claude/` and from `~/.claude/`, same as Claude Code. See [Configuration loading](https://code.claude.com/docs/en/agent-sdk/claude-code-features) to control which sources load.

| Feature                                                                      | Description                                                                   | Location                           |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ---------------------------------- |
| [Skills](https://code.claude.com/docs/en/agent-sdk/skills)                   | Specialized capabilities Claude uses automatically or you invoke with `/name` | `.claude/skills/*/SKILL.md`        |
| [Commands](https://code.claude.com/docs/en/agent-sdk/skills#commands-in-agent-sdk-sessions)         | Custom commands in the legacy format. Use skills for new custom commands      | `.claude/commands/*.md`            |
| [Memory](https://code.claude.com/docs/en/agent-sdk/modifying-system-prompts) | Project context and instructions                                              | `CLAUDE.md` or `.claude/CLAUDE.md` |
| [Plugins](https://code.claude.com/docs/en/agent-sdk/plugins)                 | Extend with skills, agents, hooks, and MCP servers                            | Load by local path via `plugins`   |

## Permission Modes

| Mode                | Behavior                                                                                      | Use case                                  |
| ------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `acceptEdits`       | Auto-approves file edits and common filesystem commands, asks for other actions               | Trusted development workflows             |
| `plan`              | Runs read-only tools; file edits are never auto-approved and reach your `canUseTool` callback | Scoping a task before approving execution |
| `auto`              | A model classifier approves or denies each tool call                                          | Autonomous agents with safety guardrails  |
| `dontAsk`           | Denies anything not in `allowedTools`                                                         | Locked-down headless agents               |
| `bypassPermissions` | Runs every tool without prompting, unless an explicit `ask` rule matches                      | Sandboxed CI, fully trusted environments  |
| `default`           | Requires a `canUseTool` callback to handle approval                                           | Custom approval flows                     |

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

## Next Steps

- [Quickstart](https://code.claude.com/docs/en/agent-sdk/quickstart): build your first agent that finds and fixes bugs
- [Migration guide](https://code.claude.com/docs/en/agent-sdk/migration-guide): migrate from the Claude Code SDK packages to the Agent SDK
- [Agent loop](https://code.claude.com/docs/en/agent-sdk/agent-loop): how Claude plans, calls tools, and decides when a task is done
- [Example agents](https://github.com/anthropics/claude-agent-sdk-demos): demo apps for local development
- [TypeScript SDK](https://code.claude.com/docs/en/agent-sdk/typescript): full TypeScript API reference and examples
- [Python SDK](https://code.claude.com/docs/en/agent-sdk/python): full Python API reference and examples
- [Agent harness design](https://claude.com/blog/a-harness-for-every-task-dynamic-workflows-in-claude-code): how the Claude Code team uses dynamic workflows to orchestrate many subagents at once

## Sources

- [SDK Overview](https://code.claude.com/docs/en/agent-sdk/overview)
- [Quickstart](https://code.claude.com/docs/en/agent-sdk/quickstart)
- [Python SDK Reference](https://code.claude.com/docs/en/agent-sdk/python)
- [TypeScript SDK Reference](https://code.claude.com/docs/en/agent-sdk/typescript)
