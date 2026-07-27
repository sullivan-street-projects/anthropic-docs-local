---
title: "Introducing Advanced Tool Use on the Claude Developer Platform"
source_url: "https://www.anthropic.com/engineering/advanced-tool-use"
source_type: "web-extracted"
fetched_at: "2026-07-27T00:00:00Z"
category: "engineering"
---

# Introducing Advanced Tool Use on the Claude Developer Platform

## Overview

Anthropic introduced three beta features enabling Claude to dynamically discover, learn, and execute tools more efficiently. These capabilities address fundamental limitations in traditional tool use patterns for AI agents.

## Three Core Features

### 1. Tool Search Tool

**Problem Addressed:**
Large MCP tool libraries consume excessive tokens upfront. A five-server setup (GitHub, Slack, Sentry, Grafana, Splunk) consuming approximately 55,000 tokens before conversation starts demonstrates the inefficiency. "Tool definitions consume 134K tokens before optimization" at Anthropic's scale.

**Solution:**
Rather than loading all tool definitions initially, the Tool Search Tool enables on-demand discovery. Claude searches for relevant tools, and only matching definitions enter context.

**Performance Gains:**

- 85% reduction in token usage while maintaining full library access
- Opus 4 improved from 49% to 74% accuracy on MCP evaluations
- Opus 4.5 improved from 79.5% to 88.1%

**Implementation Pattern:**

```json
{
  "tools": [
    {
      "type": "tool_search_tool_regex_20251119",
      "name": "tool_search_tool_regex"
    },
    {
      "name": "github.createPullRequest",
      "description": "Create a pull request",
      "input_schema": {},
      "defer_loading": true
    }
  ]
}
```

**Best For:**

- Tool definitions exceeding 10K tokens
- Tool selection accuracy issues
- MCP systems with multiple servers
- Libraries with 10+ tools

### 2. Programmatic Tool Calling

**Problem Addressed:**
Traditional tool calling creates two issues: context pollution from intermediate results and inference overhead. Processing large datasets forces raw data into Claude's context window despite needing only summaries.

**Solution:**
Claude writes Python code orchestrating tool calls within a sandboxed execution environment. Tool results process in code rather than entering Claude's context, with only final output visible to the model.

**Example Use Case - Budget Compliance:**
Instead of fetching 2,000+ expense line items into context, Claude's code:

- Fetches team members and budgets
- Runs parallel expense queries
- Filters locally
- Returns only exceeding employees

**Performance Metrics:**

- 37% token reduction (43,588 to 27,297 tokens on complex tasks)
- Reduced latency by eliminating 19+ inference passes
- Internal knowledge retrieval improved from 25.6% to 28.5%
- GIA benchmarks improved from 46.5% to 51.2%

**Configuration:**

```json
{
  "type": "code_execution_20250825",
  "name": "code_execution"
},
{
  "name": "get_team_members",
  "allowed_callers": ["code_execution_20250825"]
}
```

**Best For:**

- Processing large datasets needing aggregation
- Multi-step workflows with 3+ dependent calls
- Parallel operations across many items
- Tasks requiring data filtering before Claude reasoning

### 3. Tool Use Examples

**Problem Addressed:**
JSON Schema defines structural validity but cannot express usage patterns: optional parameter inclusion, valid combinations, or API conventions.

**Solution:**
Provide concrete example invocations demonstrating correct parameter usage, nesting patterns, and domain conventions.

**Example - Support Ticket API:**
Rather than relying solely on schema, three examples show:

- Date format conventions (YYYY-MM-DD)
- ID format patterns (USR-XXXXX)
- Label conventions (kebab-case)
- When to populate nested structures

**Results:**
Tool use example accuracy improved from 72% to 90% on complex parameter handling in internal testing.

**Implementation:**

```json
{
  "name": "create_ticket",
  "input_schema": {},
  "input_examples": [
    {
      "title": "Login page returns 500 error",
      "priority": "critical",
      "labels": ["bug", "authentication", "production"],
      "reporter": {}
    }
  ]
}
```

**Best For:**

- Complex nested structures
- Tools with many optional parameters
- APIs with domain-specific conventions
- Similar tools requiring distinction

## Integration Strategy

The documentation recommends layering features strategically:

1. **Start with your biggest bottleneck** - identify whether context bloat, intermediate results, or parameter errors are primary constraints
2. **Layer additional features as needed** - features complement each other (Tool Search finds tools, Programmatic Calling executes efficiently, Tool Use Examples ensures correctness)
3. **Keep 3-5 most-used tools always loaded** while deferring the rest

## Getting Started

Features require beta header and model specification:

```python
client.beta.messages.create(
    betas=["advanced-tool-use-2025-11-20"],
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    tools=[...]
)
```

## Key Takeaway

These features transform tool use "from simple function calling toward intelligent orchestration," enabling agents to work across hundreds or thousands of tools while maintaining efficiency and accuracy.
