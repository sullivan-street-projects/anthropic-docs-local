---
title: "Adaptive Thinking"
source_url: "https://platform.claude.com/docs/en/docs/build-with-claude/adaptive-thinking"
source_type: "web-extracted"
fetched_at: "2026-08-03T00:00:00Z"
category: "api"
---

# Adaptive Thinking

Adaptive thinking is the recommended way to use extended thinking with Claude Opus 5, Claude Opus 4.8, Claude Opus 4.7, Claude Opus 4.6, Claude Sonnet 5, and Claude Sonnet 4.6, and the only thinking mode on Claude Fable 5 and Claude Mythos 5. Instead of manually setting a thinking token budget, adaptive thinking lets Claude dynamically determine when and how much to use extended thinking based on the complexity of each request. Per-model defaults and restrictions are listed under [Supported models](#supported-models).

> **Tip:** Adaptive thinking can drive better performance than extended thinking with a fixed `budget_tokens` for many workloads, especially bimodal tasks and long-horizon agentic workflows. No beta header is required.
>
> If your workload requires predictable latency or precise control over thinking costs, extended thinking with `budget_tokens` is still functional on Claude Opus 4.6 and Claude Sonnet 4.6 but is deprecated and no longer recommended.

## Supported Models

Adaptive thinking is supported on the following models:

- Claude Fable 5 (`claude-fable-5`) and Claude Mythos 5 (`claude-mythos-5`), adaptive thinking is always on; `thinking: {type: "disabled"}` is not supported. Neither model is available under [zero data retention](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention#model-specific-data-retention-requirements).
- Claude Mythos Preview (`claude-mythos-preview`), adaptive thinking is the default; `thinking: {type: "disabled"}` is not supported, and manual `{type: "enabled", budget_tokens: N}` is still accepted.
- Claude Opus 5 (`claude-opus-5`), adaptive thinking is on by default; pass `thinking: {type: "disabled"}` to turn it off (only at effort `high` or below; `xhigh`/`max` with disabled thinking returns 400). Manual `{type: "enabled"}` is rejected with a 400 error.
- Claude Opus 4.8 (`claude-opus-4-8`), adaptive thinking is the only supported thinking mode. Thinking is off unless you explicitly set `thinking: {type: "adaptive"}`; manual `thinking: {type: "enabled"}` is rejected with a 400 error.
- Claude Opus 4.7 (`claude-opus-4-7`), adaptive thinking is the only supported thinking mode. Thinking is off unless you explicitly set `thinking: {type: "adaptive"}`; manual `thinking: {type: "enabled"}` is rejected with a 400 error.
- Claude Opus 4.6 (`claude-opus-4-6`), adaptive thinking is off unless you explicitly set `thinking: {type: "adaptive"}`; manual `{type: "enabled", budget_tokens: N}` is still accepted but deprecated.
- Claude Sonnet 5 (`claude-sonnet-5`), adaptive thinking is on by default; pass `thinking: {type: "disabled"}` to turn it off. Manual `{type: "enabled"}` is rejected with a 400 error.
- Claude Sonnet 4.6 (`claude-sonnet-4-6`), adaptive thinking is off unless you explicitly set `thinking: {type: "adaptive"}`; manual `{type: "enabled", budget_tokens: N}` is still accepted but deprecated.

> **Warning:** `thinking.type: "enabled"` and `budget_tokens` are **deprecated** on Opus 4.6 and Sonnet 4.6 and will be removed in a future model release. Use `thinking.type: "adaptive"` with the `effort` parameter instead. Existing `budget_tokens` configurations are still functional but no longer recommended; plan to migrate.
>
> Older models (Sonnet 4.5, Opus 4.5, etc.) do not support adaptive thinking and require `thinking.type: "enabled"` with `budget_tokens`.

## How Adaptive Thinking Works

In adaptive mode, thinking is optional for the model. Claude evaluates the complexity of each request and determines whether and how much to use extended thinking. At the default effort level (`high`), Claude almost always thinks. At lower effort levels, Claude may skip thinking for simpler problems.

Adaptive thinking also automatically enables interleaved thinking. This means Claude can think between tool calls, making it especially effective for agentic workflows.

## How to Use Adaptive Thinking

Set `thinking.type` to `"adaptive"` in your API request:

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-opus-4-8",
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

```typescript
const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-opus-4-8",
  max_tokens: 16000,
  thinking: {
    type: "adaptive",
  },
  messages: [
    {
      role: "user",
      content: "Explain why the sum of two even numbers is always even.",
    },
  ],
});

for (const block of response.content) {
  if (block.type === "thinking") {
    console.log(`\nThinking: ${block.thinking}`);
  } else if (block.type === "text") {
    console.log(`\nResponse: ${block.text}`);
  }
}
```

## Effort Parameter

Combine adaptive thinking with the effort parameter to guide how much thinking Claude does:

| Effort level     | Thinking behavior                                                                                                                                           |
| :--------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `max`            | Claude always thinks with no constraints on thinking depth. Available on all models that support adaptive thinking.                                         |
| `xhigh`          | Claude always thinks deeply with extended exploration. Available on Claude Fable 5, Claude Mythos 5, Claude Opus 4.8, Claude Opus 4.7, and Claude Sonnet 5. |
| `high` (default) | Claude almost always thinks. Provides deep reasoning on complex tasks.                                                                                      |
| `medium`         | Claude uses moderate thinking. May skip thinking for very simple queries.                                                                                   |
| `low`            | Claude minimizes thinking. Skips thinking for simple tasks where speed matters most.                                                                        |

```python
response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=16000,
    thinking={"type": "adaptive"},
    output_config={"effort": "medium"},
    messages=[{"role": "user", "content": "What is the capital of France?"}],
)
```

## Streaming with Adaptive Thinking

Adaptive thinking works seamlessly with streaming. Thinking blocks are streamed via `thinking_delta` events just like manual thinking mode:

```python
client = anthropic.Anthropic()

with client.messages.stream(
    model="claude-opus-4-8",
    max_tokens=16000,
    thinking={"type": "adaptive"},
    messages=[
        {
            "role": "user",
            "content": "What is the greatest common divisor of 1071 and 462?",
        }
    ],
) as stream:
    for event in stream:
        if event.type == "content_block_start":
            print(f"\nStarting {event.content_block.type} block...")
        elif event.type == "content_block_delta":
            if event.delta.type == "thinking_delta":
                print(event.delta.thinking, end="", flush=True)
            elif event.delta.type == "text_delta":
                print(event.delta.text, end="", flush=True)
```

## Adaptive vs Manual vs Disabled Thinking

| Mode         | Config                                          | Availability                                                                                                                                                                          | When to use                                                                          |
| :----------- | :---------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :----------------------------------------------------------------------------------- |
| **Adaptive** | `thinking: {type: "adaptive"}`                  | Claude Fable 5 (always on), Claude Mythos 5 (always on), Claude Mythos Preview (default), Claude Opus 4.8 (only mode), Opus 4.7 (only mode), Opus 4.6, Sonnet 5 (default), Sonnet 4.6 | Claude determines when and how much to use extended thinking. Use `effort` to guide. |
| **Manual**   | `thinking: {type: "enabled", budget_tokens: N}` | All models except Claude Fable 5, Claude Mythos 5, Claude Sonnet 5, Claude Opus 4.8, and Claude Opus 4.7 (rejected with a 400 error). Deprecated on Opus 4.6 and Sonnet 4.6.          | When you need precise control over thinking token spend.                             |
| **Disabled** | `thinking: {type: "disabled"}`                  | All models except Claude Fable 5, Claude Mythos 5, and Claude Mythos Preview. On Claude Sonnet 5, pass `{type: "disabled"}` explicitly (omitting `thinking` defaults to adaptive).    | When you don't need extended thinking and want the lowest latency.                   |

**Interleaved thinking availability by mode:**

- **Adaptive mode:** Interleaved thinking is automatically enabled on Claude Fable 5, Claude Mythos 5, Claude Mythos Preview, Claude Opus 4.8, Claude Opus 4.7, Opus 4.6, Sonnet 5, and Sonnet 4.6. On Claude Fable 5, Claude Mythos 5, Mythos Preview, Claude Opus 4.8, and Opus 4.7, inter-tool reasoning always lives inside thinking blocks.
- **Manual mode on Sonnet 4.6:** Interleaved thinking works through the `interleaved-thinking-2025-05-14` beta header.
- **Manual mode on Opus 4.6:** Interleaved thinking is not available. If your agentic workflow requires thinking between tool calls on Opus 4.6, use adaptive mode.

## Working with Thinking Blocks

### Summarized Thinking

With extended thinking enabled, the Messages API for Claude 4 models returns a summary of Claude's full thinking process. Summarized thinking provides the full intelligence benefits of extended thinking, while preventing misuse. This is the default behavior on Claude 4 models when the `display` field on the thinking configuration is unset or set to `"summarized"`. On Claude Fable 5, Claude Mythos 5, Claude Sonnet 5, Claude Opus 4.8, Claude Opus 4.7, and Claude Mythos Preview, `display` defaults to `"omitted"` instead, so you must set `display: "summarized"` explicitly to receive summarized thinking.

Important considerations for summarized thinking:

- You're charged for the full thinking tokens generated by the original request, not the summary tokens.
- The billed output token count will **not match** the count of tokens you see in the response.
- On Claude 4 models, the first few lines of thinking output are more verbose, providing detailed reasoning that's particularly helpful for prompt engineering purposes. Claude Mythos Preview summarizes from the first token, so its thinking blocks do not show this verbose preamble.
- Summarization preserves the key ideas of Claude's thinking process with minimal added latency, enabling a streamable user experience.

### Controlling Thinking Display

The `display` field on the thinking configuration controls how thinking content is returned in API responses:

- `"summarized"`: Thinking blocks contain summarized thinking text. This is the default on Claude Opus 4.6, Claude Sonnet 4.6, and earlier Claude 4 models.
- `"omitted"`: Thinking blocks are returned with an empty `thinking` field. The `signature` field still carries the encrypted full thinking for multi-turn continuity. This is the default on Claude Fable 5, Claude Mythos 5, Claude Sonnet 5, Claude Opus 4.8, Claude Opus 4.7, and Claude Mythos Preview.

Setting `display: "omitted"` is useful when your application doesn't surface thinking content to users. The primary benefit is **faster time-to-first-text-token when streaming**.

To receive summarized thinking text on models where the default is `"omitted"`, set `thinking.display` to `"summarized"` explicitly:

```python
thinking = {
    "type": "adaptive",
    "display": "summarized",
}
```

For omitted thinking, use:

```python
thinking = {"type": "adaptive", "display": "omitted"}
```

### Thinking Encryption

Full thinking content is encrypted and returned in the `signature` field. This field is used to verify that thinking blocks were generated by Claude when passed back to the API.

Important considerations:

- It is only strictly necessary to send back thinking blocks when using tools with extended thinking. Otherwise you can omit thinking blocks from previous turns.
- `signature` values are significantly longer in Claude 4 models than in previous models.
- The `signature` field is an opaque field and should not be interpreted or parsed.
- `signature` values are compatible across platforms (Claude APIs, Amazon Bedrock, and Google Cloud).

### Thinking Output on Claude Fable 5 and Claude Mythos 5

On Claude Fable 5 and Claude Mythos 5, the raw chain of thought is never returned. The thinking blocks you receive are regular `thinking` blocks, not `redacted_thinking`. The `thinking.display` setting works the same as on other models:

- `"summarized"` returns a readable summary of the reasoning.
- `"omitted"` (the default on these models) still includes `thinking` blocks in responses, but their `thinking` field is an empty string.

When continuing a conversation on the same model, pass each thinking block back to the API exactly as received, including blocks whose `thinking` field is empty.

On Claude Fable 5, a request that attempts to elicit the model's internal reasoning as part of the response text can be refused with `stop_details.category: "reasoning_extraction"`.

## Important Considerations

### Validation Changes

When using adaptive thinking, previous assistant turns don't need to start with thinking blocks. This is more flexible than manual mode, where the API enforces that thinking-enabled turns begin with a thinking block.

### Prompt Caching

Consecutive requests using `adaptive` thinking preserve prompt cache breakpoints. However, switching between `adaptive` and `enabled`/`disabled` thinking modes breaks cache breakpoints for messages. System prompts and tool definitions remain cached regardless of mode changes.

### Tuning Thinking Behavior

Adaptive thinking's triggering behavior is promptable. If Claude is thinking more or less often than you'd like, you can add guidance to your system prompt:

```
Extended thinking adds latency and should only be used when it
will meaningfully improve answer quality — typically for problems
that require multi-step reasoning. When in doubt, respond directly.
```

To encourage thinking instead:

```
This task involves multi-step reasoning. Think carefully before responding.
```

You can also steer thinking on a per-message basis from the user turn. Appending `"Please think hard before responding."` to a user message encourages Claude to think on that turn; `"Answer directly without deliberating."` suppresses it.

### Cost Control

Use `max_tokens` as a hard limit on total output (thinking + response text). The `effort` parameter provides additional soft guidance on how much thinking Claude allocates.

At `high` and `max` effort levels, Claude may think more extensively and can be more likely to exhaust the `max_tokens` budget. If you observe `stop_reason: "max_tokens"` in responses, consider increasing `max_tokens` or lowering the effort level.

### Pricing

The thinking process incurs charges for:

- Tokens used during thinking (output tokens)
- Thinking blocks from prior assistant turns kept in context (input tokens)
- Standard text output tokens

When using summarized thinking, the billed output token count will **not** match the visible token count in the response. You are billed for the full thinking process, not the thinking content visible in the response.

To see how many billed output tokens were spent on internal reasoning, read `usage.output_tokens_details.thinking_tokens` in the response:

```json
{
  "usage": {
    "input_tokens": 25,
    "output_tokens": 348,
    "output_tokens_details": {
      "thinking_tokens": 312
    }
  }
}
```
