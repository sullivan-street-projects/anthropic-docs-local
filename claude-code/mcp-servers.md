---
title: "Claude Code MCP Servers"
source_url: "https://code.claude.com/docs/en/mcp"
source_type: "manual"
fetched_at: "2026-03-05T00:00:00Z"
category: "claude-code"
---

# MCP (Model Context Protocol) in Claude Code

MCP is an open standard for AI-tool integrations, enabling Claude to connect to hundreds of external tools and data sources.

> **Last updated:** March 5, 2026

## Available MCP Server Categories

| Category | Examples |
|----------|----------|
| Code & Development | GitHub, GitLab, Sentry |
| Data & Databases | PostgreSQL, MongoDB, Airtable, Notion |
| Communication | Slack, Gmail, Twilio |
| Project Management | Jira, Asana, Linear |
| Monitoring | Datadog, New Relic, Prometheus |
| Cloud | AWS, GCP, Azure |
| APIs | Stripe, PayPal, Shopify |

Full registry: https://api.anthropic.com/mcp-registry/docs

## Installation Methods

### Remote HTTP Server (Recommended)

```bash
claude mcp add --transport http <name> <url>
claude mcp add --transport http notion https://mcp.notion.com/mcp
```

### Remote SSE Server (Deprecated)

```bash
claude mcp add --transport sse <name> <url>
```

### Local Stdio Server

```bash
claude mcp add --transport stdio <name> -- <command>
claude mcp add --transport stdio --env API_KEY=xxx airtable -- npx -y airtable-mcp-server
```

> Options must come before server name; `--` separates options from command args.

## Configuration Scopes

| Scope | Storage | Best For |
|-------|---------|----------|
| Local (default) | `~/.claude.json` | Personal, sensitive credentials |
| Project | `.mcp.json` (committed) | Team-required servers |
| User | `~/.claude.json` | Personal tools across projects |
| Managed | System-level files | Organization-wide enforcement |

**Precedence:** Local > Project > User > Managed

## MCP CLI Commands

```bash
# Add servers
claude mcp add --transport http <name> <url>
claude mcp add-json <name> '<json>'
claude mcp add-from-claude-desktop

# Manage servers
claude mcp list
claude mcp get <name>
claude mcp remove <name>
claude mcp reset-project-choices

# Run Claude Code as an MCP server
claude mcp serve
```

## Authentication

### OAuth 2.0

```bash
claude mcp add --transport http \
  --client-id <id> --client-secret --callback-port 8080 \
  my-server https://api.example.com/mcp
```

Within Claude Code interactive mode:
```
/mcp
# Follow browser login flow
```

### OAuth Metadata Override

If an MCP server doesn't support standard OAuth discovery but has a working OIDC endpoint:

```json
{
  "mcpServers": {
    "my-server": {
      "type": "http",
      "url": "https://mcp.example.com/mcp",
      "oauth": {
        "authServerMetadataUrl": "https://auth.example.com/.well-known/openid-configuration"
      }
    }
  }
}
```

Requires Claude Code v2.1.64+.

## Claude.ai MCP Servers

MCP servers configured in Claude.ai are automatically available in Claude Code when logged in with a Claude.ai account. Configure at `claude.ai/settings/connectors`. Disable with `ENABLE_CLAUDEAI_MCP_SERVERS=false`.

## Dynamic Tool Updates

Claude Code supports MCP `list_changed` notifications, allowing servers to dynamically update available tools without reconnection.

## Tool Search

When many MCP tools are configured, tool search dynamically loads tools on-demand to save context window space.

**Auto Mode** (default): Activates when MCP tools exceed 10% of context. Requires Sonnet 4+ or Opus 4+.

```bash
ENABLE_TOOL_SEARCH=auto       # auto threshold (default)
ENABLE_TOOL_SEARCH=auto:5     # 5% custom threshold
ENABLE_TOOL_SEARCH=true       # always enabled
ENABLE_TOOL_SEARCH=false      # disabled
```

## MCP Resources

Reference MCP resources with `@` mentions:
```
@server:protocol://resource/path
@github:issue://123
@postgres:schema://users
```

## MCP Prompts as Commands

Execute MCP server prompts as slash commands:
```
/mcp__servername__promptname [args]
/mcp__github__list_prs
/mcp__jira__create_issue "title" priority
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MCP_TIMEOUT` | Server startup timeout in ms (default: 10000) |
| `MAX_MCP_OUTPUT_TOKENS` | Output token limit (default: 25000) |
| `ENABLE_TOOL_SEARCH` | Tool search behavior (`auto`, `true`, `false`) |

## Output Limits

- Warning threshold: 10,000 tokens
- Default maximum: 25,000 tokens
- Configure: `MAX_MCP_OUTPUT_TOKENS=50000`

## Managed MCP Configuration

### Option 1: Exclusive Control (`managed-mcp.json`)

System-wide file that takes exclusive control:

| Platform | Location |
|----------|----------|
| macOS | `/Library/Application Support/ClaudeCode/managed-mcp.json` |
| Linux/WSL | `/etc/claude-code/managed-mcp.json` |
| Windows | `C:\Program Files\ClaudeCode\managed-mcp.json` |

### Option 2: Policy Control (Allowlist/Denylist)

```json
{
  "allowedMcpServers": [
    { "serverName": "github" },
    { "serverCommand": ["npx", "-y", "package"] },
    { "serverUrl": "https://mcp.company.com/*" }
  ],
  "deniedMcpServers": [
    { "serverName": "dangerous-server" }
  ]
}
```

## Plugin MCP Servers

Plugins can bundle MCP servers in `.mcp.json` or `plugin.json`:

```json
{
  "mcpServers": {
    "database": {
      "command": "${CLAUDE_PLUGIN_ROOT}/servers/db-server",
      "args": ["--config", "${CLAUDE_PLUGIN_ROOT}/config.json"],
      "env": { "DB_URL": "${DB_URL}" }
    }
  }
}
```

Plugin MCP servers start automatically when the plugin is enabled and require a restart for changes.

## Sources

- [MCP Documentation](https://code.claude.com/docs/en/mcp)
- [MCP Registry](https://api.anthropic.com/mcp-registry/docs)
