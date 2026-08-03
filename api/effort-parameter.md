---
title: "Effort Parameter"
source_url: "https://platform.claude.com/docs/en/docs/build-with-claude/effort"
source_type: "web-extracted"
fetched_at: "2026-08-03T00:00:00Z"
category: "api"
---

# Effort Parameter

This feature is eligible for Zero Data Retention (ZDR). When your organization has a ZDR arrangement, data sent through this feature is not stored after the API response is returned.

The effort parameter lets you control how eager Claude is about spending tokens when responding to requests. You can trade off between response thoroughness and token efficiency with a single model. The effort parameter is available on all supported models with no beta header required.

## Supported Models

The effort parameter is supported by Claude Fable 5, Claude Mythos 5, Claude Opus 5, Claude Opus 4.8, Claude Mythos Preview, Claude Opus 4.7, Claude Opus 4.6, Claude Sonnet 5, Claude Sonnet 4.6, and Claude Opus 4.5.

For Claude Opus 4.6 and Sonnet 4.6, effort replaces `budget_tokens` as the recommended way to control thinking depth. Combine effort with adaptive thinking (`thinking: {type: "adaptive"}`) for the best experience. While `budget_tokens` is still accepted on Opus 4.6 and Sonnet 4.6, it is deprecated and will be removed in a future model release. At `high` (default) and `max` effort, Claude will almost always think. At lower effort levels, it may skip thinking for simpler problems.

## How Effort Works

By default, Claude uses high effort, spending as many tokens as needed for excellent results. You can raise the effort level to `max` for the absolute highest capability, or lower it to be more conservative with token usage, optimizing for speed and cost while accepting some reduction in capability.

Setting `effort` to `"high"` produces exactly the same behavior as omitting the `effort` parameter entirely.

The effort parameter affects **all tokens** in the response, including:

- Text responses and explanations
- Tool calls and function arguments
- Extended thinking (when enabled)

This approach has two major advantages:

1. It doesn't require thinking to be enabled.
2. It can affect all token spend including tool calls. For example, lower effort would mean Claude makes fewer tool calls. This gives a much greater degree of control over efficiency.

### Effort Levels

| Level    | Description                                                                                                                                                                                                                        | Typical use case                                                                           |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `max`    | Absolute maximum capability with no constraints on token spending. Available on Claude Fable 5, Claude Mythos 5, Claude Opus 5, Claude Opus 4.8, Claude Mythos Preview, Claude Opus 4.7, Claude Opus 4.6, Claude Sonnet 5, and Claude Sonnet 4.6. | Tasks requiring the deepest possible reasoning and most thorough analysis                  |
| `xhigh`  | Extended capability for long-horizon work. Available on Claude Fable 5, Claude Mythos 5, Claude Opus 5, Claude Opus 4.8, Claude Opus 4.7, and Claude Sonnet 5.                                                                                    | Long-running agentic and coding tasks (over 30 minutes) with token budgets in the millions |
| `high`   | High capability. Equivalent to not setting the parameter.                                                                                                                                                                          | Complex reasoning, difficult coding problems, agentic tasks                                |
| `medium` | Balanced approach with moderate token savings.                                                                                                                                                                                     | Agentic tasks that require a balance of speed, cost, and performance                       |
| `low`    | Most efficient. Significant token savings with some capability reduction.                                                                                                                                                          | Simpler tasks that need the best speed and lowest costs, like subagents                    |

Effort is a behavioral signal, not a strict token budget. At lower effort levels, Claude will still think on sufficiently difficult problems, but it will think less than it would at higher effort levels for the same problem.

### Recommended Effort Levels for Claude Sonnet 5

Claude Sonnet 5 defaults to `high` effort.

- **High effort (default):** Suitable for complex reasoning, coding, and agentic tasks where quality matters more than speed or cost.
- **Xhigh effort:** For the hardest coding and agentic tasks.
- **Medium effort:** Cost-saving step-down from the default. Comparable to Claude Sonnet 4.6 at high effort.
- **Low effort:** For high-volume or latency-sensitive workloads. Suitable for chat and non-coding use cases where faster turnaround is prioritized.
- **Max effort:** For tasks requiring the absolute highest capability with no constraints on token spending.

### Recommended Effort Levels for Sonnet 4.6

Sonnet 4.6 defaults to `high` effort. Explicitly set effort when using Sonnet 4.6 to avoid unexpected latency:

- **Medium effort** (recommended default): Best balance of speed, cost, and performance for most applications. Suitable for agentic coding, tool-heavy workflows, and code generation.
- **Low effort:** For high-volume or latency-sensitive workloads. Suitable for chat and non-coding use cases where faster turnaround is prioritized.
- **High effort:** For complex reasoning and tasks where quality matters more than speed or cost.
- **Max effort:** For tasks requiring the absolute highest capability with no constraints on token spending.

### Recommended Effort Levels for Claude Opus 4.7

**Start with `xhigh` for coding and agentic use cases**, and use `high` as the minimum for most intelligence-sensitive workloads. Step down to `medium` for cost-sensitive workloads, or up to `max` only when your evals show measurable headroom at `xhigh`.

The API default is `high`. To use `xhigh`, set `effort` explicitly; the value you pass overrides the default.

| Effort   | Guidance for Claude Opus 4.7                                                                                                                                                                                               |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `low`    | Efficient, but best for short, scoped tasks. Pair `low` with explicit checklists if your task has multiple sections.                                                                                                       |
| `medium` | The drop-in for the average workflow where you want good results while reducing costs.                                                                                                                                     |
| `high`   | Advanced use cases that still need a balance of intelligence and token consumption. This is often the sweet spot balancing quality and token efficiency.                                                                   |
| `xhigh`  | The recommended starting point for coding and agentic work, and for exploratory tasks like repeated tool calling, detailed web search, and knowledge-base search. Expect meaningfully higher token usage than `high`.      |
| `max`    | Reserve for genuinely frontier problems. On most workloads `max` adds significant cost for relatively small quality gains, and on some structured-output or less intelligence-sensitive tasks it can lead to overthinking. |

Claude Opus 4.7 also respects effort levels more strictly than Claude Opus 4.6, especially at `low` and `medium`. At lower effort levels, the model scopes its work to what was asked rather than going above and beyond. If you observe shallow reasoning on complex problems with Claude Opus 4.7, raise effort rather than prompting around it. If you must keep effort low for latency, add targeted guidance like "This task involves multi-step reasoning. Think carefully before responding."

When running Claude Opus 4.7 at `xhigh` or `max` effort, set a large `max_tokens` so the model has room to think and act across subagents and tool calls. Starting at 64k tokens and tuning from there is a reasonable default.

### Recommended Effort Levels for Claude Opus 4.8

The guidance for Claude Opus 4.7 also applies to Claude Opus 4.8. **Start with `xhigh` for coding and agentic use cases**, use `high` for most other intelligence-sensitive workloads, and step down to `medium` or `low` only when you've measured that the lower level holds quality on your evals.

The API default is `high`. Set `effort` explicitly to use a different level; the value you pass overrides the default.

When running Claude Opus 4.8 at `xhigh` or `max` effort, set a large `max_tokens` so the model has room to think and act across subagents and tool calls. Starting at 64k tokens and tuning from there is a reasonable default.

### Recommended Effort Levels for Claude Opus 5

Claude Opus 5 supports all five effort levels. **Start with `high`, the default**, and adjust based on your evals: step up to `xhigh` for demanding coding and agentic work, or to `max` when a task justifies unconstrained token spending, and use `low` and `medium` liberally as your primary control for token cost and response time wherever your evals show quality holds. If you carried effort settings over from an earlier model, run a fresh effort sweep on your evals rather than reusing them.

Effort controls thinking volume, not visible response length: on Claude Opus 5, changing effort does not reliably shorten responses, so prompt for length instead.

The API default is `high`. Set `effort` explicitly to use a different level; the value you pass overrides the default.

On Claude Opus 5, thinking cannot be disabled at `xhigh` or `max` effort: requests that set `thinking: {"type": "disabled"}` at those levels return a 400 error.

When running Claude Opus 5 at `xhigh` or `max` effort, set a large `max_tokens` so the model has room to think and act across subagents and tool calls. Starting at 64k tokens and tuning from there is a reasonable default.

### Recommended Effort Levels for Claude Fable 5

Effort is the primary control for trading off intelligence, latency, and cost on Claude Fable 5. **Start with `high`, the default, for most tasks**, use `xhigh` for the most capability-sensitive workloads, and step down to `medium` or `low` for routine work. Lower effort settings on Claude Fable 5 still perform well and often exceed `xhigh` performance on prior models. At `high` and `xhigh`, set a large `max_tokens`: it is a hard limit on total output, thinking plus response text.

Reduce effort if a task completes but takes longer than necessary, or if you want a faster, more interactive working style. The same recommendations apply to Claude Mythos 5. For fuller guidance, see the prompting guide for Claude Fable 5.

## Basic Usage

**cURL:**

```bash
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-opus-4-8",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": "Analyze the trade-offs between microservices and monolithic architectures"
        }],
        "output_config": {
            "effort": "medium"
        }
    }'
```

**Python:**

```python
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Analyze the trade-offs between microservices and monolithic architectures",
        }
    ],
    output_config={"effort": "medium"},
)

print(response.content[0].text)
```

**TypeScript:**

```typescript
const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-opus-4-8",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content:
        "Analyze the trade-offs between microservices and monolithic architectures",
    },
  ],
  output_config: {
    effort: "medium",
  },
});

const textBlock = response.content.find(
  (block): block is Anthropic.TextBlock => block.type === "text",
);
console.log(textBlock?.text);
```

**Go:**

```go
client := anthropic.NewClient()

response, err := client.Messages.New(context.TODO(), anthropic.MessageNewParams{
	Model:     anthropic.ModelClaudeOpus4_8,
	MaxTokens: 4096,
	Messages: []anthropic.MessageParam{
		anthropic.NewUserMessage(anthropic.NewTextBlock("Analyze the trade-offs between microservices and monolithic architectures")),
	},
	OutputConfig: anthropic.OutputConfigParam{
		Effort: anthropic.OutputConfigEffortMedium,
	},
})
if err != nil {
	log.Fatal(err)
}
fmt.Println(response.Content[0].Text)
```

## When to Adjust the Effort Parameter

- Use **max effort** when you need the absolute highest capability with no constraints: the most thorough reasoning and deepest analysis. Available on Claude Fable 5, Claude Mythos 5, Claude Opus 4.8, Claude Mythos Preview, Claude Opus 4.7, Claude Opus 4.6, Claude Sonnet 5, and Claude Sonnet 4.6.
- Use **xhigh effort** for advanced coding and complex agentic work requiring extended exploration, like repeated tool calling and detailed search. Available on Claude Fable 5, Claude Mythos 5, Claude Opus 4.8, Claude Opus 4.7, and Claude Sonnet 5.
- Use **high effort** (the default) for complex reasoning, nuanced analysis, difficult coding problems, or any task where quality matters more than speed or cost.
- Use **medium effort** as a balanced option when you want solid performance without the full token expenditure of high effort.
- Use **low effort** when you're optimizing for speed (because Claude answers with fewer tokens) or cost. For example, simple classification tasks, quick lookups, or high-volume use cases where marginal quality improvements don't justify additional latency or spend.

**Claude Code's ultracode mode:** ultracode appears in Claude Code's effort menu, but it is not an additional API effort level. The values documented on this page are the complete set the API accepts. Ultracode pairs the `xhigh` effort level with standing permission for Claude Code to launch multi-agent workflows, granted through mid-conversation system messages. To build similar behavior with the API, see the documentation on building an orchestration mode.

## Effort with Tool Use

When using tools, the effort parameter affects both the explanations around tool calls and the tool calls themselves. Lower effort levels tend to:

- Combine multiple operations into fewer tool calls
- Make fewer tool calls
- Proceed directly to action without preamble
- Use terse confirmation messages after completion

Higher effort levels may:

- Make more tool calls
- Explain the plan before taking action
- Provide detailed summaries of changes
- Include more comprehensive code comments

## Effort with Extended Thinking

The effort parameter works alongside extended thinking. Its behavior depends on the model:

- **Claude Fable 5 and Claude Mythos 5** use adaptive thinking, which is always on (no `thinking` configuration required). `thinking: {type: "disabled"}` is rejected. Effort controls thinking depth the same way as on Opus 4.8 and Opus 4.7.
- **Claude Opus 4.8** uses adaptive thinking (`thinking: {type: "adaptive"}`), where effort is the recommended control for thinking depth. Manual extended thinking (`thinking: {type: "enabled", budget_tokens: N}`) is not supported and returns a 400 error. The model decides when and how much to think based on each request, so it triggers thinking only as needed. At `high`, `xhigh`, and `max` effort, Claude almost always thinks deeply. At lower levels, it may skip thinking for simpler problems. Set `thinking: {type: "adaptive"}` to enable thinking; without it, requests run without thinking.
- **Claude Mythos Preview** uses adaptive thinking by default (no `thinking` configuration required). `thinking: {type: "disabled"}` is rejected. Effort controls thinking depth the same way as on Opus 4.7 and Opus 4.6.
- **Claude Opus 4.7** uses adaptive thinking (`thinking: {type: "adaptive"}`), where effort is the recommended control for thinking depth. Manual extended thinking (`thinking: {type: "enabled", budget_tokens: N}`) is no longer supported on Opus 4.7; use adaptive thinking with effort instead. At `high`, `xhigh`, and `max` effort, Claude almost always thinks deeply. At lower levels, it may skip thinking for simpler problems.
- **Claude Opus 4.6** uses adaptive thinking (`thinking: {type: "adaptive"}`), where effort is the recommended control for thinking depth. While `budget_tokens` is still accepted on Opus 4.6, it is deprecated and will be removed in a future release. At `high` and `max` effort, Claude almost always thinks deeply. At lower levels, it may skip thinking for simpler problems.
- **Claude Sonnet 5** uses adaptive thinking, which is on by default (no `thinking` configuration required), and effort is the recommended control for thinking depth. Manual extended thinking (`thinking: {type: "enabled", budget_tokens: N}`) is not supported and returns a 400 error. Pass `thinking: {type: "disabled"}` to turn thinking off. At `high` (default), `xhigh`, and `max` effort, Claude almost always thinks deeply. At lower levels, it may skip thinking for simpler problems.
- **Claude Sonnet 4.6** uses adaptive thinking (where effort controls thinking depth). Manual thinking with interleaved mode (`thinking: {type: "enabled", budget_tokens: N}`) is still functional but deprecated.
- **Claude Opus 4.5** uses manual thinking (`thinking: {type: "enabled", budget_tokens: N}`), where effort works alongside the thinking token budget. Set the effort level for your task, then set the thinking token budget based on task complexity.

The effort parameter can be used with or without extended thinking enabled. When used without thinking, it still controls overall token spend for text responses and tool calls.

## Best Practices

1. **Set effort explicitly:** The API defaults to `high`, but the right starting point depends on your model and workload.
2. **Use low for speed-sensitive or simple tasks:** When latency matters or tasks are straightforward, low effort can significantly reduce response times and costs.
3. **Test your use case:** The impact of effort levels varies by task type. Evaluate performance on your specific use cases before deploying.
4. **Consider dynamic effort:** Adjust effort based on task complexity. Simple queries may warrant low effort while agentic coding and complex reasoning benefit from high effort.
