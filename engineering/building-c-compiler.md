---
title: "Building a C Compiler with a Team of Parallel Claudes"
source_url: "https://www.anthropic.com/engineering/building-c-compiler"
source_type: "web-extracted"
fetched_at: "2026-07-20T00:00:00Z"
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

### Enabling Sustained Agent Autonomy

The researchers implemented a continuous loop structure allowing Claude to work without human intervention:

```bash
while true; do
    COMMIT=$(git rev-parse --short=6 HEAD)
    LOGFILE="agent_logs/agent_${COMMIT}.log"

    claude --dangerously-skip-permissions \
           -p "$(cat AGENT_PROMPT.md)" \
           --model claude-opus-X-Y &> "$LOGFILE"
done
```

This scaffolding enables Claude to "break problems into small pieces, track progress, identify next steps, and persist until resolution."

### Parallel Agent Implementation

Multiple Claude instances work on shared codebases using containerized environments:

- **Task Locking:** Agents claim work through text files in `current_tasks/` directory, preventing duplicate efforts
- **Git Synchronization:** Each agent clones from upstream, works locally, resolves conflicts, and pushes changes
- **Specialization Roles:** Different agents handle distinct responsibilities (documentation, code quality, performance optimization, architectural critique)

## Critical Design Principles

### Testing Quality

"Write extremely high-quality tests" because Claude will autonomously solve whatever verification system receives. "The task verifier is nearly perfect, otherwise Claude will solve the wrong problem."

### Context Management

The system minimizes output noise and restructures for Claude's consumption:

- Maintain extensive README and progress documentation updated frequently
- Log errors to files with clear formatting (grep-friendly)
- Pre-compute aggregate statistics to avoid recomputation
- Implement `--fast` mode for rapid feedback using deterministic sampling

### Parallelization Strategy

Initial parallelization worked well with independent test cases. When agents encountered the monolithic Linux kernel compilation task, Carlini introduced GCC as a "known-good oracle," allowing agents to work on different files simultaneously while comparing outputs.

### Specialization

Different agents handled distinct responsibilities: code deduplication, compiler performance optimization, code generation efficiency, architectural critique, and documentation.

## Resource Metrics

| Metric              | Value         |
| ------------------- | ------------- |
| Agent instances     | 16 parallel   |
| Code sessions       | ~2,000        |
| Total input tokens  | 2 billion     |
| Total output tokens | 140 million   |
| Project cost        | $20,000       |
| Codebase size       | 100,000 lines |
| Duration            | ~2 weeks      |

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
