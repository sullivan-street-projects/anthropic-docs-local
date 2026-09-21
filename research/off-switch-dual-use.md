---
title: "An off switch for dual-use knowledge in AI models"
source_url: "https://www.anthropic.com/research/off-switch-dual-use"
source_type: "web-extracted"
fetched_at: "2026-09-21T00:00:00Z"
category: "research"
---

# An Off Switch for Dual-Use Knowledge in AI Models

**Date:** July 8, 2026

**Authors:** AE Studio in collaboration with Anthropic

---

## Overview

Frontier AI models function as extensive knowledge repositories, some containing information with dual-use applications—knowledge applicable to both beneficial and harmful purposes. Examples include cybersecurity expertise that can secure vulnerabilities or exploit them, and virology knowledge useful for vaccine development or pathogen creation.

The research addresses a fundamental challenge: balancing three objectives simultaneously—restricting access to dangerous capabilities with precision, enabling authorized users to utilize those same capabilities responsibly, and maintaining model performance across all other tasks.

## Current Limitations

Existing protections remain imperfect. While models receive training to decline harmful requests and use content screening systems, these safeguards guard against dangerous outputs without modifying the underlying knowledge stored within the model. Determined attackers may still attempt jailbreaking to bypass these defenses and access dual-use information.

Previous approaches included filtering training data and confining knowledge to specific model weight slices, yet these methods produce single models with fixed capability sets. Creating multiple versions requires separate training runs, making production implementation prohibitively expensive.

## GRAM: Gradient-Routed Auxiliary Modules

The new method, GRAM, enables achieving multiple filtered model benefits from single training. The approach incorporates dedicated, removable compartments for each dual-use knowledge category and updates only these compartments when encountering relevant data.

**Mechanism:** GRAM adds specialized neurons to each Transformer layer, organized into modules corresponding to specific dual-use domains. During training, general text learning proceeds normally. However, when encountering domain-specific dual-use material, the model employs existing general knowledge while restricting learning to the relevant module, keeping general weights frozen.

This architecture allows domain knowledge to concentrate within designated modules rather than dispersing across the network. After training, modules can be deleted entirely to remove capabilities or retained for authorized deployments. A single training run with four dual-use categories produces a model configurable in sixteen different ways.

## Experimental Results

**Test One:** Using synthetic children's stories datasets, smaller GRAM models successfully reconfigured to "forget" selected topics, matching performance of separately trained filtered models.

**Test Two:** Larger models trained on realistic web content, code, and scientific papers with four dual-use domains (virology, cybersecurity, nuclear physics, specialized programming language) showed module deletion effectively removed corresponding capabilities without degrading general performance. Recovery attempts using malicious fine-tuning data were resisted comparably to data filtering approaches.

**Test Three:** Testing across seven model sizes (50 million to 5 billion parameters) demonstrated GRAM matched data filtering effectiveness at all scales, with capability separation improving with scale.

## Conclusions and Limitations

As AI capabilities advance, managing dual-use knowledge access becomes increasingly critical. Traditional approaches relying on classifiers and refusal training face robustness challenges without compromising harmless performance. GRAM presents a potential pathway toward more resilient access controls.

However, significant limitations remain. Research hasn't reached frontier scale or production implementation. Current evaluations measure next-token prediction rather than downstream task performance. A fundamental unresolved question persists: certain dual-use capabilities may prove inseparable from general knowledge, resisting clean isolation through any available method.
