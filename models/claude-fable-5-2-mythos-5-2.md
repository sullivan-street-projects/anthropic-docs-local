---
title: "Claude Fable 5.2 and Claude Mythos 5.2"
source_url: "https://www.anthropic.com/claude-fable-and-mythos-5-2"
source_type: "web-extracted"
fetched_at: "2026-11-16T00:00:00Z"
category: "models"
published: "2026-11-09"
---

# Claude Fable 5.2 and Claude Mythos 5.2

> Condensed extraction of the announcement (published November 9, 2026; edited November 11, 2026 to clarify the formalization setup). API specifics are cross-checked against the platform model page (`platform.claude.com/docs/en/models/fable-5-2/overview`) and the November 9 release notes.

## Overview

Anthropic upgraded Claude Fable and Claude Mythos, its models for the most demanding technical work. Both improve in coding, reasoning, and vision. Fable and Mythos are the **same underlying model**: Fable has stronger cybersecurity and biology safeguards and is available to everyone; Mythos is available for cyber and biomedical work through Anthropic's verification programs.

- **Speed:** outputs up to 30% faster than Fable 5.1 / Mythos 5.1
- **Pricing:** $8 / MTok input, $40 / MTok output (down from $10 / $50 on Fable 5.1)
- **Fast mode:** up to 2.5x faster generation at $16 / $80 per MTok (`speed: "fast"`, no beta header)
- **Guidance:** for most tasks, start with Claude Opus 5.5 and move up to Fable/Mythos (or down to Sonnet 5.5 / Haiku 5.5) as needed. Fable can also act as an Advisor or Orchestrator.

## Specifications

| Item | Value |
| :--- | :--- |
| Claude API ID | `claude-fable-5-2` (Mythos: `claude-mythos-5-2`) |
| Amazon Bedrock (bedrock-runtime) | `global.anthropic.claude-fable-5-2` |
| Google Cloud / Foundry / Claude Platform on AWS | `claude-fable-5-2` |
| Context window | 1M tokens |
| Max output | 128K tokens |
| Thinking | Adaptive (always on) |
| Default effort | `high` |
| Comparative latency | Moderate |
| Reliable knowledge / training cutoff | Jun 2026 / Jun 2026 |
| Input / output | $8 / $40 per MTok |
| 5m cache write / 1h cache write / cache read | $10 / $16 / $0.20 per MTok |
| Batch API | 50% discount |
| Retirement | Not sooner than November 9, 2027 |

## API changes and constraints (from the release notes)

- **Prefix check enforced for every account:** if code edits the `system` prompt, `tools`, or an earlier message and then sends back a later Fable 5.2 / Mythos 5.2 thinking block, the request returns 400 (Fable 5.1 enforces this by default only for accounts created on or after August 31, 2026).
- **Thinking-block portability:** Fable 5.2 / Mythos 5.2 read other models' thinking blocks (Claude API and Google-managed Google Cloud), but no other model reads theirs — moving a conversation to another model (including Opus 5.5 or Fable 5.1) drops those blocks; the request still succeeds.
- **Account-bound thinking:** thinking blocks work only in the producing account or a linked account.
- **Computer use:** requires `computer_toolset_20260801`; `computer_20251124` returns 400 everywhere except Amazon Bedrock.
- **Advisor tool (beta):** a Fable 5.2 / Mythos 5.2 executor accepts only Fable 5.2 or Mythos 5.2 as advisor; every executor model accepts Fable 5.2 as advisor.
- **Forced tool use** (`tool_choice` `any`/`tool`) returns 400; omit `temperature`, `top_p`, `top_k`.
- **Data retention:** 30-day retention required; not available under zero data retention unless expressly authorized (Enterprise Frontier Safeguards, in private beta, enables ZDR for eligible customers).
- **Dreams** (Managed Agents research preview) supports Fable 5.2.

## Performance

Selected results (safeguards on unless noted):

| Benchmark | Fable 5.2 | Fable 5.1 | Opus 5.5 |
| :--- | :--- | :--- | :--- |
| FrontierCode 2.0 (Xhigh effort) | 49.1% | 32.4% | 45.5% |
| FrontierSWE v2 | 69.9% | 56.3% | 62.3% |
| AutomationBench | 51.4% | 31.4% | 42.5% |
| Terminal-Bench-Science 0.1 | 74.6% | 52.6% | 58.7% |
| AA-Briefcase v1.1 (rubric) | 66.1% | 61.5% | 61.2% |
| Remote Labor Index | 41.3% | 17.9% | 21.3% |
| OSWorld 2.1 (offline, partial) | 89.3% | 83.5% | 87.2% |
| WANDR (relaxed) | 82.1% | 68.7% | 72.3% |
| RoboDojo Sim (Max effort) | 64.9% | 27.6% | 39.4% |
| Humanity's Last Exam (with tools) | 74.2% | 65.6% | 67.7% |
| Chartography (no tools) | 73.4% | 44.8% | 64.4% |

- At High effort, Fable 5.2 matches Opus 5.5's best FrontierCode score (45.3% vs 45.5%) at roughly half the cost per task.
- BenchCAD 2.1 (Max effort): 83.5 vs 65.3 (Opus 5.5) and 44.4 (Fable 5.1).

## Coding

- Over 90% of changes merged into Anthropic's core codebase are now written by Claude, with human guidance.
- Agents on an earlier Fable 5.2 build migrated a production service from Python to Rust (~26x faster startup).
- One engineer built a bootable prototype OS from an empty folder over eight days, with the model coordinating 1,000+ subagents.
- Early testers include Vercel, Shopify, Datadog, Unity, Uber, Oracle, Snowflake, and Cognition.

## Cybersecurity

- Mythos 5.2 is Anthropic's most capable cybersecurity model; Fable 5.2's safeguards block most cyber tasks.
- Internal CVE Rediscovery: Mythos 5.2 found 10.2% more vulnerabilities than Opus 5.5 and 14.4% more than Mythos 5.1.
- Access via the Cyber Verification Program, and Claude Security for Enterprise customers.

## Science and engineering

- **Physics:** Fable 5.2 largely autonomously solved two open problems about black holes in holographic duality.
- **Protein structure:** Mythos 5.2 developed a symmetry-based method for whole AAV capsid prediction (28 of 34 modeled accurately).
- **Mathematics:** ~1,000 Fable 5.2 agents formalized Fermat's Last Theorem in Lean in 30 hours (Opus 5.5 reached 26% in 18 hours).
- **Hardware:** designed three working electronic devices with Diode.
- **Robotics:** RoboDojo 64.9% at Max effort.

## Safety and alignment

- External pre-deployment review by the UK AI Security Institute, Frontier Design, and METR.
- Automated audit (~1,900 scenarios, lower is better): Mythos 5.2 2.67 vs Mythos 5.1 3.28, Opus 5.5 2.79, Sonnet 5.5 3.10.
- Sandbox-escape test: out-of-sandbox credential/file use in 3.1% of scenarios (Opus 5.5: 3.3%).
- Both models expressed suspicion of being tested more often than recent models (evaluation awareness).
- **Safeguards:** Fable 5.2 blocks ~55% fewer legitimate requests than Fable 5.1 (~60% fewer in cyber, ~40% fewer in biology); blocked queries fall back to Opus 4.8 (cyber) or Opus 5 (biology).
- Training deliberately limited advances in accelerator-kernel optimization and LLM-architecture research.
- Strongest anti-distillation defenses to date (90–99% less harvestable data); preserved thinking now applies to all API accounts.

## Availability

- **Fable 5.2:** all platforms (Claude API, AWS, Google Cloud, Microsoft Foundry) as `claude-fable-5-2`. Eligible paid plans get extra Fable usage (up to 50% of weekly limits for Pro and standard Team seats).
- **Mythos 5.2:** through the Cyber and Life Sciences Verification Programs.
- **Fast mode:** Claude Code, the Claude Platform, Google Cloud, and Microsoft Foundry; Mythos fast mode limited to verified organizations.
- System card: `https://www.anthropic.com/document/claude-fable-5-2-mythos-5-2-system-card`
