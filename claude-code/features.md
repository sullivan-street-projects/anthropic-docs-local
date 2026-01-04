---
title: "Claude Code Features"
source_url: "claude-code-guide-agent"
source_type: "manual"
fetched_at: "2026-01-04T06:15:00Z"
category: "claude-code"
---

# Claude Code Features

Claude Code is Anthropic's agentic coding tool that lives in your terminal and helps you turn ideas into code faster than ever before.

## Core Capabilities

### 1. Code Editing and File Manipulation

- **Read files**: View any file in your project
- **Edit files**: Make targeted, precise edits to specific files
- **Create files**: Generate new files with full content
- **Jupyter notebooks**: Modify notebook cells directly

### 2. Code Search and Navigation

- **Glob pattern matching**: Find files by name patterns (e.g., `**/*.js`)
- **Grep/Ripgrep search**: Search for patterns in file contents with full regex support
- **File discovery**: Quickly locate relevant code across your codebase

### 3. Command Execution

- **Bash execution**: Run shell commands with permission control
- **Background tasks**: Run long-running commands without blocking
- **Output retrieval**: Fetch output from background processes
- **Environment variable persistence**: Configure environment across sessions

### 4. Git Integration

- **Commit creation**: Generate and create git commits
- **Branch management**: Work with branches and worktrees
- **Pull request creation**: Generate and open pull requests
- **Diff viewing**: See changes with IDE integration

### 5. Web and External Tools

- **Web search**: Perform web searches with domain filtering
- **Web fetch**: Retrieve and process content from URLs
- **MCP integration**: Connect to external tools and data sources

## CLI Reference

### Basic Commands

| Command | Description |
|---------|-------------|
| `claude` | Start interactive REPL |
| `claude "query"` | Start REPL with initial prompt |
| `claude -p "query"` | Query via SDK, then exit |
| `cat file \| claude -p "query"` | Process piped content |
| `claude -c` | Continue most recent conversation |
| `claude -r "<session>"` | Resume session by ID or name |
| `claude update` | Update to latest version |

### Essential Flags

| Flag | Purpose |
|------|---------|
| `-p, --print` | Print response without interactive mode |
| `-c, --continue` | Load most recent conversation |
| `-r, --resume` | Resume session by ID or name |
| `--model` | Set the model for this session |
| `--permission-mode` | Begin in specified permission mode |
| `--add-dir` | Add additional working directories |
| `--tools` | Specify available tools |
| `--append-system-prompt` | Append to default system prompt |
| `--debug` | Enable debug mode |
| `--output-format` | Output format (text, json, stream-json) |

## Interactive Mode Shortcuts

### General Controls

| Shortcut | Description |
|----------|-------------|
| `Ctrl+C` | Cancel current input or generation |
| `Ctrl+D` | Exit Claude Code session |
| `Ctrl+L` | Clear terminal screen |
| `Ctrl+O` | Toggle verbose output |
| `Ctrl+R` | Reverse search command history |
| `Ctrl+V` | Paste image from clipboard |
| `Up/Down` | Navigate command history |
| `Esc + Esc` | Rewind code/conversation |
| `Shift+Tab` | Toggle permission modes |
| `Option+P` | Switch model |

### Quick Commands

| Shortcut | Description |
|----------|-------------|
| `#` at start | Add to CLAUDE.md memory file |
| `/` at start | Invoke slash command |
| `!` at start | Bash mode (run commands directly) |
| `@` | Trigger file path autocomplete |

## Slash Commands

Essential commands available during interactive sessions:

| Command | Purpose |
|---------|---------|
| `/help` | Get usage help |
| `/config` | Open Settings interface |
| `/status` | Show version, model, account |
| `/cost` | Show token usage statistics |
| `/model` | Select or change AI model |
| `/agents` | Manage custom AI subagents |
| `/memory` | Edit CLAUDE.md memory files |
| `/permissions` | View or update permissions |
| `/mcp` | Manage MCP server connections |
| `/compact` | Compact conversation |
| `/context` | Visualize current context usage |
| `/rewind` | Rewind conversation and/or code |
| `/resume` | Resume a previous conversation |
| `/clear` | Clear conversation history |
| `/vim` | Enter vim mode |
| `/sandbox` | Enable sandboxed bash execution |
| `/export` | Export conversation to file |

## IDE Integrations

### VS Code Extension

**Installation**: `Cmd+Shift+P` → Search "Claude Code" → Install

**Key Features**:
- Graphical chat interface with plan review
- Inline diff viewing
- @-mention files with line ranges
- Multiple conversations in tabs/windows
- Auto-accept edits

**Shortcuts**:
- `Cmd+Esc` / `Ctrl+Esc`: Focus Input
- `Cmd+Shift+Esc` / `Ctrl+Shift+Esc`: Open in New Tab
- `Alt+K`: Insert @-Mention

### JetBrains IDE Integration

**Supported IDEs**: IntelliJ IDEA, PyCharm, Android Studio, WebStorm, PhpStorm, GoLand

**Features**:
- Quick launch with `Cmd+Esc` / `Ctrl+Esc`
- IDE diff viewer for code changes
- Selection/tab context sharing
- Diagnostic sharing

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
    "allow": ["Bash(npm run:*)", "Bash(git:*)"],
    "deny": ["Read(./.env)", "Bash(curl:*)"]
  },
  "env": {
    "CUSTOM_VAR": "value"
  }
}
```

## Advanced Features

### Extended Thinking

Enable reasoning for complex problems:

```bash
claude --model opus -p "ultrathink: design architecture..."
```

### Sandboxing

Isolate bash commands from filesystem and network:

```json
{
  "sandbox": {
    "enabled": true,
    "autoAllowBashIfSandboxed": true
  }
}
```

### Plan Mode

Analyze codebase safely without making changes:

```bash
claude --permission-mode plan
```

## Common Workflows

### Understanding a New Codebase

```bash
> give me an overview of this codebase
> explain the main architecture patterns
> what are the key data models?
```

### Fixing Bugs

```bash
> I'm seeing this error when I run npm test:
[error details]
> suggest ways to fix this issue
```

### Creating Pull Requests

```bash
> summarize the changes I've made
> create a pr
```

### Working with Images

```bash
# Paste or drop images
> What does this image show?
> Generate CSS to match this design mockup
```

## Resources

- **Documentation**: https://code.claude.com/docs
- **GitHub**: https://github.com/anthropics/claude-code
- **Security**: https://code.claude.com/docs/en/security
