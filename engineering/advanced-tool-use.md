---
title: "Introducing Advanced Tool Use on the Claude Developer Platform"
source_url: "https://www.anthropic.com/engineering/advanced-tool-use"
source_type: "web-extracted"
fetched_at: "2026-03-22T00:00:00Z"
category: "engineering"
---

# Introducing Advanced Tool Use on the Claude Developer Platform

## Overview

Anthropic has released three beta features enabling Claude to discover, learn, and execute tools dynamically:

1. **Tool Search Tool** - "allows Claude to use search tools to access thousands of tools without consuming its context window"
2. **Programmatic Tool Calling** - enables tool invocation within code execution environments
3. **Tool Use Examples** - provides concrete usage patterns for tool definitions

## Tool Search Tool

### The Problem
MCP tool definitions consume substantial tokens. A five-server setup (GitHub, Slack, Sentry, Grafana, Splunk) uses approximately 55K tokens before conversation begins. Tool selection errors increase when similar tools exist.

### The Solution
Rather than loading all definitions upfront, "Claude only sees the tools it actually needs for the current task." The approach preserves 95% of context window while reducing token usage by 85%.

The system works by marking tools with `defer_loading: true`, making them discoverable on-demand. "Tool Search Tool preserves 191,300 tokens of context compared to 122,800 with Claude's traditional approach."

### When to Use
- Tool definitions exceeding 10K tokens
- Tool selection accuracy issues
- MCP systems with multiple servers
- 10+ available tools

## Programmatic Tool Calling

### The Challenge
Traditional tool calling creates "context pollution from intermediate results" and "inference overhead." Processing large datasets forces all intermediate outputs into context, consuming tokens inefficiently.

### The Solution
Claude writes Python code orchestrating tools rather than invoking them individually. "By keeping intermediate results out of Claude's context, PTC dramatically reduces token consumption. Average usage dropped from 43,588 to 27,297 tokens, a 37% reduction."

Benefits include 37% token reduction, eliminated inference passes, and improved accuracy metrics.

### When to Use
- Large dataset processing requiring only summaries
- Multi-step workflows with 3+ dependent calls
- Data filtering/transformation before Claude processes
- Parallel operations across many items

## Tool Use Examples

### The Problem
JSON schemas define structure but not usage patterns. Ambiguities arise regarding formats, parameter correlation, and nested structure usage.

### The Solution
Examples demonstrate concrete patterns. "Tool use examples improved accuracy from 72% to 90% on complex parameter handling."

### When to Use
- Complex nested structures
- Tools with many optional parameters
- Domain-specific API conventions
- Similar tools requiring clarification

## Best Practices

Layer features strategically, addressing primary bottlenecks first. Tool Search Tool manages context bloat; Programmatic Tool Calling handles intermediate data; Tool Use Examples improve invocation accuracy.

Clear tool naming, comprehensive system prompts, and realistic example data maximize effectiveness.

## Getting Started

Enable features via beta header with `advanced-tool-use-2025-11-20` in API calls, using Claude Sonnet 4.5 or compatible models.
