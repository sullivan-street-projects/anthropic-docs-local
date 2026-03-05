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
| Skill names | `/review` | `/plugin:review` |
| Sharing | Manual copy | Install via marketplace |
| Best for | Personal, single project | Team/community distribution |
| Versioning | Via git | Semantic versioning |

## Plugin Directory Structure

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json          # Required manifest
├── skills/
│   └── skill-name/
│       └── SKILL.md
├── commands/
│   └── command-name.md      # Alias for skills
├── agents/
│   └── agent-name.md        # Custom agents
├── hooks/
│   └── hooks.json           # Event handlers
├── .mcp.json                # MCP servers
├── .lsp.json                # LSP servers
├── README.md
└── LICENSE
```

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

## Plugin Components

### Skills (`skills/skillname/SKILL.md`)
- Standard Agent Skills format with YAML frontmatter
- Namespaced: `/plugin-name:skill-name`
- Automatically discovered from directory names

### Agents (`agents/agent-name.md`)
- Custom subagent definitions
- Define when to use agent automatically via `description`
- Specify tools, permissions, and model

### Hooks (`hooks/hooks.json`)
- Same format as settings hooks
- Optional `description` field for documentation
- Scoped to plugin lifecycle

### MCP Servers (`.mcp.json`)
- Bundled external tool integrations
- Auto-start when plugin enables
- Require restart for changes

### LSP Servers (`.lsp.json`)
- Language server integrations for code intelligence
- Configure language-to-server mappings with extension rules
- Users must have language server binaries installed

```json
{
  "go": {
    "command": "gopls",
    "args": ["serve"],
    "extensionToLanguage": { ".go": "go" }
  }
}
```

### Settings (`settings.json`)
- Ship default configuration with plugin
- Currently supports `agent` key to set a custom agent as main thread
- Settings from `settings.json` take priority over `settings` in `plugin.json`

## Official Marketplace Submission

Submit plugins to the official Anthropic marketplace:
- Claude.ai: `claude.ai/settings/plugins/submit`
- Console: `platform.claude.com/plugins/submit`

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
claude --plugin-dir ./my-plugin
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

## Versioning

Semantic Versioning: `MAJOR.MINOR.PATCH`

Version constraints:
- `"1.0.0"` — exact version
- `"^1.0.0"` — compatible with 1.x.x
- `"~1.0.0"` — compatible with 1.0.x

## Official Plugins

The [claude-plugins-official](https://github.com/anthropics/claude-plugins-official) repository contains Anthropic's official plugins (7,509 stars). Additional knowledge work plugins are available at [knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins) (7,428 stars).

## Security Considerations

- Hooks execute with user permissions
- Validate all inputs in hook scripts
- Use absolute paths in commands
- Avoid exposing sensitive files
- Review plugin code before installation
- Recommend `plan` permission mode for initial review

## Sources

- [Plugins Guide](https://code.claude.com/docs/en/plugins)
- [Skills Documentation](https://code.claude.com/docs/en/skills)
