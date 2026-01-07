---
title: Claude Code Best Practices
description: Expert setup and workflow practices from Boris Cherny, creator of Claude Code
source: https://twitter-thread.com/t/2007179832300581177
author: Boris Cherny (@bcherny)
date_extracted: 2025-01-07
---

# Claude Code Setup Guide by Boris Cherny

**Author:** Boris Cherny (@bcherny), Creator of Claude Code

## Key Setup Practices

### Parallel Processing
Cherny runs 5 Claude instances simultaneously in his terminal, numbered 1-5, using system notifications to track when input is needed.

### Multi-Platform Usage
He maintains 5-10 additional Claude sessions on claude.ai/code alongside local instances, enabling workflow flexibility across terminal, web, and mobile platforms.

### Model Selection
"It's the best coding model I've ever used" - Cherny exclusively uses Opus 4.5 with thinking, prioritizing quality over speed despite its larger size.

### Team Documentation
The team maintains a shared CLAUDE.md file tracked in git, continuously updated with discovered Claude errors to improve future performance.

### Planning Discipline
Sessions begin in Plan mode (shift+tab twice), emphasizing that "A good plan is really important" before switching to auto-accept mode.

### Workflow Automation
Custom slash commands in .claude/commands/ handle repetitive tasks like /commit-push-pr, using inline bash to optimize speed.

### Subagents
Regular use of specialized agents (code-simplifier, verify-app) automates common workflows across pull requests.

### Critical Success Factor
Providing verification mechanisms—whether bash commands, test suites, or browser testing—can "2-3x the quality of the final result."

### Tool Integration
Claude accesses Slack, BigQuery, and Sentry through configured MCP servers for comprehensive workflow support.
