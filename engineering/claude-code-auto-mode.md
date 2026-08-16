---
title: "How we built Claude Code auto mode: a safer way to skip permissions"
source_url: "https://www.anthropic.com/engineering/claude-code-auto-mode"
source_type: "web-extracted"
fetched_at: "2026-08-16T00:00:00Z"
category: "engineering"
published: "2026-03-25"
---

# How we built Claude Code auto mode: a safer way to skip permissions

**Publication Date:** March 25, 2026

## Introduction

Users approve roughly 93% of permission prompts in Claude Code. Auto mode builds classifiers to automate some approval decisions, balancing safety against "approval fatigue" while stopping short of unrestricted operation.

## How It Works

The system uses two defensive layers:

- **Input layer:** A server-side prompt-injection probe scans tool outputs.
- **Output layer:** A transcript classifier (Sonnet 4.6) evaluates actions before execution using a two-stage process.

## Threat Model

Four categories of dangerous actions:

1. **Overeager behavior** — taking initiative beyond user intent.
2. **Honest mistakes** — misunderstanding scope or ownership.
3. **Prompt injection attacks.**
4. **Misaligned model behavior.**

Examples blocked include scope escalation, credential exploration, agent-inferred parameters, external service sharing, and safety-check bypasses.

## Permission Decision Tiers

- **Tier 1:** Built-in safe-tool allowlist.
- **Tier 2:** In-project file operations.
- **Tier 3:** Transcript classifier for high-risk actions.

## Results

- On real internal traffic (10,000 actions): 0.4% false positive rate after the full pipeline.
- On real overeager actions (52 cases): 17% false negative rate — the classifier misses roughly one in six dangerous commands.

## Design Decisions

- Strips assistant text and tool results to prevent the classifier itself from being manipulated.
- Two-stage classification optimizes efficiency versus accuracy.
- The prompt-injection probe provides layered defense.
- Multi-agent handoffs are monitored at both delegation and return.
- Deny-and-continue recovery allows retries rather than halting the session.

## Key Takeaway

Auto mode is a middle ground between manual approval and unrestricted operation. It is explicitly acknowledged as unsuitable for high-stakes infrastructure.
