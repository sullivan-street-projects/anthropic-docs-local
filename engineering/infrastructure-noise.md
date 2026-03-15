---
title: "Quantifying Infrastructure Noise in Agentic Coding Evals"
source_url: "https://www.anthropic.com/engineering/infrastructure-noise"
source_type: "web-extracted"
fetched_at: "2026-03-15T00:00:00Z"
category: "engineering"
---

# Quantifying Infrastructure Noise in Agentic Coding Evals

## Overview

Infrastructure configuration significantly impacts agentic coding benchmark results. Research shows that resource allocation differences can swing scores by several percentage points -- sometimes exceeding the gaps between top-ranked models on leaderboards.

## Key Findings

### The Infrastructure Impact

"Infrastructure configuration alone can produce differences that exceed those margins" on Terminal-Bench 2.0, with gaps reaching 6 percentage points between most- and least-resourced setups. This challenges the assumption that small benchmark score differences reflect pure model capability differences.

### Why This Matters

Agentic coding evaluations differ fundamentally from static benchmarks. Models operate in full runtime environments where they write code, run tests, install dependencies, and iterate. This makes infrastructure a problem-solving component rather than a passive container.

### Resource Configuration Effects

Researchers tested six resource configurations on Terminal-Bench 2.0, ranging from strict enforcement to uncapped resources. Key observations:

- **Infrastructure reliability**: Error rates dropped from 5.8% under strict enforcement to 0.5% when uncapped
- **Score changes**: Between 3x-uncapped configurations, success jumped nearly 4 percentage points while infrastructure errors declined only 1.6 percentage points
- **Total improvement**: Uncapped versus strict enforcement showed +6 percentage point gains overall

### What Resources Actually Enable

Additional headroom allows agents to attempt resource-intensive approaches -- installing large dependency packages, spawning expensive processes, running memory-intensive test suites -- that would fail under tight constraints.

## Measurement Implications

Up to 3x resource multipliers primarily fix reliability issues. Beyond that threshold, additional resources actively help solve previously unsolvable problems, meaning resource constraints reshape what gets measured rather than just stabilizing measurements.

## Recommendations

For benchmark maintainers and evaluators:

- Specify both guaranteed allocation and hard kill thresholds separately, not single pinned values
- Calibrate resource bands so floor and ceiling scores fall within acceptable noise margins
- Report enforcement methodology alongside results
- Run evaluations across multiple times and days to average out temporal noise

## Why Organizations Should Care

"Without published (or standardized) setup configurations, it's hard to tell from the outside unless interested parties go the extra mile to reproduce objective results under identical conditions."

Small leaderboard advantages may reflect hardware differences rather than genuine capability gaps. Until standardization occurs, differences below 3 percentage points warrant skepticism without documented matching configurations.
