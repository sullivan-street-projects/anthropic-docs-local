---
title: "Building Effective Agents"
source_url: "https://www.anthropic.com/engineering/building-effective-agents"
source_type: "web-extracted"
fetched_at: "2026-03-22T00:00:00Z"
category: "engineering"
---

# Building Effective Agents

**Published:** December 19, 2024

## Introduction

After collaborating with numerous teams developing LLM agents across sectors, Anthropic discovered that "the most successful implementations weren't using complex frameworks or specialized libraries. Instead, they were building with simple, composable patterns."

This article shares practical guidance on constructing effective agents, drawn from customer partnerships and internal development experience.

## What Are Agents?

The term "agent" carries multiple interpretations. Some view agents as fully independent systems operating extended periods with various tools. Others describe more structured implementations following predetermined workflows. Anthropic distinguishes between two architectural approaches:

- **Workflows**: Systems where LLMs and tools follow predefined code paths
- **Agents**: Systems where LLMs autonomously direct processes and tool usage

## When to Use Agents

Building LLM applications requires pursuing simplicity initially, escalating complexity only when necessary. Agentic systems trade responsiveness and expenses for enhanced performance. Workflows deliver predictability for well-defined tasks; agents suit situations demanding flexibility and model-driven choices at scale. Many applications benefit most from optimizing single LLM calls using retrieval and contextual examples.

## Frameworks for Agent Development

Several frameworks streamline agentic system implementation:
- Claude Agent SDK
- Strands Agents SDK by AWS
- Rivet (visual LLM workflow builder)
- Vellum (GUI for complex workflows)

Frameworks simplify initial development by automating standard operations. However, they introduce abstraction layers that obscure underlying prompts and responses, complicating debugging. Anthropic recommends beginning with direct LLM API usage—many patterns require only minimal code. Understanding any framework's underlying mechanics remains essential, as misconceptions cause frequent customer issues.

## Building Blocks and Patterns

### The Augmented LLM (Foundation)

The fundamental component involves an LLM enhanced through retrieval, tools, and memory capabilities. Current models actively generate search queries, select appropriate tools, and determine information retention.

Developers should emphasize customizing augmentations for specific use cases and ensuring intuitive documentation. The Model Context Protocol represents one implementation approach, enabling third-party tool integration through straightforward client implementation.

### Prompt Chaining (Workflow)

This pattern decomposes tasks into sequential steps, with each LLM call processing previous output. Intermediate checkpoints can verify progress.

**Best for:** Tasks decomposable into fixed subtasks where latency reduction yields accuracy gains

**Examples:**
- Marketing content generation followed by translation
- Document outline creation, validation, then full composition

### Routing (Workflow)

Routing classifies inputs and directs them to specialized downstream processing, enabling optimization for distinct categories without compromise.

**Best for:** Complex tasks with distinct categories requiring separate handling

**Examples:**
- Customer service inquiry routing (questions, refunds, technical support)
- Question difficulty-based model routing (Haiku for simple, Sonnet for complex)

### Parallelization (Workflow)

LLMs simultaneously address tasks with aggregated outputs. Two primary variations exist:

**Sectioning**: Dividing independent subtasks for parallel execution
**Voting**: Running identical tasks multiple times for diverse outputs

**Best for:** Speed gains from task division or increased confidence through multiple perspectives

**Examples:**
- Guardrails implementation (separate LLM instances for user queries and content screening)
- Code vulnerability reviews using multiple evaluation prompts
- Multi-perspective content appropriateness assessment

### Orchestrator-Workers (Workflow)

A central LLM dynamically decomposes tasks, delegates to worker LLMs, and synthesizes findings.

**Best for:** Complex, unpredictable workflows where subtask composition depends on input

**Differs from parallelization** through flexibility—tasks aren't predetermined but orchestrator-determined.

**Examples:**
- Multi-file coding changes
- Multi-source information gathering and analysis

### Evaluator-Optimizer (Workflow)

One LLM generates responses while another provides evaluation and feedback iteratively.

**Best for:** Situations with clear evaluation criteria where iterative refinement delivers measurable benefits

Two success indicators: LLM responses improve with human feedback articulation, and LLMs can provide equivalent feedback.

**Examples:**
- Literary translation requiring nuance capture
- Complex search tasks needing multiple rounds

### Autonomous Agents

Agents emerge as LLMs mature in understanding complex inputs, reasoning, tool reliability, and error recovery. They begin via command or discussion, then operate independently, returning for information or decisions. Environmental feedback—tool results, code execution—proves crucial for progress assessment. Agents pause for human input at checkpoints or encountering obstacles. Stopping conditions maintain control.

While sophisticated, implementation typically remains straightforward: "They are typically just LLMs using tools based on environmental feedback in a loop." Tool design clarity proves essential.

**Best for:** Open-ended problems with unpredictable step requirements where fixed paths cannot be hardcoded

**Trade-offs:** Higher costs and compounding error potential require extensive sandboxed testing and appropriate guardrails.

**Real-world implementations:**
- Coding agents resolving SWE-bench tasks
- Computer use reference implementation

## Combining Patterns

These building blocks remain flexible rather than prescriptive. Developers should combine patterns fitting their use cases. Success requires measuring performance and iterating—adding complexity only when demonstrably improving outcomes.

## Summary and Core Principles

Success involves constructing the appropriate system for specific needs—not the most sophisticated. Progress through simple prompt optimization, comprehensive evaluation, then multi-step agentic systems when simpler approaches prove insufficient.

Three core principles guide agent implementation:

1. **Simplicity**: Maintain straightforward agent design
2. **Transparency**: Explicitly display agent planning steps
3. **Documentation and Testing**: Thoroughly craft agent-computer interfaces

Frameworks accelerate initial development; reducing abstraction layers and building with basic components yields production benefits. These principles enable agents that are powerful, reliable, maintainable, and user-trusted.

## Appendix 1: Practical Agent Applications

### Customer Support

Support combines chatbot familiarity with tool-enhanced capabilities effectively because interactions naturally follow conversational flows while requiring external information access, tools retrieve customer data and knowledge articles, actions including refunds can be automated, and success measures clearly through resolutions.

Multiple companies employ usage-based pricing for successful resolutions, demonstrating confidence in agent effectiveness.

### Coding Agents

Software development demonstrates exceptional LLM potential, evolving from code completion to autonomous problem-solving. Agents excel because code is testable through automation, agents iterate using test feedback, problems are well-defined and structured, and quality measurement is objective.

Current implementations solve real GitHub issues through pull request descriptions alone. Automated testing verifies functionality; human review ensures broader system alignment.

## Appendix 2: Tool Prompt Engineering

Tools enable Claude interaction with external services and APIs through structured definitions. Tool use blocks appear in responses when Claude invokes tools. Tools deserve equivalent prompt engineering attention as primary prompts.

Multiple equivalent action specifications exist—file edits via diff or full rewrite; code in markdown or JSON. Some formats prove substantially easier for LLMs. Diffs require pre-calculated line counts; JSON needs newline and quote escaping.

### Format Selection Guidelines

- Provide adequate tokens for "thinking" before the model constrains itself
- Maintain format proximity to natural internet text
- Eliminate formatting overhead (line counts, string escaping)

**Key principle**: Human-computer interface (HCI) investment parallels agent-computer interface (ACI) requirements.

### Tool Documentation Best Practices

- Adopt the model's perspective: would tool clarity be obvious, or require careful consideration?
- Optimize parameter names and descriptions for intuitiveness
- Test tool usage extensively; identify and iterate on model mistakes
- Implement poka-yoke principles: modify arguments to make mistakes harder

During SWE-bench development, Anthropic invested more time optimizing tools than overall prompts. When models struggled with relative filepaths after directory changes, the solution required absolute filepaths—resulting in flawless model usage.

---

**Written by:** Erik Schluntz and Barry Zhang
**Source:** Customer collaborations and Anthropic's internal agent development experience
