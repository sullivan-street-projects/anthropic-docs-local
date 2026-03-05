---
title: "Claude Code Plugins"
source_url: "https://code.claude.com/docs/en/plugins"
source_type: "manual"
fetched_at: "2026-03-05T00:00:00Z"
category: "claude-code"
---

# Claude Code Plugins

Plugins are reusable, distributable packages of Claude Code extensions. They bundle skills, agents, hooks, MCP servers, and LSP servers into a single installable unit.

> **Last updated:** March 5, 2026

## Plugins vs Standalone Configuration

| Aspect | Standalone (`.claude/`) | Plugin |
|--------|------------------------|--------|
| Skill names | `/review` | `/plugin-name:review` |
| Sharing | Manual copy | Install via marketplace |
| Best for | Personal, single project | Team/community distribution |
| Versioning | Via git | Semantic versioning |
| Skill conflicts | Possible | Namespaced to avoid conflicts |

**Use standalone configuration when:**
- Customizing Claude Code for a single project
- Configuration is personal and doesn't need sharing
- Experimenting with skills or hooks before packaging
- You want short skill names like `/hello`

**Use plugins when:**
- Sharing functionality with your team or community
- Needing the same skills/agents across multiple projects
- You want version control and easy updates
- Distributing through a marketplace

## Plugin Directory Structure

```
my-plugin/
.claude-plugin/
    plugin.json          # Required manifest (ONLY plugin.json goes here)
skills/
    skill-name/
        SKILL.md
commands/
    command-name.md      # Alias for skills
agents/
    agent-name.md        # Custom agents
hooks/
    hooks.json           # Event handlers
.mcp.json                # MCP servers
.lsp.json                # LSP servers
settings.json            # Default settings applied when plugin enabled
README.md
LICENSE
```

> **Important:** Do not put `commands/`, `agents/`, `skills/`, or `hooks/` inside `.claude-plugin/`. Only `plugin.json` goes inside `.claude-plugin/`. All other directories must be at the plugin root level.

## Plugin Manifest (`plugin.json`)

### Minimal

```json
{
  "name": "my-plugin",
  "description": "What this plugin does",
  "version": "1.0.0",
  "author": { "name": "Your Name" }
}
```

### Complete Schema

```json
{
  "name": "plugin-id",
  "displayName": "Display Name",
  "description": "One-liner description",
  "longDescription": "Detailed description",
  "version": "1.0.0",
  "author": {
    "name": "Author Name",
    "email": "email@example.com",
    "url": "https://example.com"
  },
  "homepage": "https://example.com",
  "repository": { "type": "git", "url": "https://github.com/..." },
  "license": "MIT",
  "keywords": ["keyword1", "keyword2"],
  "components": {
    "skills": "skills/",
    "agents": "agents/",
    "commands": "commands/",
    "hooks": "hooks/hooks.json",
    "mcpServers": ".mcp.json"
  }
}
```

| Field | Purpose |
|-------|---------|
| `name` | Unique identifier and skill namespace. Skills prefixed with this (e.g., `/my-plugin:hello`). |
| `description` | Shown in plugin manager when browsing or installing. |
| `version` | Track releases using semantic versioning. |
| `author` | Optional. Helpful for attribution. |

## Plugin Components

### Skills (`skills/skillname/SKILL.md`)
- Standard Agent Skills format with YAML frontmatter
- Namespaced: `/plugin-name:skill-name`
- Automatically discovered from directory names
- Need `name` and `description` fields in frontmatter

```yaml
---
name: code-review
description: Reviews code for best practices and potential issues. Use when reviewing code, checking PRs, or analyzing code quality.
---

When reviewing code, check for:
1. Code organization and structure
2. Error handling
3. Security concerns
4. Test coverage
```

### Agents (`agents/agent-name.md`)
- Custom subagent definitions
- Define when to use agent automatically via `description`
- Specify tools, permissions, and model

### Hooks (`hooks/hooks.json`)
- Same format as settings hooks
- Optional `description` field for documentation
- Scoped to plugin lifecycle
- Hook input arrives as JSON on stdin; use `jq` to extract fields

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [{ "type": "command", "command": "jq -r '.tool_input.file_path' | xargs npm run lint:fix" }]
      }
    ]
  }
}
```

### MCP Servers (`.mcp.json`)
- Bundled external tool integrations
- Auto-start when plugin enables
- Require restart for changes
- Use `${CLAUDE_PLUGIN_ROOT}` for plugin-relative paths
- Support stdio, SSE, and HTTP transports

### LSP Servers (`.lsp.json`)
- Language server integrations for code intelligence
- Users must have the language server binary installed
- Use pre-built LSP plugins from official marketplace for common languages

```json
{
  "go": {
    "command": "gopls",
    "args": ["serve"],
    "extensionToLanguage": {
      ".go": "go"
    }
  }
}
```

### Default Settings (`settings.json`)
- Apply default configuration when plugin is enabled
- Currently only the `agent` key is supported
- Setting `agent` activates one of the plugin's custom agents as the main thread

```json
{
  "agent": "security-reviewer"
}
```

## Installation & Management

```bash
# Install from marketplace
/plugin install <plugin-name>
/plugin install github:author/repo

# Manage plugins
/plugin list
/plugin disable <plugin-name>
/plugin enable <plugin-name>
/plugin update <plugin-name>
/plugin uninstall <plugin-name>
```

### Local Testing

```bash
# Load a single plugin
claude --plugin-dir ./my-plugin

# Load multiple plugins
claude --plugin-dir ./plugin-one --plugin-dir ./plugin-two
```

## Marketplace

### Marketplace File Format

```json
{
  "version": "1",
  "plugins": [
    {
      "name": "my-plugin",
      "displayName": "My Plugin",
      "description": "Description",
      "source": "github:owner/repo",
      "tags": ["productivity", "development"]
    }
  ]
}
```

### Hosting Options
- GitHub repositories (recommended)
- Git services (GitLab, Gitea, etc.)
- Local paths
- Remote URLs

### Managing Marketplaces

```bash
/plugin marketplace add https://raw.githubusercontent.com/.../marketplace.json
/plugin marketplace list
```

### Auto-Update Configuration

```json
{
  "extraKnownMarketplaces": ["url"],
  "strictKnownMarketplaces": false
}
```

### Submitting to Official Marketplace

Submit via in-app forms:
- **Claude.ai**: [claude.ai/settings/plugins/submit](https://claude.ai/settings/plugins/submit)
- **Console**: [platform.claude.com/plugins/submit](https://platform.claude.com/plugins/submit)

## Versioning

Semantic Versioning: `MAJOR.MINOR.PATCH`

Version constraints:
- `"1.0.0"` -- exact version
- `"^1.0.0"` -- compatible with 1.x.x
- `"~1.0.0"` -- compatible with 1.0.x

## Converting Standalone Config to Plugin

1. Create plugin directory with `.claude-plugin/plugin.json` manifest
2. Copy `commands/`, `agents/`, `skills/` from `.claude/` to plugin root
3. Move hooks from `settings.json` to `hooks/hooks.json`
4. Test with `claude --plugin-dir ./my-plugin`
5. Remove originals from `.claude/` to avoid duplicates

## Official Plugins

The [claude-plugins-official](https://github.com/anthropics/claude-plugins-official) repository contains Anthropic's official plugins. Additional knowledge work plugins are available at [knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins).

## Security Considerations

- Hooks execute with user permissions
- Validate all inputs in hook scripts
- Use absolute paths in commands
- Avoid exposing sensitive files
- Review plugin code before installation
- Recommend `plan` permission mode for initial review

## Debugging Plugin Issues

1. **Check the structure**: Ensure directories are at plugin root, not inside `.claude-plugin/`
2. **Test components individually**: Check each command, agent, and hook separately
3. **Use validation tools**: See Plugins reference for CLI commands and troubleshooting

## Sources

- [Create Plugins](https://code.claude.com/docs/en/plugins)
- [Discover and Install Plugins](https://code.claude.com/docs/en/discover-plugins)
- [Plugins Reference](https://code.claude.com/docs/en/plugins-reference)
- [Plugin Marketplaces](https://code.claude.com/docs/en/plugin-marketplaces)
- [Skills Documentation](https://code.claude.com/docs/en/skills)
