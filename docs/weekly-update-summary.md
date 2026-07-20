---
title: "Weekly Update Summary"
date: "2026-07-20"
---

# Weekly Update Summary — 2026-07-20

## What Changed

### Release Notes (CONTENT CHANGED)
- `release-notes/platform.md` — New entries: July 15 mid-conversation system messages GA (Fable 5, Mythos 5, Opus 4.8); July 14 Admin API user management beta; July 10 Dreams now supports Fable 5 and Sonnet 5
- `release-notes/api.md` — Same 3 new entries as platform release notes
- `release-notes/help-center.md` — July 14 HIPAA self-serve configuration; July 10 Memory updated from daily summaries to individual categorized entries

### Claude Code (CONTENT CHANGED)
- `claude-code/CHANGELOG.md` — New versions 2.1.215, 2.1.214, 2.1.212: EndConversation tool, `/fork` creates background sessions, `/verify` and `/code-review` no longer auto-invoke, security/permission fixes

### SDK Changelogs (CONTENT CHANGED)
- `sdks/python/CHANGELOG.md` — New version 0.117.0 (Jul 16): dreaming support, MCP Tunnels, SecretStr credential protection
- `sdks/typescript/CHANGELOG.md` — New versions 0.112.0–0.112.3 (Jul 14–17): MCP Tunnels support

### API Docs (CONTENT CHANGED)
- `api/messages-api.md` — 2 new models: Claude Sonnet 5 and Claude Mythos Preview; 2 new parameters: `container` and `inference_geo`
- `api/adaptive-thinking.md` — Fable 5, Mythos 5, Opus 4.8, Sonnet 5 reject non-default temperature/top_p/top_k with 400 error; model-switching guidance added

### Models (CONTENT CHANGED)
- `models/deprecations.md` — Added claude-fable-5 and claude-sonnet-5 to model status; Mythos Preview retirement date updated from June 30 to July 21
- `models/claude-fable-5-mythos-5.md` — Major expansion: Jul 1 redeployment notice, drug design/genomics/scientific sections, safety classifier details, trusted access programs
- `models/claude-opus-4-7.md` — Major expansion: 15+ customer testimonials, safety assessment, cybersecurity section, migration guide from Opus 4.6
- `models/claude-opus-4-8.md` — Expanded benchmarks, customer feedback, Dynamic Workflows/Effort Control details

### Agent SDK (CONTENT CHANGED)
- `agent-sdk/README.md` — Provider renames: "Google Vertex AI" to "Google Cloud's Agent Platform", "Microsoft Azure" to "Microsoft Foundry"; permission mode description updates
- `agent-sdk/quickstart.md` — Same provider naming updates and permission mode changes

### Best Practices (CONTENT CHANGED)
- `docs/best-practices-loop-scheduling.md` — New effort level `ultracode`; new `manual` permission mode (v2.1.200+); 7 new CLI flags: `--cloud`, `--exec`, `--advisor`, `--debug-file`, `--forward-subagent-text`, `--prompt-suggestions`

### Research Papers (CONTENT CHANGED)
- `research/papers/index.md` — 3 new non-arXiv papers added: "Teaching Claude Why" (constitutional training reduces misalignment >3x), "Verbalizable Representations Form a Global Workspace" (J-lens tool), "An Off Switch for Dual-Use Knowledge" (GRAM)

### GitHub Repos (CONTENT CHANGED)
- `github-repos/index.md` — Repo count 92 to 94; 2 new repos: `k12-teacher-skills` (113 stars), `code-migration-kit-with-claude-code` (38 stars)

### Timestamp-Only Updates
- 17 engineering blog posts, 20 news articles, 19 research articles, 3 skills files, 8 claude-code web-extracted files, ~12 API/model/SDK docs, 4 github-raw READMEs

## So What — Why It Matters

### Mid-conversation system messages are GA
July 15 release makes mid-conversation system messages generally available on Fable 5, Mythos 5, and Opus 4.8 without a beta header. Enables richer agent control flows with injected system instructions.

### Admin API user management in beta
Enterprise customers can manage users, invites, groups, and custom roles via API. Useful for automated onboarding/offboarding.

### Claude Code 2.1.215 — EndConversation and /fork
EndConversation lets Claude decide when a task is done (important for automated pipelines). `/fork` now creates background sessions for parallel work branching. Note: `/verify` and `/code-review` skills no longer auto-invoke.

### SDK MCP Tunnels support
Both Python (0.117.0) and TypeScript (0.112.0) SDKs now support MCP Tunnels. Python SDK also adds SecretStr credential protection and dreaming support.

### New models in Messages API
Claude Sonnet 5 and Claude Mythos Preview are now available. New `container` and `inference_geo` parameters give control over where inference runs.

### Temperature restrictions on newer models
Fable 5, Mythos 5, Opus 4.8, and Sonnet 5 reject non-default temperature/top_p/top_k with a 400 error. Code using custom sampling parameters on these models will break.

### Fable 5 / Mythos 5 redeployed after suspension
Models are back online as of July 1. Major documentation expansion covers drug design, genomics, and safety classifiers.

### Provider renames in Agent SDK
Google Vertex AI is now "Google Cloud's Agent Platform" and Microsoft Azure is now "Microsoft Foundry". Update any documentation or code referencing old names.

### New CLI flags for Claude Code
The `ultracode` effort level is new. `--cloud`, `--exec`, `--advisor`, and `--manual` permission mode are all additions since last update.

## New Content Discovered (Not Yet Tracked)

Discovery scan found **29 new items** on anthropic.com:

**High priority:**
- Claude Sonnet 5 announcement
- Managed agents scaling engineering post
- Claude Code auto mode engineering post
- Containment across products engineering post
- Claude Science AI workbench
- Claude for Teachers

**12 news, 8 engineering, 9 research articles total.** Run `/update-anthropic-docs --discover` for full details and to add these sources.

## Action Items

- **BREAKING:** Mythos Preview retires July 21 — verify no production code uses `claude-mythos-preview`
- **BREAKING:** Temperature/top_p/top_k rejected on newer models — audit custom sampling parameter usage
- **UPDATE:** Consider upgrading to Python SDK 0.117.0 and TypeScript SDK 0.112.3
- **NOTE:** Provider names changed in Agent SDK — "Google Cloud's Agent Platform" and "Microsoft Foundry"
- **NOTE:** Claude Code `/verify` and `/code-review` no longer auto-invoke — must use slash commands explicitly
- **DISCOVERY:** 29 new sources found — run full discovery to add them
- **CLEANUP:** `agent-sdk/typescript-v2-preview.md` source 404 for 6+ cycles — recommend removal
