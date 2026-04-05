---
title: "The \"Think\" Tool: Enabling Claude to Stop and Think in Complex Tool Use Situations"
source_url: "https://www.anthropic.com/engineering/claude-think-tool"
source_type: "web-extracted"
fetched_at: "2026-04-05T00:00:00Z"
category: "engineering"
---

# The "Think" Tool: Enabling Claude to Stop and Think in Complex Tool Use Situations

## Overview

Anthropic has introduced a "think" tool that enhances Claude's ability to handle complex problem-solving tasks. Published March 20, 2025, this feature differs from extended thinking by providing Claude with a dedicated reasoning step during response generation, particularly useful for processing external information and tool outputs.

## What is the "Think" Tool?

The think tool allows Claude to "include an additional thinking step—complete with its own designated space—as part of getting to its final answer." Unlike extended thinking (which occurs before response generation), this tool enables mid-response pauses for reflection on whether sufficient information exists before proceeding.

This approach proves most suitable for scenarios where Claude lacks complete information from the user query alone and must process external data, such as tool call results.

## Performance Results

### tau-Bench Evaluation

Testing on tau-bench (a customer service benchmark) showed significant improvements:

- **Airline domain**: The think tool with optimized prompting achieved 0.570 on pass-1 metrics, representing "a 54% relative improvement" over the 0.370 baseline
- **Retail domain**: The tool alone achieved 0.812 versus 0.783 baseline performance

The combination of the tool with domain-specific prompt examples delivered the strongest results, suggesting that difficult domains benefit substantially from guidance examples.

### SWE-Bench Results

Adding the think tool to Claude 3.7 Sonnet's SWE-bench evaluation contributed to state-of-the-art scoring (0.623), with the isolated tool effect showing a 1.6% average performance improvement.

## When to Use This Tool

The think tool works best for:

1. **Tool output analysis** - Processing previous tool call results before acting
2. **Policy-heavy environments** - Following detailed guidelines with compliance verification
3. **Sequential decision-making** - Multi-step problems where each action builds on previous ones

The tool shows minimal improvement for non-sequential tool calls or simple instruction-following tasks.

## Implementation Best Practices

Developers should:

- Provide clear instructions with domain-specific examples tailored to their use case
- Place complex guidance in system prompts rather than tool descriptions
- Start testing with challenging scenarios where policy compliance currently struggles
- Monitor actual usage patterns and refine prompts accordingly

## Key Distinction from Extended Thinking

While extended thinking helps with simpler tool scenarios and domains like coding or physics, the think tool excels when Claude requires "complex tools, analyze tool outputs carefully in long chains of tool calls" or navigate policy-heavy environments with multiple constraints.
