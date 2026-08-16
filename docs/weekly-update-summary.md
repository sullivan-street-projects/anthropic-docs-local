# Weekly Update Summary — 2026-08-16

**Bottom line:** A high-signal week — 40 content-changed files plus 7 new first-party sources added. Two changes need your attention: **Sonnet 5's price stays at $2/$10 (the Sept 1 increase is cancelled)** and **Claude Opus 4.1 is now retired (requests error)**.

## What Changed

### Models & Pricing (`models/`, `api/`)

- **`models/overview.md`, `api/models-overview.md`, `api/migration-guide.md`** — Sonnet 5 is now **$2/$10 per M tokens as the standard price**; the previously-announced Sept 1 increase to $3/$15 is cancelled. Introductory-pricing note removed.
- **`models/overview.md`, `models/deprecations.md`** — **Claude Opus 4.1 (`claude-opus-4-1-20250805`) retired Aug 5, 2026** — moved from Legacy/Deprecated to Retired; requests now error.
- **`api/effort-parameter.md`, `api/extended-thinking.md`** — Claude Opus 5 added to supported-model tables (effort levels incl. max/xhigh; interleaved thinking; new "Recommended Effort Levels for Opus 5" section).

### Claude Code (`claude-code/`)

- **`CHANGELOG.md`** — 13 new versions (2.1.221 → 2.1.233): **self-hosted runners** (run sessions on your own machines/containers, Team/Enterprise); **cross-session messaging** (`SendMessage`/`ListAgents` between sessions/machines); **GitLab support** (MR URLs, marketplace clones, token redaction, `glab` sandboxing); plugin marketplace `archive`/`command` sources; sandbox credential masking; new env vars (`CLAUDE_CODE_TOOL_MEMORY_LIMIT`, `CLAUDE_CODE_WEBFETCH_CACHE_TTL_MS`).
- **`hooks.md`** — new **`DirectoryAdded`** lifecycle event; new `elicitation_url_dialog` Notification matcher.
- **`mcp-servers.md`, `docs/best-practices-mcp-credentials.md`** — **stdio MCP servers are now subject to the 30-min idle timeout** (v2.1.203; previously exempt); automatic backgrounding of long tool calls (v2.1.212); discovery cache (v2.1.221).

### SDKs (`sdks/`)

- **Python 0.122.0 / 0.121.0**, **TypeScript 0.117.1 / 0.116.0** — `output_behavior` on dream creation; **session budgets**, **advisor tool**, pinned inference location (`inference_geo`), GitHub-repo skills auto-loading; `mid-conversation-tool-changes-2026-07-01` beta; **retired Opus 4.1 models removed**; Bedrock/Vertex gain `beta.messages.parse`/`stream`/`tool_runner` (Python).

### API reference (`api/`)

- **`api/errors.md`** — new thinking-related validation errors ("Extended thinking not supported", "Adaptive thinking not supported", "Thinking cannot be disabled"); prefill list generalized to "Claude 4.6 and later"; 401 note for expired keys.
- **`api/overview.md`, `api/messages-api.md`, `api/streaming.md`** — new `anthropic-workspace-id` response header; `container`/`inference_geo` params; stale web-search tool version corrected.

### Release notes (`release-notes/`)

- Six new dated platform/API entries (Aug 1–11): Compliance API session transcripts, Managed Agents session budgets, inference hooks beta, Opus 4.1 retirement, Dreams on Opus 5. Help center: **Skill and plugin security scanning (beta)** for Enterprise (Aug 6).

### New sources added (7)

Cleared a multi-cycle HIGH-priority backlog from anthropic.com:

- **`engineering/equipping-agents-agent-skills.md`** — Agent Skills (SKILL.md + three-level progressive disclosure).
- **`engineering/claude-code-auto-mode.md`** — the classifier pipeline behind auto-approving low-risk permissions (0.4% false-positive rate).
- **`engineering/managed-agents.md`** — decoupling agents into stateless brain / sandboxed hands / durable session log (~60% faster time-to-first-token).
- **`engineering/harness-design-long-running-apps.md`** — planner/generator/evaluator harness with Playwright-based grading.
- **`engineering/how-we-contain-claude.md`** — three containment patterns (gVisor container, OS sandbox, sealed VM).
- **`claude-code/making-of-claude-code.md`** — oral history of Claude Code from 2021 VS Code extension to launch.
- **`research/multiagent-systems.md`** — Frontier Red Team on multiagent failure modes (conformity collapse, collusion, deception, turf wars).

### Repo index & housekeeping

- **`github-repos/index.md`** — 3 new repos (zeta-23-lean, amulet2, mockturtle); star counts refreshed (skills 169.6k, claude-code 141.6k).
- **`research/papers/index.md`** — no new arXiv papers; Anthropic continues shipping research as blog posts.

## So What — Why It Matters

- **Sonnet 5 pricing is locked at $2/$10 — budget relief.** Any cost models that assumed the Sept 1 jump to $3/$15 should be reverted. Sonnet 5 stays the cheap default.
- **Opus 4.1 is a hard break.** Any code still pinning `claude-opus-4-1-20250805` will now get errors, not a fallback. Grep your configs and repin to Opus 5 (or Opus 4.8).
- **stdio MCP servers now time out.** Long-idle local MCP servers that relied on being exempt from the 30-min idle timeout will now be reaped — relevant to any long-running MCP integrations (this repo's guidance file was corrected to match).
- **New Claude Code muscle for automation:** self-hosted runners and cross-session messaging are directly relevant to scheduled/headless pipelines like this one.
- **The multiagent research validates our own update pipeline** — its documented failure modes (turf wars, agent-to-agent deception, conformity collapse) are exactly what our single-writer manifest + verify-sha256-from-disk + orthogonal-work-partition design prevents. (See meta-synthesis log.)

## Action Items

1. **Repin any `claude-opus-4-1-20250805` usage** → Opus 5 / Opus 4.8. This one errors now, not silently.
2. **Revert Sonnet 5 cost assumptions** to $2/$10 standard (drop the cancelled Sept 1 increase).
3. **Audit long-running local MCP servers** for the new stdio 30-min idle timeout; set per-server `timeout` where a server must persist.
4. **One-click cleanup pending:** a task chip proposes removing the dead `agent-sdk-typescript-v2` source (github.com/anthropics/agent-sdk, 404 for ~7 cycles). Removing it stops the recurring staleness warning.
5. **Stale branch cleanup (manual):** 6 old `claude/zealous-heisenberg-*` weekly-run branches (Jul 6–Aug 10) remain on the remote, now superseded by master. Remote branch deletion is blocked in unattended runs — delete them from GitHub or a local terminal when convenient.

---

_Master is at `57c692b`. Validation: 4 layers pass, 0 errors, 125/125 hashes verified. 81 advisory staleness warnings (intentional stable snapshots)._
