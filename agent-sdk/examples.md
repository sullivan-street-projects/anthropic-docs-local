---
title: "Agent SDK Examples"
source_url: "https://platform.claude.com/docs/en/agent-sdk/overview"
source_type: "manual"
fetched_at: "2026-04-05T00:00:00Z"
category: "agent-sdk"
---

# Agent SDK Examples

Production-ready patterns for the Claude Agent SDK covering subagents, hooks, MCP integration, custom tools, sessions, permissions, and advanced configurations. All examples are derived from the official SDK documentation and demos.

> **Last updated:** April 5, 2026

## Subagent Delegation

Spawn specialized agents to handle focused subtasks. Your main agent delegates work, and subagents report back with results. Include `Agent` in `allowedTools` since subagents are invoked via the Agent tool.

### Python

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
                "test-writer": AgentDefinition(
                    description="Test generation specialist",
                    prompt="Write comprehensive tests following project conventions",
                    tools=["Read", "Write", "Edit", "Bash"],
                ),
            },
        ),
    ):
        if hasattr(message, "result"):
            print(message.result)


asyncio.run(main())
```

### TypeScript

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Use the code-reviewer agent to review this codebase",
  options: {
    allowedTools: ["Read", "Glob", "Grep", "Agent"],
    agents: {
      "code-reviewer": {
        description: "Expert code reviewer for quality and security reviews.",
        prompt: "Analyze code quality and suggest improvements.",
        tools: ["Read", "Glob", "Grep"]
      }
    }
  }
})) {
  if ("result" in message) console.log(message.result);
}
```

Messages from within a subagent's context include a `parent_tool_use_id` field, letting you track which messages belong to which subagent execution.

## Hooks for Audit Logging

Run custom code at key points in the agent lifecycle. SDK hooks use callback functions to validate, log, block, or transform agent behavior.

Available hooks: `PreToolUse`, `PostToolUse`, `Stop`, `SessionStart`, `SessionEnd`, `UserPromptSubmit`, and more.

### Python

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

### TypeScript

```typescript
import { query, HookCallback } from "@anthropic-ai/claude-agent-sdk";
import { appendFile } from "fs/promises";

const logFileChange: HookCallback = async (input) => {
  const filePath = (input as any).tool_input?.file_path ?? "unknown";
  await appendFile("./audit.log", `${new Date().toISOString()}: modified ${filePath}\n`);
  return {};
};

for await (const message of query({
  prompt: "Refactor utils.py to improve readability",
  options: {
    permissionMode: "acceptEdits",
    hooks: {
      PostToolUse: [{ matcher: "Edit|Write", hooks: [logFileChange] }]
    }
  }
})) {
  if ("result" in message) console.log(message.result);
}
```

## MCP Server Integration

Connect Claude to external services via the Model Context Protocol: databases, browsers, APIs, and [hundreds more](https://github.com/modelcontextprotocol/servers).

### Playwright Browser Automation

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

### GitHub and Slack Integration

```python
import os
from claude_agent_sdk import query, ClaudeAgentOptions

options = ClaudeAgentOptions(
    allowed_tools=[
        "Read", "Write",
        "mcp__github__list_issues",
        "mcp__github__create_issue",
        "mcp__slack__send_message",
    ],
    mcp_servers={
        "github": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-github"],
            "env": {"GITHUB_TOKEN": os.environ["GITHUB_TOKEN"]},
        },
        "slack": {
            "command": "npx",
            "args": ["-y", "@anthropic-ai/mcp-server-slack"],
            "env": {"SLACK_TOKEN": os.environ["SLACK_TOKEN"]},
        },
    },
)

async for message in query(
    prompt="Check for critical bugs and notify the team on Slack",
    options=options,
):
    pass
```

## Custom Tools via SDK MCP Servers

Create custom tools that Claude can call:

### Python

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

@tool("lookup_user", "Look up user by ID", {"user_id": str})
async def lookup_user(args):
    # In production, query your database
    return {"content": [{"type": "text", "text": f"User {args['user_id']}: John Doe"}]}

calculator = create_sdk_mcp_server(
    name="calculator",
    tools=[calculate, lookup_user],
)

options = ClaudeAgentOptions(
    mcp_servers={"calc": calculator},
    allowed_tools=["mcp__calc__calculate", "mcp__calc__lookup_user"],
)

async for message in query(
    prompt="Calculate 42 * 17 and look up user U123",
    options=options,
):
    pass
```

## Session Resumption

Maintain context across multiple exchanges. Capture the session ID from the first query, then resume to continue with full context:

### Python

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions


async def main():
    session_id = None

    # First query: capture the session ID
    async for message in query(
        prompt="Read the authentication module",
        options=ClaudeAgentOptions(allowed_tools=["Read", "Glob"]),
    ):
        if hasattr(message, "subtype") and message.subtype == "init":
            session_id = message.session_id

    # Resume with full context from the first query
    async for message in query(
        prompt="Now find all places that call it",  # "it" = auth module
        options=ClaudeAgentOptions(resume=session_id),
    ):
        if hasattr(message, "result"):
            print(message.result)


asyncio.run(main())
```

### TypeScript

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

let sessionId: string | undefined;

// First query: capture the session ID
for await (const message of query({
  prompt: "Read the authentication module",
  options: { allowedTools: ["Read", "Glob"] }
})) {
  if (message.type === "system" && message.subtype === "init") {
    sessionId = message.session_id;
  }
}

// Resume with full context from the first query
for await (const message of query({
  prompt: "Now find all places that call it", // "it" = auth module
  options: { resume: sessionId }
})) {
  if ("result" in message) console.log(message.result);
}
```

## Permission Callbacks

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
        can_use_tool=can_use_tool,
    ),
):
    pass
```

## Read-Only Analysis Agent

Create a read-only agent that can analyze but not modify code:

```python
async for message in query(
    prompt="Review this code for best practices",
    options=ClaudeAgentOptions(
        allowed_tools=["Read", "Glob", "Grep"],
    ),
):
    if hasattr(message, "result"):
        print(message.result)
```

## Sandbox Configuration

Run agents with OS-level isolation:

### TypeScript

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Build and test the project",
  options: {
    allowedTools: ["Read", "Edit", "Bash"],
    sandbox: {
      enabled: true,
      autoAllowBashIfSandboxed: true,
      network: {
        allowLocalBinding: true
      }
    }
  }
})) {
  if ("result" in message) console.log(message.result);
}
```

### With Unsandboxed Commands

```typescript
for await (const message of query({
  prompt: "Deploy the application",
  options: {
    sandbox: {
      enabled: true,
      allowUnsandboxedCommands: true
    },
    permissionMode: "default",
    canUseTool: async (tool, input) => {
      if (tool === "Bash" && input.dangerouslyDisableSandbox) {
        console.log(`Unsandboxed command: ${input.command}`);
        return isCommandAuthorized(input.command);
      }
      return true;
    }
  }
})) {
  if ("result" in message) console.log(message.result);
}
```

## CI/CD Pipeline Agent

Automated code review and testing in CI:

### Python

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions


async def ci_review():
    results = []
    async for message in query(
        prompt="""Review the changes in this PR:
        1. Check for bugs and security issues
        2. Verify test coverage
        3. Ensure code style consistency
        Output a structured review.""",
        options=ClaudeAgentOptions(
            allowed_tools=["Read", "Glob", "Grep", "Bash"],
            permission_mode="bypassPermissions",
            max_turns=30,
            max_budget_usd=2.00,
            cwd="/workspace",
        ),
    ):
        if hasattr(message, "result"):
            results.append(message.result)
    return "\n".join(results)


asyncio.run(ci_review())
```

## TODO Comment Finder

Search your codebase for TODO comments:

### Python

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions


async def main():
    async for message in query(
        prompt="Find all TODO comments and create a summary",
        options=ClaudeAgentOptions(allowed_tools=["Read", "Glob", "Grep"]),
    ):
        if hasattr(message, "result"):
            print(message.result)


asyncio.run(main())
```

## Structured Output

Get typed, validated responses:

### TypeScript

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

const schema = {
  type: "object",
  properties: {
    bugs: {
      type: "array",
      items: {
        type: "object",
        properties: {
          file: { type: "string" },
          line: { type: "number" },
          severity: { enum: ["low", "medium", "high", "critical"] },
          description: { type: "string" }
        },
        required: ["file", "line", "severity", "description"]
      }
    },
    summary: { type: "string" }
  },
  required: ["bugs", "summary"]
};

for await (const message of query({
  prompt: "Analyze the codebase for bugs",
  options: {
    allowedTools: ["Read", "Glob", "Grep"],
    outputFormat: { type: "json_schema", schema }
  }
})) {
  if ("result" in message) {
    const report = JSON.parse(message.result);
    console.log(`Found ${report.bugs.length} bugs`);
  }
}
```

## Cost and Turn Limits

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

## Loading Project Settings

```python
# Load CLAUDE.md from project directory
async for message in query(
    prompt="Follow the project conventions and add tests",
    options=ClaudeAgentOptions(
        allowed_tools=["Read", "Write", "Edit", "Bash"],
        setting_sources=["project"],
        cwd="/path/to/project",
    ),
):
    pass
```

## Error Handling

### Python

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

## Custom System Prompt

```python
options = ClaudeAgentOptions(
    allowed_tools=["Read", "Edit", "Glob"],
    permission_mode="acceptEdits",
    system_prompt="You are a senior Python developer. Always follow PEP 8 style guidelines.",
)
```

## Resources

- [Agent SDK Demos](https://github.com/anthropics/claude-agent-sdk-demos) -- Full production examples
- [Python SDK Reference](https://platform.claude.com/docs/en/agent-sdk/python)
- [TypeScript SDK Reference](https://platform.claude.com/docs/en/agent-sdk/typescript)
- [Hooks Documentation](https://platform.claude.com/docs/en/agent-sdk/hooks)
- [Sessions Documentation](https://platform.claude.com/docs/en/agent-sdk/sessions)
- [Permissions Documentation](https://platform.claude.com/docs/en/agent-sdk/permissions)
- [MCP Documentation](https://platform.claude.com/docs/en/agent-sdk/mcp)
- [Hosting Guide](https://platform.claude.com/docs/en/agent-sdk/hosting)
