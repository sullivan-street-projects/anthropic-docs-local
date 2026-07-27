---
title: "Adaptive Thinking"
source_url: "https://platform.claude.com/docs/en/docs/build-with-claude/adaptive-thinking"
source_type: "web-extracted"
fetched_at: "2026-07-27T00:00:00Z"
category: "api"
---

# Steering Thinking

Claude's thinking is adaptive: the model evaluates each request and decides for itself whether to think and how much. You set an intent, optionally specify the effort, and the model allocates reasoning where it judges reasoning will help.

This makes thinking a strong fit for workloads that mix trivial and complex requests, and for long-horizon agentic workflows where the right amount of reasoning varies from step to step.

## How Claude Decides When to Think

Thinking is optional for the model. On each request, Claude weighs the complexity of the input and decides whether deeper reasoning would improve the answer. A simple factual question may get a direct response with no thinking block at all; a multistep math problem or a tricky debugging task triggers deeper reasoning.

The decision happens per request. The same conversation can contain turns with and without thinking, and a turn where Claude chose not to think contains no thinking block. Don't build application logic that assumes every assistant turn starts with one.

The primary control over this decision is the effort parameter, which acts as soft guidance for how willing Claude should be to think and how deeply.

If you want Claude to think less often, lower the effort level before reaching for prompt-based steering.

Thinking also interleaves with tool use automatically: Claude can think between tool calls, reflecting on each tool result before deciding what to do next (interleaved thinking). You don't need a beta header or any additional configuration for this.

## Steering How Often Claude Thinks

Whether Claude thinks on a given turn is promptable. Effort sets the overall posture, but you can also shape the decision directly with natural-language guidance, either globally in the system prompt or per message from the user turn.

Use the two levers together in this order:

1. Set the effort level that matches your workload's default balance of quality and latency.
2. Add prompt guidance only if Claude's triggering still doesn't match your needs at that level.

### Effort Levels

Effort is the primary steering lever for thinking. Each level sets a different default for how often Claude thinks and how deeply:

| Effort level     | Thinking behavior                                                                    |
| :--------------- | :----------------------------------------------------------------------------------- |
| `max`            | Claude always thinks with no constraints on thinking depth.                          |
| `xhigh`          | Claude always thinks deeply with extended exploration.                               |
| `high` (default) | Claude almost always thinks. Provides deep reasoning on complex tasks.               |
| `medium`         | Claude uses moderate thinking. May skip thinking for simple queries.                 |
| `low`            | Claude minimizes thinking. Skips thinking for simple tasks where speed matters most. |

Effort is set at `output_config.effort`, not inside the `thinking` object.

```json
{
  "model": "claude-opus-4-8",
  "max_tokens": 4096,
  "output_config": { "effort": "medium" },
  "messages": [{ "role": "user", "content": "..." }]
}
```

Level availability varies by model; see the effort page for which levels each model supports.

### System Prompt Guidance

System prompt guidance shifts Claude's thinking threshold for every request in the conversation. If Claude is thinking more often than your workload needs:

```
Extended thinking adds latency and should only be used when it
will meaningfully improve answer quality, typically for problems
that require multistep reasoning. When in doubt, respond directly.
```

To encourage thinking instead:

```
This task involves multistep reasoning. Think carefully before responding.
```

### Per-Message Steering

You can also steer thinking on a per-message basis from the user turn, independently of the system prompt. Appending `"Please think hard before responding."` to a user message encourages Claude to think on that turn; `"Answer directly without deliberating."` suppresses it.

Per-message steering is useful when only some requests in a conversation warrant extended reasoning. An agent harness, for example, can append the encouraging phrase on planning steps and the suppressing phrase on routine confirmations.

### Verify Steering on Your Workload

Prompt-based steering changes model behavior, so treat it like any other prompt change: measure before you ship. Run a representative sample of your traffic with and without the guidance, and compare how often thinking triggers, output token usage, latency, and answer quality.

> **Warning:** Steering Claude to think less often may reduce quality on tasks that benefit from reasoning. Lowering the effort level is usually the better first lever, since it is a calibrated control rather than a wording-sensitive instruction.

## Mechanics

Three mechanics follow from Claude managing its own thinking: turn validation, prompt caching, and how you bound cost.

### Turn Validation

Assistant turns don't need to start with a thinking block. (Models using a legacy manual thinking budget enforce that the final assistant turn of a thinking-enabled request begins with one.)

For multi-turn applications, this means you can pass back conversation history in whatever shape you have it:

- Assistant turns where Claude chose not to think are valid history as-is.
- You can resume a conversation that began without thinking, or that used a different thinking configuration, without rewriting its history.
- History assembled from mixed sources doesn't need thinking blocks reinserted at the start of each assistant turn to pass validation.

### Prompt Caching

Consecutive requests that keep the same thinking configuration and effort level preserve prompt caching. The resolved effort value is rendered into the prompt, so changing it between requests invalidates cache breakpoints, just as changing the legacy `budget_tokens` parameter does. Setting `effort` explicitly to the model's default is equivalent to omitting it and does not break the cache.

The practical consequence: pick a thinking configuration and an effort level per conversation and keep them. If some turns need more or less thinking, steer with per-message prompting: guidance appended to the newest user message leaves earlier cache breakpoints intact.

### Cost Control

You don't set a thinking token budget. Two controls bound cost:

- `max_tokens` is a hard cap on total output for the request, thinking and response text combined. Claude never generates past it.
- `effort` is soft guidance on how much of that output Claude allocates to thinking. It shapes behavior but doesn't guarantee a token count.

Because thinking counts toward `max_tokens`, set it high enough to leave room for both the reasoning and the answer. At `high` effort and above, Claude may think extensively and is more likely to exhaust the budget. If you see `stop_reason: "max_tokens"` in responses:

- Raise `max_tokens` to give the model more room for thinking plus the answer.
- Lower the effort level so Claude thinks less and leaves more of the budget for response text.

## Pricing

Thinking incurs charges for:

- Tokens Claude uses while thinking (billed as output tokens)
- Thinking blocks from prior assistant turns that remain in context (billed as input tokens)
- Standard text output tokens

What you're billed for is the same regardless of the `display` setting; only what you see changes:

|                             | `display: "summarized"`                              | `display: "omitted"`                                 |
| --------------------------- | ---------------------------------------------------- | ---------------------------------------------------- |
| **Input tokens**            | Tokens in your original request                      | Same as summarized                                   |
| **Output tokens (billed)**  | The full thinking tokens Claude generated internally | Same as summarized                                   |
| **Output tokens (visible)** | The summarized thinking text                         | Zero thinking tokens (the `thinking` field is empty) |
| **Summary generation**      | No charge                                            | Not applicable                                       |

> **Warning:** The billed output token count does **not** match the visible token count in the response. You are billed for the full thinking process, not the thinking content visible in the response.

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

`output_tokens` remains the inclusive, authoritative total used for billing. `output_tokens_details` is a read-only breakdown for observability.
