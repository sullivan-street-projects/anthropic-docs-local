---
title: "Claude Code Plugins"
source_url: "claude-code-guide-agent"
source_type: "manual"
fetched_at: "2026-01-31T00:00:00Z"
category: "claude-code"
---

# Claude Code Plugins

Plugins extend Claude Code with custom functionality that can be shared across projects and teams, including skills, agents, hooks, and MCP server integrations.

## When to Use Plugins

**Use plugins when:**
- Sharing functionality with team or community
- Same skills needed across multiple projects
- Version control and easy updates required
- Distributing through a marketplace

**Use standalone `.claude/` when:**
- Customizing for a single project
- Personal configuration
- Experimenting before packaging
- Want short command names (`/hello` vs `/plugin:hello`)

## Plugin Directory Structure

```
my-plugin/
├── .claude-plugin/           # REQUIRED
│   └── plugin.json          # Plugin manifest
├── commands/                 # Slash commands (legacy)
│   └── status.md
├── skills/                   # Agent Skills (recommended)
│   └── code-review/
│       ├── SKILL.md         # Required
│       └── reference.md     # Optional supporting files
├── agents/                   # Custom agents
│   └── security-reviewer.md
├── hooks/                    # Hook configurations
│   ├── hooks.json
│   └── security-hooks.json
├── .mcp.json                # MCP server definitions
├── .lsp.json                # LSP server configurations
├── scripts/                 # Utility scripts
│   └── format.sh
├── LICENSE
└── CHANGELOG.md
```

**Important**: Component directories (`commands/`, `agents/`, `skills/`, etc.) must be at plugin root, NOT inside `.claude-plugin/`.

## plugin.json Manifest

### Required Fields

```json
{
  "name": "my-plugin"
}
```

### Complete Example

```json
{
  "name": "deployment-tools",
  "version": "1.2.0",
  "description": "Deployment automation tools",
  "author": {
    "name": "DevOps Team",
    "email": "devops@example.com"
  },
  "homepage": "https://docs.example.com/plugins/deployment",
  "repository": "https://github.com/company/deployment-plugin",
  "license": "MIT",
  "keywords": ["deployment", "ci-cd", "automation"]
}
```

### Component Path Fields

```json
{
  "commands": ["./custom/cmd.md"],
  "agents": "./custom/agents/",
  "skills": "./custom/skills/",
  "hooks": "./config/hooks.json",
  "mcpServers": "./mcp-config.json",
  "outputStyles": "./styles/",
  "lspServers": "./.lsp.json"
}
```

Custom paths supplement default directories, not replace them.

## Creating Components

### Skills (Recommended)

Create directories with `SKILL.md` in `skills/`:

```yaml
---
name: code-review
description: Review code for bugs and best practices
argument-hint: "[file-or-directory]"
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Grep, Glob
model: opus
context: fork
agent: Explore
---

Review the code for potential bugs, security issues, and style.
Be concise and actionable.
```

**Frontmatter Fields**:
- `name`: Skill name (uses directory name if omitted)
- `description`: What the skill does
- `argument-hint`: Autocomplete hint
- `disable-model-invocation`: Prevent Claude from auto-using
- `user-invocable`: Show in `/` menu
- `allowed-tools`: Tools Claude can use
- `model`: Model to use
- `context: fork`: Run in forked subagent
- `agent`: Subagent type for context: fork

**Dynamic Context** with shell commands:

```yaml
---
name: pr-summary
description: Summarize PR changes
context: fork
agent: Explore
---

PR diff: !`gh pr diff`
Changed files: !`gh pr diff --name-only`

Summarize this pull request...
```

**Usage**: `/my-plugin:code-review src/auth.ts`

### Slash Commands (Legacy)

Create Markdown files in `commands/`:

```markdown
---
description: Deploy to specified environment
---

Deploy the application to "$1" environment.
Notes: "$2"
```

**Usage**: `/my-plugin:deploy staging "hotfix"`

### Agents

Create Markdown files in `agents/`:

```markdown
---
description: Security specialist for code reviews
capabilities: ["vulnerability scanning", "secret detection"]
tools: Read, Grep, Glob, Bash
model: sonnet
---

You are a security code review expert.

When reviewing code:
1. Search for common vulnerabilities
2. Check for hardcoded secrets
3. Verify input validation
4. Review access control
```

### Hooks

Create `hooks/hooks.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/scripts/format.sh"
          }
        ]
      }
    ]
  }
}
```

Hook types: `command`, `prompt`, `agent`

### MCP Servers

Create `.mcp.json`:

```json
{
  "mcpServers": {
    "plugin-api": {
      "command": "${CLAUDE_PLUGIN_ROOT}/servers/api-server",
      "args": ["--config", "${CLAUDE_PLUGIN_ROOT}/config.json"],
      "env": {
        "API_KEY": "${API_KEY}"
      }
    }
  }
}
```

## Installing Plugins

### Interactive Menu

```bash
/plugin
```

Tabs: Discover, Installed, Marketplaces, Errors

### CLI Commands

```bash
# Install to user scope (default)
claude plugin install formatter@marketplace

# Install to project scope (team)
claude plugin install formatter@marketplace --scope project

# Install to local scope
claude plugin install formatter@marketplace --scope local
```

### Management Commands

```bash
claude plugin list
claude plugin enable <plugin>
claude plugin disable <plugin>
claude plugin update <plugin>
claude plugin uninstall <plugin>
```

## Plugin Scopes

| Scope | Settings File | Use Case |
|-------|---------------|----------|
| user | `~/.claude/settings.json` | Personal plugins (default) |
| project | `.claude/settings.json` | Team plugins (git) |
| local | `.claude/settings.local.json` | Gitignored |
| managed | `managed-settings.json` | Enterprise |

## Plugin Marketplaces

### Add Marketplace

```bash
/plugin marketplace add anthropics/claude-code
/plugin marketplace add https://gitlab.com/company/plugins.git
/plugin marketplace add ./my-local-marketplace
```

### Create Marketplace

Create `.claude-plugin/marketplace.json`:

```json
{
  "name": "company-tools",
  "plugins": [
    {
      "name": "code-formatter",
      "source": "./plugins/formatter",
      "description": "Automatic code formatting"
    }
  ]
}
```

### Plugin Sources

```json
{
  "name": "my-plugin",
  "source": {
    "source": "github",
    "repo": "owner/plugin-repo",
    "ref": "v2.0.0",
    "sha": "a1b2c3d4e5f6..."
  }
}
```

## Team Configuration

Add to `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "company-tools": {
      "source": {
        "source": "github",
        "repo": "your-org/claude-plugins"
      }
    }
  },
  "enabledPlugins": {
    "code-formatter@company-tools": true
  }
}
```

### Managed Marketplace Restrictions

```json
{
  "strictKnownMarketplaces": [
    {
      "source": "github",
      "repo": "acme-corp/approved-plugins"
    }
  ]
}
```

## Testing During Development

```bash
# Test your plugin locally
claude --plugin-dir ./my-plugin

# Test multiple plugins
claude --plugin-dir ./plugin-one --plugin-dir ./plugin-two
```

## Best Practices

### Design
- Single responsibility per component
- Clear, specific descriptions with trigger keywords
- Keep `SKILL.md` under 500 lines

### Versioning
Follow semantic versioning:
- MAJOR: Breaking changes
- MINOR: New features
- PATCH: Bug fixes

### Security
- Never hardcode secrets
- Validate input in hooks
- Use `allowed-tools` in Skills
- Review hook scripts carefully

### Documentation
- Include README.md
- Document all commands and agents
- Provide setup instructions
- Include CHANGELOG.md

## Converting Standalone to Plugin

```bash
mkdir -p my-plugin/.claude-plugin
cat > my-plugin/.claude-plugin/plugin.json << 'EOF'
{"name": "my-plugin", "version": "1.0.0"}
EOF

# Copy existing files
cp -r .claude/commands my-plugin/
cp -r .claude/skills my-plugin/
cp -r .claude/agents my-plugin/

# Test
claude --plugin-dir ./my-plugin
```

## Recent Additions

### Automatic Skill Hot-Reload (v2.1.0)
Skills automatically reload without restarting Claude Code.

### Skill Context Fork (v2.1.0)
```yaml
context: fork
agent: Explore
```
Run skills in isolated subagent contexts.

### Merged Slash Commands and Skills (v2.1.3)
Both create `/command-name` endpoints. Skills are recommended for new development.

### Search in Installed Plugins List (v2.1.15)
Type to filter plugins by name in the `/plugin` Installed tab.

### Pin Plugins to Git Commits (v2.1.15)
```json
{
  "source": {
    "source": "github",
    "repo": "owner/repo",
    "sha": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0"
  }
}
```

## Resources

- **Plugin Reference**: https://code.claude.com/docs/en/plugins-reference.md
- **Skills Guide**: https://code.claude.com/docs/en/skills.md
- **Hooks Reference**: https://code.claude.com/docs/en/hooks.md
- **Plugin Marketplaces**: https://code.claude.com/docs/en/plugin-marketplaces.md
