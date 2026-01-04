---
title: "Claude Agent SDK"
source_url: "claude-code-guide-agent"
source_type: "manual"
fetched_at: "2026-01-04T06:20:00Z"
category: "agent-sdk"
---

# Claude Agent SDK

The Claude Agent SDK is Anthropic's official framework for building production-grade AI agents powered by Claude.

## Overview

The Agent SDK provides a structured approach to creating autonomous agents that can:

- Reason about complex problems using Claude's language understanding
- Use multiple tools and integrate with external systems
- Maintain state and context across interactions
- Execute code, interact with files, search the web, and access custom tools
- Make decisions and take actions with minimal human intervention

## Use Cases

**Automation**
- Document processing and analysis
- Customer support automation
- Data extraction and transformation

**Research & Analysis**
- Code analysis and optimization
- Content research and summarization
- Document review and compliance

**Development Tools**
- AI-powered code generation
- Automated testing and validation
- Technical documentation generation

## Installation

### Python

```bash
pip install anthropic
```

### TypeScript

```bash
npm install @anthropic-ai/sdk
```

### Configuration

```bash
export ANTHROPIC_API_KEY="your-api-key"
```

## Quick Start

### Python

```python
from anthropic import Anthropic

client = Anthropic()

response = client.messages.create(
    model="claude-opus-4-5",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hello, Claude!"}
    ]
)

print(response.content[0].text)
```

### TypeScript

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const response = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 1024,
    messages: [
        { role: "user", content: "Hello, Claude!" }
    ]
});

console.log(response.content[0].text);
```

## Core Concepts

### Messages

Messages are the fundamental unit of communication:

```python
{
    "role": "user" | "assistant",
    "content": str | List[ContentBlock]
}
```

### Tools

Tools extend agent capabilities:

- **Built-in**: bash, text_editor, code_execution, web_search, web_fetch
- **Custom**: User-defined functions
- **MCP**: External tools via Model Context Protocol

### Sessions and State

Sessions maintain context across interactions:

```python
session = agent.create_session()
response1 = session.message("First question")
response2 = session.message("Follow-up based on context")
```

### Streaming

Real-time output as the agent responds:

```python
with client.messages.stream(...) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

## Architecture

```
┌─────────────────────────────────────┐
│   Your Agent Application            │
│   (Business Logic & Workflows)      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Agent Framework Layer             │
│   - Tool routing & execution        │
│   - State management                │
│   - Session persistence             │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Claude API Layer                  │
│   - Message creation & routing      │
│   - Token management                │
└─────────────────────────────────────┘
```

## Key Features

- **Declarative Tool Definition**: Describe what tools do, not how
- **Streaming First**: Real-time responses over batch
- **Reliability**: Error handling and validation built-in
- **Efficiency**: Token counting and caching for cost control
- **Flexibility**: Works with simple or complex workflows
- **Observability**: Full visibility into agent behavior

## Model Selection

```python
# Most capable
model = "claude-opus-4-5"

# High performance
model = "claude-sonnet-4-5-20250929"

# Fast, efficient
model = "claude-haiku-4-5-20251001"
```

## Next Steps

- See [Quickstart Guide](quickstart.md) for setup instructions
- See [Examples](examples.md) for code samples
- Read the [Anthropic Python SDK](../sdks/python/README.md) documentation
