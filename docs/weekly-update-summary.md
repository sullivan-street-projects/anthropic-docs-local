# Weekly Update Summary — 2026-09-28

## What Changed

### API Documentation
- **api/overview.md** — Content refresh: Authorization header promoted to primary authentication method (x-api-key now "legacy fallback"), `anthropic-workspace-id` header added for multi-workspace API keys, Workbench renamed to "playground", response headers reformatted as table, Files API removed from pagination note
- **api/context-windows.md** — Content refresh: "Extended Thinking" renamed to "Thinking" throughout, Opus 5.5/Opus 5/Fable 5.1/Mythos 5.1 added to 1M-token context window model list, Haiku 4.5 interleaved thinking caveat added, compaction model list simplified to "Claude 4.6 and later"

### Claude Code
- **claude-code/features.md** — Content refresh: Output Styles added as a new extension feature (session-wide role/tone/format instructions), hooks description expanded to include "MCP tool call" as hook type, Agent Teams row removed from extension table

### Release Notes
- **release-notes/platform.md** — New entries: Sep 9 cache diagnostics fingerprint storage change, Sep 14 thinking controls beta header, ant CLI version (v1.32.0)
- **release-notes/api.md** — Same Sep 9/14 entries as platform notes
- **release-notes/help-center.md** — New entries: Sep 25 plugin developer portal launch, Sep 22 Claude Opus 5.5 release (40% lower cost than Opus 5), Sep 16 Cowork unification + Design/Slides/Docs in-conversation integration

### Research
- **research/index.md** — 5 new publications added to the index: "Yes, Claude can do Nine Loops" (Science), "Project Swap" (Economic Research), "Measuring tactical intelligence targeting..." (Frontier Red Team), "An alignment assessment of recent cybersecurity incidents" (Alignment), "Patterns and problems in emerging multiagent systems" (Frontier Red Team)

### Infrastructure
- **manifest.json** — 7 sha256 hashes recomputed, last_full_update and last_discovery_run bumped to 2026-09-28
- **docs/architecture.md** — Auto-regenerated

169 tracked sources. Validation: 0 errors, 169/169 SHA-256 hashes verified.

## So What — Why It Matters

### API Authentication Restructuring
The `Authorization: Bearer <token>` header is now the **primary** auth method; `x-api-key` is explicitly labeled a "legacy fallback." Projects still using `x-api-key` work fine today, but new code should use `Authorization`. The new `anthropic-workspace-id` header is **required** for multi-workspace API keys — if you use multiple workspaces, your integration may need updating.

### "Extended Thinking" → "Thinking" Terminology Shift
Anthropic has dropped the "Extended" prefix — it's now just "Thinking" in all documentation. This is a naming change only; behavior is unchanged. Update any user-facing docs or internal references that say "extended thinking."

### Output Styles (Claude Code)
New feature letting you set Claude's role, tone, and response format for an entire session via a persistent style instruction. Includes a built-in "Concise" style. Useful for teams wanting consistent Claude behavior without repeating prompts.

### Plugin Developer Portal
Launched Sep 25 — developers can now submit plugins to the Claude directory with review tracking and usage analytics.

### Cowork + Design/Slides/Docs Integration
Claude Cowork is now integrated into all conversations (not a separate mode), and Design, Slides, and Docs are available directly in conversations across all plans. Major UX shift for Claude's consumer/business products.

### Thinking Controls Beta
New `thinking-binding-controls-2026-08-01` beta header adds `thinking_mismatch_allowed` to `input_transformations`. Relevant for applications that need fine-grained control over thinking behavior.

## Action Items

- **Monitor `x-api-key` deprecation timeline**: While still supported as "legacy," the promotion of `Authorization` suggests eventual deprecation. No action needed now, but plan to migrate.
- **Update internal terminology**: "Extended Thinking" → "Thinking" across any docs or tools that reference it.
- **agent-sdk-typescript-v2 cleanup overdue**: `github.com/anthropics/agent-sdk` has been 404 for 12 consecutive cycles (176 days). Should be removed from manifest or repointed to current Agent SDK docs at code.claude.com.
- **threat-intelligence-report still truncated**: `news/threat-intelligence-report-september-2026.md` still carries a truncation marker from the 09-13 fetch — needs targeted multi-section re-fetch.
- **Several platform.claude.com URLs have moved**: models-overview, migration-guide, and changelog paths have changed. The manifest source_urls should be updated to the new paths to prevent future confusion.
