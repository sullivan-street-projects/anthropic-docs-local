---
title: "Claude Code MCP Servers"
source_url: "https://code.claude.com/docs/en/mcp"
source_type: "manual"
fetched_at: "2026-08-03T00:00:00Z"
category: "claude-code"
---

# MCP (Model Context Protocol) in Claude Code

MCP is an open standard for AI-tool integrations, enabling Claude to connect to hundreds of external tools and data sources. MCP servers give Claude Code access to your tools, databases, and APIs. Connect a server when you find yourself copying data into chat from another tool.

> **Last updated:** August 3, 2026

## What You Can Do with MCP

With MCP servers connected, you can ask Claude Code to:

- **Implement features from issue trackers**: "Add the feature described in JIRA issue ENG-4521 and create a PR on GitHub."
- **Analyze monitoring data**: "Check Sentry and Statsig to check the usage of the feature described in ENG-4521."
- **Query databases**: "Find emails of 10 random users who used feature ENG-4521, based on our PostgreSQL database."
- **Integrate designs**: "Update our standard email template based on the new Figma designs that were posted in Slack."
- **Automate workflows**: "Create Gmail drafts inviting these 10 users to a feedback session about the new feature."
- **React to external events**: An MCP server can act as a channel that pushes messages into your session, so Claude reacts to Telegram messages, Discord chats, or webhook events while you're away.

## Find and Build MCP Servers

Browse reviewed connectors in the [Anthropic Directory](https://claude.ai/directory). Directory connectors use the same MCP infrastructure as Claude Code, so you can add any remote server listed there with `claude mcp add`.

To build your own server, see the [MCP server guide](https://modelcontextprotocol.io/docs/develop/build-server) for protocol fundamentals. You can also have Claude scaffold a server for you with the official `mcp-server-dev` plugin:

```
/plugin install mcp-server-dev@claude-plugins-official
/mcp-server-dev:build-mcp-server
```

## Available MCP Server Categories

| Category           | Examples                              |
| ------------------ | ------------------------------------- |
| Code & Development | GitHub, GitLab, Sentry                |
| Data & Databases   | PostgreSQL, MongoDB, Airtable, Notion |
| Communication      | Slack, Gmail, Twilio                  |
| Project Management | Jira, Asana, Linear                   |
| Monitoring         | Datadog, New Relic, Prometheus        |
| Cloud              | AWS, GCP, Azure                       |
| APIs               | Stripe, PayPal, Shopify               |

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

When configuring via JSON, `type` accepts `streamable-http` as an alias for `http` (the MCP specification name).

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
claude mcp add --env AIRTABLE_API_KEY=YOUR_KEY --transport stdio airtable \
  -- npx -y airtable-mcp-server
```

Claude Code sets `CLAUDE_PROJECT_DIR` in the spawned server's environment to the project root, so your server can resolve project-relative paths. A server that limits its own filesystem access to a set of allowed directories should implement the MCP `roots/list` request instead -- Claude Code answers `roots/list` with the session's launch directory plus every additional working directory (v2.1.203+).

> **Important: Option ordering** -- All options (`--transport`, `--env`, `--scope`, `--header`) must come before the server name. The `--` (double dash) separates the server name from the command and arguments passed to the MCP server.

### Remote WebSocket Server

WebSocket servers hold a persistent bidirectional connection, which suits remote MCP servers that push events to Claude unprompted. Use HTTP instead when your server only responds to requests.

```bash
claude mcp add-json events-server \
  '{"type":"ws","url":"wss://mcp.example.com/socket","headers":{"Authorization":"Bearer YOUR_TOKEN"}}'
```

The `type: "ws"` entry accepts the same `url`, `headers`, `headersHelper`, `timeout`, and `alwaysLoad` fields as `http`. The `claude mcp add --transport` flag does not accept `ws`; use `add-json` instead.

## MCP Installation Scopes

| Scope           | Loads In             | Shared with Team         | Stored In                   |
| --------------- | -------------------- | ------------------------ | --------------------------- |
| Local (default) | Current project only | No                       | `~/.claude.json`            |
| Project         | Current project only | Yes, via version control | `.mcp.json` in project root |
| User            | All your projects    | No                       | `~/.claude.json`            |
| Managed         | Organization-wide    | Yes, admin-controlled    | System-level files          |

### Scope Hierarchy and Precedence

When the same server is defined in more than one place, Claude Code connects to it once, using the definition from the highest-precedence source. Fields are not merged across scopes:

1. Local scope
2. Project scope
3. User scope
4. Plugin-provided servers
5. claude.ai connectors

The three user scopes match duplicates by name. Plugins and connectors match by endpoint.

### Choosing the Right Scope

- **Local scope**: Personal servers, experimental configurations, or sensitive credentials specific to one project
- **Project scope**: Team-shared servers, project-specific tools, or services required for collaboration
- **User scope**: Personal utilities needed across multiple projects, development tools, or frequently used services

### Environment Variable Expansion in `.mcp.json`

Claude Code supports environment variable expansion in `.mcp.json` files:

- `${VAR}` -- Expands to the value of environment variable `VAR`
- `${VAR:-default}` -- Expands to `VAR` if set, otherwise uses `default`

Expansion works in `command`, `args`, `env`, `url`, and `headers` fields.

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

If a referenced environment variable is not set and has no default value, the config still loads: Claude Code reports a missing-variable warning for that server in `claude mcp list` output and uses the unexpanded `${VAR}` text as-is. Set the variable or add a `:-default` fallback so the server starts with the value you intend.

## MCP CLI Commands

```bash
# Add servers
claude mcp add --transport http <name> <url>
claude mcp add-json <name> '<json>'
claude mcp add-from-claude-desktop

# Authenticate
claude mcp login <name>
claude mcp logout <name>

# Manage servers
claude mcp list
claude mcp get <name>
claude mcp remove <name>
claude mcp reset-project-choices

# Run Claude Code as an MCP server
claude mcp serve
```

Project-scoped servers from `.mcp.json` that are awaiting approval appear in `claude mcp list` as `Pending approval`. The `/mcp` panel shows the tool count next to each connected server and flags servers that advertise the tools capability but expose no tools.

Some server names are reserved for internal use and will be skipped: `workspace`, `claude-in-chrome`, `computer-use`, `Claude Preview`, and `Claude Browser`. `claude mcp add` rejects a reserved name with an error.

## Authentication

### OAuth 2.0

Claude Code marks a remote server as needing authentication when the server responds with `401 Unauthorized` or `403 Forbidden`. Either status code flags the server in `/mcp` so you can complete the OAuth flow.

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

### Command-Line Authentication

From v2.1.186, `claude mcp login <name>` runs a configured server's OAuth flow directly from your shell. The command detects when no local browser is available (SSH, headless) and prints the authorization URL instead. Use `--no-browser` to force URL prompt mode.

```bash
claude mcp login sentry
claude mcp login sentry --no-browser
```

### Fixed OAuth Callback Port

Some MCP servers require a specific redirect URI. Use `--callback-port` to fix the port:

```bash
claude mcp add --transport http \
  --callback-port 8080 \
  my-server https://mcp.example.com/mcp
```

### Pre-configured OAuth Credentials

For servers that don't support dynamic client registration or Client ID Metadata Documents (CIMD):

```bash
claude mcp add --transport http \
  --client-id your-client-id --client-secret --callback-port 8080 \
  my-server https://mcp.example.com/mcp
```

The client secret is stored securely in your system keychain (macOS) or a credentials file, not in your config. For CI, set `MCP_CLIENT_SECRET=your-secret` as an environment variable.

### Override OAuth Metadata Discovery

Set `authServerMetadataUrl` in the `oauth` object for servers with non-standard OAuth endpoints. By default, Claude Code first checks RFC 9728 Protected Resource Metadata, then falls back to RFC 8414 authorization server metadata.

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

### Restrict OAuth Scopes

Pin the scopes Claude Code requests during the authorization flow:

```json
{
  "mcpServers": {
    "slack": {
      "type": "http",
      "url": "https://mcp.slack.com/mcp",
      "oauth": {
        "scopes": "channels:read chat:write search:read"
      }
    }
  }
}
```

`oauth.scopes` takes precedence over both `authServerMetadataUrl` and auto-discovered scopes. If the authorization server advertises `offline_access`, Claude Code appends it automatically.

### Dynamic Headers for Custom Authentication

Use `headersHelper` for non-OAuth authentication schemes (Kerberos, short-lived tokens, internal SSO):

```json
{
  "mcpServers": {
    "internal-api": {
      "type": "http",
      "url": "https://mcp.internal.example.com",
      "headersHelper": "/opt/bin/get-mcp-auth-headers.sh"
    }
  }
}
```

The command must write a JSON object of string key-value pairs to stdout, runs in a shell with a 10-second timeout, and executes fresh on each connection. Claude Code sets `CLAUDE_CODE_MCP_SERVER_NAME` and `CLAUDE_CODE_MCP_SERVER_URL` in the helper environment.

## Tool Search

When many MCP tools are configured, tool search dynamically loads tools on-demand to save context window space. Tool search is enabled by default -- MCP tools are deferred and discovered on demand.

### How It Works

Only tool names and server instructions load at session start. Claude uses a search tool to discover relevant tools when a task needs them. Only the tools Claude actually uses enter context.

### Configure Tool Search

| Value    | Behavior                                                                                                   |
| -------- | ---------------------------------------------------------------------------------------------------------- |
| (unset)  | All MCP tools deferred. Falls back to loading upfront on Vertex AI or non-first-party `ANTHROPIC_BASE_URL` |
| `true`   | All MCP tools deferred. Sends beta header even on Vertex AI/proxies                                        |
| `auto`   | Threshold mode: tools load upfront if they fit within 10% of context                                       |
| `auto:N` | Threshold mode with custom percentage (e.g., `auto:5` for 5%)                                              |
| `false`  | All MCP tools loaded upfront, no deferral                                                                  |

```bash
ENABLE_TOOL_SEARCH=auto       # auto threshold
ENABLE_TOOL_SEARCH=auto:5     # 5% custom threshold
ENABLE_TOOL_SEARCH=true       # always enabled
ENABLE_TOOL_SEARCH=false      # disabled
```

Tool search requires a model that supports `tool_reference` blocks. Haiku models don't support it. On Vertex AI, supported for Sonnet 4.5+ and Opus 4.5+.

You can also disable the ToolSearch tool via `disallowedTools` setting:

```json
{
  "permissions": {
    "deny": ["ToolSearch"]
  }
}
```

### Exempt a Server from Deferral

Set `alwaysLoad: true` in a server's configuration to load all its tools at session start regardless of tool search settings:

```json
{
  "mcpServers": {
    "core-tools": {
      "type": "http",
      "url": "https://mcp.example.com/mcp",
      "alwaysLoad": true
    }
  }
}
```

An MCP server can also mark individual tools as always-loaded by including `"anthropic/alwaysLoad": true` in the tool's `_meta` object.

### For MCP Server Authors

Server instructions help Claude understand when to search for your tools. Claude Code truncates tool descriptions and server instructions at 2KB each -- keep them concise and put critical details near the start.

## Dynamic Tool Updates

Claude Code supports MCP `list_changed` notifications, allowing MCP servers to dynamically update their available tools, prompts, and resources without requiring you to disconnect and reconnect. If a refresh request fails, Claude Code keeps the server's previously discovered tools, prompts, and resources until a later refresh succeeds (v2.1.214+; earlier versions replaced them with an empty list on transient errors).

## Automatic Reconnection

If an HTTP or SSE server disconnects mid-session, Claude Code automatically reconnects with exponential backoff: up to five attempts, starting at a one-second delay and doubling each time. The same backoff applies to initial connection failures (up to three retries on transient errors; authentication and not-found errors are not retried). Capability discovery requests (`tools/list`, `prompts/list`, `resources/list`) also retry transient errors up to three times (v2.1.191+). Stdio servers are local processes and are not reconnected automatically.

When a configured server fails to connect, Claude Code tells Claude which server failed and its connection error (including in `ToolSearch` results), so Claude reports the failure in its response. This requires tool search, which is enabled by default (v2.1.205+).

## Idle Timeout

As of v2.1.187, a tool call to a remote server (HTTP, SSE, WebSocket, or claude.ai connector) that sends no response and no progress notification for the idle window aborts with an error. The idle window defaults to five minutes for HTTP, SSE, WebSocket, and claude.ai connector servers, and to 30 minutes for stdio servers (as of v2.1.203; stdio servers were previously exempt). Set `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT` in milliseconds to change the idle window, or set it to `0` to disable. A per-server `timeout` of at least 1000 also acts as a floor on the idle timeout (v2.1.203+).

## Automatic Backgrounding of Long Tool Calls

An MCP tool call in the main conversation that is still running after two minutes moves to a background task instead of blocking the session (v2.1.212+). Claude receives the task ID immediately and keeps working, and the result arrives as a task notification when the call settles. The task appears in `/tasks`, where you can also stop it.

Set `CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS` in milliseconds to change the threshold, or set it to `0` to turn automatic backgrounding off. Setting `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS` to `1` also turns it off.

Calls that never move to the background:

- Calls from subagents (only main-conversation calls are backgrounded)
- Calls to IDE servers
- Calls in non-interactive mode (unless `CLAUDE_AUTO_BACKGROUND_TASKS` is set to `1`)
- Calls waiting on an open elicitation dialog

## Disable a Server Without Removing It

Toggle a server off in the `/mcp` panel to stop Claude Code from connecting to it without losing its configuration. Claude Code records your choice per project in `~/.claude.json`, using two disjoint lists:

- `disabledMcpServers`: opt-out list for user-configured servers, plugin servers, claude.ai connectors, and built-in servers that default to on
- `enabledMcpServers`: opt-in list for built-in servers that default to off (e.g., `computer-use`)

These are unrelated to `enabledMcpjsonServers` and `disabledMcpjsonServers`, which control approval of servers defined in `.mcp.json`.

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

## Push Messages with Channels

An MCP server can push messages directly into your session so Claude can react to external events. The server declares the `claude/channel` capability and you opt it in with the `--channels` flag at startup.

## Using MCP Servers from Claude.ai

If logged into Claude Code with a Claude.ai account, MCP servers added in Claude.ai are automatically available. Configure at [claude.ai/customize/connectors](https://claude.ai/customize/connectors). On Team and Enterprise plans, only admins can add servers.

Connectors you have never signed in to are collapsed behind a "Show unused connectors" row. Connectors are only loaded when your active authentication method is your claude.ai subscription.

Some Anthropic-hosted connectors (Microsoft 365, Gmail, Google Calendar) don't support local OAuth and must be connected via claude.ai Settings > Connectors.

### Organization Controls on Connector Tools

Organizations can set per-tool controls on claude.ai connectors. Claude Code reads these settings at startup and enforces them locally:

- **Tool set to `ask`**: Claude Code prompts on every call, even in `acceptEdits`, `auto`, and `bypassPermissions` modes. In `dontAsk` mode, the call is denied instead (v2.1.129+).
- **Tool set to `blocked`**: Claude Code filters the tool out before Claude sees it.

### Disable claude.ai Connectors

Set `disableClaudeAiConnectors` to `true` in any settings scope, or use the environment variable. This setting uses any-source-true semantics: `true` in any settings source takes precedence.

```bash
ENABLE_CLAUDEAI_MCP_SERVERS=false claude
```

To block individual connectors, add them to `deniedMcpServers` by name or URL pattern. For example, a `serverName` entry of `"claude.ai Slack"` blocks the Slack connector.

## MCP Elicitation

MCP servers can request structured input from you mid-task using elicitation. When a server needs information it cannot get on its own, Claude Code displays an interactive dialog and passes your response back to the server. No configuration is required on your side -- elicitation dialogs appear automatically when a server requests them.

Servers can request input in two ways:

- **Form mode**: Claude Code shows a dialog with form fields defined by the server (e.g., username and password). Fill in the fields and submit.
- **URL mode**: Claude Code opens a browser URL for authentication or approval. Complete the flow in the browser, then confirm in the CLI.

To auto-respond to elicitation requests without showing a dialog, use the `Elicitation` hook.

## Claude Code as an MCP Server

```bash
# Start Claude as a stdio MCP server
claude mcp serve
```

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

## Output Limits

- Warning threshold: 10,000 tokens
- Default maximum: 25,000 tokens
- Configure: `MAX_MCP_OUTPUT_TOKENS=50000`
- Per-tool override: Set `_meta["anthropic/maxResultSizeChars"]` in tool's `tools/list` response (up to 500,000 characters hard ceiling). The annotation applies independently of `MAX_MCP_OUTPUT_TOKENS` for text content. Tools that return image data are still subject to the token limit.

## Require Approval for a Specific Tool

MCP server authors can mark a tool as requiring explicit approval on every call by setting `_meta["anthropic/requiresUserInteraction"]` to `true` in the tool's `tools/list` response. Claude Code shows the permission prompt on every call, even in `acceptEdits`, `auto`, and `bypassPermissions` modes, and never offers a "don't ask again" option. In `dontAsk` mode, the call is denied. Allow rules that match the tool don't skip the prompt either (v2.1.199+).

```json
{
  "name": "grant_access",
  "description": "Requests access to a protected resource",
  "_meta": {
    "anthropic/requiresUserInteraction": true
  }
}
```

## Tool Input Schemas with Root-Level Combinators

Some MCP servers declare tool input schemas with `anyOf`, `oneOf`, or `allOf` at the top level. The Claude API doesn't accept those keywords at the schema root. As of v2.1.195, Claude Code flattens these schemas into a single object and prepends a sentence to the tool's description. When Claude Code cannot produce a schema the API accepts, it skips that one tool and leaves the server's other tools available.

## Environment Variables

| Variable                              | Description                                                                      |
| ------------------------------------- | -------------------------------------------------------------------------------- |
| `MCP_TIMEOUT`                         | Server startup timeout in ms (default: 10000)                                    |
| `MCP_TOOL_TIMEOUT`                    | Per-tool execution timeout                                                       |
| `MAX_MCP_OUTPUT_TOKENS`               | Output token limit (default: 25000)                                              |
| `ENABLE_TOOL_SEARCH`                  | Tool search behavior (`auto`, `true`, `false`)                                   |
| `ENABLE_CLAUDEAI_MCP_SERVERS`         | Enable/disable Claude.ai MCP servers                                             |
| `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT`   | Idle timeout in ms for remote tool calls (default: 5 min HTTP, 30 min stdio)     |
| `CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS`  | Threshold in ms before backgrounding long tool calls (default: 120000; 0 to off) |

Per-server `timeout` field in `.mcp.json` overrides `MCP_TOOL_TIMEOUT` for that server only. Values below 1000 are ignored.

## Managed MCP Configuration

### Option 1: Exclusive Control (`managed-mcp.json`)

System-wide file that takes exclusive control. Users cannot add, modify, or use any MCP servers other than those defined in this file.

| Platform  | Location                                                   |
| --------- | ---------------------------------------------------------- |
| macOS     | `/Library/Application Support/ClaudeCode/managed-mcp.json` |
| Linux/WSL | `/etc/claude-code/managed-mcp.json`                        |
| Windows   | `C:\Program Files\ClaudeCode\managed-mcp.json`             |

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
  "deniedMcpServers": [{ "serverName": "dangerous-server" }]
}
```

Key behaviors:

- Denylist takes absolute precedence over allowlist
- `allowedMcpServers: undefined` (default) = no restrictions
- `allowedMcpServers: []` = complete lockdown
- Command arrays must match exactly (command and all arguments in correct order)
- URL patterns support wildcards (`*`) for matching

## Plugin MCP Servers

Plugins can bundle MCP servers in `.mcp.json` or inline in `plugin.json`:

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

Plugin MCP servers start automatically when the plugin is enabled. Plugin tool names follow the format `mcp__plugin_<plugin-name>_<server-name>__<tool-name>`, where any character outside `A-Z`, `a-z`, `0-9`, `_`, and `-` is replaced with `_`. Use this full name when referencing the tool in permission rules, skill's `allowed-tools` list, subagent's `tools` field, or hook matchers. The server itself registers under the scoped name `plugin:<plugin-name>:<server-name>`.

Features:

- **Automatic lifecycle**: servers connect at startup; run `/reload-plugins` to connect/disconnect on plugin state changes
- **Environment variables**: `${CLAUDE_PLUGIN_ROOT}` for bundled files, `${CLAUDE_PLUGIN_DATA}` for persistent state, `${CLAUDE_PROJECT_DIR}` for project root
- **Multiple transport types**: stdio, SSE, HTTP, and WebSocket

## Practical Examples

### Monitor Errors with Sentry

```bash
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp
# Use /mcp to authenticate, then ask about errors
```

### Connect to GitHub

```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp/ \
  --header "Authorization: Bearer YOUR_GITHUB_PAT"
```

### Query PostgreSQL

```bash
claude mcp add --transport stdio db -- npx -y @bytebase/dbhub \
  --dsn "postgresql://readonly:pass@prod.db.com:5432/analytics"
```

## Sources

- [MCP Documentation](https://code.claude.com/docs/en/mcp)
- [MCP Quickstart](https://code.claude.com/docs/en/mcp-quickstart)
- [MCP Registry](https://api.anthropic.com/mcp-registry/docs)
- [MCP Protocol](https://modelcontextprotocol.io/introduction)
- [Managed MCP Configuration](https://code.claude.com/docs/en/managed-mcp)
- [Channels](https://code.claude.com/docs/en/channels)
