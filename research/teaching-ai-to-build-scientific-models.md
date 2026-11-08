---
title: "Teaching AI to build scientific models"
source_url: "https://www.anthropic.com/research/teaching-ai-to-build-scientific-models"
source_type: "web-extracted"
fetched_at: "2026-11-08T00:00:00Z"
category: "research"
---

# Teaching AI to build scientific models

Anthropic (Science team), **November 6, 2026**. A guest post by AI for Science grantees Jakob Macke, Daniel Gedon, and Stefan Wahl (ELLIS Institute Tübingen / University of Tübingen).

## A historical opening

In 1951, Andrew Huxley solved the **Hodgkin-Huxley equations** for the squid nerve action potential by hand over three weeks. Their empirically chosen fourth power was later supported by a potassium channel structure with four identical pieces; both scientists won the 1963 Nobel Prize.

## A three-step framework

Scientific modeling means **building** a model (its components and equation form), **constraining** it (tuning parameters to data), and **interpreting** it (what it says about the real system).

- **Constraining:** Standard Bayesian inference is often impractical, so the authors describe **simulation-based inference (SBI)** — running a simulator many times (~**100,000** for Hodgkin-Huxley) and training a network to map outputs back to plausible parameters. SBI has been applied to neutron-star collisions, cosmology, structural biology, and geophysics.
- **Building:** LLM agents can propose, run, and revise candidate models. The authors argue agents should return a **distribution of plausible models** weighted by fit (an example shows clusters of 41%, 39%, 11%, 9%), not one best fit — and note most tests so far only rediscover known models.
- **Interpreting:** The hardest step to hand to AI. Proposals: judge understanding by prediction under perturbation, and by whether outputs help humans understand a problem.

## Scale and conclusion

Future models (e.g., the fruit-fly brain, 100,000+ neurons with a full wiring diagram) may be too large to write down, so the key questions become which properties all data-compatible models share and which experiments rule out the most models. Citing Box's "all models are wrong but some are useful," the article closes that **"the process of constructing it"** is what provides insight.
