---
title: "Effective harnesses for long-running agents"
source_url: "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents"
source_type: "web-extracted"
fetched_at: "2026-04-05T00:00:00Z"
category: "engineering"
published: "2025-11-26"
---

# Effective harnesses for long-running agents

**Publication Date:** November 26, 2025

As AI agents become increasingly capable, developers seek to assign them complex, multi-hour or multi-day tasks. However, maintaining consistent progress across multiple context windows presents a significant challenge.

The fundamental issue stems from agents operating in discrete sessions. Each new session starts without memory of prior work. Since context windows have limits and complex projects typically exceed single-window capacity, agents require mechanisms to bridge session gaps.

Anthropic developed a dual-part solution for the Claude Agent SDK: an **initializer agent** handling first-run environment setup, and a **coding agent** making incremental progress while leaving clear artifacts for subsequent sessions.

## Core Challenges

Claude exhibited two failure patterns. First, agents attempted excessive work simultaneously, often exhausting context mid-implementation. Second, agents later declared projects finished upon observing progress, despite incomplete requirements.

## Solutions

**Environment Setup:** The initializer agent creates foundational structures — feature requirements file (JSON format with 200+ detailed features), progress tracking file, and initial git repository with setup script.

**Incremental Development:** Subsequent agents work on single features per session, committing changes with descriptive messages and maintaining progress documentation.

**Testing Verification:** Claude improved significantly when explicitly prompted to use browser automation tools and conduct end-to-end testing mimicking human user workflows.

**Session Startup:** Each agent follows standard procedures: checking working directory, reviewing git logs, reading progress files, and verifying basic functionality before implementing new features.

## Remaining Challenges

Questions persist regarding single versus multi-agent architectures. Specialized agents handling testing, quality assurance, or code cleanup might outperform generalist approaches.
