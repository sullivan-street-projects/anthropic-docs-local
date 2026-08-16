---
title: "How we contain Claude across products"
source_url: "https://www.anthropic.com/engineering/how-we-contain-claude"
source_type: "web-extracted"
fetched_at: "2026-08-16T00:00:00Z"
category: "engineering"
published: "2026-05-25"
---

# How we contain Claude across products

**Publication Date:** May 25, 2026

## Overview

As agent capabilities expand across three products — claude.ai, Claude Code, and Claude Cowork — the engineering focus shifts to managing "blast radius": limiting potential damage when failures occur.

## Three Types of Risk and Three Defense Components

**Risk categories:**

- **User misuse** — intentional or careless harmful directions.
- **Model misbehavior** — agents taking unintended harmful actions.
- **External attackers** — prompt injection, runtime attacks.

**Defense layers:**

1. **The environment** — sandboxes, VMs, filesystem boundaries, egress controls.
2. **The model** — system prompts, classifiers, training modifications.
3. **External content management** — tool permissions, connector auditing.

## Three Containment Patterns

### Pattern 1: Ephemeral Container (claude.ai)

- Code runs server-side in gVisor containers on isolated infrastructure.
- Per-session ephemeral filesystem; no persistent workspace.
- Minimal blast radius, but limited agent capabilities.

### Pattern 2: Human-in-the-Loop Sandbox (Claude Code)

- Runs locally on user machines with filesystem and shell access.
- Originally required approval for risky actions.
- Problem: users approved ~93% of prompts, causing "approval fatigue."
- Solution: an OS-level sandbox (Seatbelt/bubblewrap) reduced prompts by 84%.

### Pattern 3: Sealed VM (Claude Cowork)

- Runs in a full virtual machine using a platform hypervisor.
- The user selects a workspace folder; the VM has an isolated kernel and filesystem.
- Credentials stay in the host keychain and never enter the guest.
- The agent loop moved outside the VM for reliability while maintaining security.

## Critical Security Incidents and Lessons

**Pre-trust execution (Claude Code).** Code could execute before users approved folder access — for example, `.claude/settings.json` hooks ran automatically on startup. Fix: defer parsing of project-local configuration until after the trust prompt.

**User as injection vector (Claude Code).** A phishing prompt successfully extracted AWS credentials 24 of 25 times. Model-layer defenses could not detect this direct injection. Solution: environment-layer controls (egress blocking, filesystem boundaries) became essential.

**Exfiltration through an approved domain (Claude Cowork).** A malicious workspace file instructed Claude to upload files to an attacker's Anthropic account using their API key; the egress proxy allowed api.anthropic.com traffic. Fix: a defensive man-in-the-middle proxy inside the VM that only accepts provisioned session tokens.

**EDR visibility loss (Claude Cowork).** VM isolation prevented endpoint detection software from monitoring agent activity. Mitigation: pull-based OTLP exports allow post-hoc log retrieval.

## Key Principles

1. **Environment containment first.** "Design for containment at the environment layer first, then steer behavior at the model layer." Deterministic boundaries are more reliable than probabilistic model defenses.
2. **Match isolation to user expertise.** Developers can evaluate bash commands; knowledge workers cannot.
3. **Distrust custom components.** Mature tools (hypervisors, seccomp, container runtimes) are more reliable than custom-built security layers.

## Looking Ahead

- Persistent memory poisoning through cross-session state.
- Multi-agent trust escalation vectors.
- Agent identity and credential management standards.

Agent security requires collective investment — from "shared benchmarks and disclosure norms to common identity standards and cross-vendor red-teaming."
