---
title: "Claude Code MCP Servers"
source_url: "claude-code-guide-agent"
source_type: "manual"
fetched_at: "2026-01-31T00:00:00Z"
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
      "type": "http",
      "url": "https://api.example.com/mcp",
      "command": "/path/to/executable",
      "args": ["arg1", "arg2"],
      "env": {
        "API_KEY": "${API_KEY}"
      },
      "headers": {
        "Authorization": "Bearer ${AUTH_TOKEN}"
      }
    }
  }
}
```

### Environment Variable Expansion

| Syntax | Behavior |
|--------|----------|
| `${VAR}` | Expands to environment variable |
| `${VAR:-default}` | Uses `VAR` if set, otherwise `default` |

## Installation Methods

### HTTP Servers (Recommended for Cloud)

```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp/

# With authentication
claude mcp add --transport http api https://api.example.com/mcp \
  --header "Authorization: Bearer token"
```

### SSE Servers (Deprecated)

```bash
claude mcp add --transport sse asana https://mcp.asana.com/sse
```

Use HTTP servers instead where available.

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

**Note**: All options (`--transport`, `--env`, `--scope`) must come before the server name. Use `--` to separate Claude's flags from the server's arguments.

**Windows**: Wrap `npx` with `cmd /c`:
```bash
claude mcp add --transport stdio my-server -- cmd /c npx -y @some/package
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

# Add from Claude Desktop config
claude mcp add-from-claude-desktop

# Reset project approval choices
claude mcp reset-project-choices

# Start Claude as MCP server
claude mcp serve

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

Project-scoped servers require approval. Reset with `claude mcp reset-project-choices`.

### User Scope (Global)

Available in all projects:

```bash
claude mcp add --transport http api --scope user https://api.example.com/mcp
```

### Scope Precedence

1. **Local** (highest priority)
2. **Project**
3. **User** (lowest priority)

## Authentication

### OAuth 2.0 Flow (Recommended)

1. Add the server: `claude mcp add --transport http sentry https://mcp.sentry.dev/mcp`
2. Run `/mcp` in Claude Code
3. Follow browser login
4. Tokens stored securely and refreshed automatically

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
        "Authorization": "Bearer ${API_TOKEN}"
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

Type `@` to see available resources in autocomplete.

## MCP Prompts as Commands

MCP servers can expose prompts as Claude Code commands:

```bash
/mcp__github__list_prs
/mcp__github__pr_review 456
```

## Dynamic Tool Updates

Claude Code supports MCP `list_changed` notifications, automatically refreshing capabilities when servers update their available tools.

## Tool Search

When many MCP servers are configured, tool definitions can consume context:

- **Automatic**: Activates when tools exceed 10% of context window
- **Control**: `ENABLE_TOOL_SEARCH=auto:5` (custom threshold), `true`, or `false`

## Using Claude Code as an MCP Server

```bash
claude mcp serve
```

Integration with Claude Desktop:

```json
{
  "mcpServers": {
    "claude-code": {
      "type": "stdio",
      "command": "/full/path/to/claude",
      "args": ["mcp", "serve"]
    }
  }
}
```

## Enterprise Configuration

### Exclusive Control (managed-mcp.json)

Deploy fixed servers that users cannot modify:

- macOS: `/Library/Application Support/ClaudeCode/managed-mcp.json`
- Linux: `/etc/claude-code/managed-mcp.json`
- Windows: `C:\Program Files\ClaudeCode\managed-mcp.json`

### Allowlist/Denylist

```json
{
  "allowedMcpServers": [
    { "serverName": "github" },
    { "serverUrl": "https://mcp.company.com/*" },
    { "serverCommand": ["npx", "-y", "@modelcontextprotocol/server-filesystem"] }
  ],
  "deniedMcpServers": [
    { "serverName": "dangerous-server" },
    { "serverUrl": "https://*.untrusted.com/*" }
  ]
}
```

**Behavior**: Denylist takes absolute precedence. URL patterns support `*` wildcards. Command arrays must match exactly.

## Troubleshooting

### Server Connection Failed

```bash
claude mcp list          # Check status
which npx                # Verify paths
MCP_TIMEOUT=15000 claude # Increase timeout
MCP_DEBUG=1 claude       # Debug output
```

### Authentication Failed

1. Clear and re-authenticate via `/mcp`
2. Verify header format
3. Check token validity

### Environment Variables Not Expanding

```bash
export API_KEY=your-key
claude  # Variables must be set BEFORE starting
```

Use `${VAR:-default}` for optional variables.

### MCP Output Too Large

```bash
MAX_MCP_OUTPUT_TOKENS=50000 claude
```

## Best Practices

1. **Use environment variables for secrets** - never hardcode
2. **Don't commit secrets** - use local scope for credentials
3. **Use OAuth** when available (more secure than tokens)
4. **Share team configs** via `.mcp.json`
5. **Test servers** before team rollout
6. **Document server purposes** in project README

## Resources

- **MCP GitHub**: https://github.com/modelcontextprotocol/servers
- **MCP Registry**: https://api.anthropic.com/mcp-registry/docs
- **MCP Protocol**: https://modelcontextprotocol.io/introduction
