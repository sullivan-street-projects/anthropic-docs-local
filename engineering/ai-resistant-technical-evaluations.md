---
title: "Designing AI-resistant technical evaluations"
source_url: "https://www.anthropic.com/engineering/AI-resistant-technical-evaluations"
source_type: "web-extracted"
fetched_at: "2026-03-10T00:00:00Z"
category: "engineering"
published: "2026-01-21"
---

# Designing AI-resistant technical evaluations

**Publication Date:** January 21, 2026

Written by Tristan Hume, a lead on Anthropic's performance optimization team.

Evaluating technical candidates becomes harder as AI capabilities improve. A take-home that distinguishes well between human skill levels today may be trivially solved by models tomorrow.

Since early 2024, Anthropic's performance engineering team has used a take-home test where candidates optimize code for a simulated accelerator. Over 1,000 candidates have completed it. However, each new Claude model has forced redesign. Claude Opus 4 outperformed most human applicants within the 4-hour limit. Claude Opus 4.5 subsequently matched even the strongest candidates.

## The Simulated Machine

Hume built a Python simulator for a fake accelerator resembling TPUs. Candidates optimize code using hot-reloading Perfetto traces. The machine includes manually managed scratchpad memory, VLIW, SIMD, and multicore.

## Version 1 Defeated: Claude Opus 4

By May 2025, Claude 3.7 Sonnet had progressed to where over 50% of candidates would have been better off delegating to Claude Code entirely. A pre-release Claude Opus 4 produced more optimized solutions than almost all humans within 4 hours.

## Version 2 Defeated: Claude Opus 4.5

Testing a pre-release Opus 4.5 revealed it met the passing threshold in under an hour and matched the best human performance at the 2-hour mark.

## Going Weirder

Hume needed a problem where human reasoning could win over Claude's larger experience base. He landed on Zachtronics-style programming puzzles using a tiny, heavily constrained instruction set. Claude Opus 4.5 failed these puzzles.

## Performance Benchmarks (clock cycles, lower is better)

- **2164:** Claude Opus 4 after many hours in test-time compute harness
- **1790:** Claude Opus 4.5 in casual Claude Code session
- **1579:** Claude Opus 4.5 after 2 hours in test-time compute harness
- **1487:** Claude Opus 4.5 after 11.5 hours in the harness
- **1363:** Claude Opus 4.5 in improved harness after many hours

Candidates optimizing below 1487 cycles are encouraged to email performance-recruiting@anthropic.com.
