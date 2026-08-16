---
title: "Scaling Managed Agents: Decoupling the brain from the hands"
source_url: "https://www.anthropic.com/engineering/managed-agents"
source_type: "web-extracted"
fetched_at: "2026-08-16T00:00:00Z"
category: "engineering"
published: "2026-04-08"
---

# Scaling Managed Agents: Decoupling the brain from the hands

**Publication Date:** April 8, 2026

## Overview

Managed Agents is a hosted service that separates agent components so implementations can evolve independently as models improve. It addresses the problem that "harnesses encode assumptions that go stale as models improve."

## The Problem: Pet Infrastructure

The initial coupled architecture placed all agent components in a single container, creating infrastructure problems:

- When containers failed, sessions were lost.
- Debugging was difficult without visibility into failures.
- The design assumed resources lived within the container, limiting connectivity to external infrastructure like VPCs.

## The Solution: Decoupled Architecture

The system separates three virtualized components:

- **Brain:** Claude and its harness — stateless and easily replaceable.
- **Hands:** Sandboxes and tools that perform actions.
- **Session:** An append-only log of all events — durable, in external storage.

Each operates independently through minimal interfaces, so any component can fail or be replaced without affecting the others.

## Security Improvements

By decoupling the sandbox from credential storage, untrusted code cannot access authentication tokens. Two patterns are used:

1. Bundling auth with resources during initialization.
2. Storing OAuth tokens in secure vaults accessible only through proxies.

## Context Management

Sessions function as external context objects, separate from Claude's context window. The `getEvents()` interface allows flexible querying of the event stream without making irreversible context decisions.

## Performance and Scalability Benefits

- Time-to-first-token improved ~60% (p50) and >90% (p95).
- Multiple brains can connect to multiple hands.
- Stateless harnesses scale efficiently.
- Containers provision only when needed.

## Key Takeaway

Managed Agents applies decades-old operating-system principles — virtualizing underlying components into stable abstractions — to agent infrastructure, enabling future harness evolution without breaking interfaces.
