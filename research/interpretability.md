---
title: "Interpretability Research"
source_url: "https://www.anthropic.com/research"
source_type: "web-extracted"
fetched_at: "2026-03-15T00:00:00Z"
category: "research"
---

# Interpretability Research

Anthropic's interpretability research aims to understand what happens inside neural networks—reverse-engineering the algorithms learned during training to build mechanistic understanding of AI systems.

## Latest Work (2025-2026)

### The Assistant Axis: Situating and Stabilizing LLM Character (Jan 19, 2026)
Research from MATS and the Anthropic Fellows Program ([arXiv 2601.10387](https://arxiv.org/abs/2601.10387)). Extracted activation directions for diverse character archetypes and found the leading persona-space component is an "Assistant Axis." Steering toward it reinforces helpful/harmless behavior; steering away increases tendency to adopt other identities. Developed activation capping technique to reduce persona-based jailbreaks.

### Emergent Introspective Awareness in LLMs (Jan 5, 2026)
Full arXiv paper ([2601.01828](https://arxiv.org/abs/2601.01828)) based on Oct 2025 research. Injected known concepts into model activations and measured self-reporting accuracy. Claude Opus 4/4.1 showed greatest introspective awareness, though capacity is highly unreliable and context-dependent. By Jack Lindsey et al.

### Signs of Introspection in LLMs (Oct 29, 2025)
Evidence that language models can accurately report their own internal states, suggesting a form of machine self-awareness that could be leveraged for safety.

### Tracing Thoughts in Language Models / Circuit Tracing (Mar 27, 2025)
Two companion papers on [transformer-circuits.pub](https://transformer-circuits.pub/2025/attribution-graphs/methods.html): "Circuit Tracing" (methods) and "On the Biology of a Large Language Model" (applications). Attribution graphs trace computation through interpretable features in Claude 3.5 Haiku. Key discoveries: models plan rhyming words before writing poetry lines, hallucination mechanisms involve "default refusal" circuits being incorrectly inhibited, and jailbreak circuits revealed how obfuscated inputs bypass safety.

## The Transformer Circuits Thread

A series of papers building mechanistic understanding of transformers:

### A Mathematical Framework for Transformer Circuits (Dec 2021)
**Key insight:** Transformers can be understood as compositions of simple computational units (attention heads, MLPs) that perform interpretable operations.

**Concepts introduced:**
- Residual stream as shared communication channel
- Attention heads as information movement
- QK and OV circuits for query-key matching and value transformation

### In-Context Learning and Induction Heads (Mar 2022)
**Key insight:** "Induction heads" are a specific circuit that enables in-context learning by copying patterns from earlier in the context.

**Finding:** A phase change during training where induction heads form, corresponding to a sudden improvement in in-context learning ability.

### Toy Models of Superposition (Sep 2022)
**Key insight:** Neural networks represent more features than they have dimensions by using superposition—encoding features as nearly-orthogonal directions.

**Implications:**
- Polysemanticity (neurons responding to multiple concepts) is expected
- Features can interfere with each other
- Sparse features are easier to represent in superposition

### Towards Monosemanticity (Oct 2023)
**Key insight:** Dictionary learning (sparse autoencoders) can decompose model activations into interpretable features, recovering monosemantic units from polysemantic neurons.

**Breakthrough:** Scaled to 4096 features on a small model, finding interpretable concepts like "DNA sequences," "legal text," and "code comments."

### Scaling Monosemanticity (May 2024)
**Key insight:** Dictionary learning scales to production models (Claude 3 Sonnet), extracting millions of interpretable features.

**Findings:**
- Features for abstract concepts (deception, bias, sycophancy)
- Features can be manipulated to change model behavior
- Opens path to "feature steering" for safety

## Research Threads

### Circuit Analysis
- **Softmax Linear Units** (Jun 2022) - Architecture changes for interpretability
- **Dictionary Learning as Classifiers** (Oct 2024) - Using learned features for classification
- **Circuits Updates** (2024 series) - Monthly progress reports

### Superposition & Features
- **Superposition and Memorization** (Jan 2023) - How superposition relates to memorization
- **Repeated Data Scaling Laws** (May 2022) - Effects of data repetition on representations

### Scaling Challenges
- **Engineering Challenges in Scaling** (Jun 2024) - Practical obstacles to interpretability at scale

## Key Concepts

### Superposition
Models compress many more concepts than they have dimensions:
```
If model has 1000 dimensions but needs 10000 features:
→ Features are stored as near-orthogonal directions
→ Small interference between features is tolerable
→ Sparse features (rarely active) pack more efficiently
```

### Polysemanticity vs Monosemanticity
- **Polysemantic neuron**: Activates for multiple unrelated concepts (common in raw networks)
- **Monosemantic feature**: Responds to single interpretable concept (goal of dictionary learning)

### Residual Stream
The transformer's "communication highway":
- Each layer reads from and writes to the residual stream
- Attention heads move information between positions
- MLPs transform information at each position
- Final output is linear readout from residual stream

### Dictionary Learning / Sparse Autoencoders
Technique to extract interpretable features:
1. Train autoencoder with sparsity constraint on hidden layer
2. Hidden units learn to represent interpretable features
3. Each feature has a direction in activation space
4. Features can be analyzed, searched, and manipulated

## Practical Applications

### Feature Steering
Discovered features can be amplified or suppressed:
- Increase "code quality" feature → better code generation
- Decrease "sycophancy" feature → more honest responses
- Early safety application of interpretability

### Safety Monitoring
Interpretable features enable:
- Detecting when models reason about deception
- Monitoring for concerning internal states
- Understanding failure modes mechanistically

### Model Debugging
Circuit analysis helps:
- Identify why models make specific errors
- Understand generalization patterns
- Improve training procedures

## Resources

- [Transformer Circuits Thread](https://transformer-circuits.pub/)
- [Anthropic Interpretability Papers](https://www.anthropic.com/research?type=interpretability)
- [GitHub: Attribution Graphs](https://github.com/anthropics/attribution-graphs-frontend)
