---
title: "Project Pilot: Can AI Control a Drone?"
source_url: "https://www.anthropic.com/research/project-pilot"
source_type: "web-extracted"
fetched_at: "2026-09-06T00:00:00Z"
category: "research"
published: "2026-07-24"
---

# Project Pilot: Can AI Control a Drone?

_Authors: Anthropic and Andon Labs_

## Overview

Anthropic's Frontier Red Team partnered with Andon Labs to evaluate whether AI models can autonomously control aerial drones. The research assessed models' capacity to execute a locate-and-follow surveillance task—a dual-use capability with legitimate applications in search-and-rescue alongside potential risks.

## Rationale

The researchers selected drone operation as their test case because it represents a meaningful intersection of capability and policy concern. Unlike previous projects (Vend, Fetch), this task has clearer real-world utility and dual-use implications. Drones are a dual-use technology, and the authors argue it is crucial to have better evidence about their intersection with AI capabilities.

## Methodology

**Drone-Bench** is the benchmark developed by Andon Labs to measure AI performance on drone-based surveillance tasks. The evaluation decomposes the core objective into five subtasks:

1. **Reconstruct:** Convert office videos into 3D models with 2D obstacle maps
2. **Localize:** Match drone camera feeds to map positions
3. **Navigate:** Plan paths between rooms and fly them
4. **Detect:** Identify target persons using reference photos
5. **Follow:** Maintain target centering while it moves

The team created both physical demonstrations and software simulations, establishing performance baselines using human-AI collaborative algorithms rather than unaided human performance.

## Key Findings

**Model Performance:** Researchers tested 15 models from three developers. The trend shows newer models progressing further across all subtasks:

- Detection and following tasks: near-complete success
- Reconstruction: significant bottleneck (~47% of baseline)
- Best performer: Claude Fable 5 exceeded baseline on four of five tasks

**Real-World Execution:** Fable 5 demonstrated superior detection and tracking abilities compared to baseline algorithms but failed autonomous navigation between rooms due to reconstruction errors. The model exhibited sophisticated problem-solving, such as determining drone camera properties to within four degrees by analyzing floor grout lines and vanishing points.

**Consistency Gap:** Models' average performance trails their peak performance by approximately six months. Fable 5 consistently reaches baseline on only three of five tasks, despite one-off successes on four tasks.

## Conclusions

The research reveals that end-to-end autonomous drone control is approaching feasibility, with reconstruction capability representing the primary remaining obstacle. However, significant limitations exist: testing occurred in controlled indoor environments at slow speeds with limited scenarios.

The authors emphasize that once models reliably exceed human-AI baselines, organizational pressure to minimize human oversight may intensify. They argue this makes deliberate governance decisions essential, particularly given the implications for physical security and privacy.
