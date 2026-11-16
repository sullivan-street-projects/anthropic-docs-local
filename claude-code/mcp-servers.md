---
title: "Claude Code MCP Servers"
source_url: "https://code.claude.com/docs/en/mcp"
source_type: "manual"
fetched_at: "2026-11-16T00:00:00Z"
category: "claude-code"
---

# MCP (Model Context Protocol) in Claude Code

MCP is an open standard for AI-tool integrations, enabling Claude to connect to hundreds of external tools and data sources. MCP servers give Claude Code access to your tools, databases, and APIs. Connect a server when you find yourself copying data into chat from another tool.

> **Last updated:** August 16, 2026

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

Claude Code sets `CLAUDE_PROJECT_DIR` in the spawned server's environment to the project root, so your server can resolve project-relative paths.

When Claude Code disconnects a stdio server (e.g., at session end), on macOS/Linux it sends `SIGINT`, then `SIGTERM` 100 ms later, then `SIGKILL` after a further 400 ms. On Windows it closes the server's stdin, then ends the process tree 300 ms later (v2.1.296+; earlier versions ended the tree at once).

> **Important: Option ordering** -- All options (`--transport`, `--env`, `--scope`, `--header`) must come before the server name. The `--` (double dash) separates the server name from the command and arguments passed to the MCP server.

### Remote WebSocket Server

WebSocket servers hold a persistent bidirectional connection, which suits remote MCP servers that push events to Claude unprompted. Use HTTP instead when your server only responds to requests.

```bash
claude mcp add-json events-server \
  '{"type":"ws","url":"wss://mcp.example.com/socket","headers":{"Authorization":"Bearer YOUR_TOKEN"}}'
```

The `type: "ws"` entry accepts the same `url`, `headers`, `headersHelper`, `timeout`, and `alwaysLoad` fields as `http`. Authentication is header-only (static `headers` or `headersHelper`); WebSocket supports neither OAuth nor the `claude mcp add --transport` flag, so use `add-json` instead.

### Add a Server from Setup Instructions for Another Client

Setup instructions written for Claude Desktop, Cursor, or other clients usually give one of three shapes:

- **A URL** (`https://...`): add with `--transport http` (or SSE if stated); for `wss://` use the WebSocket `add-json` form
- **A launch command** (`npx -y @example/mcp-server`): put the whole command after `--`, with `--env` flags after the name and before `--`
- **An `mcpServers` JSON block**: pass the object *inside* `mcpServers` (not the wrapper) to `claude mcp add-json`

Each writes to local scope unless you add `--scope project` or `--scope user`.

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

The three user scopes match duplicates by name. Plugins and connectors match by endpoint (URLs that differ only in scheme/host case, default port, or a trailing slash count as the same endpoint).

A server your organization provides through the `managedMcpServers` managed setting ranks above all of these (v2.1.259+).

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

If a referenced variable isn't set and has no default, the config still loads: Claude Code shows a missing-variable warning in `claude mcp list` and `/mcp` and uses the unexpanded `${VAR}` text. A variable set to an empty string counts as set, so `${VAR:-default}` expands to empty.

**Credential variables read as empty**: in a remote server's `url` and `headers`, Claude Code reads credential variables as empty rather than expanding them (e.g., `ANTHROPIC_API_KEY`, `ANTHROPIC_AUTH_TOKEN`, `AWS_BEARER_TOKEN_BEDROCK`, `HTTPS_PROXY`, `NPM_TOKEN`), even with a `:-default`. This keeps a project `.mcp.json` or plugin from sending your credentials to a server it names. `ANTHROPIC_BASE_URL` still expands. Copy a covered credential into a variable with your own name to pass it deliberately. `/mcp` (v2.1.268+), `claude mcp list`, and `claude mcp get` show `${VAR}` references by name rather than resolved value.

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

In an interactive session, `/mcp reconnect all` retries every server that failed or needs authentication (v2.1.284+).

When you remove a remote server, Claude Code deletes its stored OAuth tokens and client registration but doesn't revoke them; run `claude mcp logout <name>` first to revoke where the authorization server supports it.

### Server Status

`claude mcp list` shows a health status per server (`✔ Connected`, `! Needs authentication`, `✘ Failed to connect`). These statuses report a configuration decision without connecting:

- `⏸ Pending approval` (run `claude` to approve): project-scoped `.mcp.json` server not yet approved
- `✘ Rejected (see disabledMcpjsonServers in settings)`: shown only in `claude mcp get`
- `⊘ Disabled for this project (re-enable via /mcp)`: named in the project's `disabledMcpServers` list
- `✘ Blocked by enterprise managed policy`

The `/mcp` panel shows the tool count next to each connected server and flags servers that advertise the tools capability but expose no tools. In cloud sessions, a count like `3 of 13 tools available` can come from deny rules, tool names over 128 characters, or tools the server marks for its own UI only (`_meta.ui.visibility` without `model`).

### Configuration Warnings

- **Hidden whitespace**: leading/trailing whitespace in `command`, `url`, `args`, or `env`/`headers` keys and values (values are not trimmed)
- **Same name in more than one scope** with different endpoints (OAuth sign-ins are stored per endpoint)
- **Reserved names**: `workspace`, `claude-in-chrome`, `computer-use`, `Claude Preview`, and `Claude Browser` are reserved for built-in servers; configured servers with these names are skipped and `claude mcp add` rejects them
- **Missing environment variable** referenced without a default

### Disable a Server Without Removing It

Toggle a server off in `/mcp` to stop connecting without losing its configuration. Claude Code records the choice per project in `~/.claude.json` in one of two disjoint lists:

- `disabledMcpServers`: opt-out list for user-configured, plugin, managed-settings, self-fetched claude.ai connector, and default-on built-in servers
- `enabledMcpServers`: opt-in list for default-off built-in servers such as `computer-use`

These are unrelated to `enabledMcpjsonServers`/`disabledMcpjsonServers`, which control approval of project `.mcp.json` servers.

### Tools From a Server Still Connecting

Claude waits for a server still connecting in the background: inside the `ToolSearch` call when tool search is on, or via the `WaitForMcpServers` tool when it's off. After resuming a session, a call to a tool whose server is on its first connection attempt is held for up to 10 seconds.

## MCP Client Runtimes

Claude Code connects through one of two client runtimes: v1 (MCP TypeScript SDK 1.x) or v2 (MCP TypeScript SDK 2.0, adding MCP protocol revision **2026-07-28**). Sessions that fetch feature flags use v2 on v2.1.232+; other sessions (Bedrock, Claude Platform on AWS, Google Cloud's Agent Platform, Microsoft Foundry, Claude apps gateway, telemetry/flag fetching off) default to v2 on v2.1.274+.

On v2, Claude Code also:

- Negotiates the newer revision with HTTP, stdio, and claude.ai connector servers that support it
- Receives `list_changed` notifications from newer-revision servers over a held-open stream
- Doesn't register a channel server that connects on the newer revision (that revision can't carry channel messages)
- Fails an MCP OAuth sign-in whose authorization response names an unexpected issuer
- Sends OAuth credentials only to token endpoints over HTTPS or at `localhost`/`127.0.0.1`/`::1`

Set `MCP_SDK_GENERATION` to `v1` or `v2` to pick the runtime, and `MCP_PROTOCOL_NEGOTIATION` to `auto` or `legacy` to control whether servers are asked about the newer revision (unset, Claude Code can skip asking a stdio server for 7 days).

## Authentication

### OAuth 2.0

Claude Code marks a remote server as needing authentication when the server responds with `401 Unauthorized` or `403 Forbidden`. Either status code flags a server you haven't signed in to in `/mcp` so you can complete the OAuth flow. Exceptions:

- A server whose `Authorization` header you configured (in `headers` or via `headersHelper`) is reported as **failed** rather than flagged, and Claude Code doesn't fall back to OAuth for it
- A claude.ai connector whose `401` comes from claude.ai rejecting your session token shows a `session token rejected` state; run `/login`, then reconnect from `/mcp` (v2.1.222+)
- Connectors delivered to cloud sessions are authenticated by the session's proxy; reauthorize them at claude.ai/customize/connectors

When a signed-in OAuth server rejects the stored token, Claude Code refreshes it (if a refresh token exists), reconnects, and retries once; without a refresh token it connects once unauthenticated. A rejected refresh token shows a notice pointing at `/mcp` > **Re-authenticate**. A startup notice lists servers that need sign-in. `claude -p` and Agent SDK runs can't run the OAuth flow; sign in first interactively or with `claude mcp login`.

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

The client secret is stored securely in your system keychain (macOS) or a credentials file, not in your config. For CI, set `MCP_CLIENT_SECRET=your-secret` as an environment variable. The secret can be set only when you add the server; to change it, remove and re-add the server with `--client-secret` and the same `--scope`. `add-json` takes `clientId` and `callbackPort` in an `oauth` object.

Register redirect URIs as `http://localhost:PORT/callback` (v2.1.229 briefly sent `127.0.0.1`; v2.1.231 restored `localhost`).

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

`oauth.scopes` takes precedence over both `authServerMetadataUrl` and auto-discovered scopes. If the authorization server advertises `offline_access`, Claude Code appends it automatically. `authServerMetadataUrl` must use `https://`. When `oauth.scopes` isn't set, Claude Code doesn't request the full `scopes_supported` catalog from auto-discovered metadata. A 403 `insufficient_scope` fails the call with a `needs additional permissions` message; add the scope to `oauth.scopes` and re-authenticate.

### OAuth Behind an Authenticating Proxy or Gateway

From v2.1.299, configure the proxy/gateway's own header (e.g., `X-API-Key`) via `--header`, `headers`, or `headersHelper`, keep `Authorization` out of the configured headers, and sign in with `claude mcp login <name>`. Claude Code adds the configured headers except `Authorization` to sign-in, token refresh, and revocation requests sent to the server's origin.

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

The command must write a JSON object of string key-value pairs to stdout, runs in a shell with a 10-second timeout, and executes fresh on each connection (not cached). Dynamic headers override static `headers` of the same name. On a tool-call `401`/`403`, the helper is re-run and the call retried once. Claude Code sets `CLAUDE_CODE_MCP_SERVER_NAME`, `CLAUDE_CODE_MCP_SERVER_URL`, and (for plugin servers) `CLAUDE_PLUGIN_ROOT` in the helper environment.

- **Working directory**: plugin root for plugin servers; the declaring project directory for project `.mcp.json`/local-scope servers; the session's primary working directory for project agent files, SDK, or `--mcp-config` servers; `~/.claude` (or `CLAUDE_CONFIG_DIR`) for user-scope, managed, connector, and outside agent-file servers (v2.1.238+)
- **Credential scrubbing**: helpers from a project `.mcp.json`, a plugin, or a project agent file run without credential-like environment variables (names containing `TOKEN`, `SECRET`, `PASSWORD`, `KEY`, `AUTH`, plus a fixed list such as `ANTHROPIC_CUSTOM_HEADERS`)
- **Workspace trust**: helpers for project `.mcp.json` and local-scope servers run only after you accept the trust dialog for that project directory (v2.1.238+ also in `-p`/SDK sessions); until then the server connects with static `headers` only
- Plugin-provided `headersHelper` can't reference `${user_config.*}` values (since v2.1.207); put them in `headers` instead

## Tool Search

When many MCP tools are configured, tool search dynamically loads tools on-demand to save context window space. Tool search is enabled by default -- MCP tools are deferred and discovered on demand.

### How It Works

Only tool names and server instructions load at session start. Claude uses a search tool to discover relevant tools when a task needs them. Only the tools Claude actually uses enter context. There is no fixed per-server tool cap. Tool search isn't supported on Microsoft Foundry deployments hosted on Azure (tools load upfront there regardless of `ENABLE_TOOL_SEARCH`).

### Configure Tool Search

| Value    | Behavior                                                                                                   |
| -------- | ---------------------------------------------------------------------------------------------------------- |
| (unset)  | All MCP tools deferred. Loaded upfront on models earlier than Opus 4/Sonnet 4, earlier Agent Platform models, and Foundry-on-Azure |
| `true`   | MCP tools deferred, with the same fallbacks as (unset)                                                     |
| `auto`   | Threshold mode: tools load upfront while they total under 10% of context; once tool search turns on it stays on |
| `auto:N` | Threshold mode with custom percentage (e.g., `auto:5` for 5%)                                              |
| `false`  | All MCP tools loaded upfront, no deferral                                                                  |

```bash
ENABLE_TOOL_SEARCH=auto       # auto threshold
ENABLE_TOOL_SEARCH=auto:5     # 5% custom threshold
ENABLE_TOOL_SEARCH=true       # always enabled
ENABLE_TOOL_SEARCH=false      # disabled
```

Claude Code uses tool search on Claude Opus 4, Sonnet 4, Haiku 4.5, and later (Opus/Sonnet/Haiku 4.5+ on Google Cloud's Agent Platform). `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS` keeps tool search off (organizations can keep it on via managed settings, v2.1.227+).

Behind an `ANTHROPIC_BASE_URL` gateway, tool search is on by default from v2.1.304 (the gateway must forward `defer_loading` fields and `tool_reference` blocks); from v2.1.305 Claude Code retries a request without tool search after a `400`/`422`.

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

`alwaysLoad: true` makes startup wait for the server's tools (capped at the 5-second connect timeout) unless a valid `cached` entry supplies them. Other servers connect in the background; set `MCP_CONNECTION_NONBLOCKING=0` to make startup wait for them.

An MCP server can also mark individual tools via `_meta["anthropic/alwaysLoad"]`: `true` loads the tool upfront; `false` keeps it deferred even when the user's config sets `alwaysLoad: true` (for `--mcp-config`, Agent SDK, or plugin servers; v2.1.285+).

### Defer a Server's Tools

Set `"alwaysLoad": false` in a server's entry to keep all its tools behind tool search, including tools the author marked to load upfront (v2.1.287+).

### For MCP Server Authors

Server instructions help Claude understand when to search for your tools. Claude Code cuts server instructions and upfront-loaded tool descriptions at **4,096 characters**, and descriptions of tools loaded through tool search at **16,384 characters** (before v2.1.296 the shorter limit was 2,048). Set `CLAUDE_CODE_MAX_MCP_DESCRIPTION_LENGTH` to use one value for both limits. Keep them concise and put critical details and search terms near the start.

## Dynamic Tool Updates

Claude Code supports MCP `list_changed` notifications, allowing MCP servers to dynamically update their available tools, prompts, and resources without requiring you to disconnect and reconnect. In `-p` mode and the Agent SDK, only the tool list is refreshed. If a refresh fails, previously discovered items are kept.

## Automatic Reconnection

If an HTTP or SSE server disconnects mid-session, Claude Code automatically reconnects with exponential backoff: up to five attempts, starting at a one-second delay and doubling each time. The same backoff applies to initial connection failures (up to three retries on transient errors). Capability discovery requests (`tools/list`, `prompts/list`, `resources/list`) also retry transient errors up to three times. Stdio servers are not reconnected automatically in interactive sessions (use **Reconnect** in `/mcp`); in `claude -p` and Agent SDK sessions, a stdio server whose process exited is restarted on the next call to one of its tools. A plugin stdio server whose connection failed is skipped for 15 minutes in new `-p` runs.

In `claude -p` and Agent SDK sessions, after five failed reconnects on a transient error Claude Code keeps retrying an HTTP/SSE server in the background for up to about half an hour. When tool search is on, Claude Code tells Claude which server failed and why.

## Idle Timeout

As of v2.1.187, a tool call to an MCP server that sends no response and no progress notification for the idle window aborts with an error instead of waiting for the wall-clock limit. The idle window defaults to 5 minutes for HTTP, SSE, WebSocket, and claude.ai connector servers, and to 30 minutes for stdio servers (as of v2.1.203; before that, stdio servers were exempt). It applies to every server type except IDE servers and SDK in-process servers. Set `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT` in milliseconds to change the idle window, or set it to `0` to disable the check.

A per-server `timeout` of at least 1000 also acts as a floor on the idle timeout (v2.1.203+): Claude Code never aborts that server's tool calls for idleness sooner than the per-server `timeout`.

### Per-Request Timer

For HTTP, SSE, or claude.ai connector servers, a second per-request timer covers each request through to the server's first response byte. That timer is 60 seconds unless you set the per-server `timeout` or `MCP_TOOL_TIMEOUT`; setting either to 60 seconds or higher raises the per-request timer to that value (a lower value doesn't shorten it). Stdio and WebSocket servers have no per-request timer.

## Automatic Backgrounding of Long Tool Calls

As of v2.1.212, an MCP tool call in the main conversation that is still running after two minutes moves to a background task instead of blocking the session. Claude receives the task ID immediately and keeps working; the result arrives as a task notification when the call settles. The task appears in `/tasks`, where you can also stop it, and doesn't survive exiting the session. Per-call limits (wall-clock and idle timeouts) still apply while the call runs in the background.

Set `CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS` in milliseconds to change the threshold, or `0` to turn backgrounding off. Setting `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1` also disables it. Some calls never move to the background: calls from subagents, calls to IDE servers, calls in non-interactive mode (unless `CLAUDE_AUTO_BACKGROUND_TASKS=1`), and calls waiting on an open elicitation dialog.

## Discovery Cache

As of v2.1.221, a remote (HTTP or SSE) server you've used before can show a `cached` status in `/mcp` and `/plugin`, such as `cached 2h ago · connects on first use · 5 tools`. Claude Code loaded the server's tool list from a previous session instead of connecting at startup, and connects the server the first time Claude calls one of its tools. The tools are available from your first message.

The discovery cache is **off by default** unless a gradual rollout has enabled it for your account (before v2.1.238 it was on by default). Set `MCP_DISCOVERY_CACHE=1` to turn it on, or `0` to keep it off.

## MCP Tasks That Run on the Server (Public Beta)

An MCP task is a long job (report export, build) that the server runs itself using the MCP tasks extension. Claude's tool call returns once the server accepts the job; the footer shows a count such as `1 MCP task`, and the result goes to Claude when the job ends. Requires v2.1.304+.

- **Stop**: select it in `/tasks` and press `x` (Claude Code asks the server to cancel; `Esc` doesn't stop it)
- **Questions**: a task can open an elicitation dialog; press `Esc` to answer later from `/tasks` (v2.1.324+). Non-interactive sessions cancel tasks that request input
- **Exit/resume**: a remote server's task keeps running after you exit; resume the same session interactively to follow it again
- **Requirements**: server supports tasks; HTTP, stdio, or connector server on protocol revision 2026-07-28; session fetches feature flags; terminal CLI, Agent SDK, or GitHub Actions (not VS Code or desktop app); main-conversation call; interactive, or SDK/stream-json with `CLAUDE_AUTO_BACKGROUND_TASKS=1`
- **Time limits**: none by default once the server answers with a task
- **Wait for results**: set `CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS=0` (wait for every call) or `CLAUDE_CODE_DISABLE_MCP_TASK_BACKGROUND=1` (wait for task results, still auto-backgrounding after two minutes)

Server authors receive client capabilities at `params._meta["io.modelcontextprotocol/clientCapabilities"]`, with `"io.modelcontextprotocol/tasks": {}` under `extensions` when a call can become a task.

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
/mcp__jira__create_issue login-bug high
```

Prompts are listed in the `/` menu as `/servername:promptname (MCP)`. Arguments are split on whitespace. Prompts from a server named `anthropic-skills` don't appear (name reserved for synced claude.ai skills).

## Push Messages with Channels

An MCP server can push messages directly into your session so Claude can react to external events. The server declares the `claude/channel` capability and you opt it in with the `--channels` flag at startup.

## Using MCP Servers from Claude.ai

If logged into Claude Code with a Claude.ai account, MCP servers added in Claude.ai are automatically available. Configure at [claude.ai/customize/connectors](https://claude.ai/customize/connectors). On Team and Enterprise plans, only admins can add servers.

Connectors you have never signed in to are collapsed behind a "Show unused connectors" row. Connectors are only loaded when your active authentication method is your claude.ai subscription -- not when `ANTHROPIC_API_KEY`, `ANTHROPIC_AUTH_TOKEN`, `apiKeyHelper`, a third-party provider, an Anthropic profile/federation credential, or a `claude setup-token` `CLAUDE_CODE_OAUTH_TOKEN` is active.

Anthropic also provides some connectors itself: on accounts with Claude Docs, `/mcp` lists `claude.ai Claude Docs` with no setup. Connectors whose authentication your organization manages are marked `managed`.

### How Connectors Reach Claude Code

| Where the session runs                    | How connectors arrive                     | What governs them                                                     |
| ----------------------------------------- | ----------------------------------------- | --------------------------------------------------------------------- |
| Terminal, VS Code, JetBrains, Agent SDK   | Claude Code fetches them from claude.ai   | Settings in this section and managed MCP configuration                |
| Cloud sessions                            | The cloud host passes them in             | claude.ai org settings, allow/denylists reaching the session, host `managed-mcp.json` |
| Desktop app local and SSH sessions        | Delivered in-process as `type: "sdk"`     | `blocked` entries in connector tool controls                          |

### Organization Controls on Connector Tools

- **`ask`**: Claude Code prompts on every call (`Your organization requires approval for this tool`), even in `acceptEdits`, `auto`, and `bypassPermissions`; allow rules don't skip it; `dontAsk` denies
- **`blocked`**: the tool is filtered out before Claude sees it (shown as `disabled by your organization` in `/mcp`)

Some Anthropic-hosted connectors (Microsoft 365, Gmail, Google Calendar) don't support local OAuth and must be connected via claude.ai Settings > Connectors.

### Disable claude.ai Connectors

Set `disableClaudeAiConnectors` to `true` in any settings scope (any-source-true: a project `false` can't re-enable), or use the environment variable. It applies only to connectors Claude Code fetches itself:

```bash
ENABLE_CLAUDEAI_MCP_SERVERS=false claude
```

To block individual connectors, add them to `deniedMcpServers` by name or URL pattern.

## MCP Elicitation

MCP servers can request structured input from you mid-task using elicitation. When a server needs information it cannot get on its own, Claude Code displays an interactive dialog and passes your response back to the server. No configuration is required on your side -- elicitation dialogs appear automatically when a server requests them.

Servers can request input in two ways:

- **Form mode**: Claude Code shows a dialog with form fields defined by the server (e.g., username and password). Fill in the fields and submit.
- **URL mode**: Claude Code opens a browser URL for authentication or approval. Complete the flow in the browser, then confirm in the CLI.

To auto-respond to elicitation requests without showing a dialog, use the `Elicitation` hook.

In URL mode, the escaped URL is capped at roughly 8,000 characters (about 4,000 if heavily percent-escaped); over the cap you can only decline. In cloud sessions, requests appear as cards at claude.ai/code or the Desktop **Code** tab.

Claude Code declares `elicitation: {form: {}, url: {}}` on protocol revision 2026-07-28 connections and on earlier-revision connections to stdio/`sse`/`http`/`ws` servers in your Claude Code config (v2.1.287+); other connections (e.g., claude.ai connectors) declare bare `elicitation: {}` (form only).

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

When running Claude Code as a server, Bash/PowerShell results for background commands include a `backgroundOutputPath` field pointing to the output file (v2.1.295+).

## Output Limits

- Warning threshold: 10,000 tokens (fixed)
- Default maximum: 25,000 tokens; results over the limit are saved to a file in the session's `tool-results` directory
- Configure: `MAX_MCP_OUTPUT_TOKENS=50000`
- Text results over 50,000 characters are saved to a file regardless of `MAX_MCP_OUTPUT_TOKENS`
- Per-tool override: Set `_meta["anthropic/maxResultSizeChars"]` in tool's `tools/list` response (up to 500,000 characters hard ceiling)
- HTTP/SSE responses (and WebSocket messages) over **16 MiB** fail the request (WebSocket closes the connection)
- Error results (`isError: true`) over ~11,000 characters keep the first and last 5,000 characters
- Image results (PNG/JPEG/GIF/WebP) are shown inline and the original bytes saved to a file Claude can use (v2.1.283+)

## Tool Schema and Name Handling

- **Root-level combinators** (`anyOf`/`oneOf`/`allOf` at schema root): Claude Code flattens the schema into one object and describes the parameter groups in the tool description
- **Invalid input schemas**: tools whose top-level property names aren't 1-64 chars of `[A-Za-z0-9_.-]` or that fail the JSON Schema draft 2020-12 meta-schema are excluded (v2.1.216+); Claude is told which tools were excluded and why. If the API refuses a schema, Claude Code resends with the tool declared without parameters (v2.1.300+)
- **Tool names over 128 characters** (`mcp__<server>__<tool>`) are left out of the tools sent to Claude

## Tool Annotations for Server Authors

- **`_meta["anthropic/requiresUserInteraction"]: true`**: prompts on every call even in `acceptEdits`, `auto`, and `bypassPermissions`, with no "don't ask again"; allow rules don't skip it; `dontAsk` denies; `--permission-prompt-tool` allows are converted to denies; one-tap approval on Remote Control/SDK surfaces is withheld
- **`annotations.idempotentHint` / `annotations.readOnlyHint`**: marks a tool safe to call twice, so Claude Code can repeat a call pending when an HTTP or connector connection closed (once, on a new connection). Read-only tools also run in parallel with other read-only calls

## Environment Variables

| Variable                             | Description                                                                |
| ------------------------------------ | -------------------------------------------------------------------------- |
| `MCP_TIMEOUT`                        | Server startup timeout in ms (default: 10000)                              |
| `MCP_TOOL_TIMEOUT`                   | Per-tool execution timeout                                                 |
| `MAX_MCP_OUTPUT_TOKENS`              | Output token limit (default: 25000)                                        |
| `ENABLE_TOOL_SEARCH`                 | Tool search behavior (`auto`, `true`, `false`)                             |
| `ENABLE_CLAUDEAI_MCP_SERVERS`        | Enable/disable Claude.ai MCP servers                                       |
| `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT`  | Idle timeout in ms (default: 5 min remote / 30 min stdio)                  |
| `CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS` | Threshold (ms) before long calls background (default: 2 min); `0` disables |
| `MCP_DISCOVERY_CACHE`                | `1` enables, `0` disables the discovery cache (off by default)             |
| `MCP_SDK_GENERATION`                 | Pick client runtime: `v1` or `v2`                                          |
| `MCP_PROTOCOL_NEGOTIATION`           | `auto` or `legacy` (ask servers about protocol revision 2026-07-28 or not) |
| `CLAUDE_CODE_MAX_MCP_DESCRIPTION_LENGTH` | Character limit for tool descriptions and server instructions          |
| `CLAUDE_CODE_DISABLE_MCP_TASK_BACKGROUND` | `1` makes Claude wait for MCP task results                            |
| `MCP_CONNECTION_NONBLOCKING`         | `0` makes startup wait for all servers to connect                          |

Per-server `timeout` field in `.mcp.json` overrides `MCP_TOOL_TIMEOUT` for that server only. Values below 1000 are ignored.

## Managed MCP Configuration

Organizations can deploy a fixed server set with `managed-mcp.json`, provide servers to every user with `managedMcpServers` (ranks above all scopes; `/mcp` shows only the URL host), or restrict servers with `allowedMcpServers`/`deniedMcpServers`.

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

Plugin MCP servers start automatically when the plugin is enabled. Plugin tool names follow the format `mcp__plugin_<plugin-name>_<server-name>__<tool-name>`.

Features:

- **Automatic lifecycle**: servers connect at startup; run `/reload-plugins` to connect/disconnect on plugin state changes
- **Environment variables**: `${CLAUDE_PLUGIN_ROOT}` for bundled files, `${CLAUDE_PLUGIN_DATA}` for persistent state, `${CLAUDE_PROJECT_DIR}` for project root
- **Multiple transport types**: stdio, SSE, HTTP, and WebSocket
- **Toggle off**: plugin servers can be disabled in `/mcp` without removing the plugin
- **Scoped server name**: the server registers as `plugin:<plugin-name>:<server-name>` (use this in an `mcp_tool` hook's `server` field). Hook matchers against the bare server key never fire for plugin servers
- **Redaction**: `claude mcp get` hides plugin stdio/WebSocket server values (`NAME=[REDACTED]`)
- **`/cd`** (v2.1.246+): connects/disconnects plugin servers per the new directory's settings

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
