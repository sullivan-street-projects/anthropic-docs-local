---
title: "Migration Guide"
source_url: "https://platform.claude.com/docs/en/docs/about-claude/models/migration-guide"
source_type: "web-extracted"
fetched_at: "2026-06-28T00:00:00Z"
category: "api"
---

# Claude Migration Guide

This is a comprehensive migration guide for upgrading to the latest Claude models from previous versions. The guide covers the Messages API (Claude Managed Agents only require model name updates).

## Key Migration Paths

### 1. Claude Mythos Preview to Claude Mythos 5

**Status:** Mostly drop-in migration

```python
model = "claude-mythos-5"  # from "claude-mythos-preview"
```

**Breaking Changes:**
- Extended thinking with `budget_tokens` not supported (adaptive thinking always on)
- `thinking: {type: "disabled"}` returns 400 error
- No assistant message prefilling
- Thinking output never returns raw chain of thought

**Migration Steps:**
1. Update model name
2. Remove manual extended thinking configuration
3. Remove `thinking: {type: "disabled"}` settings
4. Remove `budget_tokens` (use `effort` parameter instead)
5. Set `thinking.display: "summarized"` if you need readable thinking summaries
6. Strip thinking blocks when replaying on other models
7. Re-baseline token counts and costs

### 2. Claude Opus 4.8 to Claude Fable 5

**Status:** Mostly drop-in migration with pricing changes

```python
model = "claude-fable-5"  # from "claude-opus-4-8"
```

**Important Considerations Before Migration:**
- **Pricing:** $10/MTok input, $50/MTok output (vs $5/$25 for Opus 4.8)
- **Data Retention:** Requires 30-day minimum (not available under ZDR)
- Organizations with ZDR must contact Anthropic account team

**Key Changes:**
1. **Adaptive thinking always on:** Requests without `thinking` field run with adaptive thinking (unlike Opus 4.8)
2. **No extended thinking:** Manual `thinking: {type: "enabled", budget_tokens: N}` not supported
3. **`max_tokens` adjustment:** May need increase since thinking+output shares the limit
4. **Safety classifiers:** May return `stop_reason: "refusal"` with `stop_details.category` field
5. **Thinking output:** Raw chain of thought never returned; use `thinking.display: "summarized"` for summaries
6. **Effort parameter:** Start at `high` for most tasks (was `xhigh` recommendation on Opus 4.8)
7. **Prompt caching minimum:** Reduced from 1,024 to 512 tokens

**Migration Checklist:**
- [ ] Verify ZDR eligibility
- [ ] Update model name
- [ ] Remove `thinking: {type: "disabled"}` configs
- [ ] Handle `stop_reason: "refusal"` with refusal categories
- [ ] Adjust effort settings (start at `high`)
- [ ] Strip thinking blocks before replaying on other models
- [ ] Re-baseline costs and latency

### 3. Claude Opus 4.7 to Claude Opus 4.8

**Status:** No breaking changes (behavioral improvements only)

```python
model = "claude-opus-4-8"  # from "claude-opus-4-7"
```

**What Changed (Non-breaking):**
1. **Effort default is `high`** (was configurable before)
2. **1M context window is default:** No beta header needed
3. **Mid-conversation system messages:** Now supported
4. **Refusal stop details:** Publicly documented with categories
5. **Prompt caching minimum:** Lowered to 1,024 tokens
6. **Effort levels recalibrated:** `medium` allows more thinking, `high` less, `xhigh` substantially more

**Migration Checklist:**
- [ ] Update model name
- [ ] Remove context-window beta header
- [ ] Consider mid-conversation system messages to preserve prompt cache
- [ ] Handle `stop_details.category` on refusals
- [ ] Re-baseline cost/latency at chosen effort level

### 4. Claude Opus 4.6/4.7 to Claude Opus 4.7

**Status:** Breaking changes required

```python
model = "claude-opus-4-7"  # from "claude-opus-4-6"
```

**Breaking Changes:**
1. **Extended thinking removed:** `thinking: {type: "enabled", budget_tokens: N}` returns 400 error
2. **Sampling parameters removed:** `temperature`, `top_p`, `top_k` return 400 error
3. **Thinking display omitted by default:** Set `thinking.display: "summarized"` to restore
4. **New tokenizer:** Same content uses 1x-1.35x more tokens (up to 35%)
5. **No assistant prefilling:** Returns 400 error

**What You Need to Do:**

```python
# Before (Opus 4.6)
client.messages.create(
    model="claude-opus-4-6",
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 10000},
    messages=[{"role": "user", "content": "..."}],
)

# After (Opus 4.7)
client.messages.create(
    model="claude-opus-4-7",
    max_tokens=16000,
    thinking={"type": "adaptive"},
    output_config={"effort": "high"},  # or xhigh, medium, low
    messages=[{"role": "user", "content": "..."}],
)
```

**Effort Levels:**
- **`max`:** Max effort, potential diminishing returns
- **`xhigh`:** Best for coding and agentic work
- **`high`:** Balanced for most intelligence-sensitive tasks
- **`medium`:** Cost-sensitive with some capability trade-off
- **`low`:** Short, scoped tasks; latency-sensitive

**Behavioral Changes:**
1. Response length varies by complexity (shorter on simple tasks)
2. More literal instruction following
3. More direct tone
4. Built-in progress updates in agentic traces
5. Fewer subagents spawned by default
6. Stricter effort calibration
7. Fewer tool calls by default (uses reasoning more)
8. Real-time cybersecurity safeguards (apply to Cyber Verification Program if needed)
9. High-resolution image support (up to 2576px, ~3x more tokens per image)

**Migration Checklist:**
- [ ] Update model name
- [ ] Remove `temperature`, `top_p`, `top_k`
- [ ] Replace manual extended thinking with adaptive + effort
- [ ] Remove assistant prefills
- [ ] Explicitly opt in to thinking summarization if needed
- [ ] Re-benchmark cost/latency with new tokenization
- [ ] Increase `max_tokens` for headroom
- [ ] Re-test client-side token estimations
- [ ] Re-budget for high-resolution images (downsample if unnecessary)
- [ ] Remove scale-factor conversion for pointing coordinates (1:1 with pixels)
- [ ] Review prompts for behavioral changes
- [ ] Consider adopting task budgets for agentic workflows
- [ ] Apply to Cyber Verification Program if doing security work

### 5. Claude Opus 4.5 or Earlier to Claude Opus 4.7

**Status:** Requires cumulative breaking changes

Apply all Opus 4.7 changes above, PLUS:

**Additional Breaking Changes:**
1. Tool parameter JSON escaping may differ
2. Prefill removal (already covered above)

**Additional Recommendations:**
1. Migrate to adaptive thinking (required on Opus 4.7)
2. Remove `effort-2025-11-24` beta header
3. Remove `fine-grained-tool-streaming-2025-05-14` beta header
4. Remove `interleaved-thinking-2025-05-14` beta header
5. Migrate `output_format` to `output_config.format`

### 6. Claude 4.1 or Earlier to Claude Opus 4.7

**Status:** Major breaking changes required

Apply all Opus 4.7 changes, PLUS:

**Additional Breaking Changes:**
1. **Remove sampling parameters** (temperature, top_p, top_k) return 400 error
2. **Update tool versions:**
   - Text editor: `text_editor_20250728` / `str_replace_based_edit_tool`
   - Code execution: `code_execution_20250825`
   - Remove `undo_edit` command
3. **Handle `refusal` stop reason:**
   ```python
   if response.stop_reason == "refusal":
       # Handle refusal appropriately
   ```
4. **Handle `model_context_window_exceeded` stop reason:**
   ```python
   if response.stop_reason == "model_context_window_exceeded":
       # Handle context window limit
   ```
5. **Verify tool string parameter handling** for trailing newlines

**Remove Legacy Beta Headers:**
- `token-efficient-tools-2025-02-19`
- `output-128k-2025-02-19`

### 7. Claude Sonnet 4.5 to Claude Sonnet 4.6

**Status:** Breaking changes but recommended migration

```python
model = "claude-sonnet-4-6"  # from "claude-sonnet-4-5"
```

**Breaking Changes:**
1. **No assistant message prefilling** returns 400 error
2. **Tool parameter JSON escaping may differ**
3. **Effort default is `high`** (new parameter)

**If Not Using Extended Thinking:**

```python
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=8192,
    output_config={"effort": "low"},
    messages=[{"role": "user", "content": "Your prompt here"}],
)
```

**If Using Extended Thinking:**

Migrate to adaptive thinking:

```python
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=64000,
    thinking={"type": "adaptive"},
    output_config={"effort": "medium"},
    messages=[{"role": "user", "content": "Your prompt here"}],
)
```

**Recommended Effort Levels by Use Case:**
- **Coding/Agentic:** `medium` (adjust if latency too high)
- **Chat/Content/Search:** `low` with extended thinking

**Recommended Changes:**
1. Remove `fine-grained-tool-streaming-2025-05-14` beta header
2. Migrate `output_format` to `output_config.format`

## Common Code Migration Examples

### Extended Thinking Migration (Opus 4.6 to 4.7)

```python
# Before: Opus 4.6
client.messages.create(
    model="claude-opus-4-6",
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 10000},
    messages=[{"role": "user", "content": "..."}],
)

# After: Opus 4.7
client.messages.create(
    model="claude-opus-4-7",
    max_tokens=16000,
    thinking={"type": "adaptive"},
    output_config={"effort": "high"},
    messages=[{"role": "user", "content": "..."}],
)
```

### Sampling Parameters Removal

```python
# Before: Claude 3.x
client.messages.create(
    model="claude-3-7-sonnet-20250219",
    temperature=0.7,
    top_p=0.9,
    messages=[...],
)

# After: Opus 4.7+ (use prompting instead)
client.messages.create(
    model="claude-opus-4-7",
    messages=[...],
)
```

### Tool Version Updates (Claude 4.1 to 4.7)

```python
# Before
tools = [{"type": "text_editor_20250124", "name": "str_replace_editor"}]

# After
tools = [{"type": "text_editor_20250728", "name": "str_replace_based_edit_tool"}]
```

### Refusal Handling

```python
response = client.messages.create(...)

if response.stop_reason == "refusal":
    category = response.stop_details.category
    # Handle based on category: "cyber", "bio", "reasoning_extraction", etc.
```

## Token Counting and Billing

- **New Tokenizer (Opus 4.7+):** Same content uses ~1.35x more tokens than Opus 4.6
- **Claude Fable 5:** $10/MTok input, $50/MTok output
- **Token Counting:** Use `/v1/messages/count_tokens` endpoint to verify actual usage

## Automated Migration

**Claude Code Integration:** Use `/claude-api migrate` in Claude Code to automate:
- Model ID swap
- Breaking parameter changes
- Prefill replacement
- Effort calibration
- Platform-specific adjustments (Bedrock, Google Cloud, etc.)

Example:
```
/claude-api migrate this project to claude-opus-4-8
```

## Important Notes

1. **Always test in development first** before production deployment
2. **Re-baseline costs and latency** after migration
3. **Update `max_tokens`** to account for tokenization changes
4. **Strip thinking blocks** when replaying conversations on other models
5. **Data retention requirements** for Fable 5 (30-day minimum)
6. **Apply to Cyber Verification Program** if doing legitimate security work
