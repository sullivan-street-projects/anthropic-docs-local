---
title: "Claude Fable 5.2 and Claude Mythos 5.2"
source_url: "https://www.anthropic.com/claude-fable-and-mythos-5-2"
source_type: "web-extracted"
fetched_at: "2026-11-15T00:00:00Z"
category: "models"
published: "2026-11-09"
---

# Claude Fable 5.2 and Claude Mythos 5.2

## Overview

Claude Fable 5.2 (`claude-fable-5-2`) and Claude Mythos 5.2 (`claude-mythos-5-2`) launched November 9, 2026, built for demanding reasoning and long-horizon agentic work. They succeed Claude Fable 5.1 and Claude Mythos 5.1, which move to legacy. The two models share the same underlying capabilities under different safeguard tiers: Fable 5.2 is generally available, while Mythos 5.2 is restricted to organizations verified through Anthropic's verification programs (such as the Cyber Verification Program).

For most workloads, start with the latest Claude Opus model and move to Claude Fable 5.2 when your evals on a Claude Opus model at higher effort still fall short.

## Shared Specs

- **Context window / output:** 1M-token context window (default and maximum), 128K max output tokens.
- **Thinking:** adaptive thinking is always on; use the `effort` parameter to control thinking depth (defaults to `high`).
- **Tokenizer:** the tokenizer introduced with Claude Opus 4.7 (the same text produces roughly 30% more tokens than pre-4.7 models).

## Pricing & Accessibility

- **Input:** $8 / MTok; **Output:** $40 / MTok — down from Claude Fable 5.1 and Claude Mythos 5.1 at $10 / $50.
- **Prompt cache reads:** 2.5% of the base input price ($0.20 / MTok).
- **Fast mode:** available for Claude Fable 5.2 on the Claude API Messages API — up to 2.5x higher output tokens per second at $16 / input MTok and $80 / output MTok via `speed: "fast"` (no beta header).
- **Data retention:** both models require 30-day data retention (like Fable/Mythos 5.1) and are not available under zero data retention unless expressly authorized by Anthropic.

## Breaking Changes vs. Claude Fable 5.1

Four changes can break existing code:

1. **Failed prefix checks return a 400 error.** On Fable 5.2 / Mythos 5.2 the prefix check is enforced for every account regardless of age. If code changes the `system` prompt, `tools`, or an earlier message and then returns a later-turn thinking block, the request fails with `The block is bound to a different conversation`. The `thinking-binding-controls-2026-08-01` beta header with `prefix_mismatch_behavior: "drop_block"` is a stopgap.
2. **Thinking blocks are tied to the model that produced them.** Only Fable 5.2 and Mythos 5.2 read Fable 5.2 thinking blocks (plus, on the Claude API and Google-managed Google Cloud, blocks from Opus 5.5, Sonnet 5.5, Haiku 5.5, Fable 5.1, Mythos 5.1, and earlier models). Moving a conversation off the pair to any other model drops their reasoning for those turns.
3. **`computer_20251124` is not supported.** Computer use requires the `computer_toolset_20260801` toolset; the earlier tool returns a 400 error on every platform except Amazon Bedrock.
4. **Advisor tool pairing.** With the beta advisor tool, a Fable/Mythos 5.2 executor accepts only a Fable/Mythos 5.2 advisor; any other advisor returns a 400 error.

## Access Programs

Claude Mythos 5.2 is available only to organizations verified through Anthropic's verification programs, including the [Cyber Verification Program](https://support.claude.com/en/articles/14604842) for defensive security professionals. It continues the invitation-only Project Glasswing line for defensive cybersecurity workflows; there is no self-serve sign-up.

## Availability

Claude Fable 5.2 is available on the Claude API, Amazon Bedrock, Claude Platform on AWS, Claude Models on Google Cloud (both Anthropic-managed and Google-managed), and Claude in Microsoft Foundry. On Bedrock it uses the `global.anthropic.claude-fable-5-2` model ID. Dreams (research preview) now supports Fable 5.2.

See [What's new in Claude Fable 5.2](https://platform.claude.com/docs/en/models/fable-5-2/whats-new-fable-5-2) for full API changes and migration guidance.
