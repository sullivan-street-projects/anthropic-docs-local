---
title: "Claude reveals the origins of the ECDSA curve seeds"
source_url: "https://www.anthropic.com/research/ecdsa-curve-origins"
source_type: "web-extracted"
fetched_at: "2026-10-18T00:00:00Z"
category: "research"
---

# Claude reveals the origins of the ECDSA curve seeds

Anthropic Frontier Red Team, **October 16, 2026**. An internal Claude model explained where the seed values behind several NIST elliptic curves came from — a decades-old open question. The answer is mundane: a common pseudorandom number generator seeded with a Unix timestamp. **This is not a cryptographic break or weakness**; it makes backdoors *less* plausible, and there is no action for readers to take.

## Background

NIST adopted ECDSA in 2000 (FIPS 186-2) with standard curves whose coefficient `b` is defined by the hash of a published "seed." The NSA supplied these seeds without explanation, fueling long-running suspicion (summarized by Koblitz and Menezes, 2015). A leading prior explanation — a humorous passphrase attributed to NSA's Jerry Solinas (d. 2023) — was wrong.

## Method

An employee asked an internal research model to work out the seeds' generation, without the passphrase clue. In under half an hour, Claude identified the origins of P-192, P-224, P-256, P-384, and P-521. None came from a hash; each was the output of the C library's `lrand48` generator seeded with a Unix timestamp.

- **Hypothesis:** a weak 1990s PRNG whose output could be recognized.
- **Scanning:** a scanner slid bit-by-bit along each seed, testing whether adjacent chunks were consecutive generator outputs (34 generator/slice combos).
- **Key clue:** in four seeds the top bit of every 32-bit word was zero (chance probability 1/5,810), matching `lrand48` (returns the top 31 bits of a 48-bit state).
- **Binary curves:** brute-forced all 2^17 hidden-bit values; confirmed for all four seeds.
- **Prime curves:** recovered hidden state as a truncated linear congruential generator (a lattice problem solved with LLL); the pattern `lrand48() >> 23` appeared in five NIST and five ANSI X9.62 seeds.
- **Timestamps:** stepping back reached the `srand48` form; ten prime-curve seeds mapped to May 1997–April 1998, four binary-curve seeds to February 1984.

## Key findings

- Published seeds were candidate draws at a given iteration count (P-256 needed 1,842 iterations).
- Base points of six curves (P-192 and five ANSI X9.62 examples) came from the RNG in Arjen Lenstra's FreeLIP package (also used by early Victor Shoup NTL). Seeds: 20000 (P-192), 20420/20507/20509 (prime239v1–v3), 20512/20517 (prime192v2/v3).
- Base points of P-224, P-256, P-384, P-521 do not fit this recipe and remain unexplained.

## Why it matters

The seeds were produced in a simple, reproducible way, leaving far less room for hidden subversion — anyone can now regenerate them. This is **not** evidence of a weakness in the curves.

## Open questions

Some valid candidates were skipped (P-256's candidate 876; three in the P-224 run; seven in ANSI runs) for unknown reasons. The team considers deliberately weakened curves implausible. The fifth binary seed (B-163) and several base points remain unexplained.

## Bounty and credits

The $36,864 seed bounty goes to the Internet Security Research Group. Work by John Wood, Henry de Valence, Ava Howell, Zack Voase, Lucy Sweet, Amir Omidi, Paul Crowley, Iain McGinniss, Nicholas Carlini, and Steve Weis; posthumous recognition of Jerry Solinas; thanks to Filippo Valsorda. Reproduction code (CC0) regenerates the prime and binary seeds and six base points.
