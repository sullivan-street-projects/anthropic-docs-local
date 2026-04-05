---
title: "Building a C Compiler with a Team of Parallel Claudes"
source_url: "https://www.anthropic.com/engineering/building-c-compiler"
source_type: "web-extracted"
fetched_at: "2026-04-05T00:00:00Z"
category: "engineering"
---

# Building a C Compiler with a Team of Parallel Claudes

**Published:** February 5, 2026

## Overview

Anthropic researcher Nicholas Carlini describes an experimental approach called "agent teams," where multiple Claude instances work simultaneously on shared codebases without human intervention. The team tasked 16 Claude Opus 4.6 agents with building a Rust-based C compiler from scratch, capable of compiling the Linux kernel across x86, ARM, and RISC-V architectures.

## Key Results

- **Scope:** 100,000-line compiler produced over nearly 2,000 Claude Code sessions
- **Cost:** Approximately $20,000 in API expenses
- **Capabilities:** Can build bootable Linux 6.9, compile QEMU, FFmpeg, SQLite, PostgreSQL, and Redis
- **Test Performance:** 99% pass rate on GCC torture test suites
- **Demonstration:** Successfully compiles and runs Doom

## Technical Architecture

### Enabling Long-Running Autonomous Agents

Carlini created a simple loop structure that keeps Claude continuously working: "when it finishes one task, it immediately picks up the next." The system uses a bash loop running Claude with a persistent agent prompt, allowing sustained autonomous progress without requiring human operators to remain available.

### Parallel Agent Implementation

The system uses Docker containers with git-based synchronization. Each agent:
- Works in isolated `/workspace` directories
- Synchronizes with an upstream repository
- Uses file-based locking to prevent duplicate work
- Automatically resolves merge conflicts

## Critical Design Principles

### Testing Quality
"Claude will work autonomously to solve whatever problem I give it...the task verifier is nearly perfect, otherwise Claude will solve the wrong problem."

### Context Management
The system minimizes output noise and uses deterministic sampling rather than full test suites, preventing context window pollution while maintaining coverage.

### Parallelization Strategy
Early success with independent test cases proved trivial to parallelize. When agents encountered the monolithic Linux kernel compilation task, Carlini introduced GCC as a "known-good oracle," allowing agents to work on different files simultaneously.

### Specialization
Different agents handled distinct responsibilities: code deduplication, compiler performance optimization, code generation efficiency, architectural critique, and documentation.

## Limitations and Boundaries

Despite achievements, significant gaps remain:

- **16-bit x86 generation:** Defers to GCC for real-mode boot code
- **Assembly/Linking:** Incomplete automation, relying on GCC tools
- **Code Efficiency:** Generated code underperforms even GCC with optimizations disabled
- **Rust Quality:** Functional but not production-grade
- **Project Coverage:** Not a universal C compiler replacement

The compiler "has nearly reached the limits of Opus's abilities," with Carlini unable to fully resolve remaining challenges.

## Safety Considerations

Carlini expresses concern about autonomous development: "the thought of programmers deploying software they've never personally verified is a real concern." The rapid capability advancement suggests both opportunity and risk requiring careful navigation.

## Conclusion

This project demonstrates that contemporary language models can tackle complex, multi-faceted engineering tasks when properly structured with appropriate testing frameworks and parallelization strategies -- while revealing where current models begin to reach their boundaries.
