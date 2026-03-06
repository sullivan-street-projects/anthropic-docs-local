---
name: update-anthropic-docs
description: Update local Anthropic documentation repository
arguments:
  - name: category
    description: Category to update (api, models, sdks, claude-code, agent-sdk, skills, cookbooks, release-notes, github-repos, research, news, engineering)
    required: false
  - name: --check
    description: Dry run - report changes without saving
    required: false
  - name: --discover
    description: Search for new Anthropic sources
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

## Mode Detection

Parse the arguments to determine the mode:
- If `$ARGUMENTS` contains `--check`: **Check Mode** (dry run)
- If `$ARGUMENTS` contains `--discover`: **Discovery Mode**
- Otherwise: **Update Mode**

If a category is provided (e.g., `claude-code`, `api`, `models`, `research`), only update sources in that category.

## Update Mode (Default)

### Phase 1: Read manifest and plan

1. Read `manifest.json` from the repository
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

### Phase 3: Verify and commit

1. **VERIFY writes persisted**: After agents complete, check `git diff --stat HEAD` to confirm files were actually modified. If an agent reported changes but `git status` shows no modifications, the agent failed to write — you must redo those updates directly.
2. Run `node scripts/validate.js` — all checks must pass
3. Update `last_full_update` in manifest.json if doing full update
4. Stage all changed files by name (not `git add -A`)
5. Create a git commit with summary of changes
6. Push to the current branch

### Commit Message Format
```
Update: <category or "all"> - <count> files updated

<summary of notable content changes, not just timestamp updates>

Files updated:
- file1.md (content changed / timestamp only)
- file2.md (content changed / timestamp only)
```

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

## Discovery Mode (--discover)

1. **GitHub Repository Discovery**
   - Fetch: `https://api.github.com/orgs/anthropics/repos?sort=created&per_page=100`
   - Compare to repos already tracked in manifest
   - Report any new repositories

2. **New Documentation Detection**
   - Check known documentation URLs for new pages
   - Look for new sections in existing docs

3. **SDK Version Checks**
   - npm: Check `https://registry.npmjs.org/@anthropic-ai/sdk` for latest version
   - PyPI: Check `https://pypi.org/pypi/anthropic/json` for latest version
   - Compare to versions mentioned in local CHANGELOGs

4. **arXiv Paper Discovery**
   - WebSearch for recent Anthropic arXiv papers
   - Compare to papers already indexed in research/papers/index.md
   - Report any new papers found

5. **Output Discovery Report**
   ```
   === Discovery Report ===

   NEW REPOSITORIES:
   - repo-name (created: date, stars: N)

   NEW SDK VERSIONS:
   - npm @anthropic-ai/sdk: X.Y.Z (local has: A.B.C)
   - PyPI anthropic: X.Y.Z (local has: A.B.C)

   NEW ARXIV PAPERS:
   - Title (arXiv: XXXX.XXXXX, date)

   SUGGESTIONS:
   - Add github-repos/new-repo.md for new-repo
   - Update sdks/typescript/CHANGELOG.md
   ```

5. Ask user for approval before adding any new sources

## Source Type Handling

| Type | Fetch Method | Notes |
|------|--------------|-------|
| `github-raw` | WebFetch direct URL | Highest fidelity, use raw content as-is |
| `web-extracted` | WebFetch with extraction prompt | Parse HTML, extract main content |
| `github-api` | WebFetch API endpoint | Parse JSON response |
| `manual` | WebFetch source URL + re-synthesize | Read source page, rewrite local file with current content |
| `arxiv-pdfs` | WebSearch + arXiv search | Find new papers, update index |

### Manual Source Update Protocol

Manual sources require special handling because they are agent-synthesized:

1. **Read** the existing local file completely
2. **Fetch** the source URL with WebFetch
3. **Compare** fetched content to existing file
4. **Re-synthesize**: Update the local file with new information while preserving the established structure (headings, tables, code blocks)
5. **Update timestamp** in frontmatter to current date
6. **VERIFY**: Read the file back to confirm the write succeeded

The key manual sources that MUST be updated every run:
- `claude-code/features.md` — from https://code.claude.com/docs/en/features-overview
- `claude-code/hooks.md` — from https://code.claude.com/docs/en/hooks
- `claude-code/mcp-servers.md` — from https://code.claude.com/docs/en/mcp
- `claude-code/plugins.md` — from https://code.claude.com/docs/en/plugins
- `agent-sdk/README.md` — from https://platform.claude.com/docs/en/agent-sdk/overview
- `agent-sdk/quickstart.md` — from https://platform.claude.com/docs/en/agent-sdk/quickstart
- `agent-sdk/examples.md` — from https://platform.claude.com/docs/en/agent-sdk/overview

## Error Handling

- If a source fails to fetch, log the error and continue with other sources
- Report all errors at the end
- Do not commit if all sources failed
- For rate limits: wait and retry once, then skip if still failing
- If an agent reports success but files are unchanged on disk, retry the update directly (not via agent)

## Post-Update Verification Checklist

Before reporting completion, verify:
- [ ] `git diff --stat HEAD` shows changes for ALL source types (not just github-raw)
- [ ] `node scripts/validate.js` passes
- [ ] Manual sources have updated `fetched_at` timestamps
- [ ] Research papers index has been checked for new papers
- [ ] manifest.json `last_fetched` timestamps match file `fetched_at` timestamps

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
