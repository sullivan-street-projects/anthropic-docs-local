---
title: "Claude Code Hooks"
source_url: "https://code.claude.com/docs/en/hooks"
source_type: "manual"
fetched_at: "2026-03-10T00:00:00Z"
category: "claude-code"
---

# Claude Code Hooks

Hooks are user-defined shell commands, HTTP endpoints, or LLM prompts that execute automatically at specific points in Claude Code's lifecycle. They enable deterministic automation, validation, and customization without involving the LLM.

> **Last updated:** March 5, 2026

## Hook Lifecycle

Hooks fire at specific points during a Claude Code session. When an event fires and a matcher matches, Claude Code passes JSON context about the event to your hook handler. For command hooks, input arrives on stdin. For HTTP hooks, it arrives as the POST request body. Your handler can then inspect the input, take action, and optionally return a decision.

## Hook Events (14 Total)

| Event | Description | Matcher | Fires |
|-------|-------------|---------|-------|
| `SessionStart` | Session begins or resumes | `startup`, `resume`, `clear`, `compact` | Once per session |
| `UserPromptSubmit` | Before Claude processes user input | None | Each user message |
| `PreToolUse` | Before tool executes (can block) | Tool name | Each tool call |
| `PermissionRequest` | Permission dialog appears | Tool name | Each permission prompt |
| `PostToolUse` | After tool succeeds | Tool name | Each tool call |
| `PostToolUseFailure` | After tool fails | Tool name | Each failed tool call |
| `Notification` | Notification events fire | `permission_prompt`, `idle_prompt`, `auth_success`, `elicitation_dialog` | Various |
| `SubagentStart` | Subagent spawned | Agent type | Each subagent spawn |
| `SubagentStop` | Subagent finishes | Agent type | Each subagent finish |
| `Stop` | Main Claude finishes responding | None | Each response |
| `TeammateIdle` | Agent team teammate about to go idle | None (exit code 2 only) | Agent teams |
| `TaskCompleted` | Task marked as completed | None (exit code 2 only) | Task completion |
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
  "timeout": 10
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

| Location | Scope |
|----------|-------|
| `~/.claude/settings.json` | User-wide (all projects) |
| `.claude/settings.json` | Project-wide (shared via git) |
| `.claude/settings.local.json` | Project local (gitignored) |
| Plugin `hooks/hooks.json` | Plugin scope |
| Skill/Agent frontmatter | Component scope |
| Managed settings | Organization-wide |

## Hook Handler Fields

```json
{
  "type": "command|prompt|agent|http",
  "command": "shell command",
  "prompt": "prompt text",
  "url": "https://endpoint.example.com/hook",
  "model": "claude-haiku-4-5",
  "timeout": 600,
  "async": true,
  "statusMessage": "Custom message",
  "once": true
}
```

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | `command`, `prompt`, `agent`, or `http` |
| `command` | string | Shell command (command hooks) |
| `prompt` | string | Prompt text (prompt/agent hooks) |
| `url` | string | HTTP endpoint URL (http hooks) |
| `model` | string | Model override (default: Haiku) |
| `timeout` | number | Timeout in seconds |
| `async` | boolean | Run in background (command hooks only) |
| `statusMessage` | string | Custom status message |
| `once` | boolean | Run only once per session (skill hooks) |

## Matcher Patterns

- Case-sensitive regex matching
- Empty string or `*` matches all events
- Complex patterns: `Edit|Write`, `mcp__.*`, `Bash`
- Matchers are optional; omitting means the hook runs on every occurrence of the event

## Exit Codes

| Code | Behavior |
|------|----------|
| `0` | Action proceeds (or allows with JSON output) |
| `2` | Action blocked (cannot be combined with JSON) |
| Other | Non-blocking error logged in verbose mode |

## JSON Output Patterns

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

| Field | Description |
|-------|-------------|
| `continue: false` | Stop Claude entirely |
| `stopReason: "message"` | Reason shown to user |
| `systemMessage: "message"` | Warning shown to user |
| `suppressOutput: true` | Hide from verbose output |

## Async Hooks

Set `"async": true` on command hooks for background execution:
- Claude continues while hook executes
- Results delivered on next turn
- Timeout applies to background process
- Cannot block or control behavior

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

### HTTP Hook Example
```json
{
  "hooks": {
    "PostToolUse": [
      { "matcher": "Edit|Write", "hooks": [
        { "type": "http", "url": "https://hooks.example.com/log-edits", "timeout": 5 }
      ]}
    ]
  }
}
```

## Sources

- [Hooks Reference](https://code.claude.com/docs/en/hooks)
- [Hooks Guide](https://code.claude.com/docs/en/hooks-guide)
