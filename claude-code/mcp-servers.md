---
title: "Claude Code MCP Servers"
source_url: "https://code.claude.com/docs/en/mcp"
source_type: "manual"
fetched_at: "2026-03-10T00:00:00Z"
category: "claude-code"
---

# MCP (Model Context Protocol) in Claude Code

MCP is an open standard for AI-tool integrations, enabling Claude to connect to hundreds of external tools and data sources. MCP servers give Claude Code access to your tools, databases, and APIs.

> **Last updated:** March 10, 2026

## What You Can Do with MCP

With MCP servers connected, you can ask Claude Code to:
- **Implement features from issue trackers**: "Add the feature described in JIRA issue ENG-4521 and create a PR on GitHub."
- **Analyze monitoring data**: "Check Sentry and Statsig to check the usage of the feature described in ENG-4521."
- **Query databases**: "Find emails of 10 random users who used feature ENG-4521, based on our PostgreSQL database."
- **Integrate designs**: "Update our standard email template based on the new Figma designs that were posted in Slack."
- **Automate workflows**: "Create Gmail drafts inviting these 10 users to a feedback session about the new feature."

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
# Basic syntax
claude mcp add --transport http <name> <url>

# Real example: Connect to Notion
claude mcp add --transport http notion https://mcp.notion.com/mcp

# Example with Bearer token
claude mcp add --transport http secure-api https://api.example.com/mcp \
  --header "Authorization: Bearer your-token"
```

### Remote SSE Server (Deprecated)

```bash
# Basic syntax
claude mcp add --transport sse <name> <url>

# Real example: Connect to Asana
claude mcp add --transport sse asana https://mcp.asana.com/sse

# Example with authentication header
claude mcp add --transport sse private-api https://api.company.com/sse \
  --header "X-API-Key: your-key-here"
```

### Local Stdio Server

```bash
# Basic syntax
claude mcp add [options] <name> -- <command> [args...]

# Real example: Add Airtable server
claude mcp add --transport stdio --env AIRTABLE_API_KEY=YOUR_KEY airtable \
  -- npx -y airtable-mcp-server
```

> **Important: Option ordering** -- All options (`--transport`, `--env`, `--scope`, `--header`) must come before the server name. The `--` (double dash) separates the server name from the command and arguments passed to the MCP server.

> **Windows note:** On native Windows (not WSL), wrap `npx` commands with `cmd /c`:
> ```bash
> claude mcp add my-server -- cmd /c npx -y my-mcp-server
> ```
> If you see a "Connection closed" error, this wrapper is likely needed.

### Import from Claude Desktop

Import your existing MCP servers from Claude Desktop:

```bash
claude mcp add-from-claude-desktop
```

This discovers and imports servers configured in Claude Desktop's configuration file.

### Add MCP Servers from JSON

Add a server using a raw JSON configuration:

```bash
# Stdio server
claude mcp add-json my-server '{"type":"stdio","command":"npx","args":["-y","my-mcp-server"]}'

# HTTP server
claude mcp add-json my-api '{"type":"http","url":"https://api.example.com/mcp"}'

# HTTP server with OAuth
claude mcp add-json my-oauth-server '{
  "type": "http",
  "url": "https://mcp.example.com/mcp",
  "oauth": {
    "clientId": "your-client-id",
    "clientSecret": "your-client-secret",
    "callbackPort": 8080
  }
}'
```

## MCP Installation Scopes

| Scope | Storage | Best For |
|-------|---------|----------|
| Local (default) | `~/.claude.json` | Personal, sensitive credentials |
| Project | `.mcp.json` (committed) | Team-required servers |
| User | `~/.claude.json` | Personal tools across projects |
| Managed | System-level files | Organization-wide enforcement |

**Precedence:** Local > Project > User > Managed

> **Scope terminology note:** The "local" scope for MCP servers is stored in `~/.claude.json`, which differs from the general local settings scope (stored in `.claude/settings.local.json`). This is a specific MCP behavior.

### Choosing the Right Scope

- **Local scope**: Personal servers, experimental configurations, or sensitive credentials specific to one project
- **Project scope**: Team-shared servers, project-specific tools, or services required for collaboration
- **User scope**: Personal utilities needed across multiple projects, development tools, or frequently used services

### Environment Variable Expansion in `.mcp.json`

Claude Code supports environment variable expansion in `.mcp.json` files:

- `${VAR}` -- Expands to the value of environment variable `VAR`
- `${VAR:-default}` -- Expands to `VAR` if set, otherwise uses `default`

Expansion works in the following locations: `command`, `args`, `env`, `url`, and `headers` fields.

```json
{
  "mcpServers": {
    "api-server": {
      "type": "http",
      "url": "${API_BASE_URL:-https://api.example.com}/mcp",
      "headers": {
        "Authorization": "Bearer ${API_KEY}"
      }
    }
  }
}
```

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

### Fixed OAuth Callback Port

Some MCP servers require a specific redirect URI. Use `--callback-port` to fix the port:

```bash
claude mcp add --transport http \
  --callback-port 8080 \
  my-server https://mcp.example.com/mcp
```

### Pre-configured OAuth Credentials

For servers that don't support dynamic client registration:

```bash
claude mcp add --transport http \
  --client-id your-client-id --client-secret --callback-port 8080 \
  my-server https://mcp.example.com/mcp
```

### CI/CD OAuth with Environment Variables

For non-interactive environments, pass OAuth credentials via environment variables:

```bash
MCP_CLIENT_SECRET=your-secret claude mcp add --transport http \
  --client-id your-client-id --client-secret \
  my-server https://mcp.example.com/mcp
```

### Override OAuth Metadata Discovery

Set `authServerMetadataUrl` in the `oauth` object for servers with non-standard OAuth endpoints.

> **Requires Claude Code v2.1.64 or later.**

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

## Tool Search

When many MCP tools are configured, tool search dynamically loads tools on-demand to save context window space.

**Auto Mode** (default): Activates when MCP tools exceed 10% of context. Requires Sonnet 4+ or Opus 4+.

```bash
ENABLE_TOOL_SEARCH=auto       # auto threshold (default)
ENABLE_TOOL_SEARCH=auto:5     # 5% custom threshold
ENABLE_TOOL_SEARCH=true       # always enabled
ENABLE_TOOL_SEARCH=false      # disabled
```

You can also disable the MCPSearch tool via `disallowedTools` setting:

```json
{
  "permissions": {
    "deny": ["MCPSearch"]
  }
}
```

### Tool Search for MCP Server Authors

MCP server authors can improve tool discoverability by providing descriptive server-level instructions. These instructions help Claude know when to search for specific tools. Include a clear description of what your server provides in the server's `instructions` field.

## Dynamic Tool Updates

Claude Code supports MCP `list_changed` notifications, allowing MCP servers to dynamically update their available tools, prompts, and resources without requiring you to disconnect and reconnect.

## MCP Output Limits

MCP tool responses have built-in size limits to manage context usage:

| Threshold | Value | Description |
|-----------|-------|-------------|
| Warning | 10,000 tokens | Claude is warned the output is large |
| Default max | 25,000 tokens | Responses exceeding this are truncated |

Configure the maximum with the `MAX_MCP_OUTPUT_TOKENS` environment variable:

```bash
MAX_MCP_OUTPUT_TOKENS=50000
```

Increase limits for use cases involving large datasets, detailed reports, or comprehensive log analysis.

## MCP Resources

Reference MCP resources with `@` mentions:
```
@server:protocol://resource/path
@github:issue://123
@postgres:schema://users
```

Resources are automatically fetched and included as attachments when referenced. Resource paths are fuzzy-searchable in the `@` mention autocomplete.

## MCP Prompts as Commands

Execute MCP server prompts as slash commands:
```
/mcp__servername__promptname [args]
/mcp__github__list_prs
/mcp__jira__create_issue "title" priority
```

## Using MCP Servers from Claude.ai

If logged into Claude Code with a Claude.ai account, MCP servers added in Claude.ai are automatically available. Configure at [claude.ai/settings/connectors](https://claude.ai/settings/connectors). Disable with:

```bash
ENABLE_CLAUDEAI_MCP_SERVERS=false claude
```

## Claude Code as an MCP Server

```bash
# Start Claude as a stdio MCP server
claude mcp serve
```

> **Path note:** Ensure `claude` is in your PATH, or use the full path. Find the path with:
> ```bash
> which claude
> ```
> If you see an `ENOENT` error, the command cannot be found and you need to provide the full path.

Claude Desktop configuration:
```json
{
  "mcpServers": {
    "claude-code": {
      "type": "stdio",
      "command": "claude",
      "args": ["mcp", "serve"],
      "env": {}
    }
  }
}
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MCP_TIMEOUT` | Server startup timeout in ms (default: 10000) |
| `MAX_MCP_OUTPUT_TOKENS` | Output token limit (default: 25000) |
| `ENABLE_TOOL_SEARCH` | Tool search behavior (`auto`, `true`, `false`) |
| `ENABLE_CLAUDEAI_MCP_SERVERS` | Enable/disable Claude.ai MCP servers |
| `MCP_CLIENT_SECRET` | OAuth client secret for CI/CD environments |

## Managed MCP Configuration

### Option 1: Exclusive Control (`managed-mcp.json`)

System-wide file that takes exclusive control. Users cannot add, modify, or use any MCP servers other than those defined in this file.

| Platform | Location |
|----------|----------|
| macOS | `/Library/Application Support/ClaudeCode/managed-mcp.json` |
| Linux/WSL | `/etc/claude-code/managed-mcp.json` |
| Windows | `C:\Program Files\ClaudeCode\managed-mcp.json` |

```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    },
    "company-internal": {
      "type": "stdio",
      "command": "/usr/local/bin/company-mcp-server",
      "args": ["--config", "/etc/company/mcp-config.json"]
    }
  }
}
```

### Option 2: Policy Control (Allowlist/Denylist)

Allow users to add their own servers, but restrict which ones are permitted. Each entry must have exactly one of `serverName`, `serverCommand`, or `serverUrl`.

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

Key behaviors:
- Denylist takes absolute precedence over allowlist
- `allowedMcpServers: undefined` (default) = no restrictions
- `allowedMcpServers: []` = complete lockdown

### How Command-Based Restrictions Work

Command arrays must match exactly -- the command and all arguments in the correct order. For stdio servers, the full command array (command + args) is matched. For non-stdio servers (HTTP, SSE), the command field is not applicable.

**Example:** An allowlist entry of `["npx", "-y", "@company/mcp-server"]` will only match a server configured with exactly that command and those arguments, in that order.

### How URL-Based Restrictions Work

URL patterns support wildcards (`*`) for flexible matching:

| Pattern | Matches |
|---------|---------|
| `https://mcp.company.com/*` | Any path under `mcp.company.com` |
| `https://*.company.com/mcp` | Any subdomain of `company.com` at `/mcp` |

### Policy Examples

**URL-only allowlist:** Allow only servers from company domains.
```json
{ "allowedMcpServers": [{ "serverUrl": "https://*.company.com/*" }] }
```

**Command-only allowlist:** Allow only specific npm packages.
```json
{ "allowedMcpServers": [{ "serverCommand": ["npx", "-y", "@company/approved-mcp"] }] }
```

**Mixed policy:** Allow specific names, commands, and URL patterns.
```json
{
  "allowedMcpServers": [
    { "serverName": "github" },
    { "serverCommand": ["npx", "-y", "@company/mcp-server"] },
    { "serverUrl": "https://mcp.company.com/*" }
  ]
}
```

**Name-only allowlist:** Allow only servers with specific names.
```json
{ "allowedMcpServers": [{ "serverName": "github" }, { "serverName": "sentry" }] }
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

Plugin MCP server features:
- **Automatic lifecycle management**: Servers start when the plugin is enabled and stop when disabled
- **Environment variables**: Supports `${CLAUDE_PLUGIN_ROOT}` and user environment variables
- **User environment access**: Plugin servers can read environment variables from the user's shell
- **Multiple transport types**: Supports stdio, HTTP, and SSE transports

View active plugin servers with `claude mcp list`. Plugin servers require a restart for configuration changes.

## Practical Examples

### Monitor Errors with Sentry
```bash
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp
```
1. Use `/mcp` to authenticate
2. Ask about errors: "Show recent unresolved errors from the API service"

### Connect to GitHub
```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp/
```
1. Authenticate via `/mcp`
2. Review PRs, create issues, manage repositories

### Query PostgreSQL
```bash
claude mcp add --transport stdio db -- npx -y @bytebase/dbhub \
  --dsn "postgresql://readonly:pass@prod.db.com:5432/analytics"
```

## Sources

- [MCP Documentation](https://code.claude.com/docs/en/mcp)
- [MCP Registry](https://api.anthropic.com/mcp-registry/docs)
- [MCP Protocol](https://modelcontextprotocol.io/introduction)
