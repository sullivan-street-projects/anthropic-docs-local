---
title: "An Update on Recent Claude Code Quality Reports"
source_url: "https://www.anthropic.com/engineering/april-23-postmortem"
source_type: "web-extracted"
fetched_at: "2026-09-06T00:00:00Z"
category: "engineering"
published: "2026-04-23"
---

# An Update on Recent Claude Code Quality Reports

## Overview

Anthropic investigated user reports of degraded Claude performance and traced issues to three separate changes affecting Claude Code, the Claude Agent SDK, and Claude Cowork. The API remained unaffected. All problems were resolved by April 20 (v2.1.116).

## Three Identified Issues

### 1. Reasoning Effort Default Change

On March 4, the team modified Claude Code's default reasoning setting from `high` to `medium` to address UI freezing caused by excessive thinking time in high mode. Internal testing showed medium effort delivered slightly lower capability with significantly reduced latency for most tasks. However, users reported feeling the product was less intelligent. After customer feedback, Anthropic reversed this decision on April 7, restoring higher defaults.

### 2. Caching Bug Causing Memory Loss

On March 26, a feature intended to clear old thinking from idle sessions (over one hour) contained a critical implementation flaw. Rather than executing once, the system repeatedly cleared reasoning history on every subsequent turn, causing Claude to appear forgetful and repetitive. This required over a week to diagnose because it only affected stale sessions and remained hidden by unrelated experiments and display changes. The bug was fixed April 10 in version 2.1.101.

### 3. Verbosity Reduction Prompt

On April 16, a system prompt instruction was added to reduce output: "Length limits: keep text between tool calls to ≤25 words. Keep final responses to ≤100 words unless the task requires more detail." After broader evaluation testing, this showed a 3% intelligence drop and was immediately reverted April 20.

## Response and Future Changes

Anthropic reset usage limits for all subscribers. Going forward, the company will:

- Expand internal staff usage of public builds
- Enhance Code Review tooling capabilities
- Implement stricter controls on system prompts with broader per-model evaluations
- Add soak periods and gradual rollouts for intelligence-affecting changes
