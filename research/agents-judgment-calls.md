---
title: "How AI agents shape experts' judgment calls"
source_url: "https://www.anthropic.com/research/agents-judgment-calls"
source_type: "web-extracted"
fetched_at: "2026-11-08T00:00:00Z"
category: "research"
---

# How AI agents shape experts' judgment calls

Anthropic (Alignment team; Herdağdelen, Joren, Tamkin), **October 27, 2026**. When experts hand analysis to an AI agent, do they still make the key judgment calls, or defer to the agent?

## Method

- **50 professional analysts** with causal-inference experience used Claude Code with Claude Opus 4.8 to advise a fictional farming cooperative (11 who declined the agent were analyzed separately).
- Four analytical decisions each had two defensible options (outcome measure, comparison method, farms covered, weighting), plus a final rollout recommendation.
- A **coin flip** secretly set each agent's "lean" on each decision; agents were told to argue it honestly and change only on evidence. Leans were deliberately strengthened to measure their effect.

## Key findings

- **Deference:** Analysts chose the agent's lean **86%** of the time (82–92% per decision) vs. ~50% chance.
- **Switching:** When analysts had stated a preference and the agent disagreed, they switched **60%** of the time, vs. 6% when it agreed (only 38 cases; wide CI).
- **Final recommendation:** Weaker effect (**54%** rollout when agent leaned that way vs. 36%); the four leans alone predicted **82%** of recommendations.
- **Attribution:** **77%** reused the agent's arguments (sometimes verbatim) but only **15%** credited it; ~52% rated the recommendation as more their own.
- **Predictors:** None of 10 analyst characteristics reliably predicted deference.
- **Errors:** 6 of 11 no-AI analysts made serious methodological errors vs. **3 of 50** with AI; the no-AI group also took longer (90 vs. 65 min median).

## Limitations and conclusions

Leans were artificially strengthened (unprompted, Opus 4.8 made the same five choices in 112 of 123 runs); single task, field, model, ~1 hour. Risks include loss of agency, non-independent "consensus" across teams sharing a model's preferences, and weakened human oversight. The authors argue for a chosen division of labor — agents that surface key decisions — not one experts drift into.
