---
title: "Claude Code Scheduled Tasks"
source_url: "https://code.claude.com/docs/en/scheduled-tasks"
source_type: "web-extracted"
fetched_at: "2026-07-06T00:00:00Z"
category: "claude-code"
---

# Run prompts on a schedule

> Scheduled tasks require Claude Code v2.1.72 or later. Some features noted below require v2.1.196+.

Use /loop and the cron scheduling tools to run prompts repeatedly, poll for status, or set one-time reminders within a Claude Code session.

Scheduled tasks let Claude re-run a prompt automatically on an interval. Use them to poll a deployment, babysit a PR, check back on a long-running build, or remind yourself to do something later in the session.

## Choosing a scheduling approach

| Capability | [Routines](/en/routines) (Cloud) | Desktop scheduled tasks | /loop (session) |
|:--|:--|:--|:--|
| Survives restart | Yes | Yes | No (restored on `--resume` if unexpired) |
| Requires active terminal | No | No | Yes |
| Durable across machines | Yes | No | No |
| Max lifetime | Unlimited | Unlimited | 7 days |
| Setup | Web dashboard | Desktop UI | Inline command |

For durable scheduling that survives restarts and runs without an active terminal session, see [Routines](/en/routines) for cloud-based scheduling or [Desktop scheduled tasks](/en/desktop#schedule-recurring-tasks) for a graphical setup flow. For goal-oriented long-running work, see [/goal](/en/goal). For multi-session coordination, see [Channels](/en/channels).

## Schedule a recurring prompt with /loop

The `/loop` bundled skill is the quickest way to schedule a recurring prompt. It supports three modes depending on what you provide.

### Mode 1: Interval + prompt

Pass an interval and a prompt, and Claude sets up a cron job that fires in the background while the session stays open.

```
/loop 5m check if the deployment finished and tell me what happened
```

Claude parses the interval, converts it to a cron expression, schedules the job, and confirms the cadence and job ID.

### Mode 2: Prompt only (dynamic interval)

Omit the interval and provide only a prompt. Claude runs the prompt immediately, then picks a delay between 1 minute and 1 hour for the next iteration based on what it observes.

```
/loop check the build
```

Claude adjusts the interval dynamically each cycle. A build that is progressing quickly might be re-checked every 2 minutes; a stable deployment might be re-checked every 30 minutes. The delay is chosen after each run based on the output.

### Mode 3: Bare /loop (built-in maintenance prompt)

Run `/loop` with no interval and no prompt to activate the built-in maintenance loop. Claude uses a default prompt that:

- Continues any unfinished work in the current session
- Tends to open pull requests (responds to review comments, updates branches)
- Runs cleanup tasks (lint fixes, dependency updates, stale branch pruning)

```
/loop
```

You can also pass just an interval to use the maintenance prompt on a fixed schedule:

```
/loop 15m
```

#### Customizing the default prompt with loop.md

Override the built-in maintenance prompt by creating a `loop.md` file:

- **Project-level:** `.claude/loop.md` in your repository root
- **User-level:** `~/.claude/loop.md`

The project-level file takes precedence. When a `loop.md` file exists, bare `/loop` and interval-only `/loop 15m` use its contents as the prompt instead of the built-in default.

### Interval syntax

Intervals are optional. You can lead with them, trail with them, or leave them out entirely.

| Form | Example | Parsed interval |
|:--|:--|:--|
| Leading token | `/loop 30m check the build` | every 30 minutes |
| Trailing `every` clause | `/loop check the build every 2 hours` | every 2 hours |
| Interval only | `/loop 15m` | every 15 minutes (maintenance prompt) |
| No interval, with prompt | `/loop check the build` | dynamic (1 min to 1 hour) |
| Bare | `/loop` | dynamic (maintenance prompt) |

Supported units are `s` for seconds, `m` for minutes, `h` for hours, and `d` for days. Seconds are rounded up to the nearest minute since cron has one-minute granularity. Intervals that don't divide evenly into their unit, such as `7m` or `90m`, are rounded to the nearest clean interval and Claude tells you what it picked.

### Loop over skills

Starting in v2.1.196, the scheduled prompt can invoke a skill. This is useful for re-running a workflow you've already packaged.

```
/loop 20m /review-pr 1234
```

Each time the job fires, Claude runs `/review-pr 1234` as if you had typed it.

Not all skills are allowed inside a loop. Skills that require interactive input or that modify loop scheduling themselves are restricted. Claude tells you at scheduling time if a skill is not supported.

### Stopping a loop

Press **Esc** to stop the current loop. Claude cancels the scheduled task and confirms it has been removed.

You can also ask Claude in natural language:

```
cancel the deploy check job
```

## Set a one-time reminder

For one-shot reminders, describe what you want in natural language instead of using `/loop`. Claude schedules a single-fire task that deletes itself after running.

```
remind me at 3pm to push the release branch
```

```
in 45 minutes, check whether the integration tests passed
```

Claude pins the fire time to a specific minute and hour using a cron expression and confirms when it will fire.

## Manage scheduled tasks

Ask Claude in natural language to list or cancel tasks, or reference the underlying tools directly.

```
what scheduled tasks do I have?
```

Under the hood, Claude uses these tools:

| Tool | Purpose |
|:--|:--|
| `CronCreate` | Schedule a new task. Accepts a 5-field cron expression, the prompt to run, and whether it recurs or fires once. |
| `CronList` | List all scheduled tasks with their IDs, schedules, and prompts. |
| `CronDelete` | Cancel a task by ID. |

Each scheduled task has an 8-character ID you can pass to `CronDelete`. A session can hold up to 50 scheduled tasks at once.

## How scheduled tasks run

The scheduler checks every second for due tasks and enqueues them at low priority. A scheduled prompt fires between your turns, not while Claude is mid-response. If Claude is busy when a task comes due, the prompt waits until the current turn ends.

All times are interpreted in your local timezone. A cron expression like `0 9 * * *` means 9am wherever you're running Claude Code, not UTC.

### Jitter

To avoid every session hitting the API at the same wall-clock moment, the scheduler adds a small deterministic offset to fire times:

* Recurring tasks fire up to 30 minutes late. An hourly job might fire anywhere from `:00` to `:30`.
* One-shot tasks scheduled for the top or bottom of the hour fire up to 90 seconds early.

The offset is derived from the task ID, so the same task always gets the same offset. If exact timing matters, pick a minute that is not `:00` or `:30`, for example `3 9 * * *` instead of `0 9 * * *`, and the one-shot jitter will not apply.

### Seven-day expiry

Recurring tasks automatically expire 7 days after creation. The task fires one final time, then deletes itself. This bounds how long a forgotten loop can run. If you need a recurring task to last longer, cancel and recreate it before it expires, or use [Routines](/en/routines) for durable cloud-based scheduling.

### Persistence across resume

Tasks are restored when you restart a session with `--resume`, provided they have not yet expired. The scheduler picks up where it left off using the original creation timestamp.

### Backgrounding

If you background the Claude Code session (for example, by sending it to the background in your terminal), `/loop` tasks continue to fire. They carry over as long as the process is running.

## Cron expression reference

`CronCreate` accepts standard 5-field cron expressions: `minute hour day-of-month month day-of-week`. All fields support wildcards (`*`), single values (`5`), steps (`*/15`), ranges (`1-5`), and comma-separated lists (`1,15,30`).

| Example | Meaning |
|:--|:--|
| `*/5 * * * *` | Every 5 minutes |
| `0 * * * *` | Every hour on the hour |
| `7 * * * *` | Every hour at 7 minutes past |
| `0 9 * * *` | Every day at 9am local |
| `0 9 * * 1-5` | Weekdays at 9am local |
| `30 14 15 3 *` | March 15 at 2:30pm local |

Day-of-week uses `0` or `7` for Sunday through `6` for Saturday. Extended syntax like `L`, `W`, `?`, and name aliases such as `MON` or `JAN` is not supported.

When both day-of-month and day-of-week are constrained, a date matches if either field matches. This follows standard vixie-cron semantics.

## Disable scheduled tasks

Set `CLAUDE_CODE_DISABLE_CRON=1` in your environment to disable the scheduler entirely. The cron tools and `/loop` become unavailable, and any already-scheduled tasks stop firing.

## Limitations

Session-scoped scheduling has inherent constraints:

* Tasks only fire while Claude Code is running and idle. Closing the terminal or letting the session exit cancels everything (unless resumed with `--resume` before expiry).
* No catch-up for missed fires. If a task's scheduled time passes while Claude is busy on a long-running request, it fires once when Claude becomes idle, not once per missed interval.
* Not all skills can be invoked inside a loop. Skills requiring interactive input or modifying loop scheduling are restricted (v2.1.196+).

For cron-driven automation that needs to run unattended, use [Routines](/en/routines) for cloud-based durable scheduling, a GitHub Actions workflow with a `schedule` trigger, or Desktop scheduled tasks if you want a graphical setup flow.
