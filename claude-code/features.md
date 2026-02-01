---
title: "Claude Code Features"
source_url: "claude-code-guide-agent"
source_type: "manual"
fetched_at: "2026-01-31T00:00:00Z"
category: "claude-code"
---

# Claude Code Features

Claude Code is Anthropic's agentic coding tool that lives in your terminal and helps you turn ideas into code faster than ever before.

## Core Capabilities

### 1. Code Editing and File Manipulation

- **Read files**: View any file in your project
- **Edit files**: Make targeted, precise edits with word-level diffs
- **Create files**: Generate new files with full content
- **Jupyter notebooks**: Modify notebook cells directly

### 2. Code Search and Navigation

- **Glob pattern matching**: Find files by name patterns (e.g., `**/*.js`)
- **Grep/Ripgrep search**: Search for patterns in file contents with full regex support
- **File discovery**: Quickly locate relevant code across your codebase
- **LSP integration**: Go to definition and find references via Language Server Protocol

### 3. Command Execution

- **Bash execution**: Run shell commands with permission control
- **Background tasks**: Run long-running commands without blocking (`Ctrl+B`)
- **Output retrieval**: Fetch output from background processes
- **Environment variable persistence**: Configure environment across sessions

### 4. Git Integration

- **Commit creation**: Generate and create git commits
- **Branch management**: Work with branches and worktrees
- **Pull request creation**: Generate and open pull requests via `gh`
- **Diff viewing**: See changes with IDE integration
- **PR session linking**: Link sessions to PRs with `--from-pr`

### 5. Web and External Tools

- **Web search**: Perform web searches with domain filtering
- **Web fetch**: Retrieve and process content from URLs
- **MCP integration**: Connect to external tools and data sources
- **Web search in sub-agents**: Sub-agents can search the web independently

## CLI Reference

### Basic Commands

| Command | Description | Example |
|---------|-------------|---------|
| `claude` | Start interactive REPL | `claude` |
| `claude "query"` | Start REPL with initial prompt | `claude "fix the login bug"` |
| `claude -p "query"` | Query via SDK/print mode, then exit | `claude -p "explain this error"` |
| `cat file \| claude -p "query"` | Process piped content | `cat error.log \| claude -p "analyze"` |
| `claude -c` | Continue most recent conversation | `claude -c` |
| `claude -r "<session>"` | Resume session by ID or name | `claude -r my-feature` |
| `claude update` | Update to latest version | `claude update` |
| `claude mcp` | Configure MCP servers | See MCP documentation |

### Essential Flags

| Flag | Purpose |
|------|---------|
| `-p, --print` | Print response without interactive mode |
| `-c, --continue` | Load most recent conversation |
| `-r, --resume` | Resume session by ID or name |
| `--model` | Set the model (alias: `sonnet`, `opus`, `haiku`) |
| `--permission-mode` | Begin in specified mode (`plan`, `default`, `acceptEdits`) |
| `--add-dir` | Add additional working directories |
| `--tools` | Restrict available tools |
| `--allowedTools` | Tools that execute without permission prompts |
| `--disallowedTools` | Tools removed from model context |
| `--append-system-prompt` | Append to default system prompt |
| `--system-prompt` | Replace entire system prompt |
| `--debug` | Enable debug mode with optional category filtering |
| `--verbose` | Enable verbose logging |
| `--output-format` | Output format (`text`, `json`, `stream-json`) |
| `--max-turns` | Limit number of agentic turns |
| `--max-budget-usd` | Maximum dollar amount before stopping |
| `--json-schema` | Get validated JSON output matching schema |
| `--fallback-model` | Enable automatic fallback when overloaded |
| `--mcp-config` | Load MCP servers from JSON file |
| `--plugin-dir` | Load plugins from directories |
| `--remote` | Create web session on claude.ai |
| `--teleport` | Resume web session in local terminal |
| `--from-pr` | Resume sessions linked to GitHub PR |
| `--agents` | Define custom subagents via JSON |
| `--chrome` | Enable Chrome browser integration |
| `--dangerously-skip-permissions` | Skip all permission prompts |

## Interactive Mode Shortcuts

### General Controls

| Shortcut | Description |
|----------|-------------|
| `Ctrl+C` | Cancel current input or generation |
| `Ctrl+D` | Exit Claude Code session |
| `Ctrl+G` | Open prompt in external text editor |
| `Ctrl+L` | Clear terminal screen |
| `Ctrl+O` | Toggle verbose output |
| `Ctrl+R` | Reverse search command history |
| `Ctrl+V` / `Cmd+V` | Paste image from clipboard |
| `Ctrl+B` | Background running tasks |
| `Ctrl+T` | Toggle task list visibility |
| `Up/Down` | Navigate command history |
| `Left/Right` | Cycle through dialog tabs |
| `Esc + Esc` | Rewind code/conversation |
| `Shift+Tab` / `Alt+M` | Toggle permission modes |
| `Option+P` / `Alt+P` | Switch model |
| `Option+T` / `Alt+T` | Toggle extended thinking |

### Text Editing

| Shortcut | Description |
|----------|-------------|
| `Ctrl+K` | Delete to end of line |
| `Ctrl+U` | Delete entire line |
| `Ctrl+Y` | Paste deleted text |
| `Alt+B` | Move cursor back one word |
| `Alt+F` | Move cursor forward one word |

### Multiline Input

| Method | Shortcut |
|--------|----------|
| Quick escape | `\` + `Enter` |
| macOS default | `Option+Enter` |
| Shift+Enter | iTerm2, WezTerm, Ghostty, Kitty |
| Control sequence | `Ctrl+J` |

### Quick Commands

| Shortcut | Description |
|----------|-------------|
| `#` at start | Add to CLAUDE.md memory file |
| `/` at start | Invoke slash command or skill |
| `!` at start | Bash mode (run commands directly) |
| `@` | Trigger file path autocomplete |
| `?` | Help menu |

## Slash Commands

Essential commands available during interactive sessions:

| Command | Purpose |
|---------|---------|
| `/help` | Get usage help |
| `/config` | Open Settings interface |
| `/status` | Show version, model, account |
| `/cost` | Show token usage statistics |
| `/usage` | Show plan usage limits and rate limit status |
| `/model` | Select or change AI model |
| `/agents` | Manage custom AI subagents |
| `/memory` | Edit CLAUDE.md memory files |
| `/permissions` | View or update permissions |
| `/mcp` | Manage MCP server connections |
| `/compact` | Compact conversation with optional focus |
| `/context` | Visualize current context usage |
| `/rewind` | Rewind conversation and/or code |
| `/resume` | Resume a previous conversation |
| `/clear` | Clear conversation history |
| `/plan` | Enter plan mode directly |
| `/vim` | Enter vim mode |
| `/sandbox` | Enable sandboxed bash execution |
| `/export` | Export conversation to file |
| `/copy` | Copy last assistant response to clipboard |
| `/rename` | Rename current session |
| `/tasks` | List and manage background tasks |
| `/todos` | List current TODO items |
| `/stats` | Visualize daily usage and session history |
| `/theme` | Change color theme |
| `/doctor` | Check health of Claude Code installation |
| `/plugin` | Manage plugins |
| `/keybindings` | Create or open keybindings configuration |
| `/teleport` | Resume remote session from claude.ai |
| `/statusline` | Set up status line UI |

## IDE Integrations

### VS Code Extension

**Installation**: `Cmd+Shift+X` / `Ctrl+Shift+X` → Search "Claude Code"

**Key Features**:
- Graphical chat interface with inline diffs
- Permission modes: Normal, Plan, Auto-Accept
- Multi-tab conversations
- @-mention files with line ranges (`@app.ts#5-10`)
- Resume remote sessions from claude.ai
- Plugin management UI
- Session picker with search

**VS Code Shortcuts**:

| Command | Shortcut |
|---------|----------|
| Focus Input | `Cmd+Esc` / `Ctrl+Esc` |
| Open in New Tab | `Cmd+Shift+Esc` / `Ctrl+Shift+Esc` |
| New Conversation | `Cmd+N` / `Ctrl+N` |
| Insert @-Mention | `Option+K` / `Alt+K` |

**Extension Settings**:
- `selectedModel`: Default model
- `useTerminal`: Launch in terminal mode
- `initialPermissionMode`: Control approval prompts
- `preferredLocation`: Panel placement
- `autosave`: Auto-save files before Claude reads/writes

### JetBrains IDE Integration

**Supported IDEs**: IntelliJ IDEA, PyCharm, WebStorm, CLion, GoLand, AppCode

**Features**:
- Quick launch with `Cmd+Esc` / `Ctrl+Esc`
- IDE diff viewer for code changes
- Selection/tab context sharing
- Diagnostic sharing
- Remote Development and WSL support

## Configuration

### Settings Hierarchy (Precedence Order)

1. **Enterprise** (highest) - System-wide policies
2. **Command line arguments** - Temporary overrides
3. **Local** (`.claude/settings.local.json`) - Personal project overrides
4. **Project** (`.claude/settings.json`) - Team-shared settings
5. **User** (`~/.claude/settings.json`) - Personal global settings

### Common Settings

```json
{
  "model": "opus",
  "permissions": {
    "defaultMode": "plan",
    "allow": ["Bash(npm run:*)", "Bash(git:*)", "Read"],
    "deny": ["Read(./.env)", "Bash(rm -rf *)"]
  },
  "env": {
    "CUSTOM_VAR": "value"
  }
}
```

### Permission Modes

- **Normal** (default): Claude asks permission for each action
- **Plan Mode**: Read-only analysis, plan before implementation
- **Auto-Accept**: Claude makes edits without asking
- **Bypass**: Skip all permission prompts (use with caution)

### Keybindings Configuration

Customize shortcuts in `~/.claude/keybindings.json`:

```json
{
  "bindings": [
    {
      "context": "Chat",
      "bindings": {
        "ctrl+e": "chat:externalEditor",
        "ctrl+u": null
      }
    }
  ]
}
```

## Advanced Features

### Extended Thinking

Claude reserves up to 31,999 tokens for internal reasoning on complex problems.

- Toggle: `Option+T` / `Alt+T`
- View: Press `Ctrl+O` for verbose mode
- Limit: `MAX_THINKING_TOKENS` environment variable
- Default enabled for Opus 4.5

### Plan Mode

Safe code analysis with read-only operations:

```bash
claude --permission-mode plan
```

Features: Read-only analysis, `AskUserQuestion` for clarification, `Ctrl+G` to edit plan in external editor.

### Sandboxing

Protect against prompt injection and malicious code:

```json
{
  "sandbox": {
    "enabled": true
  }
}
```

### Background Tasks

- Press `Ctrl+B` to background current command
- `Ctrl+T` to toggle task list visibility
- `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1` to disable

### LSP Integration

Language Server Protocol for code intelligence:
- Go to definition
- Find references
- More precise navigation for Claude

### Skills and Slash Commands

Create custom skills in `~/.claude/skills/` or `.claude/skills/`:

```yaml
---
name: my-skill
description: What this skill does
allowed-tools: Read, Grep
---

Instructions for Claude...
```

Features: `context: fork` for subagent isolation, `$ARGUMENTS` for parameters, auto hot-reload (v2.1.0+).

### Plugins

Bundle skills, hooks, agents, and MCP servers into installable units. Install via `/plugin` menu or `claude plugin install`.

### Subagents

Isolated workers for specialized tasks:
- Automatic delegation to specialized agents
- Run in foreground or background
- Define via `/agents` or `--agents` flag

### Output Styles

Customize Claude's communication style:

```bash
mkdir -p ~/.claude/output-styles/my-style
# Create STYLE.md with name, description, and instructions
```

### Vim Mode

Enable with `/vim` command:
- Mode switching: `Esc` (NORMAL), `i/I/a/A/o/O` (INSERT)
- Navigation: `h/j/k/l`, `w/e/b`, `0/$`, `gg/G`, `f{char}`
- Editing: `x`, `dd`, `dw`, `cc`, `yy`, `p/P`, `>>`, `<<`, `J`
- Text objects: `iw/aw`, `i"/a"`, `i(/a(`, `i{/a{`

## Common Workflows

### Understanding a New Codebase

```
> give me an overview of this codebase
> explain the main architecture patterns
> what are the key data models?
```

### Fixing Bugs

```
> I'm seeing this error when I run npm test:
[error details]
> suggest ways to fix this issue
```

### Creating Pull Requests

```
> summarize the changes I've made
> create a pr
```

### Working with Images

```
# Paste or drop images into CLI with Ctrl+V
> What does this image show?
> Generate CSS to match this design mockup
```

### Using Git Worktrees

```bash
git worktree add ../project-feature-a -b feature-a
cd ../project-feature-a && claude
```

## Resources

- **Documentation**: https://code.claude.com/docs
- **GitHub**: https://github.com/anthropics/claude-code
- **Security**: https://code.claude.com/docs/en/security
