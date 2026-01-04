---
title: "Claude Sonnet 4.5"
source_url: "https://www.anthropic.com/news/claude-sonnet-4-5"
source_type: "web-extracted"
fetched_at: "2026-01-04T06:05:00Z"
category: "models"
---

# Claude Sonnet 4.5

Claude Sonnet 4.5 is Anthropic's most capable model for coding, agents, and computer use. Released September 29, 2025.

## Model Details

| Property | Value |
|----------|-------|
| **Model ID** | `claude-sonnet-4-5-20250929` |
| **Context Window** | 200,000 tokens (1M beta) |
| **Max Output** | 16,000 tokens |
| **Training Cutoff** | April 2025 |
| **Release Date** | September 29, 2025 |

## Pricing

| Usage Type | Cost |
|------------|------|
| Base Input | $3 / MTok |
| Output | $15 / MTok |
| Batch Input | $1.50 / MTok |
| Batch Output | $7.50 / MTok |
| 5m Cache Write | $3.75 / MTok |
| 1h Cache Write | $6 / MTok |
| Cache Read | $0.30 / MTok |

### Long Context Pricing (> 200K tokens)

| Token Range | Input | Output |
|-------------|-------|--------|
| ≤ 200K | $3 / MTok | $15 / MTok |
| > 200K | $6 / MTok | $22.50 / MTok |

## Key Capabilities

### Coding Excellence
Sonnet 4.5 achieves industry-leading coding performance:
- **SWE-bench Verified**: 77.2% (standard), 82.0% (high-compute)
- Full codebase understanding
- Multi-file refactoring
- Test generation and debugging

### 1M Token Context Window (Beta)
Organizations in Tier 4 can access the 1M context beta:
```python
message = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=8192,
    betas=["long-context-2024-12-19"],
    messages=[{"role": "user", "content": large_context}]
)
```

### Computer Use
Sonnet 4.5 excels at computer automation:
- Screen understanding and navigation
- Application interaction
- Multi-step workflows

### Extended Thinking
Enable for complex reasoning:
```json
{
  "thinking": {
    "type": "enabled",
    "budget_tokens": 10000
  }
}
```

### Vision
Full multimodal support:
- Document analysis
- Image understanding
- Chart and diagram interpretation

## Use Cases

- **Software Development**: Code generation, review, debugging
- **Agent Workflows**: Multi-step automation
- **Computer Use**: GUI automation and testing
- **Document Processing**: Large document analysis with 1M context
- **Data Analysis**: Pattern recognition and insights

## API Examples

### Basic Request

```python
import anthropic

client = anthropic.Anthropic()

message = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    messages=[
        {"role": "user", "content": "Write a Python function to parse JSON..."}
    ]
)
```

### With Streaming

```python
with client.messages.stream(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    messages=[{"role": "user", "content": "Explain this codebase..."}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

### With Tools

```python
message = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    tools=[
        {
            "name": "execute_code",
            "description": "Run Python code",
            "input_schema": {
                "type": "object",
                "properties": {
                    "code": {"type": "string"}
                },
                "required": ["code"]
            }
        }
    ],
    messages=[{"role": "user", "content": "Calculate the factorial of 20"}]
)
```

## Comparison to Previous Sonnet Models

| Feature | Sonnet 4.5 | Sonnet 4 | Sonnet 3.7 |
|---------|------------|----------|------------|
| SWE-bench | 82% | 72% | 62% |
| 1M Context | Beta | Beta | No |
| Computer Use | Enhanced | Yes | Yes |
| Extended Thinking | Yes | Yes | Yes |

## Best Practices

1. **Default choice for coding**: Best balance of quality and cost
2. **Use 1M context** for large codebases (Tier 4 only)
3. **Enable streaming** for better UX on long responses
4. **Combine with tools** for agentic workflows
5. **Use batch API** for bulk processing (50% savings)
