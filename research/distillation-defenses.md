---
title: "Strengthening our defenses against distillation attacks"
source_url: "https://www.anthropic.com/research/distillation-defenses"
source_type: "web-extracted"
fetched_at: "2026-10-18T00:00:00Z"
category: "research"
---

# Strengthening our defenses against distillation attacks

Anthropic, **October 12, 2026**. Early evidence suggests new methods cut the data distillers harvest by roughly **90–99%**.

## What distillation attacks are

Covert, industrial-scale campaigns to copy one model's capabilities into another without authorization, often through networks of fraudulent accounts. They let companies approximate frontier capabilities at a fraction of the cost. The most valuable target is Claude's **reasoning transcripts** (the thinking written before responding) — far more useful for training a smaller model than final outputs alone.

## Why it matters

- **Safety gaps:** Distilled models can approach the frontier without comparable safeguards (bio, cyber). Cited: Zhipu reportedly distilled cyber capabilities for GLM-5.3; after Claude's safeguards degraded its attacks it reportedly switched to an older Claude model and another lab's. CAISI assessed GLM-5.3 as the most cyber-capable open-weights model released to date, with easily bypassed safeguards.
- **National security:** Distilled capabilities may reach foreign military/intelligence/surveillance systems. In one case requests to Moonshot's Kimi models were secretly forwarded to Claude; one user, believed PLA-affiliated, sought to analyze CCTV surveillance of an individual.

Anthropic acknowledges it has turned away meaningful revenue and paying traffic from distillers, and some changes required customers to update integrations.

## Earlier defenses and limits

First measure: summarizing reasoning before display. A model trained on full Opus 4.8 transcripts scored 80.4% on SWE-bench Verified vs 71.8% on summarized transcripts. Attackers shifted to active extraction (prompts asking Claude to reproduce prior reasoning verbatim — one lab tested 12,000 such requests) and proxy networks with hundreds of thousands of fraudulent accounts (one network ran 20,000+ at once).

## The new methods

1. **Controlling where reasoning can go.** "Preserved thinking" prevents new API accounts (created on/after Aug 31, 2026) from editing Claude's prior context; reasoning is no longer readable by earlier weaker-safeguard models; with Sonnet 5.5, transcripts are accessible only to the organization that produced them.
2. **Blocking/patching extraction.** A two-stage classifier (built on constitutional-classifiers research), trained on real attempts and red-teamed, is now roughly as robust as bioweapons-assistance safeguards, with a false-positive rate <0.1%. It runs on the most capable generally available models.
3. **Making repeated attempts difficult.** Persistent extractors face stricter limits then bans; since Sept 24, blocked requests are charged in low-false-positive areas like distillation.

## Results

The classifier catches all distillation techniques from Anthropic's September report on its most capable models. Extracted reasoning tokens fell by a factor of 10–100+ (sometimes too small to measure); tens of thousands of distillation-linked accounts banned, often within two hours of a campaign starting. Anthropic cautions this is a cat-and-mouse contest and it has not yet faced a highly sophisticated persistent attempt.

## Broader implications

Preventing distillation requires all frontier developers to act, since attackers can otherwise turn to less protected models. Anthropic is publishing its methods to show a workable alternative exists.
