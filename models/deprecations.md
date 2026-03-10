---
title: "Model Deprecations"
source_url: "https://platform.claude.com/docs/en/about-claude/model-deprecations"
source_type: "web-extracted"
fetched_at: "2026-03-10T00:00:00Z"
category: "models"
---

# Model Deprecations

As Anthropic launches safer and more capable models, older models are regularly retired. This page lists all API deprecations and recommended replacements.

## Model Lifecycle

- **Active**: Fully supported and recommended for use
- **Legacy**: No longer receiving updates; may be deprecated in the future
- **Deprecated**: No longer available for new customers; available for existing users until retirement
- **Retired**: No longer available; requests will fail

Anthropic provides at least 60 days notice before model retirement for publicly released models.

## Migrating to Replacements

Once a model is deprecated, migrate all usage to a suitable replacement before the retirement date. Requests to models past the retirement date will fail. Consider thorough testing of your applications with the new models well before the retirement date.

For specific migration instructions, see the [Migration guide](https://platform.claude.com/docs/en/about-claude/models/migration-guide).

## Auditing Model Usage

To identify usage of deprecated models:
1. Go to the [Usage](https://platform.claude.com/settings/usage) page in Console
2. Click the "Export" button
3. Review the downloaded CSV to see usage broken down by API key and model

## Model Status

| API Model Name | Current State | Deprecated | Tentative Retirement Date |
|:---|:---|:---|:---|
| `claude-opus-4-6` | Active | N/A | Not sooner than February 5, 2027 |
| `claude-sonnet-4-6` | Active | N/A | Not sooner than February 17, 2027 |
| `claude-opus-4-5-20251101` | Active | N/A | Not sooner than November 24, 2026 |
| `claude-opus-4-1-20250805` | Active | N/A | Not sooner than August 5, 2026 |
| `claude-opus-4-20250514` | Active | N/A | Not sooner than May 14, 2026 |
| `claude-sonnet-4-5-20250929` | Active | N/A | Not sooner than September 29, 2026 |
| `claude-sonnet-4-20250514` | Active | N/A | Not sooner than May 14, 2026 |
| `claude-haiku-4-5-20251001` | Active | N/A | Not sooner than October 15, 2026 |
| `claude-3-haiku-20240307` | Deprecated | February 19, 2026 | April 20, 2026 |
| `claude-3-7-sonnet-20250219` | Retired | October 28, 2025 | February 19, 2026 |
| `claude-3-5-haiku-20241022` | Retired | December 19, 2025 | February 19, 2026 |

## Deprecation History

### 2026-02-19: Claude Haiku 3

| Retirement Date | Deprecated Model | Recommended Replacement |
|:---|:---|:---|
| April 20, 2026 | `claude-3-haiku-20240307` | `claude-haiku-4-5-20251001` |

### 2025-12-19: Claude Haiku 3.5 (Retired February 19, 2026)

| Retirement Date | Deprecated Model | Recommended Replacement |
|:---|:---|:---|
| February 19, 2026 | `claude-3-5-haiku-20241022` | `claude-haiku-4-5-20251001` |

### 2025-10-28: Claude Sonnet 3.7 (Retired February 19, 2026)

| Retirement Date | Deprecated Model | Recommended Replacement |
|:---|:---|:---|
| February 19, 2026 | `claude-3-7-sonnet-20250219` | `claude-opus-4-6` |

### 2025-08-13: Claude Sonnet 3.5 (Retired October 28, 2025)

| Retirement Date | Deprecated Model | Recommended Replacement |
|:---|:---|:---|
| October 28, 2025 | `claude-3-5-sonnet-20240620` | `claude-opus-4-6` |
| October 28, 2025 | `claude-3-5-sonnet-20241022` | `claude-opus-4-6` |

### 2025-06-30: Claude Opus 3 (Retired January 5, 2026)

| Retirement Date | Deprecated Model | Recommended Replacement |
|:---|:---|:---|
| January 5, 2026 | `claude-3-opus-20240229` | `claude-opus-4-6` |

### 2025-01-21: Claude 2, 2.1, Sonnet 3 (Retired July 21, 2025)

| Retirement Date | Deprecated Model | Recommended Replacement |
|:---|:---|:---|
| July 21, 2025 | `claude-2.0` | `claude-opus-4-6` |
| July 21, 2025 | `claude-2.1` | `claude-opus-4-6` |
| July 21, 2025 | `claude-3-sonnet-20240229` | `claude-opus-4-6` |

### 2024-09-04: Claude 1 and Instant (Retired November 6, 2024)

| Retirement Date | Deprecated Model | Recommended Replacement |
|:---|:---|:---|
| November 6, 2024 | `claude-1.0` through `claude-1.3` | `claude-haiku-4-5-20251001` |
| November 6, 2024 | `claude-instant-1.0` through `claude-instant-1.2` | `claude-haiku-4-5-20251001` |

## Best Practices

1. Regularly check documentation for deprecation updates
2. Test applications with newer models well before retirement dates
3. Update code to use recommended replacement as soon as possible
4. Audit usage via Console Usage page (Export -> CSV)
5. Contact support for migration assistance

## Deprecation Downsides and Mitigations

Anthropic currently deprecates and retires models to ensure capacity for new model releases. This comes with downsides:
- Users who value specific models must migrate to new versions
- Researchers lose access to models for ongoing and comparative studies
- Model retirement introduces safety- and model welfare-related risks

At some point, Anthropic hopes to make past models publicly available again. In the meantime, Anthropic has committed to long-term preservation of model weights and other measures to help mitigate these impacts. For more details, see [Commitments on Model Deprecation and Preservation](https://www.anthropic.com/research/deprecation-commitments).

## Migrating

For specific migration instructions, see the [Migration guide](https://platform.claude.com/docs/en/about-claude/models/migration-guide).
