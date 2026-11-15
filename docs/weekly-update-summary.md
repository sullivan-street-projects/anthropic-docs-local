# Weekly Update Summary — 2026-11-15

## What Changed

**Models (web-extracted) — the headline**
- `models/deprecations.md`, `models/overview.md`, `api/models-overview.md` — **Claude Fable 5.2 / Mythos 5.2 launch** (Nov 9, 2026). Fable 5.2 is now the featured model; both Active, retire not sooner than Nov 9, 2027.
- New source `models/claude-fable-5-2-mythos-5-2.md` — announcement + breaking-changes synthesis (auto-added).

**SDKs + Claude Code (github-raw)**
- `sdks/python/CHANGELOG.md` + `README.md` — content changed (Python SDK → **2.8.0**; added `claude-fable-5-2` / `claude-mythos-5-2`)
- `sdks/typescript/CHANGELOG.md` + `README.md` — content changed (TypeScript SDK → **1.8.0**; same model IDs added)
- `claude-code/CHANGELOG.md` + `README.md` — content changed (→ **v2.1.325**; README: plugins now in `claude-plugins-official`)
- `skills/README.md` — **docx/pdf/pptx/xlsx relicensed source-available → open source (Apache 2.0)**
- `cookbooks/index.md` — +Latency optimization, −Wikipedia

**Claude Code hooks (manual)**
- `claude-code/hooks.md` — new "Match Monitor Commands" section (a `Bash` matcher also matches Monitor tool commands, v2.1.314+)

**Release notes (web-extracted)**
- `release-notes/api.md`, `release-notes/platform.md` — Nov 3/5/9/12 entries added
- `api/overview.md` — `anthropic-version` example → `2026-10-21`

**GitHub index (github-api)**
- `github-repos/index.md` — regenerated, 116 → **117** repos (new `FlashProve`, star counts refreshed)

**Infrastructure (meta-synthesis)**
- `tasks/lessons.md` — new lesson: fetch Claude docs via the **`.md` endpoint** (not WebFetch)
- `tasks/meta-synthesis-log.md`, `tasks/discovery-log.md`, `tasks/update-failures.md`, `docs/plans/meta-analysis-optimizations.md` (item #26) — updated

**Not changed (verified stable, honestly not bumped):** claude-code features/mcp/plugins, agent-sdk docs, best-practices docs, ~160 web-extracted snapshot articles, both arXiv index files (no new Anthropic-authored papers found).

## So What — Why It Matters

1. **New model generation: Claude Fable 5.2 / Mythos 5.2.** Fable is Anthropic's "most capable widely released" reasoning family, and **5.2 is now the featured first-column model** on the models overview (above Opus 5.5 in the table, though the "start with Opus 5.5" recommendation stands). Both have 1M context / 128K output and always-on adaptive thinking. Mythos 5.2 stays invitation-only (Project Glasswing / Cyber Verification Program).

2. **Price cut on the top reasoning tier.** Fable/Mythos 5.2 cost **$8 / $40 per MTok** (input / output), down from 5.1's $10 / $50 — with prompt cache reads at 2.5% ($0.20/MTok). If you run demanding reasoning / long-horizon agentic workloads on Fable, 5.2 is both newer and cheaper.

3. **Breaking changes if you move code to Fable/Mythos 5.2:** the prefix check is enforced for every account (editing `system`/`tools`/an earlier message then returning a later thinking block → 400); computer use requires `computer_toolset_20260801` (the earlier `computer_20251124` returns 400 except on Bedrock); thinking blocks are account-bound and read only by the Fable/Mythos 5.2 pair; the beta advisor tool requires a Fable/Mythos 5.2 advisor. Fast mode for Fable 5.2 is live ($16/$80 via `speed: "fast"`).

4. **SDK/CC licensing + features:** the skills repo's document skills (docx/pdf/pptx/xlsx) are **now fully open source (Apache 2.0)** — previously source-available. Relevant if any SSP project vendors or adapts them. Claude Code's new **Monitor tool** now interacts with hooks (a `Bash` matcher matches Monitor commands).

5. **Platform surface:** **self-hosted Claude Managed Agents** (run the whole service on your own infra), Compliance API **Security posture**, **IP allowlisting** (limit where a leaked API key works), Admin **sign-a-member-out-everywhere**, and text watermarking extended to Mythos 5 / Opus 4.7 / Sonnet 4.6.

6. **Process win for this repo:** every `platform.claude.com` / `code.claude.com` docs page is served as clean Markdown at `path + ".md"`. Fetching the volatile docs sources this way (plain `curl`) gave untruncated, byte-exact tables and IDs — the durable fix for the recurring "WebFetch truncates long pages" failure. (Note: a prior unmerged `zealous-heisenberg-1xnbfp` branch had a narrower version of this idea for manual raw sources; this cycle generalizes and adopts it.)

## Action Items

- **No breaking changes to our workflows.** This repo makes no direct Claude API calls, so the Fable 5.2 launch and its API-behavior changes are informational here. Any *other* SSP project that uses Fable/Mythos (or pins the SDKs) should review the migration guide before switching to 5.2.
- **Licensing note:** the docx/pdf/pptx/xlsx skills are now Apache 2.0 — worth recording if any SSP project vendors them.
- **Overdue removal (needs human):** `agent-sdk-typescript-v2` (github.com/anthropics/agent-sdk) is 404 for ~15 cycles (~224 days). Remove the manifest entry + `agent-sdk/typescript-v2-preview.md`, or repoint to the live `code.claude.com/docs/en/agent-sdk/*`.
- **Still-flagged truncation (needs human / future run):** `research/threat-intelligence-report-september-2026.md` remains partially extracted. It's on www.anthropic.com (no `.md` endpoint), so needs targeted multi-section HTML extraction.
- **Merge:** this week's refresh is in **PR #7** (direct push to `master` is blocked by the repo's git-guard hook). It's a clean fast-forward awaiting merge.
