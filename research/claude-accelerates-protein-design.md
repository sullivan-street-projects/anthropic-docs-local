---
title: "How Claude is accelerating protein design and analytical chemistry"
source_url: "https://www.anthropic.com/research/Claude-accelerates-protein-design"
source_type: "web-extracted"
fetched_at: "2026-09-06T00:00:00Z"
category: "research"
published: "2026-08-18"
---

# How Claude is accelerating protein design and analytical chemistry

## Overview

This research demonstrates Claude's capability to accelerate life sciences research through two applications: autonomous protein binder design and analytical chemistry analysis. The work shows how AI can reduce the time and expertise required for complex scientific tasks. All prompts, computational data, and experimental results were published to enable independent verification.

## Protein Binder Design Campaign

### Key Findings

Claude successfully designed protein binders against 14 of 15 targets tested, significantly exceeding typical industry performance:

- **Hit rates:** Mythos Preview achieved 35.1% when focusing on single targets (versus an industry standard of 10-15%)
- **High-affinity binders:** Designed against at least six targets with strong binding properties
- **Competitive performance:** Matched or exceeded the best previously published affinities on at least four targets

### Methodology

Researchers provided Claude with:

- A 30,000-token protein design prompt
- Internet access and protein design literature
- GPU access for specialized models
- Integration with Google Drive, Slack, Gmail, and BioRxiv
- Minimal human oversight beyond infrastructure support

Claude autonomously orchestrated multiple open-source protein design tools, generated candidate structures, ran optimization cycles, and screened for novel, diverse candidates across 15 targets.

### Notable Results

Strong performers:

- Against RBX1, Mythos Preview achieved a 40% hit rate versus the 3.7% competition average
- Opus 4.8 designed cross-reactive binders against TNFα that bound human, monkey, and mouse variants
- Claude designed 15 confirmed binders containing challenging β-sheet structures across six targets

Challenging targets:

- Limited success against BBF-14 (a synthetic protein benchmark) and maltose-binding protein (MBP) due to structural complexity

### Dual-Use Considerations

Protein design capabilities remain restricted to trusted access programs due to biosafety concerns, though Opus-class models retain chemistry capabilities.

## Analytical Chemistry Task

### Objective

Test Claude Opus 5's ability to interpret NMR and LC-MS data—routine quality control analyses that typically consume significant chemist time.

### Results

Working with raw instrument files and minimal instruction, Claude:

- Processed NMR data in 23 minutes, producing calibrated spectra with peak identification
- Analyzed LC-MS data in 19 minutes, determining compound purity and molecular mass
- Matched lab results precisely: hydrogen counts within 0.08 units; purity at 96.4% versus the lab's 96.33%

### Key Capabilities Demonstrated

- Decoded undocumented vendor file formats
- Proposed appropriate follow-up experiments (heavy water NMR validation)
- Self-corrected analysis errors through verification procedures
- Generated comprehensive reports with methodological caveats

### Efficiency Gain

Claude completed both analyses in parallel within 25 minutes. A typical chemist workflow takes 30 minutes to 1 hour per sample, with a 4-day turnaround for finished reports.

## Broader Implications

The research illustrates how AI agents can reduce expertise barriers and accelerate experimental workflows in drug development. Both applications represent early-stage components of longer drug development pipelines, with protein binder design serving as foundational work toward complete therapeutic candidates.
