---
title: "Boris Cherny - Personal Claude Code Setup (Jan 2, 2026)"
source_url: "https://x.com/bcherny/status/2007179832300581177"
source_type: "web-extracted"
fetched_at: "2026-03-22T00:00:00Z"
category: "claude-code"
---

# Claude Code Setup Guide — Boris Cherny (Jan 2, 2026)

**Author:** Boris Cherny (@bcherny), Creator of Claude Code
**Source:** [Thread on X](https://x.com/bcherny/status/2007179832300581177) | [ThreadReaderApp](https://threadreaderapp.com/thread/2007179832300581177)
**Context:** Boris's personal setup. "My setup might be surprisingly vanilla! Claude Code works great out of the box, so I personally don't customize it much."

---

## 1. Five Parallel Terminal Sessions

Run 5 Claudes in parallel in the terminal. Number tabs 1-5, and use system notifications to know when a Claude needs input.

See: [iTerm2 system notifications](https://code.claude.com/docs/en/terminal-config#iterm-2-system-notifications)

## 2. Multi-Platform Parallelism

Also run 5-10 Claudes on [claude.ai/code](https://claude.ai/code) in parallel with local Claudes.

- Hand off local sessions to web (using `&`)
- Manually kick off sessions in Chrome
- Use `--teleport` to move back and forth between local and web
- Start sessions from the Claude iOS app every morning and throughout the day

## 3. Model Selection: Opus 4.5 with Thinking

> "It's the best coding model I've ever used, and even though it's bigger & slower than Sonnet, since you have to steer it less and it's better at tool use, it is almost always faster than using a smaller model in the end."

## 4. Shared Team CLAUDE.md

- The team shares a single CLAUDE.md for the Claude Code repo, checked into git
- The whole team contributes multiple times a week
- **Anytime they see Claude do something incorrectly, they add it to the CLAUDE.md** so Claude knows not to do it next time
- Other teams maintain their own CLAUDE.md files; each team keeps theirs up to date

## 5. Code Review with @claude

During code review, tag `@claude` on coworkers' PRs to add something to the CLAUDE.md as part of the PR. Uses the Claude Code GitHub Action (`/install-github-action`). It's their version of @danshipper's "Compounding Engineering."

## 6. Plan Mode First

Most sessions start in Plan mode (`Shift+Tab` twice). If the goal is to write a Pull Request:

1. Use Plan mode
2. Go back and forth with Claude until the plan looks good
3. Switch into auto-accept edits mode
4. Claude can usually 1-shot it from there

> "A good plan is really important!"

## 7. Slash Commands for Inner Loops

Use slash commands for every "inner loop" workflow done many times a day. This saves from repeated prompting, and makes it so Claude can use these workflows too. Commands are checked into git in `.claude/commands/`.

**Example:** `/commit-push-pr` — used dozens of times every day. The command uses inline bash to pre-compute git status and other info to make it run quickly and avoid back-and-forth.

See: [Bash command execution in slash commands](https://code.claude.com/docs/en/slash-commands#bash-command-execution)

## 8. Subagents for Common Workflows

Regular use of specialized subagents:
- **code-simplifier** — simplifies code after Claude is done working
- **verify-app** — detailed instructions for testing Claude Code end to end

> "Similar to slash commands, I think of subagents as automating the most common workflows that I do for most PRs."

See: [Sub-agents](https://code.claude.com/docs/en/sub-agents)

## 9. PostToolUse Hook for Formatting

Uses a PostToolUse hook to format Claude's code. Claude usually generates well-formatted code out of the box, and the hook handles the last 10% to avoid formatting errors in CI later.

## 10. Permissions Without --dangerously-skip-permissions

Instead of using `--dangerously-skip-permissions`, uses `/permissions` to pre-allow common bash commands known to be safe. Most of these are checked into `.claude/settings.json` and shared with the team.

## 11. Tool Integration via MCP and CLI

Claude Code uses all tools for him:
- Searches and posts to **Slack** (via MCP server)
- Runs **BigQuery** queries to answer analytics questions (using `bq` CLI)
- Grabs error logs from **Sentry**
- The Slack MCP configuration is checked into `.mcp.json` and shared with the team

## 12. Long-Running Task Strategies

For very long-running tasks:

a. Prompt Claude to verify its work with a **background agent** when it's done

b. Use an **agent Stop hook** to do that more deterministically

c. Use the **ralph-wiggum plugin** (originally dreamt up by @GeoffreyHuntley)

Also use either `--permission-mode=dontAsk` or `--dangerously-skip-permissions` **in a sandbox** to avoid permission prompts, so Claude can cook without being blocked.

See: [Ralph Wiggum plugin](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/ralph-wiggum) | [Hooks guide](https://code.claude.com/docs/en/hooks-guide)

## 13. Give Claude a Way to Verify Its Work

> "Probably the most important thing to get great results out of Claude Code — give Claude a way to verify its work. If Claude has that feedback loop, it will 2-3x the quality of the final result."

Claude tests every single change landed to claude.ai/code using the **Claude Chrome extension**. It opens a browser, tests the UI, and iterates until the code works and the UX feels good.

Verification looks different for each domain:
- Running a bash command
- Running a test suite
- Testing the app in a browser or phone simulator

> "Make sure to invest in making this rock-solid."

See: [Chrome extension](https://code.claude.com/docs/en/chrome)
