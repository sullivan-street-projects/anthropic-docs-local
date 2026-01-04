---
title: "Model Deprecations"
source_url: "https://docs.claude.com/en/docs/about-claude/model-deprecations"
source_type: "web-extracted"
fetched_at: "2026-01-04T06:05:00Z"
category: "models"
---

# Model Deprecations

This document tracks Claude model deprecations, retirement dates, and migration guidance.

## Deprecation Policy

- **60-day notice** minimum before model retirement for publicly released models
- Notification sent to customers with active deployments
- Usage audit available at https://console.anthropic.com/settings/usage

## Retired Models

These models are no longer available:

| Model | Deprecated | Retired | Migration Target |
|-------|------------|---------|------------------|
| Claude 1.x | Sep 4, 2024 | Nov 6, 2024 | Claude 3+ |
| Claude Instant | Sep 4, 2024 | Nov 6, 2024 | Claude 3 Haiku |
| Claude 2.1 | - | Jul 21, 2025 | Claude Sonnet 4 |
| Claude 3 Sonnet (2024-02-29) | - | Jul 21, 2025 | Claude Sonnet 4 |

## Deprecated Models (Active with Retirement Date)

These models are deprecated and will be retired:

| Model | Model ID | Deprecated | Retirement Date | Migration Target |
|-------|----------|------------|-----------------|------------------|
| Claude 3 Opus | `claude-3-opus-20240229` | Jun 30, 2025 | Jan 5, 2026 | Claude Opus 4.1 |
| Claude 3.5 Sonnet v1 | `claude-3-5-sonnet-20240620` | Aug 20, 2025 | Feb 19, 2026 | Claude Sonnet 4.5 |
| Claude 3.5 Sonnet v2 | `claude-3-5-sonnet-20241022` | Aug 20, 2025 | Feb 19, 2026 | Claude Sonnet 4.5 |
| Claude 3.7 Sonnet | `claude-3-7-sonnet-20250219` | Nov 11, 2025 | May 11, 2026 | Claude Sonnet 4.5 |

## AWS Bedrock Specific

| Model | Region Impact | Sunset Date | Extended Access |
|-------|--------------|-------------|-----------------|
| claude-3-5-sonnet-20240620-v1:0 | US-EAST-1, US-EAST-2, US-WEST-2, EU-CENTRAL-1, EU-CENTRAL-2, EU-WEST-1, EU-WEST-3 | Dec 1, 2025 | Until Mar 1, 2026 (premium pricing) |

## Current Recommended Models

All Claude 4.x models are General Availability (GA) and actively maintained:

| Model | Status | Recommended Use |
|-------|--------|-----------------|
| Claude Opus 4.5 | GA | Complex reasoning, research |
| Claude Opus 4.1 | GA | Agentic tasks, real-world coding |
| Claude Opus 4 | GA | Premium tier (legacy) |
| Claude Sonnet 4.5 | GA | Coding, agents, computer use |
| Claude Sonnet 4 | GA | General balanced use |
| Claude Haiku 4.5 | GA | Fast, cost-efficient |
| Claude Haiku 3.5 | GA | Budget-conscious applications |
| Claude Haiku 3 | GA | Lowest cost option |

## Migration Guide

### From Claude 3 Opus to Opus 4.1

```python
# Before
model = "claude-3-opus-20240229"

# After
model = "claude-opus-4-1-20250805"
```

Key differences:
- Improved agentic task performance
- Better real-world coding capabilities
- Enhanced reasoning
- Same pricing ($15/$75 per MTok)

### From Claude 3.5/3.7 Sonnet to Sonnet 4.5

```python
# Before
model = "claude-3-5-sonnet-20241022"
# or
model = "claude-3-7-sonnet-20250219"

# After
model = "claude-sonnet-4-5-20250929"
```

Key differences:
- 77-82% on SWE-bench (up from 62%)
- 1M context window beta available
- Improved computer use
- Same pricing ($3/$15 per MTok)

### Checking Current Model Usage

Visit the Anthropic Console to audit your API usage:
- https://console.anthropic.com/settings/usage

Review which models your applications are calling to identify deprecated model usage.

## Deprecation Timeline Visual

```
2024
├── Sep 4: Claude 1.x, Instant deprecated
├── Nov 6: Claude 1.x, Instant retired

2025
├── Jun 30: Claude 3 Opus deprecated
├── Jul 21: Claude 2.1, Claude 3 Sonnet retired
├── Aug 20: Claude 3.5 Sonnet deprecated
├── Nov 11: Claude 3.7 Sonnet deprecated
├── Dec 1: AWS Bedrock v1 sunset (some regions)

2026
├── Jan 5: Claude 3 Opus retirement
├── Feb 19: Claude 3.5 Sonnet retirement
├── Mar 1: AWS Bedrock v1 extended access ends
├── May 11: Claude 3.7 Sonnet retirement
```

## Best Practices for Migration

1. **Audit usage now**: Identify all deprecated model usage
2. **Test migration targets**: Validate behavior with new models
3. **Update model strings**: Replace deprecated model IDs
4. **Update SDKs**: Ensure you have latest SDK versions
5. **Monitor performance**: Track any differences post-migration
6. **Plan ahead**: Don't wait until retirement date

## Additional Resources

- [Anthropic Deprecation Commitments](https://www.anthropic.com/research/deprecation-commitments)
- [API Console Usage](https://console.anthropic.com/settings/usage)
- [Migration to Claude 4.5 Guide](https://platform.claude.com/docs/en/migration)
