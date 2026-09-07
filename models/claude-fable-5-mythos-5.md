---
title: "Claude Fable 5 and Claude Mythos 5"
source_url: "https://www.anthropic.com/news/claude-fable-5-mythos-5"
source_type: "web-extracted"
fetched_at: "2026-09-07T00:00:00Z"
category: "models"
---

# Claude Fable 5 and Claude Mythos 5

**Date:** June 9, 2026

## Overview

Anthropic launched two new Mythos-class models: Claude Fable 5 (general availability) and Claude Mythos 5 (restricted access). Fable 5 represents "state-of-the-art on nearly all tested benchmarks," excelling in software engineering, knowledge work, vision, and scientific research. Fable 5's capabilities "exceed those of any model we've ever made generally available."

## Key Capabilities

### Software Engineering

Stripe reported Fable 5 "compressed months of engineering into days," completing a 50-million-line Ruby migration in one day versus two months manually. On Cognition's FrontierCode evaluation, it scores highest among frontier models at medium effort levels.

### Vision

The model achieved new benchmarks in extracting data from scientific figures and rebuilt web applications from screenshots alone. Notably, it completed the Pokemon FireRed game using only raw screenshots without additional scaffolding.

### Knowledge Work

The model achieves the highest score on Hebbia's Finance Benchmark for senior-level reasoning, with notable gains in document-based analysis, chart interpretation, and problem-solving.

### Life Sciences

Mythos 5 accelerated protein design tasks approximately tenfold and produced novel molecular biology hypotheses that researchers preferred ~80% of the time in blind comparisons. Internal protein design experts using Mythos 5 matched or exceeded skilled human operators across 14 protein targets without human assistance, yielding nine strong candidates for further investigation.

### Novel Scientific Hypotheses

"Mythos 5 is our first model to consistently produce novel, compelling scientific hypotheses." In blind comparisons, scientists preferred Mythos hypotheses approximately 80% of the time versus Opus-class models. One hypothesis about an E. coli protein was independently corroborated in published research.

### Genomics Research

Mythos 5 conducted autonomous genomics work over a week, assembling single-cell data from millions of cells across 138 species and training a custom machine learning model that outperformed a Science-published model despite being 100 times smaller.

### Long-Context Performance

Fable 5 maintains focus across millions of tokens and demonstrated threefold performance improvements when using persistent memory. In Slay the Spire gameplay with persistent file-based memory, Fable 5 showed threefold performance improvement over Opus 4.8.

### Token Efficiency

Fable 5 demonstrates improved token efficiency compared to previous Claude models, completing complex tasks with fewer reasoning tokens while maintaining or exceeding quality.

## Pricing & Availability

- **Cost:** $10 per million input tokens; $50 per million output tokens — less than half the price of Claude Mythos Preview
- **Fable 5:** Available immediately on Claude API (`claude-fable-5`) and consumption-based plans; rolling out conservatively on subscription plans (included through June 22, then requires usage credits, with restoration as standard feature planned when capacity permits)
- **Mythos 5:** Restricted to Project Glasswing cybersecurity partners (cyber safeguards removed); trusted access program for biology researchers coming soon (biology/chemistry safeguards removed, cyber safeguards remain); broader trusted access expansion planned in consultation with US government

## Safety Architecture

Fable 5 includes classifier-based safeguards that detect misuse attempts. When flagging occurs, responses fall back to Claude Opus 4.8. The system triggers in "less than 5% of sessions."

### Cybersecurity

Blocks offensive cyber tasks with fallback to Claude Opus 4.8. External red-teaming (1,000+ hours) found no universal jailbreaks. One external partner found Fable 5's safeguards "the most robust of any model tested," with zero compliance on harmful single-turn cyber requests across 30 different public jailbreak techniques.

### Biology/Chemistry

Prevents dual-use biological research misuse. Given dual-use concerns, the model falls back to Opus 4.8 on most biology and chemistry requests. Testing showed Mythos 5 outperformed specialized protein models on predicting adeno-associated virus shell properties, demonstrating capability that could pose risks if misused.

### Distillation Prevention

Requests flagged as extraction attempts targeting competing models fall back to Opus 4.8.

### Data Retention

A new 30-day retention requirement applies to Mythos-class traffic. This data supports defense against complex attacks and jailbreak detection but will not train future models or serve non-safety purposes. All human access is logged, with deletion in nearly all cases after 30 days.

### Alignment

Mythos 5 showed low levels of misaligned behavior (including deception and cooperation with misuse) comparable to Opus 4.8. Since Fable 5 uses the same underlying model, alignment profiles are similar.

## Important Notice

An update on June 12, 2026 noted that "access to Claude Fable 5 and Claude Mythos 5" became unavailable due to a US government export control directive.
