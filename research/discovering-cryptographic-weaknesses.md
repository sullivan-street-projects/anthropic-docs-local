---
title: "Discovering cryptographic weaknesses with Claude"
source_url: "https://www.anthropic.com/research/discovering-cryptographic-weaknesses"
source_type: "web-extracted"
fetched_at: "2026-09-06T00:00:00Z"
category: "research"
published: "2026-07-28"
---

# Discovering cryptographic weaknesses with Claude

## Overview

Anthropic researchers using Claude Mythos Preview discovered mathematical flaws within cryptographic algorithms themselves—a significant advance beyond finding implementation errors. The research produced two major findings: an improved attack on HAWK (a post-quantum digital signature scheme) and a novel attack on reduced-round AES.

## Key Findings

### HAWK Attack

Claude identified a previously unexploited symmetry (a nontrivial automorphism) in the lattice structure used by HAWK, effectively halving its key strength. The attack reduces the effective keysize by a factor of two—for example, lowering HAWK-256's expected attack cost from 2⁶⁴ to 2³⁸. This discovery occurred within 60 hours of autonomous work, though the full development process cost approximately $100,000 in API costs.

**Impact:** HAWK is only a candidate scheme under NIST's Post-Quantum Cryptography standardization process, so no production systems are affected. The finding demonstrates AI's potential to stress-test cryptographic standards before deployment.

### AES Attack

Claude developed an improved meet-in-the-middle attack on 7-round AES (out of the full 10 rounds) using a novel fingerprinting algorithm termed the "Möbius Bridge." This technique reduced computational requirements by 200-800×, eliminating one guess an attacker would need to make.

**Impact:** The attack operates under chosen plaintext assumptions requiring 2¹⁰⁵ plaintexts—completely impractical. It does not compromise the full 10-round AES cipher or any production systems.

## Research Methodology

**HAWK:** One researcher worked semi-autonomously with Claude using a multi-agent framework with Python and Sage computational tools. The discovery process involved literature review, mathematical reasoning, and computational verification.

**AES:** Claude worked almost entirely autonomously after researchers built a scaffold enabling hypothesis generation and experimental validation. Initial resistance required prompting Claude to pursue novel rather than obvious approaches. The model produced several hundred million tokens over three days before discovering the key insight. Researchers subsequently spent several hundred hours validating the cryptographic claims.

## Additional Discoveries

Researchers identified other preliminary improvements including:

- A practical 13-round LEA attack requiring under 2³⁰ encrypted plaintexts (versus 2⁹⁸ previously)
- A 6-round Serpent-128 key-recovery attack
- Limited improvements on Salsa20, Poseidon, and SHA-1

## Responsible Disclosure

Anthropic followed established protocols, consulting academics, sharing findings with HAWK's authors in June, and coordinating public disclosure via NIST mailing lists simultaneously with publication.

## Broader Implications

The research suggests language models may soon encounter similar bottlenecks in cryptography as in cybersecurity: producing discoveries faster than human researchers can validate them. Anthropic partnered with ETH Zurich, Tel Aviv University, and TU Berlin to develop CryptanalysisBench, a benchmark for evaluating LLM cryptanalytic capabilities.

The authors emphasize that these results align with cryptography's established peer-review model—intentional stress-testing strengthens security. However, they acknowledge that as LLM capabilities accelerate, the field should prepare protocols for scenarios where language models discover vulnerabilities affecting deployed systems.
