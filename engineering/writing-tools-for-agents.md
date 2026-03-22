---
title: "Writing Effective Tools for Agents — With Agents"
source_url: "https://www.anthropic.com/engineering/writing-tools-for-agents"
source_type: "web-extracted"
fetched_at: "2026-03-22T00:00:00Z"
category: "engineering"
published: "2025-09-11"
---

# Writing Effective Tools for Agents — With Agents

**Publication Date:** September 11, 2025

This article explores best practices for developing high-quality tools that AI agents can effectively use, sharing techniques refined through internal optimization of tools for Claude.

## What is a Tool

Tools represent a new category of software operating between deterministic systems and non-deterministic agents. Unlike traditional APIs, they must account for agent unpredictability—agents may misuse tools, hallucinate, or pursue unexpected strategies.

## Building Prototypes

Developers should create quick tool prototypes and test them locally. Using Claude Code with LLM-friendly documentation (found in `llms.txt` files) helps generate initial implementations. Tools can be wrapped in local MCP servers or Desktop extensions for testing.

## Running Evaluations

Effective evaluation requires realistic, multi-step tasks reflecting actual workflows. "Tasks should require multiple tool calls—potentially dozens." Evaluations should collect metrics beyond accuracy, including runtime, token consumption, and error rates.

## Key Design Principles

- **Tool Selection:** Fewer, more focused tools outperform numerous generic wrappers around APIs
- **Namespacing:** Grouping related tools under consistent prefixes reduces agent confusion
- **Response Quality:** Return meaningful context rather than technical identifiers; "resolving arbitrary alphanumeric UUIDs to semantically meaningful language significantly improves Claude's precision"
- **Token Efficiency:** Implement pagination, filtering, and truncation with helpful instructions
- **Descriptions:** Prompt-engineering tool specifications dramatically impacts performance

The article demonstrates that Claude-optimized internal tools consistently outperformed manually-written versions in evaluations.
