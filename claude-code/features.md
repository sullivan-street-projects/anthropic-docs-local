---
title: "Claude Code Features"
source_url: "https://code.claude.com/docs/en/features-overview"
source_type: "manual"
fetched_at: "2026-02-16T00:00:00Z"
category: "claude-code"
---

# Claude Code Features

Comprehensive overview of Claude Code's features and capabilities. Claude Code is a terminal-based agentic coding tool that runs in your development environment.

> **Last updated:** February 16, 2026

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
| Task | Spawn subagents for isolated, parallel execution |
| TodoWrite | Structured task tracking |
| AskUserQuestion | Interactive user prompts with options |
| NotebookEdit | Jupyter notebook cell editing |

## Vision & Multimodal

- Analyze screenshots, diagrams, mockups, and visual content
- Process PDF documents (up to 20 pages per request)
- Read and edit Jupyter notebooks with outputs
- Image file support (PNG, JPG, etc.)

## Extended Thinking

Claude reasons through complex problems with step-by-step internal reasoning. With Opus 4.6, adaptive thinking is available — Claude automatically adjusts reasoning depth based on task complexity.

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

## Chrome Integration

- Browser automation and web testing via Playwright MCP
- Form filling and data extraction
- Screenshot and GIF recording
- Multi-site workflows

## Platform Support

| Platform | Description |
|----------|-------------|
| Terminal CLI | Primary interface (`claude` command) |
| VS Code Extension | IDE integration |
| JetBrains Plugin | IDE integration |
| Claude Code on the Web | Cloud-hosted environment |
| GitHub Actions | CI/CD automation via `claude-code-action` |
| GitLab CI/CD | Pipeline integration |

## Agent Teams (Experimental)

Coordinate multiple independent Claude sessions working on related tasks:
- Shared task boards for coordination
- Inter-agent messaging
- Parallel execution across git worktrees
- Quality gates and verification

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

## CLAUDE.md (Project Memory)

Persistent instructions loaded every session:

| Location | Scope |
|----------|-------|
| `~/.claude/CLAUDE.md` | User-wide (all projects) |
| `CLAUDE.md` | Project root |
| `.claude/CLAUDE.md` | Nested subdirectories |

- Supports `@path` imports for splitting large configs
- Best kept under 500 lines; move reference material to skills

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

## Sources

- [Features Overview](https://code.claude.com/docs/en/features-overview)
- [Common Workflows](https://code.claude.com/docs/en/common-workflows)
- [How Claude Code Works](https://code.claude.com/docs/en/how-claude-code-works)
