---
title: "A postmortem of three recent issues"
source_url: "https://www.anthropic.com/engineering/a-postmortem-of-three-recent-issues"
source_type: "web-extracted"
fetched_at: "2026-03-05T12:00:00Z"
category: "engineering"
published: "2025-09-17"
---

# A postmortem of three recent issues

**Publication Date:** September 17, 2025

Between August and early September, three infrastructure bugs intermittently degraded Claude's response quality. Anthropic resolved these issues and provided a comprehensive technical explanation.

"We never reduce model quality due to demand, time of day, or server load." The problems stemmed entirely from infrastructure bugs.

## The Three Bugs

**1. Context Window Routing Error (August 5)**
Short-context requests were misrouted to servers configured for the 1M token context window. Initially affecting 0.8% of Sonnet 4 requests, a load balancing change escalated the issue to 16% at peak. Fixed September 4-18.

**2. Output Corruption (August 25)**
A TPU server misconfiguration caused unexpected token generation. Users occasionally received unrelated characters (Thai, Chinese) or syntax errors. Resolved via rollback on September 2.

**3. Approximate Top-K XLA:TPU Miscompilation (August 25)**
A compiler bug triggered by token selection code improvements. The root cause involved precision mismatches — models compute probabilities in bf16 (16-bit), but TPU's vector processor uses fp32 (32-bit) natively. The `xla_allow_excess_precision` flag created disagreement about highest-probability tokens.

## Detection Challenges

Evaluations failed to capture the degradation users experienced. Privacy controls limiting engineer access to user interactions contributed to delayed detection. Multiple bugs producing different symptoms on different platforms created confusing, contradictory reports.

## Improvements

- Enhanced evaluations to better differentiate working versus broken implementations
- Running quality evaluations on actual production systems
- Developing infrastructure to debug user feedback while maintaining privacy
