---
title: "Paving the way for agents in biology"
source_url: "https://www.anthropic.com/research/agents-in-biology"
source_type: "web-extracted"
fetched_at: "2026-07-27T00:00:00Z"
category: "research"
---

# Paving the Way for AI Agents in Biology

**Published:** June 8, 2026
**Author:** Laura Luebbert

## Core Argument

The article contends that biological data infrastructure requires redesign to support AI agents effectively. Currently, systems built for human researchers create obstacles for automated workflows -- analogous to "driving through an old city designed before cars."

## Main Problem

Biological databases present fragmented infrastructure with:

- Idiosyncratic file formats
- Scattered, disconnected databases
- Manual retrieval workflows requiring browser navigation
- Inconsistent metadata standards
- Context-dependent conventions

As the author notes: "The bottleneck for biological agents is not only reasoning but the absence of widespread deterministic execution layers for querying biological data."

## Case Study: VirBench Benchmark

Researchers tested state-of-the-art AI systems (Claude, Biomni OSS, Edison Analysis, GPT models) on viral sequence retrieval from NCBI Virus using existing tools.

**Results without optimization:**

- Accuracy ranged from 16.9% to 91.3%
- Same models produced vastly different results across repeated queries
- Claude Sonnet 4 returned 106, 15, and 5 sequences respectively for identical requests

**Real-world consequences:** Incomplete datasets altered phylogenetic analyses, shifting outbreak origin estimates by months and missing treatment-resistant mutations.

## The Solution: gget virus

Anthropic and NCBI researchers developed a deterministic retrieval layer that:

- Coordinates multiple underlying APIs
- Handles large result sets comprehensively
- Applies filters requiring supplementary databases
- Returns standardized, auditable outputs

**Impact:** Accuracy rose above 90% for all agents, with GPT-5.5 achieving 99.7% accuracy.

## Broader Implications

The authors argue this reflects a universal challenge: intelligent systems struggle in environments designed exclusively for human interaction. The solution requires building "context engines" -- reliable, agent-accessible infrastructure where creativity operates atop deterministic foundations.
