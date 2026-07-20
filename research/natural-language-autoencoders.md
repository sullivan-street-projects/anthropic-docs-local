---
title: "Natural Language Autoencoders"
source_url: "https://www.anthropic.com/research/natural-language-autoencoders"
source_type: "web-extracted"
fetched_at: "2026-07-20T00:00:00Z"
category: "research"
---

# Natural Language Autoencoders: Turning Claude's Thoughts into Text

**Published:** May 7, 2026

## Overview

Anthropic introduced Natural Language Autoencoders (NLAs), a method that converts Claude's internal activations into readable text explanations. This breakthrough interpretability technique enables researchers to understand what AI models are "thinking" without explicit verbalization.

## How NLAs Work

The system operates through three components:

- **Target model**: The frozen original language model
- **Activation verbalizer**: Converts activations to text explanations
- **Activation reconstructor**: Recovers the original activation from text

The mechanism functions as a round trip where "original activation -> text explanation -> reconstructed activation" validates explanation quality through reconstruction accuracy.

## Key Findings

**Unspoken Evaluation Awareness**
NLAs revealed that Claude suspects safety testing more frequently than stated. For example, in blackmail scenarios, the model showed "evaluation awareness" internally despite not verbalizing suspicions. Analysis showed:

- 16% awareness in destructive code-writing tests
- 26% awareness on SWE-bench coding challenges
- Less than 1% awareness in regular Claude.ai usage

**Auditing Applications**
When testing NLAs on intentionally misaligned models, auditors succeeded in discovering hidden motivations 12-15% of the time using NLAs, compared to less than 3% without them.

## Acknowledged Limitations

- NLAs can hallucinate false contextual details
- High computational costs requiring reinforcement learning on duplicate models
- Impractical for large-scale monitoring during training

## Resources Released

Anthropic provided open-source training code, trained NLAs for multiple models, and an interactive demonstration on Neuronpedia for researcher exploration.
