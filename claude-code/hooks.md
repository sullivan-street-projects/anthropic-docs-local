---
title: "Claude Code Hooks"
source_url: "claude-code-guide-agent"
source_type: "manual"
fetched_at: "2026-01-04T06:15:00Z"
category: "claude-code"
---

# Claude Code Hooks

Hooks are user-defined shell commands and LLM-based evaluations that execute at various points in Claude Code's lifecycle, providing deterministic control over Claude Code's behavior.

## Hook Events

| Event | When | Can Block |
|-------|------|-----------|
| `PreToolUse` | Before tool execution | Yes |
| `PostToolUse` | After tool completes | No (feedback only) |
| `PermissionRequest` | Permission dialog shown | Yes |
| `UserPromptSubmit` | User submits prompt | Yes |
| `Notification` | Claude sends notification | No |
| `Stop` | Claude finishes responding | Yes (force continue) |
| `SubagentStop` | Subagent finishes | Yes |
| `SessionStart` | Session begins | No |
| `SessionEnd` | Session ends | No |
| `PreCompact` | Before compaction | No |

## Configuration

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
            "command": "your-command-here"
          }
        ]
      }
    ]
  }
}
```

### Configuration Files

- `~/.claude/settings.json` - User settings (all projects)
- `.claude/settings.json` - Project settings
- `.claude/settings.local.json` - Local project settings (gitignored)

## Hook Types

### Command Hooks

Execute shell scripts:

```json
{
  "type": "command",
  "command": "${CLAUDE_PROJECT_DIR}/scripts/validate.sh"
}
```

### Prompt Hooks

Use LLM for evaluation:

```json
{
  "type": "prompt",
  "prompt": "Evaluate if task is complete: $ARGUMENTS"
}
```

## Matchers

| Pattern | Matches |
|---------|---------|
| `"Write"` | Exact match for Write tool |
| `"Edit\|Write"` | Either Edit or Write |
| `"Notebook.*"` | Notebook and any suffix |
| `"*"` or `""` | All tools |

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
  }
}
```

## Exit Code Meanings

| Code | Meaning |
|------|---------|
| **0** | Success - allow action |
| **2** | Block action - prevents execution |
| **Other** | Non-blocking error |

## JSON Output Format

```json
{
  "decision": "approve|block|ask",
  "reason": "Explanation for decision",
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow|deny|ask"
  }
}
```

## Examples

### Log All Bash Commands

```json
{
  "hooks": {
    "PreToolUse": [
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
            "command": "if echo \"$(jq -r '.tool_input.file_path')\" | grep -q '\\.ts$'; then npx prettier --write \"$(jq -r '.tool_input.file_path')\"; fi"
          }
        ]
      }
    ]
  }
}
```

### Block Sensitive File Modifications

```python
#!/usr/bin/env python3
import json, sys

data = json.load(sys.stdin)
path = data.get('tool_input', {}).get('file_path', '')

blocked = ['.env', 'package-lock.json', '.git/']
if any(p in path for p in blocked):
    sys.exit(2)  # Block
sys.exit(0)  # Allow
```

### Custom Desktop Notifications

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "permission_prompt",
        "hooks": [
          {
            "type": "command",
            "command": "notify-send 'Claude Code' 'Permission needed'"
          }
        ]
      }
    ]
  }
}
```

### Load Project Context on Startup

```bash
#!/bin/bash
# .claude/hooks/load-context.sh

echo "=== Recent Changes ==="
git log --oneline -10 2>/dev/null

echo "=== Open Issues ==="
gh issue list --state open --limit 5 2>/dev/null
```

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/load-context.sh"
          }
        ]
      }
    ]
  }
}
```

## Environment Variables

Available in hook scripts:

- `$CLAUDE_PROJECT_DIR` - Absolute path to project root
- `$CLAUDE_CODE_REMOTE` - "true" if running in remote environment
- `$CLAUDE_ENV_FILE` - (SessionStart only) File for persisting env vars

## Security Considerations

**USE AT YOUR OWN RISK**: Hooks execute arbitrary shell commands.

Best practices:
1. Always quote shell variables (`"$VAR"`)
2. Validate and sanitize inputs
3. Block path traversal (`..` in paths)
4. Use absolute paths
5. Skip sensitive files (.env, credentials)

## Debugging

```bash
# Run with debug output
claude --debug

# Test hooks manually
echo '{"tool_name":"Write"}' | ./my-hook.sh
```
