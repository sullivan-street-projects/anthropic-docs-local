---
title: "Claude Code Hooks"
source_url: "https://code.claude.com/docs/en/hooks"
source_type: "manual"
fetched_at: "2026-07-13T00:00:00Z"
category: "claude-code"
---

# Claude Code Hooks

Hooks are user-defined shell commands, HTTP endpoints, MCP tool calls, LLM prompts, or agents that execute automatically at specific points in Claude Code's lifecycle. Use this reference to look up event schemas, configuration options, JSON input/output formats, and advanced features like async hooks, HTTP hooks, and MCP tool hooks.

> **Last updated:** July 13, 2026

## Hook Lifecycle

Hooks fire at specific points during a Claude Code session. When an event fires and a matcher matches, Claude Code passes JSON context about the event to your hook handler. For command hooks, input arrives on stdin. For HTTP hooks, it arrives as the POST request body. Your handler can then inspect the input, take action, and optionally return a decision. Some events fire once per session, while others fire repeatedly inside the agentic loop.

## Hook Events (30+ Total)

| Event                 | Description                                                        | Matcher                                                                                                                                                                                         | Fires                      |
| --------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| `SessionStart`        | Session begins or resumes                                          | `startup`, `resume`, `clear`, `compact`                                                                                                                                                         | Once per session           |
| `Setup`               | `claude --init-only` or `claude -p --init`/`--maintenance`         | `init`, `maintenance`                                                                                                                                                                           | Once                       |
| `InstructionsLoaded`  | CLAUDE.md or `.claude/rules/*.md` loaded into context              | `session_start`, `nested_traversal`, `path_glob_match`, `include`, `compact`                                                                                                                    | Session start + lazy loads |
| `UserPromptSubmit`    | Before Claude processes user input                                 | No matcher support                                                                                                                                                                              | Each user message          |
| `UserPromptExpansion` | User-typed command expands into prompt (e.g., `/skill`)            | Command names                                                                                                                                                                                   | Each expansion             |
| `PreToolUse`          | Before tool executes (can block)                                   | Tool name                                                                                                                                                                                       | Each tool call             |
| `PermissionRequest`   | Permission dialog appears                                          | Tool name                                                                                                                                                                                       | Each permission prompt     |
| `PermissionDenied`    | Auto mode classifier denies tool                                   | Tool name                                                                                                                                                                                       | Auto mode denials          |
| `PostToolUse`         | After tool succeeds                                                | Tool name                                                                                                                                                                                       | Each tool call             |
| `PostToolUseFailure`  | After tool fails                                                   | Tool name                                                                                                                                                                                       | Each failed tool call      |
| `PostToolBatch`       | Full batch of parallel tool calls resolves                         | No matcher support                                                                                                                                                                              | Before next model call     |
| `Notification`        | Notification events fire                                           | `permission_prompt`, `idle_prompt`, `auth_success`, `elicitation_dialog`, `elicitation_complete`, `elicitation_response`                                                                        | Various                    |
| `MessageDisplay`      | Assistant message text is displayed                                | No matcher support                                                                                                                                                                              | Each display               |
| `SubagentStart`       | Subagent spawned                                                   | Agent type                                                                                                                                                                                      | Each subagent spawn        |
| `SubagentStop`        | Subagent finishes                                                  | Agent type                                                                                                                                                                                      | Each subagent finish       |
| `Stop`                | Main Claude finishes responding                                    | No matcher support                                                                                                                                                                              | Each response              |
| `StopFailure`         | Turn ends due to API error                                         | Error type: `rate_limit`, `overloaded`, `authentication_failed`, `oauth_org_not_allowed`, `billing_error`, `invalid_request`, `model_not_found`, `server_error`, `max_output_tokens`, `unknown` | API errors                 |
| `TeammateIdle`        | Agent team teammate about to go idle                               | Teammate role                                                                                                                                                                                   | Agent teams                |
| `TaskCreated`         | Task created via TaskCreate tool                                   | No matcher support                                                                                                                                                                              | Task creation              |
| `TaskCompleted`       | Task marked as completed                                           | No matcher support                                                                                                                                                                              | Task completion            |
| `CwdChanged`          | Working directory changes                                          | No matcher support                                                                                                                                                                              | Directory changes          |
| `FileChanged`         | Watched file changes on disk                                       | Literal filenames (basename)                                                                                                                                                                    | File modifications         |
| `ConfigChange`        | Configuration file changes during session                          | `user_settings`, `project_settings`, `local_settings`, `policy_settings`, `skills`                                                                                                              | Config changes             |
| `WorktreeCreate`      | Worktree being created via `--worktree` or `isolation: "worktree"` | No matcher support                                                                                                                                                                              | Worktree creation          |
| `WorktreeRemove`      | Worktree being removed at session exit or subagent finish          | No matcher support                                                                                                                                                                              | Worktree removal           |
| `PreCompact`          | Before context compaction                                          | `manual`, `auto`                                                                                                                                                                                | Each compaction            |
| `PostCompact`         | After context compaction                                           | `manual`, `auto`                                                                                                                                                                                | Each compaction            |
| `Elicitation`         | MCP server requests user input                                     | MCP server name                                                                                                                                                                                 | MCP elicitation requests   |
| `ElicitationResult`   | User responds to MCP elicitation                                   | MCP server name                                                                                                                                                                                 | MCP elicitation responses  |
| `SessionEnd`          | Session terminates                                                 | `clear`, `resume`, `logout`, `prompt_input_exit`, `bypass_permissions_disabled`, `other`                                                                                                        | Once per session           |

## Hook Types

### Command Hooks (`type: "command"`)

Execute shell scripts. Receive JSON input on stdin, communicate via exit codes and stdout/stderr.

```json
{
  "type": "command",
  "command": "./scripts/validate.sh",
  "timeout": 30,
  "shell": "bash"
}
```

**Exec form vs Shell form:**

- **Exec form** (when `args` present): Direct executable spawn, no shell interpretation
- **Shell form** (when `args` absent): Shell tokenization, pipes, `&&`, globs allowed

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

### MCP Tool Hooks (`type: "mcp_tool"`)

Call a tool on a connected MCP server. The hook input is available via `${path}` substitution in the `input` field.

```json
{
  "type": "mcp_tool",
  "server": "my-server",
  "tool": "validate",
  "input": { "file": "${tool_input.file_path}" },
  "timeout": 600
}
```

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

| Location                      | Scope                     | Shareable                      |
| ----------------------------- | ------------------------- | ------------------------------ |
| `~/.claude/settings.json`     | All your projects         | No, local to your machine      |
| `.claude/settings.json`       | Single project            | Yes, can be committed to repo  |
| `.claude/settings.local.json` | Single project            | No, gitignored                 |
| Managed policy settings       | Organization-wide         | Yes, admin-controlled          |
| Plugin `hooks/hooks.json`     | When plugin is enabled    | Yes, bundled with plugin       |
| Skill or agent frontmatter    | While component is active | Yes, defined in component file |

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

| Field           | Required | Description                                                                        |
| --------------- | -------- | ---------------------------------------------------------------------------------- |
| `type`          | Yes      | `"command"`, `"http"`, `"mcp_tool"`, `"prompt"`, or `"agent"`                      |
| `if`            | No       | Permission rule syntax to filter (tool events only, e.g., `"Bash(git *)"`)         |
| `timeout`       | No       | Seconds before canceling. Defaults: 600 command/http/mcp_tool, 30 prompt, 60 agent |
| `statusMessage` | No       | Custom spinner message displayed while hook runs                                   |
| `once`          | No       | If `true`, runs only once per session (skills only)                                |

### Command Hook Fields

| Field         | Required | Description                                                 |
| ------------- | -------- | ----------------------------------------------------------- |
| `command`     | Yes      | Shell command to execute                                    |
| `args`        | No       | Argument list for exec form (no shell interpretation)       |
| `shell`       | No       | Shell to use for execution (e.g., `"bash"`, `"powershell"`) |
| `async`       | No       | If `true`, runs in background without blocking              |
| `asyncRewake` | No       | If `true`, runs in background and wakes Claude on exit 2    |

### HTTP Hook Fields

| Field            | Required | Description                                                                      |
| ---------------- | -------- | -------------------------------------------------------------------------------- |
| `url`            | Yes      | URL to send the POST request to                                                  |
| `headers`        | No       | Additional HTTP headers as key-value pairs. Values support env var interpolation |
| `allowedEnvVars` | No       | List of env var names that may be interpolated into header values                |

### MCP Tool Hook Fields

| Field    | Required | Description                                                |
| -------- | -------- | ---------------------------------------------------------- |
| `server` | Yes      | Configured MCP server name                                 |
| `tool`   | Yes      | Tool name on that server                                   |
| `input`  | No       | Tool arguments with `${path}` substitution from hook input |

### Prompt and Agent Hook Fields

| Field    | Required | Description                                                      |
| -------- | -------- | ---------------------------------------------------------------- |
| `prompt` | Yes      | Prompt text. Use `$ARGUMENTS` as placeholder for hook input JSON |
| `model`  | No       | Model to use for evaluation. Defaults to a fast model            |

## Matcher Patterns

Matcher evaluation types:

- `"*"`, `""`, or omitted = match all
- Letters/digits/_/spaces/commas/pipes = exact string match
- Other characters = JavaScript regex

| Event                                                                                                                                                           | What Matcher Filters         | Example Matcher Values                                                                                                                                                              |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `PermissionRequest`, `PermissionDenied`                                                                      | Tool name                    | `Bash`, `Edit\|Write`, `mcp__.*`                                                                                                                                                    |
| `SessionStart`                                                                                                                                                  | How session started          | `startup`, `resume`, `clear`, `compact`                                                                                                                                             |
| `Setup`                                                                                                                                                         | CLI flag                     | `init`, `maintenance`                                                                                                                                                               |
| `SessionEnd`                                                                                                                                                    | Why session ended            | `clear`, `resume`, `logout`, `prompt_input_exit`, `bypass_permissions_disabled`, `other`                                                                                            |
| `FileChanged`                                                                                                                                                   | Literal filenames (basename) | `.envrc`, `.env`                                                                                                                                                                    |
| `Notification`                                                                                                                                                  | Notification type            | `permission_prompt`, `idle_prompt`, `auth_success`, `elicitation_dialog`, `elicitation_complete`, `elicitation_response`, `agent_needs_input`, `agent_completed`                    |
| `SubagentStart`, `SubagentStop`                                                                                                                                 | Agent type                   | `Bash`, `Explore`, `Plan`, or custom agent names                                                                                                                                    |
| `PreCompact`, `PostCompact`                                                                                                                                     | What triggered compaction    | `manual`, `auto`                                                                                                                                                                    |
| `ConfigChange`                                                                                                                                                  | Configuration source         | `user_settings`, `project_settings`, `local_settings`, `policy_settings`, `skills`                                                                                                  |
| `Elicitation`, `ElicitationResult`                                                                                                                              | MCP server name              | Server-specific elicitation events                                                                                                                                                  |
| `StopFailure`                                                                                                                                                   | Error type                   | `rate_limit`, `authentication_failed`, `billing_error`, `overloaded`, `oauth_org_not_allowed`, `invalid_request`, `model_not_found`, `server_error`, `max_output_tokens`, `unknown` |
| `InstructionsLoaded`                                                                                                                                            | Load reason                  | `session_start`, `nested_traversal`, `path_glob_match`, `include`, `compact`                                                                                                        |
| `UserPromptExpansion`                                                                                                                                           | Command name                 | Expanded command names                                                                                                                                                              |
| `UserPromptSubmit`, `Stop`, `TeammateIdle`, `TaskCreated`, `TaskCompleted`, `WorktreeCreate`, `WorktreeRemove`, `PostToolBatch`, `MessageDisplay`, `CwdChanged` | No matcher support           | Always fires on every occurrence                                                                                                                                                    |

### Match MCP Tools

MCP server tools appear as regular tools in tool events. MCP tools follow the naming pattern `mcp__<server>__<tool>`:

- `mcp__memory__create_entities`: Memory server's create entities tool
- `mcp__filesystem__read_file`: Filesystem server's read file tool
- `mcp__github__search_repositories`: GitHub server's search tool

Use regex patterns to target specific MCP tools or groups:

- `mcp__memory__.*` matches all tools from the `memory` server
- `mcp__.*__write.*` matches any tool containing "write" from any server

### Bash `if` Condition Matching

The `if` field uses permission rule syntax for fine-grained filtering:

| Pattern       | Command                | Matches? | Why                       |
| ------------- | ---------------------- | -------- | ------------------------- |
| `Bash(git *)` | `FOO=bar git push`     | Yes      | Assignments stripped      |
| `Bash(git *)` | `npm test && git push` | Yes      | Each subcommand checked   |
| `Bash(rm *)`  | `echo $(rm -rf /)`     | Yes      | Commands in `$()` checked |
| `Bash(rm *)`  | `echo $(date)`         | No       | No subcommand matches     |

Leading `VAR=value` assignments are stripped. Filter fails open on parse errors.

## Exit Codes

| Code  | Behavior                                      |
| ----- | --------------------------------------------- |
| `0`   | Action proceeds (or allows with JSON output)  |
| `2`   | Action blocked (cannot be combined with JSON) |
| Other | Non-blocking error logged in verbose mode     |

### Exit Code 2 Behavior Per Event

**Can block (exit 2 stops action):**

| Hook Event            | What Happens on Exit 2                                             |
| --------------------- | ------------------------------------------------------------------ |
| `PreToolUse`          | Blocks the tool call                                               |
| `PermissionRequest`   | Denies the permission                                              |
| `UserPromptSubmit`    | Blocks prompt processing and erases the prompt                     |
| `UserPromptExpansion` | Prevents command expansion                                         |
| `Stop`                | Prevents Claude from stopping, continues conversation              |
| `SubagentStop`        | Prevents the subagent from stopping                                |
| `TeammateIdle`        | Prevents teammate from going idle                                  |
| `TaskCreated`         | Rolls back task creation                                           |
| `TaskCompleted`       | Prevents task from being marked completed                          |
| `ConfigChange`        | Blocks config change from taking effect (except `policy_settings`) |
| `PreCompact`          | Prevents compaction                                                |
| `Elicitation`         | Denies elicitation                                                 |
| `ElicitationResult`   | Blocks response (becomes decline)                                  |
| `PostToolBatch`       | Stops the agentic loop                                             |

**Cannot block (exit 2 shows stderr only):**

| Hook Event           | What Happens                                            |
| -------------------- | ------------------------------------------------------- |
| `PostToolUse`        | Shows stderr to Claude (tool already ran)               |
| `PostToolUseFailure` | Shows stderr to Claude (tool already failed)            |
| `PermissionDenied`   | Ignored; use JSON `retry: true` instead                 |
| `StopFailure`        | Shows stderr to user only                               |
| `Notification`       | Shows stderr to user only                               |
| `SubagentStart`      | Shows stderr to user only                               |
| `SessionStart`       | Shows stderr to user only                               |
| `Setup`              | Shows stderr to user only                               |
| `SessionEnd`         | Shows stderr to user only                               |
| `PreCompact`         | Shows stderr to user only                               |
| `PostCompact`        | Shows stderr to user only                               |
| `WorktreeCreate`     | Any non-zero exit code causes worktree creation to fail |
| `WorktreeRemove`     | Failures logged in debug mode only                      |
| `InstructionsLoaded` | Exit code is ignored                                    |
| `CwdChanged`         | Shows stderr to user only                               |
| `FileChanged`        | Shows stderr to user only                               |
| `MessageDisplay`     | Shows stderr to user only                               |

## JSON Output Patterns

### Decision Control by Event

| Events                                                                                                                  | Decision Pattern               | Key Fields                                                                                                   |
| ----------------------------------------------------------------------------------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| UserPromptSubmit, UserPromptExpansion, PostToolUse, PostToolUseFailure, Stop, SubagentStop, ConfigChange, PostToolBatch | Top-level `decision`           | `decision: "block"`, `reason`                                                                                |
| TeammateIdle, TaskCompleted                                                                                             | Exit code or `continue: false` | Exit code 2 blocks; JSON `continue: false` also stops                                                        |
| PreToolUse                                                                                                              | `hookSpecificOutput`           | `permissionDecision` (allow/deny/ask/defer), `permissionDecisionReason`, `updatedInput`, `additionalContext` |
| PermissionRequest                                                                                                       | `hookSpecificOutput`           | `decision.behavior` (allow/deny), `decision.updatedInput`, `decision.appliedRule`                            |
| PermissionDenied                                                                                                        | `hookSpecificOutput`           | `retry: true` to tell model it may retry                                                                     |
| PostToolUse                                                                                                             | `hookSpecificOutput`           | `updatedToolOutput` (modify result), `additionalContext`                                                     |
| MessageDisplay                                                                                                          | `hookSpecificOutput`           | `displayContent` (replace displayed text, screen only)                                                       |
| Elicitation, ElicitationResult                                                                                          | `hookSpecificOutput`           | `action` (accept/decline/cancel), `content`                                                                  |
| WorktreeCreate                                                                                                          | stdout path                    | Print absolute path to created worktree                                                                      |
| WorktreeRemove, Notification, SessionEnd, PostCompact, InstructionsLoaded                                               | None                           | No decision control (side effects only)                                                                      |

### PreToolUse Output

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow|deny|ask|defer",
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
- **Defer** (exit for calling process to handle; non-interactive mode only)
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

| Field               | Default | Description                                                                                  |
| ------------------- | ------- | -------------------------------------------------------------------------------------------- |
| `continue`          | `true`  | If `false`, Claude stops processing entirely. Takes precedence over event-specific decisions |
| `stopReason`        | none    | Message shown to user when `continue` is `false`                                             |
| `suppressOutput`    | `false` | If `true`, hides stdout from verbose output                                                  |
| `systemMessage`     | none    | Warning message shown to user                                                                |
| `additionalContext` | none    | String added to Claude's context window as system reminder (capped at 10,000 characters)     |
| `terminalSequence`  | none    | Terminal escape sequence (OSC 0/1/2/9/99/777, BEL only)                                      |

### Terminal Notifications

Return escape sequences through `terminalSequence` instead of writing to `/dev/tty` (unavailable to hooks):

```json
{
  "terminalSequence": "\033]777;notify;Title;Body\007"
}
```

Allowed sequences: OSC 0, 1, 2 (window/icon titles); OSC 9 (iTerm2, ConEmu, Windows Terminal, WezTerm); OSC 99 (Kitty); OSC 777 (urxvt, Ghostty, Warp); bare BEL.

## Common Input Fields

All hook events receive these fields as JSON:

| Field             | Description                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------- |
| `session_id`      | Current session identifier                                                                        |
| `prompt_id`       | UUID identifying the current prompt turn (v2.1.196+)                                              |
| `transcript_path` | Path to conversation JSON                                                                         |
| `cwd`             | Current working directory when hook is invoked                                                    |
| `permission_mode` | Current permission mode: `default`, `plan`, `acceptEdits`, `auto`, `dontAsk`, `bypassPermissions` |
| `effort`          | Object with effort level: `low`, `medium`, `high`, `xhigh`, `max`                                 |
| `hook_event_name` | Name of the event that fired                                                                      |

When running with `--agent` or inside a subagent, two additional fields:

| Field        | Description                                                             |
| ------------ | ----------------------------------------------------------------------- |
| `agent_id`   | Unique identifier for the subagent (present only inside subagent calls) |
| `agent_type` | Agent name (e.g., `"Explore"` or `"security-reviewer"`)                 |

## Async Hooks

Set `"async": true` on command hooks for background execution:

- Claude continues while hook executes
- Results delivered on next turn
- Timeout applies to background process
- Cannot block or control behavior

### AsyncRewake

Set `"asyncRewake": true` to run a background hook that wakes Claude on exit 2, showing the hook's stderr/stdout as a system reminder.

## JSON Output Size Limits

Hook output strings are capped at 10,000 characters. Excess text is saved to a file with a preview and file path shown instead.

## The `/hooks` Menu

Type `/hooks` in Claude Code to open the interactive hooks manager. Each hook is labeled with a bracket prefix indicating its source:

- `[User]`: from `~/.claude/settings.json`
- `[Project]`: from `.claude/settings.json`
- `[Local]`: from `.claude/settings.local.json`
- `[Plugin]`: from a plugin's `hooks/hooks.json`, read-only
- `[Session]`: from skill/agent frontmatter
- `[Built-in]`: from Claude Code itself

The menu is read-only; edit settings JSON files to modify hooks.

## Disable or Remove Hooks

Set `"disableAllHooks": true` in settings or use the toggle in `/hooks` menu. The `disableAllHooks` setting respects the managed settings hierarchy -- if an administrator has configured hooks through managed policy settings, `disableAllHooks` in user/project/local settings cannot disable those managed hooks.

Direct edits to hooks in settings files do not take effect immediately. Claude Code captures a snapshot at startup. If hooks are modified externally, Claude Code warns you and requires review in the `/hooks` menu before changes apply.

## Environment Variables

| Variable                        | Description                                                                       |
| ------------------------------- | --------------------------------------------------------------------------------- |
| `$CLAUDE_PROJECT_DIR`           | Project root directory                                                            |
| `${CLAUDE_PLUGIN_ROOT}`         | Plugin root directory                                                             |
| `${CLAUDE_PLUGIN_DATA}`         | Plugin persistent data directory                                                  |
| `CLAUDE_ENV_FILE`               | File path for SessionStart/Setup/CwdChanged/FileChanged hooks to persist env vars |
| `$CLAUDE_CODE_REMOTE`           | Set to "true" in web environments                                                 |
| `CLAUDE_CODE_BRIDGE_SESSION_ID` | Remote Control session ID (v2.1.199+)                                             |
| `CLAUDE_EFFORT`                 | Effort level (for some events)                                                    |

## How Hooks Layer

Hooks merge across all sources: all registered hooks fire for their matching events regardless of source (user settings, project settings, plugins, managed settings). This differs from skills and MCP servers which override by name.

## Common Hook Patterns

### Desktop Notifications

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "permission_prompt",
        "hooks": [
          {
            "type": "command",
            "command": "osascript -e 'display notification \"Claude needs input\"'"
          }
        ]
      }
    ]
  }
}
```

### Auto-Format After Edits

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write \"$TOOL_INPUT_FILE_PATH\""
          }
        ]
      }
    ]
  }
}
```

### Protected Files

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "echo $TOOL_INPUT | jq -r '.file_path' | grep -qE '\\.(env|lock)$' && exit 2 || exit 0"
          }
        ]
      }
    ]
  }
}
```

### Block Destructive Commands

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.command' | grep -qE 'rm -rf' && exit 2 || exit 0"
          }
        ]
      }
    ]
  }
}
```

### Context Re-injection After Compaction

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "compact",
        "hooks": [
          { "type": "command", "command": "cat .claude/context-reminder.txt" }
        ]
      }
    ]
  }
}
```

### Quality Gates (Task Completion)

```json
{
  "hooks": {
    "TaskCompleted": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "agent",
            "prompt": "Verify all tests pass before marking complete",
            "timeout": 120
          }
        ]
      }
    ]
  }
}
```

### HTTP Hook with Auth

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "http",
            "url": "http://localhost:8080/hooks/pre-tool-use",
            "timeout": 30,
            "headers": { "Authorization": "Bearer $MY_TOKEN" },
            "allowedEnvVars": ["MY_TOKEN"]
          }
        ]
      }
    ]
  }
}
```

### MCP Tool Hook

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "mcp__memory__.*",
        "hooks": [
          {
            "type": "mcp_tool",
            "server": "logging",
            "tool": "log_event",
            "input": { "event": "mcp_operation", "tool": "${tool_name}" }
          }
        ]
      }
    ]
  }
}
```

### MCP Tool Validation

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "mcp__memory__.*",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Memory operation initiated' >> ~/mcp-operations.log"
          }
        ]
      },
      {
        "matcher": "mcp__.*__write.*",
        "hooks": [
          {
            "type": "command",
            "command": "/home/user/scripts/validate-mcp-write.py"
          }
        ]
      }
    ]
  }
}
```

### Elicitation

Fires when an MCP server requests user input. Matches MCP server name. Supports two modes:

- **Form mode**: Server defines form fields via JSON schema
- **URL mode**: Server provides a URL for browser-based authentication

```json
{
  "hookSpecificOutput": {
    "hookEventName": "Elicitation",
    "action": "accept|decline|cancel",
    "content": { "field": "value" }
  }
}
```

Exit code 2 denies the elicitation. Use this hook to auto-respond to elicitation requests without showing a dialog.

### ElicitationResult

Fires after the user responds to an MCP elicitation. Matches MCP server name. Can override the user's response.

```json
{
  "hookSpecificOutput": {
    "hookEventName": "ElicitationResult",
    "action": "accept|decline|cancel",
    "content": { "field": "override" }
  }
}
```

Exit code 2 blocks the response (becomes a decline).

## Sources

- [Hooks Reference](https://code.claude.com/docs/en/hooks)
- [Hooks Guide](https://code.claude.com/docs/en/hooks-guide)
