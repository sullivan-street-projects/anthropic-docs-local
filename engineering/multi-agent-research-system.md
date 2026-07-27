---
title: "How we built our multi-agent research system"
source_url: "https://www.anthropic.com/engineering/multi-agent-research-system"
source_type: "web-extracted"
fetched_at: "2026-07-27T00:00:00Z"
category: "engineering"
published: "2025-06-13"
---

# How we built our multi-agent research system

**Publication Date:** June 13, 2025

Claude's Research capabilities allow it to search across the web, Google Workspace, and any integrations to accomplish complex tasks. The journey of this multi-agent system from prototype to production taught critical lessons about system architecture, tool design, and prompt engineering.

## Key Performance Findings

"A multi-agent system with Claude Opus 4 as the lead agent and Claude Sonnet 4 subagents outperformed single-agent Claude Opus 4 by 90.2%." However, multi-agent systems consume approximately fifteen times more tokens than standard chat interactions.

## Architecture Pattern

The system employs an orchestrator-worker design where:

- A **lead agent** analyzes queries, develops strategies, and delegates tasks
- **Subagents** operate in parallel, exploring different research dimensions
- **Specialized tools** enable web searching, database access, and information synthesis
- A **citation agent** attributes findings to specific sources

This contrasts with traditional retrieval-augmented generation, which uses static document matching rather than iterative, adaptive searching.

## Eight Prompt Engineering Principles

**1. Cognitive modeling:** Engineers simulated agents step-by-step to identify failure patterns like excessive subagent spawning or endless searching.

**2. Clear delegation:** Lead agents require detailed task descriptions specifying objectives, output formats, tool guidance, and boundaries to prevent duplication.

**3. Effort scaling:** Explicit guidelines differentiate simple fact-finding (one agent, 3-10 tool calls) from complex research (10+ specialized subagents).

**4. Tool design criticality:** Agent success depends heavily on clear tool descriptions and strategic selection heuristics.

**5. Self-improvement capability:** Claude models effectively diagnose prompt failures and generate improvements, reducing task completion time by forty percent.

**6. Progressive narrowing:** Search strategies should begin broad and gradually narrow focus rather than starting with overly specific queries.

**7. Visible reasoning:** Extended thinking mode provides controllable scratchpads for planning and interleaved thinking enables adaptive query refinement.

**8. Parallelization:** Simultaneous subagent execution and parallel tool calling reduced research time by up to ninety percent.

## Evaluation Methodology

**Small-scale rapid testing:** Initial evaluations used roughly twenty representative queries, allowing developers to detect substantial improvements from prompt modifications.

**LLM-as-judge approach:** A single model call evaluating factual accuracy, citation precision, completeness, source quality, and tool efficiency proved more consistent than component-specific judges.

**Human oversight necessity:** Manual testing identified edge cases automated evaluation missed, including SEO-bias in source selection.

## Production Engineering Challenges

**State management:** Long-running agents require durable execution, error recovery, and checkpoint systems that enable resumption rather than restart.

**Debugging complexity:** Non-deterministic agent behavior necessitated production tracing to monitor decision patterns and interaction structures without exposing conversation contents.

**Deployment coordination:** Rainbow deployments gradually shift traffic between versions, preventing code changes from disrupting active agents.

**Synchronous bottlenecks:** Current lead agents wait for subagent completion before proceeding, limiting parallelism potential that asynchronous execution could unlock.

## Real-World Impact

Users reported substantial value including discovering overlooked business opportunities, navigating complex decisions, resolving technical challenges, and saving multiple days through research automation.

## Appendix Patterns

**End-state evaluation:** Judge final outcomes rather than intermediate steps, acknowledging multiple valid solution paths.

**Extended conversations:** Store completed work phases in external memory before context window exhaustion; spawn subagents with clean contexts while maintaining continuity.

**Distributed outputs:** Enable agents to write results to filesystems, preventing information loss through multi-stage coordinator filtering.
