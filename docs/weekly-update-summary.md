# Weekly Update Summary — 2026-09-21

## What Changed

### New Sources Added (13 files)
- `news/claude-design-anthropic-labs.md` — Claude Design by Anthropic Labs (Apr 2026)
- `news/claude-science-ai-workbench.md` — Claude Science AI workbench for scientists (Jun 2026)
- `news/claude-for-creative-work.md` — Claude for Creative Work (Apr 2026)
- `news/glasswing.md` — Project Glasswing: securing critical software (Apr 2026)
- `news/expanding-project-glasswing.md` — Expanding Project Glasswing (Jun 2026)
- `news/enterprise-ai-services-company.md` — Blackstone/HF/Goldman enterprise AI services (May 2026)
- `news/AI-enabled-cyber-threats-mitre-attack.md` — MITRE ATT&CK mapping of 832 banned accounts (Jun 2026)
- `news/reflect-with-claude.md` — Usage reflection feature with 4D AI Fluency Framework (Jul 2026)
- `news/healthcare-life-sciences.md` — Claude for Healthcare, HIPAA-ready tools (Jan 2026)
- `research/glasswing-initial-update.md` — Project Glasswing initial results (May 2026)
- `research/off-switch-dual-use.md` — Off switch for dual-use knowledge (Jul 2026)
- `research/exploit.md` — Claude's CVE-2026-2796 Firefox exploit reverse engineering (Mar 2026)
- `research/econ-scenarios.md` — Scenarios for Economic Future through 2030 (Sep 2026)

### Content Changes (9 files)
- `api/overview.md` — Authorization header now primary (x-api-key demoted to legacy); new `anthropic-workspace-id` header; "Workbench" renamed to "playground"
- `models/deprecations.md` — Added 3 Mythos model entries (mythos-5-1 active, mythos-5 active, mythos-preview deprecated)
- `research/index.md` — Added 3 new publications; chronological reorder
- `claude-code/hooks.md` — 6 new Notification matchers; `account_on_hold` StopFailure; Cloud Sessions section; Hook Allowlists (Enterprise); PreModelSwitch/PostModelSwitch events
- `claude-code/mcp-servers.md` — Credential variable security; MCP Client Runtimes v1/v2; tool input schema flattening; server disable/enable; organization connector controls
- `claude-code/CHANGELOG.md` — One line removed from 2.1.277 section
- `docs/best-practices-loop-scheduling.md` — 17 new CLI flags including `--cloud`, `--remote`, `--exec`, `--restricted`, `--advisor`; `ultracode` effort level; `claude respawn`/`claude rm` commands
- `docs/best-practices-mcp-credentials.md` — Credential variables security section; organization connector controls
- `github-repos/index.md` — Star counts refreshed (skills: 177.4k, claude-code: 147.4k)

### Timestamp-Only Updates (7 files)
- `claude-code/README.md`, `sdks/python/README.md`, `sdks/typescript/README.md`, `skills/README.md`, `cookbooks/index.md` — fetched_at bumped
- `sdks/python/CHANGELOG.md`, `sdks/typescript/CHANGELOG.md` — no new releases since 09-18

### Unchanged (skipped)
- 5 release-notes/api pages — no new entries since last week
- 5 manual sources (features.md, plugins.md, agent-sdk/*) — content up to date
- ~65 stable web-extracted snapshot articles — correctly left untouched

## So What — Why It Matters

### API Breaking Change: Authorization Header
The API now uses the standard `Authorization` header as primary, demoting `x-api-key` to legacy. **Any code using `x-api-key` still works but should migrate.** New `anthropic-workspace-id` header enables workspace-scoped API calls.

### SDK Major Version Bump
Python SDK jumped from 0.122.x to **1.7.0** (1.x major release). TypeScript SDK at **0.127.0** (up from 0.117.1). Check CHANGELOGs for breaking changes in the Python 1.x migration.

### New Product Launches (Backfill)
Three major product launches were caught up from the April-July gap:
- **Claude Design** (Anthropic Labs) — design tool
- **Claude Science** — AI workbench for scientists
- **Claude for Creative Work** — creative content connectors

### Project Glasswing
New security initiative: Glasswing is Anthropic's program to secure critical software using AI. Three related documents added covering the launch, expansion, and initial research findings.

### Claude Code: Enterprise Hook Controls
New enterprise features: hook allowlists (`allowedHttpHookUrls`, `allowManagedHooksOnly`), organization-level connector tool controls. Cloud Sessions section documents what loads vs. doesn't in cloud environments.

### New CLI Capabilities
17 new CLI flags documented including `--cloud` (cloud sessions), `--remote`/`--rc` (remote control), `--exec` (single command), `--restricted` (restricted mode), and `ultracode` effort level.

### Mythos Model Lifecycle
3 Mythos model entries added to deprecations: mythos-5-1 and mythos-5 are active; mythos-preview is deprecated (June 9, 2026).

### Research: CVE Exploit Analysis
Anthropic's Frontier Red Team documented Claude Opus 4.6 independently creating a working Firefox exploit (CVE-2026-2796) — significant for AI security capability assessments.

## Action Items

- **Check Python SDK 1.x migration**: The jump from 0.122.x to 1.7.0 is a major version bump. Review breaking changes in the Python CHANGELOG before upgrading.
- **Migrate x-api-key to Authorization header**: While x-api-key still works, it's now legacy. Update API integrations.
- **Review new CLI flags**: `--cloud`, `--remote`, `--restricted`, `--exec` may be useful for our automation workflows.
- **agent-sdk-typescript-v2 removal overdue**: 11th consecutive cycle at 404 (169 days stale). Remove from manifest or repoint to code.claude.com/docs/en/agent-sdk/*.
- **threat-intelligence-report still truncated**: From 09-13, needs targeted multi-section re-fetch.

## Stats
- Sources: 165 → 178 (+13 new)
- Files modified: 29 total (13 new + 9 content changes + 7 timestamp-only)
- Validation: 0 errors, 104 advisory warnings
- All 178 sha256 hashes verified from disk
