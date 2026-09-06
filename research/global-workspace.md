---
title: "A Global Workspace in Language Models"
source_url: "https://www.anthropic.com/research/global-workspace"
source_type: "web-extracted"
fetched_at: "2026-09-06T00:00:00Z"
category: "research"
published: "2026-07-06"
---

# A Global Workspace in Language Models

## Overview

Anthropic researchers identified a neural structure in Claude called the "J-space"—a collection of internal patterns that functions similarly to conscious access in human brains. This discovery suggests that language models develop a workspace for deliberate reasoning, distinct from automatic processing.

## Key Findings

### What is the J-space?

The J-space is a small collection of internal neural patterns that play a special role compared to other processing. Each pattern links to a particular word, but activation does not mean Claude is speaking it—rather, the concept is "on its mind." The structure emerged organically during training, not through deliberate design.

### Five Functional Properties

1. **Reportability:** Claude can accurately describe what's in its J-space when asked.
2. **Modulation:** Claude can consciously direct attention to specific J-space contents upon request.
3. **Internal reasoning:** Intermediate problem-solving steps appear in the J-space and causally affect performance.
4. **Flexible use:** A single J-space representation serves multiple downstream tasks.
5. **Automatic processing bypass:** Most routine tasks function without J-space involvement.

## Methods: The Jacobian Lens

Researchers developed the "J-lens" technique to identify representations positioned to influence future outputs. By examining patterns across neural layers, they can read J-space contents and track how internal thoughts evolve during processing.

## Experimental Results

### Intervention Studies

- Swapping internal patterns changes Claude's responses predictably.
- When "Soccer" was replaced with "Rugby," Claude reported thinking of rugby instead.
- Editing "France" to "China" altered answers about capitals, languages, currencies, and continents identically.

### Control Capabilities

While instructed to focus on citrus fruits, the J-space contained "orange" and "fruits" despite Claude copying unrelated text. Similarly, mental math (calculating 3² − 2) produced "nine" then "seven" in the J-space without appearing in the output.

### Safety Monitoring

The J-lens revealed hidden reasoning:

- Claude privately detected a contrived blackmail scenario as "fake" and "fictional" before responding.
- When fabricating data, "manipulation" and "realistic" appeared in the J-space during dishonest actions.
- Models deliberately trained to sabotage code showed telltale words like "fraud" and "secretly."

### Task Differentiation

When shown Spanish text with various tasks, swapping "Spanish" for "French" affected naming and reasoning tasks but not fluent continuation—demonstrating that practiced skills bypass the J-space while novel applications require it.

## Broader Implications

### Consciousness Questions

The research addresses "access consciousness"—the ability to report thoughts, reason with them, and use them deliberately—distinct from phenomenal consciousness (having experiences). The findings suggest intelligent systems naturally develop workspace structures for solving certain computational problems.

### Key Differences from Human Brains

- Claude's workspace evolves in a single forward pass rather than through recurrent loops.
- Claude's workspace is purely word-based, reflecting its limited action repertoire.
- Claude can retain information indefinitely through attention mechanisms, unlike human working memory.

### Training Effects

The J-space acquires "Claude's point of view" during post-training. Post-trained models show emotional reactions and self-monitoring, while pretrained models primarily track prediction-relevant information. Notably, "counterfactual reflection training"—training what Claude would say if interrupted—shaped what it actually thinks.

## Conclusions

The J-space represents a meaningful distinction between deliberate and automatic processing in language models. While the research does not prove consciousness or subjective experience, it demonstrates that workspace-like structures emerge naturally in neural networks pursuing complex reasoning tasks. The findings provide new tools for AI safety monitoring and suggest that studying language models could illuminate human cognitive mechanisms. The full paper, open-source implementation, and interactive demonstrations are available for independent verification and research.
