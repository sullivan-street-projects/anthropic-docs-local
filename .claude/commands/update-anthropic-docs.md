---
name: update-anthropic-docs
description: Update local Anthropic documentation repository
arguments:
  - name: category
    description: Category to update (api, models, sdks, claude-code, agent-sdk, skills, cookbooks, release-notes, github-repos)
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

## Repository Location

`/Users/brettwohl/Documents/Claude Code Projects/anthropic-docs-local/`

## Mode Detection

Parse the arguments to determine the mode:
- If `$ARGUMENTS` contains `--check`: **Check Mode** (dry run)
- If `$ARGUMENTS` contains `--discover`: **Discovery Mode**
- Otherwise: **Update Mode**

If a category is provided (e.g., `claude-code`, `api`, `models`), only update sources in that category.

## Update Mode (Default)

1. Read `manifest.json` from the repository
2. Filter sources by category if provided
3. For each source with `source_type` of `github-raw`:
   - Fetch content from `source_url` using WebFetch
   - Add YAML frontmatter with updated `fetched_at` timestamp
   - Compare with existing file content
   - If changed: save the file and log the change
   - Update `last_fetched` in manifest.json
4. For sources with `source_type` of `web-extracted`:
   - Use WebFetch with appropriate prompts to extract content
   - Follow the same save/compare logic
5. For sources with `source_type` of `manual`:
   - Use the claude-code-guide agent to get current documentation
   - Update the file if content has changed
6. After all updates:
   - Update `last_full_update` in manifest.json if doing full update
   - Create a git commit with summary of changes

### Commit Message Format
```
Update: <category or "all"> - <count> files updated

Files updated:
- file1.md
- file2.md
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

4. **Output Discovery Report**
   ```
   === Discovery Report ===

   NEW REPOSITORIES:
   - repo-name (created: date, stars: N)

   NEW SDK VERSIONS:
   - npm @anthropic-ai/sdk: X.Y.Z (local has: A.B.C)
   - PyPI anthropic: X.Y.Z (local has: A.B.C)

   SUGGESTIONS:
   - Add github-repos/new-repo.md for new-repo
   - Update sdks/typescript/CHANGELOG.md
   ```

5. Ask user for approval before adding any new sources

## Source Type Handling

| Type | Fetch Method | Notes |
|------|--------------|-------|
| `github-raw` | WebFetch direct URL | Highest fidelity, use raw content |
| `web-extracted` | WebFetch with extraction prompt | Parse HTML, extract main content |
| `github-api` | WebFetch API endpoint | Parse JSON response |
| `manual` | claude-code-guide agent | Synthesize from internal docs |

## Error Handling

- If a source fails to fetch, log the error and continue with other sources
- Report all errors at the end
- Do not commit if all sources failed
- For rate limits: wait and retry once, then skip if still failing

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
