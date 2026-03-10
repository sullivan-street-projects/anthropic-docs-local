---
title: "Claude Code Features"
source_url: "https://code.claude.com/docs/en/features-overview"
source_type: "manual"
fetched_at: "2026-03-10T00:00:00Z"
category: "claude-code"
---

# Claude Code Features

Comprehensive overview of Claude Code's features and capabilities. Claude Code is a terminal-based agentic coding tool that runs in your development environment.

> **Last updated:** March 5, 2026

## Extension Architecture

Claude Code combines a model that reasons about your code with built-in tools for file operations, search, execution, and web access. Beyond the built-in tools, Claude Code provides an extension layer for customization:

| Feature | What It Does | When to Use |
|---------|-------------|-------------|
| **CLAUDE.md** | Persistent context loaded every conversation | Project conventions, "always do X" rules |
| **Skills** | Instructions, knowledge, and workflows Claude can use | Reusable content, reference docs, repeatable tasks |
| **Subagents** | Isolated execution context that returns summarized results | Context isolation, parallel tasks, specialized workers |
| **Agent Teams** | Coordinate multiple independent Claude Code sessions | Parallel research, feature development, debugging |
| **MCP** | Connect to external services | External data or actions |
| **Hooks** | Deterministic scripts that run on events | Predictable automation, no LLM involved |
| **Plugins** | Package and distribute feature sets | Reuse across repos, share with teams |

## Built-in Tools

| Tool | Description |
|------|-------------|
| Read | Read files from the filesystem (text, images, PDFs, notebooks) |
| Write | Create new files |
| Edit | Exact string replacements in existing files |
| Glob | Fast file pattern matching (e.g., `**/*.ts`) |
| Grep | Content search with regex support (powered by ripgrep) |
| Bash | Shell command execution with timeout and background support |
| WebFetch | Fetch and process web content |
| WebSearch | Internet search with domain filtering |
| Agent | Spawn subagents for isolated, parallel execution |
| TodoWrite | Structured task tracking |
| AskUserQuestion | Interactive user prompts with options |
| NotebookEdit | Jupyter notebook cell editing |

## Vision & Multimodal

- Analyze screenshots, diagrams, mockups, and visual content
- Process PDF documents (up to 20 pages per request)
- Read and edit Jupyter notebooks with outputs
- Image file support (PNG, JPG, etc.)

## Extended Thinking

Claude reasons through complex problems with step-by-step internal reasoning. With Opus 4.6, adaptive thinking is available -- Claude automatically adjusts reasoning depth based on task complexity.

## Fast Mode

Research preview feature for Opus 4.6 that provides ~2.5x faster output at the same quality level. Toggle with `/fast` in interactive mode.

## Session Management

### Checkpointing & Rewind
- Automatic git-based checkpointing of file changes
- Rewind to any previous state with `/rewind`
- Fork sessions to explore alternative approaches

### Session Resumption
- `--continue` / `-c`: Resume most recent conversation in current directory
- `--resume <name>`: Resume a specific named session
- `--resume` (no arg): Browse and select from session picker
- `--from-pr <number>`: Resume from a pull request context
- `/rename`: Give sessions memorable names for easy retrieval

### Context Compaction
- Automatic summarization when context window fills up
- Manual compaction with `/compact`
- Custom compaction prompts: `/compact focus on the API changes`
- Hooks can re-inject context after compaction (SessionStart with `compact` matcher)

## Permission & Security

### Permission Modes
| Mode | Description |
|------|-------------|
| `default` | Requires approval for potentially risky actions |
| `plan` | Claude can only read/search, cannot modify files |
| `acceptEdits` | Auto-approve file edits, ask for other actions |
| `dontAsk` | Auto-approve most actions |
| `bypassPermissions` | Full autonomy (requires `--dangerously-skip-permissions`) |

### Tool-Specific Permissions
- Fine-grained allow/deny rules per tool
- Wildcard patterns for paths and commands
- Configured in settings files at user, project, or local scope

### Sandboxing
- Optional OS-level isolation for command execution
- Network restrictions derived from permission rules
- Configurable via settings or SDK

## Context Loading by Feature

Each extension has different context costs:

| Feature | When It Loads | Context Cost |
|---------|--------------|--------------|
| **CLAUDE.md** | Session start | Every request |
| **Skills** | Session start + when used | Low (descriptions every request) |
| **MCP servers** | Session start | Every request |
| **Subagents** | When spawned | Isolated from main session |
| **Hooks** | On trigger | Zero, unless hook returns additional context |

Skills with `disable-model-invocation: true` have zero context cost until manually invoked. Tool search (default for MCP) loads tools up to 10% of context and defers the rest.

## CLAUDE.md (Project Memory)

Persistent instructions loaded every session:

| Location | Scope |
|----------|-------|
| `~/.claude/CLAUDE.md` | User-wide (all projects) |
| `CLAUDE.md` | Project root |
| `.claude/CLAUDE.md` | Nested subdirectories |

- Supports `@path` imports for splitting large configs
- Best kept under 500 lines; move reference material to skills
- `.claude/rules/` files can be scoped to specific file paths

## Skills

Reusable knowledge and invocable workflows:
- Invoke with `/skill-name` commands
- Claude can auto-load relevant skills based on task context
- Support `$ARGUMENTS` placeholder for dynamic behavior
- Can run in current context or isolated via subagents (`context: fork`)
- Set `disable-model-invocation: true` to hide from Claude until manually invoked
- Bundled skills include `/simplify`, `/batch`, `/debug`

## Subagents

Isolated execution contexts:
- Fresh context window; results return summarized to caller
- Can preload specific skills via `skills:` field
- Do not inherit conversation history from main session
- Useful when context window is getting full

## Agent Teams (Experimental)

Coordinate multiple independent Claude sessions working on related tasks:
- Shared task boards for coordination
- Inter-agent messaging (peer-to-peer)
- Parallel execution across git worktrees
- Quality gates and verification
- Disabled by default

## IDE Integrations

### VS Code Extension
- Native integration with Claude Code in the editor
- File context from open editors
- Terminal integration

### JetBrains Plugin
- IntelliJ, PyCharm, WebStorm, and other JetBrains IDEs
- Same capabilities as VS Code extension

### LSP Support
- Language Server Protocol integration for code intelligence
- Go-to-definition and find-references capabilities
- Configure via `.lsp.json` in plugins

## Output Styles

Built-in output style system for formatting Claude's responses:
- 10 pre-set themes available
- Custom output styles with themes and formatting rules
- Toggle between styles during a session

## Platform Support

| Platform | Description |
|----------|-------------|
| Terminal CLI | Primary interface (`claude` command) |
| VS Code Extension | IDE integration |
| JetBrains Plugin | IDE integration |
| Claude Code on the Web | Cloud-hosted environment |
| GitHub Actions | CI/CD automation via `claude-code-action` |
| GitLab CI/CD | Pipeline integration |

## Git Worktrees

Run parallel isolated Claude sessions using git worktrees:
```bash
git worktree add ../project-feature-a -b feature-a
cd ../project-feature-a
claude
```

## Non-Interactive / Pipe Mode

Use Claude as a unix-style utility:
```bash
# Pipe data through Claude
cat build-error.txt | claude -p 'explain the root cause' > output.txt

# Output format control
claude -p 'analyze code' --output-format json
claude -p 'parse logs' --output-format stream-json
```

## Team & Enterprise Features

- Analytics dashboard for Teams/Enterprise plans
- Contribution metrics and PR attribution
- Usage monitoring and cost tracking
- Managed settings for organization-wide policies
- SSO and authentication integration

## Key Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Submit prompt / approve action |
| `Esc` | Cancel current operation |
| `Ctrl+C` | Interrupt Claude |
| `/` | Access slash commands |
| `Tab` | Autocomplete file paths |

## Slash Commands

| Command | Description |
|---------|-------------|
| `/help` | Get help |
| `/compact` | Compress conversation context |
| `/clear` | Clear conversation history |
| `/rewind` | Rewind to a previous checkpoint |
| `/rename` | Name the current session |
| `/fast` | Toggle fast mode |
| `/mcp` | Manage MCP servers |
| `/plugin` | Manage plugins |
| `/tasks` | View running background tasks |
| `/agents` | View available agents |

## Sources

- [Extend Claude Code (Features Overview)](https://code.claude.com/docs/en/features-overview)
- [How Claude Code Works](https://code.claude.com/docs/en/how-claude-code-works)
- [Skills](https://code.claude.com/docs/en/skills)
- [Subagents](https://code.claude.com/docs/en/sub-agents)
- [Agent Teams](https://code.claude.com/docs/en/agent-teams)
