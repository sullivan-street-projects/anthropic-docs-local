---
title: "Best Practices: MCP Server Credential Management & Access Control"
source_url: "https://code.claude.com/docs/en/mcp"
source_type: "manual"
fetched_at: "2026-04-05T00:00:00Z"
category: "claude-code"
---

# Best Practices: MCP Server Credential Management & Access Control

> **Documentation Status:** MCP server configuration is comprehensively documented at [code.claude.com/docs/en/mcp](https://code.claude.com/docs/en/mcp). All claims in this document have been verified against the official documentation as of April 2026.

---

## 1. The Core Problem

When you configure MCP servers for a project, credentials (API keys, tokens, database URLs) must flow to those servers. The challenge:

- **Committed code** (`.mcp.json`) needs to be shareable across a team
- **Secrets** must never be committed to version control
- **Each developer** may have different credentials for the same service

The solution is a **two-file architecture** that cleanly separates *what servers to use* from *how to authenticate*.

---

## 2. The Two-File Architecture

```
your-project/
├── .mcp.json          ← Committed to git (declares servers, references env vars)
├── .env               ← NEVER committed (holds actual secrets)
├── .env.example        ← Committed (documents required variables)
└── .gitignore          ← Must include .env
```

### File 1: `.mcp.json` (Committed — The Server Declaration)

This file declares *which* MCP servers the project uses. It references credentials via environment variable placeholders — never hardcoded values.

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

**Source:** [MCP Documentation](https://code.claude.com/docs/en/mcp) — *"Environment variable expansion is supported in server configurations using the syntax `${VARIABLE_NAME}` with an optional default value `${VARIABLE_NAME:-default_value}`."*

### File 2: `.env` (Never Committed — The Secrets)

```bash
# .env — Each developer creates their own
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
API_BASE_URL=https://api.staging.example.com
API_KEY=sk-xxxxxxxxxxxxxxxx
```

### File 3: `.env.example` (Committed — The Template)

```bash
# .env.example — Copy to .env and fill in your values
GITHUB_TOKEN=           # GitHub personal access token (repo scope)
DATABASE_URL=           # PostgreSQL connection string
API_BASE_URL=           # Optional: defaults to https://api.example.com
API_KEY=                # API key for the custom service
```

---

## 3. Understanding MCP Scopes

Claude Code supports four scopes for MCP server configuration, each stored in a different location with different visibility:

| Scope | Storage Location | Shared? | Added Via | Use Case |
|-------|-----------------|---------|-----------|----------|
| **Local** | `~/.claude.json` (under project path) | No — per-user | `claude mcp add <name>` (default) | Personal servers, per-project secrets |
| **Project** | `.mcp.json` (project root) | Yes — committed to git | `claude mcp add --scope project <name>` | Team-shared servers |
| **User** | `~/.claude.json` (global section) | No — per-user | `claude mcp add --scope user <name>` | Cross-project personal servers |
| **Managed** | System-wide `managed-mcp.json` | Org-wide | Enterprise admin | Organizational standards |

### Scope Precedence

When the same server name exists in multiple scopes:

```
Local > Project > User > Managed
```

A Local definition always overrides a Project definition of the same name.

**Source:** [MCP Documentation](https://code.claude.com/docs/en/mcp) — scope definitions and precedence rules.

---

## 4. Environment Variable Expansion

### Syntax

| Pattern | Behavior | Example |
|---------|----------|---------|
| `${VAR}` | Expands to value; empty string if unset | `${API_KEY}` |
| `${VAR:-default}` | Expands to value; uses default if unset | `${API_BASE_URL:-https://api.example.com}` |

### Where Expansion Works

Environment variables are expanded in these fields:

- `command` — the server executable
- `args` — command-line arguments
- `env` — environment variables passed to the server process
- `url` — HTTP/SSE endpoint URLs
- `headers` — HTTP request headers

**Source:** [MCP Documentation](https://code.claude.com/docs/en/mcp) — *"The expansion works in the `command`, `args`, `env`, `url`, and `headers` fields."*

### Three Ways to Provide Variable Values

1. **Shell environment** — Export before launching Claude Code:
   ```bash
   export GITHUB_TOKEN=ghp_xxx
   claude
   ```

2. **`.env` file** — Claude Code reads `.env` from the project root automatically

3. **Per-user MCP override** — Use Local scope to set server-specific env vars:
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
# Note: .mcp.json is intentionally NOT in .gitignore — it's meant to be shared
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

**Source:** [MCP Documentation](https://code.claude.com/docs/en/mcp) — `claude mcp add-json` command reference.

### 5.7 Verify Configuration Before Sharing

Before committing `.mcp.json` changes, verify that:

1. **No secrets are hardcoded** — grep for patterns like `sk-`, `ghp_`, `Bearer [a-zA-Z0-9]`
2. **All variables are documented** in `.env.example`
3. **Defaults make sense** — will a new developer get working defaults?
4. **Server names are descriptive** — `postgres-analytics` not `db1`

```bash
# Quick audit: find any hardcoded-looking secrets
grep -E '(sk-|ghp_|Bearer [a-zA-Z0-9]{10,}|password|secret)' .mcp.json
```

---

## 6. OAuth & Browser-Based Authentication

For MCP servers that support OAuth (no static API key needed), Claude Code provides browser-based authentication:

```bash
# OAuth flow — opens browser for consent
claude mcp add --transport http my-oauth-server https://server.example.com/mcp
```

When the server supports OAuth, Claude Code will:
1. Open a browser window for the OAuth consent flow
2. Store the resulting token locally (per-user, never committed)
3. Automatically refresh tokens as needed

For manual OAuth configuration:

```bash
claude mcp add --transport http \
  --header "Authorization: Bearer ${OAUTH_TOKEN}" \
  my-server https://server.example.com/mcp
```

For pre-configured OAuth credentials (servers that don't support dynamic client registration):

```bash
claude mcp add --transport http \
  --client-id your-client-id --client-secret --callback-port 8080 \
  my-server https://mcp.example.com/mcp
```

To override OAuth metadata discovery for servers with non-standard endpoints, set `authServerMetadataUrl` in the `oauth` object of your `.mcp.json`:

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

**Source:** [MCP Documentation](https://code.claude.com/docs/en/mcp) — OAuth and browser-based authentication section.

---

## 7. Enterprise & Managed MCP

For organizations using managed MCP deployment:

### Managed Scope

Administrators can deploy MCP servers organization-wide through `managed-mcp.json`, which:

- Provides a base set of servers to all users
- Cannot be removed by individual users (lowest-priority but always present)
- Can include allowlists/denylists to control which MCP tools are available

### Allowlist/Denylist Controls

Enterprise admins can restrict MCP tool usage:

```json
{
  "mcpServers": {
    "approved-server": { "...": "..." }
  },
  "allowedMcpTools": ["approved-server:safe-tool"],
  "deniedMcpTools": ["any-server:dangerous-tool"]
}
```

**Source:** [MCP Documentation](https://code.claude.com/docs/en/mcp) — Managed MCP and enterprise controls.

---

## 8. The Complete Developer Onboarding Flow

Here's the recommended onboarding experience for a new developer joining a project with MCP servers:

```
Step 1: Clone the repository
         └── Gets .mcp.json and .env.example automatically

Step 2: Copy .env.example to .env
         $ cp .env.example .env

Step 3: Fill in personal credentials in .env
         $ vim .env  (add your tokens, keys, URLs)

Step 4: Start Claude Code
         $ claude
         ✓ MCP servers start with your credentials
         ✓ Team-shared server configurations from .mcp.json
         ✓ Your secrets stay local in .env

Step 5: (Optional) Add personal servers
         $ claude mcp add my-notes -- npx my-notes-server
         └── Saved to ~/.claude.json (local scope, not shared)
```

---

## 9. MCP Management Commands

Quick reference for managing MCP servers via the CLI:

```bash
# List all configured servers (all scopes)
claude mcp list

# Add a stdio server (local scope by default)
claude mcp add <name> -- <command> [args...]

# Add an HTTP server
claude mcp add --transport http <name> <url>

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

# Reset project tool approval choices
claude mcp reset-project-choices
```

**Source:** [MCP Documentation](https://code.claude.com/docs/en/mcp) — CLI commands section.

---

## 10. Common Pitfalls

| Pitfall | Problem | Fix |
|---------|---------|-----|
| Hardcoded secrets in `.mcp.json` | Secrets committed to git | Use `${VAR}` expansion |
| Missing `.env` from `.gitignore` | Secrets accidentally committed | Add `.env` to `.gitignore` immediately |
| No `.env.example` | New developers don't know what vars are needed | Create `.env.example` with all required vars |
| Using Local scope for team servers | Only works on your machine | Use `--scope project` for `.mcp.json` |
| Using Project scope for personal servers | Leaks your server setup to the team | Use Local scope (default) or `--scope user` |
| Same server name in multiple scopes | Confusion about which config is active | Remember: Local > Project > User > Managed |
| Forgetting `--scope project` | Server added to Local instead of `.mcp.json` | Re-add with `--scope project` |
| Not testing with a fresh `.env` | Config works for you but breaks for others | Test by removing `.env` and using `.env.example` |

---

## 11. Security Checklist

Before committing any MCP configuration:

- [ ] No hardcoded API keys, tokens, or passwords in `.mcp.json`
- [ ] `.env` is listed in `.gitignore`
- [ ] `.env.example` exists and documents all required variables
- [ ] Default values (`${VAR:-default}`) are non-secret and sensible
- [ ] Server names are descriptive and consistent
- [ ] OAuth servers don't include static tokens in committed config
- [ ] Team members have been informed of required credentials
- [ ] `grep -rn 'sk-\|ghp_\|Bearer [a-z]' .mcp.json` returns no results

---

## 10. MCP Elicitation for Interactive Auth

As of Claude Code 2.1.76, MCP servers can request structured input mid-task via **elicitation**. This is useful for interactive authentication flows where the server needs credentials it can't get from environment variables.

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

## Sources & Verification

| Claim | Source | Confidence |
|-------|--------|------------|
| Four MCP scopes (Local, Project, User, Managed) | [MCP Documentation](https://code.claude.com/docs/en/mcp) | High |
| Scope precedence: Local > Project > User > Managed | [MCP Documentation](https://code.claude.com/docs/en/mcp) | High |
| `${VAR}` and `${VAR:-default}` expansion syntax | [MCP Documentation](https://code.claude.com/docs/en/mcp) | High |
| Expansion works in command, args, env, url, headers | [MCP Documentation](https://code.claude.com/docs/en/mcp) | High |
| `.mcp.json` is the Project scope file | [MCP Documentation](https://code.claude.com/docs/en/mcp) | High |
| `~/.claude.json` stores Local and User scopes | [MCP Documentation](https://code.claude.com/docs/en/mcp) | High |
| OAuth browser-based authentication | [MCP Documentation](https://code.claude.com/docs/en/mcp) | High |
| Managed MCP with allowlist/denylist | [MCP Documentation](https://code.claude.com/docs/en/mcp) | High |
| CLI commands (add, add-json, list, remove, etc.) | [MCP Documentation](https://code.claude.com/docs/en/mcp) | High |
| `.env` auto-reading by Claude Code | Observed behavior, consistent with docs | High |
| `.env.example` onboarding pattern | Industry best practice, referenced in [best-practices.md](../claude-code/best-practices.md) | Medium |
| `add-from-claude-desktop` import command | [MCP Documentation](https://code.claude.com/docs/en/mcp) | High |
