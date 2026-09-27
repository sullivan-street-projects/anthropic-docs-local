---
title: "Project Swap: What Happens When Agents Trade for Us?"
source_url: "https://www.anthropic.com/research/project-swap"
source_type: "web-extracted"
fetched_at: "2026-09-27T00:00:00Z"
category: "research"
---

# Project Swap: What Happens When Agents Trade for Us?

Published **September 24, 2026**. A controlled experiment on how Claude-powered agents negotiate and trade on people's behalf, building on the earlier Project Deal with a more measurable book-exchange marketplace.

## The question

Many mutually beneficial trades never happen because finding counterparties and negotiating takes too much time and effort. Could AI agents operating continuously on our behalf unlock those trades?

## Design

- **201 Anthropic employees** across six offices each brought a book to give away and had a brief chat with Claude about their reading preferences.
- Agents met on a "trading floor" and swapped books through negotiation.
- Participants independently ranked 10 books, letting researchers score preference understanding and market efficiency.
- **205+ market iterations** varied the model (Haiku, Sonnet, Opus, Fable), agent instructions ("ruthless" vs. "prosocial"), and market composition; decentralized negotiation was compared against centralized optima (utilitarian, Top Trading Cycles).

## Key findings

- **Preference understanding:** Claude reached **61% pairwise agreement** with participants' actual rankings from a ~5-minute conversation. Longer intake (~300 vs. ~150 words) predicted ~4 points improvement.
- **Market performance:** Participants received books ranked ~5th choice (0.55 efficiency) vs. an optimal ~2nd choice (0.89). The shortfall decomposed into **85% preference misunderstanding, only 15% agent bargaining**.
- **Model matters more than instructions:** Opus agents hit 0.88 efficiency vs. Haiku's 0.75; "ruthless" vs. "prosocial" instructions differed by only 0.02.
- **Satisfaction:** 7.2/10 average; participants would delegate ~30% of their annual book budget to an agent (~75% of what they'd trust a knowledgeable friend with).
- **Information disclosure:** Agents disclosed their top preference 78–96% of the time and almost never lied about it (~1%), keeping deeper preferences private.

## Safety and governance implications

- **Fiduciary/representation quality** fundamentally constrains outcomes — agents acting on someone's behalf need verification mechanisms, analogous to robo-advisor disclosure rules.
- **Market rules** must address failed deals and missing goods (eBay-style guarantees vs. Craigslist buyer-beware).
- **Agent registration systems** with IDs (like aircraft tail numbers) tracking the model and safety standards met, potentially combined with privacy-preserving "personhood credentials."
- **Rate limiting + transparency:** agents don't tire, so markets need friction against spam while preserving observability of agent actions.

## Limitations

Participants were Anthropic employees (biased toward trusting Claude); no financial incentives (noisy rankings); all agents were well-behaved Claude variants (no adversaries); fixed market rules. The dominant lesson: improving preference understanding matters more than negotiation tactics.
