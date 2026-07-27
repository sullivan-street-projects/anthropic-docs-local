---
title: "Extended Thinking"
source_url: "https://platform.claude.com/docs/en/docs/build-with-claude/extended-thinking"
source_type: "web-extracted"
fetched_at: "2026-07-27T00:00:00Z"
category: "api"
---

# Extended Thinking

Extended thinking (`thinking.type: "enabled"` with `budget_tokens`) is deprecated on the Claude 4.6 models (requests using it still succeed). Claude 4.7 and later models do not support it and reject requests that use it, returning a 400 error. On Claude 4.5 and earlier models that support thinking, extended thinking is the only available thinking mode. Claude Mythos Preview supports both modes. Where both modes are available, use adaptive thinking instead.

See [Migrating to adaptive thinking](#migrating-to-adaptive-thinking) to move to adaptive thinking. If your model supports only extended thinking, this page describes the supported configuration; no change is needed until you move to a newer model.

> **Note:** If a request fails with a 400 error whose message starts with `"thinking.type.enabled" is not supported`, your model uses adaptive thinking instead.

Extended thinking in manual mode gives you direct control over how much Claude thinks. You set a thinking token budget on each request with `thinking: {type: "enabled", budget_tokens: N}`, and Claude thinks against that budget before it starts its final answer. Manual mode remains useful when your workload requires predictable latency or precise control over thinking costs.

For how thinking itself works, including thinking blocks and the response shape, the `display` parameter, streaming, thinking with tool use, and encryption, see the thinking overview.

## Supported Models

Extended thinking availability per model is listed in the per-model configuration table. Key points:

- Claude Fable 5, Claude Mythos 5: Not supported (400 error). Adaptive thinking always on; use effort to control depth.
- Claude Mythos Preview: Supported. Adaptive thinking is on by default.
- Claude Opus 5, Claude Opus 4.8, Claude Opus 4.7: Not supported (400 error). Adaptive thinking with effort.
- Claude Sonnet 5: Not supported (400 error). Adaptive thinking with effort.
- Claude Opus 4.6, Claude Sonnet 4.6: Deprecated. Adaptive thinking with effort recommended.
- Claude Opus 4.5, Claude Haiku 4.5, Earlier Claude 4 models: Supported.

## How to Use Extended Thinking

Add a `thinking` object with `type: "enabled"` and a `budget_tokens` value:

**Python:**

```python
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 10000},
    messages=[
        {
            "role": "user",
            "content": "Are there an infinite number of prime numbers such that n mod 4 == 3?",
        }
    ],
)

# The response contains summarized thinking blocks and text blocks
for block in response.content:
    match block.type:
        case "thinking":
            print(f"\nThinking summary: {block.thinking}")
        case "text":
            print(f"\nResponse: {block.text}")
```

**TypeScript:**

```typescript
const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000,
  },
  messages: [
    {
      role: "user",
      content:
        "Are there an infinite number of prime numbers such that n mod 4 == 3?",
    },
  ],
});

for (const block of response.content) {
  if (block.type === "thinking") {
    console.log(`\nThinking summary: ${block.thinking}`);
  } else if (block.type === "text") {
    console.log(`\nResponse: ${block.text}`);
  }
}
```

**cURL:**

```bash
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
  "model": "claude-sonnet-4-6",
  "max_tokens": 16000,
  "thinking": {
    "type": "enabled",
    "budget_tokens": 10000
  },
  "messages": [
    {
      "role": "user",
      "content": "Are there an infinite number of prime numbers such that n mod 4 == 3?"
    }
  ]
}'
```

## Budget Rules and Tuning

`budget_tokens` must satisfy these constraints:

- **Minimum of 1,024 tokens.** The API rejects smaller values.
- **Less than `max_tokens`.** Thinking tokens count toward the `max_tokens` limit for the turn, so the budget must leave room for the final response. The one exception is interleaved thinking, where `budget_tokens` can exceed `max_tokens` because the budget spans all thinking blocks within one assistant turn.
- **No cache pre-warming.** Because `budget_tokens` must be less than `max_tokens`, extended thinking cannot be combined with `max_tokens: 0` (cache pre-warming).

The budget is a target rather than a strict cap. Actual token usage varies with the task, and Claude may stop reasoning well before the budget is exhausted; `max_tokens` remains the hard ceiling on total output.

On Claude Opus 4.5, the only extended-thinking-only model that supports effort, effort shapes the overall response while `budget_tokens` sets thinking depth; set both.

To tune the budget:

- Match the starting point to the task. For simple tasks, start near the 1,024-token minimum and increase incrementally. For complex tasks, start with a larger budget of 16,000 tokens or more.
- For thinking budgets above 32k, use batch processing to avoid networking issues.

To track what a budget actually costs you, monitor the `usage.output_tokens_details.thinking_tokens` field in the response.

## Interleaved Thinking in Manual Mode

Interleaved thinking lets Claude think between tool calls within a single assistant turn. Enablement depends on the model:

- **Claude Opus 4.5, Claude Sonnet 4.5, and earlier Claude 4 models:** Add the `interleaved-thinking-2025-05-14` beta header.
- **Claude Sonnet 4.6:** The beta header with manual `type: "enabled"` is still functional but deprecated. Prefer adaptive thinking.
- **Claude Opus 4.6:** Manual mode has no interleaved thinking at all. Switch to `thinking: {type: "adaptive"}` for reasoning between tool calls.
- **Claude Haiku 4.5:** Does not support interleaved thinking.

Two considerations for interleaved thinking in manual mode:

- `budget_tokens` can exceed `max_tokens` here; the budget spans all thinking blocks within one assistant turn.
- Interleaved thinking is only supported for tools used through the Messages API.

## Turn Structure in Manual Mode

Manual mode adds one requirement: the final assistant turn of a thinking-enabled request must begin with a thinking block (adaptive thinking drops that requirement). Changing the thinking configuration between turns also invalidates prompt caching.

## Prompt Caching in Manual Mode

Manual mode adds one rule on top of mode-neutral caching behavior: changing `budget_tokens` between requests invalidates cache breakpoints, just as switching thinking modes does, because the budget value is rendered into the prompt. In practice, pick a budget and hold it stable for the life of a cached conversation.

## Migrating to Adaptive Thinking

If your model supports only extended thinking (Claude Sonnet 4.5, Claude Opus 4.5, Claude Haiku 4.5, and earlier Claude 4 models), no action is needed now. Keep `budget_tokens` until you move to a model that supports adaptive thinking.

You need to migrate off `type: "enabled"` if:

- You use Claude Opus 4.6 or Claude Sonnet 4.6, where `budget_tokens` is deprecated.
- You are moving to Claude Opus 4.7, Claude Opus 4.8, Claude Opus 5, Claude Sonnet 5, Claude Fable 5, or Claude Mythos 5, where `type: "enabled"` returns a 400 error.

The mapping is small: remove `budget_tokens`, set `thinking: {type: "adaptive"}`, and control reasoning depth with `output_config: {effort: ...}` instead of a token budget.

**Before:**

```json
{
  "model": "claude-sonnet-4-6",
  "max_tokens": 16000,
  "thinking": {
    "type": "enabled",
    "budget_tokens": 10000
  }
}
```

**After:**

```json
{
  "model": "claude-sonnet-4-6",
  "max_tokens": 16000,
  "thinking": {
    "type": "adaptive"
  },
  "output_config": {
    "effort": "high"
  }
}
```

`effort: "high"` matches the API default; it appears here only to show where the depth control now lives.

Expect a behavioral difference, not just a syntax change. With a fixed budget, Claude thinks on every request. With adaptive thinking, Claude decides whether and how much to think on each request, and at lower effort settings it may skip thinking entirely on easy inputs. You can also remove the `interleaved-thinking-2025-05-14` beta header after migrating: adaptive thinking interleaves automatically.
