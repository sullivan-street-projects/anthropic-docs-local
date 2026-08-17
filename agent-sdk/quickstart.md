---
title: "Agent SDK Quickstart"
source_url: "https://platform.claude.com/docs/en/agent-sdk/quickstart"
source_type: "manual"
fetched_at: "2026-08-17T00:00:00Z"
category: "agent-sdk"
---

# Claude Agent SDK Quickstart

Get started with the Python or TypeScript Agent SDK to build AI agents that work autonomously. This quickstart walks you through building an agent that reads your code, finds bugs, and fixes them without manual intervention.

> **Last updated:** August 17, 2026

**What you'll do:**

1. Set up a project with the Agent SDK
2. Create a file with some buggy code
3. Run an agent that finds and fixes the bugs automatically

## Prerequisites

- **Node.js 18+** or **Python 3.10+**
- An **Anthropic account** ([sign up here](https://platform.claude.com/))

## Setup

### 1. Create a Project Folder

```bash
mkdir my-agent && cd my-agent
```

For your own projects, you can run the SDK from any folder; it will have access to files in that directory and its subdirectories by default.

### 2. Install the SDK

#### TypeScript (new project)

```bash
npm init -y
npm pkg set type=module
npm install @anthropic-ai/claude-agent-sdk
npm install --save-dev tsx
```

Setting `"type": "module"` in `package.json` lets your agent script use top-level `await`, and [tsx](https://tsx.is) runs TypeScript files directly.

#### TypeScript (existing project)

```bash
npm install @anthropic-ai/claude-agent-sdk
npm install --save-dev tsx
```

[tsx](https://tsx.is) runs TypeScript files directly. If your project uses CommonJS, name your agent script `agent.mts` instead of `agent.ts`. The `.mts` extension makes tsx treat the file as an ES module, so top-level `await` works without converting your whole project to ES modules. Use `agent.mts` in place of `agent.ts` in the create and run steps later in this quickstart.

#### Python (uv -- recommended)

[uv](https://docs.astral.sh/uv/) is a fast Python package manager that handles virtual environments automatically:

```bash
uv init && uv add claude-agent-sdk
```

#### Python (pip)

Create and activate a virtual environment, then install:

**macOS / Linux:**

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install claude-agent-sdk
```

**Windows (PowerShell):**

```powershell
py -m venv .venv
.venv\Scripts\Activate.ps1
pip install claude-agent-sdk
```

If PowerShell blocks `Activate.ps1` with an execution policy error, run `Set-ExecutionPolicy -Scope Process RemoteSigned` first.

> **Note:** Both the TypeScript and Python SDKs now bundle a native Claude Code binary for your platform, so you don't need to install Claude Code separately.

### 3. Set Your API Key

Set your API key as an environment variable in the shell where you'll run your agent:

**macOS / Linux:**

```bash
export ANTHROPIC_API_KEY=your-api-key
```

**Windows (PowerShell):**

```powershell
$env:ANTHROPIC_API_KEY = "your-api-key"
```

The SDK reads the key from the environment of the process that runs your agent; it doesn't load `.env` files automatically. If you keep the key in a `.env` file, load it yourself (for example with the `dotenv` package) before calling the SDK.

The SDK also supports authentication via third-party API providers:

- **Amazon Bedrock**: set `CLAUDE_CODE_USE_BEDROCK=1` and configure AWS credentials
- **Claude Platform on AWS**: set `CLAUDE_CODE_USE_ANTHROPIC_AWS=1` and `ANTHROPIC_AWS_WORKSPACE_ID`, then configure AWS credentials
- **Google Cloud's Agent Platform** (Vertex AI): set `CLAUDE_CODE_USE_VERTEX=1` and configure Google Cloud credentials
- **Microsoft Foundry** (Azure): set `CLAUDE_CODE_USE_FOUNDRY=1` and configure Azure credentials

See the setup guides for [Bedrock](https://code.claude.com/docs/en/amazon-bedrock), [Claude Platform on AWS](https://code.claude.com/docs/en/claude-platform-on-aws), [Vertex AI](https://code.claude.com/docs/en/google-vertex-ai), or [Azure AI Foundry](https://code.claude.com/docs/en/microsoft-foundry) for details.

> **Note:** Unless previously approved, Anthropic does not allow third party developers to offer claude.ai login or rate limits for their products, including agents built on the Claude Agent SDK. Use the API key authentication methods instead.

## Create a Buggy File

Create `utils.py` in the `my-agent` directory with intentional bugs for the agent to fix:

```python
def calculate_average(numbers):
    total = 0
    for num in numbers:
        total += num
    return total / len(numbers)


def get_user_name(user):
    return user["name"].upper()
```

This code has two bugs:

1. `calculate_average([])` crashes with division by zero
2. `get_user_name(None)` crashes with a TypeError

## Build the Bug-Fixing Agent

### Python

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, ResultMessage


async def main():
    # Agentic loop: streams messages as Claude works
    async for message in query(
        prompt="Review utils.py for bugs that would cause crashes. Fix any issues you find.",
        options=ClaudeAgentOptions(
            allowed_tools=["Read", "Edit", "Glob"],  # Auto-approve these tools
            permission_mode="acceptEdits",  # Auto-approve file edits
        ),
    ):
        # Print human-readable output
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if hasattr(block, "text"):
                    print(block.text)  # Claude's reasoning
                elif hasattr(block, "name"):
                    print(f"Tool: {block.name}")  # Tool being called
        elif isinstance(message, ResultMessage):
            print(f"Done: {message.subtype}")  # Final result


asyncio.run(main())
```

### TypeScript

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

// Agentic loop: streams messages as Claude works
for await (const message of query({
  prompt:
    "Review utils.py for bugs that would cause crashes. Fix any issues you find.",
  options: {
    allowedTools: ["Read", "Edit", "Glob"], // Auto-approve these tools
    permissionMode: "acceptEdits", // Auto-approve file edits
  },
})) {
  // Print human-readable output
  if (message.type === "assistant" && message.message?.content) {
    for (const block of message.message.content) {
      if ("text" in block) {
        console.log(block.text); // Claude's reasoning
      } else if ("name" in block) {
        console.log(`Tool: ${block.name}`); // Tool being called
      }
    }
  } else if (message.type === "result") {
    console.log(`Done: ${message.subtype}`); // Final result
  }
}
```

### How It Works

1. **`query`**: the main entry point that creates the agentic loop. Returns an async iterator that streams messages as Claude works. See the full API in the [Python](https://code.claude.com/docs/en/agent-sdk/python#query) or [TypeScript](https://code.claude.com/docs/en/agent-sdk/typescript#query) SDK reference.

2. **`prompt`**: what you want Claude to do. Claude figures out which tools to use based on the task.

3. **`options`**: configuration for the agent. `allowedTools` pre-approves specific tools, and `permissionMode: "acceptEdits"` auto-approves file changes. Other options include `systemPrompt`, `mcpServers`, and more. See all options for [Python](https://code.claude.com/docs/en/agent-sdk/python#claudeagentoptions) or [TypeScript](https://code.claude.com/docs/en/agent-sdk/typescript#options).

The `async for` loop keeps running as Claude thinks, calls tools, observes results, and decides what to do next. Each iteration yields a message: Claude's reasoning, a tool call, a tool result, or the final outcome. The SDK handles orchestration (tool execution, context management, retries) so you just consume the stream. The loop ends when Claude finishes the task or hits an error.

The message handling inside the loop filters for human-readable output. Without filtering, you'd see raw message objects including system initialization and internal state, which is useful for debugging but noisy otherwise.

### Run Your Agent

#### TypeScript

```bash
npx tsx agent.ts
```

If you named your script `agent.mts`, run `npx tsx agent.mts` instead.

#### Python (uv)

```bash
uv run agent.py
```

#### Python (pip)

With your virtual environment still activated:

```bash
python agent.py
```

After running, check `utils.py`. You'll see defensive code handling empty lists and null users. Your agent autonomously:

1. **Read** `utils.py` to understand the code
2. **Analyzed** the logic and identified edge cases that would crash
3. **Edited** the file to add proper error handling

> **Tip:** If you see "API key not found", make sure you've set the `ANTHROPIC_API_KEY` environment variable in the shell where you run your agent. The SDK doesn't load `.env` files automatically. See the [full troubleshooting guide](https://code.claude.com/docs/en/troubleshooting) for more help.

## Try Other Prompts

- `"Add docstrings to all functions in utils.py"`
- `"Add type hints to all functions in utils.py"`
- `"Create a README.md documenting the functions in utils.py"`

## Customize Your Agent

### Add Web Search Capability

```python
options = ClaudeAgentOptions(
    allowed_tools=["Read", "Edit", "Glob", "WebSearch"],
    permission_mode="acceptEdits"
)
```

### Give Claude a Custom System Prompt

```python
options = ClaudeAgentOptions(
    allowed_tools=["Read", "Edit", "Glob"],
    permission_mode="acceptEdits",
    system_prompt="You are a senior Python developer. Always follow PEP 8 style guidelines.",
)
```

### Run Commands in the Terminal

```python
options = ClaudeAgentOptions(
    allowed_tools=["Read", "Edit", "Glob", "Bash"],
    permission_mode="acceptEdits"
)
```

With `Bash` enabled, try: `"Write unit tests for utils.py, run them, and fix any failures"`

## Key Concepts

### Tools

Tools control what your agent can do:

| Tools                                  | What the agent can do   |
| -------------------------------------- | ----------------------- |
| `Read`, `Glob`, `Grep`                 | Read-only analysis      |
| `Read`, `Edit`, `Glob`                 | Analyze and modify code |
| `Read`, `Edit`, `Bash`, `Glob`, `Grep` | Full automation         |

### Permission Modes

Permission modes control how much human oversight you want:

| Mode                | Behavior                                                                                      | Use case                                  |
| ------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `acceptEdits`       | Auto-approves file edits and common filesystem commands, asks for other actions               | Trusted development workflows             |
| `plan`              | Runs read-only tools; file edits are never auto-approved and reach your `canUseTool` callback | Scoping a task before approving execution |
| `auto`              | A model classifier approves or denies each tool call                                          | Autonomous agents with safety guardrails  |
| `dontAsk`           | Denies anything not in `allowedTools`                                                         | Locked-down headless agents               |
| `bypassPermissions` | Runs every tool without prompting, unless an explicit `ask` rule matches                      | Sandboxed CI, fully trusted environments  |
| `default`           | Requires a `canUseTool` callback to handle approval                                           | Custom approval flows                     |

The quickstart uses `acceptEdits` mode, which auto-approves file operations so the agent can run without interactive prompts. If you want to prompt users for approval, use `default` mode and provide a [`canUseTool` callback](https://code.claude.com/docs/en/agent-sdk/user-input) that collects user input. For more control, see [Permissions](https://code.claude.com/docs/en/agent-sdk/permissions).

## Streaming vs Single-Turn Mode

The quickstart uses streaming to show progress in real-time. If you don't need live output (e.g., for background jobs or CI pipelines), you can collect all messages at once. See [Streaming vs. single-turn mode](https://code.claude.com/docs/en/agent-sdk/streaming-vs-single-mode) for details.

## Next Steps

- [Permissions](https://code.claude.com/docs/en/agent-sdk/permissions) -- control what your agent can do and when it needs approval
- [Hooks](https://code.claude.com/docs/en/agent-sdk/hooks) -- run custom code before or after tool calls
- [Sessions](https://code.claude.com/docs/en/agent-sdk/sessions) -- build multi-turn agents that maintain context
- [MCP servers](https://code.claude.com/docs/en/agent-sdk/mcp) -- connect to databases, browsers, APIs, and other external systems
- [Hosting](https://code.claude.com/docs/en/agent-sdk/hosting) -- deploy agents to Docker, cloud, and CI/CD
- [Example agents](https://github.com/anthropics/claude-agent-sdk-demos) -- see complete examples: email assistant, research agent, and more
