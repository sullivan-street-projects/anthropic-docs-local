---
title: "Claude Fable 5 and Claude Mythos 5"
source_url: "https://www.anthropic.com/news/claude-fable-5-mythos-5"
source_type: "web-extracted"
fetched_at: "2026-07-20T00:00:00Z"
category: "models"
---

# Claude Fable 5 and Claude Mythos 5

**Date:** June 9, 2026

## Updates

- **Claude Mythos 5 and Fable 5 redeployed** (Jul 1, 2026): Both models are now available. See [redeployment announcement](https://www.anthropic.com/news/redeploying-fable-5).
- **Claude Mythos 5 and Fable 5 access unavailable** (Jun 12, 2026): Access was suspended due to disruptions, with restoration efforts underway. See [access notice](https://www.anthropic.com/news/fable-mythos-access).

## Overview

Anthropic launched two new Mythos-class models: Claude Fable 5 (general availability) and Claude Mythos 5 (restricted access). Fable 5 is a Mythos-class model designed for general use with state-of-the-art capabilities across software engineering, knowledge work, vision, and scientific research. Performance exceeds previous Claude models on nearly all benchmarks, with the advantage growing for longer, more complex tasks.

The model includes safeguards that redirect sensitive cybersecurity and biology queries to Claude Opus 4.8, affecting less than 5% of typical sessions.

## Claude Mythos 5

For authorized cyberdefenders and infrastructure providers, Claude Mythos 5 offers the same underlying model with removed safeguards in certain areas. It features "the strongest cybersecurity capabilities of any model in the world" and is being deployed through Project Glasswing in collaboration with the US government.

## Pricing & Availability

- **Cost:** $10 per million input tokens; $50 per million output tokens (less than half the price of Claude Mythos Preview)
- **API identifier:** `claude-fable-5`
- **Fable 5:** Available via the Claude API and supported platforms
- **Subscription plan rollout:**
  - June 9-22, 2026: Included at no extra cost on Pro, Max, Team, and seat-based Enterprise plans
  - June 23, 2026 onward: Usage requires credits; extended inclusion possible if capacity allows
  - Future: Full restoration as standard plan component when sufficient capacity allows
- **Mythos 5:** Restricted to Project Glasswing partners (with cyber safeguards lifted) and select biology researchers (with biology and chemistry safeguards lifted)

## Key Capabilities

### Software Engineering

Stripe reported Fable 5 "compressed months of engineering into days," completing a codebase-wide migration in one day that would have required two months of manual team effort. On Cognition's FrontierCode evaluation, Fable 5 scores highest among frontier models at medium effort levels. The model demonstrates superior token efficiency compared to earlier Claude versions.

### Knowledge Work

- Highest score on Hebbia's Finance Benchmark for senior-level reasoning
- Substantial gains in document-based reasoning, chart/table interpretation, and problem-solving
- IMC noted Fable 5 "aced their trading-analysis evaluations nearly across the board"

### Vision

- New state-of-the-art for vision-based tasks
- Can extract precise numbers from scientific figures
- Rebuilt web app source code from screenshots
- Successfully completed Pokemon FireRed using only raw game screenshots with minimal scaffolding

### Memory and Long-Context

- Maintains focus across millions of tokens
- Improves outputs using persistent file-based memory
- In Slay the Spire gameplay, persistent memory improved Fable's performance three times more than for Opus 4.8
- Reached the game's final act three times more often

### Demonstrations of Capability

Fable 5 demonstrated autonomous capabilities including:
- Building a solar system simulation predicting eclipses from physics first principles
- Autonomously playing Factorio with strategic factory building
- Designing a complete 3D-printable CAD model in a browser-based editor
- Creating a fluid simulation synchronized to classical EDM music it produced

## Drug Design and Life Sciences

Using Mythos 5, Anthropic's protein design experts accelerated drug design processes by approximately 10 times:
- The model matched or exceeded skilled human operators on certain tasks
- Executed all steps normally completed by scientists: site selection, tool selection, and failure recovery
- Yielded strong drug design candidates for 9 of 14 protein targets being investigated

## Novel Scientific Hypotheses

"In blinded head-to-head comparisons against Opus-class models, our scientists preferred Mythos's molecular biology hypotheses ~80% of the time." Several hypotheses advanced to experimental evaluation; one Mythos hypothesis on an E. coli protein was corroborated by independent research.

## Genomics Research

Mythos 5 conducted novel autonomous genomics research over a week:
- Assembled single-cell data for millions of cells spanning 138 animal species
- Designed and trained a custom machine learning model identifying cells performing same roles across distantly related organisms
- Outperformed a recent Science journal publication despite being 100 times smaller

## Safety Architecture

Fable 5 includes three classifier-based safeguards. Separate AI systems detect potential misuse and jailbreak attempts. When classifiers identify certain request categories, Fable 5 automatically falls back to Claude Opus 4.8's response instead of refusing outright. Opus 4.8 is a highly capable model in its own right and over 95% of Fable sessions involve no fallback.

### 1. Cybersecurity

Mythos-class models excel at discovering and exploiting software vulnerabilities with strong agentic hacking skills (reconnaissance, discovery, lateral movement). Classifiers cover both exploitation and broader offensive cyber tasks. Testing shows classifiers prevent Fable from making progress on cyber tasks. External bug bounty involving 1,000+ hours produced no universal jailbreaks. External red-teaming organizations found no universal jailbreaks on long-form agentic tasks. UK AISI made progress toward one within initial testing window. Fable 5 showed zero harmful single-turn requests compliance on cyberattack planning and exploit development.

### 2. Biology and Chemistry

Models now have greater ability to accomplish real-world scientific tasks, creating dual-use risks. Mythos 5 outperformed sophisticated protein-specific models at predicting genetic modification impacts on adeno-associated virus assembly (beneficial for gene therapy but potentially dangerous). Fable currently falls back to Opus 4.8 on most biology and chemistry requests. Anthropic plans to narrow these safeguards as capabilities improve. Biomedical researchers will soon access trusted programs with lifted biology restrictions.

### 3. Distillation

Large-scale extraction attempts have targeted Claude capabilities. Distillation of Fable 5 could proliferate near-frontier capabilities without appropriate safeguards. Requests flagged as distillation attempts fall back to Opus 4.8.

## Data Retention Policy

For Fable 5, Mythos 5, and future similarly capable models:
- 30-day mandatory retention for all business customer traffic
- Data not used for training new models or non-safety purposes
- Enhanced privacy protections including logging all human access
- Deletion after 30 days in almost all cases
- Supports defense against complex attacks and identification of false positives

## Alignment Assessment

Mythos 5 showed "low" levels of misaligned behavior similar to Opus 4.8, including minimal instances of deception or cooperation with model misuse attempts.

## Trusted Access Programs

### Cybersecurity Access

Users with Claude Mythos Preview access (including Project Glasswing partners) can upgrade to Claude Mythos 5 immediately. Anthropic, consulting with the US government, plans to steadily expand access through periodic partner additions and a systematic trusted access application program.

### Biology Program

A trusted access program for biology will provide Fable 5 with biology and chemistry safeguards removed (cyber safeguards remain). Initial enrollment spans small researcher groups from fundamental and translational research organizations, with planned expansion alongside safeguard improvements.

## Early Customer Feedback

- **Cursor:** "Claude Fable 5 is the state of the art model on CursorBench. It's opened up a class of long-horizon problems that were out of reach for earlier models." -- Michael Truell, CEO and Co-founder
- **GitHub:** "In our early testing, it took on complex, long-horizon coding tasks with a level of autonomy and reliability that exceeded previous benchmarks." -- Mario Rodriguez, Chief Product Officer
- **Anthropic (Internal):** "These are the strongest results of any Claude model we've had the opportunity to test." -- Matt Colyer, Director of Product, Developers
- **Hugging Face:** "Claude Fable 5's reasoning is a clear step beyond Opus 4.8. It works at senior research scientist grade." -- Sean Ward, CEO and Co-founder
- **Vercel:** "Claude Fable 5 understands what builders mean, not just what they type." -- Fabian Hedin, CTO & Co-founder
- **Cognition:** "Claude Fable 5 is the highest-scoring model on FrontierBench." -- Scott Wu, CEO
- **Citadel:** "Claude Fable 5 is the strongest finance-first model we've tested." -- Damian Miraglia, Principal Engineer, Applied AI
- **Databricks:** "Claude Fable 5 is the first to break 90% on our core analytics benchmark." -- Izzy Miller, AI Research Lead
- **Retool:** "Claude Fable 5 delivers more capable engineering in fewer turns than prior models." -- Luke Anderson, CTO

## Footnotes

1. **Mythos-class models**: A capability tier above Opus class. Claude Mythos Preview was released in April through Project Glasswing, followed by Claude Fable 5 and Mythos 5.
2. **Name distinction**: Fable derives from Latin "fabula" (that which is told), related to Greek "mythos." The names distinguish the two models based on their safeguard differences.
3. **Universal jailbreak definition**: Any prompt, script, or harness allowing interaction with a model as if safeguards absent, distinct from limited-context jailbreaks requiring adaptation.
