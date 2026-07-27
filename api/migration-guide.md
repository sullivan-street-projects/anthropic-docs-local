---
title: "Migration Guide"
source_url: "https://platform.claude.com/docs/en/docs/about-claude/models/migration-guide"
source_type: "web-extracted"
fetched_at: "2026-07-27T00:00:00Z"
category: "api"
---

# Claude Migration Guide

This is a comprehensive guide for migrating to the latest Claude models from previous Claude versions. The guide covers Messages API code migration, with notes that Claude Managed Agents require only model name updates.

### Automated Migration

Claude Code includes a `/claude-api migrate` command that automates migration by:

- Applying model ID swaps
- Handling breaking parameter changes
- Managing prefill replacements
- Calibrating effort levels
- Detecting platform-specific clients (Amazon Bedrock, Google Cloud, Claude Platform on AWS, Microsoft Foundry)

## Migrating to Claude Mythos 5 and Claude Fable 5

Claude Fable 5 is Anthropic's most capable widely released model, generally available on the Claude API, Amazon Bedrock, Claude Platform on AWS, Google Cloud, and Microsoft Foundry. Claude Mythos 5 shares the same capabilities and is offered in limited availability to approved customers in Project Glasswing.

The baseline settings shared by `claude-fable-5` and `claude-mythos-5`:

- **Thinking:** Adaptive thinking is always on. The model determines when and how much to think on each request, and no `thinking` configuration is required. Both `thinking: {type: "disabled"}` and manual extended thinking (`thinking: {type: "enabled", budget_tokens: N}`) return a 400 error.
- **Prefill:** Prefilling the assistant message returns a 400 error. Use system prompt instructions instead.
- **Context window and output:** A 1M token context window by default, and up to 128k output tokens per request.
- **Pricing:** $10 USD per million input tokens and $50 USD per million output tokens.
- **Data retention:** Both models require 30-day data retention and are not available under zero data retention (ZDR) arrangements; both are designated Covered Models.

Where the two models diverge:

- **Availability:** Claude Fable 5 is generally available. Claude Mythos 5 is available only to approved customers in Project Glasswing.
- **Safety classifiers:** Claude Fable 5 runs safety classifiers that can decline requests with `stop_reason: "refusal"`. Claude Mythos 5 does not include these classifiers.
- **Priority Tier:** Priority Tier is supported on Claude Fable 5 but not on Claude Mythos 5.

### From Claude Mythos Preview

Migration is mostly drop-in. The key changes to check are the features that are no longer available and thinking output.

```python
model = "claude-mythos-preview"  # Before
model = "claude-mythos-5"  # After
# Or: model = "claude-fable-5"  # For the generally available model
```

**Features Not Available:**

1. **Extended Thinking Removed:** `budget_tokens` not supported (adaptive thinking always on). Remove manual extended thinking configuration.
2. **Assistant Prefill:** Not supported; use system prompts
3. **Thinking Output:** Raw chain of thought never returned; summarized text available when `thinking.display` is set to `"summarized"`
4. **`thinking: {type: "disabled"}`** returns 400 error

**Migration Checklist:**

- [ ] Update model name to `claude-mythos-5` or `claude-fable-5`
- [ ] Remove manual extended thinking configuration
- [ ] Remove `thinking: {type: "disabled"}` (returns error)
- [ ] Remove `budget_tokens`
- [ ] Verify thinking field handling treats it as display text
- [ ] Strip thinking blocks when replaying on other models
- [ ] If migrating to Claude Fable 5, handle `stop_reason: "refusal"` and read `stop_details.category`
- [ ] Re-baseline token counts and costs

### From Claude Opus 5

```python
model = "claude-opus-5"  # Before
model = "claude-fable-5"  # After
```

**Key Changes:**

1. **Thinking can no longer be disabled:** On Claude Opus 5, thinking can be turned off with `thinking: {type: "disabled"}` at effort `high` or below. On Fable 5 and Mythos 5, adaptive thinking is always on, and `thinking: {type: "disabled"}` returns a 400 error at any effort level.
2. **Pricing:** $10/$50 per MTok (vs. $5/$25 for Opus 5).
3. **Data Retention:** Requires 30-day retention (not available under ZDR).

### From Claude Opus 4.8

Migration is mostly drop-in. Token counts are roughly unchanged because the models use the same tokenizer.

```python
model = "claude-opus-4-8"  # Before
model = "claude-fable-5"  # After
```

**Key Changes:**

1. **Adaptive thinking always on:** Requests without `thinking` field now run with adaptive thinking instead of without thinking. `max_tokens` remains a hard limit on total output.
2. **Extended thinking & budgets (unchanged):** Not supported, same as Opus 4.8.
3. **Assistant prefill (unchanged):** Not supported, same as Opus 4.8.
4. **Thinking output:** Raw chain of thought never returned; use `thinking.display: "summarized"` for summaries.
5. **Safety classifiers & refusal stop reason (Claude Fable 5 only):** Returns `stop_reason: "refusal"` (HTTP 200, not error) with `stop_details.category` field.
6. **Start at high effort:** Default effort remains `high`. On Fable 5, use `high` for most tasks. Lower effort settings still perform well and often exceed `xhigh` performance on prior models.
7. **Lower prompt caching minimum:** Reduced from 1,024 to 512 tokens.

**Migration Checklist:**

- [ ] Verify ZDR eligibility (30-day retention required)
- [ ] Update model name from `claude-opus-4-8` to `claude-fable-5`
- [ ] Remove `thinking: {type: "disabled"}` config
- [ ] Verify thinking field parsing treats as display text
- [ ] If migrating to Claude Fable 5, handle `stop_reason: "refusal"` and read `stop_details.category`
- [ ] Consider `fallbacks` parameter for auto-retry
- [ ] Re-evaluate effort settings (start at `high`)
- [ ] Re-baseline costs and latency

## Migrating to Claude Opus 5

Claude Opus 5 is a step-change improvement over Claude Opus 4.8, strong on deep reasoning, agentic and long-horizon tasks, and test-time compute scaling. It is a drop-in upgrade at the same pricing of $5 per million input tokens and $25 per million output tokens.

Claude Opus 5 supports the same set of features as Claude Opus 4.8, including 1M token context window, 128k max output tokens, adaptive thinking, prompt caching, batch processing, the Files API, PDF support, vision, and server-side and client-side tools, with two exceptions: web fetch is not available on Claude Opus 5, and Priority Tier is not supported.

### From Claude Opus 4.8

**Two breaking changes** for code already running on Claude Opus 4.8:

```python
model = "claude-opus-4-8"  # Before
model = "claude-opus-5"  # After
```

**Breaking Changes:**

1. **Thinking on by default:** Requests without a `thinking` field now run with adaptive thinking. Revisit `max_tokens`. To preserve the old behavior, pass `thinking: {type: "disabled"}`, subject to the effort cap in the next item.
2. **Disabling thinking is capped at `high` effort:** `thinking: {type: "disabled"}` with effort `xhigh` or `max` returns a 400 error. Claude Opus 4.8 accepts this combination.

**Recommended Changes:**

1. Test `max` effort for capability-critical work
2. Consider automatic fallbacks (`fallbacks: "default"` for cyber-category refusals)
3. Cache shorter prompts (minimum cacheable length reduced from 1,024 to 512 tokens)
4. Change tools mid-conversation (beta, `mid-conversation-tool-changes-2026-07-01` header)
5. Re-tune length and verbosity prompts (default responses run longer on Opus 5)
6. Remove carried-over verification instructions (Claude Opus 5 verifies its own work)

**Migration Checklist:**

- [ ] Update model name to `claude-opus-5`
- [ ] Review workloads that ran without `thinking` field
- [ ] Audit requests that disable thinking at `xhigh`/`max` effort
- [ ] Re-evaluate effort settings with a fresh sweep
- [ ] Handle `stop_reason: "refusal"`
- [ ] Re-baseline cost and latency

### From Claude Opus 4.7

**Two breaking changes:**

```python
model = "claude-opus-4-7"  # Before
model = "claude-opus-5"  # After
```

**Breaking Changes:**

1. **Thinking on by default:** Same as from Opus 4.8 section.
2. **Disabling thinking capped at `high` effort:** Same as from Opus 4.8 section.

**What Changed (Non-Breaking):**

1. Sampling parameters: Still return 400 error (unchanged from 4.7)
2. Effort default: `high` on Claude API and Claude Code
3. Effort levels recalibrated for Opus 5
4. 1M context window: Default with no beta header
5. Mid-conversation system messages: Now accepted
6. Refusal stop details: Publicly documented
7. Lower prompt caching minimum: 512 tokens on Claude Opus 5
8. Fast mode: Supported on Opus 5 (not available on 4.7)

**Migration Checklist:**

- [ ] Update model name
- [ ] Review workloads that ran without `thinking` field
- [ ] Audit requests that disable thinking at `xhigh`/`max` effort
- [ ] Re-evaluate effort settings with fresh sweep
- [ ] Remove context-window beta headers
- [ ] Consider mid-conversation system messages for prompt caching preservation
- [ ] Verify stop-reason handling reads `stop_details`
- [ ] Re-baseline cost and latency

### From Claude Opus 4.6 and Earlier

**Breaking changes included.** Code requires updates.

```python
model = "claude-opus-4-6"  # Before
model = "claude-opus-5"  # After
```

**Breaking Changes:**

1. **Extended thinking removed:** `thinking: {type: "enabled", budget_tokens: N}` returns 400 error on Opus 4.7+. Switch to adaptive thinking. On Opus 5, adaptive thinking is on by default.
2. **Thinking on by default:** Requests without `thinking` field run with adaptive thinking on Opus 5.
3. **Disabling thinking capped at `high` effort:** `thinking: {type: "disabled"}` with `xhigh`/`max` returns 400 error.
4. **Sampling parameters removed:** Non-default values of `temperature`, `top_p`, `top_k` return 400 error.
5. **Thinking content omitted by default:** Set `thinking.display: "summarized"` to restore text.
6. **Updated token counting:** New tokenizer uses ~1x to 1.35x more tokens (up to ~35% increase).
7. **Prefill removal:** Prefilling assistant messages returns 400 error.

**Behavioral Changes:**

1. Response length varies by complexity
2. More literal instruction following
3. More direct tone
4. Built-in progress updates in agentic traces
5. Subagent spawning changed (Opus 5 delegates more readily than earlier models)
6. Stricter effort calibration
7. Fewer tool calls by default
8. Real-time cybersecurity safeguards
9. High-resolution image support (maximum 2576px on long edge, ~3x more image tokens)

**Migration Checklist (from 4.6):**

- [ ] Update model name
- [ ] Remove `temperature`, `top_p`, `top_k`
- [ ] Replace manual extended thinking with adaptive + effort, or remove `thinking` field (on by default on Opus 5)
- [ ] Review workloads that ran without `thinking` field
- [ ] Audit requests that disable thinking at `xhigh`/`max` effort
- [ ] Remove assistant-message prefills
- [ ] Opt in to thinking summarization for UI display
- [ ] Re-benchmark cost and latency
- [ ] Re-tune `max_tokens` for new tokenization
- [ ] Re-test client-side token estimation
- [ ] Re-budget for high-res images; downsample if unnecessary
- [ ] Remove scale-factor conversion for coordinates
- [ ] Review prompts for behavioral changes
- [ ] Remove carried-over verification instructions
- [ ] Raise `max_tokens` to 64k+ for `xhigh`/`max` effort
- [ ] Consider task budgets for agentic workflows
- [ ] Apply to Cyber Verification Program if needed

### From Claude Opus 4.5 or Earlier

Apply all changes from Opus 4.6 section plus these cumulative changes:

```python
model = "claude-opus-4-5"  # Before
model = "claude-opus-5"  # After
```

**Additional Breaking Changes:**

1. Tool parameter JSON escaping may differ (use standard JSON parsers)

**Additional Recommended Changes:**

1. Migrate to adaptive thinking (required on 4.7+)
2. Remove beta headers: `effort-2025-11-24`, `fine-grained-tool-streaming-2025-05-14`, `interleaved-thinking-2025-05-14`
3. Migrate `output_format` to `output_config.format` (if applicable)

### From Claude Opus 4.1 or Earlier

Additional steps:

1. **Remove sampling parameters (breaking):** `temperature`, `top_p`, `top_k` return 400 error
2. **Update tool versions:** `text_editor_20250728` / `str_replace_based_edit_tool`, `code_execution_20260521`
3. **Handle `refusal` stop reason**
4. **Handle `model_context_window_exceeded` stop reason**
5. **Verify tool string parameter handling** (trailing newlines now preserved)
6. Remove legacy beta headers: `token-efficient-tools-2025-02-19`, `output-128k-2025-02-19`

## Migrating to Claude Sonnet 5

Claude Sonnet 5 offers the best combination of speed and intelligence. It builds on Claude Sonnet 4.6.

**Pricing:** Introductory $2/$10 per million input/output tokens through August 31, 2026; then $3/$15 standard pricing.

**Breaking Changes:**

- Manual extended thinking returns 400 error
- Non-default sampling parameters return 400 error

### From Claude Sonnet 4.6

```python
model = "claude-sonnet-4-6"  # Before
model = "claude-sonnet-5"  # After
```

**Key Changes:**

1. **New tokenizer:** Same input produces ~30% more tokens. `usage` fields higher, context window holds less text, `max_tokens` tuned for 4.6 may truncate equivalent output. Re-run token counting against Sonnet 5.
2. **128k max output tokens:** Unchanged from Sonnet 4.6.
3. **Assistant message prefilling:** Returns 400 error (unchanged from 4.6). Use structured outputs or `output_config.format`.
4. **Adaptive thinking on by default:** Requests without `thinking` field now run with adaptive thinking (vs. without on 4.6). To disable: `thinking: {type: "disabled"}`.
5. **Sampling parameters:** Non-default values return 400 error. Omit and use prompting.
6. **Thinking display:** Defaults to omitted. Set `display: "summarized"` for visible summaries.

## Choosing Effort Levels

The `effort` parameter trades capability for token spend:

| Level    | Guidance                                                                          |
| -------- | --------------------------------------------------------------------------------- |
| `max`    | Max effort can deliver gains but shows diminishing returns; prone to overthinking |
| `xhigh`  | Best for coding and agentic work                                                  |
| `high`   | Balances usage and intelligence; minimum for intelligence-sensitive tasks         |
| `medium` | Cost-sensitive work; trades intelligence                                          |
| `low`    | Short, scoped tasks and latency-sensitive non-intelligence-sensitive work         |

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

| Feature           | Opus 5             | Opus 4.8           | Opus 4.7           | Sonnet 5           | Fable 5            | Mythos 5             |
| ----------------- | ------------------ | ------------------ | ------------------ | ------------------ | ------------------ | -------------------- |
| Extended Thinking | Error              | Error              | Error              | Error              | Error              | Error                |
| Sampling Params   | Error              | Error              | Error              | Error              | Error              | Error                |
| Assistant Prefill | Error              | Error              | Error              | Error              | Error              | Error                |
| Adaptive Thinking | Default On         | Optional           | Optional           | Default On         | Always On          | Always On            |
| Effort Parameter  | Yes                | Yes                | Yes                | Yes                | Yes                | No (always adaptive) |
| Thinking Display  | Omitted by default | Omitted by default | Omitted by default | Omitted by default | Omitted by default | Omitted by default   |
| Disable Thinking  | Capped at high     | Any effort         | Any effort         | Any effort         | Error              | Error                |

## Important Notes

1. **Always test in development first** before production deployment
2. **Handle breaking changes** -- particularly extended thinking and sampling parameters
3. **Manage thinking output** -- use `display: "summarized"` if you need visible thinking
4. **Re-baseline costs** -- new tokenizers and always-on thinking affect token usage
5. **Review prompts** -- behavioral changes in instruction following, response length, and tone may require updates
6. **Consider effort levels** -- newer models benefit from explicit effort tuning
