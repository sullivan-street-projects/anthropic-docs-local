---
title: "Adaptive Thinking"
source_url: "https://platform.claude.com/docs/en/docs/build-with-claude/adaptive-thinking"
source_type: "web-extracted"
fetched_at: "2026-03-10T00:00:00Z"
category: "api"
---

# Adaptive Thinking

Adaptive thinking is the recommended way to use extended thinking with Claude Opus 4.6 and Sonnet 4.6. Instead of manually setting a thinking token budget, adaptive thinking lets Claude dynamically determine when and how much to use extended thinking based on the complexity of each request.

## Supported Models

- Claude Opus 4.6 (`claude-opus-4-6`)
- Claude Sonnet 4.6 (`claude-sonnet-4-6`)

**Note:** `thinking.type: "enabled"` and `budget_tokens` are **deprecated** on Opus 4.6 and Sonnet 4.6 and will be removed in a future model release. Use `thinking.type: "adaptive"` with the `effort` parameter instead.

Older models (Sonnet 4.5, Opus 4.5, etc.) do not support adaptive thinking and require `thinking.type: "enabled"` with `budget_tokens`.

## How Adaptive Thinking Works

In adaptive mode, thinking is optional for the model. Claude evaluates the complexity of each request and determines whether and how much to use extended thinking. At the default effort level (`high`), Claude almost always thinks. At lower effort levels, Claude may skip thinking for simpler problems.

Adaptive thinking also automatically enables interleaved thinking. This means Claude can think between tool calls, making it especially effective for agentic workflows.

## How to Use Adaptive Thinking

Set `thinking.type` to `"adaptive"` in your API request:

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=16000,
    thinking={"type": "adaptive"},
    messages=[
        {
            "role": "user",
            "content": "Explain why the sum of two even numbers is always even.",
        }
    ],
)

for block in response.content:
    if block.type == "thinking":
        print(f"\nThinking: {block.thinking}")
    elif block.type == "text":
        print(f"\nResponse: {block.text}")
```

## Effort Parameter

Combine adaptive thinking with the effort parameter to guide how much thinking Claude does:

| Effort level | Thinking behavior |
|:-------------|:------------------|
| `max` | Claude always thinks with no constraints on thinking depth. Opus 4.6 only. |
| `high` (default) | Claude always thinks. Provides deep reasoning on complex tasks. |
| `medium` | Claude uses moderate thinking. May skip thinking for very simple queries. |
| `low` | Claude minimizes thinking. Skips thinking for simple tasks where speed matters most. |

```python
response = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=16000,
    thinking={"type": "adaptive"},
    output_config={"effort": "medium"},
    messages=[{"role": "user", "content": "What is the capital of France?"}],
)
```

## Adaptive vs Manual vs Disabled Thinking

| Mode | Config | Availability | When to use |
|:-----|:-------|:-------------|:------------|
| **Adaptive** | `thinking: {type: "adaptive"}` | Opus 4.6, Sonnet 4.6 | Claude determines when and how much to think. Use `effort` to guide. |
| **Manual** | `thinking: {type: "enabled", budget_tokens: N}` | All models. Deprecated on 4.6. | When you need precise control over thinking token spend. |
| **Disabled** | Omit `thinking` parameter | All models | When you don't need extended thinking and want lowest latency. |

## Important Considerations

- **Prompt caching:** Consecutive requests using `adaptive` thinking preserve prompt cache breakpoints. Switching between modes breaks cache breakpoints for messages.
- **Interleaved thinking:** Automatically enabled on both Opus 4.6 and Sonnet 4.6 in adaptive mode.
- **Cost control:** Use `max_tokens` as a hard limit on total output. The `effort` parameter provides additional soft guidance.
- **Tuning:** Adaptive thinking's triggering behavior is promptable — add guidance to your system prompt to steer thinking frequency.
- **Summarized thinking:** Claude 4 models return summarized thinking. You're charged for full thinking tokens, not summary tokens.
