---
title: "Claude Fable 5 and Claude Mythos 5"
source_url: "https://www.anthropic.com/news/claude-fable-5-mythos-5"
source_type: "web-extracted"
fetched_at: "2026-07-27T00:00:00Z"
category: "models"
---

# Claude Fable 5 and Claude Mythos 5

**Date:** June 9, 2026

## Overview

Anthropic launched two new Mythos-class models: Claude Fable 5 (general availability) and Claude Mythos 5 (restricted access). Fable 5 represents "state-of-the-art on nearly all tested benchmarks," excelling in software engineering, knowledge work, vision, and scientific research.

## Key Capabilities

### Software Engineering

Stripe reported Fable 5 "compressed months of engineering into days," completing a 50-million-line Ruby migration in one day versus two months manually.

### Vision

The model achieved new benchmarks in extracting data from scientific figures and rebuilt web applications from screenshots alone.

### Life Sciences

Mythos 5 accelerated protein design tasks approximately tenfold and produced novel molecular biology hypotheses that researchers preferred ~80% of the time in blind comparisons.

### Long-Context Performance

Fable 5 maintains focus across millions of tokens and demonstrated threefold performance improvements when using persistent memory.

## Pricing & Availability

- **Cost:** $10 per million input tokens; $50 per million output tokens
- **Fable 5:** Available immediately on Claude API and consumption-based plans; rolling out conservatively on subscription plans (included through June 22)
- **Mythos 5:** Restricted to Project Glasswing cybersecurity partners and selected biology researchers

## Safety Architecture

Fable 5 includes three classifier-based safeguards:

1. **Cybersecurity:** Blocks offensive cyber tasks; fallback to Claude Opus 4.8
2. **Biology/Chemistry:** Prevents dual-use biological research misuse
3. **Distillation:** Prevents capability extraction attempts

External red-teaming (1,000+ hours) found no universal jailbreaks, though the UK AI Safety Institute made partial progress.

## Important Notice

An update on June 12, 2026 noted that "access to Claude Fable 5 and Claude Mythos 5" became unavailable due to a US government export control directive.
