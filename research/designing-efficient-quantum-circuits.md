---
title: "Designing more efficient quantum circuits with Claude"
source_url: "https://www.anthropic.com/research/designing-efficient-quantum-circuits"
source_type: "web-extracted"
fetched_at: "2026-10-18T00:00:00Z"
category: "research"
---

# Designing more efficient quantum circuits with Claude

Anthropic Science team, **October 16, 2026**. Led by Andi Gu (Anthropic STEM Fellows Program) with Alek Kemeny, and in collaboration with Susanne Yelin (Harvard) and Mikhail Lukin (Harvard / QuEra). Claude designed quantum circuits that improve on the best published versions, arguing that cheaper circuits bring useful quantum computers closer.

## Why circuit design matters

Current quantum computers have hundreds to thousands of fragile qubits — too few for many promising algorithms. Reducing the qubits and gates an algorithm needs is therefore central. Example: the FeMoco iron-sulfur cluster's ground-state energy estimate fell from ~50 trillion Toffoli gates (2017) to ~340 million through better circuit design — a ~150,000× reduction, most of it algorithmic rather than hardware.

## Method

Circuit design suits Claude's strengths: circuits are code; many quantum algorithms can be checked for correctness (each input yields one definite output); and progress is objectively scored (qubits × gates as a runtime proxy). Claude worked in a closed loop — propose a design, an evaluator scores it, Claude revises — with no human input between rounds. Across eight computational primitives (chemistry, optimization, simulation, number theory, numerical computing), Claude found designs using fewer qubits and gates than the best published algorithms.

## Key result 1: point addition / modular inversion

Point addition is the core operation in quantum attacks on the elliptic-curve discrete logarithm problem; its main cost is modular inversion (classically done via "divsteps"). Divsteps had been impractical as a quantum circuit because it must store a long history of branch decisions. Claude's insight: the history can be reconstructed from the numbers themselves after each step, letting the circuit run backward with no extra storage. It derived the decoding rule mathematically, verified it with large-scale simulation, and formalized the claim in Lean — the first reversible divsteps implementation with no stored branch history. Varying the store-vs-decode threshold produced a family of designs; one uses 12% more qubits than the smallest prior design but 17× fewer gates, extending the Pareto frontier. Completed in a single **53-hour run**.

## Key result 2: faster decoder for an optimization algorithm

Decoded quantum interferometry (DQI) is a leading candidate for a superpolynomial speedup on optimization; its costliest step is Reed-Solomon decoding. Claude replaced the extended Euclidean algorithm with Berlekamp-Massey decoding (same steps every round, suits a fixed gate sequence), then reconstructed most temporary values instead of storing them. Simulations over 403 million sample decodings showed a single saved value (19 qubits) was almost always enough (failure rate ~1 in 10,000, within tolerance); a naive reversible version would have needed up to 840 qubits. Net: **12× fewer gates** than Google's prior construction.

## What the authors learned

A reduction that took many groups eight years (FeMoco) compares to Claude's single-run elliptic-curve design. Limitations: Claude was conservative, re-checking sound results, and favored familiar methods; the researchers countered by requiring several parallel approaches and prompting broader search. They suggest AI-driven co-design of error correction, decoding, and hardware, and clarifying which hardware capabilities matter most for applications like catalyst and materials design.
