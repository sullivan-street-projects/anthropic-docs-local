---
title: "Formalizing Fermat's Last Theorem"
source_url: "https://www.anthropic.com/research/formalizing-fermats-last-theorem"
source_type: "web-extracted"
fetched_at: "2026-09-06T00:00:00Z"
category: "research"
published: "2026-09-04"
---

# Formalizing Fermat's Last Theorem

## Overview

Anthropic researchers announced the first complete computer-verified proof of Fermat's Last Theorem, formalized in the Lean programming language. Claude, working largely autonomously over 11 days, produced this landmark achievement, representing a significant advancement in AI-assisted mathematical formalization.

## Key Findings

- Claude generated 13 million lines of Lean code and proved 29,500 intermediate theorems to complete the formalization.
- The proof consumed approximately six billion output tokens from a general-purpose research model.
- The completed proof was verified by Lean using only its three standard axioms.
- This is the largest Lean proof ever constructed—over five times the size of Mathlib, the principal community mathematical library.

## Background: The Original Problem

Pierre de Fermat claimed around 1637 that no positive integers satisfy aⁿ + bⁿ = cⁿ for any n > 2. Andrew Wiles provided the first correct proof in 1995 after 129 pages of work that took months to verify. The theorem eluded proof for over 350 years, generating 621 incorrect attempts in its first year alone after a prize was announced.

## Methodology

The formalization succeeded through several key innovations:

### Prove2Me Platform

Researchers used an open collaborative platform that:

- Maintained a directed acyclic graph organizing theorem statements
- Accelerated Lean compilation by separating theorem statements from proofs
- Enabled search and reuse through natural-language descriptions

### Multi-Agent Approach

Dozens of Claude agents collaborated on defining concepts, proving intermediate theorems, and building toward the final proof. Initial attempts failed when agents lost track of project state, but the structured approach resolved the coordination issues.

### Proof Structure

Claude's formalization followed a simplified version of Wiles's proof from Darmon, Diamond, and Taylor, requiring only occasional high-level human guidance.

## Results and Implications

Kevin Buzzard, leading the Imperial College London FLT formalization project, noted that this autoformalization achievement proves Fermat's Last Theorem with no assumptions other than the axioms of mathematics.

The achievement demonstrates that:

- Large mathematical proofs can now be formalized in far shorter timeframes than previously anticipated.
- AI-assisted formalization may catch errors in existing mathematical literature.
- Formalization could reduce the burden on peer reviewers evaluating new results.
- AI-generated mathematical results can be rigorously verified through automated proof checking.

## Broader Significance

**Verification Efficiency:** As AI produces more mathematical proofs, automatic formalization provides a pathway for efficient verification without extensive human review labor.

**Consumer-Accessible Formalization:** A parallel experiment formalizing Vinogradov's Three Primes Theorem using three personal Claude Max subscriptions took only three days, suggesting major formalization projects may become accessible through standard AI subscriptions.

**Trust in Mathematical Knowledge:** The work addresses a persistent challenge where complex proofs require years to verify. The researchers describe formalization as a place where they feel unambiguously good about the role of AI in maintaining confidence in mathematical knowledge.

**AI Mathematics Integration:** Producing formalized proofs alongside human-readable expositions may become standard practice for AI-generated mathematical contributions.

## Acknowledgments

The formalization built upon centuries of mathematical development, adapting work from the Imperial College London FLT project and incorporating contributions from the Lean and Mathlib communities.
