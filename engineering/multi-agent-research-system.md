---
title: "How we built our multi-agent research system"
source_url: "https://www.anthropic.com/engineering/multi-agent-research-system"
source_type: "web-extracted"
fetched_at: "2026-03-22T00:00:00Z"
category: "engineering"
published: "2025-06-13"
---

# How we built our multi-agent research system

**Publication Date:** June 13, 2025

Claude now has Research capabilities that allow it to search across the web, Google Workspace, and any integrations to accomplish complex tasks. The journey of this multi-agent system from prototype to production taught critical lessons about system architecture, tool design, and prompt engineering.

## Benefits of a Multi-Agent System

"A multi-agent system with Claude Opus 4 as the lead agent and Claude Sonnet 4 subagents outperformed single-agent Claude Opus 4 by 90.2% on our internal research eval."

Token usage explains a significant portion of performance variance. "Multi-agent systems use about 15× more tokens than chats," but this increased cost is worthwhile for high-value research tasks.

## Architecture Overview

The Research system employs an orchestrator-worker pattern where a lead agent coordinates while delegating to specialized subagents operating in parallel. The LeadResearcher agent saves its plan to memory, creates specialized subagents, each subagent independently performs web searches, and the LeadResearcher synthesizes results.

## Eight Core Prompting Principles

1. "Think like your agents" — build simulations using exact prompts and tools
2. "Teach the orchestrator how to delegate" — detailed task descriptions
3. "Scale effort to query complexity" — embed scaling rules
4. "Tool design and selection are critical" — bad descriptions send agents down wrong paths
5. "Let agents improve themselves" — have Claude diagnose failures and suggest improvements
6. "Start wide, then narrow down" — broad queries before focusing
7. "Guide the thinking process" — use extended thinking mode
8. "Parallel tool calling transforms speed and performance" — reduces research time by up to 90%

## Production Reliability

Key challenges include: stateful agents with error compounding (resume from where errors occurred, don't restart), debugging complexity (full production tracing), careful deployment ("rainbow deployments" gradually shifting traffic), and synchronous bottlenecks in lead agent coordination.

## Conclusion

"When building AI agents, the last mile often becomes most of the journey." The gap between prototype and production is wider than anticipated due to the compound nature of agentic system errors.
