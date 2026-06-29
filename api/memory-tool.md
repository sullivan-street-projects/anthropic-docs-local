---
title: "Memory Tool"
source_url: "https://platform.claude.com/docs/en/docs/agents-and-tools/tool-use/memory-tool"
source_type: "web-extracted"
fetched_at: "2026-06-28T00:00:00Z"
category: "api"
---

# Memory Tool

The memory tool lets Claude store and retrieve information across conversations in a directory of memory files. Claude can create, read, update, and delete files that persist between sessions, building up knowledge over time without keeping everything in the context window.

Memory supports just-in-time context retrieval. Rather than loading all relevant information up front, an agent records what it learns in memory files and reads them back on demand. This keeps the active context focused on the current task, which matters for long-running sessions that would otherwise overwhelm the context window.

The memory tool operates client-side: Claude requests file operations, and your application executes them. You control where and how the data is stored through your own infrastructure.

This feature is eligible for Zero Data Retention (ZDR). When your organization has a ZDR arrangement, data sent through this feature is not stored after the API response is returned.

## Use Cases

- Maintain project context across multiple agent sessions
- Apply lessons from past interactions, decisions, and feedback to new tasks
- Build up a knowledge base over time

## How It Works

When the memory tool is enabled, Claude automatically checks its memory directory before starting a task. As it works, Claude stores what it learns in files under `/memories` and reads them back in later conversations to continue earlier work.

Because the memory tool is client-side, Claude only requests memory operations. Your application executes each request against storage you control and returns the result in a `tool_result` block. The `/memories` path is a prefix that your handler maps onto real storage, such as a per-user directory or keys in a database. Memory lives entirely in your application. A later conversation continues from the same memory when it sends the same `tools` entry and your handler serves the same store. For security, restrict all memory operations to the `/memories` directory.

### Example: How Memory Tool Calls Work

A typical interaction looks like this:

**1. User request:**
```
"Help me respond to this customer service ticket."
```

**2. Claude checks the memory directory:**

Claude calls the memory tool:
```json
{
  "type": "tool_use",
  "id": "toolu_01C4D5E6F7G8H9I0J1K2L3M4",
  "name": "memory",
  "input": {
    "command": "view",
    "path": "/memories"
  }
}
```

**3. Your application returns the directory contents:**
```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_01C4D5E6F7G8H9I0J1K2L3M4",
  "content": "Here're the files and directories up to 2 levels deep in /memories, excluding hidden items and node_modules:\n4.0K\t/memories\n1.5K\t/memories/customer_service_guidelines.xml\n2.0K\t/memories/refund_policies.xml"
}
```

**4. Claude reads relevant files:**
```json
{
  "type": "tool_use",
  "id": "toolu_01D5E6F7G8H9I0J1K2L3M4N5",
  "name": "memory",
  "input": {
    "command": "view",
    "path": "/memories/customer_service_guidelines.xml"
  }
}
```

**5. Your application returns the file contents:**
```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_01D5E6F7G8H9I0J1K2L3M4N5",
  "content": "Here's the content of /memories/customer_service_guidelines.xml with line numbers:\n     1\t<guidelines>\n     2\t<addressing_customers>\n     3\t- Always address customers by their first name\n     4\t- Use empathetic language\n..."
}
```

**6. Claude uses the memory to help:**
```
"Based on your customer service guidelines, I can help you craft a response. Please share the ticket details..."
```

The memory tool is available on all Claude 4 and later models.

## Getting Started

The memory tool is generally available on the Messages API: no beta header is required. Using it takes two steps:

1. Add the memory tool to your request. The `tools` entry `{"type": "memory_20250818", "name": "memory"}` is the entire configuration.
2. Implement a client-side handler for each memory command. Your handler must reject paths outside `/memories`.

## Basic Usage

```python
client = anthropic.Anthropic()

message = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=2048,
    messages=[
        {
            "role": "user",
            "content": "Help me respond to this customer service ticket.",
        }
    ],
    tools=[{"type": "memory_20250818", "name": "memory"}],
)

print(message)
```

```typescript
const anthropic = new Anthropic();

const message = await anthropic.messages.create({
  model: "claude-opus-4-8",
  max_tokens: 2048,
  messages: [
    {
      role: "user",
      content: "Help me respond to this customer service ticket."
    }
  ],
  tools: [{ type: "memory_20250818", name: "memory" }]
});

console.log(message);
```

## Implement the Memory Handler

Claude's reply ends with a `tool_use` block that requests a memory operation, such as `view /memories`. Your application executes the operation and returns the result in a `tool_result` block, then sends the conversation back so Claude can continue: the standard tool-use loop.

Four SDKs provide memory tool helpers that handle the tool interface and the loop. Subclass `BetaAbstractMemoryTool` (Python and C#), use `betaMemoryTool` (TypeScript), or implement `BetaMemoryToolHandler` (Java) to back memory with your own storage. Python and TypeScript also ship a ready-made local-filesystem implementation, `BetaLocalFilesystemMemoryTool`. The Go and Ruby SDKs have no memory helper, so those examples run the tool-use loop themselves.

```python
import anthropic
from anthropic.tools import BetaLocalFilesystemMemoryTool

client = anthropic.Anthropic()
memory = BetaLocalFilesystemMemoryTool(base_path="./memory")

runner = client.beta.messages.tool_runner(
    model="claude-opus-4-8",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": "Remember that customer Acme Corp prefers email follow-ups.",
        }
    ],
    tools=[memory],
)

final_message = runner.until_done()
print(final_message.content)
```

```typescript
import Anthropic from "@anthropic-ai/sdk";
import { betaMemoryTool } from "@anthropic-ai/sdk/helpers/beta/memory";
import { BetaLocalFilesystemMemoryTool } from "@anthropic-ai/sdk/tools/memory/node";

const client = new Anthropic();

const backend = await BetaLocalFilesystemMemoryTool.init("./memory");
const memory = betaMemoryTool(backend);

const runner = client.beta.messages.toolRunner({
  model: "claude-opus-4-8",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: "Remember that customer Acme Corp prefers email follow-ups."
    }
  ],
  tools: [memory],
  max_iterations: 10
});

const finalMessage = await runner;
console.log(finalMessage.content);
```

## Tool Commands

Your client-side implementation must handle the following commands:

### view

Shows directory contents or file contents with optional line ranges:

```json
{
  "command": "view",
  "path": "/memories/notes.txt",
  "view_range": [1, 10]
}
```

`view_range` is optional: `[start_line, end_line]` returns those lines, and `[start_line, -1]` returns everything from `start_line` to the end.

**For directories:** Return a listing with files and sizes up to 2 levels deep, excluding hidden items and `node_modules`.

**For files:** Return file contents with 6-character right-aligned line numbers, tab-separated, 1-indexed. Files with more than 999,999 lines should return an error.

### create

Creates a new file:

```json
{
  "command": "create",
  "path": "/memories/notes.txt",
  "file_text": "Meeting notes:\n- Discussed project timeline\n- Next steps defined\n"
}
```

Returns success message or error if file already exists.

### str_replace

Replaces text in a file:

```json
{
  "command": "str_replace",
  "path": "/memories/preferences.txt",
  "old_str": "Favorite color: blue",
  "new_str": "Favorite color: green"
}
```

`new_str` is optional: when omitted, `old_str` is deleted without replacement. Returns error if text not found or if multiple occurrences exist.

### insert

Inserts text at a specific line:

```json
{
  "command": "insert",
  "path": "/memories/todo.txt",
  "insert_line": 2,
  "insert_text": "- Review memory tool documentation\n"
}
```

`insert_text` is inserted after line `insert_line`; `0` inserts at the beginning.

### delete

Deletes a file or directory:

```json
{
  "command": "delete",
  "path": "/memories/old_file.txt"
}
```

Deletes directories recursively. Cannot delete the `/memories` root directory.

### rename

Renames or moves a file or directory:

```json
{
  "command": "rename",
  "old_path": "/memories/draft.txt",
  "new_path": "/memories/final.txt"
}
```

Does not overwrite existing destination. Cannot rename the `/memories` root directory.

## Prompting Guidance

When the memory tool is present, the API automatically adds an instruction to the system prompt telling Claude to always view the memory directory first. You don't need to send this yourself.

If Claude creates cluttered memory files, you can reinforce organization in your prompt:

```
Note: when editing your memory folder, always try to keep its content up-to-date, coherent and organized. You can rename or delete files that are no longer relevant. Do not create new files unless necessary.
```

You can also guide what Claude writes to memory, e.g.: "Only write down information relevant to <topic> in your memory system."

## Security Considerations

Your application executes every file operation Claude requests, so these safeguards are your responsibility:

### Path Traversal Protection

A malicious path such as `/memories/../../secrets.env` can reach files outside the `/memories` directory. Your implementation must validate every path in every command:

- Validate that all paths start with `/memories`
- Resolve paths to their canonical form and verify they remain within the memory directory
- Reject paths containing sequences such as `../`, `..\\`, or other traversal patterns
- Watch for URL-encoded traversal sequences (`%2e%2e%2f`)
- Use your language's built-in path security utilities (e.g., Python's `pathlib.Path.resolve()` and `relative_to()`)

### Sensitive Information

Claude usually refuses to write sensitive information to memory files. For stronger guarantees, add validation that strips sensitive data before your handler writes the file.

### File Storage Size

Track memory file sizes and cap how large a file can grow. Consider capping how many characters the `view` command returns and let Claude page through the rest with `view_range`.

### Memory Expiration

Periodically delete memory files that haven't been accessed in a long time.

## Error Handling

To return an error to Claude, set `is_error` to `true` on the tool result:

```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_01C4D5E6F7G8H9I0J1K2L3M4",
  "content": "Error: The path /memories/notes.txt does not exist",
  "is_error": true
}
```

## Context Editing Integration

The memory tool pairs with context editing (`context-management-2025-06-27` beta) to automatically clear old tool results while preserving critical info in memory files. This enables long-running workflows that would otherwise exceed context limits.

## Using with Compaction

The memory tool can also be paired with server-side compaction for long-running agentic workflows. Compaction keeps active context manageable while memory persists important information across compaction boundaries. For long-running agents, consider using both: compaction keeps the active context small without client-side bookkeeping, and memory preserves the information that must survive summarization.

## Multi-Session Software Development Pattern

For software projects that span multiple agent sessions, set up memory files deliberately instead of writing them ad hoc:

1. **Initializer session:** Sets up memory artifacts -- progress log, feature checklist, startup scripts
2. **Subsequent sessions:** Read memory artifacts to recover full project state in seconds
3. **End-of-session update:** Update progress log with completed work and remaining tasks

Key principle: Work on one feature at a time. Mark a feature complete only after end-to-end verification confirms it works, not when the code is written.
