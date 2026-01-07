# Anthropic Docs Local - Maintenance Guide

## Quick Commands

Run these commands from the project directory in Claude Code:

| Command | Description |
|---------|-------------|
| `/update-anthropic-docs` | Update all sources |
| `/update-anthropic-docs <category>` | Update specific category |
| `/update-anthropic-docs --check` | Dry run, report changes only |

The update command is stored in `.claude/commands/update-anthropic-docs.md`.

## Adding a New Source

1. Add entry to `manifest.json`:

```json
{
  "id": "unique-id",
  "name": "Human Readable Name",
  "category": "category-name",
  "local_path": "category/filename.md",
  "source_url": "https://...",
  "source_type": "github-raw|web-extracted|github-api|manual",
  "last_fetched": null
}
```

2. Run update for the category:
```bash
/update-anthropic-docs category-name
```

3. Verify the file was created with correct content and frontmatter

4. Commit the changes:
```bash
git add manifest.json category/filename.md
git commit -m "Add source: source-name"
```

## Removing a Source

1. Remove entry from `manifest.json`
2. Delete the file: `git rm <file>`
3. Commit: `git commit -m "Remove: source-name"`

## Source Types

| Type | When to Use |
|------|-------------|
| `github-raw` | Direct raw.githubusercontent.com links (highest fidelity) |
| `web-extracted` | Content extracted from web pages via WebFetch |
| `github-api` | Structured data from GitHub API |
| `manual` | Content synthesized from multiple sources or documentation |

## Troubleshooting

### 404 Errors
- Source URL may have changed
- Check if the repository/page was moved or renamed
- Update `source_url` in manifest if needed

### Empty Content
- WebFetch prompt may need adjustment
- Try fetching manually to diagnose
- Check if the page requires authentication

### Rate Limits
- GitHub API: 60 requests/hour unauthenticated, 5000/hour with token
- Wait and retry, or configure `GITHUB_TOKEN`

### Stale Content
- Run `/update-anthropic-docs --check` to identify outdated sources
- Force refresh: delete the file and re-fetch

### Merge Conflicts
- manifest.json conflicts: prefer newer timestamps
- Content conflicts: prefer upstream (source) version

## Manifest Schema

The `manifest.json` file uses schema version `1.0.0`:

```json
{
  "schema_version": "1.0.0",
  "last_full_update": "2026-01-04T00:00:00Z",
  "sources": [...]
}
```

## Git Workflow

```bash
# View update history
git log --oneline

# View last changes
git diff HEAD~1

# View deleted files
git log --diff-filter=D --name-only

# Restore a deleted file
git checkout HEAD~1 -- path/to/file.md
```

## Categories

| Category | Contents |
|----------|----------|
| `claude-code` | Claude Code CLI documentation |
| `api` | API reference and guides |
| `models` | Model information and pricing |
| `sdks` | SDK documentation (Python, TypeScript, etc.) |
| `agent-sdk` | Agent SDK documentation |
| `skills` | Agent Skills documentation |
| `release-notes` | Platform and API release notes |
| `cookbooks` | Tutorials and examples |
| `github-repos` | Anthropic GitHub repository index |
