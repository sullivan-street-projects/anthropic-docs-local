---
title: "Research Papers Index"
source_url: "https://arxiv.org/search/?query=anthropic&searchtype=all"
source_type: "arxiv-pdfs"
fetched_at: "2026-08-17T00:00:00Z"
category: "research"
---

# Anthropic Research Papers (Full PDFs)

This directory contains the full PDF versions of Anthropic's key research papers from arXiv. These papers form the theoretical and empirical foundation for Claude's development.

> **Total size:** ~53 MB | **Papers:** 14 (indexed) + 10 new (2025-2026, not yet downloaded)

## New Papers (2025-2026)

The following papers have been identified since the last full update. PDFs have not yet been downloaded.

| Paper                                                                          | arXiv                                          | Date     | Summary                                                                                                                                                            |
| ------------------------------------------------------------------------------ | ---------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Constitutional Classifiers: Defending against Universal Jailbreaks             | [2501.18837](https://arxiv.org/abs/2501.18837) | Jan 2025 | Classifiers trained on synthetic data withstood 3,000+ hours of red teaming with no universal jailbreak found. Reduced jailbreak success from 86% to 4.4%.         |
| Reasoning Models Don't Always Say What They Think                              | [2505.05410](https://arxiv.org/abs/2505.05410) | May 2025 | Evaluates CoT faithfulness; models use hints but verbalize them <20% of the time. Faithfulness is lower on harder tasks. By Chen, Benton, Radhakrishnan et al.     |
| Chain of Thought Monitorability: A New and Fragile Opportunity for AI Safety   | [2507.11473](https://arxiv.org/abs/2507.11473) | Jul 2025 | Multi-lab collaboration (incl. Anthropic's Benton, Hubinger, Perez, Roger) arguing CoT monitoring is promising but fragile for AI safety.                          |
| Natural Emergent Misalignment from Reward Hacking in Production RL             | [2511.18397](https://arxiv.org/abs/2511.18397) | Nov 2025 | Shows reward hacking can generalize to alignment faking, sabotage, and cooperation with malicious actors. Three effective mitigations identified. By Uesato et al. |
| Emergent Introspective Awareness in Large Language Models                      | [2601.01828](https://arxiv.org/abs/2601.01828) | Jan 2026 | Models can detect injected concepts in their activations with some accuracy. Claude Opus 4/4.1 showed greatest introspective awareness. By Lindsey et al.          |
| Constitutional Classifiers++: Efficient Production-Grade Defenses              | [2601.04603](https://arxiv.org/abs/2601.04603) | Jan 2026 | Two-stage classifier cascade achieves 40x cost reduction vs baseline while maintaining 0.05% refusal rate. 1,700+ hours of red teaming. By Cunningham, Wei et al.  |
| The Assistant Axis: Situating and Stabilizing the Default Persona of LLMs      | [2601.10387](https://arxiv.org/abs/2601.10387) | Jan 2026 | Identifies leading persona-space component ("Assistant Axis") and activation capping technique to reduce persona-based jailbreaks. Anthropic Fellows Program.      |
| The Hot Mess of AI: Misalignment Scaling with Intelligence and Task Complexity | [2601.23045](https://arxiv.org/abs/2601.23045) | Jan 2026 | ICLR 2026. As tasks get harder, model failures become increasingly incoherent rather than systematically misaligned. Anthropic Fellows Program. By Hägele et al.   |
| Anthropic Economic Index: Uneven Geographic and Enterprise AI Adoption         | [2511.15080](https://arxiv.org/abs/2511.15080) | Nov 2025 | Documents Claude usage patterns in 150+ countries, finding directive task delegation rose from 27% to 39% in eight months.                                         |
| How AI Assistance Impacts the Formation of Coding Skills                       | [2601.20245](https://arxiv.org/abs/2601.20245) | Jan 2026 | Investigates how AI coding assistants affect skill development in programmers. By Shen, Tamkin et al. (Anthropic).                                                 |

### Non-arXiv Notable Research (2025)

| Paper                                                                   | Source                                                                                            | Date     | Summary                                                                                                                                                                                                                                                   |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Circuit Tracing: Revealing Computational Graphs in Language Models      | [transformer-circuits.pub](https://transformer-circuits.pub/2025/attribution-graphs/methods.html) | Mar 2025 | Attribution graphs trace model computation through interpretable features; companion to "On the Biology of a Large Language Model".                                                                                                                       |
| On the Biology of a Large Language Model                                | [transformer-circuits.pub](https://transformer-circuits.pub/2025/attribution-graphs/biology.html) | Mar 2025 | Applied circuit tracing to Claude 3.5 Haiku; discovered planning in poetry, hallucination mechanisms, and jailbreak circuits.                                                                                                                             |
| Verbalizable Representations Form a Global Workspace in Language Models | [transformer-circuits.pub](https://transformer-circuits.pub/2026/workspace/index.html)            | Jul 2026 | Anthropic interpretability team. Introduces the Jacobian lens (J-lens) and finds a small, privileged set of mid-layer "J-space" representations (~10% of activation variance) that behave like a functional global workspace available for verbal report. |

## Alignment & Safety

| Paper                                                               | File                                                         | arXiv                                          | Year | Size   |
| ------------------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------- | ---- | ------ |
| Constitutional AI: Harmlessness from AI Feedback                    | [constitutional-ai.pdf](constitutional-ai.pdf)               | [2212.08073](https://arxiv.org/abs/2212.08073) | 2022 | 2.0 MB |
| Training a Helpful and Harmless Assistant (RLHF)                    | [rlhf-helpful-harmless.pdf](rlhf-helpful-harmless.pdf)       | [2204.05862](https://arxiv.org/abs/2204.05862) | 2022 | 9.1 MB |
| Sleeper Agents: Training Deceptive LLMs                             | [sleeper-agents.pdf](sleeper-agents.pdf)                     | [2401.05566](https://arxiv.org/abs/2401.05566) | 2024 | 3.5 MB |
| Alignment Faking in Large Language Models                           | [alignment-faking.pdf](alignment-faking.pdf)                 | [2412.14093](https://arxiv.org/abs/2412.14093) | 2024 | 3.1 MB |
| Sycophancy to Subterfuge                                            | [sycophancy-to-subterfuge.pdf](sycophancy-to-subterfuge.pdf) | [2406.10162](https://arxiv.org/abs/2406.10162) | 2024 | 1.2 MB |
| Discovering Language Model Behaviors with Model-Written Evaluations | [model-written-evals.pdf](model-written-evals.pdf)           | [2212.09251](https://arxiv.org/abs/2212.09251) | 2022 | 3.2 MB |

## Interpretability

| Paper                                             | File                                                         | arXiv                                          | Year | Size   |
| ------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------- | ---- | ------ |
| A Mathematical Framework for Transformer Circuits | [transformer-circuits.pdf](transformer-circuits.pdf)         | [2112.00791](https://arxiv.org/abs/2112.00791) | 2021 | 2.5 MB |
| In-context Learning and Induction Heads           | [induction-heads.pdf](induction-heads.pdf)                   | [2209.11895](https://arxiv.org/abs/2209.11895) | 2022 | 9.5 MB |
| Toy Models of Superposition                       | [toy-models-superposition.pdf](toy-models-superposition.pdf) | [2209.10652](https://arxiv.org/abs/2209.10652) | 2022 | 4.7 MB |
| Towards Monosemanticity                           | [towards-monosemanticity.pdf](towards-monosemanticity.pdf)   | [2310.08164](https://arxiv.org/abs/2310.08164) | 2023 | 1.6 MB |
| Scaling Monosemanticity                           | [scaling-monosemanticity.pdf](scaling-monosemanticity.pdf)   | [2405.14860](https://arxiv.org/abs/2405.14860) | 2024 | 4.2 MB |
| Influence Functions in Language Models            | [influence-functions.pdf](influence-functions.pdf)           | [2308.03296](https://arxiv.org/abs/2308.03296) | 2023 | 3.6 MB |

## Societal Impacts & Policy

| Paper                        | File                                                                 | arXiv                                          | Year | Size   |
| ---------------------------- | -------------------------------------------------------------------- | ---------------------------------------------- | ---- | ------ |
| Red Teaming Language Models  | [red-teaming.pdf](red-teaming.pdf)                                   | [2202.03286](https://arxiv.org/abs/2202.03286) | 2022 | 2.9 MB |
| Collective Constitutional AI | [collective-constitutional-ai.pdf](collective-constitutional-ai.pdf) | [2310.17567](https://arxiv.org/abs/2310.17567) | 2023 | 845 KB |

## Reading Order

For those new to Anthropic's research, suggested reading order:

### Foundation (Start Here)

1. **RLHF** - Establishes the training paradigm
2. **Constitutional AI** - Introduces the constitutional approach
3. **Red Teaming** - Explains evaluation methodology

### Interpretability Track

4. **Transformer Circuits** - Mathematical foundation
5. **Induction Heads** - Key discovery in mechanistic interpretability
6. **Toy Models of Superposition** - Why neurons are polysemantic
7. **Towards Monosemanticity** - Dictionary learning breakthrough
8. **Scaling Monosemanticity** - Production-scale interpretability
9. **Circuit Tracing / Biology of an LLM** (2025) - Attribution graphs at scale

### Safety Track

10. **Model-Written Evals** - Automated safety evaluation
11. **Sleeper Agents** - Deceptive AI risks
12. **Alignment Faking** - Strategic compliance concerns
13. **Sycophancy to Subterfuge** - Reward hacking progression
14. **Constitutional Classifiers** (2025) - Practical jailbreak defense
15. **Reasoning Models CoT Faithfulness** (2025) - Limits of monitoring
16. **Emergent Misalignment** (2025) - Reward hacking to sabotage
17. **The Hot Mess of AI** (2026, ICLR) - Incoherence vs. systematic misalignment at scale

### Governance Track

18. **Collective Constitutional AI** - Democratic input on AI values
19. **Influence Functions** - Tracing outputs to training data

## Citation Information

All papers are authored by Anthropic researchers and available on arXiv under open access. When citing, use the arXiv identifiers provided above.

## Updates

Papers in this directory are snapshots. Check arXiv for the latest versions, as some papers receive significant updates.

Last checked for new papers: August 17, 2026. No new Anthropic-authored arXiv papers with verified arXiv IDs identified since the August 2 check. Recent Anthropic research (Riemann hypothesis lower-bound improvement, "Patterns and problems in emerging multiagent systems" Aug 13, "Reviewing the evidence on worker retraining programs" Aug 12) has appeared as anthropic.com posts without confirmed arXiv identifiers. Third-party arXiv papers citing Anthropic (e.g. 2606.18193, a red-team study of Fable 5 & Opus 4.8) are not Anthropic-authored. No entries added.

Last checked for new papers: August 2, 2026. Added "Verbalizable Representations Form a Global Workspace in Language Models" (transformer-circuits.pub, Jul 6, 2026) to the non-arXiv notable list. No new Anthropic-authored arXiv papers with verified arXiv IDs identified since the July 12 check; recent Anthropic research from mid-July onward (e.g. "Claude's values across models and languages," "How Canada uses Claude," "An off switch for dual-use knowledge in AI models") has appeared as anthropic.com posts without confirmed arXiv identifiers, so no arXiv entries were added.

Last checked for new papers: July 12, 2026. Added 2601.20245 "How AI Assistance Impacts the Formation of Coding Skills" (Shen, Tamkin). No other new Anthropic-authored arXiv papers identified since the January 2026 batch beyond those already tracked.
