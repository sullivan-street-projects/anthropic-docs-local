---
name: update-anthropic-docs
description: |
  Fetch and update Anthropic documentation sources from external URLs (GitHub, anthropic.com, arXiv).
  Use when: "refresh docs", "update sources", "sync documentation", "run discovery", "check for new content".
  Do NOT use for: manually editing docs, reviewing specific content, answering questions about docs.
arguments:
  - name: category
    description: Category to update (api, models, sdks, claude-code, agent-sdk, skills, cookbooks, release-notes, github-repos, research, news, engineering)
    required: false
  - name: --check
    description: Dry run - report changes without saving
    required: false
  - name: --discover
    description: Search for new Anthropic sources not yet tracked
    required: false
  - name: --diff
    description: Show content differences between local files and sources
    required: false
  - name: --resume
    description: Resume an interrupted update from .update-session.json
    required: false
---

# Update Anthropic Documentation

You are updating the local Anthropic documentation repository.

## CRITICAL: Completeness Requirement

**You MUST update ALL source types.** Every update run must cover:
1. `github-raw` sources (direct fetch)
2. `web-extracted` sources (WebFetch + extraction)
3. `manual` sources (WebFetch source URLs + re-synthesis)
4. `arxiv-pdfs` sources (search for new papers)
5. `github-api` sources (API fetch)

**Do NOT skip any source type.** The most common failure mode is skipping `manual` and `arxiv-pdfs` sources. These MUST be updated every time.

## Pre-Run: Load Context

Before any mode, read these files for accumulated project knowledge:
- `tasks/lessons.md` — known issues and patterns
- `tasks/update-failures.md` — source-specific failure history (if exists)

## Mode Detection

Parse the arguments to determine the mode:
- If `$ARGUMENTS` contains `--check`: **Check Mode** (dry run)
- If `$ARGUMENTS` contains `--discover`: **Discovery Mode**
- If `$ARGUMENTS` contains `--diff`: **Diff Mode** (content drift detection)
- If `$ARGUMENTS` contains `--resume`: **Resume Mode** (continue interrupted update)
- Otherwise: **Update Mode**

If a category is provided (e.g., `claude-code`, `api`, `models`, `research`), only update sources in that category.

### Resume Mode (--resume)

If `.update-session.json` exists in the repo root:
1. Read the session state file
2. Skip sources listed in `completed_sources`
3. Retry sources listed in `failed_sources` (they may have been transient failures)
4. Continue from the last recorded `phase`
5. Report: "Resuming update from Phase {N}. {X} sources already completed, {Y} to go."

If no session file exists, report "No interrupted session found" and exit.

## Update Mode (Default)

### Phase 0: Plan confirmation

1. Read `manifest.json`
2. Count sources by `source_type` and `category` (filtered if category provided)
3. Present the plan to the user:
   ```
   Update plan:
   - X github-raw sources
   - Y web-extracted sources
   - Z manual sources
   - W arxiv-pdfs entries
   - V github-api sources
   Total: N sources across M categories
   ```
4. Wait for user confirmation before proceeding
5. If user says "skip" or "just do it", proceed without further confirmation

### Phase 1: Read manifest and plan (write session state)

1. Read `manifest.json` from the repository
1b. **Write session state**: Create `.update-session.json` with:
    ```json
    {
      "started_at": "<ISO timestamp>",
      "phase": 1,
      "category_filter": "<category or null>",
      "total_sources": <N>,
      "completed_sources": [],
      "failed_sources": []
    }
    ```
2. Filter sources by category if provided
3. Group sources by `source_type`
4. Report the plan to the user: "Updating X github-raw, Y web-extracted, Z manual, W arxiv-pdfs sources"

### Phase 2: Launch parallel agents by source type

Launch up to 3 parallel agents to maximize throughput. Each agent MUST use the Write or Edit tool to save files — not just report what should change.

**Agent 1: github-raw sources**
- Fetch content from `source_url` using WebFetch
- For CHANGELOGs: fetch without frontmatter, compare to existing
- For READMEs: add YAML frontmatter with updated `fetched_at`
- Save changed files with Write/Edit tool
- Update manifest.json `last_fetched` timestamps

**Agent 2: web-extracted sources**
- Use WebFetch with extraction prompts for each source
- Read existing file first, then update with new content
- Preserve YAML frontmatter format, update `fetched_at`
- Save changed files with Write/Edit tool
- Update manifest.json `last_fetched` timestamps

**Agent 3: manual + arxiv-pdfs sources**
- For `manual` sources: WebFetch the source URL, read existing file, re-synthesize content preserving structure
- For `arxiv-pdfs`: WebSearch for new Anthropic papers on arXiv, update the papers index
- Save changed files with Write/Edit tool
- Update manifest.json `last_fetched` timestamps

### Phase 2.5: Quick Discovery Scan (every update)

**Every update run must include a lightweight discovery scan** to catch new content published since the last update. This prevents the "only updating known sources" problem where new publications get missed indefinitely.

Launch 1 agent in parallel with Phase 2 to:

1. **Scan index pages** — WebFetch these 3 pages and extract all article/post links:
   - `https://www.anthropic.com/news`
   - `https://www.anthropic.com/engineering`
   - `https://www.anthropic.com/research`
2. **Compare against manifest** — Check every discovered URL against manifest `source_url` values
3. **Search for recent content** — WebSearch: `anthropic.com {current_month} {current_year}` to catch anything published very recently
4. **Report findings** — If new sources are found, report them to the user after the update completes:
   ```
   === New Content Detected During Update ===
   The following content was found on anthropic.com but is not yet tracked:
   - {title} ({url}) — suggested category: {category}

   Run `/update-anthropic-docs --discover` for a full discovery scan,
   or approve adding these sources now.
   ```
5. **Do NOT block the update** — The scan runs alongside the update agents. New sources are reported but not automatically added.

### Phase 3: Verify and commit

1. **VERIFY writes persisted**: After agents complete, check `git diff --stat HEAD` to confirm files were actually modified. If an agent reported changes but `git status` shows no modifications, the agent failed to write — you must redo those updates directly.
2. Run `node scripts/validate.js` — all checks must pass (Layer 1 errors are blocking; Layer 4 warnings are advisory)
3. Run `node scripts/generate-architecture.js` — regenerate the architecture overview
4. Update `last_full_update` in manifest.json if doing full update
5. Stage all changed files by name (not `git add -A`)
6. Create a git commit with summary of changes
7. Push to the current branch
8. **Clean up session state**: Delete `.update-session.json` (successful completion)

### Commit Message Format
```
Update: <category or "all"> - <count> files updated

<summary of notable content changes, not just timestamp updates>

Files updated:
- file1.md (content changed / timestamp only)
- file2.md (content changed / timestamp only)
```

### Phase 4: Meta-synthesis (self-improvement)

**This phase runs after every full update.** Its purpose: the repo just ingested the latest Anthropic intelligence — now use it to improve the repo itself.

Skip this phase if:
- Only a single category was updated (not a full run)
- The user explicitly says to skip it
- No content actually changed (timestamp-only updates)

#### 4a. Identify content changes with improvement potential

Review `git diff` from the Phase 3 commit. Focus on files where **content actually changed** (not just timestamps). For each changed file, ask:

> "Does this updated content contain principles, patterns, or practices that our own infrastructure (scripts, schemas, skill, validation, CLAUDE.md) should follow but currently doesn't?"

Prioritize changes in:
- `engineering/*.md` — engineering best practices
- `claude-code/*.md` — Claude Code features and patterns
- `skills/*.md` — skill design guidance
- `research/*.md` — alignment and evaluation principles
- `api/*.md` — API patterns (error handling, structured outputs, rate limiting)

#### 4b. Cross-reference against current infrastructure

For each actionable finding, check whether the repo already implements it:
1. Read `scripts/validate.js` — does validation cover this?
2. Read `.claude/commands/update-anthropic-docs.md` — does the update skill follow this?
3. Read `CLAUDE.md` — is this documented as a project guideline?
4. Read `schemas/*.json` — does the schema support this?
5. Read `tasks/lessons.md` — is this already a known pattern?

#### 4c. Generate improvement report

If improvements are found, output a structured report:

```
=== Meta-Synthesis Report ===
Date: {current_date}
Content changes analyzed: {count}
Improvements identified: {count}

INFRASTRUCTURE IMPROVEMENTS:
  1. [source_file] teaches [principle]
     Currently: [what the repo does now]
     Should: [what it should do instead]
     Files to change: [list]
     Effort: LOW / MEDIUM / HIGH

  2. ...

ALREADY ALIGNED:
  - [principle] from [source_file] — already implemented in [infrastructure_file]

NO ACTION NEEDED:
  - {count} content changes had no infrastructure implications
```

#### 4d. Apply or defer

- **LOW effort improvements** (adding a field to schema, updating a description, adding a validation check): Apply immediately, include in a follow-up commit:
  ```
  Refactor: meta-synthesis - apply lessons from {source_file}
  ```
- **MEDIUM effort** (rewriting a function, restructuring a skill section): Add to `docs/plans/meta-analysis-optimizations.md` as a pending item
- **HIGH effort** (new scripts, architectural changes): Add to the plan and ask the user whether to proceed

#### 4e. Staleness detection

Check for sources that may be dead or relocated:

1. Parse manifest.json for each source's `last_fetched` and `sha256`
2. Flag any source where **content has not changed for 3+ consecutive full updates** (same `sha256` across runs)
3. For flagged sources, attempt a fresh fetch to confirm:
   - **Still accessible, just stable**: Mark as `stable` in the report (no action needed)
   - **404 / connection error**: Mark as `possibly-dead` — log to `tasks/update-failures.md` and alert user
   - **Redirects to new URL**: Mark as `relocated` — update `source_url` in manifest.json
4. Output a staleness summary:
   ```
   === Staleness Report ===
   Stable (unchanged but accessible): {count}
   Possibly dead: {count}
     - {source_id}: {url} — {error}
   Relocated: {count}
     - {source_id}: {old_url} → {new_url}
   ```

#### 4f. Trend summary

If `tasks/meta-synthesis-log.md` has 3+ entries, generate a running trend summary at the top of the file (replacing any previous summary):

```
## Trends (auto-generated)

Total cycles logged: {N}
Total improvements applied: {N}
Total improvements deferred: {N}
Most-improved infrastructure: {file} ({N} changes)
Most-informative category: {category} ({N} insights sourced from it)
Staleness alerts: {N} sources flagged across all cycles
Last cycle: {date} — {applied} applied, {deferred} deferred
```

This gives a quick health check without reading every entry.

#### 4g. Update memory files

After the meta-synthesis:
1. **Append to `tasks/meta-synthesis-log.md`** — structured entry for this run (see log format in that file)
2. **Update `tasks/lessons.md`** with any new patterns discovered
3. **Update `tasks/discovery-log.md`** if new sources were found in Phase 2.5
4. **Log any failures** from this update run to `tasks/update-failures.md`

This creates a continuous improvement loop: content updates feed infrastructure improvements, which produce better content updates.

## Check Mode (--check)

1. Read manifest.json
2. For each source (filtered by category if provided):
   - Fetch current content from source
   - Compare to local file
   - Report status: UNCHANGED, CHANGED, ERROR, or NEW
3. Output summary:
   ```
   === Update Check Report ===
   Unchanged: X files
   Changed: Y files
   Errors: Z files

   Changed files:
   - path/to/file1.md
   - path/to/file2.md
   ```
4. Do NOT save any files or create commits

## Diff Mode (--diff)

Content drift detection — compare local files against their sources to find subtle changes.

1. Read manifest.json (filter by category if provided)
2. For each source:
   - Fetch current content from `source_url`
   - Compare against local file content (not just hash)
   - Analyze the diff:
     - **Size change**: Is the fetched content significantly shorter (>20% reduction)? Flag as possible truncation
     - **Section changes**: Are major headings missing or renamed?
     - **Content additions**: New sections in the source not in local file
3. Output report:
   ```
   === Content Drift Report ===

   SIGNIFICANT DRIFT:
   - path/to/file.md — 30% shorter than source (possible truncation)
   - path/to/file2.md — 3 sections removed, 1 added

   MINOR CHANGES:
   - path/to/file3.md — wording updates, no structural change

   UNCHANGED:
   - X files match their sources
   ```
4. Do NOT save any files or create commits

## Discovery Mode (--discover)

Discovery is the most important mode. Its purpose is to find content Anthropic has published that we don't yet track. **Be thorough — the whole point is to catch things we'd otherwise miss.**

Launch up to 5 parallel agents, one per discovery area below. Each agent must:
- Read manifest.json to know what's already tracked
- Search thoroughly using the methods described
- Return a structured list of findings with URLs, titles, and suggested category/path

### 1. Anthropic Website Content Discovery (CRITICAL)

This is the most commonly missed area. Anthropic publishes blog posts, research articles, case studies, PDFs, and announcements on their website without any notification system.

**a) News articles (anthropic.com/news)**
- WebFetch `https://www.anthropic.com/news` and extract ALL article links from the page
- Paginate if the page has pagination or "load more" — fetch subsequent pages
- Compare every discovered URL against `source_url` values in manifest.json
- Any URL not in the manifest is a NEW source to report

**b) Engineering blog posts (anthropic.com/engineering)**
- WebFetch `https://www.anthropic.com/engineering` and extract ALL article links
- Paginate if applicable
- Compare every discovered URL against manifest source_urls
- Report new posts

**c) Research publications (anthropic.com/research)**
- WebFetch `https://www.anthropic.com/research` and extract ALL links to research articles
- This page often has sub-sections (alignment, interpretability, policy, etc.) — crawl each
- Look for links to PDFs, external papers, and research blog posts
- Compare against manifest source_urls
- Report new research

**d) PDF and downloadable content discovery**
- WebSearch for `site:anthropic.com filetype:pdf` to find PDFs published on anthropic.com
- WebSearch for `site:assets.anthropic.com filetype:pdf` for assets hosted separately
- Check any new pages discovered in (a), (b), (c) for links to downloadable PDFs
- PDFs are high-value content that's easy to miss — flag ALL untracked PDFs

**e) Product and documentation pages**
- WebFetch `https://docs.anthropic.com` and extract the sitemap or navigation structure
- WebFetch `https://docs.anthropic.com/sitemap.xml` if available
- WebFetch `https://www.anthropic.com/api` for API documentation page links
- WebFetch `https://www.anthropic.com/claude` and related product pages
- Compare discovered documentation URLs against manifest
- Look for entirely new sections (e.g., new product lines, new API features)

**f) Claude Code documentation**
- WebFetch `https://code.claude.com/docs/en` or the Claude Code docs index
- Extract all documentation page links
- Compare against manifest — look for new feature docs, guides, or tutorials

### 2. GitHub Discovery

**a) New repositories**
- Fetch: `https://api.github.com/orgs/anthropics/repos?sort=created&per_page=100`
- If 100 results returned, fetch page 2: append `&page=2`
- Compare to repos already tracked in manifest
- Report any new repositories with name, description, stars, created date

**b) New releases and tags**
- For each tracked github-raw source, check if the repo has new releases
- Use `https://api.github.com/repos/anthropics/{repo}/releases?per_page=5`
- Report new releases that might indicate significant content changes

### 3. SDK Version Checks

- npm: Check `https://registry.npmjs.org/@anthropic-ai/sdk` for latest version
- PyPI: Check `https://pypi.org/pypi/anthropic/json` for latest version
- Also check for new SDKs: WebSearch for "anthropic official SDK" to find any new language SDKs
- Compare to versions mentioned in local CHANGELOGs

### 4. Research Paper Discovery

**a) arXiv papers**
- WebSearch: `arxiv anthropic AI research paper {current_year}`
- WebSearch: `arxiv.org anthropic {current_year}` (different query for broader results)
- WebSearch for specific known Anthropic researchers (e.g., "Dario Amodei arxiv", "Chris Olah arxiv", "Jan Leike arxiv")
- Compare to papers already indexed in research/papers/index.md
- Report any new papers found

**b) Non-arXiv research**
- WebSearch: `anthropic research paper {current_year} -arxiv` to find papers on other platforms
- WebSearch: `anthropic whitepaper {current_year}` for whitepapers
- WebSearch: `anthropic technical report {current_year}` for technical reports
- Check Google Scholar if accessible

### 5. Broader Content Search (catch-all)

This is the safety net for content that doesn't fit the above categories.

- WebSearch: `anthropic.com new {current_month} {current_year}` for very recent content
- WebSearch: `anthropic announcement {current_year}` for announcements
- WebSearch: `anthropic case study {current_year}` for case studies and customer stories
- WebSearch: `anthropic guide tutorial {current_year}` for new guides
- WebSearch: `anthropic API changelog {current_year}` for API changes not in release notes
- Cross-reference ALL discovered URLs against the full manifest source_url list

### 6. Output Discovery Report

```
=== Discovery Report ===
Discovery date: {current_date}
Sources checked: {count from manifest}

WEBSITE CONTENT:
  New news articles: {count}
  - {title} ({url})
  New engineering posts: {count}
  - {title} ({url})
  New research articles: {count}
  - {title} ({url})
  New PDFs found: {count}
  - {title} ({url})
  New documentation pages: {count}
  - {title} ({url})

GITHUB:
  New repositories: {count}
  - {repo-name} (created: {date}, stars: {N}, description: {desc})
  New releases: {count}
  - {repo}/{tag} ({date})

SDK VERSIONS:
  - npm @anthropic-ai/sdk: {version} (local has: {version})
  - PyPI anthropic: {version} (local has: {version})

RESEARCH PAPERS:
  New arXiv papers: {count}
  - {title} (arXiv: {id}, {date})
  New non-arXiv papers: {count}
  - {title} ({url})

BROADER SEARCH FINDINGS:
  - {description} ({url})

SUGGESTIONS:
  For each new item, suggest:
  - category, local_path, source_type
  - Priority: HIGH (core docs/research), MEDIUM (blog/news), LOW (peripheral)
```

### 7. Post-Discovery Actions

- Ask user for approval before adding any new sources
- For approved sources, add manifest entries and fetch content immediately
- Update the `last_discovery_run` field in manifest.json metadata

## Source Type Handling

See `references/source-types.md` for detailed handling instructions per source type.

**Quick reference:** github-raw (direct fetch), web-extracted (WebFetch + extract), github-api (API parse), manual (re-synthesize from source), arxiv-pdfs (search + download).

**Manual sources MUST be updated every run** — see the key list in `references/source-types.md`.

## Error Handling

See `references/failure-patterns.md` for detailed failure diagnosis and resolution.

**Key rules:**
- If a source fails, log the error and continue with others
- Do not commit if ALL sources failed
- For rate limits: retry once with backoff, then skip
- If an agent reports success but files unchanged on disk: retry directly
- **After any failure**: log to `tasks/update-failures.md`

## Post-Update Verification Checklist

Before reporting completion, verify:
- [ ] `git diff --stat HEAD` shows changes for ALL source types (not just github-raw)
- [ ] `node scripts/validate.js` passes (0 errors; warnings are advisory)
- [ ] `node scripts/generate-architecture.js` ran successfully
- [ ] Manual sources have updated `fetched_at` timestamps
- [ ] Research papers index has been checked for new papers
- [ ] manifest.json `last_fetched` timestamps match file `fetched_at` timestamps
- [ ] Phase 4 meta-synthesis ran (for full updates) or was explicitly skipped
- [ ] `tasks/lessons.md` updated if new patterns were discovered
- [ ] `tasks/update-failures.md` updated if any sources failed

## Categories

Valid categories for filtering:
- `api` - API documentation
- `models` - Model information
- `sdks` - SDK documentation (Python, TypeScript, others)
- `claude-code` - Claude Code documentation
- `agent-sdk` - Agent SDK documentation
- `skills` - Agent Skills
- `cookbooks` - Tutorials and examples
- `release-notes` - Release notes
- `github-repos` - GitHub repository index
- `research` - Research papers and publications
- `news` - Anthropic news and announcements (anthropic.com/news)
- `engineering` - Engineering blog posts (anthropic.com/engineering)

## Post-Push Branch Check

After pushing, ALWAYS run:
```bash
git fetch --all && git branch -r --no-merged master
```
If any unmerged remote branches exist, report them to the user. Do NOT say "in sync" unless this check returns empty.
