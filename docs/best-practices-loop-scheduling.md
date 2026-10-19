---
title: "Best Practices: /loop Command & Scheduling in Claude Code"
source_url: "https://code.claude.com/docs/en/cli-usage"
source_type: "manual"
fetched_at: "2026-10-19T00:00:00Z"
category: "claude-code"
---

# Best Practices: `/loop` Command & Scheduling in Claude Code

> **Documentation Status:** The `/loop` command was introduced in Claude Code v2.1.71 (see [CHANGELOG](../claude-code/CHANGELOG.md)). It is now documented on its own page, [Run prompts on a schedule](https://code.claude.com/docs/en/scheduled-tasks), and listed in the [CLI Reference](https://code.claude.com/docs/en/cli-usage). The guidance below is synthesized from those pages, changelog entries, and observed behavior.

---

## 1. What Is `/loop`?

`/loop` is a bundled skill in Claude Code's interactive (REPL) mode that runs a prompt or a skill repeatedly while the session stays open. Both the interval and the prompt are optional:

```
/loop [interval] [prompt or /skill]
```

| What you provide          | Example                     | What happens                                                                 |
| ------------------------- | --------------------------- | ---------------------------------------------------------------------------- |
| Interval and prompt       | `/loop 5m check the deploy` | Prompt runs on a fixed cron schedule                                         |
| Prompt only               | `/loop check the deploy`    | Claude picks the delay (1 minute to 1 hour) after each iteration and explains why |
| Interval only, or nothing | `/loop`                     | Built-in maintenance prompt (or your `loop.md`) runs                         |

### Interval Format

| Suffix | Meaning | Example                               |
| ------ | ------- | ------------------------------------- |
| `s`    | Seconds (rounded up to whole minutes) | `/loop 90s check the build` |
| `m`    | Minutes | `/loop 5m check the deploy`           |
| `h`    | Hours   | `/loop 1h summarize git log`          |
| `d`    | Days    | `/loop 1d run /update-anthropic-docs` |

The interval can lead as a bare token (`30m`) or trail as a clause (`every 2 hours`). Claude converts it to a cron expression; intervals that don't map to a clean cron step (e.g., `7m`, `90m`) are rounded to the nearest one that does, and Claude tells you what it picked.

### Built-in Maintenance Prompt and `loop.md`

With no prompt, each iteration: continues unfinished work from the conversation; tends to the current branch's PR (review comments, failed CI, merge conflicts); then runs cleanup passes (bug hunts, simplification). It doesn't start new initiatives, and irreversible actions (push, delete) proceed only when they continue something already authorized.

Replace it with your own default by creating `.claude/loop.md` (project, takes precedence) or `~/.claude/loop.md` (user). It's plain Markdown, re-read every iteration, truncated beyond 25,000 bytes, and ignored when you pass a prompt on the command line.

### What Runs as a Skill

A scheduled fire only executes skills Claude is allowed to invoke on its own (e.g., `/loop 20m /review-pr 1234`). These reach Claude as plain text instead: built-in commands (`/permissions`, `/model`, `/clear`), skills with `disable-model-invocation: true` (including bundled `/verify`), skills withheld by `skillOverrides` or a `Skill` deny rule, and MCP prompts such as `/mcp__github__list_prs`.

**Source:** CHANGELOG v2.1.71; [Run prompts on a schedule](https://code.claude.com/docs/en/scheduled-tasks)

---

## 2. Key Characteristics

### Session-Scoped Lifecycle

Scheduled tasks fire **only** while Claude Code is running and idle -- between your turns, never mid-response. Closing the terminal or letting the session exit stops them firing (backgrounding the session carries `/loop` tasks over to a background session). There is no catch-up: a fire missed while Claude was busy runs once when it becomes idle.

**Implication:** `/loop` is ideal for _monitor-while-I-work_ tasks, not for 24/7 automation.

### Seven-Day Expiry

Recurring tasks expire 7 days after creation: they fire one final time, then delete themselves. Cancel and recreate before expiry, or use Routines / Desktop scheduled tasks for durable scheduling.

### Jitter

Recurring tasks run late by up to half the gap to the next run, capped at 30 minutes (every 10 min: 0-5 min late; every 30 min: 0-15; hourly or less often: 0-30). Exception: `*/5 * * * *` (what `/loop 5m` creates) starts 4 min 45 s after the previous run, to stay inside the 5-minute prompt cache. One-shot tasks scheduled at `:00` or `:30` run up to 90 seconds early -- pick an off-minute like `3 9 * * *` when timing matters. `CronCreate`/`CronList` output shows `next run` times (v2.1.299+). All times use your local timezone.

### Runs Inside the Agent Context

Each loop iteration executes within the same Claude Code agent context. This means:

- The agent retains conversation memory across iterations
- It can reference files, tools, and MCP servers configured for the session
- Each iteration consumes context window -- very frequent loops on large tasks can exhaust the window

### Limited Persistence

On `claude --resume` / `--continue`, Claude Code restores tasks scheduled with `CronCreate`, except expired recurring tasks and one-shot tasks whose time has passed. A self-paced `/loop` (no interval) is **not** restored -- run `/loop` again. Background Bash and monitor tasks are never restored. With feature-flag fetching off, tasks you ask to keep across sessions are stored in the project's `.claude/scheduled_tasks.json` (errors if `.claude` or the file is a symlink) and only run in the folder where they were created. For scheduling independent of any session, see Section 5.

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

### 3.5 Prefer Self-Paced Loops or Monitor for Event-Like Polling

Omit the interval (`/loop check whether CI passed and address any review comments`) to let Claude wait longer once things go quiet. Where the Monitor tool is available, Claude may stream a background script's output instead of polling, which is usually more token-efficient. To react to pushed events instead of polling, use Channels; to keep working toward a condition turn after turn, use `/goal`.

### 3.6 Pair With `--allowedTools` in Automation

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

Cron has one-minute granularity, so seconds are rounded up to the nearest minute anyway; very short intervals also create excessive context usage and provide little value for most tasks.

---

## 5. The Three Scheduling Tiers

`/loop` occupies the first tier in a progression of scheduling approaches:

| Tier | Tool                  | Scope   | Persistence               | Best For                      |
| ---- | --------------------- | ------- | ------------------------- | ----------------------------- |
| 1    | `/loop`               | Session | Restored on `--resume` (with exceptions); 7-day expiry | Active monitoring during work |
| 2    | System cron / launchd, or Desktop scheduled tasks | Machine | Survives reboots          | Local recurring tasks         |
| 3    | Routines (cloud) or GitHub Actions / CI | Cloud   | Always-on                 | Team-wide automation          |

Official comparison of Claude Code's built-in options:

|                            | Cloud (Routines)                 | Desktop scheduled tasks         | `/loop`                         |
| -------------------------- | -------------------------------- | ------------------------------- | ------------------------------- |
| Runs on                    | Cloud, Anthropic-managed by default | Your machine                 | Your machine                    |
| Requires machine on        | No                               | Yes                             | Yes                             |
| Requires open session      | No                               | No                              | Yes                             |
| Access to local files      | No (fresh clone)                 | Yes                             | Yes                             |
| MCP servers                | Connectors configured per task   | Config files and connectors     | Inherits from session           |
| Permission prompts         | No (runs autonomously)           | Configurable per task           | Inherits from session           |
| Customizable schedule      | Via `/schedule` in the CLI       | Yes                             | Yes                             |
| Minimum interval           | 1 hour                           | 1 minute                        | 1 minute                        |

Routines can also be triggered via API call or GitHub events.

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
| `--permission-mode`                        | Control what the agent can do without human approval (options: `default`, `acceptEdits`, `plan`, `auto`, `dontAsk`, `bypassPermissions`) |
| `--dangerously-skip-permissions`           | Equivalent to `--permission-mode bypassPermissions` -- **use with extreme caution**                                                      |
| `--allowedTools "Tool(args)"`              | Restrict which tools the agent may use; supports pattern matching                                                                        |
| `--disallowedTools "Tool(args)"`           | Deny rules; a bare tool name removes tools from context, a scoped rule denies only matching calls                                        |
| `--tools "Bash,Edit,Read"`                 | Restrict which built-in tools Claude can use (use `""` to disable all, `"default"` for all)                                              |
| `--max-budget-usd N`                       | Maximum dollar amount to spend on API calls before stopping                                                                              |
| `--fallback-model <model>`                 | Enable automatic fallback model(s) when default is overloaded; accepts comma-separated list                                              |
| `--effort <level>`                         | Set effort level: `low`, `medium`, `high`, `xhigh`, `max`, or `ultracode` (`xhigh` with ultracode on; v2.1.203+); available levels depend on model |
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

# Self-paced loop (Claude picks the interval)
/loop <prompt>

# Built-in maintenance prompt (or .claude/loop.md)
/loop

# Loop a skill
/loop 1h /my-custom-command

# One-shot reminder (natural language)
remind me at 3pm to push the release branch

# List / cancel tasks (CronList / CronDelete; 8-char IDs, max 50 per session)
what scheduled tasks do I have?
cancel the deploy check job

# Stop a self-paced loop while waiting: press Esc
# Fixed-interval loops: cancel the task, or wait for the 7-day expiry
# Disable the scheduler entirely
CLAUDE_CODE_DISABLE_CRON=1 claude

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
| `/loop` syntax and interval formats               | CHANGELOG v2.1.71; [Scheduled tasks](https://code.claude.com/docs/en/scheduled-tasks) | High       |
| Session-scoped lifecycle, resume restore, 7-day expiry, jitter | [Scheduled tasks](https://code.claude.com/docs/en/scheduled-tasks) | High       |
| `loop.md`, maintenance prompt, self-paced loops   | [Scheduled tasks](https://code.claude.com/docs/en/scheduled-tasks) | High       |
| Cloud / Desktop / `/loop` comparison              | [Scheduled tasks](https://code.claude.com/docs/en/scheduled-tasks) | High       |
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
