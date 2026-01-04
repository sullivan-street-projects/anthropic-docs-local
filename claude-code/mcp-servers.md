---
title: "Claude Code MCP Servers"
source_url: "claude-code-guide-agent"
source_type: "manual"
fetched_at: "2026-01-04T06:15:00Z"
category: "claude-code"
---

# MCP (Model Context Protocol) in Claude Code

MCP is an open-source standard for AI-tool integrations that enables Claude Code to connect to external tools, databases, and APIs.

## What MCP Can Do

- **Business operations**: Implement features from issue trackers, manage projects
- **Data analysis**: Query databases, analyze monitoring data
- **Design integration**: Reference Figma designs, update templates
- **Automation**: Create workflows, send notifications

## Configuration

### Configuration Files

| Scope | Location | Sharing |
|-------|----------|---------|
| Local | `~/.claude.json` (project path) | Personal |
| Project | `.mcp.json` (git repo) | Team |
| User | `~/.claude.json` (global) | Personal |
| Enterprise | System directories | Admin deployed |

### Configuration Format

```json
{
  "mcpServers": {
    "server-name": {
      "command": "/path/to/executable",
      "args": ["arg1", "arg2"],
      "env": {
        "VAR_NAME": "value"
      }
    }
  }
}
```

## Installation Methods

### HTTP Servers (Recommended for Cloud)

```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp/

# With authentication
claude mcp add --transport http api https://api.example.com/mcp \
  --header "Authorization: Bearer token"
```

### Stdio Servers (Local Processes)

```bash
claude mcp add --transport stdio airtable --env AIRTABLE_API_KEY=KEY \
  -- npx -y airtable-mcp-server

# With multiple env vars
claude mcp add --transport stdio db \
  --env DB_HOST=localhost \
  --env DB_PORT=5432 \
  -- python server.py
```

### From JSON

```bash
claude mcp add-json weather '{"type":"http","url":"https://api.weather.com/mcp"}'
```

## Managing Servers

```bash
# List all servers
claude mcp list

# Get details
claude mcp get github

# Remove server
claude mcp remove github

# Within Claude Code
/mcp
```

## Popular MCP Servers

| Server | Purpose | Command |
|--------|---------|---------|
| GitHub | Repos, PRs, issues | `claude mcp add --transport http github https://api.githubcopilot.com/mcp/` |
| Sentry | Error monitoring | `claude mcp add --transport http sentry https://mcp.sentry.dev/mcp` |
| PostgreSQL | Database queries | `claude mcp add --transport stdio db -- npx -y @bytebase/dbhub --dsn "postgres://..."` |
| Notion | Databases, pages | `claude mcp add --transport http notion https://mcp.notion.com/mcp` |
| Stripe | Payment data | `claude mcp add --transport http stripe https://mcp.stripe.com` |
| Linear | Issue tracking | `claude mcp add --transport http linear https://mcp.linear.app/mcp` |
| Memory | Session storage | `claude mcp add --transport stdio memory -- npx -y @modelcontextprotocol/server-memory` |
| Filesystem | Local files | `claude mcp add --transport stdio fs -- npx -y @modelcontextprotocol/server-filesystem /path` |

## Configuration Scopes

### Local Scope (Default)

Personal, project-specific:

```bash
claude mcp add --transport http api --scope local https://api.example.com/mcp
```

### Project Scope (Team)

Shared via git (`.mcp.json`):

```bash
claude mcp add --transport http api --scope project https://api.example.com/mcp
```

### User Scope (Global)

Available in all projects:

```bash
claude mcp add --transport http api --scope user https://api.example.com/mcp
```

## Authentication

### OAuth 2.0 Flow

1. Add the server: `claude mcp add --transport http sentry https://mcp.sentry.dev/mcp`
2. Run `/mcp` in Claude Code
3. Follow browser login
4. Tokens stored securely

### Manual Headers

```bash
claude mcp add --transport http api https://api.example.com/mcp \
  --header "Authorization: Bearer YOUR_TOKEN" \
  --header "X-API-Key: YOUR_KEY"
```

### Environment Variables

```json
{
  "mcpServers": {
    "api": {
      "type": "http",
      "url": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${API_KEY}"
      }
    }
  }
}
```

## Using MCP Resources

Reference MCP resources with @ mentions:

```bash
> Can you analyze @github:issue://123?
> Compare @postgres:schema://users with @docs:file://user-model
```

## Enterprise Configuration

### Exclusive Control

Deploy `managed-mcp.json` to lock servers:

- macOS: `/Library/Application Support/ClaudeCode/managed-mcp.json`
- Linux: `/etc/claude-code/managed-mcp.json`

### Allowlist/Denylist

```json
{
  "allowedMcpServers": [
    { "serverName": "github" },
    { "serverUrl": "https://mcp.company.com/*" }
  ],
  "deniedMcpServers": [
    { "serverName": "dangerous-server" }
  ]
}
```

## Troubleshooting

### Server Connection Failed

1. Check status: `claude mcp list`
2. Verify paths: `which npx`
3. Increase timeout: `MCP_TIMEOUT=15000 claude`

### Authentication Failed

1. Clear and re-authenticate via `/mcp`
2. Verify header format
3. Check token validity

### Environment Variables Not Expanding

```bash
export API_KEY=your-key
claude
```

Use `${VAR:-default}` for optional variables.

## Best Practices

1. **Use environment variables for secrets**
2. **Don't commit secrets** - use local scope
3. **Document server purposes** in configuration
4. **Share team configs** via `.mcp.json`
5. **Test servers** before team rollout

## Resources

- **MCP GitHub**: https://github.com/modelcontextprotocol/servers
- **MCP Registry**: https://api.anthropic.com/mcp-registry/docs
- **MCP Protocol**: https://modelcontextprotocol.io/introduction
