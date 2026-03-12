---
title: "Claude Code Hooks"
source_url: "https://code.claude.com/docs/en/hooks"
source_type: "manual"
fetched_at: "2026-03-11T00:00:00Z"
category: "claude-code"
---

# Claude Code Hooks

Hooks are user-defined shell commands, HTTP endpoints, or LLM prompts that execute automatically at specific points in Claude Code's lifecycle. Use this reference to look up event schemas, configuration options, JSON input/output formats, and advanced features like async hooks, HTTP hooks, and MCP tool hooks.

> **Last updated:** March 11, 2026

## Hook Lifecycle

Hooks fire at specific points during a Claude Code session. When an event fires and a matcher matches, Claude Code passes JSON context about the event to your hook handler. For command hooks, input arrives on stdin. For HTTP hooks, it arrives as the POST request body. Your handler can then inspect the input, take action, and optionally return a decision. Some events fire once per session, while others fire repeatedly inside the agentic loop.

## Hook Events (18 Total)

| Event | Description | Matcher | Fires |
|-------|-------------|---------|-------|
| `SessionStart` | Session begins or resumes | `startup`, `resume`, `clear`, `compact` | Once per session |
| `InstructionsLoaded` | CLAUDE.md or `.claude/rules/*.md` file loaded into context | No matcher support | Session start + lazy loads |
| `UserPromptSubmit` | Before Claude processes user input | No matcher support | Each user message |
| `PreToolUse` | Before tool executes (can block) | Tool name | Each tool call |
| `PermissionRequest` | Permission dialog appears | Tool name | Each permission prompt |
| `PostToolUse` | After tool succeeds | Tool name | Each tool call |
| `PostToolUseFailure` | After tool fails | Tool name | Each failed tool call |
| `Notification` | Notification events fire | `permission_prompt`, `idle_prompt`, `auth_success`, `elicitation_dialog` | Various |
| `SubagentStart` | Subagent spawned | Agent type | Each subagent spawn |
| `SubagentStop` | Subagent finishes | Agent type | Each subagent finish |
| `Stop` | Main Claude finishes responding | No matcher support | Each response |
| `TeammateIdle` | Agent team teammate about to go idle | No matcher support (exit code 2 only) | Agent teams |
| `TaskCompleted` | Task marked as completed | No matcher support (exit code 2 only) | Task completion |
| `ConfigChange` | Configuration file changes during session | `user_settings`, `project_settings`, `local_settings`, `policy_settings`, `skills` | Config changes |
| `WorktreeCreate` | Worktree being created via `--worktree` or `isolation: "worktree"` | No matcher support | Worktree creation |
| `WorktreeRemove` | Worktree being removed at session exit or subagent finish | No matcher support | Worktree removal |
| `PreCompact` | Before context compaction | `manual`, `auto` | Each compaction |
| `SessionEnd` | Session terminates | `clear`, `logout`, `prompt_input_exit`, `bypass_permissions_disabled`, `other` | Once per session |

## Hook Types

### Command Hooks (`type: "command"`)

Execute shell scripts. Receive JSON input on stdin, communicate via exit codes and stdout/stderr.

```json
{
  "type": "command",
  "command": "./scripts/validate.sh",
  "timeout": 30
}
```

### HTTP Hooks (`type: "http"`)

Send JSON input as POST request body to an HTTP endpoint. The response body is parsed as JSON output.

```json
{
  "type": "http",
  "url": "https://hooks.example.com/pre-tool-use",
  "timeout": 10,
  "headers": {
    "Authorization": "Bearer $MY_TOKEN"
  },
  "allowedEnvVars": ["MY_TOKEN"]
}
```

HTTP hook error handling differs from command hooks: non-2xx responses, connection failures, and timeouts all produce non-blocking errors. To block a tool call, return a 2xx response with a JSON body containing the appropriate decision fields.

### Prompt-Based Hooks (`type: "prompt"`)

Single LLM turn for decision-making. Respond with `{"ok": true}` or `{"ok": false, "reason": "..."}`.

```json
{
  "type": "prompt",
  "prompt": "Check if this edit follows our coding standards",
  "model": "claude-haiku-4-5",
  "timeout": 30
}
```

### Agent-Based Hooks (`type: "agent"`)

Spawn a subagent for multi-turn verification. Can use tools: Read, Grep, Glob, Bash. Up to 50 tool turns.

```json
{
  "type": "agent",
  "prompt": "Verify the test suite still passes after this change",
  "timeout": 60
}
```

## Configuration

Hooks are defined in JSON settings files. The configuration has three levels of nesting:

1. **Event level**: Which lifecycle event triggers the hook
2. **Matcher level**: Which specific events to match (regex pattern)
3. **Handler level**: What to execute when the hook fires

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "./scripts/lint-check.sh",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

## Configuration Locations

| Location | Scope | Shareable |
|----------|-------|-----------|
| `~/.claude/settings.json` | All your projects | No, local to your machine |
| `.claude/settings.json` | Single project | Yes, can be committed to repo |
| `.claude/settings.local.json` | Single project | No, gitignored |
| Managed policy settings | Organization-wide | Yes, admin-controlled |
| Plugin `hooks/hooks.json` | When plugin is enabled | Yes, bundled with plugin |
| Skill or agent frontmatter | While component is active | Yes, defined in component file |

For enterprise administrators, `allowManagedHooksOnly` blocks user, project, and plugin hooks.

## Hooks in Skills and Agents

Hooks can be defined directly in skills and subagents using frontmatter. These hooks are scoped to the component's lifecycle and only run when that component is active.

All hook events are supported. For subagents, `Stop` hooks are automatically converted to `SubagentStop`.

```yaml
---
name: secure-operations
description: Perform operations with security checks
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/security-check.sh"
---
```

## Hook Handler Fields

### Common Fields

| Field | Required | Description |
|-------|----------|-------------|
| `type` | Yes | `"command"`, `"http"`, `"prompt"`, or `"agent"` |
| `timeout` | No | Seconds before canceling. Defaults: 600 command, 30 prompt, 60 agent |
| `statusMessage` | No | Custom spinner message displayed while hook runs |
| `once` | No | If `true`, runs only once per session (skills only) |

### Command Hook Fields

| Field | Required | Description |
|-------|----------|-------------|
| `command` | Yes | Shell command to execute |
| `async` | No | If `true`, runs in background without blocking |

### HTTP Hook Fields

| Field | Required | Description |
|-------|----------|-------------|
| `url` | Yes | URL to send the POST request to |
| `headers` | No | Additional HTTP headers as key-value pairs. Values support env var interpolation |
| `allowedEnvVars` | No | List of env var names that may be interpolated into header values. Required for any env var interpolation to work |

### Prompt and Agent Hook Fields

| Field | Required | Description |
|-------|----------|-------------|
| `prompt` | Yes | Prompt text. Use `$ARGUMENTS` as placeholder for hook input JSON |
| `model` | No | Model to use for evaluation. Defaults to a fast model |

## Matcher Patterns

| Event | What Matcher Filters | Example Matcher Values |
|-------|---------------------|----------------------|
| `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `PermissionRequest` | Tool name | `Bash`, `Edit\|Write`, `mcp__.*` |
| `SessionStart` | How session started | `startup`, `resume`, `clear`, `compact` |
| `SessionEnd` | Why session ended | `clear`, `logout`, `prompt_input_exit`, `bypass_permissions_disabled`, `other` |
| `Notification` | Notification type | `permission_prompt`, `idle_prompt`, `auth_success`, `elicitation_dialog` |
| `SubagentStart`, `SubagentStop` | Agent type | `Bash`, `Explore`, `Plan`, or custom agent names |
| `PreCompact` | What triggered compaction | `manual`, `auto` |
| `ConfigChange` | Configuration source | `user_settings`, `project_settings`, `local_settings`, `policy_settings`, `skills` |
| `UserPromptSubmit`, `Stop`, `TeammateIdle`, `TaskCompleted`, `WorktreeCreate`, `WorktreeRemove`, `InstructionsLoaded` | No matcher support | Always fires on every occurrence |

### Match MCP Tools

MCP server tools appear as regular tools in tool events. MCP tools follow the naming pattern `mcp__<server>__<tool>`:

- `mcp__memory__create_entities`: Memory server's create entities tool
- `mcp__filesystem__read_file`: Filesystem server's read file tool
- `mcp__github__search_repositories`: GitHub server's search tool

Use regex patterns to target specific MCP tools or groups:
- `mcp__memory__.*` matches all tools from the `memory` server
- `mcp__.*__write.*` matches any tool containing "write" from any server

## Exit Codes

| Code | Behavior |
|------|----------|
| `0` | Action proceeds (or allows with JSON output) |
| `2` | Action blocked (cannot be combined with JSON) |
| Other | Non-blocking error logged in verbose mode |

### Exit Code 2 Behavior Per Event

| Hook Event | Can Block? | What Happens on Exit 2 |
|------------|-----------|----------------------|
| `PreToolUse` | Yes | Blocks the tool call |
| `PermissionRequest` | Yes | Denies the permission |
| `UserPromptSubmit` | Yes | Blocks prompt processing and erases the prompt |
| `Stop` | Yes | Prevents Claude from stopping, continues conversation |
| `SubagentStop` | Yes | Prevents the subagent from stopping |
| `TeammateIdle` | Yes | Prevents teammate from going idle |
| `TaskCompleted` | Yes | Prevents task from being marked completed |
| `ConfigChange` | Yes | Blocks config change from taking effect (except `policy_settings`) |
| `WorktreeCreate` | Yes | Any non-zero exit code causes worktree creation to fail |
| `PostToolUse` | No | Shows stderr to Claude (tool already ran) |
| `PostToolUseFailure` | No | Shows stderr to Claude (tool already failed) |
| `Notification` | No | Shows stderr to user only |
| `SubagentStart` | No | Shows stderr to user only |
| `SessionStart` | No | Shows stderr to user only |
| `SessionEnd` | No | Shows stderr to user only |
| `PreCompact` | No | Shows stderr to user only |
| `WorktreeRemove` | No | Failures logged in debug mode only |
| `InstructionsLoaded` | No | Exit code is ignored |

## JSON Output Patterns

### Decision Control by Event

| Events | Decision Pattern | Key Fields |
|--------|-----------------|------------|
| UserPromptSubmit, PostToolUse, PostToolUseFailure, Stop, SubagentStop, ConfigChange | Top-level `decision` | `decision: "block"`, `reason` |
| TeammateIdle, TaskCompleted | Exit code or `continue: false` | Exit code 2 blocks; JSON `continue: false` also stops |
| PreToolUse | `hookSpecificOutput` | `permissionDecision` (allow/deny/ask), `permissionDecisionReason` |
| PermissionRequest | `hookSpecificOutput` | `decision.behavior` (allow/deny) |
| WorktreeCreate | stdout path | Print absolute path to created worktree |
| WorktreeRemove, Notification, SessionEnd, PreCompact, InstructionsLoaded | None | No decision control (side effects only) |

### PreToolUse Output

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow|deny|ask",
    "permissionDecisionReason": "reason text",
    "updatedInput": { "field": "new_value" },
    "additionalContext": "context for Claude"
  }
}
```

PreToolUse hooks can:
- **Allow** tool calls (bypass permission prompts)
- **Deny** tool calls (block execution)
- **Ask** (defer to normal permission flow)
- **Modify input** (change tool arguments before execution)
- **Add context** (inject additional information for Claude)

### Stop/PostToolUse Output

```json
{
  "decision": "block",
  "reason": "explanation"
}
```

### Universal Fields

| Field | Default | Description |
|-------|---------|-------------|
| `continue` | `true` | If `false`, Claude stops processing entirely |
| `stopReason` | none | Message shown to user when `continue` is `false` |
| `suppressOutput` | `false` | If `true`, hides stdout from verbose output |
| `systemMessage` | none | Warning message shown to user |

## Common Input Fields

All hook events receive these fields as JSON:

| Field | Description |
|-------|-------------|
| `session_id` | Current session identifier |
| `transcript_path` | Path to conversation JSON |
| `cwd` | Current working directory when hook is invoked |
| `permission_mode` | Current permission mode: `default`, `plan`, `acceptEdits`, `dontAsk`, `bypassPermissions` |
| `hook_event_name` | Name of the event that fired |

When running with `--agent` or inside a subagent, two additional fields:

| Field | Description |
|-------|-------------|
| `agent_id` | Unique identifier for the subagent (present only inside subagent calls) |
| `agent_type` | Agent name (e.g., `"Explore"` or `"security-reviewer"`) |

## Async Hooks

Set `"async": true` on command hooks for background execution:
- Claude continues while hook executes
- Results delivered on next turn
- Timeout applies to background process
- Cannot block or control behavior

## The `/hooks` Menu

Type `/hooks` in Claude Code to open the interactive hooks manager. Each hook is labeled with a bracket prefix indicating its source:

- `[User]`: from `~/.claude/settings.json`
- `[Project]`: from `.claude/settings.json`
- `[Local]`: from `.claude/settings.local.json`
- `[Plugin]`: from a plugin's `hooks/hooks.json`, read-only

## Disable or Remove Hooks

Set `"disableAllHooks": true` in settings or use the toggle in `/hooks` menu. The `disableAllHooks` setting respects the managed settings hierarchy -- if an administrator has configured hooks through managed policy settings, `disableAllHooks` in user/project/local settings cannot disable those managed hooks.

Direct edits to hooks in settings files do not take effect immediately. Claude Code captures a snapshot at startup. If hooks are modified externally, Claude Code warns you and requires review in the `/hooks` menu before changes apply.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `$CLAUDE_PROJECT_DIR` | Project root directory |
| `${CLAUDE_PLUGIN_ROOT}` | Plugin root directory |
| `CLAUDE_ENV_FILE` | File path for SessionStart hooks to persist env vars |
| `$CLAUDE_CODE_REMOTE` | Set to "true" in web environments |

## How Hooks Layer

Hooks merge across all sources: all registered hooks fire for their matching events regardless of source (user settings, project settings, plugins, managed settings). This differs from skills and MCP servers which override by name.

## Common Hook Patterns

### Desktop Notifications
```json
{
  "hooks": {
    "Notification": [
      { "matcher": "permission_prompt", "hooks": [
        { "type": "command", "command": "osascript -e 'display notification \"Claude needs input\"'" }
      ]}
    ]
  }
}
```

### Auto-Format After Edits
```json
{
  "hooks": {
    "PostToolUse": [
      { "matcher": "Edit|Write", "hooks": [
        { "type": "command", "command": "npx prettier --write \"$TOOL_INPUT_FILE_PATH\"" }
      ]}
    ]
  }
}
```

### Protected Files
```json
{
  "hooks": {
    "PreToolUse": [
      { "matcher": "Edit|Write", "hooks": [
        { "type": "command", "command": "echo $TOOL_INPUT | jq -r '.file_path' | grep -qE '\\.(env|lock)$' && exit 2 || exit 0" }
      ]}
    ]
  }
}
```

### Block Destructive Commands
```json
{
  "hooks": {
    "PreToolUse": [
      { "matcher": "Bash", "hooks": [
        { "type": "command", "command": "jq -r '.tool_input.command' | grep -qE 'rm -rf' && exit 2 || exit 0" }
      ]}
    ]
  }
}
```

### Context Re-injection After Compaction
```json
{
  "hooks": {
    "SessionStart": [
      { "matcher": "compact", "hooks": [
        { "type": "command", "command": "cat .claude/context-reminder.txt" }
      ]}
    ]
  }
}
```

### Quality Gates (Task Completion)
```json
{
  "hooks": {
    "TaskCompleted": [
      { "matcher": "", "hooks": [
        { "type": "agent", "prompt": "Verify all tests pass before marking complete", "timeout": 120 }
      ]}
    ]
  }
}
```

### HTTP Hook with Auth
```json
{
  "hooks": {
    "PreToolUse": [
      { "matcher": "Bash", "hooks": [
        {
          "type": "http",
          "url": "http://localhost:8080/hooks/pre-tool-use",
          "timeout": 30,
          "headers": { "Authorization": "Bearer $MY_TOKEN" },
          "allowedEnvVars": ["MY_TOKEN"]
        }
      ]}
    ]
  }
}
```

### MCP Tool Validation
```json
{
  "hooks": {
    "PreToolUse": [
      { "matcher": "mcp__memory__.*", "hooks": [
        { "type": "command", "command": "echo 'Memory operation initiated' >> ~/mcp-operations.log" }
      ]},
      { "matcher": "mcp__.*__write.*", "hooks": [
        { "type": "command", "command": "/home/user/scripts/validate-mcp-write.py" }
      ]}
    ]
  }
}
```

## Sources

- [Hooks Reference](https://code.claude.com/docs/en/hooks)
- [Hooks Guide](https://code.claude.com/docs/en/hooks-guide)
