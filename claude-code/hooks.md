---
title: "Claude Code Hooks"
source_url: "claude-code-guide-agent"
source_type: "manual"
fetched_at: "2026-01-31T00:00:00Z"
category: "claude-code"
---

# Claude Code Hooks

Hooks are user-defined shell commands and LLM-based evaluations that execute at various points in Claude Code's lifecycle, providing deterministic control over Claude Code's behavior.

## Hook Events

| Event | When | Can Block |
|-------|------|-----------|
| `PreToolUse` | Before tool execution | Yes |
| `PostToolUse` | After tool completes | No (feedback only) |
| `PostToolUseFailure` | After tool call fails | No (feedback only) |
| `PermissionRequest` | Permission dialog shown | Yes |
| `UserPromptSubmit` | User submits prompt | Yes |
| `Notification` | Claude sends notification | No |
| `Stop` | Claude finishes responding | Yes (force continue) |
| `SubagentStart` | Subagent is spawned | No |
| `SubagentStop` | Subagent finishes | Yes |
| `SessionStart` | Session begins or resumes | No |
| `SessionEnd` | Session ends | No |
| `PreCompact` | Before compaction | No |

## Configuration

### Configuration Files

- `~/.claude/settings.json` - User settings (all projects)
- `.claude/settings.json` - Project settings (team-shared)
- `.claude/settings.local.json` - Local project settings (gitignored)
- Plugin `hooks/hooks.json` - Plugin-scoped hooks

### Basic Structure

```json
{
  "hooks": {
    "EventName": [
      {
        "matcher": "ToolPattern",
        "hooks": [
          {
            "type": "command",
            "command": "your-command-here",
            "timeout": 600
          }
        ]
      }
    ]
  }
}
```

## Hook Types

### Command Hooks

Execute shell scripts:

```json
{
  "type": "command",
  "command": "${CLAUDE_PROJECT_DIR}/scripts/validate.sh",
  "timeout": 600,
  "async": false
}
```

Default timeout: 600 seconds (10 minutes, changed from 60s in v2.1.3).

### Prompt Hooks

Use LLM for evaluation (single-turn, returns `ok: true/false`):

```json
{
  "type": "prompt",
  "prompt": "Evaluate if task is complete: $ARGUMENTS",
  "model": "default_fast_model",
  "timeout": 30
}
```

### Agent Hooks

Spawn subagent with tool access for multi-turn verification:

```json
{
  "type": "agent",
  "prompt": "Verify that tests pass. Run the test suite. $ARGUMENTS",
  "model": "default_fast_model",
  "timeout": 60
}
```

Up to 50 tool-use turns. Use when verification requires file inspection.

## Matchers

### Tool Events (PreToolUse, PostToolUse, PermissionRequest)

| Pattern | Matches |
|---------|---------|
| `"Write"` | Exact match for Write tool |
| `"Edit\|Write"` | Either Edit or Write |
| `"Notebook.*"` | Notebook and any suffix |
| `"mcp__memory__.*"` | All memory server MCP tools |
| `"*"` or `""` | All tools |

### SessionStart Matchers

`startup`, `resume`, `clear`, `compact`

### SessionEnd Matchers

`clear`, `logout`, `prompt_input_exit`, `other`

### Notification Matchers

`permission_prompt`, `idle_prompt`, `auth_success`, `elicitation_dialog`

### SubagentStart/SubagentStop Matchers

Match on agent type: `Bash`, `Explore`, `Plan`, `custom-agent-name`

### PreCompact Matchers

`manual` (from `/compact`), `auto` (automatic compaction)

## Hook Input

All hooks receive JSON via stdin:

```json
{
  "session_id": "abc123",
  "transcript_path": "/path/to/session.jsonl",
  "cwd": "/project/path",
  "permission_mode": "default",
  "hook_event_name": "PreToolUse",
  "tool_name": "Write",
  "tool_input": {
    "file_path": "/path/to/file.txt",
    "content": "file content"
  },
  "tool_use_id": "toolu_01ABC123..."
}
```

### Tool Input Fields by Tool

- **Bash**: `command`, `description`, `timeout`, `run_in_background`
- **Write**: `file_path`, `content`
- **Edit**: `file_path`, `old_string`, `new_string`, `replace_all`
- **Read**: `file_path`, `offset`, `limit`
- **Glob**: `pattern`, `path`
- **Grep**: `pattern`, `path`, `glob`, `output_mode`

## Exit Code Meanings

| Code | Meaning | Behavior |
|------|---------|----------|
| **0** | Success | Parses JSON output for decision fields |
| **2** | Block action | Prevents execution; stderr becomes error message |
| **Other** | Non-blocking error | stderr shown in verbose mode; action proceeds |

### Exit Code 2 Behavior by Event

| Event | Can block? | What happens |
|-------|-----------|-------------|
| PreToolUse | Yes | Blocks tool call |
| PermissionRequest | Yes | Denies permission |
| UserPromptSubmit | Yes | Blocks prompt |
| Stop | Yes | Prevents Claude from stopping |
| SubagentStop | Yes | Prevents subagent from stopping |
| PostToolUse | No | stderr shown to Claude |
| Notification | No | stderr shown to user |
| SessionStart | No | stderr shown to user |

## JSON Output Format

On exit 0, hooks can output JSON to stdout:

```json
{
  "continue": true,
  "stopReason": "Optional stop message",
  "suppressOutput": false,
  "systemMessage": "Warning message to user",
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow|deny|ask",
    "permissionDecisionReason": "Your reason here",
    "additionalContext": "Context for Claude",
    "updatedInput": {
      "modified_field": "new_value"
    }
  }
}
```

### Prompt/Agent Hook Response

```json
{
  "ok": true,
  "reason": "Explanation if ok is false"
}
```

## Environment Variables

Available in hook scripts:

| Variable | Available in | Description |
|----------|-------------|-------------|
| `CLAUDE_PROJECT_DIR` | All hooks | Project root directory |
| `CLAUDE_PLUGIN_ROOT` | Plugin hooks | Plugin root directory |
| `CLAUDE_CODE_REMOTE` | All hooks | `"true"` in web environments |
| `CLAUDE_ENV_FILE` | SessionStart only | File for persisting env vars |

### Persisting Environment Variables (SessionStart)

```bash
#!/bin/bash
if [ -n "$CLAUDE_ENV_FILE" ]; then
  echo 'export NODE_ENV=production' >> "$CLAUDE_ENV_FILE"
fi
exit 0
```

## Examples

### Log All Bash Commands

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.command' >> ~/.claude/commands.log"
          }
        ]
      }
    ]
  }
}
```

### Auto-Format TypeScript Files

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write"
          }
        ]
      }
    ]
  }
}
```

### Block Sensitive File Modifications

```bash
#!/bin/bash
# .claude/hooks/protect-files.sh
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

PROTECTED_PATTERNS=(".env" "package-lock.json" ".git/")
for pattern in "${PROTECTED_PATTERNS[@]}"; do
  if [[ "$FILE_PATH" == *"$pattern"* ]]; then
    echo "Blocked: $FILE_PATH matches protected pattern '$pattern'" >&2
    exit 2
  fi
done
exit 0
```

### Custom Desktop Notifications

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "osascript -e 'display notification \"Claude Code needs attention\" with title \"Claude Code\"'"
          }
        ]
      }
    ]
  }
}
```

### Re-inject Context After Compaction

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "compact",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Reminder: use Bun, not npm. Run bun test before committing.'"
          }
        ]
      }
    ]
  }
}
```

### Stop Hook with Prompt Evaluation

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Check if all tasks are complete. If not, respond with {\"ok\": false, \"reason\": \"what remains to be done\"}."
          }
        ]
      }
    ]
  }
}
```

### Agent Hook for Test Verification

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "agent",
            "prompt": "Verify that all unit tests pass. Run the test suite and check the results. $ARGUMENTS",
            "timeout": 120
          }
        ]
      }
    ]
  }
}
```

## Security Considerations

**USE AT YOUR OWN RISK**: Hooks execute with your full system user permissions.

Best practices:
1. Always quote shell variables (`"$VAR"`)
2. Validate and sanitize inputs
3. Block path traversal (`..` in paths)
4. Use absolute paths for scripts
5. Skip sensitive files (.env, credentials)
6. Test hook scripts manually before deployment

## Debugging

```bash
# Run with debug output
claude --debug

# Toggle verbose mode
Ctrl+O

# Test hooks manually
echo '{"tool_name":"Write","tool_input":{"file_path":"test.txt"}}' | ./my-hook.sh
echo $?
```

### Common Issues

- **Hook not firing**: Check matcher is case-sensitive and exact; verify correct event
- **"command not found"**: Use absolute paths or `$CLAUDE_PROJECT_DIR`
- **Scripts not executing**: Make executable with `chmod +x`
- **JSON validation failed**: Check shell profile for unconditional `echo` statements
- **Stop hook runs forever**: Check `stop_hook_active` field and exit early if `true`
- **PermissionRequest not firing in `-p` mode**: Use `PreToolUse` instead for headless

## Recent Changes

- **v2.1.3**: Tool hook execution timeout changed from 60 seconds to 10 minutes
- **v2.1.29**: Fixed startup performance with saved hook context
