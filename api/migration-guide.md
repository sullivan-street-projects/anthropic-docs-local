---
title: "Migration Guide"
source_url: "https://platform.claude.com/docs/en/docs/about-claude/models/migration-guide"
source_type: "web-extracted"
fetched_at: "2026-07-13T00:00:00Z"
category: "api"
---

# Claude Migration Guide

This is a comprehensive guide for migrating to the latest Claude models from previous Claude versions. The guide covers Messages API code migration. If you use Claude Managed Agents, no changes beyond updating the model name are required.

> **Tip:** **Automate your migration with the Claude API skill.** In Claude Code, run `/claude-api migrate` to invoke the bundled Claude API skill. It works for any target model on this page and applies the model ID swap, breaking parameter changes, prefill replacement, and effort calibration automatically.

## Migrating to Claude Mythos 5

Claude Mythos 5 is the access-gated model offered in limited availability to approved customers in Project Glasswing. It shares the same specs and pricing as Claude Fable 5: a 1M token context window by default, and up to 128k output tokens per request.

### Key Settings for `claude-mythos-5`

- **Thinking:** Adaptive thinking is always on. The model determines when and how much to think on each request, and no `thinking` configuration is required. Both `thinking: {type: "disabled"}` and manual extended thinking return a 400 error.
- **Prefill:** Prefilling the assistant message returns a 400 error. Use system prompt instructions instead.
- **Data retention:** Claude Mythos 5 requires 30-day data retention and is not available under zero data retention (ZDR) arrangements.

### From Claude Mythos Preview

Migration is mostly drop-in. Claude Mythos 5 uses the same Messages API and tool use patterns as Claude Mythos Preview.

```python
model = "claude-mythos-preview"  # Before
model = "claude-mythos-5"  # After
```

**Features Not Available on Claude Mythos 5:**

1. **Extended Thinking:** Manual extended thinking (`thinking: {type: "enabled", budget_tokens: N}`) is not supported and returns a 400 error. Adaptive thinking is always on; use the `effort` parameter to control thinking depth instead.

```python
# Before (Claude Mythos Preview)
client.messages.create(
    model="claude-mythos-preview",
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 10000},
    messages=[{"role": "user", "content": "..."}],
)

# After (Claude Mythos 5)
client.messages.create(
    model="claude-mythos-5",
    max_tokens=16000,
    messages=[{"role": "user", "content": "..."}],
)
```

2. **Assistant Prefill:** Not supported; returns a 400 error. Use system prompt instructions instead.
3. **Thinking Output:** Raw chain of thought never returned; summarized text available when `thinking.display` is set to `"summarized"`
4. **`thinking: {type: "disabled"}`** returns 400 error

**Migration Checklist:**

- [ ] Update model name from `claude-mythos-preview` to `claude-mythos-5`
- [ ] Remove manual extended thinking configuration
- [ ] Remove any `thinking: {type: "disabled"}` configuration
- [ ] Remove `budget_tokens`
- [ ] Verify code treating thinking as display text only
- [ ] Strip `thinking` and `redacted_thinking` blocks when replaying on other models
- [ ] Re-baseline token counts and costs

## Migrating to Claude Fable 5

Claude Fable 5 is Anthropic's most capable widely-released model, generally available on the Claude API and major cloud platforms. Migration is mostly drop-in. Claude Fable 5 uses the same Messages API and tool use patterns as Claude Opus 4.8. It supports the same 1M token context window by default and 128k max output tokens.

### Before You Migrate

**Pricing:** Claude Fable 5 is priced at $10 per million input tokens and $50 per million output tokens, compared with $5 and $25 for Claude Opus 4.8.

**Data Retention:** Claude Fable 5 requires 30-day data retention and is not available under zero data retention (ZDR) arrangements. A request from an organization whose data retention configuration doesn't meet this requirement returns a 400 `invalid_request_error`.

> **Note:** If your code is on Claude Opus 4.7 or earlier, first apply the relevant Migrating to Claude Opus 4.8 sub-section for your current model. Those sections cover breaking changes (sampling parameters rejected, manual extended thinking rejected, prefill removed, new tokenizer).

### From Claude Opus 4.8

```python
model = "claude-opus-4-8"  # Before
model = "claude-fable-5"  # After
```

**Key Changes:**

1. **Adaptive thinking is always on:** Requests without a `thinking` field run with adaptive thinking on `claude-fable-5`. `thinking: {type: "disabled"}` returns an error. Use the `effort` parameter to control thinking depth. `max_tokens` remains a hard limit on total output (thinking plus response text).

```python
# Before (Claude Opus 4.8)
client.messages.create(
    model="claude-opus-4-8",
    max_tokens=16000,
    thinking={"type": "adaptive"},
    output_config={"effort": "high"},
    messages=[{"role": "user", "content": "..."}],
)

# After (Claude Fable 5)
client.messages.create(
    model="claude-fable-5",
    max_tokens=16000,
    output_config={"effort": "high"},
    messages=[{"role": "user", "content": "..."}],
)
```

2. **Extended thinking & budgets (unchanged):** Manual extended thinking is not supported and returns a 400 error, the same as on Claude Opus 4.8.
3. **Assistant prefill (unchanged):** Not supported and returns a 400 error, the same as on Claude Opus 4.8.
4. **Thinking output:** Raw chain of thought never returned; use `thinking.display: "summarized"` for summaries. Pass thinking blocks back unchanged when continuing a conversation on the same model.
5. **Safety classifiers & refusal stop reason:** `claude-fable-5` runs safety classifiers on requests and during response generation. Returns `stop_reason: "refusal"` (HTTP 200, not error) with `stop_details.category` field (`cyber`, `bio`, `reasoning_extraction`, etc.). You are not billed for input tokens of a request refused before any output is generated. When a classifier fires mid-stream, input and already-streamed output are billed; discard the partial output.
6. **Start at `high` effort:** Default effort remains `high`. On Claude Opus 4.8, the recommendation for coding and high-autonomy work is to set `xhigh` explicitly. On `claude-fable-5`, use `high` as the default for most tasks and reserve `xhigh` for the most capability-sensitive workloads.
7. **Lower prompt caching minimum:** The minimum cacheable prompt length on `claude-fable-5` is 512 tokens, lower than the 1,024 tokens on Claude Opus 4.8.

**Migration Checklist:**

- [ ] Confirm eligibility if your organization has a zero data retention (ZDR) arrangement
- [ ] Update model name from `claude-opus-4-8` to `claude-fable-5`
- [ ] Remove any `thinking: {type: "disabled"}` configuration
- [ ] Verify code treating thinking as display text only
- [ ] Strip `thinking` and `redacted_thinking` blocks when replaying on other models
- [ ] Handle `stop_reason: "refusal"` and read the `stop_details.category` field
- [ ] Re-evaluate your `effort` setting (start at `high` for most tasks)
- [ ] Re-baseline cost and latency on your own workloads

## Migrating to Claude Sonnet 5

Claude Sonnet 5 offers the best combination of speed and intelligence in the Claude model family and builds on Claude Sonnet 4.6.

Claude Sonnet 5 is a drop-in upgrade for Claude Sonnet 4.6. **Introductory pricing** of $2/$10 per million input/output tokens is in effect through August 31, 2026, after which standard pricing of $3/$15 will take effect.

**Breaking Changes:**

- Manual extended thinking (`thinking: {type: "enabled", budget_tokens: N}`) is no longer accepted and returns a 400 error
- Sampling parameters (`temperature`, `top_p`, `top_k`) set to non-default values return a 400 error

Use adaptive thinking with the effort parameter instead. Claude Sonnet 5 supports the same features as Claude Sonnet 4.6 and uses a new tokenizer.

### From Claude Sonnet 4.6

```python
model = "claude-sonnet-4-6"  # Before
model = "claude-sonnet-5"  # After
```

**Key Changes:**

1. **New tokenizer:** Claude Sonnet 5 uses a new tokenizer. The same input text produces approximately 30% more tokens than on Claude Sonnet 4.6. Requests, responses, and streaming events keep the same shape, but token counts, context window capacity, and cost per request differ. Re-run token counting against Claude Sonnet 5.
2. **128k max output tokens (unchanged):** Claude Sonnet 5 supports up to 128k output tokens, the same as Claude Sonnet 4.6.
3. **Assistant message prefilling (unchanged):** Returns a 400 error on Claude Sonnet 5, same as Claude Sonnet 4.6. Use structured outputs or `output_config.format`.
4. **Adaptive thinking on by default:** On Claude Sonnet 4.6, requests without a `thinking` field run without thinking; on Claude Sonnet 5, the same requests run with adaptive thinking. To turn thinking off, pass `thinking: {type: "disabled"}`. Manual extended thinking is not supported and returns a 400 error. Use the effort parameter (default `high`) to control thinking depth.

```python
# Before (Sonnet 4.6)
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 10000},
    messages=[{"role": "user", "content": "..."}],
)

# After (Sonnet 5)
response = client.messages.create(
    model="claude-sonnet-5",
    max_tokens=16000,
    thinking={"type": "adaptive", "display": "summarized"},
    output_config={"effort": "high"},
    messages=[{"role": "user", "content": "..."}],
)
```

5. **Sampling parameters removed (breaking change):** Setting `temperature`, `top_p`, or `top_k` to any non-default value returns a 400 error. Omit these parameters entirely and use prompting for behavior guidance.
6. **Thinking display defaults to omitted:** Thinking blocks appear in the response stream, but their content is omitted by default. Set `thinking.display` to `"summarized"` to receive readable summaries.

## Migrating to Claude Opus 4.8

Claude Opus 4.8 is built for complex agentic coding and enterprise work.

**Baseline Settings for `claude-opus-4-8`:**

- **Thinking:** Adaptive thinking (`type: "adaptive"`) is the supported thinking mode and is off by default
- **Effort:** Defaults to `high` across all surfaces; set `xhigh` explicitly for coding/high-autonomy work
- **Sampling:** `temperature`, `top_p`, `top_k` set to non-default return 400 error
- **Prefill:** Prefilling the assistant message returns 400 error. Use structured outputs or `output_config.format` instead
- **Context Window:** Full 1M token by default with no beta header and no long-context premium
- **Max Output:** 128k tokens supported

### From Claude Opus 4.7

Claude Opus 4.8 should have strong out-of-the-box performance on existing Claude Opus 4.7 prompts and evals. **No breaking API changes** for code already running on Claude Opus 4.7.

```python
model = "claude-opus-4-7"  # Before
model = "claude-opus-4-8"  # After
```

**What Changed (Non-Breaking):**

1. **Sampling parameters (unchanged):** Setting these parameters to non-default values returns a 400 error on both Claude Opus 4.8 and 4.7.
2. **Effort default is `high`:** The effort parameter default on Claude Opus 4.8 is `high` across all surfaces. For coding and high-autonomy work, set `xhigh` explicitly.
3. **1M context window is the default:** Claude Opus 4.8 serves the full 1M token context window by default with no beta header. You can remove any context-window beta header.
4. **Mid-conversation system messages:** Claude Opus 4.8 accepts `role: "system"` messages immediately after a user turn in the `messages` array (subject to placement rules). Earlier models reject this with a 400 error.
5. **Refusal stop details:** The `stop_details` object on refusal responses is now publicly documented. When the model declines a request, it identifies the category of refusal.
6. **Lower prompt caching minimum:** The minimum cacheable prompt length on Claude Opus 4.8 is 1,024 tokens, lower than on Claude Opus 4.7.
7. **Effort levels recalibrated:** The token allocation behind each effort level changes on Claude Opus 4.8 compared to Claude Opus 4.7. If you tuned an effort level against Claude Opus 4.7, re-baseline at the same level before adjusting it.

**Migration Checklist:**

- [ ] Update model name from `claude-opus-4-7` to `claude-opus-4-8`
- [ ] Re-evaluate your `effort` setting
- [ ] Remove any context-window beta header
- [ ] If rebuilding conversation history to update instructions, consider switching to a mid-conversation system message
- [ ] Verify your stop-reason handling reads `stop_details` on refusals
- [ ] Re-baseline cost and latency at your chosen effort level

### From Claude Opus 4.6

**Breaking changes included.** Code requires updates.

```python
model = "claude-opus-4-6"  # Before
model = "claude-opus-4-8"  # After
```

**Breaking Changes:**

1. **Extended thinking removed:**

```python
# Before (Opus 4.6)
client.messages.create(
    model="claude-opus-4-6",
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 10000},
    messages=[{"role": "user", "content": "..."}],
)

# After (Opus 4.8)
client.messages.create(
    model="claude-opus-4-8",
    max_tokens=16000,
    thinking={"type": "adaptive"},
    output_config={"effort": "high"},
    messages=[{"role": "user", "content": "..."}],
)
```

Note: Adaptive thinking is **off by default** on Opus 4.7+. Set `thinking: {type: "adaptive"}` explicitly to enable. Adaptive thinking is steerable through prompting.

2. **Sampling parameters removed:** Non-default values of `temperature`, `top_p`, `top_k` return 400 error. Omit entirely and use prompting for behavior guidance.
3. **Thinking content omitted by default:** Thinking blocks appear in the response stream, but their `thinking` field is empty unless you explicitly opt in. Set `thinking.display: "summarized"` to restore text.
4. **Updated token counting:** New tokenizer uses ~1x to 1.35x more tokens (up to ~35% increase). Update `max_tokens` and re-baseline costs.
5. **Prefill removal:** Prefilling assistant messages returns 400 error. Use structured outputs, system prompt instructions, or `output_config.format`.

**Behavioral Changes:**

1. Response length varies by complexity
2. More literal instruction following
3. More direct tone
4. Built-in progress updates in agentic traces
5. Fewer subagents by default
6. Stricter effort calibration
7. Fewer tool calls by default
8. Real-time cybersecurity safeguards (apply to Cyber Verification Program for reduced restrictions)
9. High-resolution image support (maximum 2576px on long edge, ~3x more image tokens)

**Recommended Changes:**

1. Re-evaluate `max_tokens` for new tokenizer
2. Audit token-count expectations
3. Adopt task budgets (beta) with `task-budgets-2026-03-13` header
4. Set large `max_tokens` at `xhigh` or `max` effort (start at 64k tokens)
5. Downsample images if high resolution unnecessary

**Migration Checklist (from 4.6):**

- [ ] Update model name
- [ ] Remove `temperature`, `top_p`, `top_k`
- [ ] Replace manual extended thinking with adaptive + effort
- [ ] Remove assistant-message prefills
- [ ] If UI displays thinking content, explicitly opt in to thinking summarization
- [ ] Re-benchmark cost and latency
- [ ] Re-tune `max_tokens` for new tokenization
- [ ] Re-test client-side token estimation
- [ ] Re-budget for high-res images; downsample if unnecessary
- [ ] Remove scale-factor conversion for coordinates
- [ ] Review prompts for behavioral changes
- [ ] Re-baseline response length
- [ ] Raise `max_tokens` to 64k+ for `xhigh`/`max` effort
- [ ] Consider task budgets for agentic workflows
- [ ] Apply to Cyber Verification Program if needed

### From Claude Opus 4.5 or Earlier

Apply all changes from Opus 4.6 section plus these cumulative changes:

```python
model = "claude-opus-4-5"  # Before
model = "claude-opus-4-8"  # After
```

**Additional Breaking Changes:**

1. **Prefill removal** is covered in the breaking changes for migrating from Claude Opus 4.6.
2. Tool parameter JSON escaping may differ (use standard JSON parsers)

**Additional Recommended Changes:**

1. Migrate to adaptive thinking (required on 4.7)

```python
# Before (Opus 4.5)
response = client.beta.messages.create(
    model="claude-opus-4-5",
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 32000},
    betas=["interleaved-thinking-2025-05-14"],
    messages=[{"role": "user", "content": "..."}],
)

# After (Opus 4.8)
response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=16000,
    thinking={"type": "adaptive"},
    output_config={"effort": "high"},
    messages=[{"role": "user", "content": "..."}],
)
```

2. Remove effort beta header: `effort-2025-11-24`
3. Remove fine-grained tool streaming beta header: `fine-grained-tool-streaming-2025-05-14`
4. Remove interleaved thinking beta header: `interleaved-thinking-2025-05-14`
5. Migrate `output_format` to `output_config.format` (if applicable)

### From Claude Opus 4.1 or Earlier

Additional steps:

1. **Remove sampling parameters (breaking):** `temperature`, `top_p`, `top_k` return 400 error
2. **Update tool versions:** `text_editor_20250728` / `str_replace_based_edit_tool`, `code_execution_20260521`
3. **Handle `refusal` stop reason**
4. **Handle `model_context_window_exceeded` stop reason**
5. **Verify tool string parameter handling** (trailing newlines now preserved)
6. Remove legacy beta headers: `token-efficient-tools-2025-02-19`, `output-128k-2025-02-19`

## Choosing Effort Levels

The `effort` parameter trades capability for token spend:

| Level    | Guidance                                                                                                             |
| -------- | -------------------------------------------------------------------------------------------------------------------- |
| `max`    | Max effort can deliver performance gains in some use cases but may show diminishing returns; test for intelligence-demanding tasks |
| `xhigh`  | Extra high effort is the best setting for most coding and agentic use cases                                          |
| `high`   | Balances token usage and intelligence; for most intelligence-sensitive use cases, use a minimum of `high` effort     |
| `medium` | Good for cost-sensitive use cases that need to reduce token usage                                                     |
| `low`    | Reserve for short, scoped tasks and latency-sensitive workloads                                                      |

Effort is more important on Claude Opus 4.7+ than prior models.

## Cost Control with Adaptive Thinking

Since `max_tokens` is a hard limit on total output (thinking + response), revisit for workloads that ran without thinking on earlier models. Requests without `thinking` field consume budget for thinking on newer models.

**Example task budget** (beta):

```python
output_config = {
    "effort": "high",
    "task_budget": {"type": "tokens", "total": 128000},
}
```

## Summary Table: Breaking Changes by Migration Path

| Feature           | Opus 4.8           | Opus 4.7           | Sonnet 5           | Fable 5            | Mythos 5             |
| ----------------- | ------------------ | ------------------ | ------------------ | ------------------ | -------------------- |
| Extended Thinking | Error              | Error              | Error              | Error              | Error                |
| Sampling Params   | Error              | Error              | Error              | Error              | Error                |
| Assistant Prefill | Error              | Error              | Error              | Error              | Error                |
| Adaptive Thinking | Optional           | Optional           | Default On         | Default On         | Always On            |
| Effort Parameter  | Yes                | Yes                | Yes                | Yes                | No (always adaptive) |
| Thinking Display  | Omitted by default | Omitted by default | Omitted by default | Omitted by default | Omitted by default   |

## Important Notes

1. **Always test in development first** before production deployment
2. **Handle breaking changes** -- particularly extended thinking and sampling parameters
3. **Manage thinking output** -- use `display: "summarized"` if you need visible thinking
4. **Re-baseline costs** -- new tokenizers and always-on thinking affect token usage
5. **Review prompts** -- behavioral changes in instruction following, response length, and tone may require updates
6. **Consider effort levels** -- newer models benefit from explicit effort tuning
