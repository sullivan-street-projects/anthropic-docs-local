---
title: "Building Effective AI Coding Agents for the Terminal: Scaffolding, Harness, Context Engineering, and Lessons Learned"
source_url: "https://arxiv.org/abs/2603.05344"
source_type: "arxiv-pdfs"
fetched_at: "2026-07-27T00:00:00Z"
category: "research"
arxiv_id: "2603.05344"
authors: "Nghi D. Q. Bui"
---

# Building Effective AI Coding Agents for the Terminal

**Paper:** [arXiv:2603.05344](https://arxiv.org/abs/2603.05344) (March 2026, v3 — March 13, 2026)
**Author:** Nghi D. Q. Bui
**License:** CC BY 4.0

## Abstract

Introduces OPENDEV, an open-source terminal-native AI coding agent for autonomous software development. The system is a compound AI architecture with specialized model routing, dual-agent design (planning/execution separation), strict safety controls, and context management to prevent context bloat and reasoning degradation. Key innovations include lazy tool discovery, adaptive context compaction, automated memory systems, and event-driven reminders to prevent instruction fade-out.

## Core Architecture (Four Layers)

### Entry & UI Layer

Bootstraps configuration managers and supports both TUI (Textual-based) and Web UI (FastAPI/WebSockets) frontends through a unified UICallback interface.

### Agent Layer

Orchestrates reasoning through an extended ReAct execution pipeline with explicit thinking phases, tool orchestration, and safety enforcement. Operates in two modes:

- **Plan Mode** — read-only exploration
- **Normal Mode** — full execution access

### Tool & Context Layer

Manages tool execution through a registry-based dispatcher and handles context engineering via adaptive compaction, system reminders, and memory accumulation.

### Persistence Layer

Maintains state across session storage, operation logs, configuration management, and provider caching.

## Key Architectural Innovations

### Workload-Optimized Multi-Model Architecture

Five specialized model roles assigned to distinct LLMs:

- Normal execution
- Extended thinking (deliberation)
- Self-critique
- Vision/VLM tasks
- Fallback chains

Each workflow independently selects its model through user configuration, enabling cost-latency-capability optimization without code changes.

### Extended ReAct Execution Loop

Six phases per iteration:

1. Pre-check and context compaction
2. Optional thinking phase
3. Optional self-critique
4. LLM action generation
5. Tool execution with safety checks
6. Post-processing for termination detection

### Defense-in-Depth Safety Architecture

Five independent security layers:

| Layer | Mechanism                                                                          |
| :---- | :--------------------------------------------------------------------------------- |
| 1     | Prompt-level guardrails (security policy, error recovery)                          |
| 2     | Schema-level tool restrictions (plan-mode whitelisting, per-subagent filtering)    |
| 3     | Runtime approval system (manual/semi-auto/auto levels with persistent permissions) |
| 4     | Tool-level validation (dangerous-pattern blocklists, timeout enforcement)          |
| 5     | User-defined lifecycle hooks (pre-tool blocking, argument mutation)                |

### Adaptive Context Compaction

Progressive reduction of older observations as token usage approaches limits, with preserved recent context for coherent reasoning.

### Event-Driven System Reminders

Conditional prompt sections inject guidance at decision points rather than relying solely on initial system prompt content. Counteracts instruction fade-out in long-running sessions.

## Tool System Architecture

### Registry-Based Dispatch

Typed handlers across categories:

- **File operations:** read_file, write_file, edit_file, list_files, search
- **Shell execution:** run_command, list_processes, get_process_output, kill_process
- **Web interaction:** fetch_url, web_search, capture_web_screenshot, open_browser
- **Code analysis:** find_symbol, find_referencing_symbols, rename_symbol (via LSP)
- **User interaction:** ask_user, task tracking, plan review

### MCP Integration

Lazy discovery of external tools through keyword-scored searches, reducing token overhead of exhaustive tool listings.

## Context Engineering Subsystems

### Dynamic System Prompt Construction

Priority-ordered conditional composition of modular sections with provider-specific variants and variable substitution. Includes provider-level prompt caching.

### Tool Result Optimization

Per-tool-type summarization, large-output offloading to external storage, and agent-aware truncation hints.

### Dual-Memory Architecture

- **Episodic memory:** Accumulated experiences and lessons across sessions
- **Working memory:** Current conversation context for bounded reasoning

### Context-Aware System Reminders

Event detectors trigger template-resolved guidance based on detected patterns (repeated errors, stalled progress, safety violations).

## Subagent Orchestration

Specialized subagents with filtered tool access:

| Subagent         | Purpose                                                    |
| :--------------- | :--------------------------------------------------------- |
| Planner          | Read-only codebase analysis and structured plan generation |
| CodeExplorer     | Deep semantic navigation via LSP                           |
| SecurityReviewer | Vulnerability assessment                                   |
| WebGenerator     | HTML/CSS/JavaScript creation                               |

Tool filtering prevents access to disallowed operations; fresh message histories per invocation enforce isolation.

## Lessons Learned

### Context Pressure as Central Constraint

Prompt structure designed for caching; dual-memory separation of episodic and working contexts addresses token scarcity.

### Long-Horizon Behavior Steering

Explicit decision trees guide tool selection; provider-conditional prompt sections enable model-specific optimizations.

### Architectural Safety vs. Productivity

Approval persistence prevents fatigue; lifecycle hooks enable custom security policies; modal interruption preserves human control.

### Designing for Approximate Outputs

Auto-promotion of server-like commands prevents blocking; automatic dependency installation handles common failures gracefully.

### Lazy Loading and Bounded Growth

Self-healing indexes detect stale data; deterministic operations outside the agent loop prevent memory accumulation.

## Key Takeaways

- Effective terminal-native AI agents require coordinated engineering across scaffolding, runtime harness, context optimization, and tool design
- Compound AI systems — allocating different models to different cognitive tasks — enable cost-efficient operation without sacrificing capability
- Transparency and gradual degradation ensure resource exhaustion degrades functionality rather than safety
- Context engineering (compaction, reminders, dual memory) is the central challenge for long-horizon agent tasks
