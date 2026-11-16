# Weekly Update Summary — 2026-11-16

> Covers 3 weeks (since 2026-10-25). The 11-01 and 11-08 runs did not happen.

## What Changed

**Models (web-extracted): model-launch cascade applied**
- `models/claude-fable-5-2-mythos-5-2.md`: **new** (Claude Fable 5.2 / Mythos 5.2 launch, Nov 9)
- `models/overview.md`, `api/models-overview.md`: content refresh (Fable 5.2 replaces Fable 5.1 in the current lineup; Fable 5.1 moves to the earlier-models table)
- `models/deprecations.md`: content refresh (Fable/Mythos 5.2 rows; `temperature`/`top_p`/`top_k` now *removed* in API version `2026-10-21`)

**Release notes (web-extracted)**
- `release-notes/platform.md`, `release-notes/api.md`: Oct 28 – Nov 12 entries added
- `release-notes/help-center.md`: November entries (Claude Meetings, Personal Finance, spend by cost code, Enterprise security center)

**SDKs (github-raw)**
- `sdks/python/CHANGELOG.md` + `README.md`: Python SDK 2.0.0 → **2.8.0**
- `sdks/typescript/CHANGELOG.md` + `README.md`: TypeScript SDK 1.0.0 → **1.8.0**

**Claude Code (github-raw + manual)**
- `claude-code/CHANGELOG.md`: v2.1.311 → **2.1.325**
- `claude-code/mcp-servers.md`, `hooks.md`, `features.md`, `plugins.md`: content refresh from live docs
- `docs/best-practices-mcp-credentials.md`, `docs/best-practices-loop-scheduling.md`: content refresh

**Agent SDK (manual)**
- `agent-sdk/README.md`, `agent-sdk/quickstart.md`: content refresh (`examples.md` unchanged)

**New sources (12, auto-added)**
- engineering: `building-strong-safety-evaluations` (Nov 13), `components-of-agent-memory` (Nov 6)
- research: `claude-electronics-design` (Nov 9), `teaching-ai-to-build-scientific-models` (Nov 6), `how-researchers-use-claude` (Nov 5), `provable-inference` (Nov 2), `early-progress-drug-development` (Oct 27), `agents-judgment-calls` (Oct 27)
- news: `roadshow-launch` (Nov 10), `s1-sec` (Oct 26), `ai-for-science-expands-foundations-research-institutions` (Oct 28)

**Minor:** `claude-code/README.md`, `skills/README.md` (docx/pdf/pptx/xlsx skills now Apache 2.0), `cookbooks/index.md` (new latency-optimization notebook), `research/papers/index.md` (checked; no new arXiv papers)

**Infrastructure:** 27 engineering `source_url`s repointed from `/engineering/` to `/research/` (the site moved them). New relocated-URL lint in `validate.js`.

**Not refreshed:** `github-repos/index.md`. The GitHub org API is blocked in scoped cloud sessions (see Action Items).

## So What: Why It Matters

**1. New flagship model: Claude Fable 5.2 (`claude-fable-5-2`), Nov 9.** It replaces Fable 5.1 as the top widely released model and is **20% cheaper** ($8 / $40 per MTok vs $10 / $50). Cache reads cost $0.20/MTok and output is up to 30% faster. It beats Opus 5.5 on most benchmarks, for example FrontierSWE v2 69.9% vs 62.3%. **Fast mode** costs $16 / $80 per MTok (`speed: "fast"`, no beta header). Mythos 5.2 is the same model, gated to verified cyber and life-sciences programs. Anthropic's guidance is unchanged: **start with Opus 5.5** and move up to Fable when evals fall short.

**2. Fable 5.2 has breaking API behavior to know before switching:**
- The preserved-thinking **prefix check is enforced for every account**. If your code edits the system prompt, tools, or earlier messages and then resends a later thinking block, the request returns 400.
- Its thinking blocks are **account-bound**, and **no other model can read them**. They are dropped if you switch models mid-conversation.
- Computer use requires `computer_toolset_20260801`. An advisor-tool executor on Fable 5.2 accepts only Fable 5.2 or Mythos 5.2 as advisor.
- **30-day data retention is required**: no ZDR unless expressly authorized.

**3. Deprecations and deadlines:**
- **Claude Sonnet 4.5 retires Nov 30, 2026**; move to `claude-sonnet-5-5`.
- **Fast mode on Claude Opus 4.8 is removed Nov 30, 2026**; `speed: "fast"` on `claude-opus-4-8` will error. Move to Opus 5.5.
- Claude Opus 4.5 retires no sooner than Nov 24, 2026.
- The old Usage and Cost API is now **legacy**, replaced by the new **Usage and Cost Analytics API** (beta).

**4. API platform additions:**
- **Message threads** (beta, Nov 2): the server keeps the conversation, so long agent loops send only new messages and get a lower time to first token.
- **Max request size is now 128 MB** (was 32 MB).
- **IP allowlisting** (beta).
- **Self-hosted Managed Agents** (Nov 12).
- Text watermarking on Mythos 5, Opus 4.7, and Sonnet 4.6.

**5. SDKs** (Python 2.8 / TS 1.8):
- Fable/Mythos 5.2 model IDs.
- Typed error classes with `error_code` / `details` (Python 2.5).
- GA analytics, spend-limit, and RBAC methods.
- Ramp-limit error code.
- Bedrock/Vertex hardening.
- Python no longer records sampling parameters on OpenTelemetry spans.

**6. Claude Code** (2.1.311–2.1.325), notable behavior changes:
- **Sandboxed Bash now goes through the normal permission flow by default.** Set `sandbox.autoAllowBashIfSandboxed: true` to keep the old no-prompt behavior.
- **Scheduled tasks and `/loop` now ask before running a skill that declares `allowed-tools` or hooks.** Add `Skill(name)` to `permissions.allow` for unattended runs.
- An experimental **Code Mode** has Claude write JavaScript to call its tools.
- `engines["claude-code"]` version ranges are now supported in `plugin.json`.
- MCP docs: client runtime v2 (protocol `2026-07-28`), MCP tasks beta, discovery cache **off by default**, and credential variables now expand to empty in remote `url`/`headers`.

**7. Research and news:**
- **Anthropic filed an S-1 (Oct 26) and launched its IPO roadshow (Nov 10)**: Nasdaq ticker "ANT", $70–$78 per share.
- "How AI agents shape experts' judgment calls": analysts adopted an agent's hidden preference 86% of the time, usually without noticing.
- FlashProve: open-source provable inference.
- New engineering guides on safety evaluations and agent memory.

## Action Items

- **Before Nov 30:** move any `claude-sonnet-4-5` usage to `claude-sonnet-5-5`, and any Opus 4.8 fast-mode usage to Opus 5.5.
- **If you plan to adopt Fable 5.2:** check whether your code edits the conversation prefix before resending thinking blocks (now a hard 400). Confirm 30-day retention is acceptable. Update computer-use and advisor-tool configs.
- **Claude Code scheduled tasks / `/loop`:** any routine whose skill declares `allowed-tools` or hooks will now pause for approval. Add `Skill(name)` to `permissions.allow`. This repo's `update-anthropic-docs` command declares neither, so this routine is unaffected.
- **Sandboxed Bash:** if you rely on sandboxed commands running without prompts, set `sandbox.autoAllowBashIfSandboxed: true`.
- **Repo maintenance:** `github-repos/index.md` can't refresh from scoped cloud runs; run it locally or mark it local-only (optimizations #26). `agent-sdk-typescript-v2` is still waiting on a remove-or-repoint decision. One new research post (`investigating-vault-particles-with-claude`) was deferred: a safety check blocked the automated write, so review it manually if wanted.
