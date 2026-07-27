---
title: "Best Practices: /loop Command & Scheduling in Claude Code"
source_url: "https://code.claude.com/docs/en/cli-usage"
source_type: "manual"
fetched_at: "2026-07-27T00:00:00Z"
category: "claude-code"
---

# Best Practices: `/loop` Command & Scheduling in Claude Code

> **Documentation Status:** The `/loop` command was introduced in Claude Code v2.1.71 (see [CHANGELOG](../claude-code/CHANGELOG.md)). It is listed in the official [CLI Reference](https://code.claude.com/docs/en/cli-usage) and [Interactive Mode](https://code.claude.com/docs/en/interactive-mode) pages. The guidance below is synthesized from changelog entries, CLI reference documentation, and observed behavior.

---

## 1. What Is `/loop`?

`/loop` is a built-in slash command in Claude Code's interactive (REPL) mode that runs a prompt or another slash command on a recurring interval within the current session.

```
/loop <interval> <prompt or /command>
```

### Interval Format

| Suffix | Meaning | Example                               |
| ------ | ------- | ------------------------------------- |
| `m`    | Minutes | `/loop 5m check the deploy`           |
| `h`    | Hours   | `/loop 1h summarize git log`          |
| `d`    | Days    | `/loop 1d run /update-anthropic-docs` |
| `w`    | Weeks   | `/loop 1w audit dependencies`         |

**Source:** CHANGELOG v2.1.71 -- _"Added `/loop` command to run a prompt or slash command on a recurring interval (e.g. `/loop 5m check the deploy`)"_

---

## 2. Key Characteristics

### Session-Scoped Lifecycle

`/loop` runs **only** while your interactive Claude Code session is alive. When you close the terminal, exit with `/quit`, or the session times out, all loops stop.

**Implication:** `/loop` is ideal for _monitor-while-I-work_ tasks, not for 24/7 automation.

### Runs Inside the Agent Context

Each loop iteration executes within the same Claude Code agent context. This means:

- The agent retains conversation memory across iterations
- It can reference files, tools, and MCP servers configured for the session
- Each iteration consumes context window -- very frequent loops on large tasks can exhaust the window

### No Built-In Persistence

There is no mechanism to save or restore loops across sessions. If you need persistence, see Section 5 (Scheduling Tiers).

---

## 3. Best Practices

### 3.1 Use Descriptive, Scoped Prompts

**Do:**

```
/loop 10m check if the staging deploy at https://staging.example.com/health returns 200
```

**Don't:**

```
/loop 10m check things
```

A clear prompt ensures the agent takes the _same consistent action_ each iteration rather than interpreting a vague request differently over time.

### 3.2 Choose Intervals Thoughtfully

| Use Case             | Recommended Interval | Why                                         |
| -------------------- | -------------------- | ------------------------------------------- |
| CI/deploy monitoring | 3-5m                 | Fast feedback without excessive context use |
| Log watching         | 5-10m                | Balances freshness with resource use        |
| Dependency checks    | 1-4h                 | Dependencies don't change per-minute        |
| Documentation sync   | 1d or 1w             | Upstream docs change infrequently           |

**Rule of thumb:** If the thing you're monitoring can't meaningfully change within the interval, you're polling too fast.

### 3.3 Combine With Slash Commands

`/loop` can invoke other slash commands, making it composable:

```
/loop 30m /update-anthropic-docs --check
```

This runs your custom update command every 30 minutes for as long as the session is open.

### 3.4 Monitor Context Window Usage

Since each iteration adds to the conversation context, long-running loops with verbose output will eventually exhaust the context window. Strategies:

- **Keep loop prompts focused** -- ask for a summary, not full output
- **Use shorter monitoring windows** -- run the loop for a 2-hour work session, not 24 hours
- **Prefer concise output** -- ask the agent to only report if something _changed_

### 3.5 Pair With `--allowedTools` in Automation

If you're running `/loop` in a semi-automated fashion, consider restricting which tools the agent can use during loop iterations to prevent unintended side effects:

```bash
claude --allowedTools "Bash(git status)" --allowedTools "Read"
```

Then inside the session:

```
/loop 5m check git status for uncommitted changes
```

**Source:** CLI reference confirms `--allowedTools` supports tool-specific permissions with argument patterns.

---

## 4. Anti-Patterns

### 4.1 Don't Use `/loop` for Production Monitoring

`/loop` dies when your session ends. For production alerting, use proper monitoring tools (Datadog, PagerDuty, etc.) or scheduled CI workflows.

### 4.2 Don't Loop Destructive Commands

```
# DANGEROUS -- don't do this
/loop 1h clean up old branches and force push
```

Destructive operations should always require human review. If you must automate them, use the non-interactive `-p` flag with `--permission-mode` restrictions outside of `/loop`.

### 4.3 Don't Set Intervals Below 1 Minute

Even if technically possible, sub-minute intervals create excessive context usage and provide little value for most tasks.

---

## 5. The Three Scheduling Tiers

`/loop` occupies the first tier in a progression of scheduling approaches:

| Tier | Tool                  | Scope   | Persistence               | Best For                      |
| ---- | --------------------- | ------- | ------------------------- | ----------------------------- |
| 1    | `/loop`               | Session | None -- dies with session | Active monitoring during work |
| 2    | System cron / launchd | Machine | Survives reboots          | Local recurring tasks         |
| 3    | GitHub Actions / CI   | Cloud   | Always-on                 | Team-wide automation          |

### Tier 2: System Cron Example

```bash
# Run a Claude Code task every 6 hours
# crontab -e
0 */6 * * * cd /path/to/project && claude -p "check for dependency updates" --output-format json >> /var/log/claude-deps.json 2>&1
```

Key CLI flags for non-interactive cron usage (verified from [CLI Reference](https://code.claude.com/docs/en/cli-usage)):

| Flag                                       | Purpose                                                                                                                                  |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `-p "prompt"`                              | Non-interactive / print mode -- runs prompt and exits                                                                                    |
| `--output-format json`                     | Machine-readable output for logging/parsing (options: `text`, `json`, `stream-json`)                                                     |
| `--max-turns N`                            | Limit agent turns to prevent runaway execution                                                                                           |
| `--permission-mode`                        | Control what the agent can do without human approval (options: `default`, `manual`, `acceptEdits`, `plan`, `auto`, `dontAsk`, `bypassPermissions`) |
| `--dangerously-skip-permissions`           | Equivalent to `--permission-mode bypassPermissions` -- **use with extreme caution**                                                      |
| `--allowedTools "Tool(args)"`              | Restrict which tools the agent may use; supports pattern matching                                                                        |
| `--disallowedTools "Tool(args)"`           | Deny rules; a bare tool name removes tools from context, a scoped rule denies only matching calls                                        |
| `--tools "Bash,Edit,Read"`                 | Restrict which built-in tools Claude can use (use `""` to disable all, `"default"` for all)                                              |
| `--max-budget-usd N`                       | Maximum dollar amount to spend on API calls before stopping                                                                              |
| `--fallback-model <model>`                 | Enable automatic fallback model(s) when default is overloaded; accepts comma-separated list                                              |
| `--effort <level>`                         | Set effort level: `low`, `medium`, `high`, `xhigh`, `max`, `ultracode` (available levels depend on model)                                |
| `--bare`                                   | Minimal mode: skip hooks, skills, plugins, MCP, auto memory, CLAUDE.md for faster startup                                                |
| `--safe-mode`                              | Start with all customizations disabled (hooks, skills, plugins, MCP, CLAUDE.md, themes, etc.) for troubleshooting                        |
| `--no-session-persistence`                 | Disable session saving to disk (print mode only)                                                                                         |
| `--json-schema`                            | Get validated JSON output matching a schema (print mode only)                                                                            |
| `--model <model>`                          | Set the model with an alias (`sonnet`, `opus`, `haiku`, `fable`) or full model name                                                      |
| `--system-prompt "text"`                   | Replace entire system prompt with custom text                                                                                            |
| `--append-system-prompt "text"`            | Append custom text to end of default system prompt                                                                                       |
| `--system-prompt-file <path>`              | Load system prompt from a file                                                                                                           |
| `--append-system-prompt-file <path>`       | Append file contents to default prompt                                                                                                   |
| `--mcp-config <path>`                      | Load MCP servers from JSON files or strings                                                                                              |
| `--strict-mcp-config`                      | Only use MCP servers from `--mcp-config`, ignoring all other MCP configurations                                                          |
| `--setting-sources <list>`                 | Comma-separated list of setting sources to load (`user`, `project`, `local`)                                                             |
| `--settings <path>`                        | Path to a settings JSON file or inline JSON string                                                                                       |
| `--add-dir <path>`                         | Add additional working directories for file access                                                                                       |
| `--bg` / `--background`                    | Start session as a background agent and return immediately                                                                               |
| `--agent <name>`                           | Specify an agent for the current session                                                                                                 |
| `--agents <json>`                          | Define custom subagents dynamically via JSON                                                                                             |
| `--advisor <model>`                        | Enable server-side advisor tool with a model alias                                                                                       |
| `--verbose`                                | Enable verbose logging; shows full turn-by-turn output                                                                                   |
| `--debug`                                  | Enable debug mode with optional category filtering                                                                                       |
| `--init`                                   | Run Setup hooks with the `init` matcher before the session (print mode only)                                                             |
| `--init-only`                              | Run Setup and SessionStart hooks, then exit without starting a conversation                                                              |
| `--exclude-dynamic-system-prompt-sections` | Move per-machine sections from system prompt into first user message for better cache reuse                                              |
| `--input-format`                           | Specify input format for print mode (`text`, `stream-json`)                                                                              |
| `--include-hook-events`                    | Include hook lifecycle events in output stream (requires `--output-format stream-json`)                                                  |

### Tier 3: GitHub Actions Example

```yaml
name: Weekly Docs Sync
on:
  schedule:
    - cron: "0 8 * * 1" # Every Monday at 8 AM UTC
jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Claude Code
        run: |
          npx claude -p "run /update-anthropic-docs" \
            --output-format json \
            --max-turns 20
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

---

## 6. Background Agents

Claude Code supports background agents via the `--bg` flag and the `claude agents` command, providing a middle ground between `/loop` and full cron/CI scheduling:

```bash
# Start a background agent
claude --bg "investigate the flaky test"

# Monitor background agents
claude agents

# Attach to a background session
claude attach 7c5dcf5d

# View logs from a background session
claude logs 7c5dcf5d

# Stop a background session
claude stop 7c5dcf5d

# Run a shell command as a background job
claude --bg --exec 'pytest -x'
```

Background agents run as separate processes managed by a supervisor daemon. Unlike `/loop`, they persist independently of your interactive session. Use `claude daemon status` for diagnostics and `claude daemon stop --any` to recover from an unresponsive supervisor.

---

## 7. Security Considerations

### Permission Modes

When using `/loop` or any scheduled Claude Code task, choose the appropriate permission mode:

| Mode                | Description                                                  | When to Use                                  |
| ------------------- | ------------------------------------------------------------ | -------------------------------------------- |
| `default`           | Asks permission for sensitive operations                     | Interactive sessions                         |
| `plan`              | Runs read-only tools; file edits reach `canUseTool` callback | Review/audit loops                           |
| `acceptEdits`       | Auto-approves file edits and common filesystem commands      | Trusted development workflows                |
| `auto`              | Model classifier approves/denies tool calls                  | Autonomous agents with guardrails            |
| `dontAsk`           | Denies anything not in `allowedTools`                        | Locked-down headless agents                  |
| `bypassPermissions` | No permission prompts (unless explicit `ask` rule matches)   | **Only** in trusted CI with `--allowedTools` |

**Source:** [CLI Reference](https://code.claude.com/docs/en/cli-usage) -- `--permission-mode` flag documentation.

### Never Store Secrets in Loop Prompts

```
# BAD -- secret in command history
/loop 5m curl -H "Authorization: Bearer sk-abc123" https://api.example.com/status

# GOOD -- use environment variables
/loop 5m check the API status using the configured auth
```

The agent can read environment variables through MCP server configurations or shell access without embedding secrets in the prompt text.

---

## 8. Quick Reference

```
# Start a loop
/loop 5m <prompt>

# Loop a slash command
/loop 1h /my-custom-command

# Stop all loops
# Close the session or use Ctrl+C

# Non-interactive equivalent for cron
claude -p "prompt" --max-turns 10 --output-format json

# Background agent (persists beyond interactive session)
claude --bg "monitor the deploy"

# Background shell command
claude --bg --exec 'npm test'
```

---

## Sources & Verification

| Claim                                             | Source                                                     | Confidence |
| ------------------------------------------------- | ---------------------------------------------------------- | ---------- |
| `/loop` syntax and interval formats               | CHANGELOG v2.1.71                                          | High       |
| Session-scoped lifecycle                          | CHANGELOG v2.1.71 + observed behavior                      | High       |
| `-p` flag for non-interactive mode                | [CLI Reference](https://code.claude.com/docs/en/cli-usage) | High       |
| `--allowedTools` permission syntax                | [CLI Reference](https://code.claude.com/docs/en/cli-usage) | High       |
| `--permission-mode` options (6 modes)             | [CLI Reference](https://code.claude.com/docs/en/cli-usage) | High       |
| `--max-turns` flag                                | [CLI Reference](https://code.claude.com/docs/en/cli-usage) | High       |
| `--output-format json`                            | [CLI Reference](https://code.claude.com/docs/en/cli-usage) | High       |
| `--bg` background agents                          | [CLI Reference](https://code.claude.com/docs/en/cli-usage) | High       |
| `claude agents` / `claude attach` / `claude logs` | [CLI Reference](https://code.claude.com/docs/en/cli-usage) | High       |
| `--effort` levels (low/medium/high/xhigh/max)     | [CLI Reference](https://code.claude.com/docs/en/cli-usage) | High       |
| `--bare` / `--safe-mode` flags                    | [CLI Reference](https://code.claude.com/docs/en/cli-usage) | High       |
| `--tools` flag for restricting built-in tools     | [CLI Reference](https://code.claude.com/docs/en/cli-usage) | High       |
| `--disallowedTools` deny rules                    | [CLI Reference](https://code.claude.com/docs/en/cli-usage) | High       |
| `--fallback-model` comma-separated chains         | [CLI Reference](https://code.claude.com/docs/en/cli-usage) | High       |
| System prompt flags (4 variants)                  | [CLI Reference](https://code.claude.com/docs/en/cli-usage) | High       |
| Cron scheduling approach                          | General best practice, CLI flags verified                  | Medium     |
| GitHub Actions approach                           | General best practice, CLI flags verified                  | Medium     |
