---
title: "Equipping agents for the real world with Agent Skills"
source_url: "https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills"
source_type: "web-extracted"
fetched_at: "2026-08-16T00:00:00Z"
category: "engineering"
published: "2025-10-16"
---

# Equipping agents for the real world with Agent Skills

**Publication Date:** October 16, 2025

## Introduction

Agent Skills are a new approach to building specialized agents using files and folders. They address a core challenge: Claude is powerful, but real work requires procedural knowledge and organizational context that a general-purpose model does not have out of the box.

## The Anatomy of a Skill

A Skill is a directory containing a `SKILL.md` file with organized instructions, plus optional scripts and resources. The design uses **progressive disclosure**, a three-level system that keeps context efficient:

1. **Level 1 — Metadata:** YAML frontmatter (name and description) is loaded into the system prompt at startup so Claude knows the Skill exists.
2. **Level 2 — Full instructions:** The complete `SKILL.md` content loads only when Claude determines the Skill is relevant to the task.
3. **Level 3+ — Bundled files:** Additional referenced files load on demand.

The PDF Skill example demonstrates this with separate `reference.md` and `forms.md` files that Claude loads only when relevant.

## Skills and Context Windows

Skills load dynamically into context through Bash tool invocation. The flow: metadata loads initially, Claude triggers the Skill when needed, additional files load on-demand, then the task proceeds. This avoids filling the context window with content that may never be used.

## Skills and Code Execution

Skills can bundle executable scripts (for example, Python code for PDF form extraction) that Claude runs deterministically without loading the full script or the underlying data into context. This keeps deterministic operations reliable and cheap.

## Development Guidelines

- Start evaluation by identifying capability gaps.
- Structure for scalability by splitting unwieldy files.
- Monitor real-world usage patterns.
- Iterate with Claude on what context actually matters.

## Security Considerations

Install Skills only from trusted sources and thoroughly audit unfamiliar ones — particularly examining code dependencies and external network connections, since a Skill can bundle executable code.

## Current Support and Future Direction

Agent Skills are supported across Claude.ai, Claude Code, the Claude Agent SDK, and the Developer Platform. Planned enhancements include improved lifecycle tooling for creation, discovery, and sharing, plus potential integration with Model Context Protocol (MCP) servers.

## Takeaways

Agent Skills democratize agent specialization without requiring custom agent development for each use case. Progressive disclosure keeps context efficient while preserving flexibility and scalability.
