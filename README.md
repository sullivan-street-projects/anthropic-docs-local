# Anthropic Documentation Local Repository

A **pristine, comprehensive, always-current** local documentation repository for Anthropic resources. Designed for developers building solutions with Claude.

## Overview

This repository provides offline access to Anthropic documentation with:
- **Self-documenting files** - Every Markdown file has YAML frontmatter with source provenance
- **Git-versioned** - Track changes over time with real diffs
- **GitHub-first** - Raw GitHub content for highest fidelity
- **Validation on fetch** - Content verified before saving

## Directory Structure

```
anthropic-docs-local/
├── api/                  # API Documentation
├── models/               # Model Information
├── sdks/                 # SDK Documentation
│   ├── python/
│   ├── typescript/
│   └── other/
├── claude-code/          # Claude Code Documentation
├── agent-sdk/            # Agent SDK Documentation
├── skills/               # Agent Skills
├── cookbooks/            # Tutorials & Examples
├── release-notes/        # Release Notes & Changelogs
└── github-repos/         # GitHub Repository Info
```

## Usage

### Browse Documentation
Navigate to any `.md` file to read documentation. Each file includes:
- YAML frontmatter with source URL and fetch timestamp
- Original content from the source

### Update Documentation
Use the project's update command to refresh content (run from this directory):
```bash
/update-anthropic-docs              # Full update (all sources)
/update-anthropic-docs claude-code  # Category update
/update-anthropic-docs --check      # Dry run, report changes only
/update-anthropic-docs --discover   # Search for new sources
```

The command is stored in `.claude/commands/update-anthropic-docs.md`.

### View Change History
```bash
git log --oneline           # View update history
git diff HEAD~1             # View last changes
git log --diff-filter=D     # View deleted files
```

## File Format

Every Markdown file is self-documenting:

```yaml
---
title: "Example Document"
source_url: "https://example.com/doc"
source_type: "github-raw"
fetched_at: "2026-01-03T10:30:00Z"
category: "category-name"
---

# Content starts here...
```

## Source Types

| Type | Description |
|------|-------------|
| `github-raw` | Direct raw.githubusercontent.com fetch (highest fidelity) |
| `web-extracted` | Content extracted from web pages |
| `github-api` | Data from GitHub API |
| `manual` | Manually curated/synthesized content |

## Manifest

The `manifest.json` file tracks all documentation sources with:
- Source URLs and local paths
- Fetch timestamps and status
- Priority levels for update ordering

## Maintenance

See [MAINTENANCE.md](MAINTENANCE.md) for detailed maintenance procedures.
