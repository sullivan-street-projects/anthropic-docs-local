---
title: "Extended Thinking"
source_url: "https://platform.claude.com/docs/en/docs/build-with-claude/extended-thinking"
source_type: "web-extracted"
fetched_at: "2026-04-05T00:00:00Z"
category: "api"
---

# Extended Thinking

Extended thinking gives Claude enhanced reasoning capabilities for complex tasks, providing transparency into its step-by-step thought process before delivering final answers.

**Note:** Claude Opus 4.6 and Sonnet 4.6 use adaptive thinking instead of manual extended thinking. Manual `thinking: {type: "enabled", budget_tokens: N}` is deprecated on these models.

## Supported Models

- Claude Opus 4.6 (adaptive thinking only; manual deprecated)
- Claude Sonnet 4.6 (supports both manual and adaptive)
- Claude Opus 4.5, Opus 4.1, Opus 4
- Claude Sonnet 4.5, Sonnet 4
- Claude Haiku 4.5

## How to Enable

```python
import anthropic
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 10000},
    messages=[{"role": "user", "content": "Are there infinite primes where n mod 4 == 3?"}],
)

for block in response.content:
    if block.type == "thinking":
        print(f"Thinking: {block.thinking}")
    elif block.type == "text":
        print(f"Response: {block.text}")
```

## Key Parameters

- **`thinking.type`:** `"enabled"` for manual, `"adaptive"` for dynamic (4.6 models)
- **`budget_tokens`:** Maximum tokens for internal reasoning (required for manual mode)
- **`max_tokens`:** Must be greater than `budget_tokens`

## Summarized Thinking

Claude 4 models return **summarized** thinking output:
- You're charged for full thinking tokens, not summary tokens
- Billed output token count will NOT match response tokens
- First few lines are more verbose for prompt engineering insights
- Claude Sonnet 3.7 still returns full thinking output
- Contact sales for full thinking access on Claude 4 models

## Tool Use with Extended Thinking

- Only supports `tool_choice: {"type": "auto"}` or `{"type": "none"}`
- Cannot force specific tools with extended thinking
- **Critical:** Pass thinking blocks back to the API unchanged during tool use loops
- Cannot toggle thinking mid-turn during tool use loops

## Interleaved Thinking

Enables Claude to think between tool calls:
- **Opus 4.6:** Automatic with adaptive thinking
- **Sonnet 4.6:** Use `interleaved-thinking-2025-05-14` beta header with manual thinking
- **Other Claude 4 models:** Add `interleaved-thinking-2025-05-14` beta header
- `budget_tokens` can exceed `max_tokens` with interleaved thinking

## Prompt Caching Considerations

- System prompts remain cached despite thinking parameter changes
- Changing thinking parameters invalidates message cache breakpoints
- Use 1-hour cache duration for extended thinking tasks
- Thinking blocks from previous turns are removed from context but count as input tokens when cached
