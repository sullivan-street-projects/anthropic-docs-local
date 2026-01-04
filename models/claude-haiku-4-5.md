---
title: "Claude Haiku 4.5"
source_url: "https://docs.anthropic.com/en/docs/about-claude/models"
source_type: "web-extracted"
fetched_at: "2026-01-04T06:05:00Z"
category: "models"
---

# Claude Haiku 4.5

Claude Haiku 4.5 is Anthropic's fastest, most cost-efficient model. Released October 15, 2025.

## Model Details

| Property | Value |
|----------|-------|
| **Model ID** | `claude-haiku-4-5-20251001` |
| **Context Window** | 200,000 tokens |
| **Max Output** | 64,000 tokens |
| **Training Cutoff** | April 2025 |
| **Release Date** | October 15, 2025 |

## Pricing

| Usage Type | Cost |
|------------|------|
| Base Input | $1 / MTok |
| Output | $5 / MTok |
| Batch Input | $0.50 / MTok |
| Batch Output | $2.50 / MTok |
| 5m Cache Write | $1.25 / MTok |
| 1h Cache Write | $2 / MTok |
| Cache Read | $0.10 / MTok |

## Key Features

### Performance Breakthrough
Haiku 4.5 matches Sonnet 4's performance on:
- Coding tasks
- Computer use
- Agent workflows

...at **one-third the cost** and **more than twice the speed**.

### Extended Max Output
First Haiku to support 64K output tokens, enabling:
- Long-form content generation
- Extensive code generation
- Detailed analysis

### First Haiku with Extended Thinking
```json
{
  "thinking": {
    "type": "enabled",
    "budget_tokens": 8000
  }
}
```

### Computer Use
Full computer use support:
- Screen capture and analysis
- Mouse and keyboard control
- Multi-application workflows

### Vision
Complete vision capabilities:
- Image understanding
- Document processing
- Chart analysis

## Use Cases

### High-Volume Processing
```python
# Process thousands of requests cost-effectively
for doc in documents:
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1024,
        messages=[{"role": "user", "content": f"Summarize: {doc}"}]
    )
```

### Real-Time Applications
- Chatbots and virtual assistants
- Live customer support
- Interactive coding tools

### Cost-Sensitive Workloads
- Batch document processing
- Data extraction
- Classification tasks

### Agent Subroutines
- Quick tool calls in larger workflows
- Validation and filtering steps
- Parallel task execution

## API Examples

### Basic Request

```python
import anthropic

client = anthropic.Anthropic()

message = client.messages.create(
    model="claude-haiku-4-5-20251001",
    max_tokens=2048,
    messages=[
        {"role": "user", "content": "Summarize this article..."}
    ]
)
```

### With Streaming

```python
with client.messages.stream(
    model="claude-haiku-4-5-20251001",
    max_tokens=4096,
    messages=[{"role": "user", "content": "Generate a report..."}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

### Batch Processing

```python
# 50% cost savings with batch API
batch = client.messages.batches.create(
    requests=[
        {
            "custom_id": f"doc-{i}",
            "params": {
                "model": "claude-haiku-4-5-20251001",
                "max_tokens": 1024,
                "messages": [{"role": "user", "content": doc}]
            }
        }
        for i, doc in enumerate(documents)
    ]
)
```

## Comparison to Other Haiku Models

| Feature | Haiku 4.5 | Haiku 3.5 | Haiku 3 |
|---------|-----------|-----------|---------|
| Input Price | $1/MTok | $0.80/MTok | $0.25/MTok |
| Max Output | 64K | 8K | 4K |
| Extended Thinking | Yes | No | No |
| Computer Use | Yes | No | No |
| Vision | Yes | Yes | Yes |

## Cost Comparison (1M tokens)

| Model | Input Cost | Output Cost | Total |
|-------|------------|-------------|-------|
| Haiku 4.5 | $1 | $5 | $6 |
| Sonnet 4.5 | $3 | $15 | $18 |
| Opus 4.5 | $5 | $25 | $30 |

Haiku 4.5 provides **3x cost savings** vs Sonnet with comparable quality.

## Best Practices

1. **Default for high-volume**: Best cost-per-quality ratio
2. **Use for agent subroutines**: Fast execution in larger workflows
3. **Enable streaming** for interactive applications
4. **Batch non-urgent work**: Additional 50% savings
5. **Consider for prototyping**: Fast iteration at low cost
6. **Scale up as needed**: Switch to Sonnet for complex cases
