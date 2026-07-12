---
title: "Claude Sonnet 4.5"
source_url: "https://www.anthropic.com/news/claude-sonnet-4-5"
source_type: "web-extracted"
fetched_at: "2026-07-12T00:00:00Z"
category: "models"
---

# Claude Sonnet 4.5

Claude Sonnet 4.5 is the best combination of speed and intelligence for real-world agents and coding. Launched September 29, 2025.

## Model ID

| Platform         | Model ID                                    |
| :--------------- | :------------------------------------------ |
| Claude API       | `claude-sonnet-4-5-20250929`                |
| Claude API alias | `claude-sonnet-4-5`                         |
| AWS Bedrock      | `anthropic.claude-sonnet-4-5-20250929-v1:0` |
| GCP Vertex AI    | `claude-sonnet-4-5@20250929`                |

## Pricing

$3 / MTok input, $15 / MTok output

## Specifications

| Feature                   | Detail                   |
| :------------------------ | :----------------------- |
| Context window            | 200K tokens (1M in beta) |
| Max output                | 64K tokens               |
| Extended thinking         | Yes                      |
| Reliable knowledge cutoff | January 2025             |
| Training data cutoff      | July 2025                |
| Comparative latency       | Fast                     |

## Key Capabilities

- Best coding model at its price point
- Complex agent building
- Computer use and automation
- Multi-step reasoning tasks
- Mathematical problem-solving
- Domain-specific expertise (finance, law, medicine, STEM)

## Performance Benchmarks

- **SWE-bench Verified**: 77.2% (with 200K thinking budget, 10-trial average)
- **OSWorld**: 61.4% (computer use tasks)
- Maintains focus for 30+ hours on complex, multi-step tasks

## Safety

- Reduced concerning behaviors including deception and power-seeking
- Improved prompt injection attack defenses
- Deployed under AI Safety Level 3 (ASL-3) protections

## Status

Active. 1M token context window available via `context-1m-2025-08-07` beta header. Tentative retirement: not sooner than September 29, 2026.
