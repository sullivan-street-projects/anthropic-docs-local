---
title: "Claude Code CHANGELOG"
source_url: "https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md"
source_type: "github-raw"
fetched_at: "2026-01-04T05:43:46Z"
category: "claude-code"
---

# Claude Code Changelog

The changelog documents Claude Code's evolution from version 0.2.21 through 2.0.74, tracking significant feature additions, bug fixes, and improvements.

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
- IME (Input Method Editor) support for CJK languages
- Word navigation for non-Latin scripts
- Permission rule validation for bash commands
- MCP tool visibility and permission handling
- Performance regressions and memory leaks
- Cross-platform compatibility (Windows ARM64, WSL)

## Platform Support

The tool expanded to support multiple endpoints (Bedrock, Vertex AI, Azure Foundry) and terminals (Kitty, Alacritty, Zed, Warp, WezTerm, Ghostty).
