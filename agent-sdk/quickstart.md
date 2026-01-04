---
title: "Agent SDK Quickstart"
source_url: "claude-code-guide-agent"
source_type: "manual"
fetched_at: "2026-01-04T06:20:00Z"
category: "agent-sdk"
---

# Claude Agent SDK Quickstart

Get started building agents with Claude in minutes.

## Installation

### Python

```bash
pip install anthropic
```

### TypeScript

```bash
npm install @anthropic-ai/sdk
```

## Configuration

Set your API key:

```bash
export ANTHROPIC_API_KEY="your-api-key"
```

## Basic Agent

### Python

```python
from anthropic import Anthropic

client = Anthropic()

# Simple message
response = client.messages.create(
    model="claude-opus-4-5",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "What is the capital of France?"}
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
        { role: "user", content: "What is the capital of France?" }
    ]
});

console.log(response.content[0].text);
```

## Agent with Tools

Define tools that Claude can use:

```python
from anthropic import Anthropic

client = Anthropic()

# Define tools
tools = [
    {
        "name": "get_weather",
        "description": "Get current weather for a location",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "City name"
                }
            },
            "required": ["location"]
        }
    }
]

# Make request with tools
response = client.messages.create(
    model="claude-opus-4-5",
    max_tokens=1024,
    tools=tools,
    messages=[
        {"role": "user", "content": "What's the weather in Paris?"}
    ]
)

# Handle tool use
for block in response.content:
    if block.type == "tool_use":
        print(f"Tool: {block.name}")
        print(f"Input: {block.input}")
```

## Tool Execution Loop

Complete agent loop with tool execution:

```python
from anthropic import Anthropic

client = Anthropic()

tools = [
    {
        "name": "get_weather",
        "description": "Get current weather for a location",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {"type": "string"}
            },
            "required": ["location"]
        }
    }
]

def execute_tool(name: str, input_data: dict) -> str:
    """Execute a tool and return result."""
    if name == "get_weather":
        location = input_data.get("location", "Unknown")
        return f"Weather in {location}: 72°F, sunny"
    return "Tool not found"

def run_agent(user_message: str) -> str:
    messages = [{"role": "user", "content": user_message}]

    while True:
        response = client.messages.create(
            model="claude-opus-4-5",
            max_tokens=4096,
            tools=tools,
            messages=messages
        )

        # Add assistant response to history
        messages.append({
            "role": "assistant",
            "content": response.content
        })

        # Check if we need to execute tools
        if response.stop_reason == "tool_use":
            tool_results = []
            for block in response.content:
                if block.type == "tool_use":
                    result = execute_tool(block.name, block.input)
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": result
                    })

            messages.append({
                "role": "user",
                "content": tool_results
            })
        else:
            # No more tool calls, return final response
            for block in response.content:
                if hasattr(block, 'text'):
                    return block.text
            return ""

# Run the agent
result = run_agent("What's the weather like in Tokyo?")
print(result)
```

## Streaming Responses

Get real-time output:

```python
from anthropic import Anthropic

client = Anthropic()

with client.messages.stream(
    model="claude-opus-4-5",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Tell me a story"}
    ]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

## Multi-Turn Conversations

Maintain context across messages:

```python
from anthropic import Anthropic

client = Anthropic()
messages = []

def chat(user_message: str) -> str:
    messages.append({
        "role": "user",
        "content": user_message
    })

    response = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=1024,
        messages=messages
    )

    assistant_message = response.content[0].text
    messages.append({
        "role": "assistant",
        "content": assistant_message
    })

    return assistant_message

# Multi-turn conversation
print(chat("My name is Alice"))
print(chat("What's my name?"))  # Claude remembers "Alice"
```

## System Prompts

Guide agent behavior:

```python
from anthropic import Anthropic

client = Anthropic()

response = client.messages.create(
    model="claude-opus-4-5",
    max_tokens=1024,
    system="You are a helpful coding assistant. Always provide code examples.",
    messages=[
        {"role": "user", "content": "How do I read a file in Python?"}
    ]
)

print(response.content[0].text)
```

## Model Selection

Choose the right model for your task:

```python
# Most capable - complex reasoning
model = "claude-opus-4-5"

# High performance - general tasks
model = "claude-sonnet-4-5-20250929"

# Fast and efficient - simple tasks
model = "claude-haiku-4-5-20251001"
```

## Error Handling

Handle API errors gracefully:

```python
from anthropic import Anthropic, APIError, RateLimitError

client = Anthropic()

try:
    response = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=1024,
        messages=[{"role": "user", "content": "Hello"}]
    )
except RateLimitError:
    print("Rate limit exceeded, please wait")
except APIError as e:
    print(f"API error: {e.message}")
```

## Next Steps

- See [Examples](examples.md) for more patterns
- Read the [Python SDK README](../sdks/python/README.md)
- Explore [Tool Use Guide](../api/tool-use.md)
