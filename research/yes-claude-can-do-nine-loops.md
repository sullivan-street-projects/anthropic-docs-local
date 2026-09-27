---
title: "Yes, Claude Can Do Nine Loops"
source_url: "https://www.anthropic.com/research/yes-claude-can-do-nine-loops"
source_type: "web-extracted"
fetched_at: "2026-09-27T00:00:00Z"
category: "research"
---

# Yes, Claude Can Do Nine Loops

Published **September 25, 2026**. Claude computed a nine-loop scattering amplitude in theoretical particle physics — a frontier "amplitudeology" calculation — largely autonomously.

## What "nine loops" means

Loops measure the complexity of scattering-amplitude calculations that predict subatomic particle behavior; each additional loop sharply increases computational difficulty. Physicist **Matt von Hippel** issued a public challenge in **August 2026** asking AI companies to solve either "N=8 supergravity to seven loops" or "N=4 super Yang-Mills to nine loops" using typical academic compute.

## What Claude did

Anthropic's team (**Liam Fitzpatrick and Siddharth Mishra-Sharma**) targeted **N=4 super Yang-Mills at nine loops** — a "toy model" for testing calculation techniques.

- **Model/tooling:** Claude Fable 5.1 within Claude Science, given a simple prompt and told to continue working with periodic updates.
- **Two methods:** the original bootstrap technique and an indirect form-factor approach.
- **Cost:** ~$1,000–2,000 total; the bootstrap method alone ~$100 (≈96 CPUs for one week) — very efficient for frontier physics.
- **Autonomy:** completed the "finicky, messy calculation" without external scientific oversight or human debugging.
- **Verification:** Lance Dixon independently verified the result, noting Claude "executed all of the steps in the complicated recipe" and presented findings in established formats.

## Timeline

- **Aug 2026:** von Hippel's challenge posted.
- **Late Aug 2026:** Anthropic's team reported their nine-loop result.
- **Within ~2 weeks:** Song He's group (Chinese Academy of Sciences) independently obtained most of the result using GPT-6 assistance.

## Takeaways

Von Hippel's reflections: experts had **underestimated what was computationally feasible** (more low-hanging fruit than assumed); the win may reflect **superior software engineering** more than novel physics; Claude showed it can handle **complex, error-prone calculations reliably and autonomously**; and the trajectory has "genuinely gotten better" since March 2026 work that needed heavy hand-holding. He cautions the result scaled existing methods rather than inventing new ones, so it says little about longer-term capability or risk.
