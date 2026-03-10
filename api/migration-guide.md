---
title: "Migration Guide - Claude 4.6"
source_url: "https://platform.claude.com/docs/en/docs/about-claude/models/migration-guide"
source_type: "web-extracted"
fetched_at: "2026-03-10T00:00:00Z"
category: "api"
---

# Migration Guide — Claude 4.6

## Migrating to Claude Opus 4.6

Claude Opus 4.6 is a near drop-in replacement for Claude 4.5, with a few breaking changes.

### Breaking Changes

1. **Prefill removal:** Prefilling assistant messages returns a 400 error on Claude 4.6 models. Use structured outputs, system prompt instructions, or `output_config.format` instead.

2. **Tool parameter quoting:** Claude 4.6 may produce slightly different JSON string escaping in tool call arguments. Standard JSON parsers handle this automatically.

### Recommended Changes

1. **Migrate to adaptive thinking:** `thinking: {type: "enabled", budget_tokens: N}` is deprecated on 4.6 models. Switch to `thinking: {type: "adaptive"}` with the effort parameter.

```python
# Before (deprecated)
response = client.beta.messages.create(
    model="claude-opus-4-5",
    thinking={"type": "enabled", "budget_tokens": 32000},
    betas=["interleaved-thinking-2025-05-14"],
    ...
)

# After (recommended)
response = client.messages.create(
    model="claude-opus-4-6",
    thinking={"type": "adaptive"},
    output_config={"effort": "high"},
    ...
)
```

2. **Remove beta headers:** effort (`effort-2025-11-24`), fine-grained tool streaming (`fine-grained-tool-streaming-2025-05-14`), and interleaved thinking (`interleaved-thinking-2025-05-14` for Opus only) are now GA.

3. **Migrate output_format:** Update `output_format={...}` to `output_config={"format": {...}}`.

### From Claude 4.1 or Earlier — Additional Changes

- **Sampling:** Use only `temperature` OR `top_p`, not both (breaking for 3.x)
- **Tool versions:** Update to `text_editor_20250728` and `code_execution_20250825`
- **New stop reasons:** Handle `refusal` and `model_context_window_exceeded`
- **Trailing newlines:** Claude 4.5+ preserves trailing newlines in tool call string parameters
- **Remove legacy headers:** `token-efficient-tools-2025-02-19` and `output-128k-2025-02-19` have no effect on 4+ models

## Migrating to Claude Sonnet 4.6

Same breaking changes as Opus 4.6 (prefill removal, tool parameter escaping). Key additional notes:

- Sonnet 4.6 defaults to effort level `high`. Set effort explicitly to control latency.
- At `low` effort with thinking disabled, expect similar or better performance vs Sonnet 4.5 without thinking.
- For agentic coding: start with `medium` effort
- For chat/content: start with `low` effort
- Interleaved thinking requires beta header `interleaved-thinking-2025-05-14` on Sonnet 4.6 (unlike Opus 4.6 where it's automatic with adaptive)

## Migration Checklist (Opus 4.6)

- [ ] Update model ID to `claude-opus-4-6`
- [ ] Remove assistant message prefills (400 error)
- [ ] Migrate to adaptive thinking
- [ ] Remove deprecated beta headers
- [ ] Migrate `output_format` to `output_config.format`
- [ ] Handle `refusal` and `model_context_window_exceeded` stop reasons
- [ ] Test in development before production
