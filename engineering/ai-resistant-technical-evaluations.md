---
title: "Designing AI-resistant technical evaluations"
source_url: "https://www.anthropic.com/engineering/AI-resistant-technical-evaluations"
source_type: "web-extracted"
fetched_at: "2026-07-20T00:00:00Z"
category: "engineering"
published: "2026-01-21"
---

# Designing AI-resistant technical evaluations

**Publication Date:** January 21, 2026

Written by Tristan Hume, a lead on Anthropic's performance optimization team.

"Evaluating technical candidates becomes harder as AI capabilities improve." Each new Claude model generation required redesigning the test to maintain its effectiveness as a hiring signal.

## Original Take-Home Design (Version 1)

### Design Goals

The team prioritized creating an assessment that was:

- **Engaging**: Genuinely interesting to candidates rather than generic busywork
- **Realistic**: Reflected actual performance engineering work with longer time horizons (4 hours)
- **Comprehensive**: Provided multiple opportunities to demonstrate skills across different optimization domains
- **AI-compatible**: Explicitly allowed AI assistance to mirror real-world conditions

### Technical Structure

The assessment used a Python simulator for a TPU-like accelerator featuring:

- Manual scratchpad memory management
- VLIW (Very Long Instruction Word) parallel execution units
- SIMD (Single Instruction Multiple Data) vector operations
- Multicore distribution capabilities

The primary task involved optimizing parallel tree traversal code, inspired by real ML optimization challenges.

## Performance Milestones

| Model                              | Performance                   | Context             |
| ---------------------------------- | ----------------------------- | ------------------- |
| Claude Opus 4                      | Beat ~95% of human candidates | Within 4-hour limit |
| Claude Opus 4.5                    | Matched top human performance | 2-hour window       |
| Claude Opus 4.5 (improved harness) | 1363 cycles                   | Extended compute    |

## Version 2 Modifications

In response to Claude Opus 4's strong performance, Anthropic:

- Increased problem complexity and depth
- Shortened time limit from 4 to 2 hours
- Removed multicore optimization (already solved by AI)
- Emphasized clever insight over code volume
- Provided cleaner starter code

This version "served us well — for several months" before Claude Opus 4.5 surpassed it.

## Version 3: Radical Redesign

### Pivot Strategy

Recognizing that "realism may be a luxury we no longer have," the team shifted toward testing on deliberately out-of-distribution problems. The new assessment features:

- **Zachtronics-inspired puzzles**: Highly constrained instruction sets requiring unconventional programming approaches
- **Minimal tooling**: No visualization; candidates must decide whether to manually debug or request AI-generated tools
- **Instruction optimization**: Minimizing instruction count rather than cycle optimization
- **Independent sub-problems**: Reduced variance through modular structure

### Rationale

By creating problems sufficiently novel that Claude has less training data to leverage, humans with strong fundamental reasoning could outperform the model — even if the work felt less representative of actual job responsibilities.

## Key Insights

1. **Knowledge-heavy problems favor AI**: When Claude has substantial training data (like transposition algorithms and bank conflicts), it excels
2. **Novel problem structure matters**: Out-of-distribution challenges leverage human reasoning over pattern matching
3. **Time-vs-capability tradeoff**: Humans retain advantages at significantly longer time horizons, but tight deadlines favor AI
4. **Tooling decisions are signal**: Choices about when to build debugging infrastructure versus leveraging AI reveal candidate judgment

## Performance Benchmarks (clock cycles, lower is better)

- **2164:** Claude Opus 4 after many hours in test-time compute harness
- **1790:** Claude Opus 4.5 in casual Claude Code session
- **1579:** Claude Opus 4.5 after 2 hours in test-time compute harness
- **1487:** Claude Opus 4.5 after 11.5 hours in the harness
- **1363:** Claude Opus 4.5 in improved harness after many hours

Candidates optimizing below 1487 cycles are encouraged to email performance-recruiting@anthropic.com.

## Broader Implications

As AI capabilities approach or exceed human performance on time-constrained technical tasks, organizations must either move toward longer evaluations, redesign assessments entirely, or accept that humans and AI will increasingly collaborate in ways that make individual contribution difficult to isolate.
