---
title: "Harness design for long-running application development"
source_url: "https://www.anthropic.com/engineering/harness-design-long-running-apps"
source_type: "web-extracted"
fetched_at: "2026-08-16T00:00:00Z"
category: "engineering"
published: "2026-03-24"
author: "Prithvi Rajasekaran, Anthropic Labs"
---

# Harness design for long-running application development

**Publication Date:** March 24, 2026
**Author:** Prithvi Rajasekaran, Anthropic Labs

## Why Naive Implementations Fall Short

Two persistent failure modes appear in long-running agentic coding:

1. **Context window degradation.** Models lose coherence as context fills, and some exhibit "context anxiety," prematurely wrapping up work. Context resets — clearing the window and using structured handoffs — proved more effective than compaction alone.

2. **Self-evaluation bias.** "Agents tend to respond by confidently praising the work — even when, to a human observer, the quality is obviously mediocre." Separating evaluation from generation significantly improves judgment quality.

## Frontend Design: Making Subjective Quality Gradable

The author built a generator-evaluator loop inspired by GANs for frontend design, with four grading criteria:

- **Design quality:** coherent visual identity.
- **Originality:** evidence of custom decisions, avoiding "AI slop."
- **Craft:** typography, spacing, color harmony.
- **Functionality:** usability and task completion.

The evaluator used Playwright to interact with live pages before scoring, running 5–15 iterations per generation. Notably: "By the tenth cycle, it scrapped the approach entirely and reimagined the site as a spatial experience."

## Scaling to Full-Stack Coding

A three-agent architecture emerged:

- **Planner:** expands simple prompts into detailed product specs with ambitious scope and AI feature integration.
- **Generator:** works in sprints using React, Vite, FastAPI, and SQLite/PostgreSQL. Implements features one at a time with self-evaluation.
- **Evaluator:** uses Playwright to test running applications like real users would, grading against concrete criteria.

**Key innovation:** sprint contracts negotiated between generator and evaluator before implementation, bridging the gap between user stories and testable deliverables.

## Performance Comparison: Solo vs. Full Harness

For a retro game maker prompt:

| Approach     | Duration | Cost |
| ------------ | -------- | ---- |
| Solo agent   | 20 min   | $9   |
| Full harness | 6 hours  | $200 |

The solo version produced a non-functional game (entities did not respond to input). The harness version created a fully playable application with rich editors and integrated AI features.

## Iterating on the Harness

With the Claude Opus 4.6 release, the architecture was simplified:

- **Removed:** the sprint construct (the model now handles longer coherent tasks).
- **Maintained:** planner and evaluator (both continued adding measurable value).
- **Modified:** the evaluator moved to a single end-of-build pass rather than per-sprint.

Updated DAW (Digital Audio Workstation) results:

- Duration: ~3 hours 50 minutes
- Cost: $124.70
- Outcome: a functional music production program with autonomous agent integration.

The QA agent continued catching real gaps the generator missed, including incomplete feature implementations and missing interactive depth.

## Key Takeaways

1. **Harness complexity should match task difficulty.** Strip away non-essential components as models improve; the "interesting work" shifts rather than disappears.
2. **Separation of concerns drives quality.** Splitting generation from evaluation addresses both subjective aesthetic judgments and verifiable correctness.
3. **Structured handoffs enable long-horizon tasks.** Files and contracts pass context between agents to maintain coherence across multi-hour builds.
4. **Model capabilities are load-bearing assumptions.** Regular stress-testing reveals which harness pieces remain necessary as models evolve.
