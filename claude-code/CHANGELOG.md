---
title: "Claude Code CHANGELOG"
source_url: "https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md"
source_type: "github-raw"
fetched_at: "2026-01-21T00:00:00Z"
category: "claude-code"
---

# Claude Code Changelog

The changelog documents Claude Code's evolution from version 0.2.21 through 2.1.15, tracking significant feature additions, bug fixes, and improvements.

## Latest Release: 2.1.15

### Highlights
- Deprecation notification for npm installations, with guidance toward alternative installation methods
- History-based autocomplete in bash mode using Tab completion
- Search functionality for installed plugins list
- Support for pinning plugins to specific git commit SHAs
- [VSCode] `/usage` command for displaying current plan usage

## Recent Major Releases

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
- Opus 4.5 and Haiku 4.5 model support with plan mode integration
- "Thinking mode" for deeper reasoning, now enabled by default for Opus 4.5
- Web search functionality
- Background agent support allowing concurrent work

### Development Tools
- Language Server Protocol (LSP) integration for code intelligence
- MCP (Model Context Protocol) server support with OAuth authentication
- Custom slash commands and subagents
- Plugin system with marketplace support
- Skills framework for specialized functionality

### Editor & IDE Features
- Native VS Code extension with streaming support
- File editing with word-level diffs
- Image handling improvements (clipboard paste, dimension metadata)
- Tab completion for shell commands
- Vim keybindings option

### User Interface
- Terminal renderer rewrite for smoother rendering
- Theme picker with syntax highlighting toggle
- Session management with `/resume` for conversation history
- Improved history search (Ctrl+R)
- Permission management interface redesign

## Notable Fixes

Recent updates addressed:
- Context window blocking limit was calculated too aggressively at ~65% instead of ~98%
- Memory leaks in long-running sessions
- Command injection vulnerability in bash processing
- Permission bypass via shell line continuation
- IME (Input Method Editor) support for CJK languages
- Word navigation for non-Latin scripts
- Permission rule validation for bash commands
- MCP tool visibility and permission handling
- Performance regressions and memory leaks
- Cross-platform compatibility (Windows ARM64, WSL)

## Platform Support

The tool expanded to support multiple endpoints (Bedrock, Vertex AI, Azure Foundry) and terminals (Kitty, Alacritty, Zed, Warp, WezTerm, Ghostty).
