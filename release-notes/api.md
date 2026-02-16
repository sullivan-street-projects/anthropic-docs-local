---
title: "API Release Notes"
source_url: "https://platform.claude.com/docs/en/release-notes/overview"
source_type: "web-extracted"
fetched_at: "2026-02-16T00:00:00Z"
category: "release-notes"
note: "Redirects to platform.claude.com/docs/en/release-notes - see platform.md for full timeline"
---

# API Release Notes

This document tracks key API-specific changes in summary form. For the complete chronological platform release notes, see [platform.md](platform.md).

## Key API Changes (2025-2026)

### Model Releases
| Date | Model | Notes |
|------|-------|-------|
| Feb 5, 2026 | Claude Opus 4.6 | Most intelligent model; adaptive thinking, fast mode, compaction API |
| Nov 24, 2025 | Claude Opus 4.5 | Premium model combining intelligence + performance |
| Oct 15, 2025 | Claude Haiku 4.5 | Fastest Haiku model |
| Sep 29, 2025 | Claude Sonnet 4.5 | Best for agents/coding |
| Aug 5, 2025 | Claude Opus 4.1 | Incremental update |
| May 22, 2025 | Claude Opus 4, Sonnet 4 | Extended thinking, Files API, Code Execution |
| Feb 24, 2025 | Claude Sonnet 3.7 | Extended thinking |

### API Features
| Date | Feature | Status |
|------|---------|--------|
| Feb 7, 2026 | Fast mode (Opus 4.6) | Research preview |
| Feb 5, 2026 | Compaction API | Beta |
| Feb 5, 2026 | Data residency controls | GA |
| Feb 5, 2026 | 1M context (Opus 4.6) | Beta |
| Feb 5, 2026 | Effort parameter | GA (no beta header) |
| Feb 5, 2026 | Fine-grained tool streaming | GA (no beta header) |
| Jan 29, 2026 | Structured outputs | GA |
| Nov 24, 2025 | Programmatic tool calling | Public beta |
| Nov 14, 2025 | Structured outputs | Public beta |
| Oct 16, 2025 | Agent Skills | Beta |
| Sep 29, 2025 | Memory tool | Beta |
| Sep 29, 2025 | Context editing | Beta |
| Sep 10, 2025 | Web fetch tool | Beta |
| Sep 2, 2025 | Code Execution v2 | Public beta |
| Aug 8, 2025 | Search results | GA |
| May 22, 2025 | Files API | Public beta |
| May 22, 2025 | MCP connector | Public beta |
| May 7, 2025 | Web search tool | GA |
| Jan 23, 2025 | Citations | GA |

### SDK Releases
| Date | SDK | Status |
|------|-----|--------|
| Sep 8, 2025 | C# SDK | Beta |
| Aug 27, 2025 | PHP SDK | Beta |
| May 22, 2025 | Go SDK | GA |
| May 21, 2025 | Ruby SDK | GA |
| Mar 31, 2025 | Java SDK | GA |

### Model Deprecations
| Announced | Model | Retired |
|-----------|-------|---------|
| Dec 19, 2025 | Claude Haiku 3.5 | Feb 19, 2026 |
| Oct 28, 2025 | Claude Sonnet 3.7 | Feb 19, 2026 |
| Oct 28, 2025 | Claude Sonnet 3.5 | Oct 28, 2025 |
| Jun 30, 2025 | Claude Opus 3 | Jan 5, 2026 |
| Jan 21, 2025 | Claude 2/2.1, Sonnet 3 | Jul 21, 2025 |
| Nov 6, 2024 | Claude 1, Instant | Nov 6, 2024 |

### Breaking Changes
| Date | Change |
|------|--------|
| Jan 29, 2026 | `output_format` moved to `output_config.format` |
| Jan 12, 2026 | console.anthropic.com redirects to platform.claude.com |
| Jan 5, 2026 | Claude Opus 3 retired |
| May 1, 2025 | Cache control must be in parent content block |

### Rate Limit Updates
- Aug 26, 2025: Increased limits on 1M context window
- Jul 24, 2025: Increased limits for Claude Opus 4
- Jul 17, 2025: Increased limits for Claude Sonnet 4
