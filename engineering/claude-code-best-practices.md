---
title: "Claude Code: Best Practices for Agentic Coding"
source_url: "https://www.anthropic.com/engineering/claude-code-best-practices"
source_type: "web-extracted"
fetched_at: "2026-08-02T00:00:00Z"
category: "engineering"
---

# Claude Code: Best Practices for Agentic Coding

> Note: `anthropic.com/engineering/claude-code-best-practices` now redirects (308) to the maintained docs version at `code.claude.com/docs/en/best-practices`. This document reflects that current content.

Claude Code is an agentic coding environment. Unlike a chatbot that answers questions and waits, Claude Code can read files, run commands, make changes, and autonomously work through problems while you watch, redirect, or step away.

The central constraint behind most best practices: **Claude's context window fills up fast, and performance degrades as it fills.** The context window holds the entire conversation — every message, every file read, every command output. Managing it is the single most important skill.

## Give Claude a Way to Verify Its Work

Give Claude a check it can run — tests, a build, a screenshot to compare. It's the difference between a session you watch and one you walk away from. Without a check, "looks done" is the only signal, and you become the verification loop.

A check is anything returning a readable pass/fail signal: a test suite, a build exit code, a linter, a script that diffs output against a fixture, or a browser screenshot compared against a design.

Verification strategies:

- **Provide verification criteria** — give explicit example test cases and tell Claude to run the tests after implementing.
- **Verify UI changes visually** — paste a screenshot, have Claude implement, then screenshot the result and compare/fix differences.
- **Address root causes, not symptoms** — paste the actual error, fix it, verify the build succeeds, and don't suppress the error.

How hard the check gates the stop:

- **In one prompt:** ask Claude to run the check and iterate in the same message.
- **Across a session:** set the check as a `/goal` condition; a separate evaluator re-checks after every turn.
- **As a deterministic gate:** a Stop hook runs your check as a script and blocks the turn from ending until it passes (overridden after 8 consecutive blocks).
- **By a second opinion:** a verification subagent or dynamic workflow has a fresh model try to refute the result.

Have Claude show evidence (test output, the command and its return, a screenshot) rather than asserting success.

## Explore First, Then Plan, Then Code

Separate research and planning from implementation to avoid solving the wrong problem. Use plan mode. The recommended four-phase workflow:

1. **Explore** — Enter plan mode. Claude reads files and answers questions without making changes.
2. **Plan** — Ask Claude to create a detailed implementation plan. Press `Ctrl+G` to open the plan in your editor for direct editing.
3. **Implement** — Switch out of plan mode and let Claude code, verifying against its plan and running the test suite.
4. **Commit** — Ask Claude to commit with a descriptive message and open a PR.

Plan mode adds overhead. For small, clear-scope tasks (typo, log line, variable rename), ask Claude to do it directly. Planning helps most when the approach is uncertain, the change spans multiple files, or you're unfamiliar with the code. If you could describe the diff in one sentence, skip the plan.

## Provide Specific Context in Your Prompts

The more precise your instructions, the fewer corrections you'll need. Reference specific files, mention constraints, and point to example patterns.

- **Scope the task** — specify which file, what scenario, and testing preferences ("cover the edge case where the user is logged out. avoid mocks.").
- **Point to sources** — direct Claude to what can answer a question ("look through ExecutionFactory's git history and summarize how its api came to be").
- **Reference existing patterns** — name a good example file to follow.
- **Describe the symptom** — give the symptom, likely location, and what "fixed" looks like; have Claude write a failing test first, then fix.

Vague prompts are useful when exploring ("what would you improve in this file?").

### Provide Rich Content

- **Reference files with `@`** — Claude reads the file before responding.
- **Paste images directly** — copy/paste or drag and drop.
- **Give URLs** for docs/API references; use `/permissions` to allowlist frequent domains.
- **Pipe in data** — `cat error.log | claude`.
- **Let Claude fetch what it needs** — via Bash, MCP tools, or reading files.

## Configure Your Environment

### Write an Effective CLAUDE.md

CLAUDE.md is read at the start of every conversation. Run `/init` to generate a starter file, then refine. Keep it short and human-readable — include Bash commands Claude can't guess, code style that differs from defaults, testing instructions, repo etiquette, project-specific architectural decisions, env quirks, and non-obvious gotchas.

Exclude anything Claude can infer from code, standard conventions, detailed API docs (link instead), frequently-changing info, and self-evident practices. For each line ask: "Would removing this cause Claude to make mistakes?" If not, cut it — **bloated CLAUDE.md files cause Claude to ignore your actual instructions.**

- Run `/context` to confirm the file loaded.
- Tune adherence with emphasis ("IMPORTANT", "YOU MUST").
- Check it into git so the team can contribute.
- Import other files with `@path/to/import` syntax.
- Locations: home (`~/.claude/CLAUDE.md`), project root (`./CLAUDE.md`), personal (`./CLAUDE.local.md`, gitignored), parent dirs (monorepos), and on-demand child directories.
- For sometimes-relevant domain knowledge, use **skills** instead so they load on demand.

### Configure Permissions

By default Claude requests permission for system-modifying actions. Three ways to reduce interruptions:

- **Auto mode** — a classifier model reviews commands and blocks only risky ones (scope escalation, unknown infrastructure, hostile-content-driven actions).
- **Permission allowlists** — permit specific safe tools via `/permissions` (e.g., `npm run lint`, `git commit`).
- **Sandboxing** — OS-level isolation restricting filesystem and network access (`/sandbox`).

### Use CLI Tools

CLI tools are the most context-efficient way to interact with external services. Install `gh` for GitHub (issues, PRs, comments); without it, unauthenticated API requests hit rate limits. Claude can learn unfamiliar CLIs: "Use 'foo-cli-tool --help' to learn about foo tool, then use it to solve A, B, C."

### Connect MCP Servers

Run `claude mcp add` to connect external tools (Notion, Figma, databases). Ask Claude to implement features from issue trackers, query databases, analyze monitoring data, or integrate designs.

### Set Up Hooks

Hooks run scripts automatically at specific workflow points. Unlike advisory CLAUDE.md instructions, hooks are deterministic. Claude can write hooks for you ("Write a hook that runs eslint after every file edit"). Configure in `.claude/settings.json`; browse with `/hooks`.

### Create Skills

Add `SKILL.md` files in `.claude/skills/` to give Claude domain knowledge and reusable workflows. Claude applies them automatically or via `/skill-name`. Use `disable-model-invocation: true` for side-effect workflows you want to trigger manually.

### Create Custom Subagents

Define specialized assistants in `.claude/agents/`. They run in their own context with their own allowed tools — useful for tasks that read many files or need focus without cluttering the main conversation. Invoke explicitly: "Use a subagent to review this code for security issues."

### Install Plugins

Run `/plugin` to browse the marketplace. Plugins bundle skills, hooks, subagents, and MCP servers into one installable unit. For typed languages, install a code intelligence plugin for symbol navigation and error detection.

## Communicate Effectively

### Ask Codebase Questions

Use Claude Code for onboarding — ask the questions you'd ask a senior engineer ("How does logging work?", "How do I make a new API endpoint?", "What edge cases does X handle?"). No special prompting required.

### Let Claude Interview You

For larger features, start with a minimal prompt and ask Claude to interview you using the `AskUserQuestion` tool — covering technical implementation, UI/UX, edge cases, and tradeoffs — then write a complete spec to SPEC.md. Start a fresh session to execute it. The most useful specs are self-contained: they name files/interfaces, state what's out of scope, and end with an end-to-end verification step.

## Manage Your Session

Conversations are persistent and reversible.

### Course-Correct Early and Often

- **`Esc`** — stop Claude mid-action; context is preserved so you can redirect.
- **`Esc + Esc` or `/rewind`** — open the rewind menu to restore prior conversation/code state.
- **"Undo that"** — have Claude revert its changes.
- **`/clear`** — reset context between unrelated tasks.

If you've corrected Claude more than twice on the same issue, `/clear` and start fresh with a better prompt. A clean session with a better prompt almost always outperforms a long session with accumulated corrections.

### Manage Context Aggressively

- Use `/clear` frequently between tasks.
- Auto-compaction summarizes what matters when approaching limits.
- Use `/compact <instructions>` for control (e.g., "Focus on the API changes").
- Use `Esc + Esc` / `/rewind` to summarize part of the conversation.
- Customize compaction behavior in CLAUDE.md.
- Use `/btw` for quick questions that shouldn't stay in context.

### Use Subagents for Investigation

Delegate research with "use subagents to investigate X." They explore in a separate context and report summaries, keeping the main conversation clean. Also usable for verification after implementation.

### Rewind with Checkpoints

Every prompt creates a checkpoint; Claude snapshots files before each change. Restore conversation only, code only, both, or summarize. Tell Claude to try something risky and rewind if it fails. Note: checkpoints only track changes made through Claude's file editing tools — not Bash or external processes. This is not a replacement for git.

### Resume Conversations

Claude Code saves conversations locally. Run `claude --continue` for the most recent session, or `claude --resume` to choose. Name sessions with `/rename` (e.g., `oauth-migration`) and treat them like branches.

## Automate and Scale

### Run Non-Interactive (Headless) Mode

Use `claude -p "prompt"` in CI, pre-commit hooks, or scripts. Output formats: plain text, `--output-format json` (single object with a `result` field), or `--output-format stream-json --verbose` (one JSON object per line). Runs create a resumable session unless you pass `--no-session-persistence`.

### Run Multiple Claude Sessions

Parallel approaches by coordination level:

- **Worktrees** — separate CLI sessions in isolated git checkouts so edits don't collide.
- **Desktop app** — manage multiple local sessions visually, each in its own worktree.
- **Claude Code on the web** — sessions on Anthropic-managed cloud infrastructure in isolated VMs.
- **Agent teams** — automated coordination with shared tasks, messaging, and a team lead.

A fresh context improves code review (Claude won't be biased toward code it just wrote). Use a **Writer/Reviewer pattern**: Session A implements, Session B reviews in fresh context, Session A addresses feedback. Similarly, have one Claude write tests and another write code to pass them.

### Fan Out Across Files

For large migrations/analyses, distribute work across many parallel invocations:

1. Have Claude generate a task list (e.g., "list all 2,000 Python files that need migrating").
2. Write a script to loop through the list calling `claude -p` for each, using `--allowedTools` to scope permissions.
3. Test on a few files, refine the prompt, then run at scale.

Integrate into pipelines: `claude -p "<prompt>" --output-format json | your_command`. Use `--verbose` for debugging; turn it off in production.

### Run Autonomously with Auto Mode

For uninterrupted execution with background safety checks: `claude --permission-mode auto -p "fix all lint errors"`. A classifier reviews commands, blocking scope escalation, unknown infrastructure, and hostile-content-driven actions. With `-p`, auto mode aborts if the classifier repeatedly blocks (no user to fall back to).

### Add an Adversarial Review Step

Before treating work as done, have a subagent review the diff in a fresh context and report gaps. Run the bundled `/code-review` skill for a correctness check, or write your own review prompt naming the work, the plan to check against, and what counts as a finding. Tell the reviewer to flag only gaps affecting correctness or stated requirements — a reviewer asked to find gaps will report some even when the work is sound, and chasing every one leads to over-engineering.

## Avoid Common Failure Patterns

- **The kitchen sink session** — unrelated tasks pollute context. Fix: `/clear` between unrelated tasks.
- **Correcting over and over** — failed approaches pollute context. Fix: after two failed corrections, `/clear` and write a better prompt.
- **The over-specified CLAUDE.md** — important rules get lost in noise. Fix: ruthlessly prune; convert rules to hooks.
- **The trust-then-verify gap** — plausible code that misses edge cases. Fix: always provide verification; if you can't verify it, don't ship it.
- **The infinite exploration** — unscoped "investigate" reads hundreds of files. Fix: scope narrowly or use subagents.

## Develop Your Intuition

These patterns are starting points, not rules. Sometimes you should let context accumulate, skip planning, or use a vague prompt deliberately. Pay attention to what works — the prompt structure, context, and mode — and build intuition over time about when to be specific vs. open-ended, when to plan vs. explore, and when to clear context vs. let it accumulate.
