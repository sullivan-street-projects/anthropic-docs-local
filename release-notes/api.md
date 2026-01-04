---
title: "API Release Notes"
source_url: "https://docs.anthropic.com/en/release-notes"
source_type: "web-extracted"
fetched_at: "2026-01-04T05:50:00Z"
category: "release-notes"
note: "Redirects to platform.claude.com/docs/en/release-notes"
---

# API Release Notes

This document tracks API-specific changes. For the complete platform release notes, see [platform.md](platform.md).

## Key API Changes (2025)

### Model Releases
| Date | Model | Notes |
|------|-------|-------|
| Nov 24, 2025 | Claude Opus 4.5 | Most intelligent model |
| Oct 15, 2025 | Claude Haiku 4.5 | Fastest Haiku |
| Sep 29, 2025 | Claude Sonnet 4.5 | Best for agents/coding |
| Aug 5, 2025 | Claude Opus 4.1 | Incremental update |
| May 22, 2025 | Claude Opus 4, Sonnet 4 | Extended thinking |
| Feb 24, 2025 | Claude Sonnet 3.7 | Extended thinking |

### API Features
| Date | Feature | Status |
|------|---------|--------|
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
| Dec 19, 2025 | Claude Haiku 3.5 | TBD |
| Oct 28, 2025 | Claude Sonnet 3.7 | TBD |
| Oct 28, 2025 | Claude Sonnet 3.5 | Oct 28, 2025 |
| Aug 13, 2025 | Claude Sonnet 3.5 | Oct 28, 2025 |
| Jul 21, 2025 | Claude 2.0/2.1, Sonnet 3 | Jul 21, 2025 |
| Jun 30, 2025 | Claude Opus 3 | TBD |
| Jan 21, 2025 | Claude 2/2.1, Sonnet 3 | Jul 21, 2025 |
| Nov 6, 2024 | Claude 1, Instant | Nov 6, 2024 |

### Breaking Changes
| Date | Change |
|------|--------|
| May 1, 2025 | Cache control must be in parent content block |
| Nov 20, 2024 | Rate limits changed to input/output tokens per minute |
| Oct 8, 2024 | Build and Scale plans deprecated |

## Rate Limit Updates
- Jul 24, 2025: Increased limits for Claude Opus 4
- Jul 17, 2025: Increased limits for Claude Sonnet 4
- Aug 26, 2025: Increased limits on 1M context window
