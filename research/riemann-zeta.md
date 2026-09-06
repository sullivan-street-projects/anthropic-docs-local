---
title: "Learning more about Claude's mathematical capabilities"
source_url: "https://www.anthropic.com/research/riemann-zeta"
source_type: "web-extracted"
fetched_at: "2026-09-06T00:00:00Z"
category: "research"
published: "2026-08-10"
---

# Learning more about Claude's mathematical capabilities

## Overview

Anthropic researchers describe how Claude made progress on a longstanding mathematical problem related to the Riemann hypothesis—one of mathematics' most famous unsolved conjectures, which carries a $1 million bounty. The work represents progress on a related problem rather than a solution to the hypothesis itself.

## Key Finding

An unreleased research version of Claude improved a lower bound for the proportion of zeros of the Riemann zeta function that satisfy the Riemann hypothesis, increasing it from 41.6% to 67.2%.

## The Riemann Zeta Function

The Riemann zeta function connects to the distribution of prime numbers. The Riemann hypothesis, unproven since 1859, posits that certain zeros of the function all lie along a specific vertical line ("the critical line"). Over the decades mathematicians have gradually increased the known lower bounds for the proportion of zeros on this line.

## Claude's Approach

Claude drew upon recent research by mathematicians including Aryan, Baluyot, Goldston, Suriajaya, and Turnage-Butterbaugh, combined with Bombieri's 2000 work. The key step involved combining the results from Aryan and from Baluyot, Goldston, Suriajaya, and Turnage-Butterbaugh with Bombieri's methodology to push the bound higher.

## Methodology

Working across two sessions in Claude Code, Claude consumed 31 million output tokens and:

- Generated and tested 650 initial ideas
- Coordinated approximately 60 subagents
- Executed 2,400 shell commands
- Ran thousands of numerical checks against known zeta zeros

Claude independently validated its findings, searched for counterexamples, and produced a formally verifiable Lean proof. Two Anthropic mathematicians verified the results.

## Significance

The achievement demonstrates the expanding mathematical capabilities of AI models. However, researchers emphasize that these techniques are unlikely on their own to resolve the Riemann hypothesis itself; the result is meaningful progress on a related bound rather than a proof of the central conjecture.
