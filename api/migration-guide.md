---
title: "Migration Guide"
source_url: "https://platform.claude.com/docs/en/docs/about-claude/models/migration-guide"
source_type: "web-extracted"
fetched_at: "2026-08-24T00:00:00Z"
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

## Migrating to Claude Opus 5

Claude Opus 5 (`claude-opus-5`) is a step-change improvement over Claude Opus 4.8 for complex agentic coding and enterprise work. It is a **drop-in upgrade at the same pricing** ($5/M input, $25/M output) with a 1M token context window (default and maximum), 128k max output tokens, adaptive thinking, prompt caching, batch processing, Files API, PDF support, vision, and server-side and client-side tools.

**Exceptions:** Web fetch is not available, and Priority Tier is not supported on Opus 5.

### From Claude Opus 4.8

```python
model = "claude-opus-4-8"  # Before
model = "claude-opus-5"  # After
```

**Breaking Changes:**

1. **Thinking on by default:** On Opus 4.8, requests without a `thinking` field run _without_ thinking. On Opus 5, the same requests run with **adaptive thinking enabled**. `max_tokens` remains a hard limit on total output (thinking + response); revisit it for workloads that ran without thinking. To preserve old behavior, pass `thinking: {"type": "disabled"}` (at effort `high` or below).

2. **Disabling thinking is capped at `high` effort:** A request combining `thinking: {"type": "disabled"}` with effort `xhigh` or `max` returns a **400 error** (accepted on Opus 4.8). Either re-enable thinking, or keep thinking disabled and lower effort to `high`/`medium`/`low`.

**Recommended Changes (not required):**

1. **Test `max` effort for capability-critical work.** Opus 5 supports the full ladder (`low`, `medium`, `high`, `xhigh`, `max`). At `xhigh`/`max`, set a large `max_tokens` (start at 64k).
2. **Consider automatic fallbacks.** Opus 5 ships cybersecurity safety classifiers; use `fallbacks="default"` (beta header `server-side-fallback-2026-07-01`) to auto-retry refused requests.
3. **Cache shorter prompts.** Minimum cacheable prompt length is 512 tokens (down from 1,024 on Opus 4.8).
4. **Change tools mid-conversation (beta).** Add/remove tools between turns without invalidating prompt cache (beta header `mid-conversation-tool-changes-2026-07-01`).
5. **Re-tune length/verbosity prompts.** Default responses run longer on Opus 5; prompt explicitly for conciseness.

**Migration Checklist (Opus 4.8 → Opus 5):**

- [ ] Update model name from `claude-opus-4-8` to `claude-opus-5`
- [ ] Review workloads without a `thinking` field—they now run with thinking; revisit `max_tokens` or pass `thinking: {"type": "disabled"}` at effort `high` or below
- [ ] Audit requests disabling thinking: `disabled` with `xhigh`/`max` effort returns 400; re-enable thinking or lower effort
- [ ] Re-run a fresh `effort` sweep rather than carrying over Opus 4.8 settings; test `low`/`medium` as cost controls and `max` for capability-critical work
- [ ] Handle `stop_reason: "refusal"`; consider `fallbacks: "default"` (beta)
- [ ] Review prompts near the caching minimum (512+ tokens can now cache)
- [ ] If using `xhigh`/`max`, raise `max_tokens` to at least 64k
- [ ] Re-baseline cost and latency
- [ ] Note: Priority Tier not supported and web fetch not available on Opus 5

## Migrating to Claude Mythos 5

Claude Mythos 5 is an access-gated model in Project Glasswing with a 1M token context window (default), up to 128k output tokens per request, and the same specs and pricing as Claude Fable 5.

**Baseline Settings:**

- **Thinking:** Adaptive thinking always on (no configuration needed)
- **Prefill:** Returns 400 error; use system prompts instead
- **Data Retention:** Requires 30-day retention (not available under ZDR)

### From Claude Mythos Preview

Migration is mostly drop-in with these key changes:

```python
model = "claude-mythos-preview"  # Before
model = "claude-mythos-5"  # After
```

**Features Not Available:**

1. **Extended Thinking Removed:** `budget_tokens` not supported (adaptive thinking always on). Remove manual extended thinking configuration.

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

2. **Assistant Prefill:** Not supported; use system prompts
3. **Thinking Output:** Raw chain of thought never returned; summarized text available when `thinking.display` is set to `"summarized"`
4. **`thinking: {type: "disabled"}`** returns 400 error

**Migration Checklist:**

- [ ] Update model name to `claude-mythos-5`
- [ ] Remove manual extended thinking configuration
- [ ] Remove `thinking: {type: "disabled"}` (returns error)
- [ ] Remove `budget_tokens`
- [ ] Verify thinking field handling treats it as display text
- [ ] Strip thinking blocks when replaying on other models
- [ ] Re-baseline token counts and costs

## Migrating to Claude Fable 5

Claude Fable 5 is Anthropic's most capable widely-released model, generally available on Claude API, Claude Platform on AWS, Amazon Bedrock, Google Cloud, and Microsoft Foundry.

**Pricing:** $10/M input tokens, $50/M output tokens (vs. $5/$25 for Opus 4.8)
**Data Retention:** Requires 30-day retention; returns 400 error for ZDR organizations

### From Claude Opus 4.8

```python
model = "claude-opus-4-8"  # Before
model = "claude-fable-5"  # After
```

**Key Changes:**

1. **Adaptive thinking always on:** Requests without `thinking` field now run with adaptive thinking instead of without thinking.

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

2. **Extended thinking & budgets:** Not supported; same as Opus 4.8
3. **Assistant prefill:** Not supported; same as Opus 4.8
4. **Thinking output:** Raw chain of thought never returned; use `thinking.display: "summarized"` for summaries
5. **Safety classifiers & refusal stop reason:** Returns `stop_reason: "refusal"` (HTTP 200, not error) with `stop_details.category` field (`cyber`, `bio`, `reasoning_extraction`, etc.). No billing for input tokens on pre-generation refusals. Use opt-in `fallbacks` parameter for automatic retry on other models.
6. **Start at high effort:** Default effort remains `high`. On Fable 5, use `high` for most tasks (vs. `xhigh` on Opus 4.8). Lower effort settings perform well and often exceed prior model performance.
7. **Lower prompt caching minimum:** Reduced from 1,024 to 512 tokens. Amazon Bedrock minimum remains 1,024 tokens.

**Migration Checklist:**

- [ ] Verify ZDR eligibility (30-day retention required)
- [ ] Update model name from `claude-opus-4-8` to `claude-fable-5`
- [ ] Remove `thinking: {type: "disabled"}` config
- [ ] Verify thinking field parsing treats as display text
- [ ] Handle `stop_reason: "refusal"` and read `stop_details.category`
- [ ] Consider `fallbacks` parameter for auto-retry
- [ ] Re-evaluate effort settings (start at `high`)
- [ ] Re-baseline costs and latency

## Migrating to Claude Sonnet 5

Claude Sonnet 5 offers the best combination of speed and intelligence. It builds on Claude Sonnet 4.6.

**Pricing:** $2/$10 per million input/output tokens. This was introductory pricing that became the standard price on August 10, 2026 (the previously scheduled increase to $3/$15 on September 1, 2026 will not occur).

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

5. **Sampling parameters:** Non-default values return 400 error. Omit and use prompting.
6. **Thinking display:** Defaults to omitted. Set `display: "summarized"` for visible summaries.

## Migrating to Claude Opus 4.8

Claude Opus 4.8 is built for complex agentic coding and enterprise work.

**Baseline Settings:**

- **Thinking:** Adaptive thinking (`type: "adaptive"`) is off by default
- **Effort:** Defaults to `high`; set `xhigh` explicitly for coding/high-autonomy work
- **Sampling:** `temperature`, `top_p`, `top_k` set to non-default return 400 error
- **Prefill:** Returns 400 error
- **Context Window:** Full 1M token by default with no beta header
- **Max Output:** 128k tokens supported

### From Claude Opus 4.7

**No breaking changes.** Code continues to work unchanged.

```python
model = "claude-opus-4-7"  # Before
model = "claude-opus-4-8"  # After
```

**What Changed (Non-Breaking):**

1. Sampling parameters: Still return 400 error (unchanged from 4.7)
2. Effort default: Now `high` across all surfaces
3. 1M context window: Default with no beta header or premium
4. Mid-conversation system messages: Now accepted (improvement from 4.7)
5. Refusal stop details: Publicly documented (was in beta)
6. Lower prompt caching minimum: 1,024 tokens on Claude API
7. Recalibrated effort levels: `medium` somewhat more thinking, `high` somewhat less, `xhigh` substantially more

**Migration Checklist:**

- [ ] Update model name
- [ ] Remove sampling parameter retry paths if any
- [ ] Re-evaluate effort settings
- [ ] Remove context-window beta headers
- [ ] Consider mid-conversation system messages for prompt caching preservation
- [ ] Verify stop-reason handling reads `stop_details`
- [ ] Re-baseline cost and latency

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

Note: Adaptive thinking is **off by default** on Opus 4.7+. Set `thinking: {type: "adaptive"}` explicitly to enable.

2. **Sampling parameters removed:** Non-default values of `temperature`, `top_p`, `top_k` return 400 error. Omit entirely and use prompting for behavior guidance.
3. **Thinking content omitted by default:** Set `thinking.display: "summarized"` to restore text.
4. **Updated token counting:** New tokenizer uses ~1x to 1.35x more tokens (up to ~35% increase). Update `max_tokens` and re-baseline costs.
5. **Prefill removal:** Prefilling assistant messages returns 400 error. Use structured outputs or `output_config.format`.

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
4. Set large `max_tokens` at `xhigh` effort (start at 64k tokens)
5. Downsample images if high resolution unnecessary

**Migration Checklist (from 4.6):**

- [ ] Update model name
- [ ] Remove `temperature`, `top_p`, `top_k`
- [ ] Replace manual extended thinking with adaptive + effort
- [ ] Remove assistant-message prefills
- [ ] Opt in to thinking summarization for UI display
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

1. Tool parameter JSON escaping may differ (use standard JSON parsers)

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
| Adaptive Thinking | Default On         | Optional           | Optional           | Default On         | Default On         | Always On            |
| Effort Parameter  | Yes                | Yes                | Yes                | Yes                | Yes                | No (always adaptive) |
| Thinking Display  | Omitted by default | Omitted by default | Omitted by default | Omitted by default | Omitted by default | Omitted by default   |

## Important Notes

1. **Always test in development first** before production deployment
2. **Handle breaking changes** -- particularly extended thinking and sampling parameters
3. **Manage thinking output** -- use `display: "summarized"` if you need visible thinking
4. **Re-baseline costs** -- new tokenizers and always-on thinking affect token usage
5. **Review prompts** -- behavioral changes in instruction following, response length, and tone may require updates
6. **Consider effort levels** -- newer models benefit from explicit effort tuning
