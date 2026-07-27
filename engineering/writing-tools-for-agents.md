---
title: "Writing Effective Tools for Agents — With Agents"
source_url: "https://www.anthropic.com/engineering/writing-tools-for-agents"
source_type: "web-extracted"
fetched_at: "2026-07-27T00:00:00Z"
category: "engineering"
published: "2025-09-11"
---

# Writing Effective Tools for Agents — With Agents

**Publication Date:** September 11, 2025

This article explores how to design high-quality tools for LLM agents using the Model Context Protocol (MCP). The core premise is that "agents are only as effective as the tools we give them."

## What is a Tool?

Tools represent a new contract between deterministic systems and non-deterministic agents. Unlike traditional function calls that always produce identical outputs, tools must account for agent variability. Agents "can generate varied responses even with the same starting conditions," requiring fundamentally different software design approaches than conventional APIs.

## How to Write Tools

The post outlines a three-phase iterative process:

### Building a Prototype

- Start with quick prototypes to identify what agents find ergonomic
- Leverage LLM-friendly documentation (such as `llms.txt` files)
- Connect tools via local MCP servers or Desktop extensions
- Test directly through the Anthropic API for programmatic evaluation

### Running an Evaluation

- Generate dozens of real-world evaluation tasks
- Create verifiable prompt-response pairs with ground truth outcomes
- Run evaluations programmatically using simple agentic loops
- Collect metrics including accuracy, runtime, tool calls, token consumption, and errors

### Collaborating with Agents

- Use agents like Claude Code to analyze evaluation transcripts
- Let agents identify and refactor problematic tool implementations
- Maintain held-out test sets to prevent overfitting

## Principles for Effective Tools

### Choosing the Right Tools

More tools don't necessarily improve outcomes. The post emphasizes selecting "a few thoughtful tools targeting specific high-impact workflows" rather than wrapping every API endpoint. Tools should consolidate related operations — for example, implementing `schedule_event` instead of separate `list_users`, `list_events`, and `create_event` tools.

### Namespacing

Grouping related tools under common prefixes reduces agent confusion. Examples include organizing by service (`asana_search`, `jira_search`) or resource (`asana_projects_search`, `asana_users_search`). This has "non-trivial effects on tool-use evaluations."

### Returning Meaningful Context

Tools should prioritize "contextual relevance over flexibility" and avoid low-level technical identifiers. Replace cryptic UUIDs with semantic language or simple ID schemes. An optional `response_format` enum parameter can provide both detailed and concise responses for different workflow needs.

```
enum ResponseFormat {
   DETAILED = "detailed",
   CONCISE = "concise"
}
```

### Token Efficiency

Implement pagination, range selection, filtering, and truncation with sensible defaults. Claude Code restricts responses to 25,000 tokens by default. Steer agents toward efficient strategies through clear error messages and helpful instructions rather than opaque error codes.

### Prompt-Engineering Tool Descriptions

Tool descriptions significantly impact agent behavior. Describe tools as you would to a new team member, making implicit context explicit. Precise refinements can yield dramatic improvements — Claude Sonnet 3.5 achieved state-of-the-art performance on SWE-bench Verified after refinements to tool descriptions.

## Results and Impact

Internal testing showed measurable improvements:

- Slack MCP servers improved through Claude optimization
- Asana MCP servers demonstrated performance gains over human-written versions
- Detailed token savings achieved through response format optimization (206 tokens to 72 tokens in examples provided)

## Conclusion

Effective agentic tools require re-orienting "software development practices from predictable, deterministic patterns to non-deterministic ones." Success depends on systematic evaluation, clear definition, judicious context usage, and practical task enablement.
