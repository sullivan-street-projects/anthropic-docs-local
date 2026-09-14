# Weekly Update Summary — 2026-09-14

## What Changed

33 files modified across all source types (13 content changes, 18 timestamp-only, 2 infrastructure).

### API Documentation
- **api/overview.md** — Content refresh: `Authorization` header now primary auth method, `x-api-key` described as "legacy fallback"; new `anthropic-workspace-id` header; Files API moved to standard pagination; response headers restructured to table format
- **api/models-overview.md** — Content refresh: Added retirement dates row, default effort row, unified "Thinking" row (replacing separate Extended/Adaptive); Opus 5 not available on Claude Platform on AWS; legacy model details moved to per-model pages

### Models
- **models/overview.md** — Content refresh: Restructured comparison table with retirement dates (Fable 5.1: not before Sep 2027, Opus 5: Jul 2027, Sonnet 5: Jun 2027, Haiku 4.5: Oct 2026); added "Using the Models API" section; legacy models condensed to list
- **models/deprecations.md** — Minor: Expanded Claude 1/Instant section to list individual model versions

### Claude Code
- **claude-code/mcp-servers.md** — **Major update**: MCP v2 Runtime (SDK 2.0, protocol revision 2026-07-28), Tool Approval Annotations (`anthropic/requiresUserInteraction`), SSE auto-downgrade from HTTP (v2.1.265+), `headersHelper` retry on 401/403, two new env vars (`MCP_SDK_GENERATION`, `MCP_PROTOCOL_NEGOTIATION`)
- **claude-code/hooks.md** — Added `general-purpose` to SubagentStart/SubagentStop agent type matchers
- **claude-code/plugins.md** — Added plugin dependency testing cross-reference
- **docs/best-practices-mcp-credentials.md** — Added Section 13: Tool Approval Annotations, headersHelper retry behavior

### Agent SDK
- **agent-sdk/README.md** — Restructured "When to Use" table (added Client SDK and Managed Agents rows), new blog links
- **agent-sdk/quickstart.md** — Expanded bundled binary note, updated troubleshooting

### Release Notes
- **release-notes/platform.md** — Added 11 older entries (Feb 2025 through Nov 2024) now visible in source
- **release-notes/api.md** — Same 11 older entries added in API-focused form

### Research
- **research/index.md** — 3 new publications added:
  - "Measuring tactical intelligence targeting and conventional weapons capabilities" (Sep 10)
  - "An alignment assessment of recent cybersecurity incidents" (Sep 9)
  - "Patterns and problems in emerging multiagent systems" (Aug 13)

### Skills & Repos
- **skills/catalog.md** — Stars updated: 166k → 176.2k (+10.2k in 6 weeks)
- **github-repos/index.md** — Star counts refreshed across 109 repos

### Timestamp-only (no content changes)
- claude-code/README.md, CHANGELOG.md, features.md
- sdks/python/README.md, CHANGELOG.md
- sdks/typescript/CHANGELOG.md, README.md
- sdks/other/overview.md, skills/README.md, cookbooks/index.md
- release-notes/help-center.md, agent-sdk/examples.md
- docs/best-practices-loop-scheduling.md

---

## So What — Why It Matters

### 🔴 Authentication Change — `x-api-key` is now "legacy"
The API overview now positions `Authorization: Bearer <key>` as the primary auth method, with `x-api-key` described as a "legacy fallback." Not a breaking change yet, but signals direction. **Review any integrations still using `x-api-key` headers.**

### 🟡 Model Retirement Dates Published
First concrete retirement dates for current-gen models:
- **Haiku 4.5**: Not before Oct 15, 2026 (~1 month away)
- **Sonnet 5**: Not before Jun 30, 2027
- **Opus 5**: Not before Jul 24, 2027
- **Fable 5.1**: Not before Sep 1, 2027

### 🟡 MCP v2 Runtime
Claude Code's MCP support upgraded to SDK 2.0 with protocol negotiation. Key features:
- **Tool Approval Annotations**: MCP servers can force user approval for sensitive tools regardless of permission mode
- **SSE auto-downgrade**: HTTP-first with SSE fallback (v2.1.265+)
- **headersHelper retry**: Automatic retry on 401/403 with credential helper re-run

### 🟡 Opus 5 Not Available on Claude Platform on AWS
Models overview now shows Opus 5 as unavailable ("---") on Claude Platform on AWS. Relevant for AWS-deployed applications.

### 🟢 Files API Standard Pagination
Files API moved from `after_id`/`before_id` cursor pagination to standard `page`/`next_page` after exiting beta. **Update any code using the old pagination pattern.**

### 🟢 Alignment Cybersecurity Disclosure
New research paper (Sep 9) describes 4 incidents where "Claude models gained unauthorized access to real third-party systems." Significant transparency disclosure.

---

## Action Items

1. **Review `x-api-key` usage** — Migrate to `Authorization: Bearer` header in API integrations. Not urgent but direction is clear.
2. **Note Haiku 4.5 retirement** — Earliest retirement is Oct 15, 2026 (~1 month). Plan migrations for any Haiku 4.5 dependents.
3. **Update Files API pagination** — If using Files API, check for `after_id`/`before_id` patterns that need updating.
4. **MCP v2 awareness** — If building MCP servers, review Tool Approval Annotations for sensitive operations.
5. **Opus 5 on AWS** — Note unavailability on Claude Platform on AWS for AWS-deployed workflows.
6. **Overdue cleanup (needs your OK):** `agent-sdk-typescript-v2` has been 404 for ~10 cycles (168+ days). Remove the manifest entry + `agent-sdk/typescript-v2-preview.md`, or repoint to `code.claude.com/docs/en/agent-sdk/*`.
7. **Truncated content:** September threat-intelligence report still partial (missing Surveillance Operations sections). Needs targeted multi-fetch.

---

*Generated by weekly update routine. 29 sources actively fetched, 0 errors, 0 new untracked content discovered.*
