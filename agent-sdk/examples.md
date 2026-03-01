---
title: "Agent SDK Examples"
source_url: "https://platform.claude.com/docs/en/agent-sdk/overview"
source_type: "manual"
fetched_at: "2026-02-28T00:00:00Z"
category: "agent-sdk"
---

# Agent SDK Examples

Production-ready patterns for the Claude Agent SDK covering subagents, hooks, MCP integration, custom tools, and advanced configurations.

> **Last updated:** February 16, 2026

## Subagent Delegation

Delegate specialized tasks to subagents with focused toolsets:

### Python

```python
from claude_agent_sdk import query, ClaudeAgentOptions, AgentDefinition

options = ClaudeAgentOptions(
    allowed_tools=["Read", "Glob", "Grep", "Task"],
    agents={
        "code-reviewer": AgentDefinition(
            description="Expert code reviewer for quality analysis",
            prompt="Analyze code quality, identify bugs, and suggest improvements",
            tools=["Read", "Glob", "Grep"]
        ),
        "test-writer": AgentDefinition(
            description="Test generation specialist",
            prompt="Write comprehensive tests following project conventions",
            tools=["Read", "Write", "Edit", "Bash"]
        )
    }
)

async for message in query(
    prompt="Review auth module and add missing tests",
    options=options
):
    if hasattr(message, "result"):
        print(message.result)
```

## Hooks for Audit Logging

Intercept tool usage for compliance and audit trails:

### Python

```python
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

options = ClaudeAgentOptions(
    allowed_tools=["Read", "Edit", "Write", "Bash"],
    hooks={
        "PostToolUse": [
            HookMatcher(matcher="Edit|Write", hooks=[log_file_change])
        ],
        "PreToolUse": [
            HookMatcher(matcher="Edit|Write", hooks=[block_env_files])
        ]
    }
)
```

## MCP Server Integration

Connect Claude to external services via MCP:

### Python

```python
import os
from claude_agent_sdk import query, ClaudeAgentOptions

options = ClaudeAgentOptions(
    allowed_tools=[
        "Read", "Write",
        "mcp__github__list_issues",
        "mcp__github__create_issue",
        "mcp__slack__send_message"
    ],
    mcp_servers={
        "github": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-github"],
            "env": {"GITHUB_TOKEN": os.environ["GITHUB_TOKEN"]}
        },
        "slack": {
            "command": "npx",
            "args": ["-y", "@anthropic-ai/mcp-server-slack"],
            "env": {"SLACK_TOKEN": os.environ["SLACK_TOKEN"]}
        }
    }
)

async for message in query(
    prompt="Check for critical bugs and notify the team on Slack",
    options=options
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
SAFE_OPS = {ast.Add: operator.add, ast.Sub: operator.sub,
            ast.Mult: operator.mul, ast.Div: operator.truediv}

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
    tools=[calculate, lookup_user]
)

options = ClaudeAgentOptions(
    mcp_servers={"calc": calculator},
    allowed_tools=["mcp__calc__calculate", "mcp__calc__lookup_user"]
)

async for message in query(
    prompt="Calculate 42 * 17 and look up user U123",
    options=options
):
    pass
```

## Sandbox Configuration

Run agents with OS-level isolation:

### TypeScript

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

const result = await query({
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
});
```

### With Unsandboxed Commands

```typescript
const result = await query({
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
});
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
            cwd="/workspace"
        )
    ):
        if hasattr(message, "result"):
            results.append(message.result)
    return "\n".join(results)

asyncio.run(ci_review())
```

## Multi-Turn Conversation Client

Interactive agent with session persistence:

### Python

```python
from claude_agent_sdk import ClaudeSDKClient

async def interactive_session():
    client = ClaudeSDKClient(
        options={
            "allowed_tools": ["Read", "Edit", "Bash", "Glob", "Grep"],
            "setting_sources": ["project"],
            "cwd": "/path/to/project"
        }
    )

    # First exchange
    response1 = await client.send("Explain the project architecture")
    print(response1.text)

    # Follow-up with full context
    response2 = await client.send("Now add a new API endpoint for /users")
    print(response2.text)

    # Another follow-up
    response3 = await client.send("Write tests for the new endpoint")
    print(response3.text)
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

## Error Handling

### Python

```python
from claude_agent_sdk import (
    query, ClaudeAgentOptions,
    CLINotFoundError, CLIConnectionError, ProcessError
)

try:
    async for message in query(
        prompt="Fix the build",
        options=ClaudeAgentOptions(allowed_tools=["Read", "Edit", "Bash"])
    ):
        pass
except CLINotFoundError:
    print("Claude Code CLI not installed. Run: npm install -g @anthropic-ai/claude-code")
except CLIConnectionError as e:
    print(f"Connection failed: {e}")
except ProcessError as e:
    print(f"Process error: {e}")
```

## Beta Features

### 1M Context Window

```python
options = ClaudeAgentOptions(
    model="claude-opus-4-6",
    betas=["context-1m-2025-08-07"]
)
```

Compatible with: Claude Opus 4.6, Claude Sonnet 4.5, Claude Sonnet 4.

## Resources

- [Agent SDK Demos](https://github.com/anthropics/claude-agent-sdk-demos) — Full production examples
- [Python SDK Reference](https://platform.claude.com/docs/en/agent-sdk/python)
- [TypeScript SDK Reference](https://platform.claude.com/docs/en/agent-sdk/typescript)
- [Hooks Documentation](https://platform.claude.com/docs/en/agent-sdk/hooks)
- [Sessions Documentation](https://platform.claude.com/docs/en/agent-sdk/sessions)
- [Secure Deployment](https://platform.claude.com/docs/en/agent-sdk/secure-deployment)
