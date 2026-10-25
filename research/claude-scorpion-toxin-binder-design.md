---
title: "How Claude designed protein binders against scorpion neurotoxins"
source_url: "https://www.anthropic.com/research/claude-scorpion-toxin-binder-design"
source_type: "web-extracted"
fetched_at: "2026-10-25T00:00:00Z"
category: "research"
---

# How Claude designed protein binders against scorpion neurotoxins

Anthropic, **October 20, 2026**. Anthropic asked an internal research model, working within **Claude Science**, to design **minibinders** (small proteins that bind tightly to a target) against scorpion neurotoxins, with the goal of supporting future **antivenom** development.

## The problem

Scorpion stings cause over **3,250 deaths a year**, mostly among children with limited access to care, yet the field receives little investment. The prompt was developed with **Citrini Research** and refined through four follow-ups.

## What Claude did

Claude worked for about **64 hours**, mostly autonomously, targeting **five neurotoxins** from four regions at their sodium-channel binding sites. It selected the protein structures and binding hotspots itself, used **12 design tools** to generate **318,484 designs**, and screened over **553,000 design–toxin pairs**. Anthropic added 31 designs to Claude's 180 for a total of **211**, which **Adaptyv Bio** and **Twist Bioscience** tested for binding using surface plasmon resonance.

## Results

**17 designs** met the criteria: 7 bound Cn2, 4 bound AaH II, 4 bound AaH I, and 2 bound LqhIII; none of the multitoxin designs qualified. The two strongest Cn2 binders, **Cn2-B1** and **Cn2-B2**, bound with **single-digit nanomolar affinity** and appear to compete with an antibody known to neutralize Cn2 in mice.

## Caveats and significance

The results have **not** been tested for neutralization in cells or animals, so Anthropic does not claim to have produced an antivenom. Outside experts **Susana Vázquez Torres** and **Timothy P. Jenkins** described the work as a "promising first step." The study suggests AI could speed up early binder discovery for neglected diseases, though turning binders into safe, affordable drugs remains the main challenge. Anthropic has **released all 211 designs and their data** to the research community.
