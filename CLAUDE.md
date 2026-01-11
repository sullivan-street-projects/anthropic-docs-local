# Anthropic Docs Local

A comprehensive local repository of Anthropic documentation, research, and resources.

## Purpose

This repository aggregates scattered Anthropic documentation into a single source of truth for:
- Informing AI agent development with current best practices
- Providing offline access to critical documentation
- Maintaining version-controlled history of documentation changes
- Enabling consistent reference across projects

## Architecture

```
anthropic-docs-local/
├── manifest.json          # Central registry of all sources (the "constitution")
├── CLAUDE.md              # This file - project guidelines
├── schemas/               # JSON schemas for validation
├── scripts/               # Automation scripts
├── docs/                  # Generated documentation
└── [category]/            # Content organized by category
    └── *.md               # Markdown files with YAML frontmatter
```

## Categories

| Category | Description | Source Types |
|----------|-------------|--------------|
| api | API documentation | web-extracted |
| models | Model specifications | web-extracted |
| sdks | Python/TypeScript SDK docs | github-raw |
| claude-code | Claude Code documentation | github-raw, manual |
| agent-sdk | Agent SDK documentation | manual |
| skills | Agent Skills | github-raw |
| cookbooks | Tutorials and examples | github-raw |
| release-notes | Release notes | web-extracted |
| github-repos | Repository index | github-api |
| research | Research papers and summaries | web-extracted, arxiv-pdfs |

## Update Procedures

### Running Updates

```bash
# Update all sources
/update-anthropic-docs

# Update specific category
/update-anthropic-docs claude-code

# Check for changes without updating
/update-anthropic-docs --check

# Discover new sources
/update-anthropic-docs --discover
```

### Source Types

| Type | Method | Confidence |
|------|--------|------------|
| `github-raw` | Direct fetch from GitHub raw URLs | High |
| `github-api` | GitHub API endpoint parsing | High |
| `web-extracted` | WebFetch with content extraction | Medium |
| `manual` | Agent-synthesized from internal docs | Medium |
| `arxiv-pdfs` | Downloaded PDF papers | High |

### Adding New Sources

1. Add entry to `manifest.json` with required fields:
   - `id`: Unique identifier
   - `name`: Human-readable name
   - `category`: One of the valid categories
   - `local_path`: Relative path from repo root
   - `source_url`: Original source URL
   - `source_type`: One of the valid types
   - `last_fetched`: ISO 8601 timestamp

2. Create the local file with YAML frontmatter:
   ```yaml
   ---
   title: "Document Title"
   source_url: "https://..."
   source_type: "github-raw"
   fetched_at: "2026-01-10T00:00:00Z"
   category: "category-name"
   ---
   ```

3. Run validation: `node scripts/validate.js`
4. Commit with descriptive message

## Quality Criteria

### Required for All Sources
- Valid YAML frontmatter with required fields
- Matching entry in manifest.json
- Consistent timestamps (fetched_at matches last_fetched)

### Content Standards
- Preserve original content structure where possible
- Add navigation aids (tables, lists) for long documents
- Include source attribution in frontmatter
- No manual edits to auto-fetched content (will be overwritten)

### Validation Rules
- All manifest entries must have corresponding files
- All files with frontmatter must have manifest entries
- JSON schemas must validate
- Internal links must resolve

## Commit Conventions

```
<type>: <category or "all"> - <description>

Types:
- Update: Content refresh from sources
- Add: New sources or categories
- Fix: Corrections or repairs
- Refactor: Structure changes without content changes
```

## Known Limitations

1. **Web-extracted sources** may drift from originals if page structure changes
2. **Manual sources** require agent re-synthesis to update
3. **PDF papers** are snapshots; check arXiv for updates
4. **Rate limits** may affect bulk updates; use `--check` first

## Verification

Before committing changes:
1. Run `node scripts/validate.js` - all checks must pass
2. Spot-check changed files for obvious issues
3. Verify manifest.json is valid JSON
4. Check that frontmatter timestamps are current

## Related Files

- [manifest.json](manifest.json) - Source registry
- [RALPH-PROMPT.md](RALPH-PROMPT.md) - Iterative improvement prompt
- [docs/architecture.md](docs/architecture.md) - Generated architecture overview
