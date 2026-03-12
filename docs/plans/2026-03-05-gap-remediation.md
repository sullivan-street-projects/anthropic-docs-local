# Gap Remediation — 48 Missing Sources

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Close all content gaps identified by the March 5, 2026 research swarm — add ~48 missing sources across 9 categories.

**Architecture:** Each task adds sources in batches by type. `github-raw` sources use `curl -sL` (never WebFetch). `web-extracted` sources use WebFetch with extraction prompts. All new sources get manifest entries + YAML frontmatter. Commit after each task.

**Tech Stack:** curl, WebFetch, bash, node (validate.js)

## Success Criteria

| # | Criterion | How to Verify |
|---|-----------|---------------|
| 1 | Claude Code CHANGELOG.md contains v2.1.69 entries from raw upstream | `grep -c "2.1.69" claude-code/CHANGELOG.md` returns >= 1 |
| 2 | All 7 github-raw files have `fetched_at: "2026-03-05` in frontmatter | `grep -l 'fetched_at: "2026-03-05' claude-code/README.md sdks/python/README.md sdks/python/CHANGELOG.md sdks/typescript/README.md sdks/typescript/CHANGELOG.md skills/README.md cookbooks/index.md` returns 7 files |
| 3 | `news/` directory exists with at least 7 .md files | `ls news/*.md | wc -l` returns >= 7 |
| 4 | 3 new research files exist | `ls research/deprecation-updates-opus-3.md research/persona-selection-model.md research/ai-fluency-index.md` succeeds |
| 5 | Engineering blog posts directory exists with files | `ls engineering/*.md | wc -l` returns >= 1 |
| 6 | At least 10 new platform docs pages exist under `api/` | `ls api/adaptive-thinking.md api/compaction.md api/fast-mode.md api/skills-guide.md api/memory-tool.md` succeeds |
| 7 | `agent-sdk/typescript-v2-preview.md` exists | `test -f agent-sdk/typescript-v2-preview.md` exits 0 |
| 8 | `release-notes/platform.md` contains Feb 19, 2026 entry | `grep -c "February 19, 2026" release-notes/platform.md` returns >= 1 |
| 9 | `release-notes/help-center.md` contains March 2, 2026 entry | `grep -c "March 2" release-notes/help-center.md` returns >= 1 |
| 10 | `github-repos/index.md` contains agent-sdk-workshop | `grep -c "agent-sdk-workshop" github-repos/index.md` returns >= 1 |
| 11 | `skills/catalog.md` mentions partner skills | `grep -ci "partner" skills/catalog.md` returns >= 1 |
| 12 | manifest.json has >= 55 source entries (currently 40, adding ~48 but some overlap) | `grep -c '"id":' manifest.json` returns >= 55 |
| 13 | `node scripts/validate.js` passes | Exit code 0, no errors |
| 14 | No unmerged remote branches after push | `git branch -r --no-merged master` returns empty |

---

### Task 1: Re-sync Claude Code CHANGELOG (github-raw)

**Files:**
- Modify: `claude-code/CHANGELOG.md`
- Modify: `manifest.json` (update sha256 + timestamp)

**Step 1: Download raw changelog**
```bash
curl -sL "https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md" > /tmp/cc-changelog.md
```

**Step 2: Rebuild with frontmatter**
```bash
printf '%s\n' '---' 'title: "Claude Code CHANGELOG"' 'source_url: "https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md"' 'source_type: "github-raw"' 'fetched_at: "2026-03-05T12:00:00Z"' 'category: "claude-code"' '---' > claude-code/CHANGELOG.md
cat /tmp/cc-changelog.md >> claude-code/CHANGELOG.md
```

**Step 3: Update manifest sha256 and timestamp**
```bash
sha256sum claude-code/CHANGELOG.md | awk '{print $1}'
```
Update `manifest.json` entry `claude-code-changelog` with new sha256 and `last_fetched`.

**Step 4: Commit**
```bash
git add claude-code/CHANGELOG.md manifest.json
git commit -m "Update: claude-code - re-sync CHANGELOG via curl (v2.1.69)"
```

---

### Task 2: Re-sync all github-raw sources

**Files:**
- Modify: `claude-code/README.md`
- Modify: `sdks/python/README.md`, `sdks/python/CHANGELOG.md`
- Modify: `sdks/typescript/README.md`, `sdks/typescript/CHANGELOG.md`
- Modify: `skills/README.md`
- Modify: `cookbooks/index.md`
- Modify: `manifest.json`

**Step 1: Download each raw file to /tmp**
```bash
curl -sL "https://raw.githubusercontent.com/anthropics/claude-code/main/README.md" > /tmp/cc-readme.md
curl -sL "https://raw.githubusercontent.com/anthropics/anthropic-sdk-python/main/README.md" > /tmp/py-readme.md
curl -sL "https://raw.githubusercontent.com/anthropics/anthropic-sdk-python/main/CHANGELOG.md" > /tmp/py-changelog.md
curl -sL "https://raw.githubusercontent.com/anthropics/anthropic-sdk-typescript/main/README.md" > /tmp/ts-readme.md
curl -sL "https://raw.githubusercontent.com/anthropics/anthropic-sdk-typescript/main/CHANGELOG.md" > /tmp/ts-changelog.md
curl -sL "https://raw.githubusercontent.com/anthropics/skills/main/README.md" > /tmp/skills-readme.md
curl -sL "https://raw.githubusercontent.com/anthropics/anthropic-cookbook/main/README.md" > /tmp/cookbook-readme.md
```

**Step 2: Rebuild each file with frontmatter (same pattern as Task 1)**

**Step 3: Update all sha256 hashes in manifest.json**

**Step 4: Commit**
```bash
git add -A
git commit -m "Update: all - re-sync 7 github-raw sources via curl"
```

---

### Task 3: Add news/announcements (7 new web-extracted sources)

**Files:**
- Create: `news/` directory
- Create: `news/claude-code-security.md`
- Create: `news/detecting-distillation-attacks.md`
- Create: `news/responsible-scaling-policy-v3.md`
- Create: `news/acquires-vercept.md`
- Create: `news/statement-department-of-war.md`
- Create: `news/statement-secretary-war-comments.md`
- Create: `news/labor-market-impacts.md`
- Modify: `manifest.json` (7 new entries)

**Step 1: Create news directory**
```bash
mkdir -p news
```

**Step 2: Fetch each article via WebFetch**
For each URL, use WebFetch with prompt: "Extract the full article content including title, date, and body text. Preserve structure and formatting."

URLs:
- `https://www.anthropic.com/news/claude-code-security` (Feb 20)
- `https://www.anthropic.com/news/detecting-and-preventing-distillation-attacks` (Feb 23)
- `https://www.anthropic.com/news/responsible-scaling-policy-v3` (Feb 24)
- `https://www.anthropic.com/news/acquires-vercept` (Feb 25)
- `https://www.anthropic.com/news/statement-department-of-war` (Feb 26)
- `https://www.anthropic.com/news/statement-comments-secretary-war` (Feb 27)
- `https://www.anthropic.com/research/labor-market-impacts` (Mar 5)

**Step 3: Write each file with frontmatter**
```yaml
---
title: "[Article Title]"
source_url: "https://www.anthropic.com/news/..."
source_type: "web-extracted"
fetched_at: "2026-03-05T12:00:00Z"
category: "news"
---
```

**Step 4: Add 7 entries to manifest.json** with category `news`

**Step 5: Commit**
```bash
git add news/ manifest.json
git commit -m "Add: news - 7 announcements (Feb 20 - Mar 5)"
```

---

### Task 4: Add research posts (3 new web-extracted sources)

**Files:**
- Create: `research/deprecation-updates-opus-3.md`
- Create: `research/persona-selection-model.md`
- Create: `research/ai-fluency-index.md`
- Modify: `manifest.json` (3 new entries)

**Step 1: Fetch each via WebFetch**
- `https://www.anthropic.com/research/deprecation-updates-opus-3` (Feb 25)
- `https://www.anthropic.com/research/persona-selection-model` (Feb 23)
- `https://www.anthropic.com/research/AI-fluency-index` (Feb 23)

**Step 2: Write files with frontmatter** (category: `research`)

**Step 3: Add manifest entries**

**Step 4: Commit**
```bash
git add research/ manifest.json
git commit -m "Add: research - 3 new posts (Feb 23-25)"
```

---

### Task 5: Add engineering blog posts (7 new web-extracted sources)

**Files:**
- Create: `claude-code/` or `api/` (context-dependent placement)
- Modify: `manifest.json` (up to 7 new entries)

**Step 1: Fetch each URL via WebFetch to confirm it exists and get dates**
- `https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents`
- `https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents`
- `https://www.anthropic.com/engineering/multi-agent-research-system`
- `https://www.anthropic.com/engineering/writing-tools-for-agents`
- `https://www.anthropic.com/engineering/AI-resistant-technical-evaluations`
- `https://www.anthropic.com/engineering/a-postmortem-of-three-recent-issues`
- `https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents`

**Step 2: For each confirmed post, write file with frontmatter**
- Place agent-related posts in a new `engineering/` directory
- Category: new category `engineering` or place under existing categories

**Step 3: Add manifest entries**

**Step 4: Commit**
```bash
git add engineering/ manifest.json
git commit -m "Add: engineering - N blog posts"
```

**Note:** Some of these may predate Feb 20. The fetcher should verify dates and only add genuinely new content. Posts already referenced in existing docs (e.g., building-effective-agents) may already be captured — check before duplicating.

---

### Task 6: Add platform docs pages (14 new web-extracted sources)

**Files:**
- Create: `api/adaptive-thinking.md`
- Create: `api/compaction.md`
- Create: `api/context-editing.md`
- Create: `api/fast-mode.md`
- Create: `api/skills-guide.md`
- Create: `api/usage-cost-api.md`
- Create: `api/claude-code-analytics-api.md`
- Create: `api/claude-in-microsoft-foundry.md`
- Create: `api/memory-tool.md`
- Create: `api/tool-search-tool.md`
- Create: `api/web-fetch-tool.md`
- Create: `api/web-search-tool.md`
- Create: `api/whats-new-claude-4-6.md`
- Create: `agent-sdk/typescript-v2-preview.md`
- Modify: `manifest.json` (14 new entries)

**Step 1: Fetch each page via WebFetch**
URLs (all under `platform.claude.com/docs/en/`):
- `build-with-claude/adaptive-thinking`
- `build-with-claude/compaction`
- `build-with-claude/context-editing`
- `build-with-claude/fast-mode`
- `build-with-claude/skills-guide`
- `build-with-claude/usage-cost-api`
- `build-with-claude/claude-code-analytics-api`
- `build-with-claude/claude-in-microsoft-foundry`
- `agents-and-tools/tool-use/memory-tool`
- `agents-and-tools/tool-use/tool-search-tool`
- `agents-and-tools/tool-use/web-fetch-tool`
- `agents-and-tools/tool-use/web-search-tool`
- `about-claude/models/whats-new-claude-4-6`
- `agent-sdk/typescript-v2-preview`

**Step 2: Write files with frontmatter** (category: `api` or `agent-sdk`)

**Step 3: Add 14 manifest entries**

**Step 4: Commit**
```bash
git add api/ agent-sdk/ manifest.json
git commit -m "Add: api + agent-sdk - 14 new platform docs pages"
```

---

### Task 7: Update release notes (web-extracted refresh)

**Files:**
- Modify: `release-notes/platform.md`
- Modify: `release-notes/help-center.md`
- Modify: `manifest.json`

**Step 1: Re-fetch platform release notes**
WebFetch `https://platform.claude.com/docs/en/release-notes/overview`
Prompt: "Extract ALL release notes entries with dates and full descriptions."

**Step 2: Re-fetch Claude Apps release notes**
WebFetch `https://support.claude.com/en/articles/12138966-release-notes`
Prompt: "Extract ALL release notes entries with dates and full descriptions."

**Step 3: Write updated files with new frontmatter timestamps**

**Step 4: Commit**
```bash
git add release-notes/ manifest.json
git commit -m "Update: release-notes - refresh platform + help-center"
```

---

### Task 8: Update GitHub repos index

**Files:**
- Modify: `github-repos/index.md`
- Modify: `manifest.json`

**Step 1: Fetch current repos list**
WebFetch `https://api.github.com/orgs/anthropics/repos?sort=created&per_page=100`

**Step 2: Regenerate index** including new repos:
- `agent-sdk-workshop` (Feb 27)
- `financial-services-plugins` (Feb 23)
- `moka` (Feb 20, fork)
- `maestro` (Feb 15, fork)

**Step 3: Update manifest entry**

**Step 4: Commit**
```bash
git add github-repos/ manifest.json
git commit -m "Update: github-repos - add 4 new repos"
```

---

### Task 9: Update skills docs

**Files:**
- Modify: `skills/catalog.md` (refresh with partner skills, free tier info)
- Modify: `manifest.json`

**Step 1: Re-fetch skills catalog**
WebFetch `https://github.com/anthropics/skills` — extract current structure

**Step 2: Update catalog.md** with:
- Partner skills (Notion, Figma, Atlassian)
- Free tier availability
- API availability with code execution tool
- Skills Directory

**Step 3: Commit**
```bash
git add skills/ manifest.json
git commit -m "Update: skills - add partner skills, free tier, API availability"
```

---

### Task 10: Update existing web-extracted sources

**Files:**
- Modify: `models/overview.md` (refresh)
- Modify: `models/deprecations.md` (refresh)
- Modify: `api/overview.md` (refresh)
- Modify: `research/index.md` (refresh)
- Modify: `research/policy.md` (refresh — RSP v3)
- Modify: `manifest.json`

**Step 1: Re-fetch each page via WebFetch**

**Step 2: Compare and update changed files**

**Step 3: Commit**
```bash
git add models/ api/ research/ manifest.json
git commit -m "Update: models + api + research - refresh web-extracted sources"
```

---

### Task 11: Run validation and push

**Step 1: Validate manifest**
```bash
node scripts/validate.js
```
Expected: All checks pass

**Step 2: Fix any validation errors**

**Step 3: Push to origin**
```bash
git push origin master
```

**Step 4: Verify sync**
```bash
git fetch --all
git branch -r --no-merged master
git log --oneline HEAD..origin/master
```
Expected: No unmerged branches, no commits behind.

---

### Task 12: Update the update skill (process improvement — deferred)

**Files:**
- Modify: `.claude/commands/update-anthropic-docs.md`

**Step 1: Add post-push branch check**
After pushing, the skill should run:
```bash
git fetch --all
git branch -r --no-merged master
```
And report any unmerged remote branches.

**Step 2: Add `news` and `engineering` to valid categories list**

**Step 3: Add Claude Apps release notes to update routine**

**Step 4: Commit**
```bash
git add .claude/commands/update-anthropic-docs.md
git commit -m "Fix: update skill - add news/engineering categories, post-push branch check"
```

---

## Execution Summary

| Task | Category | Items | Type |
|------|----------|-------|------|
| 1 | claude-code | 1 | github-raw re-sync |
| 2 | multiple | 7 | github-raw re-sync |
| 3 | news | 7 | new web-extracted |
| 4 | research | 3 | new web-extracted |
| 5 | engineering | up to 7 | new web-extracted |
| 6 | api + agent-sdk | 14 | new web-extracted |
| 7 | release-notes | 2 | web-extracted refresh |
| 8 | github-repos | 1 | github-api refresh |
| 9 | skills | 1 | web-extracted refresh |
| 10 | models + api + research | 5 | web-extracted refresh |
| 11 | — | — | validation + push |
| 12 | — | — | process improvement |

**Total: ~48 items across 12 tasks**
