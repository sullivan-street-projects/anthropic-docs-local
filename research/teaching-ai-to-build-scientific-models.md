---
title: "Teaching AI to build scientific models"
source_url: "https://www.anthropic.com/research/teaching-ai-to-build-scientific-models"
source_type: "web-extracted"
fetched_at: "2026-11-16T00:00:00Z"
category: "research"
---

# Teaching AI to build scientific models

**Published:** Nov 6, 2026 | **Team:** Science | **Topics:** Discovery, Research programs, Life sciences

**Authors (guest post):** Jakob Macke, Daniel Gedon, and Stefan Wahl, researchers at the ELLIS Institute Tübingen and the University of Tübingen, and AI for Science grantees. Thanks to Xander Balwit, Tom Chivers, and Siddharth Mishra-Sharma for review and editorial guidance.

## Contents

- Introduction
- A three-step program
- Splitting the bill, or how to constrain models
- The bill, one level up, or how to build models
- Lost in translation, or how to interpret models
- Cells and scales

## Introduction

- In 1951, Hodgkin and Huxley built equations describing the action potential of a squid nerve cell. The computer was out of action, so Huxley solved the equations by hand on a mechanical calculator, which took more than three weeks.
- To fit the data, one variable had to be raised to the **fourth power**. They hypothesized that this reflected several charged particles that had to move before a gate in the membrane would open.
- Later work found a related potassium channel built from **four identical subunits**, which supported the hypothesis. The model also predicted channel behavior it had never been fitted to.
- **Core argument:** A model that reproduces the data gives you an answer, but not necessarily understanding, because many models can fit the same data. Insight comes from knowing which features all the working models share and which features set them apart.

## A three-step program

- Hodgkin-Huxley remains the standard description of the electrical activity of neurons, in species separated by more than half a billion years of evolution.
- Modeling has three steps, which in practice are repeated:

| Step | What it involves |
|---|---|
| 1. Building | Deciding what the model's components are and what form its equations take. |
| 2. Constraining | Tuning the adjustable parameters to fit measurements. |
| 3. Interpreting | Asking what the model says about the real system. |

- AI is increasingly involved in all three. Constraining has progressed the furthest.

## Splitting the bill, or how to constrain models

- **Analogy:** The total for a $120 group dinner could have come from many different combinations of orders. In the same way, many combinations of gate parameters produce nearly identical nerve activity, so a single good fit hides other plausible settings.
- **Bayesian inference** gives a probability distribution over all reasonably good parameter sets. For complex models it has been impractical, because it requires computing likelihoods across all combinations of parameters.
- **Simulation-based inference (SBI)** works differently:
  - Run a simulator many times with random parameters: about **100,000** runs for Hodgkin-Huxley, and **millions** for larger models.
  - Train a neural network to map the simulated outputs back to plausible parameters.
- A simulator only has to run forward (parameters in, data out), so SBI works even when there is no tidy equation for the likelihood. Huxley's hand calculations were themselves a simulator.
- Once the network is trained, inference takes seconds. Applications include locating neutron star collisions fast enough for telescopes to follow up, and work in cosmology, structural biology, and geophysics.
- SBI shows which parameters the data constrains, where more than one explanation is possible, and where more experiments are needed.

## The bill, one level up, or how to build models

- Agents built on LLMs can write candidate models from data and a natural-language description, then run, constrain, compare, and revise them. Several such systems have appeared in the past two years.
- **Problem:** Many different models can explain the same data, and a single agent run may return any one of several equally good models.
- **Proposed approach:**
  1. Search for the full range of plausible models.
  2. Weight each model by how well the data supports it, penalizing models that need too much flexibility.
  3. Iterate on the stronger models.
- A figure shows variants of Hodgkin-Huxley grouped into four clusters, with shares of **41%, 39%, 11%, and 9%**.
- **Benefit:** If the surviving models agree on a feature, the data probably favors it. Where they disagree, the evidence is thin.
- **Caveat:** So far these systems have mostly rediscovered known models, and there is little evidence yet on problems with no known answer. Newer LLMs perform better on research tasks, and the authors expect these systems to improve.

## Lost in translation, or how to interpret models

- Hodgkin and Huxley's four-particle interpretation was credible because simpler alternatives failed. They noted that higher powers might fit slightly better, but judged the gain not worth the extra complexity.
- Their equations also predicted voltage thresholds, a uniform pulse shape, and that a slowly rising current would not trigger firing.
- Philosophers call a theory **"intelligible"** if its consequences can be worked out without running it. This gets harder as models get larger.
- Interpretation is the hardest step to hand over to AI. Proposed ways to evaluate it:
  - Judge understanding by how well a model predicts responses to perturbations.
  - Judge whether the outputs help human scientists understand the problem.
- **Example:** An AI system for designing quantum experiments wrote a program that generated a whole family of setups, so physicists could read off the design principle directly.
- A **distribution of models**, rather than a single best fit, is crucial. It shows which parts of the model the data constrains and which predictions are robust. For example, models may agree on what happens when all sodium gates are blocked but disagree about blocking only some of them. That disagreement points to the next experiment.

## Cells and scales

- Famous models are compact because humans had to build, constrain, and interpret them. As AI takes on more of this work, it becomes feasible to model systems too complex to write down by hand.
- **Scale:** A fruit fly brain has more than 100,000 neurons, and a human brain has tens of billions. A complete wiring diagram of the fly brain (**124,635 cells**) now makes large-scale models possible, including one that predicts neuron activity in the visual system.
- At these scales, there is unlikely to be a single correct model. In George Box's words, "All models are wrong but some are useful." The key questions become which properties all data-compatible models share. The most useful experiments are the ones that rule out the most models.
- **Analogies:** Climate scientists report the spread across many simulations, and particle physicists map which versions of a theory the data rules out.
- **Conclusion:** The manual process was not wasted effort, because much insight comes from building a model. AI should deliver more than a model that fits. It should also show which parts are pinned down, which remain open, which alternatives failed, and what new questions came up.

## Footnotes

1. Examples of LLM-driven model-discovery systems: Romera-Paredes et al., 2024; Shojaee et al., 2025; Ma et al., 2024; Novikov et al., 2025; Xia et al., 2026; Ziaei Bideh and Gryak, 2026.
2. Work on approaches based on distributions of models: Wahl et al., 2026; Mishra-Sharma, 2026; Murphy, 2026.
3. Fly connectome studies: Dorkenwald et al., 2024; Schlegel et al., 2024; Azevedo et al., 2024.
