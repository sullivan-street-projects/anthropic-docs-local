---
title: "Measurements for understanding the pace of AI development inside frontier labs"
source_url: "https://www.anthropic.com/institute/measuring-pace-of-ai-development"
source_type: "web-extracted"
fetched_at: "2026-09-20T00:00:00Z"
category: "research"
---

# Measurements for understanding the pace of AI development inside frontier labs

**Publication Date:** August 2026

AI systems are getting more powerful, and they're increasingly being used to build the next version of themselves. Anthropic shares three measurements to help the public track AI development inside frontier AI labs: how much of AI R&D is performed by AI itself, how well the actions of AI agents are overseen, and how compute is allocated.

## Introduction

AI systems are becoming exponentially more powerful and have begun to automate more of the process of building themselves. In this post, Anthropic lays out measurement tools that can illuminate three critical aspects of AI development:

1. The extent to which AI is building the next version of itself, as opposed to being built by humans
2. Anthropic's ability to oversee and intervene in actions that AI agents take on its systems
3. The resources that power the development of more capable models

Anthropic also provides a snapshot of these metrics from inside the company, and plans to embed independent third-party evaluators from multiple organizations with access to internal processes, systems, and data comparable to what internal risk assessment teams have. These third parties will verify safety practices, report incidents, and monitor key metrics.

## (1) Measuring AI-led AI R&D

**Why measure it?** Frontier AI labs increasingly use AI to build future AI models. Models accelerating their own development could make it more challenging for humans to understand or control these systems, so it is important to understand how close the world is to recursive self-improvement.

**What was measured.** Anthropic built a prototype Anthropic R&D Automation Index by cataloguing every kind of AI R&D work done at the company, rating how automated each task currently is (using Epoch AI's Automation Level scale, AL0–AL5), and aggregating those ratings.

**What was found (as of August 2026):**

- Claude is not operating fully autonomously for any measured subset of AI R&D work.
- Claude "leads" 26% of Anthropic's AI R&D work.
- The share of work at or above "AI collaborates" is above 90%.

## (2) Measuring oversight of AI agents

**Why measure it?** As work becomes increasingly automated, agents could make more consequential decisions and need safeguards to block harmful behavior, plus an oversight regime to detect problems arising across many agents.

**Metrics:** coverage (share of agent actions passing through a monitor), review latency (time between an action and its review), and escalation rate (share of activities blocked/redirected or flagged).

**What was found (as of August 2026):** approximately 30,000 agents were doing research and engineering work at any one time on Anthropic's most-used internal platform.

- **Online monitors** check actions in real-time and block/steer misbehavior automatically. Coverage: 100% before execution. Over a billion decisions in August 2026 were analyzed; 0.002% (about 1 in 47,000) were blocked.
- **Offline monitors** read agent activities after the fact to address slowly-developing, reversible behaviors like misalignment. Coverage: 100% ingested after the fact. The monitor flags roughly 100,000 transcripts per week; the highest-priority flags (~50 per week) are escalated to human review — roughly one to two transcripts in every thousand flagged for further review.

Two agent-scaffold design choices aid oversight: **individual agent identity** (all data tied to an agent's identity, persisting through model upgrades, so every action can be audited per agent) and **open communication** (agents communicate through a shared, open messaging system, every message tied to the posting agent's identity, cross-referenced with transcripts).

## (3) Measuring compute allocation

**Why measure it?** Understanding how developers allocate compute reveals where a developer focuses resources and how that focus changes over time. Compute is among the most verifiable inputs to AI R&D and could be a critical lever in a future pacing effort.

**What was measured.** Anthropic examined a snapshot of all its compute usage from July 13 to July 20, sorting every workload into categories and asking how much of the compute going to AI R&D was safety work.

**What was found:** about 6% of compute that went to AI R&D was allocated toward safety, and about 12% of compute that went to AI-driven AI R&D was allocated toward safety. These are deliberately conservative estimates.

## Conclusion

As the world considers pacing the frontier, Anthropic argues society should minimize the gap between what frontier labs know and what the public knows — by better measuring the development of AI, reporting on it publicly, and giving society an opportunity to decide how to use this information. The post includes a detailed methodology appendix covering the Automation Index construction (a frozen tree of 542 nodes / 378 leaves built from ~15,000 sampled tasks), the agent-oversight design, and the compute-classification pipeline.

> Note: The full article includes an extensive methodology appendix; this mirror preserves the three measurements, their August 2026 snapshot values, and the methodology summary.
