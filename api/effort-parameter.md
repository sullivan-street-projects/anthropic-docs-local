---
title: "Effort Parameter (Fast Mode)"
source_url: "https://platform.claude.com/docs/en/docs/build-with-claude/effort"
source_type: "web-extracted"
fetched_at: "2026-03-05T12:00:00Z"
category: "api"
---

# Effort Parameter

The effort parameter controls how many tokens Claude uses when responding, trading off between response thoroughness and token efficiency. Generally available on all supported models with no beta header required.

## Supported Models

- Claude Opus 4.6
- Claude Sonnet 4.6
- Claude Opus 4.5

## Effort Levels

| Level | Description | Typical use case |
|-------|-------------|-----------------|
| `max` | Maximum capability, no constraints. **Opus 4.6 only.** | Deepest reasoning and most thorough analysis |
| `high` | Default. Equivalent to not setting the parameter. | Complex reasoning, difficult coding, agentic tasks |
| `medium` | Balanced, moderate token savings. | Agentic tasks balancing speed, cost, and performance |
| `low` | Most efficient, significant token savings. | Simple tasks, subagents, speed-sensitive workloads |

## Usage

```python
import anthropic
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=4096,
    messages=[{"role": "user", "content": "Analyze microservices vs monolithic architectures"}],
    output_config={"effort": "medium"},
)
```

## How It Works

The effort parameter affects **all tokens** in the response:
- Text responses and explanations
- Tool calls and function arguments
- Extended thinking (when enabled)

This means it works without thinking enabled and can control tool call frequency — lower effort means fewer tool calls.

## Recommended Levels for Sonnet 4.6

Sonnet 4.6 defaults to `high` effort. Set effort explicitly to control latency:
- **Medium** (recommended default): Best balance for most applications — agentic coding, tool-heavy workflows
- **Low**: For high-volume or latency-sensitive workloads — chat, non-coding tasks
- **High**: When you need maximum intelligence from Sonnet 4.6

## Interaction with Extended Thinking

- **Opus 4.6:** Use adaptive thinking + effort. At `high`/`max`, Claude almost always thinks deeply. At lower levels, may skip thinking.
- **Sonnet 4.6:** Supports both adaptive thinking (effort controls depth) and manual thinking with budget_tokens.
- **Opus 4.5 and earlier:** Use manual thinking with budget_tokens alongside effort.

## Best Practices

1. Set effort explicitly (don't rely on defaults)
2. Use `low` for speed-sensitive or simple tasks
3. Test impact on your specific use cases
4. Consider dynamic effort — adjust based on task complexity
