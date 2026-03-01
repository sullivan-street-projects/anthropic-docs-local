---
title: "Claude Agent SDK"
source_url: "https://platform.claude.com/docs/en/agent-sdk/overview"
source_type: "manual"
fetched_at: "2026-02-28T00:00:00Z"
category: "agent-sdk"
---

# Claude Agent SDK

The Claude Agent SDK (formerly Claude Code SDK) provides a library-based interface to Claude Code's capabilities. It gives you the same tools, agent loop, and context management that power Claude Code, programmable in Python and TypeScript.

> **Last updated:** February 16, 2026

## Overview

The Agent SDK enables programmatic access to Claude Code's agentic capabilities:
- Built-in tools for reading files, writing, editing code, running commands, searching the web
- Autonomous task execution with streaming responses
- Multi-agent systems via subagents (delegation pattern)
- Model Context Protocol (MCP) integration for external systems
- Hooks for intercepting and controlling agent behavior
- Session management with context persistence
- Permissions control for security and governance

## When to Use

| Use Case | Recommended |
|----------|-------------|
| CI/CD pipelines | Agent SDK |
| Production AI agents | Agent SDK |
| Custom applications | Agent SDK |
| Interactive development | CLI |
| Quick one-off tasks | CLI |

## Two Main APIs

| Feature | `query()` | `ClaudeSDKClient` |
|---------|----------|-------------------|
| Session | New each time | Maintains context |
| Conversations | Single exchange | Multiple exchanges |
| Use case | One-off tasks | Interactive/multi-turn |
| Hooks | No | Yes |
| Interrupts | No | Yes |
| Custom tools | No | Yes |

Both APIs are available in Python and TypeScript.

## Installation

### Python (uv — recommended)

```bash
uv init && uv add claude-agent-sdk
```

### Python (pip)

```bash
python3 -m venv .venv && source .venv/bin/activate
pip3 install claude-agent-sdk
```

### TypeScript

```bash
npm install @anthropic-ai/claude-agent-sdk
```

## Setup

1. Get API key from https://platform.claude.com
2. Set environment variable: `ANTHROPIC_API_KEY=your-api-key`
3. Optional: Configure third-party providers (Bedrock, Vertex AI, Azure Foundry)

## Built-in Tools

| Tool | Description |
|------|-------------|
| Read | Read files from filesystem |
| Write | Create new files |
| Edit | Edit existing files |
| Glob | File pattern matching |
| Grep | Content search with regex |
| Bash | Shell command execution |
| WebSearch | Internet search |
| WebFetch | Fetch web content |
| Task | Spawn subagents |
| AskUserQuestion | Interactive prompts |
| TodoWrite | Task tracking |

## Permission Modes

| Mode | Description |
|------|-------------|
| `default` | Requires approval callbacks |
| `acceptEdits` | Auto-approve file edits |
| `bypassPermissions` | Full autonomy (use with caution) |
| `plan` | Planning mode without execution |

## Key Configuration Options

| Option | Description |
|--------|-------------|
| `allowed_tools` | List of tool names to enable |
| `permission_mode` | How to handle tool approvals |
| `system_prompt` | Custom or preset system prompt |
| `mcp_servers` | External tool integrations |
| `max_turns` | Conversation turn limit |
| `max_budget_usd` | Cost limit in USD |
| `hooks` | Event handlers |
| `agents` | Subagent definitions |
| `cwd` | Working directory |
| `model` | Claude model to use |
| `setting_sources` | Load CLAUDE.md files |
| `sandbox` | Command sandboxing config |

## vs Anthropic Client SDK

| Feature | Client SDK | Agent SDK |
|---------|-----------|-----------|
| Tool execution | You implement the loop | Claude handles autonomously |
| Built-in tools | None | Full set |
| Context management | Manual | Automatic |
| Use case | Custom tool loops | Production agents |

## GitHub Repositories

- Python: [claude-agent-sdk-python](https://github.com/anthropics/claude-agent-sdk-python) (4,815 stars)
- TypeScript: [claude-agent-sdk-typescript](https://github.com/anthropics/claude-agent-sdk-typescript) (797 stars)
- Demos: [claude-agent-sdk-demos](https://github.com/anthropics/claude-agent-sdk-demos) (1,442 stars)

## Sources

- [SDK Overview](https://platform.claude.com/docs/en/agent-sdk/overview)
- [Python SDK Reference](https://platform.claude.com/docs/en/agent-sdk/python)
- [TypeScript SDK Reference](https://platform.claude.com/docs/en/agent-sdk/typescript)
