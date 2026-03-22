---
title: "Memory Tool"
source_url: "https://platform.claude.com/docs/en/docs/agents-and-tools/tool-use/memory-tool"
source_type: "web-extracted"
fetched_at: "2026-03-22T00:00:00Z"
category: "api"
---

# Memory Tool

The memory tool enables Claude to store and retrieve information across conversations through a memory file directory. Claude can create, read, update, and delete files that persist between sessions, allowing it to build knowledge over time without keeping everything in the context window.

This is the key primitive for just-in-time context retrieval: agents store what they learn in memory and pull it back on demand. The memory tool operates client-side — you control where and how the data is stored.

## Supported Models

All current Claude models: Opus 4.6, Opus 4.5, Opus 4.1, Opus 4, Sonnet 4.6, Sonnet 4.5, Sonnet 4, Haiku 4.5.

## Use Cases

- Maintain project context across multiple agent executions
- Learn from past interactions, decisions, and feedback
- Build knowledge bases over time
- Enable cross-conversation learning

## How It Works

When enabled, Claude automatically checks its memory directory before starting tasks. Claude can create, read, update, and delete files in the `/memories` directory.

Tool type: `memory_20250818`

```python
import anthropic
client = anthropic.Anthropic()

message = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=2048,
    messages=[{"role": "user", "content": "Help me debug this Python function..."}],
    tools=[{"type": "memory_20250818", "name": "memory"}],
)
```

## Tool Commands

| Command | Description |
|---------|-------------|
| `view` | Show directory contents or file contents with optional line ranges |
| `create` | Create a new file |
| `str_replace` | Replace text in a file |
| `insert` | Insert text at a specific line |
| `delete` | Delete a file or directory |
| `rename` | Rename or move a file/directory |

## Multi-Session Software Development Pattern

For long-running projects spanning multiple agent sessions:
1. **Initializer session:** Sets up memory artifacts — progress log, feature checklist, startup scripts
2. **Subsequent sessions:** Read memory artifacts to recover full project state in seconds
3. **End-of-session update:** Update progress log with completed work and remaining tasks

Key principle: Work on one feature at a time. Only mark complete after end-to-end verification.

## Using with Context Editing

Combine with context editing (`context-management-2025-06-27` beta) to automatically clear old tool results while preserving critical info in memory files. This enables long-running workflows that would otherwise exceed context limits.

## Using with Compaction

Pair with server-side compaction for long-running agentic workflows. Compaction keeps active context manageable while memory persists important information across compaction boundaries.

## Security Considerations

- **Path traversal protection:** Validate all paths start with `/memories` and resolve to canonical form
- **Sensitive information:** Claude usually refuses to write sensitive data, but implement additional validation
- **File storage size:** Track and limit memory file sizes
- **Memory expiration:** Consider clearing unaccessed files periodically
- ZDR eligible
