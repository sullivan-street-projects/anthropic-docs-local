---
title: "Agent SDK Examples"
source_url: "claude-code-guide-agent"
source_type: "manual"
fetched_at: "2026-01-31T00:00:00Z"
category: "agent-sdk"
---

# Agent SDK Examples

Practical code examples for building agents with the Claude Agent SDK.

## Streaming Agent

Real-time response with multi-turn conversation history:

```python
import asyncio
from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions, AssistantMessage, TextBlock

async def streaming_agent():
    options = ClaudeAgentOptions(
        model="claude-opus-4-5-20251101",
        allowed_tools=["Read", "Write", "Bash"],
        permission_mode="acceptEdits"
    )

    async with ClaudeSDKClient(options=options) as client:
        await client.query("What are the key features of Python?")

        async for message in client.receive_response():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        print(block.text, end="", flush=True)
        print()

        # Follow-up with context
        await client.query("Which makes it best for data science?")

        async for message in client.receive_response():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        print(block.text, end="", flush=True)

asyncio.run(streaming_agent())
```

## Structured Output Agent

Guaranteed JSON responses using `output_format` with JSON Schema:

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions, ResultMessage
from pydantic import BaseModel
from typing import List

class Feature(BaseModel):
    name: str
    description: str
    priority: str  # "high", "medium", "low"

class ProductAnalysis(BaseModel):
    product_name: str
    category: str
    key_features: List[Feature]
    market_fit_score: float
    recommendation: str

async def structured_output():
    schema = ProductAnalysis.model_json_schema()

    async for message in query(
        prompt="Analyze Python as a product: features, market fit, recommendation",
        options=ClaudeAgentOptions(
            model="claude-opus-4-5-20251101",
            output_format={"type": "json_schema", "schema": schema}
        )
    ):
        if isinstance(message, ResultMessage):
            if message.subtype == "success" and message.structured_output:
                result = ProductAnalysis.model_validate(message.structured_output)
                print(f"Product: {result.product_name}")
                print(f"Market Fit: {result.market_fit_score}")
                for f in result.key_features:
                    print(f"  - {f.name} ({f.priority}): {f.description}")

asyncio.run(structured_output())
```

## File Processing Agent

Read and write files with the automatic tool execution loop:

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, ResultMessage

async def file_agent():
    async for message in query(
        prompt="""
        1. Create a file called "data.txt" with sample data
        2. Read it back to verify
        3. Create a summary file
        Then tell me what you created.
        """,
        options=ClaudeAgentOptions(
            model="claude-opus-4-5-20251101",
            allowed_tools=["Read", "Write", "Glob", "Edit"],
            permission_mode="acceptEdits",
            cwd="/tmp"
        )
    ):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if hasattr(block, "text"):
                    print(block.text)
                elif hasattr(block, "name"):
                    print(f"Tool: {block.name}")
        elif isinstance(message, ResultMessage):
            print(f"\nDone: {message.subtype}")

asyncio.run(file_agent())
```

## Extended Thinking Agent

Complex reasoning with thinking budget:

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, TextBlock

async def thinking_agent():
    async for message in query(
        prompt="""Solve this logic puzzle:
        5 houses, 5 colors, 5 nationalities, 5 beverages, 5 pets.
        British lives in red house. Swedish has dog. Danish drinks tea.
        Green house left of white. Green house person drinks coffee.
        Who has the fish?""",
        options=ClaudeAgentOptions(
            model="claude-opus-4-5-20251101",
            max_thinking_tokens=8000
        )
    ):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if hasattr(block, 'thinking'):
                    print("=== Thinking ===")
                    print(block.thinking[:300] + "...")
                elif isinstance(block, TextBlock):
                    print("\n=== Answer ===")
                    print(block.text)

asyncio.run(thinking_agent())
```

## Multi-Step Workflow Agent

Coordinate search, document creation, and reporting:

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions, ResultMessage

async def workflow_agent():
    async for message in query(
        prompt="""
        Execute this workflow:
        1. Search for "latest AI developments 2025"
        2. Create "ai_report.md" with executive summary and key findings
        3. Create a summary for email notification
        4. Show the final report content
        """,
        options=ClaudeAgentOptions(
            model="claude-opus-4-5-20251101",
            allowed_tools=["WebSearch", "Write", "Read", "Bash"],
            permission_mode="acceptEdits"
        )
    ):
        if isinstance(message, ResultMessage):
            if message.subtype == "success":
                print("Workflow completed!")
                if message.result:
                    print(f"Result: {message.result}")

asyncio.run(workflow_agent())
```

## Image Analysis Agent

Process visual content with base64 encoding:

```python
import base64
import anthropic

def vision_agent():
    client = anthropic.Anthropic()

    # Read and encode image
    with open("screenshot.png", "rb") as f:
        image_data = base64.standard_b64encode(f.read()).decode("utf-8")

    response = client.messages.create(
        model="claude-opus-4-5-20251101",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": "image/png",
                            "data": image_data
                        }
                    },
                    {
                        "type": "text",
                        "text": "Describe what you see and identify any issues."
                    }
                ]
            }
        ]
    )

    for block in response.content:
        if hasattr(block, 'text'):
            print(block.text)

vision_agent()
```

## Prompt Caching Agent

Using cache_control for large reusable contexts:

```python
import anthropic

def caching_agent():
    client = anthropic.Anthropic()

    large_document = "..." # Large reference document

    # First request - establishes cache
    response1 = client.messages.create(
        model="claude-opus-4-5-20251101",
        max_tokens=1024,
        system=[
            {"type": "text", "text": "You are a documentation assistant."},
            {
                "type": "text",
                "text": large_document,
                "cache_control": {"type": "ephemeral"}
            }
        ],
        messages=[{"role": "user", "content": "What are the main topics?"}]
    )
    print(f"Cache creation tokens: {response1.usage.cache_creation_input_tokens}")

    # Second request - reuses cache at 10% cost
    response2 = client.messages.create(
        model="claude-opus-4-5-20251101",
        max_tokens=1024,
        system=[
            {"type": "text", "text": "You are a documentation assistant."},
            {
                "type": "text",
                "text": large_document,
                "cache_control": {"type": "ephemeral"}
            }
        ],
        messages=[{"role": "user", "content": "Which topic is most important?"}]
    )
    print(f"Cache read tokens: {response2.usage.cache_read_input_tokens}")

caching_agent()
```

## Server-Side Tools Agent

Using built-in server-side tools (web search, text editor, bash):

```python
import anthropic

def server_tools_agent():
    client = anthropic.Anthropic()

    response = client.messages.create(
        model="claude-opus-4-5-20251101",
        max_tokens=4096,
        tools=[
            {"type": "web_search_20250305", "name": "web_search", "max_uses": 5},
            {"type": "text_editor_20250728", "name": "str_replace_based_edit_tool"},
            {"type": "bash_20250124", "name": "bash"}
        ],
        messages=[
            {"role": "user", "content": "Search for Python 3.13 features and summarize the top 3."}
        ]
    )

    # Handle tool use loop
    messages = [{"role": "user", "content": "Search for Python 3.13 features and summarize."}]
    messages.append({"role": "assistant", "content": response.content})

    while response.stop_reason == "tool_use":
        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                # Server-side tools execute automatically
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": "Tool executed server-side"
                })

        messages.append({"role": "user", "content": tool_results})

        response = client.messages.create(
            model="claude-opus-4-5-20251101",
            max_tokens=4096,
            tools=[
                {"type": "web_search_20250305", "name": "web_search", "max_uses": 5}
            ],
            messages=messages
        )
        messages.append({"role": "assistant", "content": response.content})

    for block in response.content:
        if hasattr(block, 'text'):
            print(block.text)

server_tools_agent()
```

## Batch Processing Example

Process multiple requests asynchronously at 50% cost:

```python
import time
from anthropic import Anthropic
from anthropic.types.message_create_params import MessageCreateParamsNonStreaming
from anthropic.types.messages.batch_create_params import Request

def batch_processing():
    client = Anthropic()

    requests = [
        Request(
            custom_id="summary-python",
            params=MessageCreateParamsNonStreaming(
                model="claude-opus-4-5-20251101",
                max_tokens=500,
                messages=[{"role": "user", "content": "Summarize Python's key features."}]
            )
        ),
        Request(
            custom_id="code-fibonacci",
            params=MessageCreateParamsNonStreaming(
                model="claude-opus-4-5-20251101",
                max_tokens=300,
                messages=[{"role": "user", "content": "Write a Fibonacci function in Python."}]
            )
        ),
        Request(
            custom_id="sentiment",
            params=MessageCreateParamsNonStreaming(
                model="claude-opus-4-5-20251101",
                max_tokens=200,
                messages=[{"role": "user", "content": "Analyze sentiment: 'Python is amazing!'"}]
            )
        )
    ]

    # Create batch
    batch = client.messages.batches.create(requests=requests)
    print(f"Batch created: {batch.id}")

    # Poll for completion
    while True:
        batch = client.messages.batches.retrieve(batch.id)
        if batch.processing_status == "ended":
            print(f"Succeeded: {batch.request_counts.succeeded}")
            break
        print(f"Status: {batch.processing_status}")
        time.sleep(5)

    # Process results
    for result in client.messages.batches.results(batch.id):
        print(f"\n{result.custom_id}:")
        if result.result.type == "succeeded":
            print(result.result.message.content[0].text)
        elif result.result.type == "errored":
            print(f"Error: {result.result.error.message}")

    print("\nCost savings: 50% off standard API pricing")

batch_processing()
```

## Best Practices

1. **Stateful Conversations**: Use `ClaudeSDKClient` for multi-turn, `query()` for one-off
2. **Tool Use**: Minimize tool scope for better performance
3. **Streaming**: Use `include_partial_messages=True` for real-time output
4. **Structured Output**: Use `output_format` with Pydantic schemas
5. **Workflow Orchestration**: Combine tools for multi-step coordination
6. **Cost Control**: Use `max_budget_usd`, `max_turns`, and prompt caching
7. **Error Handling**: Catch `CLINotFoundError`, `ProcessError`

## Next Steps

- See [Tool Use Guide](../api/tool-use.md) for advanced tool patterns
- Review [Streaming API](../api/streaming.md) for streaming details
- Check [API Errors](../api/errors.md) for error handling
- Official docs: https://platform.claude.com/docs/en/agent-sdk/
