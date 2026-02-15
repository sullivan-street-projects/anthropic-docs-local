---
title: "Claude Code CHANGELOG"
source_url: "https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md"
source_type: "github-raw"
fetched_at: "2026-02-14T00:00:00Z"
category: "claude-code"
---

# Claude Code Changelog

The changelog documents Claude Code's evolution from version 0.2.21 through 2.1.42, tracking significant feature additions, bug fixes, and improvements.

## Latest Release: 2.1.42

### Highlights
- Improved startup performance by deferring Zod schema construction
- Improved prompt cache hit rates by moving date out of system prompt
- Added one-time Opus 4.6 effort callout for eligible users
- Fixed /resume showing interrupt messages as session titles

### 2.1.41
- Added guard against launching Claude Code inside another Claude Code session
- Fixed Agent Teams using wrong model identifier for Bedrock, Vertex, and Foundry
- Added `claude auth login`, `claude auth status`, and `claude auth logout` CLI subcommands
- Added Windows ARM64 (win32-arm64) native binary support
- Improved `/rename` to auto-generate session name from conversation context
- Fixed @-mentions with anchor fragments, FileReadTool blocking on FIFOs, background task notifications in Agent SDK streaming
- Added `speed` attribute to OTel events and trace spans for fast mode visibility

### 2.1.39
- Improved terminal rendering performance
- Fixed fatal errors being swallowed, process hanging after session close, character loss at terminal boundary

### 2.1.38
- Fixed VS Code terminal scroll-to-top regression
- Improved heredoc delimiter parsing to prevent command smuggling
- Blocked writes to `.claude/skills` directory in sandbox mode

### 2.1.36
- **Fast mode is now available for Opus 4.6**

### 2.1.34
- Fixed crash when agent teams setting changed between renders
- Fixed sandbox bypass when `autoAllowBashIfSandboxed` was enabled

### 2.1.33
- Fixed agent teammate sessions in tmux to send and receive messages
- Added `TeammateIdle` and `TaskCompleted` hook events for multi-agent workflows
- Added support for restricting sub-agents via `Task(agent_type)` syntax in agent "tools" frontmatter
- Added `memory` frontmatter field for agents with `user`, `project`, or `local` scope
- Added plugin name to skill descriptions and `/skills` menu
- VSCode: Added support for remote sessions (OAuth users can browse/resume sessions from claude.ai)
- VSCode: Added git branch and message count to session picker with branch name search

### 2.1.32
- **Claude Opus 4.6 is now available!**
- Research preview agent teams feature for multi-agent collaboration (requires `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`)
- Claude now automatically records and recalls memories as it works
- Added "Summarize from here" to message selector for partial conversation summarization
- Skills defined in `.claude/skills/` within additional directories (`--add-dir`) are now loaded automatically
- Skill character budget now scales with context window (2% of context)

### 2.1.31
- Added session resume hint on exit
- Fixed PDF too large errors permanently locking up sessions
- Fixed bash commands incorrectly reporting "Read-only file system" errors in sandbox mode
- Improved system prompts to guide model toward using dedicated tools instead of bash equivalents

### 2.1.30
- Added `pages` parameter to Read tool for PDFs (e.g., `pages: "1-5"`)
- Large PDFs (>10 pages) now return lightweight reference when `@` mentioned
- Added pre-configured OAuth client credentials for MCP servers without Dynamic Client Registration
- Added `/debug` command for troubleshooting
- Improved memory usage for `--resume` (68% reduction)

### 2.1.29
- Fixed startup performance issues when resuming sessions with saved hook context
- Resolved VSCode OAuth token expiration causing 401 errors

## Recent Major Releases

### 2.1.23
- Customizable spinner verbs setting for personalized feedback
- Optimized terminal rendering performance with improved screen data layout
- Fixed mTLS and proxy connectivity for corporate environments
- Fixed per-user temp directory isolation on shared systems
- Fixed race condition causing 400 errors with prompt caching
- Fixed tab completion not updating input field properly
- Fixed ripgrep search timeouts silently failing

### 2.1.21
- Enhanced reading/search progress indicators showing real-time status
- Automatic Python virtual environment activation in VSCode
- Fixed message action button background colors

### 2.1.20
- PR review status indicator in prompt footer showing approval state
- External editor shortcut (Ctrl+G) for prompt editing
- Support for loading CLAUDE.md files from additional directories

### 2.1.15
- Deprecation notification for npm installations, with guidance toward alternative installation methods
- History-based autocomplete in bash mode using Tab completion
- Search functionality for installed plugins list
- Support for pinning plugins to specific git commit SHAs
- [VSCode] `/usage` command for displaying current plan usage

### 2.1.3
- Merged slash commands and skills, simplifying the mental model with no change in behavior
- Added release channel (`stable` or `latest`) toggle to `/config`
- Added detection and warnings for unreachable permission rules
- Fixed plan files persisting across `/clear` commands
- Improved terminal rendering stability
- Changed tool hook execution timeout from 60 seconds to 10 minutes
- [VSCode] Added clickable destination selector for permission requests

### 2.1.2
- Clickable hyperlinks for file paths in tool output (OSC 8 terminals)
- Windows Package Manager (winget) installation support
- Shift+Tab shortcut in plan mode for quick "auto-accept edits"
- Fixed command injection vulnerability in bash command processing
- Fixed memory leak in tree-sitter parse trees

### 2.1.0
- Automatic skill hot-reload for ~/.claude/skills and .claude/skills
- Support for `context: fork` in skill frontmatter
- Language setting for Claude's response language
- Web search in sub-agents
- New Vim motions: `;`, `,`, `y`, `p`/`P`, text objects, `>>`, `<<`, `J`
- `/plan` command shortcut
- `CLAUDE_CODE_FILE_READ_MAX_OUTPUT_TOKENS` environment variable

### 2.0.76 - 2.0.74
- LSP (Language Server Protocol) tool for code intelligence
- Terminal setup support for Kitty, Alacritty, Zed, and Warp
- Syntax highlighting improvements

## Major Features Added

### AI & Model Capabilities
- **Fast mode for Opus 4.6** — same model, faster output
- **Opus 4.6**, Opus 4.5 and Haiku 4.5 model support with plan mode integration
- Automatic memory recording and recall during work sessions
- Agent teams (research preview) for multi-agent collaboration
- Agent `memory` frontmatter field for persistent memory with user/project/local scope
- `TeammateIdle` and `TaskCompleted` hook events for multi-agent workflows
- "Thinking mode" for deeper reasoning, now enabled by default for Opus 4.5
- Web search functionality
- Background agent support allowing concurrent work

### Development Tools
- Language Server Protocol (LSP) integration for code intelligence
- MCP (Model Context Protocol) server support with OAuth authentication
- Custom slash commands and subagents
- Plugin system with marketplace support
- Skills framework for specialized functionality
- `claude auth` CLI subcommands (login, status, logout)

### Editor & IDE Features
- Native VS Code extension with streaming support and remote session browsing
- File editing with word-level diffs
- Image handling improvements (clipboard paste, dimension metadata)
- Tab completion for shell commands
- Vim keybindings option

### User Interface
- Terminal renderer rewrite for smoother rendering
- Theme picker with syntax highlighting toggle
- Session management with `/resume` for conversation history
- `/rename` auto-generates session name from conversation context
- Improved history search (Ctrl+R)
- Permission management interface redesign

## Notable Fixes

Recent updates addressed:
- Context window blocking limit was calculated too aggressively at ~65% instead of ~98%
- Memory leaks in long-running sessions and abort signal handling
- Command injection vulnerability in bash processing
- Heredoc delimiter parsing to prevent command smuggling
- Sandbox bypass when `autoAllowBashIfSandboxed` was enabled
- Permission bypass via shell line continuation
- IME (Input Method Editor) support for CJK languages
- Word navigation for non-Latin scripts
- Permission rule validation for bash commands
- MCP tool visibility and permission handling
- Performance regressions and memory leaks
- Cross-platform compatibility (Windows ARM64, WSL)
- Agent Teams model identifier for Bedrock, Vertex, and Foundry

## Platform Support

The tool expanded to support multiple endpoints (Bedrock, Vertex AI, Azure Foundry) and terminals (Kitty, Alacritty, Zed, Warp, WezTerm, Ghostty). Windows ARM64 native binary support was added in 2.1.41.
