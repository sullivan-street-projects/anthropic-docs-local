# Weekly Update Summary — 2026-08-17

**Bottom line:** Low-signal week — only 1 day since the last full update. 5 files with real content changes, 9 timestamp-only. No new models, no breaking changes, no pricing changes.

## What Changed

### Content Changes (5 files)

**API** (1 file)
- **`api/overview.md`** — Corrected Sessions API endpoint path (`/v1/sessions/{id}/stream` → `/v1/sessions/{id}/events/stream`). Workbench → Playground rename (legacy Workbench sunset Aug 17). Refreshed links for Message Batches, Models API, Files API, and Rate Limits pages.

**Claude Code** (1 file)
- **`claude-code/mcp-servers.md`** — Expanded reserved MCP server names from 1 to 5 (`workspace`, `claude-in-chrome`, `computer-use`, `Claude Preview`, `Claude Browser`). Corrected env var expansion behavior (warns on unset vars, doesn't fail). Added new Server Status & Diagnostics section: failure detail reporting (v2.1.219+), server toggle (`disabledMcpServers`/`enabledMcpServers`), `roots/list` MCP request support (v2.1.203+), `list_changed` refresh resilience (v2.1.214+).

**Docs** (2 files)
- **`docs/best-practices-loop-scheduling.md`** — Added `ultracode` to the `--effort` level list.
- **`docs/best-practices-mcp-credentials.md`** — Cascaded fixes from mcp-servers.md: env var expansion behavior correction, expanded reserved server names pitfall to full 5-name list.

**Skills** (1 file)
- **`skills/catalog.md`** — Star count update: 166k → 169.9k stars, 18.9k → 20.2k forks.

### Timestamp-Only Updates (9 files)
- `agent-sdk/README.md`, `agent-sdk/examples.md`, `agent-sdk/quickstart.md` — Manual re-synthesis, no content changes
- `claude-code/features.md`, `claude-code/hooks.md`, `claude-code/plugins.md` — Manual re-synthesis, no content changes
- `github-repos/index.md` — Star counts refreshed (minor movements across 77 repos)
- `research/papers/index.md` — Checked for new arXiv papers, none found
- `sdks/other/overview.md` — Re-fetched, no content changes

### No Changes (113 files)
- All 8 github-raw sources unchanged (Claude Code 2.1.233, Python SDK 0.122.0, TypeScript SDK 0.117.1)
- ~65 stable snapshot articles — not re-fetched per policy
- Remaining volatile web-extracted sources unchanged

## So What — Why It Matters

- **Workbench → Playground rename**: Anthropic is sunsetting the legacy Workbench interface as of Aug 17. Update any bookmarks or docs linking to `/workbench` → `/playground`.

- **MCP Server Status improvements**: Claude Code v2.1.219+ surfaces detailed failure reasons for MCP server connections. Five server names are reserved — avoid using them for custom servers.

- **SDK versions stable**: No new releases since Aug 13 (Python 0.122.0, TypeScript 0.117.1). Claude Code at 2.1.233.

- **No new models, pricing changes, or deprecations** this week.

## Action Items

- **No breaking changes** requiring immediate attention.
- **Pending cleanup**: `agent-sdk-typescript-v2` manifest entry (github.com/anthropics/agent-sdk → 404 for 134 days / ~8 cycles). Remove the manifest entry + `agent-sdk/typescript-v2-preview.md`, or repoint to code.claude.com/docs/en/agent-sdk/*.
- **27 untracked articles** on anthropic.com remain deferred from previous cycles. Notable HIGH-priority items: Riemann zeta research (Aug 10), text watermarking (Aug 14), worker retraining study (Aug 12), cryptographic weaknesses (Jul 28). Consider adding in a dedicated session.
- **Potential new discovery**: August 2026 Risk Report PDF at anthropic.com/aug-2026-risk-report — needs verification.

---

_Validation: 5 layers pass, 0 errors, 125/125 hashes verified. 80 advisory staleness warnings (intentional stable snapshots)._
