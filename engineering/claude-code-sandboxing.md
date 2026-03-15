---
title: "Beyond Permission Prompts: Making Claude Code More Secure and Autonomous"
source_url: "https://www.anthropic.com/engineering/claude-code-sandboxing"
source_type: "web-extracted"
fetched_at: "2026-03-15T00:00:00Z"
category: "engineering"
---

# Beyond Permission Prompts: Making Claude Code More Secure and Autonomous

## Overview

Anthropic has introduced new sandboxing features for Claude Code designed to enhance security while reducing permission prompts. According to the article, "sandboxing safely reduces permission prompts by 84%." These features include a sandboxed bash tool and Claude Code on the web.

## Key Security Features

### Two Boundaries Approach

The sandboxing implementation relies on dual isolation mechanisms:

1. **Filesystem Isolation** - Claude can only access or modify specific directories, preventing unauthorized changes to system files during prompt injection attacks.

2. **Network Isolation** - Connections are restricted to approved servers, blocking potential data exfiltration or malware downloads.

The article emphasizes that "effective sandboxing requires both filesystem and network isolation."

### Technical Implementation

The system uses OS-level primitives including Linux bubblewrap and macOS seatbelt to enforce restrictions. This covers not only direct Claude Code interactions but also scripts and subprocesses spawned by commands.

## Features

### Sandboxed Bash Tool

A new sandbox runtime (available as a beta research preview) allows defining which directories and network hosts are accessible. Users can configure file paths and domains, with Claude executing commands autonomously within defined limits. Unauthorized access attempts trigger immediate notifications.

### Claude Code on the Web

This cloud-based feature runs Claude Code sessions in isolated sandboxes. Notably, sensitive credentials like git credentials remain outside the sandbox, protected through a custom proxy service that handles git interactions securely.

## Getting Started

Users can:
- Run `/sandbox` in Claude and review technical documentation
- Access Claude Code on the web at claude.com/code
- Review open-sourced sandboxing code for integration into custom agent systems
