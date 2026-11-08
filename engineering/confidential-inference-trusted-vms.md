---
title: "Confidential Inference via Trusted Virtual Machines"
source_url: "https://www.anthropic.com/engineering/confidential-inference-trusted-vms"
source_type: "web-extracted"
fetched_at: "2026-11-08T00:00:00Z"
category: "engineering"
---

# Confidential Inference via Trusted Virtual Machines

Anthropic (Engineering team, with Pattern Labs), **June 18, 2025**. The post describes Confidential Inference — tools for processing encrypted data so it is readable only inside servers that can cryptographically prove they are trustworthy. The authors call it "just a sketch of our research to start a conversation."

## Goals

Make Anthropic's handling of sensitive data **cryptographically guaranteed**, addressing two motivations: (1) securing **model weights** against capable threat actors, and (2) proving that sensitive **user data** stays private. The core principle: data stays encrypted except at the point of processing, and attestation of software determines which code may use the encryption keys.

## Architecture

- **Cleartext touchpoints:** the API Server (tokenizes prompts, handles request logic) and the Inference Server (runs the model on accelerators). Only the Inference Server handles model weights.
- Most of the Inference Server is **untrusted** and changes often. A small trusted **"model loader and invoker"** runs on a separate hypervisor-isolated VM, presents itself as a "virtual accelerator," and accepts only programs signed by a secure CI server after multiple-engineer review.
- **Trusted environment requirements:** hardware-encrypted, isolated memory; disabled debugging features; and cryptographic proof the correct code is running. A **TPM** is the root of trust, and a keyserver releases decryption keys only to attested environments.

## Gaps, directions, and caveats

Sharing encrypted host memory with accelerators is **not yet well established**, so Anthropic currently relies on compute providers for physical datacenter and hypervisor security. Future safeguards could include egress bandwidth limits on servers holding cleartext weights and requiring a safety classifier's signature before inference. The post gives **no benchmarks or performance numbers** and urges hardware designers to build confidential computing into accelerators to shrink the trust boundary.
