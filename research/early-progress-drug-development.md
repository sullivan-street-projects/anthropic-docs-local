---
title: "Early progress on accelerating drug development with Claude"
source_url: "https://www.anthropic.com/research/early-progress-drug-development"
source_type: "web-extracted"
fetched_at: "2026-11-16T00:00:00Z"
category: "research"
---

# Early progress on accelerating drug development with Claude

- **Published:** October 27, 2026
- **Team:** Science (Anthropic life sciences team)
- **Topics:** Life sciences, Partnerships, Healthcare, Discovery, Beneficial Deployments

## Introduction

- Over several months, Anthropic scientists ran in-depth research partnerships with six drug developers: **BigHat Biosciences, Bristol Myers Squibb, Divergence Labs, Enveda, Generate Biomedicines, and The Column Group**. Anthropic also started its own drug discovery work.
- The article argues that AI can speed up many parts of drug development, not only molecule design. Examples include target identification, manufacturing optimization, regulatory filings, and trial design.
- Bottlenecks are spread across the whole pipeline, so the best way to find them is to work on real drug programs.
- **Goals:** improve Anthropic's models, provide case studies for the life sciences community, and potentially produce effective new medicines.

## Case studies

### Generate Biomedicines: modality engineering

- **Goal:** Make CAR T-cell therapy, which has mainly treated blood cancers, work for solid tumors by shortening part of its genetic instructions.
- Six scientists used Claude Code to propose designs. One design was about **70% shorter** than the standard version.
- In lab tests, it let immune cells make **~10x as many receptors**, killed tumor cells more efficiently, and stayed active longer.

### Divergence Labs: hit generation

- **Goal:** A food allergy treatment that detaches IgE from immune cells, rather than only neutralizing circulating IgE. This requires a two-arm design.
- Claude turned the goals into a design plan, then largely autonomously generated **~35,000 antibody designs in about one month**.
- Early tests found **3 designs that bind IgE** and **20 that dislodge it**. Three of those 20 dislodged IgE better than the standard medication.
- **Next step:** Combine the two arms into a single drug.

### BigHat Biosciences: lead optimization

- **Goal:** Improve two antibody-fragment leads for binding strength, manufacturing stability, and resistance to clumping (aggregation).
- Claude was connected to BigHat's lab data system (Reccy) and proposed changes. BigHat's lab made and tested **~1,010 variants in ~10 weeks**.
- Midway through, the team suspected the standard heat-stability and clumping metrics were misleading. Claude and an Anthropic researcher reanalyzed the raw data and proposed new metrics and a protocol change.
- **Results vs. the original leads:**
  - Best variants bound **more than 10x more tightly**
  - One stayed in solution at temperatures **18°C higher**
  - The other clumped **more than 100x more slowly**

### Enveda: manufacturing and regulatory filings

- **Problem:** Manufacturing chemists spent up to **75%** of their time on documentation.
- Enveda connected its manufacturing documents to Claude, which flags possible issues.
- On **1,061 pages** of documentation, Claude caught **all 11 issues** found by human reviewers and flagged **7 more** they had missed.
- Human review time fell **89%**, from over 25 hours to under 3.
- Claude drafted two regulatory documents. One took **4 hours** versus about **3 months** by hand. The other had one minor error, which standard human review caught.

### The Column Group (TCG): company creation

- **Problem:** Investors favor safer, validated ideas over riskier ones, partly because drug discovery is slow, expensive, and failure-prone.
- TCG is establishing **Pleiades**, a company that will use Claude to run more drug programs, and more complex ones, than a small team usually could.
- Pleiades' first Claude skill helps assess whether drug targets are worth pursuing. It was evaluated on **45 target–disease pairs**.

### Bristol Myers Squibb (BMS): clinical trial planning

- BMS uses Claude to assess development plans for an early-stage drug and to estimate the likelihood of trial success.
- BMS plans to expand the work in **2027** to raise the probability of success in early development.
- Michael Pourdehnad, MD (BMS) said Claude produced a robust initial analysis from a single prompt, work that would otherwise take days.

### Mithril Medicine (acquired by Anthropic)

- Mithril was a one-person company developing treatments for two rare forms of muscular dystrophy.
- Founder Cody Tranbarger used Claude to coordinate contracts, logistics, and experiments with **11 external labs**, and delegated much of the operational work to it.
- One candidate treatment went from idea to promising mouse results in **under 18 months**.
- Tranbarger now works at Anthropic. If the candidates hold up, a drug could be ready for human trials as early as **late 2028**.

## Extending our work in the life sciences

- The work so far is early and mostly preclinical. Anthropic plans to extend Claude into clinical trials and to partner with organizations already at the clinical stage.
- Anthropic aims to make its models widely available to the field through:
  - **Claude Science**, an AI workbench for researchers
  - **Claude credits** for life scientists
  - The **Life Sciences Verification Program**, which gives trusted organizations more permissive safeguards for legitimate biological research
  - An **open call for guest investigators**, seeking proposals on drug discovery and related questions
- Drug development organizations are invited to get in touch via a form.
