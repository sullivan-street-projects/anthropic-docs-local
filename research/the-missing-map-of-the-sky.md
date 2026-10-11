---
title: "The missing map of the sky"
source_url: "https://www.anthropic.com/research/the-missing-map-of-the-sky"
source_type: "web-extracted"
fetched_at: "2026-10-11T00:00:00Z"
category: "research"
---

# The missing map of the sky

Anthropic, **October 8, 2026**. Guest work by Brice Ménard (Johns Hopkins astrophysicist; Anthropic researcher).

- Ménard and Claude Science produced "the first complete map of the sky in UV light," combining far-UV (154 nm) and near-UV (232 nm) data. ~1/3 of the map (incl. much of the galactic plane) was predicted rather than measured; each pixel labeled "measured" or "predicted" with uncertainty.
- No complete UV map existed (atmosphere absorbs UV). NASA's GALEX (2003–2013) imaged ~2/3 of the sky in ~38,000 observations, skipping bright-star regions including the Milky Way plane.
- Claude used **inpainting** — learning how UV brightness relates to visible/IR/radio observations, then applying it to unobserved regions. Hidden-region tests matched real UV to within ~10%. UV from 100M+ stars (ESA Gaia) was added on top.
- Project took several days and a dozen+ versions; Claude coordinated many parallel agents for cleaning, calibration, and merging.

**Takeaways:** Error detection matters (faint atmospheric-glow artifacts slipped past two review rounds, then Claude corrected all 38,000 observations in hours once flagged); human oversight still drives the work; deferred projects become feasible; the map is intended as a teaching tool.
