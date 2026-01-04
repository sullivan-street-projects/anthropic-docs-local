---
title: "Agent SDK Examples"
source_url: "claude-code-guide-agent"
source_type: "manual"
fetched_at: "2026-01-04T06:20:00Z"
category: "agent-sdk"
---

# Agent SDK Examples

Practical code examples for building agents with Claude.

## Streaming Agent

Real-time response output:

```python
from anthropic import Anthropic

def create_streaming_agent():
    client = Anthropic()
    messages = []

    def chat_stream(user_message: str):
        messages.append({
            "role": "user",
            "content": user_message
        })

        with client.messages.stream(
            model="claude-opus-4-5",
            max_tokens=1024,
            messages=messages
        ) as stream:
            full_response = ""

            for text in stream.text_stream:
                print(text, end="", flush=True)
                full_response += text

            print()  # New line
            messages.append({
                "role": "assistant",
                "content": full_response
            })

            return full_response

    return chat_stream

# Usage
chat = create_streaming_agent()
chat("Tell me about AI in 3 paragraphs")
```

## Structured Output Agent

Guaranteed JSON responses:

```python
from anthropic import Anthropic
import json

def create_json_agent():
    client = Anthropic()

    response_schema = {
        "type": "json_schema",
        "json_schema": {
            "name": "analysis_result",
            "strict": True,
            "schema": {
                "type": "object",
                "properties": {
                    "summary": {"type": "string"},
                    "sentiment": {
                        "type": "string",
                        "enum": ["positive", "negative", "neutral"]
                    },
                    "score": {"type": "number"},
                    "topics": {
                        "type": "array",
                        "items": {"type": "string"}
                    }
                },
                "required": ["summary", "sentiment", "score", "topics"]
            }
        }
    }

    def analyze(text: str) -> dict:
        response = client.messages.create(
            model="claude-opus-4-5",
            max_tokens=1024,
            response_format=response_schema,
            messages=[
                {"role": "user", "content": f"Analyze: {text}"}
            ]
        )

        return json.loads(response.content[0].text)

    return analyze

# Usage
analyzer = create_json_agent()
result = analyzer("I love this product! Highly recommend!")
print(json.dumps(result, indent=2))
```

## File Processing Agent

Read and write files:

```python
from anthropic import Anthropic

def create_file_agent():
    client = Anthropic()

    tools = [
        {
            "name": "read_file",
            "description": "Read file contents",
            "input_schema": {
                "type": "object",
                "properties": {
                    "path": {"type": "string"}
                },
                "required": ["path"]
            }
        },
        {
            "name": "write_file",
            "description": "Write content to file",
            "input_schema": {
                "type": "object",
                "properties": {
                    "path": {"type": "string"},
                    "content": {"type": "string"}
                },
                "required": ["path", "content"]
            }
        }
    ]

    def execute_tool(name: str, input_data: dict) -> str:
        if name == "read_file":
            try:
                with open(input_data["path"], 'r') as f:
                    return f.read()
            except Exception as e:
                return f"Error: {e}"

        elif name == "write_file":
            try:
                with open(input_data["path"], 'w') as f:
                    f.write(input_data["content"])
                return f"File written: {input_data['path']}"
            except Exception as e:
                return f"Error: {e}"

        return "Unknown tool"

    messages = []

    def process(user_input: str) -> str:
        messages.append({"role": "user", "content": user_input})

        while True:
            response = client.messages.create(
                model="claude-opus-4-5",
                max_tokens=4096,
                tools=tools,
                messages=messages
            )

            messages.append({
                "role": "assistant",
                "content": response.content
            })

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
                for block in response.content:
                    if hasattr(block, 'text'):
                        return block.text
                return ""

    return process

# Usage
agent = create_file_agent()
agent("Create a file called hello.py with a hello world program")
```

## Extended Thinking Agent

Complex reasoning with thinking:

```python
from anthropic import Anthropic

def create_thinking_agent():
    client = Anthropic()

    def solve(problem: str) -> str:
        response = client.messages.create(
            model="claude-opus-4-5",
            max_tokens=16000,
            thinking={
                "type": "enabled",
                "budget_tokens": 10000
            },
            messages=[
                {"role": "user", "content": problem}
            ]
        )

        # Response includes thinking and text blocks
        for block in response.content:
            if block.type == "thinking":
                print(f"[Thinking]: {block.thinking[:200]}...")
            elif block.type == "text":
                return block.text

        return ""

    return solve

# Usage
agent = create_thinking_agent()
answer = agent("Solve this logic puzzle: ...")
print(answer)
```

## Multi-Step Workflow Agent

Coordinate complex processes:

```python
from anthropic import Anthropic

def create_workflow_agent():
    client = Anthropic()

    tools = [
        {
            "name": "search",
            "description": "Search for information",
            "input_schema": {
                "type": "object",
                "properties": {
                    "query": {"type": "string"}
                },
                "required": ["query"]
            }
        },
        {
            "name": "create_document",
            "description": "Create a document",
            "input_schema": {
                "type": "object",
                "properties": {
                    "title": {"type": "string"},
                    "content": {"type": "string"}
                },
                "required": ["title", "content"]
            }
        },
        {
            "name": "send_email",
            "description": "Send an email",
            "input_schema": {
                "type": "object",
                "properties": {
                    "to": {"type": "string"},
                    "subject": {"type": "string"},
                    "body": {"type": "string"}
                },
                "required": ["to", "subject", "body"]
            }
        }
    ]

    executors = {
        "search": lambda q: f"Found results for: {q}",
        "create_document": lambda t, c: f"Document '{t}' created",
        "send_email": lambda to, s, b: f"Email sent to {to}"
    }

    system = """You are a workflow coordinator.
    Break down complex tasks and execute them step by step."""

    messages = []

    def execute(user_request: str) -> str:
        messages.append({"role": "user", "content": user_request})

        while True:
            response = client.messages.create(
                model="claude-opus-4-5",
                max_tokens=4096,
                system=system,
                tools=tools,
                messages=messages
            )

            messages.append({
                "role": "assistant",
                "content": response.content
            })

            if response.stop_reason == "tool_use":
                tool_results = []
                for block in response.content:
                    if block.type == "tool_use":
                        exec_fn = executors.get(block.name)
                        result = exec_fn(**block.input) if exec_fn else "Unknown"
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
                for block in response.content:
                    if hasattr(block, 'text'):
                        return block.text
                return ""

    return execute

# Usage
agent = create_workflow_agent()
result = agent("""
Research AI trends, create a summary document,
and email it to team@company.com
""")
print(result)
```

## Image Analysis Agent

Process visual content:

```python
import base64
from anthropic import Anthropic

def create_vision_agent():
    client = Anthropic()

    def analyze_image(image_path: str, question: str) -> str:
        # Read and encode image
        with open(image_path, "rb") as f:
            image_data = base64.standard_b64encode(f.read()).decode("utf-8")

        # Determine media type
        if image_path.endswith(".png"):
            media_type = "image/png"
        elif image_path.endswith(".jpg") or image_path.endswith(".jpeg"):
            media_type = "image/jpeg"
        else:
            media_type = "image/png"

        response = client.messages.create(
            model="claude-opus-4-5",
            max_tokens=1024,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": media_type,
                                "data": image_data
                            }
                        },
                        {
                            "type": "text",
                            "text": question
                        }
                    ]
                }
            ]
        )

        return response.content[0].text

    return analyze_image

# Usage
agent = create_vision_agent()
description = agent("screenshot.png", "Describe what you see in this image")
print(description)
```

## Best Practices Demonstrated

1. **Stateful Conversation**: Maintaining message history
2. **Tool Use**: Defining and executing tools safely
3. **Streaming**: Real-time response generation
4. **Structured Output**: JSON-format responses
5. **Workflow Orchestration**: Multi-step coordination
6. **Vision**: Processing images

## Next Steps

- See [Tool Use Guide](../api/tool-use.md) for advanced tool patterns
- Review [Streaming API](../api/streaming.md) for streaming details
- Check [API Errors](../api/errors.md) for error handling
