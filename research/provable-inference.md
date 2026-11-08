---
title: "Progress on provable inference for large language models"
source_url: "https://www.anthropic.com/research/provable-inference"
source_type: "web-extracted"
fetched_at: "2026-11-08T00:00:00Z"
category: "research"
---

# Progress on provable inference for large language models

Anthropic (Frontier Red Team; Rinberg, Allain, and collaborators from EPFL, MIT, StarkWare, and the Anthropic Fellows/STEM programs), **November 2, 2026**. Labeled "intermediate progress, and not a completed research agenda."

## Core problem

Users generally cannot verify which model produced a response. **Provable inference** uses zkSNARKs so a provider commits to a model and then proves each response came from that model, without revealing the weights.

## System: FlashProve

- **Offline phase:** the prover publishes a short commitment to the model weights (~39 min setup, good for ~16M requests).
- **Online phase:** for each request, it proves the committed model produced the output tokens.
- **Target model:** Llama 4 Maverick, a **400B-parameter** MoE, using public 4-bit weights.

## Key results (single H100, 24 CPU cores)

- **Prover throughput:** ~**110 tokens/second**; a batch of 24 requests took ~223s.
- **Proof size:** ~**18.78 MB** per proof (~19 MB per 1,024-token request).
- **Overhead:** ~**72x** the GPU time of vLLM (66x–77x; up to ~94x at highest load).
- **Verifier:** ~17s on 24 threads (CPU), plus ~6.5 MB for the commitment.

## Security framing

Three properties — **completeness, soundness, zero knowledge** — are stated in Lean and proven in the random oracle model. The fast C++ verifier is for daily use but carries no formal guarantee; the Lean verifier is slower but formally checked.

## Limitations and release

The proof covers an integer version of the weights under greedy decoding (not floating-point or sampled output); the architecture is not hidden, only the weights; context is limited to 1,024 tokens; side-channels are out of scope. Code, Lean proofs, a spec, and a technical report are released under **Apache 2.0**.
