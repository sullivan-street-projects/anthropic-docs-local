---
title: "Progress on provable inference for large language models"
source_url: "https://www.anthropic.com/research/provable-inference"
source_type: "web-extracted"
fetched_at: "2026-11-16T00:00:00Z"
category: "research"
---

# Progress on provable inference for large language models

- **Published:** November 2, 2026
- **Team:** Frontier Red Team (Anthropic)
- **Authors:** Roy Rinberg (Anthropic), Alex Allain (Anthropic), Alessandro Chiesa (EPFL, StarkWare), Miranda Christ (MIT, RESI), Rahul Dalal (Anthropic STEM Fellows Program, Succinct), Giacomo Fenzi (EPFL), Ben Mayer (Anthropic Fellows Program, MIT), Guy Weissenberg (EPFL)
- **Topics:** Transparency, Cybersecurity, Global stability, Open source, Coding
- **Related:** "LLMs are making formal software verification feasible at a much larger scale" (Oct 22, 2026)

## Executive summary

- Today a user cannot verify that a response actually came from the model a provider claims to serve, rather than a substitute introduced by a routing service or an attacker.
- Cryptographic **proofs of inference** let a provider commit to a model and then prove that each response came from that model.
- The authors use a **zkSNARK** and release **FlashProve**, an open-source prototype.
- **Headline results** (Llama 4 Maverick, 400B-parameter MoE, 4-bit weights, single H100):
  - ~**110 tokens/second** prover throughput
  - ~**19 MB** proof per 1,024-token request
  - ~**70–95x** the GPU time of serving the model natively on vLLM
- **Released artifacts:** blog post, technical report, a Claude-written protocol specification, code (prover, fast C++ verifier, Lean-verified verifier), Lean proofs, and an interactive visualizer. All are under Apache 2.0.
- The work is framed as intermediate research, not a finished agenda, and others are invited to build on it.

## Introduction

- **Problem:** Users cannot confirm which model is being served. This matters to independent evaluators, to customers using third-party routers, and for detecting tampered token streams.
- **Challenge:** Model weights are private, and re-running the model to check a response is far too expensive for most users.
- **Goal of provable inference (PI):** Allow a resource-limited user to verify a response without knowing the weights.
- **Implications:** Customer trust, pacing of AI development, and AI regulation.
- **Two aims of the work:** Accelerate PI research, and show that zkSNARKs are practical for PI.

## Trust challenges in AI proliferation

The post frames PI as a tool for four challenges:

1. **Pacing:** Regulators could verify that hardware is serving inference rather than training. The authors note this alone does not prove the hardware is not also training on the side.
2. **Tamper detection:** Proofs bound to a weight commitment would expose compromised servers or models that substitute themselves. The post references the Frontier Safety Roadmap goal of a provable inference prototype by September 30, 2026.
3. **Text provenance:** Proofs could show that a claimed model actually processed a given input. One example is a "Proof-of-Failure" showing a model spent a given token budget without finding bugs.
4. **Model approval:** Regulators could require proofs that only approved models are served.

**Trusted hardware vs. cryptography:** Trusted execution environments rely on the hardware. This approach is software-only and rests on computational hardness, so an adversary who controls the hardware or OS still cannot forge a valid proof. The authors see the two approaches as complementary.

## Our system: FlashProve

**Parties:** A prover (the model provider) and a verifier (the user).

**Phases:**
- **Offline:** The prover publishes a short commitment to the weights. The weights remain hidden.
- **Online:** For each request, the prover produces a proof that the committed model maps the given prompt to the given output tokens.

**Guarantees:**
- **Completeness:** Honest proofs are accepted.
- **Soundness:** Forging a valid proof of a false statement is computationally infeasible.
- **Zero-knowledge:** The proof reveals nothing about the weights, intermediate values, or which experts were activated. The architecture is *not* hidden.
- **Succinctness:** A ~19 MB proof is checked in seconds on a 24-core CPU.

### Evaluation

Llama 4 Maverick, ~17B active parameters per token, 4-bit weights:

| Metric | Result |
|---|---|
| Offline phase | ~39 minutes, once per model |
| Commitment lifetime | ~16 million requests, then recommit |
| Online phase (batch of 24) | ~223 s, about 110 tokens/s |
| Proof size | ~18.78 MB |
| Client download | ~6.5 MB commitment plus one proof per request |
| Verification time | ~17 s on 24 threads; ~21 s single-threaded |
| Overhead vs. vLLM (FP8, 8x H100) | ~72x per GPU (range 66–77); ~94x at the highest load tested |

### Mechanism

- A zkSNARK built by compiling an interactive oracle proof (IOP) into a cryptographic proof using hash functions. The authors say it offers post-quantum security.
- The IOP uses code proximity tests with linear constraints and lookup arguments.

### Engineering choices

- Prover work scales with the ~17B active parameters, not the full 400B.
- Requests are proved in batches after the fact, so the weight commitment is opened once per batch.
- The design fits on a single 80 GB GPU, streaming weights from ~290 GB of host memory.

### Post-hoc vs. in-line proving

The system proves after the fact (post hoc), possibly for a subset of tokens or requests. This avoids the security/efficiency tradeoff of in-line proving, but it adds recomputation complexity, delay, and non-determinism issues.

## Trustworthiness from formal verification

- The protocol and its security properties (completeness, soundness, zero-knowledge) are specified and proved in **Lean**, in the random oracle model.
- **Remaining trust gaps:**
  - **Statements** must be audited manually. An interactive visualizer is provided to help with this.
  - **Executable code** must match the formal protocol. How this is audited depends on the property:
    - *Soundness* depends only on the verifier. A Lean verifier is provided. The faster C++ verifier is used in practice; it has no formal guarantee but agreed with the Lean verifier on all tests.
    - *Completeness* is checked by running honest prover outputs through the Lean verifier.
    - *Zero-knowledge* depends only on the prover. Running a Lean prover is impractical, so providers are expected to audit it themselves.

## Prior work

The post traces the progress of zkML:

| Work | Model / task | Speed |
|---|---|---|
| SafetyNets (2017) | Small CNN, speech model | Early baseline |
| zkCNN (2021) | VGG-16 (15M params) | 88.3 s per proof |
| ZKML GPT-2 | GPT-2 (117M params) | ~159 s/token (~0.006 tok/s) |
| EZKL (2023) | 1M-param transformer | ~966 s/token |
| zkLLM (2024) | LLaMA-2-13B | ~2.5 tok/s (batched) |
| zkGPT (2025) | GPT-2 | ~0.05 tok/s |
| zkPyTorch (2025) | Llama-3 8B | ~0.007 tok/s |
| ZKTorch (2025) | GPT-J (6B) | ~0.001 tok/s |
| VerInf | Llama 4 Maverick | ~0.02 tok/s (14.3 h per 1,000 tokens on DGX Spark; 93.6 GB proof) |
| DeepProve | GPT-2 / Gemma 3 | ~2.9 / ~1.4 tok/s (31 tok/s distributed) |
| SASH prover (2026) | Llama 3.1 8B, one H100 | ~1.25 tok/s |
| Attestable (commercial) | Gemma 4 31B, one H100 | 53–77 tok/s (not open source) |
| **FlashProve** | **Llama 4 Maverick** | **~110 tok/s, one H100, ~19 MB proofs** |

**Conclusion:** Overhead relative to native computation is now about two orders of magnitude, much lower than previously expected. The authors expect the techniques to transfer to other models.

## Limitations

- **No formal guarantee on the fast code:** The Lean protocol, the paper, and the fast executable code were derived from one another, but they are not guaranteed to match.
- **Integer model under greedy decoding:** Proofs cover an exact integer version of the model. Floating-point or sampled outputs may diverge at some position. The authors found the difference empirically small, but it is not guaranteed for adversarial prompts.
- **Architecture not hidden:** The system assumes an MoE architecture and exploits its structure. Hiding the architecture is future work.
- **Side channels out of scope:** Timing or other side channels could leak information about the weights.
- **Short context:** Proofs cover up to 1,024 tokens, far below typical chat and frontier context lengths.

## Footnotes (summarized)

1. The Llama 4 Maverick weights are not redistributed. Users download them from Hugging Face under Meta's license. The shared artifacts include commitment IDs, checksums, performance numbers, and parameter settings.
2. What is hidden depends on the design. The current system hides the weights but not the architecture.
3. An October 19, 2026 update renamed the Frontier Safety Roadmap goal from "provable inference" to "inference verification," because "provable inference" implies a narrower approach. A separate Anthropic prototype signs inference traffic and recomputes inference on a trusted server.
4. The model's architecture is not hidden in this release.
