---
title: "Claude Sonnet 5.5"
source_url: "https://www.anthropic.com/claude-sonnet-5-5"
source_type: "web-extracted"
fetched_at: "2026-10-11T00:00:00Z"
category: "models"
---

# Claude Sonnet 5.5

Launched **September 28, 2026** (`claude-sonnet-5-5`), the second model in the Claude 5.5 family — an upgrade over Sonnet 5 and a faster, lower-cost complement to Opus 5.5.

## Pricing (per 1M tokens)

- Input: $2 · Output: $10 · Cache reads: $0.20 (cut to $0.10 on Oct 7) · Cache writes: $2.50
- Priced the same as Sonnet 5 but typically uses fewer tokens per task — up to 30% less per task in Anthropic's testing.

## Benchmarks (Sonnet 5.5 / Sonnet 5 / Opus 5.5)

- Terminal-Bench 4.0: 70.6% / 10.3% / 66.4%
- FrontierCode 1.1 (Main): 46.2% (Max) / 42.4% / 54.4%
- CursorBench 4.0: 55.5% / 34.1% / 57.8%
- GDPval-AA v2.1: 1844 / 1449 / 1846
- AA-Briefcase v1.1: 1811 / 1359 / 1822
- Humanity's Last Exam (with tools): 64.5% / 54.9% / 67.7%
- OSWorld 2.1 (partial): 80.1% / 57.0% / 81.8%
- Chartography (no tools): 61.6% / 15.6% / 64.4%
- First Sonnet to beat *Pokémon Red* using only screenshots.

## Key capabilities

- Outputs 30%+ faster than Sonnet 5; stronger codebase comprehension and fewer tool-use steps; near Opus 5.5 on GDPval-AA knowledge work.
- Effort levels (Low, Medium, High, Xhigh, Max): Medium is the default in Claude Code and the apps; High is the default on the Claude Platform.

## API and safety

- Available on the Claude Platform, AWS, Google Cloud, and Microsoft Azure; supports zero data retention.
- To turn off up-front thinking, use `thinking: {"type": "between_tools"}` at `high` effort or below (not `"disabled"`); `tool_choice` `any`/`tool` return 400; `computer_20251124` not accepted on the Claude API or Google Cloud.
- First Sonnet with cyber safeguards and fallbacks (higher-risk cyber tasks fall back to Sonnet 5); biology safeguards same as Sonnet 5; preserved thinking tied to the originating account.
