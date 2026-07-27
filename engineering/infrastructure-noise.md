---
title: "Quantifying Infrastructure Noise in Agentic Coding Evals"
source_url: "https://www.anthropic.com/engineering/infrastructure-noise"
source_type: "web-extracted"
fetched_at: "2026-07-27T00:00:00Z"
category: "engineering"
---

# Quantifying Infrastructure Noise in Agentic Coding Evals

## Executive Summary

Anthropic researchers demonstrate that infrastructure configuration significantly impacts agentic coding benchmarks. Their findings show that "infrastructure configuration alone can produce differences that exceed [typical leaderboard margins]" on Terminal-Bench 2.0, with a documented 6 percentage point spread between resource-constrained and unconstrained setups.

## Key Findings

### Resource Configuration Impact

The research identified a critical distinction between two phases of resource allocation effects:

**Phase 1 (1x to 3x headroom):** Infrastructure reliability improvements with minimal score changes. Infra error rates decreased from 5.8% to 2.1%, yet success rates remained within statistical noise (p=0.40).

**Phase 2 (3x to uncapped):** Meaningful capability enhancement. Success rates jumped approximately 4 percentage points as agents could employ resource-intensive strategies unavailable under tight constraints.

### Measurement Methodology Matters

The research revealed that enforcement approaches produce different results. Container runtime parameters include both a guaranteed allocation floor and a hard kill ceiling. When these parameters are identical, "a momentary memory fluctuation can OOM-kill a container that would otherwise have succeeded."

### Cross-Benchmark Validation

Testing on SWE-bench confirmed the pattern applies beyond Terminal-Bench, though with smaller magnitude. RAM variation up to 5x produced only 1.54 percentage point differences, reflecting SWE-bench's lower resource demands.

## Practical Implications

### For Leaderboard Interpretation

Small score differences carry substantial uncertainty. The researchers recommend skepticism toward "leaderboard differences below 3 percentage points" without documented configuration matching, as infrastructure confounders can mask or exaggerate capability gaps.

### For Benchmark Maintainers

Key recommendations include:

- Specify both guaranteed allocation and hard ceiling per task
- Calibrate the gap between floor and ceiling through empirical testing
- Report enforcement methodology alongside results
- Run evaluations across multiple times and days to average temporal noise

### Hidden Variables

Beyond resource allocation, other factors influence scores, including time-of-day variations (likely from API latency fluctuations) and cluster health. These infrastructure quirks blur "the boundary between model capability and infrastructure behavior."

## Technical Insight: Resource Parameter Separation

The research demonstrates why separating floor and ceiling parameters matters. A 3x ceiling over per-task specifications reduced infrastructure errors significantly while maintaining score stability, providing "a reasonable tradeoff" between infrastructure stability and meaningful resource constraints.

## Broader Context

This work addresses a critical gap in AI evaluation practice: as benchmark scores increasingly drive deployment decisions, corresponding rigor in methodology hasn't always followed. The findings suggest "a few-point lead might signal a real capability gap—or it might just be a bigger VM."
