---
title: "Investigating vault particles with Claude"
source_url: "https://www.anthropic.com/research/investigating-vault-particles-with-claude"
source_type: "web-extracted"
fetched_at: "2026-11-08T00:00:00Z"
category: "research"
---

# Investigating vault particles with Claude

Anthropic, **November 4, 2026** (Athukoralage, Yoon, Perry, Durrant, and the Life Sciences Team; a preprint is on bioRxiv). Vault particles are large, hollow protein shells in eukaryotic cells, discovered in 1986, whose function remains unknown. The team reports the **first 3D structure of a vault from a prokaryote** — a bacteriophage protein called **L05** — and shows many prokaryotic and phage vault proteins can self-assemble.

## Key findings

- The L05 vault is built from **96 copies** (48 per half) of one protein, about **9.5 megadaltons**; mammalian vaults have 78 copies.
- Shorter and wider than mammalian vaults (**~54 × 45 nm** vs. 67 × 40 nm), enclosing about **25% more volume**; its wall has 7 repeating segments instead of 9.
- Of 15 altered versions, single changes near the cap stopped the shell from closing (open, rosette-like particles). Duplicating two wall segments to give nine yielded larger vaults with ~20% more volume.
- An unidentified small molecule sits in a pocket on each copy; Claude noted a resemblance to coenzyme A (unconfirmed).

## Methods

- Claude searched a database of ~**15 billion predicted proteins**; vault relatives appeared in 29 bacterial and 4 archaeal phyla, in under 1% of sequenced species.
- 44 candidates tested in a cell-free system; **15 of 24** gave soluble protein in *E. coli*. An optimized size-exclusion method took ~**90 minutes** vs. a conventional ~3-day spin (Claude initially argued against it).
- **7 of 15** proteins formed vault-like particles; cryo-EM confirmed four. RELION processing: a first model took 34 hours, final maps ~1 week.

## Limitations

Vaults formed only in *E. coli*; natural-host formation and biological function are untested. Claude's errors included a protocol additive that blocked DNA uptake (~2 weeks lost) and a skipped cryo-EM step producing a flawed, mirror-blended map. The team is releasing the structures and data; consultant Dr. Leonard Rome noted vault function "is still enormously challenging."
