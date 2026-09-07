---
title: "Agent SDK Examples"
source_url: "https://code.claude.com/docs/en/agent-sdk/examples"
source_type: "manual"
fetched_at: "2026-09-07T00:00:00Z"
category: "agent-sdk"
---

# Agent SDK Examples

Find a complete, runnable Agent SDK project or a guided recipe in the Claude Cookbook that matches what you want to build. TypeScript applications live in the [`claude-agent-sdk-demos`](https://github.com/anthropics/claude-agent-sdk-demos) repo, and Python recipes live in the [Claude Cookbook](https://platform.claude.com/cookbook).

## Run a Minimal Agent First

If you haven't built anything with the SDK yet, start with one of these before a full application:

- **[Agent SDK quickstart](https://code.claude.com/docs/en/agent-sdk/quickstart):** Build your first working agent in TypeScript or Python, with setup steps included. The agent finds and fixes bugs in a sample file.

- **[Hello World](https://github.com/anthropics/claude-agent-sdk-demos/tree/main/hello-world):** A minimal TypeScript project to clone when you want to start from repo code.

## Explore a TypeScript Application

The TypeScript applications in [`claude-agent-sdk-demos`](https://github.com/anthropics/claude-agent-sdk-demos) are demos for local development, from an email client to a multi-agent research system. Clone the demo whose shape matches what you're building.

## Work Through a Python Recipe

The Claude Cookbook's Agent SDK series is a sequence of recipes, each a Python notebook, that progresses from a simple research agent to sophisticated multi-agent systems. Each notebook builds on the previous one, introducing new concepts and capabilities. Start with [the one-liner research agent](https://platform.claude.com/cookbook/claude-agent-sdk-00-the-one-liner-research-agent) and work forward.

For recipes across Claude products, see the full [Claude Cookbook](https://platform.claude.com/cookbook).

---

## Quick Reference: Common Patterns

The examples in the demos and cookbook cover these core SDK patterns:

### Subagent Delegation

Spawn specialized agents to handle focused subtasks. Your main agent delegates work, and subagents report back with results. Include `Agent` in `allowedTools` since subagents are invoked via the Agent tool.

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions, AgentDefinition


async def main():
    async for message in query(
        prompt="Use the code-reviewer agent to review this codebase",
        options=ClaudeAgentOptions(
            allowed_tools=["Read", "Glob", "Grep", "Agent"],
            agents={
                "code-reviewer": AgentDefinition(
                    description="Expert code reviewer for quality and security reviews.",
                    prompt="Analyze code quality and suggest improvements.",
                    tools=["Read", "Glob", "Grep"],
                ),
            },
        ),
    ):
        if hasattr(message, "result"):
            print(message.result)


asyncio.run(main())
```

### Hooks for Audit Logging

Run custom code at key points in the agent lifecycle. SDK hooks use callback functions to validate, log, block, or transform agent behavior.

Available hooks: `PreToolUse`, `PostToolUse`, `Stop`, `SessionStart`, `SessionEnd`, `UserPromptSubmit`, and more.

```python
import asyncio
from datetime import datetime
from claude_agent_sdk import query, ClaudeAgentOptions, HookMatcher


async def log_file_change(input_data, tool_use_id, context):
    file_path = input_data.get("tool_input", {}).get("file_path", "unknown")
    with open("./audit.log", "a") as f:
        f.write(f"{datetime.now()}: modified {file_path}\n")
    return {}


async def block_env_files(input_data, tool_use_id, context):
    file_path = input_data.get("tool_input", {}).get("file_path", "")
    if ".env" in file_path:
        return {"permissionDecision": "deny", "reason": "Cannot modify .env files"}
    return {}


async def main():
    async for message in query(
        prompt="Refactor utils.py to improve readability",
        options=ClaudeAgentOptions(
            allowed_tools=["Read", "Edit", "Write", "Bash"],
            permission_mode="acceptEdits",
            hooks={
                "PostToolUse": [
                    HookMatcher(matcher="Edit|Write", hooks=[log_file_change])
                ],
                "PreToolUse": [
                    HookMatcher(matcher="Edit|Write", hooks=[block_env_files])
                ],
            },
        ),
    ):
        if hasattr(message, "result"):
            print(message.result)


asyncio.run(main())
```

### MCP Server Integration

Connect Claude to external services via the Model Context Protocol: databases, browsers, APIs, and [hundreds more](https://github.com/modelcontextprotocol/servers).

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions


async def main():
    async for message in query(
        prompt="Open example.com and describe what you see",
        options=ClaudeAgentOptions(
            mcp_servers={
                "playwright": {
                    "command": "npx",
                    "args": ["@playwright/mcp@latest"],
                }
            }
        ),
    ):
        if hasattr(message, "result"):
            print(message.result)


asyncio.run(main())
```

### Session Resumption

Maintain context across multiple exchanges. Capture the session ID from the first query, then resume to continue with full context:

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions, SystemMessage, ResultMessage


async def main():
    session_id = None

    # First query: capture the session ID
    async for message in query(
        prompt="Read the authentication module",
        options=ClaudeAgentOptions(allowed_tools=["Read", "Glob"]),
    ):
        if isinstance(message, SystemMessage) and message.subtype == "init":
            session_id = message.data["session_id"]

    # Resume with full context from the first query
    async for message in query(
        prompt="Now find all places that call it",  # "it" = auth module
        options=ClaudeAgentOptions(resume=session_id),
    ):
        if isinstance(message, ResultMessage):
            print(message.result)


asyncio.run(main())
```

### Custom Tools via SDK MCP Servers

Create custom tools that Claude can call:

```python
import ast
import operator
from claude_agent_sdk import tool, create_sdk_mcp_server, query, ClaudeAgentOptions

# Safe math evaluator using ast module
SAFE_OPS = {
    ast.Add: operator.add, ast.Sub: operator.sub,
    ast.Mult: operator.mul, ast.Div: operator.truediv,
}

def safe_calc(expr: str) -> float:
    tree = ast.parse(expr, mode="eval")
    return _eval_node(tree.body)

def _eval_node(node):
    if isinstance(node, ast.Constant):
        return node.value
    if isinstance(node, ast.BinOp):
        return SAFE_OPS[type(node.op)](_eval_node(node.left), _eval_node(node.right))
    raise ValueError(f"Unsupported: {type(node)}")

@tool("calculate", "Perform mathematical calculations", {"expression": str})
async def calculate(args):
    result = safe_calc(args["expression"])
    return {"content": [{"type": "text", "text": f"Result: {result}"}]}

calculator = create_sdk_mcp_server(
    name="calculator",
    tools=[calculate],
)

options = ClaudeAgentOptions(
    mcp_servers={"calc": calculator},
    allowed_tools=["mcp__calc__calculate"],
)

async for message in query(
    prompt="Calculate 42 * 17",
    options=options,
):
    pass
```

### Cost and Turn Limits

```python
async for message in query(
    prompt="Implement the feature described in SPEC.md",
    options=ClaudeAgentOptions(
        allowed_tools=["Read", "Write", "Edit", "Bash"],
        max_turns=50,
        max_budget_usd=5.00,
    ),
):
    pass
```

### Error Handling

```python
from claude_agent_sdk import (
    query, ClaudeAgentOptions,
    CLINotFoundError, CLIConnectionError, ProcessError,
)

try:
    async for message in query(
        prompt="Fix the build",
        options=ClaudeAgentOptions(allowed_tools=["Read", "Edit", "Bash"]),
    ):
        pass
except CLINotFoundError:
    print("Claude Code CLI not installed. Run: npm install -g @anthropic-ai/claude-code")
except CLIConnectionError as e:
    print(f"Connection failed: {e}")
except ProcessError as e:
    print(f"Process error: {e}")
```

## Resources

- [Agent SDK Demos](https://github.com/anthropics/claude-agent-sdk-demos) -- Full production examples (TypeScript)
- [Claude Cookbook](https://platform.claude.com/cookbook) -- Step-by-step Python recipes
- [Python SDK Reference](https://code.claude.com/docs/en/agent-sdk/python)
- [TypeScript SDK Reference](https://code.claude.com/docs/en/agent-sdk/typescript)
- [Hooks Documentation](https://code.claude.com/docs/en/agent-sdk/hooks)
- [Sessions Documentation](https://code.claude.com/docs/en/agent-sdk/sessions)
- [Permissions Documentation](https://code.claude.com/docs/en/agent-sdk/permissions)
- [MCP Documentation](https://code.claude.com/docs/en/agent-sdk/mcp)
- [Hosting Guide](https://code.claude.com/docs/en/agent-sdk/hosting)
- [Structured Outputs](https://code.claude.com/docs/en/agent-sdk/structured-outputs)
- [Subagents](https://code.claude.com/docs/en/agent-sdk/subagents)
- [User Input & Approvals](https://code.claude.com/docs/en/agent-sdk/user-input)
- [Troubleshooting](https://code.claude.com/docs/en/agent-sdk/troubleshooting)
