---
title: 'The "Think" Tool: Enabling Claude to Stop and Think in Complex Tool Use Situations'
source_url: "https://www.anthropic.com/engineering/claude-think-tool"
source_type: "web-extracted"
fetched_at: "2026-07-12T00:00:00Z"
category: "engineering"
---

# The "Think" Tool: Enabling Claude to Stop and Think in Complex Tool Use Situations

## Overview

Anthropic has introduced a "think" tool that enhances Claude's ability to handle complex problem-solving tasks. Published March 20, 2025, this feature differs from extended thinking by providing Claude with a dedicated reasoning step during response generation, particularly useful for processing external information and tool outputs.

## What is the "Think" Tool?

The think tool allows Claude to "include an additional thinking step—complete with its own designated space—as part of getting to its final answer." Unlike extended thinking (which occurs before response generation), this tool enables mid-response pauses for reflection on whether sufficient information exists before proceeding.

This approach proves most suitable for scenarios where Claude lacks complete information from the user query alone and must process external data, such as tool call results.

## Key Differences from Extended Thinking

**Think tool is better for:**

- Complex tool chains requiring careful output analysis
- Policy-heavy environments with detailed guidelines
- Sequential decisions where mistakes carry consequences

**Extended thinking is better for:**

- Non-sequential tool calls
- Straightforward instruction following
- Coding, math, and physics problems without tool use

## Implementation

### Basic Tool Definition

The tool accepts a single string parameter for thoughts:

```json
{
  "name": "think",
  "description": "Use the tool to think about something. It will not obtain new information or change the database, but just append the thought to the log.",
  "input_schema": {
    "type": "object",
    "properties": {
      "thought": {
        "type": "string",
        "description": "A thought to think about."
      }
    },
    "required": ["thought"]
  }
}
```

## Performance Results

### tau-Bench Evaluation

Testing on tau-bench (a customer service benchmark) showed significant improvements:

- **Airline domain**: The think tool with optimized prompting achieved 0.570 on pass-1 metrics, representing "a 54% relative improvement" over the 0.370 baseline
- **Retail domain**: The tool alone achieved 0.812 versus 0.783 baseline performance

The combination of the tool with domain-specific prompt examples delivered the strongest results, suggesting that difficult domains benefit substantially from guidance examples.

### SWE-Bench Results

Adding the think tool to Claude 3.7 Sonnet's SWE-bench evaluation contributed to state-of-the-art scoring (0.623), with the isolated tool effect showing a 1.6% average performance improvement.

## Best Practices

**Strategic prompting:** Provide domain-specific examples showing reasoning approaches, how to break down complex instructions, and decision trees for common scenarios.

**System prompt placement:** Place complex think tool guidance in the system prompt rather than tool descriptions for better integration.

**When to avoid:** Don't implement think for non-sequential tool calls or simple instruction-following scenarios where minimal constraints exist.

## Getting Started

1. Test with challenging agentic scenarios
2. Customize the tool definition for your domain
3. Monitor usage patterns and refine prompts accordingly

The tool requires minimal code implementation while offering substantial benefits for appropriate use cases.
