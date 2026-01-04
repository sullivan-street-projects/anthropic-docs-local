# Anthropic Documentation Local Repository

> **HANDOFF DOCUMENT**: This plan is self-contained for implementation in a fresh context window. Read this file completely before starting implementation.

---

## Project Overview
Create a **pristine, comprehensive, always-current** local documentation repository for Anthropic resources. Designed for developers building solutions with Claude.

**Location:** `/Users/brettwohl/Documents/Claude Code Projects/anthropic-docs-local/`

## Design Principles

1. **GitHub-first** - Raw GitHub content converts perfectly to Markdown. This is the backbone.
2. **Git-versioned** - The repo itself is a git repo for tracking changes over time with real diffs.
3. **Self-documenting files** - Every Markdown file has YAML frontmatter with source provenance.
4. **Validation on fetch** - Content verified before saving to ensure quality.
5. **Clean extraction** - Web content uses targeted prompts to extract structured information.

## Directory Structure

```
anthropic-docs-local/
├── .git/                      # Git versioning for change tracking
├── manifest.json              # Master index tracking all sources
├── README.md                  # Project overview and usage instructions
│
├── api/                       # API Documentation
│   ├── overview.md
│   ├── messages-api.md
│   ├── tool-use.md
│   ├── vision.md
│   ├── streaming.md
│   └── errors.md
│
├── models/                    # Model Information
│   ├── overview.md
│   ├── claude-opus-4-5.md
│   ├── claude-sonnet-4-5.md
│   ├── claude-haiku-4-5.md
│   └── deprecations.md
│
├── sdks/                      # SDK Documentation
│   ├── python/
│   │   ├── README.md          # From GitHub raw
│   │   └── CHANGELOG.md       # From GitHub raw
│   ├── typescript/
│   │   ├── README.md
│   │   └── CHANGELOG.md
│   └── other/
│       └── overview.md
│
├── claude-code/               # Claude Code Documentation
│   ├── README.md              # From GitHub raw
│   ├── CHANGELOG.md           # From GitHub raw
│   ├── features.md
│   ├── hooks.md
│   ├── mcp-servers.md
│   └── plugins.md
│
├── agent-sdk/                 # Agent SDK Documentation
│   ├── README.md
│   ├── quickstart.md
│   └── examples.md
│
├── skills/                    # Agent Skills
│   ├── README.md              # From GitHub raw
│   └── catalog.md
│
├── cookbooks/                 # Tutorials & Examples
│   ├── index.md
│   └── examples/
│
├── release-notes/             # Release Notes & Changelogs
│   ├── platform.md
│   ├── api.md
│   └── help-center.md
│
└── github-repos/              # GitHub Repository Info
    └── index.md               # Complete listing of all Anthropic repos from GitHub API
```

## File Format (YAML Frontmatter)

Every Markdown file is self-documenting with YAML frontmatter:

```yaml
---
title: "Claude Code README"
source_url: "https://raw.githubusercontent.com/anthropics/claude-code/main/README.md"
source_type: "github-raw"        # github-raw | web-extracted | manual
fetched_at: "2026-01-03T10:30:00Z"
category: "claude-code"
---

# Actual content starts here...
```

## Manifest Schema (manifest.json)

Simplified manifest - git handles history, manifest tracks sources.

**Source Types:**
- `github-raw` - Direct raw.githubusercontent.com fetch (highest fidelity)
- `web-extracted` - Content extracted from web pages via WebFetch
- `github-api` - Data from GitHub API (repo listings, etc.)
- `manual` - Manually curated/synthesized content

### Complete Initial Manifest (copy this exactly for Phase 1, Step 4)

```json
{
  "schema_version": "1.0.0",
  "last_full_update": null,
  "sources": [
    {
      "id": "claude-code-readme",
      "name": "Claude Code README",
      "category": "claude-code",
      "local_path": "claude-code/README.md",
      "source_url": "https://raw.githubusercontent.com/anthropics/claude-code/main/README.md",
      "source_type": "github-raw",
      "priority": 1,
      "last_fetched": null,
      "status": "pending"
    },
    {
      "id": "claude-code-changelog",
      "name": "Claude Code CHANGELOG",
      "category": "claude-code",
      "local_path": "claude-code/CHANGELOG.md",
      "source_url": "https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md",
      "source_type": "github-raw",
      "priority": 1,
      "last_fetched": null,
      "status": "pending"
    },
    {
      "id": "claude-code-features",
      "name": "Claude Code Features",
      "category": "claude-code",
      "local_path": "claude-code/features.md",
      "source_url": "claude-code-guide-agent",
      "source_type": "manual",
      "priority": 4,
      "last_fetched": null,
      "status": "pending"
    },
    {
      "id": "claude-code-hooks",
      "name": "Claude Code Hooks",
      "category": "claude-code",
      "local_path": "claude-code/hooks.md",
      "source_url": "claude-code-guide-agent",
      "source_type": "manual",
      "priority": 4,
      "last_fetched": null,
      "status": "pending"
    },
    {
      "id": "claude-code-mcp",
      "name": "Claude Code MCP Servers",
      "category": "claude-code",
      "local_path": "claude-code/mcp-servers.md",
      "source_url": "claude-code-guide-agent",
      "source_type": "manual",
      "priority": 4,
      "last_fetched": null,
      "status": "pending"
    },
    {
      "id": "claude-code-plugins",
      "name": "Claude Code Plugins",
      "category": "claude-code",
      "local_path": "claude-code/plugins.md",
      "source_url": "claude-code-guide-agent",
      "source_type": "manual",
      "priority": 4,
      "last_fetched": null,
      "status": "pending"
    },
    {
      "id": "python-sdk-readme",
      "name": "Python SDK README",
      "category": "sdks",
      "local_path": "sdks/python/README.md",
      "source_url": "https://raw.githubusercontent.com/anthropics/anthropic-sdk-python/main/README.md",
      "source_type": "github-raw",
      "priority": 1,
      "last_fetched": null,
      "status": "pending"
    },
    {
      "id": "python-sdk-changelog",
      "name": "Python SDK CHANGELOG",
      "category": "sdks",
      "local_path": "sdks/python/CHANGELOG.md",
      "source_url": "https://raw.githubusercontent.com/anthropics/anthropic-sdk-python/main/CHANGELOG.md",
      "source_type": "github-raw",
      "priority": 1,
      "last_fetched": null,
      "status": "pending"
    },
    {
      "id": "typescript-sdk-readme",
      "name": "TypeScript SDK README",
      "category": "sdks",
      "local_path": "sdks/typescript/README.md",
      "source_url": "https://raw.githubusercontent.com/anthropics/anthropic-sdk-typescript/main/README.md",
      "source_type": "github-raw",
      "priority": 1,
      "last_fetched": null,
      "status": "pending"
    },
    {
      "id": "typescript-sdk-changelog",
      "name": "TypeScript SDK CHANGELOG",
      "category": "sdks",
      "local_path": "sdks/typescript/CHANGELOG.md",
      "source_url": "https://raw.githubusercontent.com/anthropics/anthropic-sdk-typescript/main/CHANGELOG.md",
      "source_type": "github-raw",
      "priority": 1,
      "last_fetched": null,
      "status": "pending"
    },
    {
      "id": "other-sdks-overview",
      "name": "Other SDKs Overview",
      "category": "sdks",
      "local_path": "sdks/other/overview.md",
      "source_url": "https://docs.anthropic.com/en/api/client-sdks",
      "source_type": "web-extracted",
      "priority": 3,
      "last_fetched": null,
      "status": "pending"
    },
    {
      "id": "skills-readme",
      "name": "Skills README",
      "category": "skills",
      "local_path": "skills/README.md",
      "source_url": "https://raw.githubusercontent.com/anthropics/skills/main/README.md",
      "source_type": "github-raw",
      "priority": 1,
      "last_fetched": null,
      "status": "pending"
    },
    {
      "id": "skills-catalog",
      "name": "Skills Catalog",
      "category": "skills",
      "local_path": "skills/catalog.md",
      "source_url": "https://github.com/anthropics/skills",
      "source_type": "web-extracted",
      "priority": 4,
      "last_fetched": null,
      "status": "pending"
    },
    {
      "id": "github-repos-index",
      "name": "GitHub Repos Index",
      "category": "github-repos",
      "local_path": "github-repos/index.md",
      "source_url": "https://api.github.com/orgs/anthropics/repos?per_page=100",
      "source_type": "github-api",
      "priority": 1,
      "last_fetched": null,
      "status": "pending"
    },
    {
      "id": "release-notes-platform",
      "name": "Platform Release Notes",
      "category": "release-notes",
      "local_path": "release-notes/platform.md",
      "source_url": "https://platform.claude.com/docs/en/release-notes/overview",
      "source_type": "web-extracted",
      "priority": 2,
      "last_fetched": null,
      "status": "pending"
    },
    {
      "id": "release-notes-api",
      "name": "API Release Notes",
      "category": "release-notes",
      "local_path": "release-notes/api.md",
      "source_url": "https://docs.anthropic.com/en/release-notes",
      "source_type": "web-extracted",
      "priority": 2,
      "last_fetched": null,
      "status": "pending"
    },
    {
      "id": "release-notes-help-center",
      "name": "Help Center Release Notes",
      "category": "release-notes",
      "local_path": "release-notes/help-center.md",
      "source_url": "https://support.claude.com/en/articles/12138966-release-notes",
      "source_type": "web-extracted",
      "priority": 2,
      "last_fetched": null,
      "status": "pending"
    },
    {
      "id": "api-overview",
      "name": "API Overview",
      "category": "api",
      "local_path": "api/overview.md",
      "source_url": "https://docs.anthropic.com/",
      "source_type": "web-extracted",
      "priority": 3,
      "last_fetched": null,
      "status": "pending"
    },
    {
      "id": "api-messages",
      "name": "Messages API",
      "category": "api",
      "local_path": "api/messages-api.md",
      "source_url": "https://docs.anthropic.com/en/api/messages",
      "source_type": "web-extracted",
      "priority": 3,
      "last_fetched": null,
      "status": "pending"
    },
    {
      "id": "api-tool-use",
      "name": "Tool Use Guide",
      "category": "api",
      "local_path": "api/tool-use.md",
      "source_url": "https://docs.anthropic.com/en/docs/build-with-claude/tool-use",
      "source_type": "web-extracted",
      "priority": 3,
      "last_fetched": null,
      "status": "pending"
    },
    {
      "id": "api-vision",
      "name": "Vision API",
      "category": "api",
      "local_path": "api/vision.md",
      "source_url": "https://docs.anthropic.com/en/docs/build-with-claude/vision",
      "source_type": "web-extracted",
      "priority": 3,
      "last_fetched": null,
      "status": "pending"
    },
    {
      "id": "api-streaming",
      "name": "Streaming API",
      "category": "api",
      "local_path": "api/streaming.md",
      "source_url": "https://docs.anthropic.com/en/api/streaming",
      "source_type": "web-extracted",
      "priority": 3,
      "last_fetched": null,
      "status": "pending"
    },
    {
      "id": "api-errors",
      "name": "API Errors",
      "category": "api",
      "local_path": "api/errors.md",
      "source_url": "https://docs.anthropic.com/en/api/errors",
      "source_type": "web-extracted",
      "priority": 3,
      "last_fetched": null,
      "status": "pending"
    },
    {
      "id": "models-overview",
      "name": "Models Overview",
      "category": "models",
      "local_path": "models/overview.md",
      "source_url": "https://docs.anthropic.com/en/docs/about-claude/models",
      "source_type": "web-extracted",
      "priority": 3,
      "last_fetched": null,
      "status": "pending"
    },
    {
      "id": "model-opus-4-5",
      "name": "Claude Opus 4.5",
      "category": "models",
      "local_path": "models/claude-opus-4-5.md",
      "source_url": "https://docs.anthropic.com/en/docs/about-claude/models",
      "source_type": "web-extracted",
      "priority": 3,
      "last_fetched": null,
      "status": "pending"
    },
    {
      "id": "model-sonnet-4-5",
      "name": "Claude Sonnet 4.5",
      "category": "models",
      "local_path": "models/claude-sonnet-4-5.md",
      "source_url": "https://docs.anthropic.com/en/docs/about-claude/models",
      "source_type": "web-extracted",
      "priority": 3,
      "last_fetched": null,
      "status": "pending"
    },
    {
      "id": "model-haiku-4-5",
      "name": "Claude Haiku 4.5",
      "category": "models",
      "local_path": "models/claude-haiku-4-5.md",
      "source_url": "https://docs.anthropic.com/en/docs/about-claude/models",
      "source_type": "web-extracted",
      "priority": 3,
      "last_fetched": null,
      "status": "pending"
    },
    {
      "id": "models-deprecations",
      "name": "Model Deprecations",
      "category": "models",
      "local_path": "models/deprecations.md",
      "source_url": "https://docs.anthropic.com/en/docs/resources/model-deprecations",
      "source_type": "web-extracted",
      "priority": 3,
      "last_fetched": null,
      "status": "pending"
    },
    {
      "id": "agent-sdk-readme",
      "name": "Agent SDK README",
      "category": "agent-sdk",
      "local_path": "agent-sdk/README.md",
      "source_url": "claude-code-guide-agent",
      "source_type": "manual",
      "priority": 4,
      "last_fetched": null,
      "status": "pending"
    },
    {
      "id": "agent-sdk-quickstart",
      "name": "Agent SDK Quickstart",
      "category": "agent-sdk",
      "local_path": "agent-sdk/quickstart.md",
      "source_url": "claude-code-guide-agent",
      "source_type": "manual",
      "priority": 4,
      "last_fetched": null,
      "status": "pending"
    },
    {
      "id": "agent-sdk-examples",
      "name": "Agent SDK Examples",
      "category": "agent-sdk",
      "local_path": "agent-sdk/examples.md",
      "source_url": "claude-code-guide-agent",
      "source_type": "manual",
      "priority": 4,
      "last_fetched": null,
      "status": "pending"
    },
    {
      "id": "cookbooks-index",
      "name": "Cookbooks Index",
      "category": "cookbooks",
      "local_path": "cookbooks/index.md",
      "source_url": "https://raw.githubusercontent.com/anthropics/anthropic-cookbook/main/README.md",
      "source_type": "github-raw",
      "priority": 4,
      "last_fetched": null,
      "status": "pending"
    }
  ]
}
```

**Total: 32 sources** across all categories.

## CRUD Operations

### CREATE (Initial Population)
1. Create project directory and initialize git repo
2. Create directory structure
3. Initialize manifest.json with all source definitions
4. Fetch content in priority order:
   - **Priority 1**: GitHub raw files (perfect fidelity)
   - **Priority 2**: Release notes and changelogs
   - **Priority 3**: API documentation (web-extracted)
   - **Priority 4**: Extended content (cookbooks, tutorials)
5. Add YAML frontmatter to each file
6. Git commit: "Initial population of Anthropic docs"

### READ (Query/Access)
- Plain Markdown files, browsable in any editor/IDE
- YAML frontmatter shows source and freshness at top of each file
- `manifest.json` provides programmatic index
- `git log` shows update history

### UPDATE (Refresh Content)
When user requests update:
1. Read manifest.json to get source URLs
2. Fetch new content from sources
3. Compare with existing files (git diff shows changes)
4. Update files with new content + updated `fetched_at`
5. Update `last_fetched` in manifest
6. Git commit with summary: "Update [category]: [summary of changes]"

**Update Commands I'll Recognize:**
- `"Update all docs"` → Full refresh of all sources
- `"Update [category]"` → Category-specific (e.g., "update claude-code")
- `"Update [specific file]"` → Single source refresh
- `"Check for updates"` → Fetch and report what changed (dry run)
- `"What changed since last update?"` → Show git log/diff

### DELETE (Remove Content)
- Remove deprecated sources from manifest
- Delete files via git (preserves history)
- `git log --diff-filter=D` shows deleted files if needed

---

## Implementation Steps (with QA Gates)

---

### Phase 1: Project Setup

**Objective:** Create the foundation for the documentation repository.

| Step | Task | Details |
|------|------|---------|
| 1 | Create project directory | `/Users/brettwohl/Documents/Claude Code Projects/anthropic-docs-local/` |
| 2 | Initialize git repository | `git init` |
| 3 | Create directory structure | All subdirectories per structure above |
| 4 | Create manifest.json | Include ALL sources with status "pending" |
| 5 | Create README.md | Project overview and instructions |

#### QA Gate 1: Project Foundation
**Must pass before proceeding to Phase 2**

| Check | Command/Method | Expected Result | Pass? |
|-------|----------------|-----------------|-------|
| Directory structure exists | `find . -type d` | 9 top-level dirs (api, models, sdks, claude-code, agent-sdk, skills, cookbooks, release-notes, github-repos) + 4 nested dirs (sdks/python, sdks/typescript, sdks/other, cookbooks/examples) | [ ] |
| Git initialized | `git status` | Shows "No commits yet" | [ ] |
| manifest.json valid | `cat manifest.json \| python -m json.tool` | Valid JSON, no errors | [ ] |
| manifest.json complete | Count sources in JSON | Exactly 32 sources defined | [ ] |
| README.md exists | `cat README.md` | Has title and description | [ ] |
| No errors | Review output | No error messages | [ ] |

**If QA Gate 1 Fails:**
- Fix any missing directories: `mkdir -p <path>`
- Fix JSON errors: validate and correct syntax
- Add missing sources to manifest.json
- Do NOT proceed until all checks pass

---

### Phase 2: GitHub Raw Content (Priority 1)

**Objective:** Fetch highest-fidelity content from GitHub raw URLs.

| Step | Task | Source URL |
|------|------|------------|
| 6 | claude-code/README.md | `https://raw.githubusercontent.com/anthropics/claude-code/main/README.md` |
| 7 | claude-code/CHANGELOG.md | `https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md` |
| 8 | sdks/python/README.md | `https://raw.githubusercontent.com/anthropics/anthropic-sdk-python/main/README.md` |
| 9 | sdks/python/CHANGELOG.md | `https://raw.githubusercontent.com/anthropics/anthropic-sdk-python/main/CHANGELOG.md` |
| 10 | sdks/typescript/README.md | `https://raw.githubusercontent.com/anthropics/anthropic-sdk-typescript/main/README.md` |
| 11 | sdks/typescript/CHANGELOG.md | `https://raw.githubusercontent.com/anthropics/anthropic-sdk-typescript/main/CHANGELOG.md` |
| 12 | skills/README.md | `https://raw.githubusercontent.com/anthropics/skills/main/README.md` |
| 13 | github-repos/index.md | `https://api.github.com/orgs/anthropics/repos?per_page=100` |
| 14 | cookbooks/index.md | `https://raw.githubusercontent.com/anthropics/anthropic-cookbook/main/README.md` |

**For each file:**
1. Fetch content using WebFetch
2. Add YAML frontmatter (title, source_url, source_type: github-raw, fetched_at, category)
3. Save to local path
4. Update manifest.json entry (last_fetched, status: current)

#### QA Gate 2: GitHub Content Integrity
**Must pass before proceeding to Phase 3**

| Check | Method | Expected Result | Pass? |
|-------|--------|-----------------|-------|
| All 9 files exist | `ls -la claude-code/ sdks/python/ sdks/typescript/ skills/ github-repos/ cookbooks/` | 9 .md files present | [ ] |
| YAML frontmatter valid | Check each file starts with `---` | All 9 files have frontmatter | [ ] |
| Content not empty | `wc -l <file>` for each | Each file > 10 lines | [ ] |
| Content matches source | Compare claude-code/README.md with GitHub | Content identical (except frontmatter) | [ ] |
| github-repos/index.md has repos | `grep -c "anthropic" github-repos/index.md` | Returns > 50 (repo count) | [ ] |
| manifest.json updated | Check last_fetched for these sources | All 9 sources have timestamps | [ ] |
| No fetch errors | Review fetch output | No 404s or timeouts | [ ] |

**If QA Gate 2 Fails:**
- Re-fetch failed files individually
- Check URL accessibility: `curl -I <url>`
- Verify GitHub API rate limits if github-repos failed
- Do NOT proceed until all checks pass

**Checkpoint Commit:** `git add -A && git commit -m "Phase 2: GitHub raw content"`

---

### Phase 3: Release Notes & Changelogs

**Objective:** Fetch release notes from web sources.

| Step | Task | Source URL | Extraction Prompt |
|------|------|------------|-------------------|
| 15 | release-notes/platform.md | `https://platform.claude.com/docs/en/release-notes/overview` | "Extract all release notes with dates, versions, and changes. Format as Markdown." |
| 16 | release-notes/api.md | `https://docs.anthropic.com/en/release-notes` | "Extract API changelog with dates and version info." |
| 17 | release-notes/help-center.md | `https://support.claude.com/en/articles/12138966-release-notes` | "Extract user-facing release notes with dates and feature descriptions." |

#### QA Gate 3: Release Notes Quality
**Must pass before proceeding to Phase 4**

| Check | Method | Expected Result | Pass? |
|-------|--------|-----------------|-------|
| All 3 files exist | `ls release-notes/` | platform.md, api.md, and help-center.md present | [ ] |
| YAML frontmatter valid | Check files start with `---` | All 3 have valid frontmatter | [ ] |
| Content has dates | `grep -E "[0-9]{4}" release-notes/*.md` | Multiple date matches | [ ] |
| Content has versions | `grep -iE "v?[0-9]+\.[0-9]+" release-notes/*.md` | Version numbers found | [ ] |
| No HTML artifacts | `grep -c "<div>\|<span>" release-notes/*.md` | Returns 0 (no raw HTML) | [ ] |
| Reasonable length | `wc -l release-notes/*.md` | Each file > 50 lines | [ ] |

**If QA Gate 3 Fails:**
- Re-fetch with more specific extraction prompts
- Manually clean HTML artifacts if present
- If source unavailable, mark as "error" in manifest and note in README

**Checkpoint Commit:** `git add -A && git commit -m "Phase 3: Release notes"`

---

### Phase 4: API Documentation (Web Extracted)

**Objective:** Extract API documentation from docs.anthropic.com.

| Step | Task | Source URL |
|------|------|------------|
| 18 | api/overview.md | `https://docs.anthropic.com/` |
| 19 | api/messages-api.md | `https://docs.anthropic.com/en/api/messages` |
| 20 | api/tool-use.md | `https://docs.anthropic.com/en/docs/build-with-claude/tool-use` |
| 21 | api/vision.md | `https://docs.anthropic.com/en/docs/build-with-claude/vision` |
| 22 | api/streaming.md | `https://docs.anthropic.com/en/api/streaming` |
| 23 | api/errors.md | `https://docs.anthropic.com/en/api/errors` |

**Extraction prompts should request:**
- Complete documentation content
- All parameters and their descriptions
- Code examples preserved with proper formatting
- Tables converted to Markdown tables

#### QA Gate 4: API Documentation Quality
**Must pass before proceeding to Phase 5**

| Check | Method | Expected Result | Pass? |
|-------|--------|-----------------|-------|
| All 6 files exist | `ls api/` | 6 .md files present | [ ] |
| YAML frontmatter valid | Check each file | All have valid frontmatter | [ ] |
| Code examples present | `grep -c "\`\`\`" api/*.md` | Multiple code blocks found | [ ] |
| No HTML artifacts | `grep -c "<div>\|<span>\|<p>" api/*.md` | Returns 0 | [ ] |
| Parameters documented | `grep -ci "parameter\|argument" api/messages-api.md` | > 5 matches | [ ] |
| Errors documented | `grep -c "error\|Error" api/errors.md` | > 10 matches | [ ] |
| Reasonable length | `wc -l api/*.md` | Each file > 30 lines | [ ] |

**If QA Gate 4 Fails:**
- Re-fetch with refined extraction prompts
- For stubborn HTML: post-process to remove tags
- If content incomplete, note in manifest and consider alternative sources

**Checkpoint Commit:** `git add -A && git commit -m "Phase 4: API documentation"`

---

### Phase 5: Model Information

**Objective:** Extract model specifications and comparisons.

| Step | Task | Source URL |
|------|------|------------|
| 24 | models/overview.md | `https://docs.anthropic.com/en/docs/about-claude/models` |
| 25 | models/claude-opus-4-5.md | Extract Opus 4.5 specific info |
| 26 | models/claude-sonnet-4-5.md | Extract Sonnet 4.5 specific info |
| 27 | models/claude-haiku-4-5.md | Extract Haiku 4.5 specific info |
| 28 | models/deprecations.md | `https://docs.anthropic.com/en/docs/resources/model-deprecations` |

#### QA Gate 5: Model Information Accuracy
**Must pass before proceeding to Phase 6**

| Check | Method | Expected Result | Pass? |
|-------|--------|-----------------|-------|
| All 5 files exist | `ls models/` | 5 .md files present | [ ] |
| YAML frontmatter valid | Check each file | All have valid frontmatter | [ ] |
| Model names correct | `grep -i "opus\|sonnet\|haiku" models/*.md` | Correct model names used | [ ] |
| Context windows documented | `grep -i "context" models/overview.md` | Context window info present | [ ] |
| Pricing mentioned | `grep -i "price\|cost\|token" models/*.md` | Pricing info found | [ ] |
| Deprecations listed | `grep -i "deprecat" models/deprecations.md` | Deprecation info present | [ ] |
| No outdated models | Manual review | No Claude 2.x as current | [ ] |

**If QA Gate 5 Fails:**
- Cross-reference with official model page
- Update incorrect model names/specs
- If pricing not available, note "See official pricing page"

**Checkpoint Commit:** `git add -A && git commit -m "Phase 5: Model information"`

---

### Phase 6: Extended Content

**Objective:** Fetch Claude Code details, Agent SDK, and cookbooks.

| Step | Task | Method |
|------|------|--------|
| 29 | claude-code/features.md | Use `claude-code-guide` agent |
| 30 | claude-code/hooks.md | Use `claude-code-guide` agent |
| 31 | claude-code/mcp-servers.md | Use `claude-code-guide` agent |
| 32 | claude-code/plugins.md | Use `claude-code-guide` agent |
| 33 | agent-sdk/README.md | Use `claude-code-guide` agent |
| 34 | agent-sdk/quickstart.md | Use `claude-code-guide` agent |
| 35 | agent-sdk/examples.md | Use `claude-code-guide` agent |

#### QA Gate 6: Extended Content Completeness
**Must pass before proceeding to Phase 7**

| Check | Method | Expected Result | Pass? |
|-------|--------|-----------------|-------|
| All 7 files exist | `ls claude-code/ agent-sdk/` | features.md, hooks.md, mcp-servers.md, plugins.md, README.md, quickstart.md, examples.md present | [ ] |
| YAML frontmatter valid | Check each file | All 7 have valid frontmatter | [ ] |
| Features documented | `grep -ci "feature\|capability" claude-code/features.md` | > 5 matches | [ ] |
| Hooks documented | `grep -ci "hook\|PreToolUse\|PostToolUse" claude-code/hooks.md` | > 5 matches | [ ] |
| MCP servers explained | `grep -ci "mcp\|server" claude-code/mcp-servers.md` | > 5 matches | [ ] |
| Plugins explained | `grep -ci "plugin\|skill" claude-code/plugins.md` | > 5 matches | [ ] |
| Agent SDK has examples | `grep -c "\`\`\`" agent-sdk/README.md` | > 0 code blocks | [ ] |
| Quickstart complete | `grep -ci "install\|setup\|start" agent-sdk/quickstart.md` | > 3 matches | [ ] |

**If QA Gate 6 Fails:**
- Re-query claude-code-guide agent with more specific prompts
- Check if content exists in official docs
- Mark unavailable items as "pending" in manifest

**Checkpoint Commit:** `git add -A && git commit -m "Phase 6: Extended content"`

---

### Phase 7: Finalization

**Objective:** Complete the repository and verify everything works.

| Step | Task | Details |
|------|------|---------|
| 36 | Verify YAML frontmatter | All .md files have valid frontmatter |
| 37 | Update manifest.json | All timestamps current, all statuses updated |
| 38 | Generate README TOC | Table of contents with all categories |
| 39 | Git commit | "Initial population of Anthropic docs" |
| 40 | Test single update | Re-fetch one file to verify update mechanism |

#### QA Gate 7: Repository Completeness (FINAL GATE)
**Must pass before repository is considered complete**

| Check | Method | Expected Result | Pass? |
|-------|--------|-----------------|-------|
| File count | `find . -name "*.md" \| wc -l` | >= 33 markdown files (32 sources + README) | [ ] |
| All frontmatter valid | Script to check all files | 100% have valid YAML | [ ] |
| manifest.json valid | JSON validation | Valid JSON, all sources listed | [ ] |
| manifest.json complete | Check each source | All have last_fetched timestamps | [ ] |
| No "pending" status | `grep "pending" manifest.json` | Returns 0 matches | [ ] |
| Git history clean | `git log --oneline` | Shows phase commits | [ ] |
| README has TOC | `grep -c "##" README.md` | Multiple section headers | [ ] |
| Update test passed | Re-fetch test file | File updates correctly | [ ] |
| No empty files | `find . -name "*.md" -empty` | Returns nothing | [ ] |
| No error files | `grep "error" manifest.json` | 0 sources with error status | [ ] |

**If QA Gate 7 Fails:**
- Address each failing check individually
- Re-run previous phase QA gates if needed
- Do NOT proceed to Phase 8 until 100% pass

**Final Commit:** `git add -A && git commit -m "Phase 7: Repository finalization complete"`

---

## Complete Source Registry

### GitHub Raw (Highest Fidelity - Priority 1)
| ID | Source URL |
|----|------------|
| claude-code-readme | https://raw.githubusercontent.com/anthropics/claude-code/main/README.md |
| claude-code-changelog | https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md |
| python-sdk-readme | https://raw.githubusercontent.com/anthropics/anthropic-sdk-python/main/README.md |
| python-sdk-changelog | https://raw.githubusercontent.com/anthropics/anthropic-sdk-python/main/CHANGELOG.md |
| typescript-sdk-readme | https://raw.githubusercontent.com/anthropics/anthropic-sdk-typescript/main/README.md |
| typescript-sdk-changelog | https://raw.githubusercontent.com/anthropics/anthropic-sdk-typescript/main/CHANGELOG.md |
| skills-readme | https://raw.githubusercontent.com/anthropics/skills/main/README.md |
| cookbooks-index | https://raw.githubusercontent.com/anthropics/anthropic-cookbook/main/README.md |

### GitHub API (Priority 1)
| ID | Source URL |
|----|------------|
| github-repos-index | https://api.github.com/orgs/anthropics/repos?per_page=100 |

### Web Documentation
| ID | Source URL | Extraction Focus |
|----|------------|------------------|
| platform-release-notes | https://platform.claude.com/docs/en/release-notes/overview | Release announcements |
| api-docs-overview | https://docs.anthropic.com/ | API introduction |
| api-messages | https://docs.anthropic.com/en/api/messages | Messages API spec |
| api-tool-use | https://docs.anthropic.com/en/docs/build-with-claude/tool-use | Tool use guide |
| model-opus-4-5 | https://docs.anthropic.com/en/docs/about-claude/models | Model specifications |
| help-center-releases | https://support.claude.com/en/articles/12138966-release-notes | User-facing updates |

---

## Phase 8: Testing & Validation

**Objective:** Verify all functionality works correctly before creating the update command.

### Functional Tests

| Step | Test | Method | Expected |
|------|------|--------|----------|
| 41 | File existence | `find . -name "*.md" -type f` | All expected files exist |
| 42 | Frontmatter validity | Parse YAML from each file | All files have valid YAML |
| 43 | Manifest-file sync | Compare manifest paths to actual files | 100% match |
| 44 | Single-file update | Re-fetch `claude-code/CHANGELOG.md` | File updates, frontmatter timestamp changes |
| 45 | Category update | Re-fetch all `release-notes/*` | Only release-notes files affected |
| 46 | Full update | Re-fetch all sources | All files refreshed, manifest updated |
| 47 | Git commit creation | Check `git log` after update | Commit created with descriptive message |
| 48 | Dry-run mode | "Check for updates" without saving | Report generated, no files changed |

### Quality Checks

| Step | Check | Method | Expected |
|------|-------|--------|----------|
| 49 | GitHub content fidelity | Diff local vs source | Identical (except frontmatter) |
| 50 | Web content quality | Manual review of api/*.md | No HTML artifacts, readable |
| 51 | Link validity | Extract and test URLs | No 404 errors |
| 52 | Source URL accessibility | Fetch each manifest URL | All sources reachable |

#### QA Gate 8: Testing Complete
**Must pass before proceeding to Phase 9**

| Check | Method | Expected Result | Pass? |
|-------|--------|-----------------|-------|
| All functional tests pass | Run steps 41-48 | 8/8 passed | [ ] |
| All quality checks pass | Run steps 49-52 | 4/4 passed | [ ] |
| Update mechanism works | Test update command | Files update correctly | [ ] |
| Git history correct | `git log --oneline` | Phase commits visible | [ ] |
| No regressions | Re-run QA Gate 7 | Still passing | [ ] |

**If QA Gate 8 Fails:**
- Document which tests failed
- Fix underlying issues
- Re-run all tests from beginning
- Do NOT proceed to Phase 9 until 100% pass

**Checkpoint Commit:** `git add -A && git commit -m "Phase 8: Testing validated"`

---

## Phase 9: Auto-Update Command

**Objective:** Create a reusable Claude Code skill for updating the documentation.

### Command: `/update-anthropic-docs`

**Location:** `~/.claude/commands/update-anthropic-docs.md`

**Behavior:**
```
/update-anthropic-docs              → Full update (all sources)
/update-anthropic-docs claude-code  → Category update
/update-anthropic-docs --check      → Dry run, report changes only
/update-anthropic-docs --discover   → Search for new sources
```

### Implementation Steps

| Step | Task | Details |
|------|------|---------|
| 53 | Create command file | `~/.claude/commands/update-anthropic-docs.md` |
| 54 | Define YAML frontmatter | name, description, arguments |
| 55 | Write command instructions | How to read manifest, fetch, update |
| 56 | Add category filtering | Support category argument |
| 57 | Add dry-run mode | --check flag behavior |
| 58 | Add discovery mode | --discover flag behavior |
| 59 | Test full update | Run `/update-anthropic-docs` |
| 60 | Test category update | Run `/update-anthropic-docs claude-code` |
| 61 | Test dry-run | Run `/update-anthropic-docs --check` |

### Skill Content Structure
```markdown
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

## Repository Location
`/Users/brettwohl/Documents/Claude Code Projects/anthropic-docs-local/`

## Instructions

1. Read manifest.json from the repository
2. Filter by category if provided: $ARGUMENTS.category
3. Determine mode from flags

### Update Mode (default)
For each source in manifest:
- Fetch content from source_url
- Add/update YAML frontmatter with new fetched_at timestamp
- Compare with existing file
- If changed: save and log
- Update manifest.json last_fetched
- Git commit with summary

### Check Mode (--check)
- Fetch all sources but do NOT save
- Report what would change
- Output unchanged/changed/error counts

### Discover Mode (--discover)
- Query GitHub API for new anthropics repos
- Check for new doc pages
- Report findings for user approval
```

#### QA Gate 9: Auto-Update Command Functional
**Must pass before proceeding to Phase 10**

| Check | Method | Expected Result | Pass? |
|-------|--------|-----------------|-------|
| Command file exists | `ls ~/.claude/commands/update-anthropic-docs.md` | File present | [ ] |
| YAML frontmatter valid | Parse frontmatter | Valid YAML with name, description | [ ] |
| Full update works | `/update-anthropic-docs` | All files updated, commit created | [ ] |
| Category update works | `/update-anthropic-docs claude-code` | Only claude-code/* updated | [ ] |
| Dry-run works | `/update-anthropic-docs --check` | Report shown, no files changed | [ ] |
| Manifest updated | Check manifest.json after update | Timestamps updated | [ ] |
| Git commit created | `git log -1` | Shows update commit | [ ] |
| Error handling | Test with invalid category | Graceful error message | [ ] |

**If QA Gate 9 Fails:**
- Review command file syntax
- Check path references are correct
- Ensure manifest.json path is absolute
- Test each mode independently

**Checkpoint Commit:** `git add -A && git commit -m "Phase 9: Auto-update command created"`

---

## Phase 10: Discovery Mode

**Objective:** Implement discovery of new Anthropic resources not yet in manifest.

### Discovery Sources
| Source | URL/Method | What to Find |
|--------|------------|--------------|
| GitHub repos | `https://api.github.com/orgs/anthropics/repos?sort=created` | New repositories |
| GitHub releases | `https://api.github.com/repos/anthropics/{repo}/releases` | New versions |
| docs.anthropic.com | WebFetch sitemap/navigation | New documentation pages |
| Anthropic blog | `https://www.anthropic.com/news` | Technical announcements |
| npm registry | `https://registry.npmjs.org/@anthropic-ai/sdk` | New SDK versions |
| PyPI | `https://pypi.org/pypi/anthropic/json` | New SDK versions |

### Implementation Steps

| Step | Task | Details |
|------|------|---------|
| 62 | Implement GitHub repo discovery | Query API, compare to manifest |
| 63 | Implement GitHub release tracking | Check latest release for each tracked repo |
| 64 | Implement npm version check | Compare local changelog version to npm |
| 65 | Implement PyPI version check | Compare local changelog version to PyPI |
| 66 | Create discovery report format | Structured output of findings |
| 67 | Add user approval workflow | Ask before adding new sources |
| 68 | Test discovery with new source | Verify new source can be added |

### Discovery Output Format
```
=== Discovery Report (2026-01-15) ===

NEW REPOSITORIES FOUND:
  - anthropics/new-tool
    Created: 2026-01-10
    Description: A new tool for...
    Stars: 342
    → Suggest adding: github-repos/new-tool.md

NEW RELEASES:
  - claude-code v1.2.0 (2026-01-12)
    → Already tracking CHANGELOG, will update on next refresh
  - anthropic-sdk-python v0.35.0 (2026-01-14)
    → Already tracking CHANGELOG, will update on next refresh

NEW SDK VERSIONS:
  - @anthropic-ai/sdk: 0.35.0 (npm) vs 0.34.0 (local)
    → Update sdks/typescript/CHANGELOG.md

NEW DOCUMENTATION DETECTED:
  - https://docs.anthropic.com/en/docs/new-feature
    → Suggest adding: api/new-feature.md

SUMMARY:
  - 1 new repository to add
  - 2 changelogs need refresh
  - 1 new documentation page
```

#### QA Gate 10: Discovery Mode Functional
**Must pass before proceeding to Phase 11**

| Check | Method | Expected Result | Pass? |
|-------|--------|-----------------|-------|
| GitHub repo discovery works | `/update-anthropic-docs --discover` | Lists anthropics repos | [ ] |
| Compares to manifest | Review output | Shows which repos are new | [ ] |
| Release tracking works | Check output | Shows latest releases | [ ] |
| npm version check works | Check output | Shows npm vs local version | [ ] |
| Report is readable | Review output format | Clear, structured output | [ ] |
| User approval works | Test adding new source | Prompts before adding | [ ] |
| New source adds correctly | Add and verify | New file created, manifest updated | [ ] |
| No false positives | Review discoveries | All items are genuinely new | [ ] |

**If QA Gate 10 Fails:**
- Check API URLs are correct
- Verify manifest parsing works
- Test each discovery source independently
- Ensure rate limits aren't hit

**Checkpoint Commit:** `git add -A && git commit -m "Phase 10: Discovery mode implemented"`

---

## Phase 11: Long-term Maintenance Strategy

**Objective:** Create documentation and procedures for ongoing maintenance.

### Handling Anthropic Growth

As Anthropic releases new products/features, the system should adapt:

#### Manifest Evolution
- **New categories**: Add new top-level directories as needed
- **Deprecated sources**: Mark status as "deprecated", optionally archive
- **URL changes**: Update source_url, maintain local_path for continuity
- **Schema versioning**: Bump manifest version when structure changes

#### Scaling Considerations
| Growth Scenario | Handling Strategy |
|-----------------|-------------------|
| New SDK languages | Add `sdks/{language}/` directory |
| New products (e.g., Claude Apps) | Add new category, update manifest schema |
| Documentation restructure | Re-map URLs, preserve git history |
| Content explosion (100+ files) | Consider category subdirectories |

#### Maintenance Schedule Recommendations
| Frequency | Action | Command |
|-----------|--------|---------|
| Weekly | Check what changed | `/update-anthropic-docs --check` |
| After major releases | Full update + discovery | `/update-anthropic-docs` then `--discover` |
| Monthly | Review deprecated sources | Manual manifest review |
| Quarterly | Audit completeness | Compare to docs.anthropic.com |

### Implementation Steps

| Step | Task | Details |
|------|------|---------|
| 69 | Add schema_version to manifest.json | For future migrations |
| 70 | Create MAINTENANCE.md | Document all procedures |
| 71 | Document category addition process | Step-by-step guide |
| 72 | Create new source template | Copy-paste for new entries |
| 73 | Document cron/launchd setup | For scheduled checks |
| 74 | Create notification mechanism | Alert on discoveries |
| 75 | Final repository audit | Verify everything complete |

### MAINTENANCE.md Content

```markdown
# Anthropic Docs Local - Maintenance Guide

## Quick Commands
- Update all: `/update-anthropic-docs`
- Update category: `/update-anthropic-docs <category>`
- Check only: `/update-anthropic-docs --check`
- Discover new: `/update-anthropic-docs --discover`

## Adding a New Source
1. Add entry to manifest.json:
   {
     "id": "unique-id",
     "name": "Human Name",
     "category": "category-name",
     "local_path": "category/filename.md",
     "source_url": "https://...",
     "source_type": "github-raw|web-extracted",
     "priority": 1-4,
     "last_fetched": null,
     "status": "pending"
   }
2. Run: /update-anthropic-docs category-name
3. Verify file created with correct content

## Deprecating a Source
1. Set status to "deprecated" in manifest.json
2. Optionally: git rm <file>
3. Commit: "Deprecate: source-name"

## Scheduled Checks (optional)
Add to crontab:
  0 9 * * 1 cd /path/to/repo && /update-anthropic-docs --check >> /var/log/anthropic-docs.log

## Troubleshooting
- 404 errors: Check source URL changed
- Empty content: WebFetch prompt may need adjustment
- Rate limits: Wait and retry, or use authenticated requests
```

#### QA Gate 11: Maintenance Documentation Complete (FINAL)
**Must pass for project to be considered complete**

| Check | Method | Expected Result | Pass? |
|-------|--------|-----------------|-------|
| schema_version in manifest | Check manifest.json | Field exists with value | [ ] |
| MAINTENANCE.md exists | `cat MAINTENANCE.md` | Comprehensive guide | [ ] |
| Quick commands documented | Review MAINTENANCE.md | All commands listed | [ ] |
| Add source process documented | Review MAINTENANCE.md | Step-by-step guide | [ ] |
| Deprecation process documented | Review MAINTENANCE.md | Clear instructions | [ ] |
| Cron setup documented | Review MAINTENANCE.md | Example crontab entry | [ ] |
| Troubleshooting section | Review MAINTENANCE.md | Common issues covered | [ ] |
| All phases committed | `git log --oneline` | 11 phase commits | [ ] |
| No pending sources | `grep "pending" manifest.json` | Returns 0 | [ ] |
| Repository ready for use | Run full workflow | All commands work | [ ] |

**If QA Gate 11 Fails:**
- Complete missing documentation sections
- Verify all previous QA gates still pass
- Run full end-to-end test

**Final Commit:** `git add -A && git commit -m "Phase 11: Maintenance documentation complete - Repository ready"`

---

## Project Summary

### Total Implementation Steps: 75
- Phase 1: Project Setup (5 steps: 1-5)
- Phase 2: GitHub Raw Content (9 steps: 6-14)
- Phase 3: Release Notes (3 steps: 15-17)
- Phase 4: API Documentation (6 steps: 18-23)
- Phase 5: Model Information (5 steps: 24-28)
- Phase 6: Extended Content (7 steps: 29-35)
- Phase 7: Finalization (5 steps: 36-40)
- Phase 8: Testing (12 steps: 41-52)
- Phase 9: Auto-Update Command (9 steps: 53-61)
- Phase 10: Discovery Mode (7 steps: 62-68)
- Phase 11: Maintenance (7 steps: 69-75)

### QA Gates: 11 total
Each phase has a mandatory QA gate that must pass before proceeding.

### Git Commits: 11 checkpoints
One commit per phase for clear history.

---

## Notes

- All timestamps in ISO 8601 format (e.g., `2026-01-03T10:30:00Z`)
- Git provides version history (no need for content hashing)
- Every Markdown file self-documents via YAML frontmatter
- Update operations are idempotent (safe to run multiple times)
- GitHub raw URLs always fetch latest from default branch
- Discovery mode requires user approval before adding new sources
- Manifest schema versioning enables graceful evolution
- **CRITICAL**: Do NOT proceed past any QA gate until all checks pass
