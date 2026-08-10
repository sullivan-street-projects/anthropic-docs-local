---
# Weekly Update Summary — 2026-08-10

## What Changed

### claude-code (3 files)
- **claude-code/CHANGELOG.md** — 6 new versions (2.1.221–2.1.226): gateway spend-limit support, workspace trust prompts for agents, Remote Control improvements, and multiple bug fixes
- **claude-code/hooks.md** — New DirectoryAdded event (36 total), HTTP hook response handling expanded (5 response types), Agent hooks marked Experimental, Windows PowerShell section, Edit(*.ts) if-field syntax
- **claude-code/mcp-servers.md** — Automatic backgrounding of long tool calls (v2.1.212+), configuration warnings (whitespace detection), server status detail (caching), project server approvals / workspace trust (v2.1.196+), organization controls on connector tools

### sdks (2 files)
- **sdks/python/CHANGELOG.md** — v0.121.0 (Aug 7): mid-conversation-tool-changes beta, session budgets, advisor tool, pinned inference location, skills auto-loading from GitHub, Claude Opus 4.1 retired
- **sdks/typescript/CHANGELOG.md** — v0.116.0 (Aug 7): matching Python SDK features plus hardcoded User-Agent fix and bash tool timeout/abort improvements

### api (10 files)
- **api/migration-guide.md** — New Fable 5/Mythos 5 migration sections (from Mythos Preview, Opus 5, Opus 4.8). Added Opus 5 behavioral guidance: remove verification instructions, constrain task scope, control subagent spawning
- **api/errors.md** — 3 new validation error sections: "Extended thinking not supported", "Adaptive thinking not supported", "Thinking cannot be disabled". Updated prefill error description
- **api/models-overview.md** — Claude Opus 4.1 removed from legacy models table (retired Aug 5). Updated deprecation note to retirement note
- **api/web-search-tool.md** — Opus 5 added to dynamic filtering and supported models. Retired models (Opus 4.1, Opus 4, Sonnet 4) removed from supported list
- **api/adaptive-thinking.md** — Opus 5 added to supported models
- **api/compaction.md** — Opus 5 added to supported models
- **api/context-windows.md** — Opus 5 added to 1M context window models
- **api/effort-parameter.md** — Opus 5 added to supported models
- **api/extended-thinking.md** — Opus 5 added to supported models table
- **api/vision.md** — Opus 5 added to high-resolution image tier

### models (2 files)
- **models/overview.md** — Opus 4.1 removed from legacy table, added to retired models list
- **models/deprecations.md** — Opus 4.1 status changed from "Deprecated" to "Retired" with retirement note

### release-notes (3 files)
- **release-notes/platform.md** — 4 new entries: Aug 7 (Managed Agents session budgets, advisor tool, inference_geo, GitHub skills auto-loading), Aug 5 (inference hooks beta for Enterprise, Opus 4.1 retired), Aug 1 (Dreams supports Opus 5), Jul 10 addition
- **release-notes/api.md** — Same 4 new entries in condensed form
- **release-notes/help-center.md** — Aug 6 entry: enterprise security scanning for skills/plugins

### agent-sdk (2 files)
- **agent-sdk/README.md** — Updated comparison table (Agent SDK vs CLI vs Client SDK vs Managed Agents). Added Plugins capability. Renamed Google Vertex AI → Google Cloud's Agent Platform, Microsoft Azure → Microsoft Foundry
- **agent-sdk/quickstart.md** — Matching platform rebrands, updated setup guide links, bundled binary edge cases

### research (1 file)
- **research/papers/index.md** — Added arXiv 2604.07729 "Emotion Concepts and their Function in a Large Language Model" (Sofroniew et al., Apr 2026) — discovers internal emotion concept representations in Claude Sonnet 4.5 that causally influence outputs

### github-repos (1 file)
- **github-repos/index.md** — Star counts refreshed across 96 repos. Notable: skills 167k (+1.6k), claude-code 141k (+900), cookbooks 51k (+360)

### docs (1 file)
- **docs/best-practices-mcp-credentials.md** — Updated reserved server names (5 total), headersHelper auto-retry on 401/403, CLAUDE_PLUGIN_ROOT env var, org controls on connector tools, workspace trust for project server approvals

## So What — Why It Matters

### Claude Opus 4.1 is now RETIRED
Opus 4.1 was officially retired on Aug 5. Any code still referencing `claude-opus-4-1` model IDs will fail. Migrate to Opus 4.6 or Opus 5.

### SDK session budgets and advisor tool are new
Both Python (v0.121.0) and TypeScript (v0.116.0) SDKs shipped a `session_budgets` feature and an `advisor` tool. The `mid-conversation-tool-changes` beta allows modifying tools mid-conversation. Skills can now auto-load from GitHub repos.

### Opus 5 is now fully documented across API docs
Opus 5 has been added to supported model lists for: extended thinking, adaptive thinking, effort parameter, context windows (1M), vision (high-res), web search (dynamic filtering), and compaction. It was launched Jul 24 but many API doc pages hadn't been updated until now.

### Fable 5 / Mythos 5 migration guidance
New migration guide sections cover moving to Fable 5/Mythos 5 from Mythos Preview, Opus 5, and Opus 4.8. Includes important behavioral guidance for Opus 5: remove explicit verification instructions (it self-verifies), constrain task scope to prevent scope creep, and control subagent spawning.

### Claude Code gateway spend-limits
New in v2.1.222+: gateway-level spend limits allow organizations to cap Claude Code spending per user/team. Combined with workspace trust prompts (v2.1.224+) for agent security.

### MCP server improvements
Automatic backgrounding of long-running MCP tool calls (v2.1.212+), configuration warnings for whitespace in server configs, and organization-level controls on connector tools. Project server approvals now tied to workspace trust model.

### New research: emotion representations in LLMs
Anthropic's interpretability team found that Claude Sonnet 4.5 develops internal emotion concept representations that causally influence its outputs — not just pattern matching, but functional emotion-like states that affect reasoning.

## Action Items

- **BREAKING**: If any project uses `claude-opus-4-1` model IDs, migrate immediately — the model is retired
- **SDK UPDATE**: Consider upgrading to Python SDK 0.121.0 / TypeScript SDK 0.116.0 for session budgets and advisor tool
- **Opus 5 behavioral notes**: When using Opus 5, remove explicit verification instructions from prompts (it handles this internally) and add guardrails for subagent spawning
- **MCP**: If using custom MCP servers, review the new automatic backgrounding behavior for long tool calls
- **Platform rebrands**: Google Vertex AI is now "Google Cloud's Agent Platform", Microsoft Azure is now "Microsoft Foundry" — update any integration references

## Discovery — New Untracked Content

28 new sources found on anthropic.com not yet tracked. Highlights:

**HIGH priority (engineering/product):**
- "How we contain Claude across products" (engineering)
- "Scaling Managed Agents" (engineering)
- "How we built Claude Code auto mode" (engineering)
- "Harness design for long-running apps" (engineering)
- "Equipping agents with Agent Skills" (engineering)

**HIGH priority (research):**
- "A global workspace in language models" (research)
- "An off switch for dual-use knowledge" (research)
- "Discovering cryptographic weaknesses with Claude" (research)

Run `/update-anthropic-docs --discover` for the full list.
