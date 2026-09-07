---
title: "Best Practices: MCP Server Credential Management & Access Control"
source_url: "https://code.claude.com/docs/en/mcp-servers"
source_type: "manual"
fetched_at: "2026-09-07T00:00:00Z"
category: "claude-code"
---

# Best Practices: MCP Server Credential Management & Access Control

> **Documentation Status:** MCP server configuration is comprehensively documented at [code.claude.com/docs/en/mcp](https://code.claude.com/docs/en/mcp). All claims in this document have been verified against the official documentation as of September 2026.

---

## 1. The Core Problem

When you configure MCP servers for a project, credentials (API keys, tokens, database URLs) must flow to those servers. The challenge:

- **Committed code** (`.mcp.json`) needs to be shareable across a team
- **Secrets** must never be committed to version control
- **Each developer** may have different credentials for the same service

The solution is a **two-file architecture** that cleanly separates _what servers to use_ from _how to authenticate_.

---

## 2. The Two-File Architecture

```
your-project/
+-- .mcp.json          <- Committed to git (declares servers, references env vars)
+-- .env               <- NEVER committed (holds actual secrets)
+-- .env.example        <- Committed (documents required variables)
+-- .gitignore          <- Must include .env
```

### File 1: `.mcp.json` (Committed -- The Server Declaration)

This file declares _which_ MCP servers the project uses. It references credentials via environment variable placeholders -- never hardcoded values. The `type` field accepts `streamable-http` as an alias for `http`, so configurations copied from MCP server documentation work without modification. A JSON entry with a `url` but no `type` is a configuration error -- Claude Code reads an entry with no `type` as a stdio server.

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "${DATABASE_URL}"]
    },
    "custom-api": {
      "type": "http",
      "url": "${API_BASE_URL:-https://api.example.com}/mcp",
      "headers": {
        "Authorization": "Bearer ${API_KEY}"
      }
    }
  }
}
```

**Source:** [MCP Documentation](https://code.claude.com/docs/en/mcp) -- _"Environment variable expansion is supported in server configurations using the syntax `${VARIABLE_NAME}` with an optional default value `${VARIABLE_NAME:-default_value}`."_

### File 2: `.env` (Never Committed -- The Secrets)

```bash
# .env -- Each developer creates their own
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
API_BASE_URL=https://api.staging.example.com
API_KEY=sk-xxxxxxxxxxxxxxxx
```

### File 3: `.env.example` (Committed -- The Template)

```bash
# .env.example -- Copy to .env and fill in your values
GITHUB_TOKEN=           # GitHub personal access token (repo scope)
DATABASE_URL=           # PostgreSQL connection string
API_BASE_URL=           # Optional: defaults to https://api.example.com
API_KEY=                # API key for the custom service
```

---

## 3. Understanding MCP Scopes

Claude Code supports three user-facing scopes for MCP server configuration, plus plugin-provided and claude.ai connector sources. Each is stored in a different location with different visibility:

| Scope         | Storage Location                      | Shared?                 | Added Via                               | Use Case                              |
| ------------- | ------------------------------------- | ----------------------- | --------------------------------------- | ------------------------------------- |
| **Local**     | `~/.claude.json` (under project path) | No -- per-user          | `claude mcp add <name>` (default)       | Personal servers, per-project secrets |
| **Project**   | `.mcp.json` (project root)            | Yes -- committed to git | `claude mcp add --scope project <name>` | Team-shared servers                   |
| **User**      | `~/.claude.json` (global section)     | No -- per-user          | `claude mcp add --scope user <name>`    | Cross-project personal servers        |
| **Plugin**    | Plugin `.mcp.json` or `plugin.json`   | Via plugin install      | Plugin bundled                          | Plugin-distributed tools              |
| **claude.ai** | claude.ai account                     | Via claude.ai settings  | claude.ai Connectors UI                 | Cloud-synced connectors               |
| **Managed**   | System-wide `managed-mcp.json`        | Org-wide                | Enterprise admin                        | Organizational standards              |

### Scope Precedence

When the same server name exists in multiple scopes, the entire server entry from the highest-precedence source is used (fields are not merged across scopes):

```
Local > Project > User > Plugin > claude.ai connectors
```

The three user-facing scopes (Local, Project, User) match duplicates by name. Plugins and connectors match by endpoint, so one that points at the same URL or command as a server above is treated as a duplicate.

A Local definition always overrides a Project definition of the same name. Managed servers (via `managed-mcp.json`) are always present but can be overridden by any scope above.

**Source:** [MCP Documentation](https://code.claude.com/docs/en/mcp) -- scope definitions and precedence rules.

---

## 4. Environment Variable Expansion

### Syntax

| Pattern           | Behavior                                                     | Example                                    |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------ |
| `${VAR}`          | Expands to value; config parse fails if unset and no default | `${API_KEY}`                               |
| `${VAR:-default}` | Expands to value; uses default if unset                      | `${API_BASE_URL:-https://api.example.com}` |

### Where Expansion Works

Environment variables are expanded in these fields:

- `command` -- the server executable
- `args` -- command-line arguments
- `env` -- environment variables passed to the server process
- `url` -- HTTP/SSE/WebSocket endpoint URLs
- `headers` -- HTTP request headers

**Warning:** If a variable isn't set and has no default, Claude Code reports a warning and uses the unexpanded `${VAR}` text. Set the variable or add a `:-default` fallback.

**Source:** [MCP Documentation](https://code.claude.com/docs/en/mcp) -- _"The expansion works in the `command`, `args`, `env`, `url`, and `headers` fields."_

### `CLAUDE_PROJECT_DIR` for Stdio Servers

Claude Code sets `CLAUDE_PROJECT_DIR` in the spawned server's environment to the project root, so your server can resolve project-relative paths without depending on the working directory. This is the same directory hooks receive. Read it inside your server process (e.g., `process.env.CLAUDE_PROJECT_DIR` in Node or `os.environ["CLAUDE_PROJECT_DIR"]` in Python).

Referencing it via `${VAR}` expansion in `.mcp.json` requires a default such as `${CLAUDE_PROJECT_DIR:-.}` since the variable is set in the server's environment, not Claude Code's own environment.

### Three Ways to Provide Variable Values

1. **Shell environment** -- Export before launching Claude Code:

   ```bash
   export GITHUB_TOKEN=ghp_xxx
   claude
   ```

2. **`.env` file** -- Claude Code reads `.env` from the project root automatically

3. **Per-user MCP override** -- Use Local scope to set server-specific env vars:
   ```bash
   claude mcp add --env GITHUB_TOKEN=ghp_xxx github -- npx -y @modelcontextprotocol/server-github
   ```

---

## 5. Best Practices

### 5.1 Always Use Environment Variables for Secrets

**Do:**

```json
{
  "mcpServers": {
    "api": {
      "type": "http",
      "url": "${API_URL}/mcp",
      "headers": { "Authorization": "Bearer ${API_KEY}" }
    }
  }
}
```

**Don't:**

```json
{
  "mcpServers": {
    "api": {
      "type": "http",
      "url": "https://api.example.com/mcp",
      "headers": { "Authorization": "Bearer sk-actual-secret-key-here" }
    }
  }
}
```

Hardcoded secrets in `.mcp.json` will be committed to git and visible to anyone with repository access.

### 5.2 Provide Defaults for Non-Secret Configuration

Use the `${VAR:-default}` syntax for values that have sensible defaults but can be overridden:

```json
{
  "mcpServers": {
    "api": {
      "type": "http",
      "url": "${API_BASE_URL:-https://api.example.com}/mcp"
    }
  }
}
```

This means new developers can start immediately with the default URL while allowing staging/local overrides via `.env`.

### 5.3 Create a `.env.example` for Onboarding

Every project with MCP servers should include a `.env.example` that documents:

- Every required environment variable
- What kind of value is expected (token, URL, connection string)
- Where to obtain it (link to dashboard, admin instructions)
- Which variables are optional vs required

```bash
# .env.example
# Required: GitHub Personal Access Token
# Create at: https://github.com/settings/tokens (repo scope)
GITHUB_TOKEN=

# Required: Database connection string
# Format: postgresql://user:password@host:port/database
DATABASE_URL=

# Optional: API base URL (defaults to production)
API_BASE_URL=
```

### 5.4 Lock Down `.gitignore`

At minimum, your `.gitignore` must include:

```gitignore
# Secrets
.env
.env.local
.env.*.local

# Claude Code local settings (contains per-user MCP configs)
# Note: .mcp.json is intentionally NOT in .gitignore -- it's meant to be shared
```

### 5.5 Use Project Scope for Shared Servers

When adding a server the whole team needs:

```bash
# Adds to .mcp.json (committed, shared with team)
claude mcp add --scope project \
  --env GITHUB_TOKEN='${GITHUB_TOKEN}' \
  github -- npx -y @modelcontextprotocol/server-github
```

When adding a server only you need:

```bash
# Adds to ~/.claude.json (never committed, only on your machine)
claude mcp add my-personal-server -- npx my-server
```

### 5.6 Use `add-json` for Complex Configurations

For servers with headers, multiple env vars, or HTTP transport:

```bash
claude mcp add-json custom-api '{
  "type": "http",
  "url": "${API_URL:-https://api.example.com}/mcp",
  "headers": {
    "Authorization": "Bearer ${API_KEY}",
    "X-Team-Id": "${TEAM_ID}"
  }
}'
```

**Source:** [MCP Documentation](https://code.claude.com/docs/en/mcp) -- `claude mcp add-json` command reference.

### 5.7 Verify Configuration Before Sharing

Before committing `.mcp.json` changes, verify that:

1. **No secrets are hardcoded** -- grep for patterns like `sk-`, `ghp_`, `Bearer [a-zA-Z0-9]`
2. **All variables are documented** in `.env.example`
3. **Defaults make sense** -- will a new developer get working defaults?
4. **Server names are descriptive** -- `postgres-analytics` not `db1`
5. **Reserved names are avoided** -- the names `workspace`, `claude-in-chrome`, `computer-use`, `Claude Preview`, and `Claude Browser` are reserved for internal use; Claude Code silently skips servers with reserved names, and `claude mcp add` rejects them with an error

```bash
# Quick audit: find any hardcoded-looking secrets
grep -E '(sk-|ghp_|Bearer [a-zA-Z0-9]{10,}|password|secret)' .mcp.json
```

---

## 6. OAuth & Browser-Based Authentication

For MCP servers that support OAuth (no static API key needed), Claude Code provides browser-based authentication:

```bash
# OAuth flow -- opens browser for consent
claude mcp add --transport http my-oauth-server https://server.example.com/mcp
```

When the server supports OAuth, Claude Code will:

1. Open a browser window for the OAuth consent flow
2. Store the resulting token locally (per-user, never committed)
3. Automatically refresh tokens as needed

Claude Code marks a remote server as needing authentication when the server responds with `401 Unauthorized` or `403 Forbidden`. If you configured `headers.Authorization` and the server rejects it, Claude Code reports a connection failure instead of falling back to OAuth -- check that the token is valid.

### Command-Line OAuth Login

From v2.1.186, `claude mcp login` runs the OAuth flow directly from the shell without opening a session:

```bash
claude mcp login sentry
```

To clear stored credentials later:

```bash
claude mcp logout sentry
```

As of v2.1.191, the command detects headless environments (SSH, no display server) and prints the authorization URL for you to open on another machine, then paste the redirect URL back at the prompt:

```bash
# Force URL prompt even when a local browser is available
claude mcp login sentry --no-browser
```

### Use a Fixed OAuth Callback Port

Some servers require a pre-registered redirect URI. Fix the callback port to match:

```bash
# Fixed callback port with dynamic client registration
claude mcp add --transport http \
  --callback-port 8080 \
  my-server https://mcp.example.com/mcp
```

### Use Pre-Configured OAuth Credentials

For servers that don't support Dynamic Client Registration (or Client ID Metadata Documents), register an OAuth app through the server's developer portal first:

```bash
claude mcp add --transport http \
  --client-id your-client-id --client-secret --callback-port 8080 \
  my-server https://mcp.example.com/mcp
```

Additional methods for providing the client secret:

```bash
# Via add-json
claude mcp add-json my-server \
  '{"type":"http","url":"https://mcp.example.com/mcp","oauth":{"clientId":"your-client-id","callbackPort":8080}}' \
  --client-secret

# Via environment variable (CI/non-interactive use)
MCP_CLIENT_SECRET=your-secret claude mcp add --transport http \
  --client-id your-client-id --client-secret --callback-port 8080 \
  my-server https://mcp.example.com/mcp
```

The client secret is stored securely in your system keychain (macOS) or a credentials file, not in your config.

### Override OAuth Metadata Discovery

Point Claude Code at a specific OAuth authorization server metadata URL to bypass the default discovery chain. By default, Claude Code checks RFC 9728 Protected Resource Metadata, then falls back to RFC 8414 authorization server metadata:

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

The URL must use `https://`.

### Restrict OAuth Scopes

Pin the scopes Claude Code requests during the authorization flow, restricting to a security-team-approved subset:

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

`oauth.scopes` takes precedence over both `authServerMetadataUrl` and auto-discovered scopes. If the authorization server advertises `offline_access` in `scopes_supported`, Claude Code appends it automatically so tokens can be refreshed without re-login.

**Source:** [MCP Documentation](https://code.claude.com/docs/en/mcp) -- OAuth and browser-based authentication section.

---

## 7. Dynamic Headers for Custom Authentication

For authentication schemes other than OAuth (Kerberos, short-lived tokens, internal SSO), use `headersHelper` to generate request headers at connection time:

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

Or inline:

```json
{
  "mcpServers": {
    "internal-api": {
      "type": "http",
      "url": "https://mcp.internal.example.com",
      "headersHelper": "echo '{\"Authorization\": \"Bearer '\"$(get-token)\"'\"}'"
    }
  }
}
```

**Requirements:**

- The command must write a JSON object of string key-value pairs to stdout
- The command runs in a shell with a 10-second timeout
- Specify as an absolute path or put on `PATH`
- Dynamic headers override any static `headers` with the same name
- The helper runs fresh on each connection (session start and reconnect) with no caching

Claude Code sets these environment variables when executing the helper:

| Variable                      | Value                                          |
| ----------------------------- | ---------------------------------------------- |
| `CLAUDE_CODE_MCP_SERVER_NAME` | The name of the MCP server                     |
| `CLAUDE_CODE_MCP_SERVER_URL`  | The URL of the MCP server                      |
| `CLAUDE_PLUGIN_ROOT`          | Plugin root directory (if from plugin)         |

**Security:** Credential-like environment variables (TOKEN, SECRET, PASSWORD, KEY, AUTH) are removed from the helper's environment for servers in project `.mcp.json` or at local scope.

### Trust Before headersHelper Runs

For project `.mcp.json` servers or local-scope servers, `headersHelper` runs only after accepting the [trust dialog](https://code.claude.com/docs/en/permissions#project-allow-rules-and-workspace-trust).

To bypass the dialog (e.g., in automated environments), set in `~/.claude.json`:

```json
{
  "projects": {
    "<path>": {
      "hasTrustDialogAccepted": true
    }
  }
}
```

`headersHelper` executes arbitrary shell commands. When defined at project or local scope, it only runs after you accept the workspace trust dialog.

**Source:** [MCP Documentation](https://code.claude.com/docs/en/mcp) -- Dynamic headers section.

---

## 8. Enterprise & Managed MCP

For organizations using managed MCP deployment:

### Managed Scope

Administrators can deploy MCP servers organization-wide through `managed-mcp.json`, which:

- Provides a base set of servers to all users
- Cannot be removed by individual users (always present but lowest-priority)
- Can include allowlists/denylists to control which MCP tools and servers are available

### Server and Tool Controls

Enterprise admins can restrict MCP server and tool usage:

```json
{
  "mcpServers": {
    "approved-server": { "...": "..." }
  },
  "allowedMcpTools": ["approved-server:safe-tool"],
  "deniedMcpTools": ["any-server:dangerous-tool"]
}
```

Servers can be restricted with `allowedMcpServers` and `deniedMcpServers`, which accept server names or URL patterns. See the dedicated [Managed MCP documentation](https://code.claude.com/docs/en/managed-mcp) for full details.

### claude.ai Connectors

MCP servers added in claude.ai are automatically available in Claude Code when authenticated with a claude.ai account. Connectors you have never signed in to are collapsed in the `/mcp` panel. Connectors from claude.ai are only fetched when the active authentication method is your claude.ai subscription (not when using `ANTHROPIC_API_KEY`, `apiKeyHelper`, or third-party providers).

#### Organization Controls on Connectors

Your organization can set per-tool controls on connectors:

- **Tool set to `ask`**: Claude Code prompts on every call with reason "Your organization requires approval for this tool"
- **Tool set to `blocked`**: Tool filtered out before Claude sees it

#### Disabling Connectors

To disable all claude.ai connectors:

```json
{
  "disableClaudeAiConnectors": true
}
```

Or via environment variable:

```bash
ENABLE_CLAUDEAI_MCP_SERVERS=false claude
```

To block individual connectors rather than all of them, add them to `deniedMcpServers` by name or URL pattern:

```json
{
  "deniedMcpServers": ["claude.ai Slack"]
}
```

**Source:** [MCP Documentation](https://code.claude.com/docs/en/mcp) -- Managed MCP and enterprise controls.

---

## 9. Tools Requiring User Interaction

MCP servers can mark specific tools as requiring user approval on every call, regardless of permission mode:

```json
{
  "name": "grant_access",
  "description": "Requests access to a protected resource",
  "_meta": {
    "anthropic/requiresUserInteraction": true
  }
}
```

This is set by the server, not by Claude Code configuration. Tools marked this way always prompt the user before execution.

---

## 10. The Complete Developer Onboarding Flow

Here's the recommended onboarding experience for a new developer joining a project with MCP servers:

```
Step 1: Clone the repository
         +-- Gets .mcp.json and .env.example automatically

Step 2: Copy .env.example to .env
         $ cp .env.example .env

Step 3: Fill in personal credentials in .env
         $ vim .env  (add your tokens, keys, URLs)

Step 4: Start Claude Code
         $ claude
         * MCP servers start with your credentials
         * Team-shared server configurations from .mcp.json
         * Your secrets stay local in .env
         * Project-scoped servers prompt for approval on first use

Step 5: (Optional) Add personal servers
         $ claude mcp add my-notes -- npx my-notes-server
         +-- Saved to ~/.claude.json (local scope, not shared)

Step 6: (Optional) Authenticate remote OAuth servers
         $ claude mcp login sentry
         +-- Opens browser or prints URL for headless auth
```

---

## 11. MCP Management Commands

Quick reference for managing MCP servers via the CLI:

```bash
# List all configured servers (all scopes)
claude mcp list

# Add a stdio server (local scope by default)
claude mcp add <name> -- <command> [args...]

# Add an HTTP server
claude mcp add --transport http <name> <url>

# Add a WebSocket server (via JSON only)
claude mcp add-json events-server '{"type":"ws","url":"wss://mcp.example.com/socket"}'

# Add with environment variables
claude mcp add --env KEY=value --env KEY2=value2 <name> -- <command>

# Add with full JSON configuration
claude mcp add-json <name> '{ "type": "http", "url": "..." }'

# Import servers from Claude Desktop
claude mcp add-from-claude-desktop

# Inspect a server's configuration
claude mcp get <name>

# Remove a server
claude mcp remove <name>

# Authenticate from command line (no session needed)
claude mcp login <name>

# Clear stored OAuth credentials
claude mcp logout <name>

# Reset project tool approval choices
claude mcp reset-project-choices
```

**Source:** [MCP Documentation](https://code.claude.com/docs/en/mcp) -- CLI commands section.

---

## 12. Server Status & Configuration Warnings

### Status Indicators

The `/mcp` panel shows these connection states:

| Indicator                | Meaning                                                                                 |
| ------------------------ | --------------------------------------------------------------------------------------- |
| `✔ Connected`            | Successfully connected                                                                  |
| `! Needs authentication` | Requires OAuth sign-in                                                                  |
| `✘ Failed to connect`    | Connection error                                                                        |
| `⏸ Pending approval`     | Project `.mcp.json` server awaiting approval                                             |
| `✘ Rejected`             | Blocked by `disabledMcpjsonServers`                                                     |
| `⊘ Disabled`             | Toggled off in `/mcp`                                                                   |
| `cached ... ago`         | Tool list loaded from cache; connects on first tool call                                |

### Configuration Warnings

Claude Code warns about these common issues:

- **Hidden whitespace**: Values with leading/trailing whitespace (e.g., token pasted with trailing newline). Edit configuration to remove it.
- **Same name in multiple scopes**: Warns when a server name is defined in multiple scopes with different endpoints. OAuth sign-ins are stored per endpoint. Keep one definition and remove others: `claude mcp remove <name> --scope <scope>`.
- **Missing environment variable**: Warns when a `${VAR}` reference has no default and the variable is unset. Set the variable or add a `${VAR:-default}` fallback.

---

## 13. MCP Output & Timeouts

### Output Limits

- **Warning threshold**: 10,000 tokens
- **Default limit**: 25,000 tokens
- **Configurable**: `MAX_MCP_OUTPUT_TOKENS` environment variable

```bash
export MAX_MCP_OUTPUT_TOKENS=50000
claude
```

### Per-Tool Size Limits

Servers can declare larger limits per tool via metadata:

```json
{
  "name": "get_schema",
  "description": "Returns the full database schema",
  "_meta": {
    "anthropic/maxResultSizeChars": 200000
  }
}
```

### Timeouts

| Setting                                | Default                                  | Purpose                                                   |
| -------------------------------------- | ---------------------------------------- | --------------------------------------------------------- |
| `MCP_TIMEOUT`                          | System default                           | Overall startup timeout                                   |
| `MCP_TOOL_TIMEOUT`                     | ~28 hours                                | Per-tool call timeout                                     |
| Per-server `timeout`                   | None                                     | Milliseconds, set in `.mcp.json` entry                    |
| `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT`    | 5 min (HTTP/SSE/WS), 30 min (stdio)     | Abort tool call with no response/progress                 |
| `CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS`   | 2 minutes                                | Move long MCP tool calls to background task (v2.1.212+)   |

Per-server `timeout` example:

```json
{
  "mcpServers": {
    "my-server": {
      "type": "http",
      "url": "https://example.com/mcp",
      "timeout": 600000
    }
  }
}
```

A per-server `timeout` of at least 1000 ms also acts as a floor for idle aborts, so idle aborts never fire sooner than that value (v2.1.203+). Set `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT` to `0` to disable idle timeout entirely. Set `CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS` to `0` to disable auto-backgrounding.

---

## 14. Common Pitfalls

| Pitfall                                         | Problem                                           | Fix                                                   |
| ----------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------- |
| Hardcoded secrets in `.mcp.json`                | Secrets committed to git                          | Use `${VAR}` expansion                                |
| Missing `.env` from `.gitignore`                | Secrets accidentally committed                    | Add `.env` to `.gitignore` immediately                |
| No `.env.example`                               | New developers don't know what vars are needed    | Create `.env.example` with all required vars          |
| Using Local scope for team servers              | Only works on your machine                        | Use `--scope project` for `.mcp.json`                 |
| Using Project scope for personal servers        | Leaks your server setup to the team               | Use Local scope (default) or `--scope user`           |
| Same server name in multiple scopes             | Confusion about which config is active            | Remember: Local > Project > User > Plugin > claude.ai |
| Forgetting `--scope project`                    | Server added to Local instead of `.mcp.json`      | Re-add with `--scope project`                         |
| Not testing with a fresh `.env`                 | Config works for you but breaks for others        | Test by removing `.env` and using `.env.example`      |
| Using reserved name `workspace`                 | Server silently skipped at load time              | Choose a different server name                        |
| Static `Authorization` header with OAuth server | Connection fails instead of falling back to OAuth | Remove the header to use the OAuth flow               |
| Missing `--` separator for stdio                | Claude Code parses server flags as its own        | Always use `--` before server command                 |
| JSON entry with `url` but no `type`             | Misread as stdio server                           | Always set `"type": "http"` for HTTP servers          |

---

## 15. MCP Elicitation for Interactive Auth

MCP servers can request structured input mid-task via **elicitation**. This is useful for interactive authentication flows where the server needs credentials it can't get from environment variables. No configuration is required on your side -- elicitation dialogs appear automatically when a server requests them.

Two modes are available:

- **Form mode**: The server presents form fields (e.g., username/password). Claude Code shows an interactive dialog.
- **URL mode**: The server opens a browser URL for OAuth or approval flows.

To auto-respond without showing a dialog (e.g., for CI/CD or automated pipelines), use the `Elicitation` hook:

```json
{
  "hooks": {
    "Elicitation": [
      {
        "matcher": "my-auth-server",
        "hooks": [
          {
            "type": "command",
            "command": "echo '{\"action\": \"accept\", \"content\": {\"token\": \"'$MY_TOKEN'\"}}'",
            "timeout": 5000
          }
        ]
      }
    ]
  }
}
```

See [claude-code/hooks.md](../claude-code/hooks.md) for the full `Elicitation` and `ElicitationResult` hook schemas.

---

## 16. Connection Reliability

### Automatic Reconnection

If an HTTP or SSE server disconnects mid-session, Claude Code automatically reconnects with exponential backoff: up to five attempts, starting at one second and doubling each time. The server appears as pending in `/mcp` while reconnection is in progress. After five failed attempts the server is marked as failed and you can retry manually from `/mcp`.

As of v2.1.121, initial connections also retry up to three times on transient errors (5xx, connection refused, timeout). Authentication and not-found errors are not retried.

As of v2.1.191, capability discovery requests (`tools/list`, `prompts/list`, `resources/list`) also retry transient errors up to three times with short backoff.

Stdio servers are local processes and are not reconnected automatically.

### Auto-Backgrounding Long Tool Calls

As of v2.1.212, an MCP tool call in the main conversation still running after two minutes moves to a background task instead of blocking the session. Set `CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS` in milliseconds to change the threshold, or `0` to disable.

---

## 17. Security Checklist

Before committing any MCP configuration:

- [ ] No hardcoded API keys, tokens, or passwords in `.mcp.json`
- [ ] `.env` is listed in `.gitignore`
- [ ] `.env.example` exists and documents all required variables
- [ ] Default values (`${VAR:-default}`) are non-secret and sensible
- [ ] Server names are descriptive and not reserved (`workspace`, `claude-in-chrome`, `computer-use`, `Claude Preview`, `Claude Browser`)
- [ ] OAuth servers don't include static tokens in committed config
- [ ] OAuth scopes are restricted to the minimum necessary (`oauth.scopes`)
- [ ] `headersHelper` scripts are reviewed for security (they execute arbitrary commands)
- [ ] Team members have been informed of required credentials
- [ ] `grep -rn 'sk-\|ghp_\|Bearer [a-z]' .mcp.json` returns no results
- [ ] Pre-configured OAuth client secrets use `MCP_CLIENT_SECRET` env var or keychain, never plaintext in config
- [ ] HTTP entries have explicit `"type": "http"` -- an entry with `url` but no `type` is misread as stdio

---

## Sources & Verification

| Claim                                                           | Source                                                                                      | Confidence |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ---------- |
| Three user-facing MCP scopes (Local, Project, User)             | [MCP Documentation](https://code.claude.com/docs/en/mcp)                                    | High       |
| Scope precedence: Local > Project > User > Plugin > claude.ai   | [MCP Documentation](https://code.claude.com/docs/en/mcp)                                    | High       |
| `${VAR}` and `${VAR:-default}` expansion syntax                 | [MCP Documentation](https://code.claude.com/docs/en/mcp)                                    | High       |
| Expansion works in command, args, env, url, headers             | [MCP Documentation](https://code.claude.com/docs/en/mcp)                                    | High       |
| `.mcp.json` is the Project scope file                           | [MCP Documentation](https://code.claude.com/docs/en/mcp)                                    | High       |
| `~/.claude.json` stores Local and User scopes                   | [MCP Documentation](https://code.claude.com/docs/en/mcp)                                    | High       |
| OAuth browser-based authentication                              | [MCP Documentation](https://code.claude.com/docs/en/mcp)                                    | High       |
| `claude mcp login/logout` CLI commands                          | [MCP Documentation](https://code.claude.com/docs/en/mcp)                                    | High       |
| `headersHelper` for dynamic authentication                      | [MCP Documentation](https://code.claude.com/docs/en/mcp)                                    | High       |
| `CLAUDE_PLUGIN_ROOT` env var for headersHelper                  | [MCP Documentation](https://code.claude.com/docs/en/mcp)                                    | High       |
| Credential-like env vars removed from helper environment        | [MCP Documentation](https://code.claude.com/docs/en/mcp)                                    | High       |
| Trust dialog bypass via `hasTrustDialogAccepted`                | [MCP Documentation](https://code.claude.com/docs/en/mcp)                                    | High       |
| `oauth.scopes` for restricting OAuth scopes                     | [MCP Documentation](https://code.claude.com/docs/en/mcp)                                    | High       |
| `MCP_CLIENT_SECRET` env var for CI                              | [MCP Documentation](https://code.claude.com/docs/en/mcp)                                    | High       |
| Managed MCP with allowlist/denylist                             | [MCP Documentation](https://code.claude.com/docs/en/mcp)                                    | High       |
| claude.ai connectors integration                                | [MCP Documentation](https://code.claude.com/docs/en/mcp)                                    | High       |
| Organization controls on connectors (ask/blocked)               | [MCP Documentation](https://code.claude.com/docs/en/mcp)                                    | High       |
| `disableClaudeAiConnectors` setting                             | [MCP Documentation](https://code.claude.com/docs/en/mcp)                                    | High       |
| `deniedMcpServers` for blocking individual connectors           | [MCP Documentation](https://code.claude.com/docs/en/mcp)                                    | High       |
| `requiresUserInteraction` tool metadata                         | [MCP Documentation](https://code.claude.com/docs/en/mcp)                                    | High       |
| Per-tool size limits (`maxResultSizeChars`)                     | [MCP Documentation](https://code.claude.com/docs/en/mcp)                                    | High       |
| Server status indicators                                        | [MCP Documentation](https://code.claude.com/docs/en/mcp)                                    | High       |
| Configuration warnings (whitespace, name conflicts, reserved)   | [MCP Documentation](https://code.claude.com/docs/en/mcp)                                    | High       |
| Reserved names (5 total)                                        | [MCP Documentation](https://code.claude.com/docs/en/mcp)                                    | High       |
| `MCP_TIMEOUT` and `MCP_TOOL_TIMEOUT` env vars                  | [MCP Documentation](https://code.claude.com/docs/en/mcp)                                    | High       |
| Per-server `timeout` field                                      | [MCP Documentation](https://code.claude.com/docs/en/mcp)                                    | High       |
| Idle timeout and `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT`            | [MCP Documentation](https://code.claude.com/docs/en/mcp)                                    | High       |
| Auto-background for long MCP calls (v2.1.212+)                 | [MCP Documentation](https://code.claude.com/docs/en/mcp)                                    | High       |
| Capability discovery retry (v2.1.191)                           | [MCP Documentation](https://code.claude.com/docs/en/mcp)                                    | High       |
| `streamable-http` alias and `url` without `type` caveat        | [MCP Documentation](https://code.claude.com/docs/en/mcp)                                    | High       |
| CLI commands (add, add-json, list, remove, login, logout, etc.) | [MCP Documentation](https://code.claude.com/docs/en/mcp)                                    | High       |
| `.env` auto-reading by Claude Code                              | Observed behavior, consistent with docs                                                     | High       |
| `.env.example` onboarding pattern                               | Industry best practice, referenced in [best-practices.md](../claude-code/best-practices.md) | Medium     |
| `add-from-claude-desktop` import command                        | [MCP Documentation](https://code.claude.com/docs/en/mcp)                                    | High       |
| `CLAUDE_PROJECT_DIR` for stdio servers                          | [MCP Documentation](https://code.claude.com/docs/en/mcp)                                    | High       |
| WebSocket transport (`type: "ws"`)                              | [MCP Documentation](https://code.claude.com/docs/en/mcp)                                    | High       |
| Automatic reconnection with exponential backoff                 | [MCP Documentation](https://code.claude.com/docs/en/mcp)                                    | High       |
