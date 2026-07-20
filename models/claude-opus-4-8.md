---
title: "Claude Opus 4.8"
source_url: "https://www.anthropic.com/news/claude-opus-4-8"
source_type: "web-extracted"
fetched_at: "2026-07-20T00:00:00Z"
category: "models"
---

# Claude Opus 4.8

**Release Date:** May 28, 2026

Anthropic has released Claude Opus 4.8, an upgraded version building on Opus 4.7 with improvements across multiple benchmarks and enhanced collaboration capabilities. The model is available at the same price as its predecessor.

## Key Improvements

### Coding and Agentic Skills

Opus 4.8 demonstrates notable improvements in coding performance, agentic skills, reasoning abilities, and practical knowledge work tasks. The model shows measurable gains compared to Opus 4.7 and other competing models on standardized evaluations.

### Honesty and Reliability

A significant advancement is the model's improved honesty. Opus 4.8 is "around four times less likely than its predecessor to allow flaws in code it has written to pass unremarked." It demonstrates noticeably better judgment in agentic tasks, catching mistakes proactively.

### Alignment Assessment

The Alignment team found that Opus 4.8 "reaches new highs on our measures of prosocial traits like supporting user autonomy and acting in the user's best interest." The model shows substantially lower rates of misaligned behavior compared to Opus 4.7.

## New Features

### Dynamic Workflows

This research preview feature (in Claude Code) allows Claude to tackle larger projects by planning work and running hundreds of parallel subagents. Example: performing codebase migrations across hundreds of thousands of lines of code.

### Effort Control

Users can now choose how much computational effort Claude applies to responses:
- **Higher effort:** More frequent, deeper thinking for better results
- **Lower effort:** Faster responses with slower rate limit consumption

Available on claude.ai and Cowork across all plans.

### Messages API Enhancement

The Messages API now accepts system entries within the messages array, allowing mid-task instruction updates without disrupting prompt caching.

## Pricing & Availability

### Standard Mode

- Input: $5 per million tokens
- Output: $25 per million tokens

### Fast Mode

- Input: $10 per million tokens
- Output: $50 per million tokens (3x cheaper than previous models)

Available immediately via the API (`claude-opus-4-8`) and claude.ai.

## Performance Highlights

Early testers reported:
- Only model to complete every case end-to-end on Super-Agent Benchmark at cost parity
- Exceeds prior Opus models across every effort level on CursorBench with more efficient tool calling
- Highest score recorded on Legal Agent Benchmark with breakthrough accuracy metrics
- 84% on Online-Mind2Web browser automation tasks (substantial improvement over predecessors)
- Consistently higher quality analysis with better signal-to-noise ratio and proactive issue flagging
- Meaningful improvements in consistency and reasoning quality for legal workflows
- Same strong quality as Opus 4.7 with noticeably better citation precision for financial documents

## Early Customer Feedback

- Staff Engineer (partner): Claude Opus 4.8 demonstrates "noticeably better judgment" in agentic tasks
- Creative work: "faster, easier to collaborate with" with better context maintenance across long sessions
- Engineering workflows: Uses "tools cleanly and follows instructions with the consistency" required for autonomous systems
- Enterprise AI: Enables "a step change in agentic reasoning" with multimodal capabilities at improved efficiency

## Future Developments

Anthropic is developing:
- Lower-cost models with comparable Opus capabilities
- Claude Mythos Preview -- a higher-intelligence model class in limited deployment for cybersecurity work
- Planned general release of Mythos-class models, pending cyber safeguards
