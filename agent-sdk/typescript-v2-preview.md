---
title: "Agent SDK - TypeScript v2 Preview"
source_url: "https://github.com/anthropics/agent-sdk"
source_type: "web-extracted"
fetched_at: "2026-03-10T00:00:00Z"
category: "agent-sdk"
---

# Agent SDK — TypeScript v2 Preview

The Claude Agent SDK provides a framework for building multi-step, tool-using AI agents powered by Claude. The TypeScript SDK enables developers to create agents that can execute complex workflows with tool use, extended thinking, and multi-agent coordination.

## Key Features

- **Agent loops:** Automatic handling of multi-step tool use conversations
- **Built-in tools:** Text editor, code execution, web search, memory, and more
- **Extended thinking:** Support for Claude's reasoning capabilities
- **Multi-agent systems:** Orchestrator-worker patterns with specialized subagents
- **Streaming:** Real-time output streaming during agent execution
- **Error recovery:** Resume from where errors occurred, don't restart

## Architecture

The SDK implements the orchestrator-worker pattern described in Anthropic's engineering blog:
- A lead agent (typically Opus 4.6) coordinates and delegates
- Specialized subagents (typically Sonnet 4.6) handle specific tasks in parallel
- Multi-agent systems use about 15x more tokens than single chats but achieve 90.2% improvement on research evaluations

## Effective Harnesses for Long-Running Agents

For complex, multi-hour tasks, the SDK supports:
- **Initializer agents:** Handle first-run environment setup
- **Coding agents:** Make incremental progress with clear artifacts for subsequent sessions
- **Session startup procedures:** Check working directory, review git logs, read progress files

## Integration with Claude Code

The Agent SDK powers Claude Code's subagent system. Each subagent gets a fresh context window and can be dispatched for independent tasks.

## Related Resources

- [Multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)
- [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Writing effective tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents)
