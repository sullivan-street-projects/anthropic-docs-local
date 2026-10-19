---
title: "Claude Code MCP Servers"
source_url: "https://code.claude.com/docs/en/mcp"
source_type: "manual"
fetched_at: "2026-10-19T00:00:00Z"
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

> **Important: Option ordering** -- All options (`--transport`, `--env`, `--scope`, `--header`) must come before the server name. The `--` (double dash) separates the server name from the command and arguments passed to the MCP server.

**How Claude Code stops a stdio server:** on macOS/Linux it sends `SIGINT`, then `SIGTERM` after 100 ms, then `SIGKILL` after a further 400 ms. On Windows it closes the server's stdin, then ends the process tree after 300 ms (before v2.1.296, Windows ended the tree immediately). Handle the signal and finish shutdown work within that window.

### Remote WebSocket Server

WebSocket servers hold a persistent bidirectional connection, which suits remote MCP servers that push events to Claude unprompted. Use HTTP instead when your server only responds to requests.

```bash
claude mcp add-json events-server \
  '{"type":"ws","url":"wss://mcp.example.com/socket","headers":{"Authorization":"Bearer YOUR_TOKEN"}}'
```

The `type: "ws"` entry accepts the same `url`, `headers`, `headersHelper`, `timeout`, and `alwaysLoad` fields as `http`. The `claude mcp add --transport` flag does not accept `ws`; use `add-json` instead.

### Adding a Server from Another Client's Setup Instructions

Instructions written for Claude Desktop, Cursor, etc. usually give one of three shapes:

- **A URL** (`https://...`): `claude mcp add --transport http example https://mcp.example.com/mcp` (use SSE if the instructions say so; `wss://` needs `add-json` with `type: "ws"`)
- **A launch command** (`npx`, `uvx`, binary): `claude mcp add example --env API_KEY=your-key -- npx -y @example/mcp-server`
- **An `mcpServers` JSON block**: pass the object *inside* `mcpServers` to `claude mcp add-json <name> '<json>'`. Add a `type` (`http`/`sse`/`ws`) to a `url` entry that lacks one (no `type` is read as stdio), and rename keys containing characters other than letters, digits, hyphens, and underscores.

Each command writes to local scope unless you pass `--scope project` or `--scope user`. Verify with `claude mcp get <name>`.

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

If a referenced variable isn't set and has no default, the config still loads: Claude Code warns (in `claude mcp list` and `/mcp`) naming the variable and uses the unexpanded `${VAR}` text as-is.

**Credential variables read as empty:** in a remote server's `url` and `headers`, Claude Code reads credential variables as empty rather than expanding them -- Claude Code's own credentials (`ANTHROPIC_API_KEY`, `ANTHROPIC_AUTH_TOKEN`), cloud provider credentials (`AWS_BEARER_TOKEN_BEDROCK`), and others such as `HTTPS_PROXY` and `NPM_TOKEN`. This applies whether or not the variable is set, and `:-default` is ignored; the server typically answers `401`. Base URLs such as `ANTHROPIC_BASE_URL` still expand. To pass one of these credentials, copy it into a variable with your own name. The debug log notes `never expanded toward a remote server` when this happens.

For local/project/user-scope servers, `/mcp` detail views (v2.1.268+), `claude mcp list`, and `claude mcp get` show `${VAR}` references by name rather than resolved values; `managedMcpServers` entries show the URL host only.

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

Removing a remote server also deletes its stored OAuth tokens and client registration. `/mcp reconnect all` retries every failed or needs-auth server (interactive terminal: v2.1.284+).

### Server Status

`claude mcp list` shows health such as `✔ Connected`, `! Needs authentication`, `✘ Failed to connect`. Statuses that reflect configuration (no connection attempted):

- `⏸ Pending approval (run claude to approve)` -- unapproved `.mcp.json` server
- `✘ Rejected (see disabledMcpjsonServers in settings)` -- shown only in `claude mcp get`
- `⊘ Disabled for this project (re-enable via /mcp)` -- named in the project's `disabledMcpServers`
- `not configured` -- remote server with an empty `url` (e.g., plugin placeholder); not treated as an error (v2.1.208+)

For `✘ Failed to connect`, `claude mcp list` appends and `claude mcp get` shows on an `Issue:` line the HTTP status/error code plus server error text, with credential-like text redacted and no expanded URL (v2.1.219+).

**Workspace trust:** a cloned repo can't approve its own servers. `enableAllProjectMcpServers` / `enabledMcpjsonServers` committed in the project's `.claude/settings.json` are ignored until you trust the folder; approvals from user settings, managed settings, or `--settings` still apply. Untracked `.claude/settings.local.json` approvals apply only in a trusted folder (v2.1.207+). `disabledMcpjsonServers` in any file still rejects.

### Configuration Warnings

- **Hidden whitespace** in `command`, `url`, `args`, or `env`/`headers` keys/values (e.g., pasted token with trailing newline) -- warned, not trimmed
- **Same name in more than one scope** with different endpoints -- OAuth sign-ins are stored per endpoint
- **Reserved names** -- `workspace`, `claude-in-chrome`, `computer-use`, `Claude Preview`, `Claude Browser` are skipped at load; `claude mcp add` rejects them
- **Missing environment variable** -- see expansion rules above

### Tool Availability

The `/mcp` panel shows the tool count next to each connected server and flags servers that advertise the tools capability but expose no tools. If a request needs tools from a server still connecting, Claude waits inside the `ToolSearch` call (or uses the `WaitForMcpServers` tool when tool search is off). After resuming a session, a call to a tool whose server is on its first connection attempt is held up to 10 seconds; otherwise it fails with `No such tool available`.

### Disable a Server Without Removing It

Toggle a server off in `/mcp`. Claude Code records the choice per project in `~/.claude.json`:

- `disabledMcpServers` -- opt-out list for user-configured, plugin, managed-settings, self-fetched claude.ai connectors (by display name, e.g. `claude.ai Slack`), and default-on built-in servers
- `enabledMcpServers` -- opt-in list for default-off built-in servers such as `computer-use`

Each server is governed by exactly one list. These are unrelated to `enabledMcpjsonServers` / `disabledMcpjsonServers` (`.mcp.json` approval).

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

The command must write a JSON object of string key-value pairs to stdout, runs in a shell with a 10-second timeout, and executes fresh on each connection (no caching). Dynamic headers override static `headers` of the same name. Claude Code sets `CLAUDE_CODE_MCP_SERVER_NAME`, `CLAUDE_CODE_MCP_SERVER_URL`, and (for plugin servers) `CLAUDE_PLUGIN_ROOT` in the helper environment.

- On a `401`/`403` tool call, Claude Code re-runs the helper, reconnects, and retries once. An `Authorization` header from the helper disables OAuth fallback for the server.
- Plugin `headersHelper` can't use `${user_config.*}` (v2.1.207+); put it in `headers` instead.
- **Working directory** depends on where the server is configured: plugin root; the declaring project directory (`.mcp.json`/local scope); the session's primary working directory (project agent files, SDK `mcpServers`, `--mcp-config`); or `~/.claude`/`CLAUDE_CONFIG_DIR` (user scope, managed, claude.ai connectors, external agent files) (v2.1.238+).
- **Credential stripping**: helpers from a project `.mcp.json`, plugin, or project/`--add-dir` agent file run without credential-looking env vars (names containing `TOKEN`, `SECRET`, `PASSWORD`, `KEY`, `AUTH`, plus a fixed list like `ANTHROPIC_CUSTOM_HEADERS`). Read credentials from a file or store instead.
- **Trust**: helpers for project `.mcp.json` and local-scope servers run only after the trust dialog is accepted for that project directory (parent-folder trust doesn't count; v2.1.238+). Until then the server connects with static `headers` only, and `-p`/SDK sessions print `headersHelper not run`. Trust without a dialog via `projects["<path>"].hasTrustDialogAccepted: true` in `~/.claude.json`.

## Tool Search

When many MCP tools are configured, tool search dynamically loads tools on-demand to save context window space. Tool search is enabled by default -- MCP tools are deferred and discovered on demand.

### How It Works

Only tool names and server instructions load at session start. Claude uses a search tool to discover relevant tools when a task needs them. Only the tools Claude actually uses enter context.

### Configure Tool Search

| Value    | Behavior                                                                                                   |
| -------- | ---------------------------------------------------------------------------------------------------------- |
| (unset)  | All MCP tools deferred. Falls back to upfront loading on models earlier than Opus 4/Sonnet 4, Agent Platform (Vertex) models earlier than Opus/Sonnet/Haiku 4.5, non-first-party `ANTHROPIC_BASE_URL`, or Microsoft Foundry deployments hosted on Azure |
| `true`   | Keeps tools deferred behind a non-first-party `ANTHROPIC_BASE_URL` (sends beta header through proxies); other fallbacks still apply |
| `auto`   | Threshold mode: tools load upfront if they fit within 10% of context                                       |
| `auto:N` | Threshold mode with custom percentage (e.g., `auto:5` for 5%)                                              |
| `false`  | All MCP tools loaded upfront, no deferral                                                                  |

```bash
ENABLE_TOOL_SEARCH=auto       # auto threshold
ENABLE_TOOL_SEARCH=auto:5     # 5% custom threshold
ENABLE_TOOL_SEARCH=true       # always enabled
ENABLE_TOOL_SEARCH=false      # disabled
```

Tool search is used on Claude Opus 4, Sonnet 4, Haiku 4.5, and later (Opus/Sonnet/Haiku 4.5+ on Google Cloud's Agent Platform, on by default since v2.1.221). `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS` keeps it off (organizations can override via managed settings on v2.1.227+); HIPAA-configured sessions keep it off with no override.

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

An MCP server can also mark individual tools as always-loaded by including `"anthropic/alwaysLoad": true` in the tool's `_meta` object. A tool-level `false` keeps the tool deferred even when a `--mcp-config`, Agent SDK, or plugin server sets `"alwaysLoad": true` (v2.1.285+). Setting `"alwaysLoad": false` on a server keeps all its tools deferred, including author-marked ones (v2.1.287+).

`alwaysLoad: true` makes startup wait for the server (capped at the 5-second connect timeout) unless it has a valid `cached` entry. Other servers connect in the background; set `MCP_CONNECTION_NONBLOCKING=0` to make startup wait for them too.

### For MCP Server Authors

Server instructions help Claude understand when to search for your tools. Claude Code truncates server instructions and upfront-loaded tool descriptions at 4,096 characters, and descriptions of tools loaded through tool search at 16,384 characters (before v2.1.296 the shorter limit was 2,048; before v2.1.295 it applied to all descriptions). Tool search matches only within the shorter limit, so put key terms near the start. `CLAUDE_CODE_MAX_MCP_DESCRIPTION_LENGTH` (v2.1.280+) replaces both limits.

## Dynamic Tool Updates

Claude Code supports MCP `list_changed` notifications, allowing MCP servers to dynamically update their available tools, prompts, and resources without requiring you to disconnect and reconnect. In `-p` mode and the Agent SDK, only the tool list refreshes. A failed refresh keeps the previously discovered lists (v2.1.214+).

## MCP Client Runtimes

Claude Code uses one of two client runtimes per launch: v1 (MCP TypeScript SDK 1.x) or v2 (MCP TypeScript SDK 2.0, adding protocol revision 2026-07-28). v2 is used on v2.1.232+ in sessions that fetch feature flags, and by default on v2.1.274+ for Bedrock, Claude Platform on AWS, Agent Platform, Foundry, Claude apps gateway, and sessions with telemetry/flag fetching off. On v2, Claude Code:

- Negotiates the newer revision with HTTP, stdio, and claude.ai connector servers
- Receives `list_changed` over a held-open stream (reopened up to 3 times if it closes within 10 s; after 5 reopens in an hour of longer-lived streams, waits ~6 hours)
- Doesn't register channel servers on the newer revision (it can't carry channel messages)
- Fails OAuth sign-ins whose authorization response names an unexpected issuer, and sends OAuth credentials only to HTTPS or loopback token endpoints

Override with `MCP_SDK_GENERATION=v1|v2` and `MCP_PROTOCOL_NEGOTIATION=auto|legacy`.

## Automatic Reconnection

If a remote server disconnects mid-session, Claude Code automatically reconnects with exponential backoff: up to five attempts, starting at a one-second delay and doubling each time; after that it marks the server failed (`MCP server "<name>" disconnected · open /mcp to reconnect`). In `-p` and Agent SDK sessions, HTTP/SSE servers keep retrying in the background for up to about half an hour. Initial HTTP/SSE connection failures retry up to three times on transient errors (not for WebSocket, or for auth/not-found errors unless a `headersHelper` supplies the only `Authorization` header). Capability discovery requests (`tools/list`, `prompts/list`, `resources/list`) also retry transient errors up to three times. Stdio servers are local processes and are not reconnected automatically.

## Idle Timeout

As of v2.1.187, a tool call to an MCP server that sends no response and no progress notification for the idle window aborts with an error instead of waiting for the wall-clock limit. The idle window defaults to 5 minutes for HTTP, SSE, WebSocket, and claude.ai connector servers, and to 30 minutes for stdio servers (as of v2.1.203; before that, stdio servers were exempt). It applies to every server type except IDE servers and SDK in-process servers. Set `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT` in milliseconds to change the idle window, or set it to `0` to disable the check.

A per-server `timeout` of at least 1000 also acts as a floor on the idle timeout (v2.1.203+): Claude Code never aborts that server's tool calls for idleness sooner than the per-server `timeout`.

### Per-Request Timer

For HTTP, SSE, or claude.ai connector servers, a second per-request timer covers each request through to the server's first response byte. That timer is 60 seconds unless you set the per-server `timeout` or `MCP_TOOL_TIMEOUT`; setting either to 60 seconds or higher raises the per-request timer to that value (a lower value doesn't shorten it). Stdio and WebSocket servers have no per-request timer.

## Automatic Backgrounding of Long Tool Calls

As of v2.1.212, an MCP tool call in the main conversation that is still running after two minutes moves to a background task instead of blocking the session. Claude receives the task ID immediately and keeps working; the result arrives as a task notification when the call settles. The task appears in `/tasks`, where you can also stop it, and doesn't survive exiting the session. Per-call limits (wall-clock and idle timeouts) still apply while the call runs in the background.

Set `CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS` in milliseconds to change the threshold, or `0` to turn backgrounding off. Setting `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1` also disables it. Some calls never move to the background: calls from subagents, calls to IDE servers, calls in non-interactive mode (unless `CLAUDE_AUTO_BACKGROUND_TASKS=1`), and calls waiting on an open elicitation dialog.

## Discovery Cache

As of v2.1.221, a remote (HTTP or SSE) server you've used before can show a `cached` status in `/mcp` and `/plugin`, such as `cached 2h ago · connects on first use · 5 tools`. Claude Code loaded the server's tool list from a previous session instead of connecting at startup, and connects the server the first time Claude calls one of its tools. The tools are available from your first message. The discovery cache is off by default (since v2.1.238) unless a gradual rollout enables it; set `MCP_DISCOVERY_CACHE=1` to turn it on or `0` to keep it off. **Disable** or **Clear authentication** in `/mcp` discards the server's cache entry.

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

**How connectors arrive:** terminal, VS Code, JetBrains, and Agent SDK sessions fetch connectors themselves (governed by the settings below and managed MCP). Cloud sessions receive them from the host (governed by org settings plus allow/deny lists; dropped if a `managed-mcp.json` is on the host). Desktop app local/SSH sessions receive them in-process as `type: "sdk"` servers (governed only by org `blocked` tool controls).

### Organization Controls on Connector Tools

- **`ask`**: prompts on every call (`Your organization requires approval for this tool`), even in `acceptEdits`, `auto`, and `bypassPermissions`; allow rules don't skip it; `dontAsk` denies
- **`blocked`**: filtered out before Claude sees it; `/mcp` shows it as `disabled by your organization`

### Disable claude.ai Connectors

Set `disableClaudeAiConnectors` to `true` in any settings scope, or use the environment variable:

```bash
ENABLE_CLAUDEAI_MCP_SERVERS=false claude
```

`disableClaudeAiConnectors` uses any-source-true semantics (a project-level `false` can't re-enable) and applies only to connectors Claude Code fetches itself. To block individual connectors, add them to `deniedMcpServers` by name (e.g., `"claude.ai Slack"`) or URL pattern.

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
- Per-tool override: Set `_meta["anthropic/maxResultSizeChars"]` in tool's `tools/list` response (up to 500,000 characters hard ceiling)
- Over the limit: results without images are saved to a file in the session's `tool-results` directory and replaced with the path; text results over 50,000 characters are also persisted (unless the tool declares `maxResultSizeChars`)
- Error results (`isError: true`) over ~11,000 characters keep only the first and last 5,000
- HTTP/SSE responses and WebSocket messages over 16 MiB fail the request (WebSocket closes the connection)
- Images (PNG/JPEG/GIF/WebP) are shown inline and the original bytes saved to `tool-results` (v2.1.283+; not with `--no-session-persistence`)

## Tool Schema Handling

- **Root-level `anyOf`/`oneOf`/`allOf`**: flattened into one object, with a description note about which parameter groups belong together; keep validating server-side
- **Invalid schemas**: tools whose top-level property names aren't 1-64 chars of `[A-Za-z0-9_.-]` or that fail JSON Schema draft 2020-12 validation are excluded (feature-flagged; v2.1.216+), and Claude is told why
- **Names over 128 characters** (`mcp__<server>__<tool>`): left out of the tools sent to Claude

## Require Approval for a Specific Tool

Server authors can set `_meta["anthropic/requiresUserInteraction"]: true` on a tool. Claude Code then prompts on every call, even in `acceptEdits`, `auto`, and `bypassPermissions`, with no "don't ask again"; allow rules don't skip it; `dontAsk` denies. `--permission-prompt-tool` allows are converted to denies; the Agent SDK `canUseTool` callback can approve. One-tap approval on Remote Control/SDK surfaces is withheld (v2.1.214+).

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
| `MCP_DISCOVERY_CACHE`                | `1` enables cached discovery, `0` keeps it off (off by default)            |
| `MCP_SDK_GENERATION`                 | Client runtime: `v1` or `v2`                                               |
| `MCP_PROTOCOL_NEGOTIATION`           | `auto` or `legacy`                                                         |
| `MCP_CONNECTION_NONBLOCKING`         | Set to `0` to make startup wait for all servers                            |
| `CLAUDE_CODE_MAX_MCP_DESCRIPTION_LENGTH` | Overrides tool description / server instruction truncation limits      |

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

Plugin MCP servers start automatically when the plugin is enabled. Plugin tool names follow the format `mcp__plugin_<plugin-name>_<server-name>__<tool-name>`.

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
