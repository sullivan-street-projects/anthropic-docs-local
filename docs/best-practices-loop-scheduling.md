---
title: "Best Practices: /loop Command & Scheduling in Claude Code"
source_url: "https://code.claude.com/docs/en/cli-usage"
source_type: "manual"
fetched_at: "2026-11-16T00:00:00Z"
category: "claude-code"
---

# Best Practices: `/loop` Command & Scheduling in Claude Code

> **Documentation Status:** The `/loop` command was introduced in Claude Code v2.1.71 (see [CHANGELOG](../claude-code/CHANGELOG.md)). It is documented on the official [Run prompts on a schedule](https://code.claude.com/docs/en/scheduled-tasks) page and listed in the [CLI Reference](https://code.claude.com/docs/en/cli-usage) and [Interactive Mode](https://code.claude.com/docs/en/interactive-mode) pages. The guidance below is synthesized from those pages, changelog entries, and observed behavior.

---

## 1. What Is `/loop`?

`/loop` is a [bundled skill](https://code.claude.com/docs/en/commands) in Claude Code's interactive (REPL) mode that runs a prompt (or a skill) on repeat within the current session while it stays open. Both the interval and the prompt are optional, and what you provide determines how the loop behaves.

```
/loop [interval] [prompt or /skill]
```

| What you provide          | Example                     | What happens                                                                          |
| ------------------------- | --------------------------- | ------------------------------------------------------------------------------------- |
| Interval and prompt       | `/loop 5m check the deploy` | Your prompt runs on a fixed (cron) schedule                                           |
| Prompt only               | `/loop check the deploy`    | Your prompt runs at an interval Claude chooses each iteration                          |
| Interval only, or nothing | `/loop`                     | The built-in maintenance prompt runs, or your `loop.md` if one exists                  |

### Interval Format

The interval can lead the prompt as a bare token like `30m`, or trail it as a clause like `every 2 hours`.

| Suffix | Meaning | Example                               |
| ------ | ------- | ------------------------------------- |
| `s`    | Seconds | `/loop 90s check the build` (rounded up to whole minutes) |
| `m`    | Minutes | `/loop 5m check the deploy`           |
| `h`    | Hours   | `/loop 1h summarize git log`          |
| `d`    | Days    | `/loop 1d run /update-anthropic-docs` |

- Seconds are rounded up to the nearest minute, since cron has one-minute granularity.
- Intervals that don't map to a clean cron step (such as `7m` or `90m`) are rounded to the nearest interval that does, and Claude tells you what it picked.
- Claude converts the interval to a cron expression, schedules the job, and confirms the cadence and job ID.

**Source:** CHANGELOG v2.1.71 -- _"Added `/loop` command to run a prompt or slash command on a recurring interval (e.g. `/loop 5m check the deploy`)"_; [Run prompts on a schedule](https://code.claude.com/docs/en/scheduled-tasks).

### Self-Paced Loops (No Interval)

When you omit the interval, Claude picks a delay between one minute and one hour after each iteration based on what it observed (short waits while a build is finishing or a PR is active, longer waits when nothing is pending). The chosen delay and the reason are printed at the end of each iteration. Claude can end a self-paced loop on its own when the task is complete by calling the `ScheduleWakeup` tool with `stop: true`. If an iteration ends without rescheduling or stopping, Claude Code schedules one fallback wakeup about 20 minutes later and ends the loop if that iteration doesn't reschedule either.

Where the [Monitor tool](https://code.claude.com/docs/en/tools-reference) is available, Claude may use it instead for a dynamic schedule: it streams each output line of a background script back, avoiding polling and often being more token-efficient.

### Built-In Maintenance Prompt and `loop.md`

A bare `/loop` (or `/loop 15m` with no prompt) runs a built-in maintenance prompt that, in order: continues unfinished work from the conversation; tends to the current branch's PR (review comments, failed CI, merge conflicts); then runs cleanup passes (bug hunts, simplification) when nothing else is pending. Each run goes through the session's permission checks before pushing or deleting anything.

To replace it, create a `loop.md` (plain Markdown, written as if typing the `/loop` prompt). Claude uses the first one it finds:

| Path                | Scope                                                           |
| ------------------- | --------------------------------------------------------------- |
| `.claude/loop.md`   | Project-level. Takes precedence when both exist                  |
| `~/.claude/loop.md` | User-level. Applies in any project that doesn't define its own   |

`loop.md` is ignored whenever you supply a prompt on the command line. Edits take effect on the next iteration; content beyond 25,000 bytes is truncated.

> On Amazon Bedrock, Claude Platform on AWS, Google Cloud's Agent Platform, and Microsoft Foundry, or with feature-flag fetching turned off, dynamic intervals and the maintenance prompt require Claude Code v2.1.248 or later.

### Skills as the Loop Prompt

You can pass a skill, e.g. `/loop 20m /review-pr 1234`. A scheduled fire only runs skills Claude is allowed to invoke on its own. These reach Claude as plain text instead of executing: built-in commands (`/permissions`, `/model`, `/clear`), skills marked `disable-model-invocation: true` (including bundled `/verify`), skills withheld by `skillOverrides` or a `Skill` deny rule, and MCP prompts such as `/mcp__github__list_prs`.

---

## 2. Key Characteristics

### Session-Scoped Lifecycle

Tasks only fire while Claude Code is running and **idle**. Closing the terminal or letting the session exit stops them. [Backgrounding the session](https://code.claude.com/docs/en/agent-view) carries `/loop` tasks over to a background session, which keeps running without a terminal.

**Implication:** `/loop` is ideal for _monitor-while-I-work_ tasks, not for 24/7 automation.

### How Tasks Fire

- The scheduler checks every second and enqueues due tasks at low priority. A scheduled prompt fires **between your turns**, never mid-response; if Claude is busy, it waits for the current turn to end.
- **No catch-up:** if fires are missed while Claude is busy, the task fires once when idle, not once per missed interval.
- All times use your **local timezone** (`0 9 * * *` = 9am local, not UTC).
- A session can hold up to **50 scheduled tasks**; each has an 8-character ID.

### Jitter

To avoid every session hitting the API at once, Claude Code shifts run times. Recurring tasks run late by up to half the gap to the next run, capped at 30 minutes; a `*/5 * * * *` task (what `/loop 5m` creates) is the exception and starts 4 minutes 45 seconds after the previous run so the prompt cache hasn't expired.

| Schedule                                | When each run starts                         |
| --------------------------------------- | -------------------------------------------- |
| Every 5 minutes (`*/5 * * * *`)         | 4 min 45 s after the previous run            |
| Every 10 minutes                        | 0 to 5 minutes late                          |
| Every 30 minutes                        | 0 to 15 minutes late                         |
| Every hour, or less often (e.g. daily)  | 0 to 30 minutes late                         |

One-shot tasks scheduled for `:00` or `:30` run up to 90 seconds early; schedule off the hour (`3 9 * * *` instead of `0 9 * * *`) when timing matters. The `CronCreate`/`CronList` rows show `next run` times (requires v2.1.299+).

### Seven-Day Expiry

Recurring tasks automatically expire **7 days after creation**: the task fires one final time, then deletes itself. To run longer, cancel and recreate it before expiry, or use cloud/Desktop scheduled tasks.

### Persistence on Resume

When you resume with `claude --resume` or `claude --continue`, Claude Code restores tasks scheduled with `CronCreate`, except expired recurring tasks and one-shot tasks whose time has passed. A **self-paced** `/loop` is not restored; run `/loop` again. Restored recurring tasks don't fire for missed runs; their next run is the first one due after resuming (with jitter). Background Bash commands and monitors are not restarted. Note `--continue` skips sessions whose first prompt was `/loop`.

With feature-flag fetching off, a task you asked to keep across sessions is stored in the project's `.claude/scheduled_tasks.json` (errors if `.claude` or that file is a symlink); a saved task runs only in the project folder where it was created.

### Runs Inside the Agent Context

Each loop iteration executes within the same Claude Code agent context. This means:

- The agent retains conversation memory across iterations
- It can reference files, tools, and MCP servers configured for the session (MCP servers and permission prompts are inherited from the session)
- Each iteration consumes context window -- very frequent loops on large tasks can exhaust the window

### Underlying Tools and Management

Ask Claude in natural language (`what scheduled tasks do I have?`, `cancel the deploy check job`) or reference the tools directly:

| Tool         | Purpose                                                                                         |
| ------------ | ----------------------------------------------------------------------------------------------- |
| `CronCreate` | Schedule a task: 5-field cron expression, the prompt, and whether it recurs or fires once       |
| `CronList`   | List tasks with IDs, schedules, next run times, and prompts                                     |
| `CronDelete` | Cancel a task by ID                                                                             |

For one-shot reminders, use natural language instead of `/loop` (e.g. `remind me at 3pm to push the release branch`); Claude schedules a single-fire task that deletes itself after running.

`CronCreate` accepts standard 5-field cron (`minute hour day-of-month month day-of-week`) with `*`, values, steps, ranges, and lists. Day-of-week is `0`/`7` = Sunday to `6` = Saturday. Extended syntax (`L`, `W`, `?`, `MON`, `JAN`) is not supported. When both day-of-month and day-of-week are constrained, a date matches if either matches (vixie-cron semantics).

Set `CLAUDE_CODE_DISABLE_CRON=1` to disable the scheduler entirely: `CronCreate` and `/loop` become unavailable and scheduled tasks stop firing.

### Stopping a Loop

- **Self-paced loop:** press `Esc` while it's waiting for the next iteration (or `Ctrl+C` while Claude is idle, except in an attached background session). A `Pending wakeup cancelled` notice confirms it.
- **Fixed-interval loop** (e.g. `/loop 5m`): ask Claude to cancel it (`cancel the deploy check loop`). `Esc` and `Ctrl+C` do **not** stop it. Uncancelled loops end after seven days.
- **Detach without stopping:** when attached to a background session and Claude is idle, press `Ctrl+C` twice on an empty prompt to detach; a waiting self-paced loop keeps running (requires v2.1.295+). Press `Esc` first to stop it instead.

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
| Documentation sync   | 1d (max 7-day expiry) | Upstream docs change infrequently           |

**Rule of thumb:** If the thing you're monitoring can't meaningfully change within the interval, you're polling too fast.

### 3.3 Combine With Slash Commands

`/loop` can invoke other slash commands, making it composable:

```
/loop 30m /update-anthropic-docs --check
```

This runs your custom update command every 30 minutes for as long as the session is open (up to the seven-day expiry). The skill must be one Claude is allowed to invoke on its own; skills with `disable-model-invocation: true` reach Claude as plain text.

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

### 4.3 Don't Expect Sub-Minute Intervals

The minimum `/loop` interval is 1 minute: seconds are rounded up to the nearest minute because cron has one-minute granularity. Very short intervals also create excessive context usage and provide little value for most tasks.

---

## 5. The Three Scheduling Tiers

`/loop` occupies the first tier in a progression of scheduling approaches:

| Tier | Tool                  | Scope   | Persistence                                          | Best For                      |
| ---- | --------------------- | ------- | ---------------------------------------------------- | ----------------------------- |
| 1    | `/loop`               | Session | Restored on `--resume` (with exceptions); 7-day expiry | Active monitoring during work |
| 2    | System cron / launchd | Machine | Survives reboots                                     | Local recurring tasks         |
| 3    | GitHub Actions / CI   | Cloud   | Always-on                                            | Team-wide automation          |

### Official Scheduling Options Compared

Claude Code itself offers three ways to schedule recurring or one-off work ([source](https://code.claude.com/docs/en/scheduled-tasks)):

|                            | [Cloud](https://code.claude.com/docs/en/routines) | [Desktop](https://code.claude.com/docs/en/desktop-scheduled-tasks) | `/loop`                                  |
| -------------------------- | ------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------- |
| Runs on                    | Cloud, Anthropic-managed by default               | Your machine                                                       | Your machine                             |
| Requires machine on        | No                                                | Yes                                                                | Yes                                      |
| Requires open session      | No                                                | No                                                                 | Yes                                      |
| Persistent across restarts | Yes                                               | Yes                                                                | Restored on `--resume`, with exceptions  |
| Access to local files      | No (fresh clone)                                  | Yes                                                                | Yes                                      |
| MCP servers                | Connectors configured per task                    | Config files and connectors                                        | Inherits from session                    |
| Permission prompts         | Auto mode by default                              | Configurable per task                                              | Inherits from session                    |
| Minimum interval           | 1 hour                                            | 1 minute when Claude sets it, 1 hour in the forms                  | 1 minute                                 |

Use **cloud tasks** for work that should run reliably without your machine, **Desktop tasks** when you need local files and tools, and **`/loop`** for quick polling during a session. For reacting to events instead of polling, see [Channels](https://code.claude.com/docs/en/channels); for keeping a session working toward a condition rather than on an interval, see [`/goal`](https://code.claude.com/docs/en/goal).

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
| `--permission-mode`                        | Control what the agent can do without human approval (options: `default`, `acceptEdits`, `plan`, `auto`, `dontAsk`, `bypassPermissions`, or `manual` as an alias for `default`, v2.1.200+) |
| `--dangerously-skip-permissions`           | Equivalent to `--permission-mode bypassPermissions` -- **use with extreme caution**                                                      |
| `--allowedTools "Tool(args)"`              | Restrict which tools the agent may use; supports pattern matching                                                                        |
| `--disallowedTools "Tool(args)"`           | Deny rules; a bare tool name removes tools from context, a scoped rule denies only matching calls                                        |
| `--tools "Bash,Edit,Read"`                 | Restrict which built-in tools Claude can use (use `""` to disable all, `"default"` for all)                                              |
| `--max-budget-usd N`                       | Stop once estimated API spend (client-side estimate, includes subagents) reaches this amount (print mode only)                           |
| `--fallback-model <model>`                 | Enable automatic fallback model(s) when default is overloaded; accepts comma-separated list                                              |
| `--effort <level>`                         | Set effort level: `low`, `medium`, `high`, `xhigh`, `max`, or `ultracode` (`xhigh` with ultracode on); available levels depend on model   |
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

# Self-paced loop (no interval)
/loop check whether CI passed and address any review comments

# Built-in maintenance prompt (or .claude/loop.md)
/loop

# One-shot reminder
remind me at 3pm to push the release branch

# List / cancel tasks
what scheduled tasks do I have?
cancel the deploy check loop

# Stop a self-paced loop: Esc while waiting
# Stop a fixed-interval loop: ask Claude to cancel it (Esc/Ctrl+C don't stop it)

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
| `/loop` syntax and interval formats (s/m/h/d)     | CHANGELOG v2.1.71 + [Scheduled tasks](https://code.claude.com/docs/en/scheduled-tasks) | High |
| Session-scoped lifecycle, resume, 7-day expiry    | [Scheduled tasks](https://code.claude.com/docs/en/scheduled-tasks) | High |
| Self-paced loops, maintenance prompt, `loop.md`   | [Scheduled tasks](https://code.claude.com/docs/en/scheduled-tasks) | High |
| Jitter, 50-task limit, `CronCreate`/`CronList`/`CronDelete` | [Scheduled tasks](https://code.claude.com/docs/en/scheduled-tasks) | High |
| Cloud vs Desktop vs `/loop` comparison            | [Scheduled tasks](https://code.claude.com/docs/en/scheduled-tasks) | High |
| `-p` flag for non-interactive mode                | [CLI Reference](https://code.claude.com/docs/en/cli-usage) | High       |
| `--allowedTools` permission syntax                | [CLI Reference](https://code.claude.com/docs/en/cli-usage) | High       |
| `--permission-mode` options (6 modes)             | [CLI Reference](https://code.claude.com/docs/en/cli-usage) | High       |
| `--max-turns` flag                                | [CLI Reference](https://code.claude.com/docs/en/cli-usage) | High       |
| `--output-format json`                            | [CLI Reference](https://code.claude.com/docs/en/cli-usage) | High       |
| `--bg` background agents                          | [CLI Reference](https://code.claude.com/docs/en/cli-usage) | High       |
| `claude agents` / `claude attach` / `claude logs` | [CLI Reference](https://code.claude.com/docs/en/cli-usage) | High       |
| `--effort` levels (low/medium/high/xhigh/max/ultracode) | [CLI Reference](https://code.claude.com/docs/en/cli-usage) | High       |
| `--bare` / `--safe-mode` flags                    | [CLI Reference](https://code.claude.com/docs/en/cli-usage) | High       |
| `--tools` flag for restricting built-in tools     | [CLI Reference](https://code.claude.com/docs/en/cli-usage) | High       |
| `--disallowedTools` deny rules                    | [CLI Reference](https://code.claude.com/docs/en/cli-usage) | High       |
| `--fallback-model` comma-separated chains         | [CLI Reference](https://code.claude.com/docs/en/cli-usage) | High       |
| System prompt flags (4 variants)                  | [CLI Reference](https://code.claude.com/docs/en/cli-usage) | High       |
| Cron scheduling approach                          | General best practice, CLI flags verified                  | Medium     |
| GitHub Actions approach                           | General best practice, CLI flags verified                  | Medium     |
