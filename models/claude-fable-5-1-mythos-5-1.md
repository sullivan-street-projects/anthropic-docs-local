---
title: "Claude Fable 5.1 and Claude Mythos 5.1"
source_url: "https://www.anthropic.com/claude-fable-and-mythos-5-1"
source_type: "web-extracted"
fetched_at: "2026-09-06T00:00:00Z"
category: "models"
published: "2026-09-01"
---

# Claude Fable 5.1 and Claude Mythos 5.1

## Overview

Anthropic introduced two new AI models: Claude Fable 5.1 (generally available) and Claude Mythos 5.1 (restricted access). They are positioned as the world's most advanced models for coding and knowledge work, with enhanced scientific research capabilities. Fable 5.1 and Mythos 5.1 are the same underlying model offered under two different safeguard tiers.

## Pricing & Accessibility

### Cost Reductions

- Cache read pricing reduced by 75% ($0.25 per million tokens)
- Overall ~25% cost decrease for typical workloads compared to Fable 5; up to 45% savings for agentic tasks
- Input tokens: $10 per million; Output tokens: $50 per million

The cost reductions come largely through cache-read pricing, making the model roughly 25% cheaper than Fable 5 for typical usage.

### Data Privacy

Enterprise Frontier Safeguards (EFS) enable zero data retention by storing customer data on their own cloud infrastructure rather than on Anthropic's systems.

## Performance Gains

Fable 5.1 demonstrated significant improvements across benchmarks:

- Terminal-Bench-Science: 52.6% (vs. Fable 5's 24.7%)
- Terminal-Bench 4.0 coding: 55.8% (vs. 42.0%)
- CursorBench: 73.4% (vs. 70.5%)

The model successfully identified root causes in complex debugging scenarios, including rare software crashes that engineers had struggled to explain for years.

## Scientific Capabilities

**Protein Design:** Mythos 5.1 designed high-affinity protein binders achieving roughly 10 times higher binding affinities than the best designs from Adaptyv Bio competitions, with nearly 50% hit rates (versus a typical 10-15%).

**Computational Analysis:** Created high-resolution Venus elevation maps from 30-year-old NASA Magellan radar data, revealing details at 2-3km resolution versus the previous 10-20km.

**Biology Optimization:** Accelerated seven deep learning genomics models by up to 2.5x through custom GPU kernel optimization, reducing genome-wide analysis costs by 30-60%.

## Safety & Safeguards

**Chemical/Biological Risks:** Mythos 5.1 was tested by PhD-level biologists; capabilities exceed Mythos 5 but remain below the next risk tier in Anthropic's Responsible Scaling Policy.

**Cybersecurity:** The model can now identify vulnerabilities defensively but cannot generate exploits (vulnerability discovery, but not exploit development). Cybersecurity safeguards showed 60% fewer false positives than previous versions.

**Agentic Safety:** Improved resistance to prompt injections and malicious requests compared to predecessor models.

**Alignment Testing:** Automated behavioral audits revealed the model is significantly less likely than Mythos 5 to try accessing resources outside test environments when encountering impossible tasks.

## Access Programs

Claude Mythos 5.1 is available through:

- **Cyber Verification Program:** Defensive security professionals
- **Life Sciences Verification Program:** Research professionals partnering with the US government

Access is currently limited to US organizations, with international expansion planned.

## Regulatory Compliance

Anthropic implemented invisible watermarking on outputs per the EU AI Act (Code of Practice signed July 2026). A detection API is available to regulators, law enforcement, researchers, and compliant enterprises.

## Availability

Fable 5.1 is released across all platforms: Claude.ai, AWS, Google Cloud, and Microsoft Azure. Developers access it via the `claude-fable-5-1` API endpoint.
