---
title: "Claude Haiku 5.5"
source_url: "https://www.anthropic.com/claude-haiku-5-5"
source_type: "web-extracted"
fetched_at: "2026-10-11T00:00:00Z"
category: "models"
---

# Claude Haiku 5.5

Launched **October 7, 2026** (`claude-haiku-5-5`). Anthropic calls it "the cheapest, fastest, and most capable small model we've ever released." Targets high-volume, cost-sensitive work (summaries, compactions, database queries, classification) and speed-sensitive tasks (live customer support, browser use), and serves as a subagent alongside Opus 5.5 and Sonnet 5.5. First Haiku-class model with an adjustable effort setting (Low, Med, High, Xhigh, Max) and adaptive thinking.

Available on the Claude Platform, Amazon Web Services, Google Cloud, and Microsoft Azure.

## Pricing (per 1M tokens, ≤100k / >100k prompt tokens)

| | Haiku 5.5 | Haiku 4.5 | Sonnet 5.5 |
|---|---|---|---|
| Input | $0.10 / $0.50 | $1.00 | $2.00 |
| Output | $0.50 / $2.50 | $5.00 | $10.00 |
| Cache reads | $0.01 / $0.05 | $0.10 | $0.10 |
| Cache writes | $0.125 / $0.625 | $1.25 | $2.50 |

- ~75% cheaper to run than Haiku 4.5 on average (90% lower ≤100k tokens, 50% lower above). New tokenizer uses slightly more tokens per task.
- Sonnet 5.5 cache reads halved from $0.20 to $0.10 per MTok alongside this launch.

## Benchmarks (Haiku 5.5 / Haiku 4.5 / GPT-6 Luna / Sonnet 5.5)

- GDPval-AA v2.1 (Elo): 1620 / 735 / 1437 / 1840
- AA-Briefcase v1.1: 1578 / 614 / 1336 / 1824
- OSWorld 2.1 (offline subset): 72.4% / 15.7% / 48.9% / 83.9%
- Humanity's Last Exam (no tools): 45.9% / 10.2% / — / 56.9%
- Humanity's Last Exam (with tools): 57.4% / 18.7% / — / 64.5%
- Terminal-Bench 4.0: 39.2% / 0.0% / 16.4% / 70.6%
- Chartography (no tools): 46.4% / 6.4% / 29.1% / 61.6%

Sonnet 5.5 and Opus 5.5 remain better for complex agentic coding.

## API and platform

- Computer use and browser use are in beta in the Python and TypeScript SDKs.
- Breaking changes from Haiku 4.5: `budget_tokens`, `temperature`, `top_p`, `top_k`, and assistant prefill return 400 errors; `computer_20250124` rejected (use `computer_toolset_20260801` on the Claude API and Google Cloud, or `computer_20251124` on Bedrock); adaptive thinking on by default, thinking text omitted unless `thinking.display` is `"summarized"`.
- Max 5x subscribers get $100/month in API credits, Max 20x get $200, Team up to $500 pooled.

## Safety

Alignment evaluations show fewer misaligned behaviors and less willingness to cooperate with misuse than Haiku 4.5. Cybersecurity safeguards stricter than Haiku 4.5 but looser than Sonnet 5.5 (penetration testing blocked). Biology safeguards match Sonnet 5, Sonnet 5.5, and Opus 5.
