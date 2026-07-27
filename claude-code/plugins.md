---
title: "Claude Code Plugins"
source_url: "https://code.claude.com/docs/en/plugins"
source_type: "manual"
fetched_at: "2026-07-27T00:00:00Z"
category: "claude-code"
---

# Claude Code Plugins

Plugins are reusable, distributable packages of Claude Code extensions. They bundle skills, agents, hooks, MCP servers, LSP servers, background monitors, and default settings into a single installable unit.

> **Last updated:** July 27, 2026

## Plugins vs Standalone Configuration

| Aspect          | Standalone (`.claude/`)  | Plugin                                |
| --------------- | ------------------------ | ------------------------------------- |
| Skill names     | `/review`                | `/plugin-name:review`                 |
| Sharing         | Manual copy              | Install via marketplace               |
| Best for        | Personal, single project | Team/community distribution           |
| Versioning      | Via git                  | Semantic versioning or git commit SHA |
| Skill conflicts | Possible                 | Namespaced to avoid conflicts         |

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
- You're okay with namespaced skills like `/my-plugin:hello`

Start with standalone configuration in `.claude/` for quick iteration, then convert to a plugin when you're ready to share.

## Quickstart

1. Create a plugin directory and manifest:

   ```bash
   mkdir -p my-plugin/.claude-plugin
   ```

   Create `my-plugin/.claude-plugin/plugin.json`:

   ```json
   {
     "name": "my-plugin",
     "description": "A greeting plugin",
     "version": "1.0.0",
     "author": { "name": "Your Name" }
   }
   ```

2. Add a skill:

   ```bash
   mkdir -p my-plugin/skills/hello
   ```

   Create `my-plugin/skills/hello/SKILL.md`:

   ```markdown
   ---
   description: Greet the user with a personalized message
   disable-model-invocation: true
   ---

   Greet the user named "$ARGUMENTS" warmly.
   ```

3. Test locally:
   ```bash
   claude --plugin-dir ./my-plugin
   ```
   Then use `/my-plugin:hello Alex` to invoke the skill. Run `/reload-plugins` to pick up changes without restarting.

## Develop a Plugin in Your Skills Directory

Instead of passing `--plugin-dir` on every launch, you can keep a plugin in your skills directory and have Claude Code load it automatically:

```bash
claude plugin init my-tool
```

This creates `~/.claude/skills/my-tool/` with a `.claude-plugin/plugin.json` manifest and a starter `SKILL.md`. On the next session it loads as `my-tool@skills-dir` with no marketplace or install step.

## Plugin Directory Structure

```
my-plugin/
.claude-plugin/
    plugin.json          # Required manifest (ONLY plugin.json goes here)
skills/
    skill-name/
        SKILL.md
commands/
    command-name.md      # Alias for skills (use skills/ for new plugins)
agents/
    agent-name.md        # Custom agents
hooks/
    hooks.json           # Event handlers
monitors/
    monitors.json        # Background monitor configurations
.mcp.json                # MCP servers
.lsp.json                # LSP servers
settings.json            # Default settings applied when plugin enabled
bin/                     # Executables added to Bash tool's PATH
README.md
LICENSE
```

| Directory         | Location    | Purpose                                                                        |
| ----------------- | ----------- | ------------------------------------------------------------------------------ |
| `.claude-plugin/` | Plugin root | Contains `plugin.json` manifest (optional if components use default locations) |
| `skills/`         | Plugin root | Skills as `<name>/SKILL.md` directories                                        |
| `commands/`       | Plugin root | Skills as flat Markdown files (use `skills/` for new plugins)                  |
| `agents/`         | Plugin root | Custom agent definitions                                                       |
| `hooks/`          | Plugin root | Event handlers in `hooks.json`                                                 |
| `monitors/`       | Plugin root | Background monitor configurations in `monitors.json`                           |
| `.mcp.json`       | Plugin root | MCP server configurations                                                      |
| `.lsp.json`       | Plugin root | LSP server configurations for code intelligence                                |
| `bin/`            | Plugin root | Executables added to Bash tool's `PATH` while plugin is enabled                |
| `settings.json`   | Plugin root | Default settings applied when the plugin is enabled                            |

A plugin that ships exactly one skill can place `SKILL.md` directly at the plugin root instead of creating a `skills/` directory. Claude Code loads it as a single skill using the frontmatter `name` field.

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

| Field         | Purpose                                                                                                                                                                     |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`        | Unique identifier and skill namespace. Skills prefixed with this (e.g., `/my-plugin:hello`).                                                                                |
| `description` | Shown in plugin manager when browsing or installing.                                                                                                                        |
| `version`     | Optional. If set, users only receive updates when you bump this field. If omitted and distributed via git, the commit SHA is used and every commit counts as a new version. |
| `author`      | Optional. Helpful for attribution.                                                                                                                                          |

## Plugin Components

### Skills (`skills/skillname/SKILL.md`)

- Standard Agent Skills format with YAML frontmatter
- Namespaced: `/plugin-name:skill-name`
- Automatically discovered from directory names
- Need `description` field in frontmatter

```yaml
---
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
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs npm run lint:fix"
          }
        ]
      }
    ]
  }
}
```

### Background Monitors (`monitors/monitors.json`)

- Watch logs, files, or external status in the background
- Claude Code starts each monitor automatically when the plugin is active
- Each stdout line from the command is delivered to Claude as a notification

```json
[
  {
    "name": "error-log",
    "command": "tail -F ./logs/error.log",
    "description": "Application error log"
  }
]
```

### MCP Servers (`.mcp.json`)

- Bundled external tool integrations
- Auto-start when plugin enables
- Require restart for changes (or run `/reload-plugins`)
- Use `${CLAUDE_PLUGIN_ROOT}` for plugin-relative paths, `${CLAUDE_PLUGIN_DATA}` for persistent state
- Support stdio, SSE, HTTP, and WebSocket transports
- Can also be defined inline in `plugin.json` under `mcpServers`

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
- Currently supports `agent` and `subagentStatusLine` keys
- Setting `agent` activates one of the plugin's custom agents as the main thread

```json
{
  "agent": "security-reviewer"
}
```

Settings from `settings.json` take priority over `settings` declared in `plugin.json`. Unknown keys are silently ignored.

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

# Validate plugin structure
claude plugin validate

# Initialize a new plugin in skills directory
claude plugin init <name>

# Reload after changes (no restart needed, except LSP server config changes)
/reload-plugins
```

### Local Testing

```bash
# Load a single plugin
claude --plugin-dir ./my-plugin

# Load multiple plugins
claude --plugin-dir ./plugin-one --plugin-dir ./plugin-two

# Load from a .zip archive (v2.1.128+)
claude --plugin-dir ./my-plugin.zip

# Load from a URL
claude --plugin-url https://example.com/my-plugin.zip
```

When a `--plugin-dir` plugin has the same name as an installed marketplace plugin, the local copy takes precedence for that session. Exception: plugins that managed settings force-enable or force-disable cannot be overridden by `--plugin-dir`.

As you make changes, run `/reload-plugins` to pick up updates without restarting. Changes to LSP server configuration still require a full restart.

## Marketplace

### Marketplace Repositories

Anthropic maintains two public marketplaces:

- **`claude-plugins-official`**: Curated plugins maintained by Anthropic. Registered automatically on first interactive start.
- **`claude-community`**: Public community marketplace for third-party submissions. Add with `/plugin marketplace add anthropics/claude-plugins-community`.

### Managing Marketplaces

```bash
/plugin marketplace add https://raw.githubusercontent.com/.../marketplace.json
/plugin marketplace list
```

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
- Private repositories for team-internal plugins

### Auto-Update Configuration

```json
{
  "extraKnownMarketplaces": ["url"],
  "strictKnownMarketplaces": false
}
```

### Submitting to Community Marketplace

Submit via in-app forms:

- **Claude.ai**: [claude.ai/admin-settings/directory/submissions/plugins/new](https://claude.ai/admin-settings/directory/submissions/plugins/new) (requires Team/Enterprise org with directory management access)
- **Console**: [platform.claude.com/plugins/submit](https://platform.claude.com/plugins/submit) (available to individual authors)

Run `claude plugin validate` locally before submitting. The review pipeline runs the same check plus automated safety screening.

Approved plugins are pinned to a specific commit SHA in the `anthropics/claude-plugins-community` catalog. CI bumps the pin automatically as you push new commits. The public catalog syncs nightly from the review pipeline.

The official marketplace (`claude-plugins-official`) is curated separately by Anthropic at its discretion -- there is no application process.

## Plugin Hints

If Anthropic lists your plugin in the official marketplace, your CLI can prompt Claude Code users to install it. See the plugin hints documentation for details.

## Versioning

Semantic Versioning: `MAJOR.MINOR.PATCH`

Version constraints:

- `"1.0.0"` -- exact version
- `"^1.0.0"` -- compatible with 1.x.x
- `"~1.0.0"` -- compatible with 1.0.x

If `version` is omitted and the plugin is distributed via git, the commit SHA is used and every commit counts as a new version.

## Converting Standalone Config to Plugin

1. Create plugin directory with `.claude-plugin/plugin.json` manifest
2. Copy `commands/`, `agents/`, `skills/` from `.claude/` to plugin root
3. Move hooks from `settings.json` to `hooks/hooks.json`
4. Test with `claude --plugin-dir ./my-plugin`
5. Remove originals from `.claude/` to avoid duplicates (project and user `.claude/agents/` definitions override same-named plugin agents)

## Official Plugins

The [claude-plugins-official](https://github.com/anthropics/claude-plugins-official) repository contains Anthropic's official plugins. Additional knowledge work plugins are available at [knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins).

## Security Considerations

- Hooks execute with user permissions
- Validate all inputs in hook scripts
- Use absolute paths in commands
- Avoid exposing sensitive files
- Review plugin code before installation
- Recommend `plan` permission mode for initial review
- Only point `--plugin-url` at archives you control or trust

## Debugging Plugin Issues

1. **Check the structure**: Ensure directories are at plugin root, not inside `.claude-plugin/`
2. **Test components individually**: Check each command, agent, and hook separately
3. **Use validation tools**: Run `claude plugin validate` for CLI-level checks
4. **Reload without restart**: Use `/reload-plugins` to pick up changes during development

## Sources

- [Create Plugins](https://code.claude.com/docs/en/plugins)
- [Discover and Install Plugins](https://code.claude.com/docs/en/discover-plugins)
- [Plugins Reference](https://code.claude.com/docs/en/plugins-reference)
- [Plugin Marketplaces](https://code.claude.com/docs/en/plugin-marketplaces)
- [Plugin Hints](https://code.claude.com/docs/en/plugin-hints)
- [Skills Documentation](https://code.claude.com/docs/en/skills)
