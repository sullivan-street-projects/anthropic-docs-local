---
title: "Claude Code Plugins"
source_url: "claude-code-guide-agent"
source_type: "manual"
fetched_at: "2026-01-04T06:15:00Z"
category: "claude-code"
---

# Claude Code Plugins

Plugins extend Claude Code with custom functionality that can be shared across projects and teams, including slash commands, agents, Skills, hooks, and MCP server integrations.

## When to Use Plugins

**Use plugins when:**
- Sharing functionality with team or community
- Same commands needed across multiple projects
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
├── commands/                 # Slash commands
│   └── hello.md
├── agents/                   # Custom agents
│   └── reviewer.md
├── skills/                   # Agent Skills
│   └── pdf-processing/
│       └── SKILL.md
├── hooks/                    # Hook configurations
│   └── hooks.json
├── .mcp.json                # MCP server definitions
└── scripts/                 # Utility scripts
```

**Important**: Component directories (`commands/`, `agents/`, etc.) must be at plugin root, NOT inside `.claude-plugin/`.

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

## Creating Components

### Slash Commands

Create Markdown files in `commands/`:

```markdown
---
description: Review code for bugs and best practices
---

# Code Review

Review the code for potential bugs, security issues, and style.
Be concise and actionable.
```

**With arguments** (`$ARGUMENTS` or `$1`, `$2`):

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
name: security-reviewer
description: Security specialist for code reviews
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

### Skills

Create directories with `SKILL.md` in `skills/`:

```yaml
---
name: pdf-processing
description: Extract text and data from PDFs
allowed-tools: Read, Bash(python:*)
---

# PDF Processing

## Quick Start

```python
import pdfplumber
with pdfplumber.open("document.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```
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

### CLI Commands

```bash
# Install to user scope
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
| user | `~/.claude/settings.json` | Personal plugins |
| project | `.claude/settings.json` | Team plugins (git) |
| local | `.claude/settings.local.json` | Gitignored |
| managed | `managed-settings.json` | Enterprise |

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
- Clear, specific descriptions
- Include trigger keywords

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
# Create plugin structure
mkdir -p my-plugin/.claude-plugin

# Create manifest
cat > my-plugin/.claude-plugin/plugin.json << 'EOF'
{
  "name": "my-plugin",
  "version": "1.0.0"
}
EOF

# Copy existing files
cp -r .claude/commands my-plugin/
cp -r .claude/agents my-plugin/

# Test
claude --plugin-dir ./my-plugin
```

## Example: Simple Plugin

```
greeting-plugin/
├── .claude-plugin/
│   └── plugin.json
└── commands/
    └── hello.md
```

**plugin.json**:
```json
{
  "name": "greeting",
  "description": "Simple greeting plugin",
  "version": "1.0.0"
}
```

**commands/hello.md**:
```markdown
---
description: Greet the user warmly
---

Greet the user and ask how you can help today.
```

**Usage**: `/greeting:hello`

## Resources

- **Plugin Reference**: https://code.claude.com/docs/en/plugins-reference.md
- **Skills Guide**: https://code.claude.com/docs/en/skills.md
- **Hooks Reference**: https://code.claude.com/docs/en/hooks.md
