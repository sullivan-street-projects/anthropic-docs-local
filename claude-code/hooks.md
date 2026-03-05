---
title: "Claude Code Hooks"
source_url: "https://code.claude.com/docs/en/hooks"
source_type: "manual"
fetched_at: "2026-03-05T00:00:00Z"
category: "claude-code"
---

# Claude Code Hooks

Hooks are lifecycle event handlers that execute shell commands, LLM prompts, or subagents in response to Claude Code events. They enable deterministic automation, validation, and customization.

> **Last updated:** March 5, 2026

## Hook Events (15 Total)

| Event | Description | Matcher |
|-------|-------------|---------|
| `InstructionsLoaded` | CLAUDE.md and rules files loaded | None |
| `SessionStart` | Session begins or resumes | `startup`, `resume`, `clear`, `compact` |
| `UserPromptSubmit` | Before Claude processes user input | None |
| `PreToolUse` | Before tool executes (can block) | Tool name (also matches MCP tools: `mcp__servername__toolname`) |
| `PermissionRequest` | Permission dialog appears | Tool name |
| `PostToolUse` | After tool succeeds | Tool name |
| `PostToolUseFailure` | After tool fails | Tool name |
| `Notification` | Notification events fire | `permission_prompt`, `idle_prompt`, `auth_success`, `elicitation_dialog` |
| `SubagentStart` | Subagent spawned | Agent type |
| `SubagentStop` | Subagent finishes | Agent type |
| `Stop` | Main Claude finishes responding | None |
| `TeammateIdle` | Agent team teammate about to go idle | None (exit code 2 only) |
| `TaskCompleted` | Task marked as completed | None (exit code 2 only) |
| `PreCompact` | Before context compaction | `manual`, `auto` |
| `SessionEnd` | Session terminates | `clear`, `logout`, `prompt_input_exit`, `bypass_permissions_disabled`, `other` |

### HTTP Hooks

In addition to command hooks, hooks can call HTTP endpoints:

```json
{
  "type": "http",
  "url": "https://api.example.com/hook",
  "method": "POST",
  "headers": { "Authorization": "Bearer ${API_KEY}" },
  "timeout": 30
}
```

HTTP hooks receive the same JSON input as command hooks (as the POST body) and return JSON responses.

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
  "type": "command|prompt|agent",
  "command": "shell command",
  "prompt": "prompt text",
  "model": "claude-haiku-4-5",
  "timeout": 600,
  "async": true,
  "statusMessage": "Custom message",
  "once": true
}
```

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | `command`, `prompt`, or `agent` |
| `command` | string | Shell command (command hooks) |
| `prompt` | string | Prompt text (prompt/agent hooks) |
| `model` | string | Model override (default: Haiku) |
| `timeout` | number | Timeout in seconds |
| `async` | boolean | Run in background (command hooks only) |
| `statusMessage` | string | Custom status message |
| `once` | boolean | Run only once per session (skill hooks) |

## Matcher Patterns

- Case-sensitive regex matching
- Empty string or `*` matches all events
- Complex patterns: `Edit|Write`, `mcp__.*`, `Bash`

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

## Sources

- [Hooks Guide](https://code.claude.com/docs/en/hooks-guide)
- [Hooks Reference](https://code.claude.com/docs/en/hooks)
