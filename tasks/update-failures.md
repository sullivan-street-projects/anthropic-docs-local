---
title: "Update Failure Log"
created_at: "2026-03-15T00:00:00Z"
---

# Update Failure Log

Track source-specific failures with resolutions. Review at session start to avoid repeating mistakes.

## Format

```
### YYYY-MM-DD — source_id
- **Error**: What went wrong
- **Resolution**: What fixed it
- **Prevention**: Rule to add to lessons.md or validate.js if recurring
```

## Log

### 2026-03-22 — agent-sdk-typescript-v2-preview
- **Error**: WebFetch of `https://github.com/anthropics/agent-sdk` returned 404. The repository may have been renamed, made private, or reorganized.
- **Resolution**: Skipped update for this source. Existing local content preserved unchanged; only `fetched_at` timestamp updated.
- **Prevention**: Check repository status before future update runs. If 404 persists across multiple cycles, consider removing from manifest or updating the source_url.

### 2026-04-05 — agent-sdk-typescript-v2-preview
- **Error**: WebFetch of `https://github.com/anthropics/agent-sdk` returned 404 again (second consecutive cycle).
- **Resolution**: Skipped update. Existing local content preserved; only `fetched_at` timestamp updated.
- **Prevention**: Repository has been 404 for 2 consecutive cycles. Consider removing from manifest or marking as archived. May have been consolidated into the main anthropic-sdk repos.

### 2026-04-05 — skills-building-skills-guide (PDF)
- **Error**: `curl -sL` of `https://resources.anthropic.com/hubfs/Building-effective-agents-using-skills-for-Claude.pdf` returned 404 HTML page (102 bytes). PDF no longer hosted at this URL.
- **Resolution**: Skipped update. Existing local content preserved; only `fetched_at` timestamp updated.
- **Prevention**: Check if PDF moved to a new URL on resources.anthropic.com. The HubSpot CDN may have reorganized.

### 2026-04-05 — how-anthropic-teams-use-claude-code (PDF)
- **Error**: `curl -sL` of `https://resources.anthropic.com/hubfs/anthropic-how-teams-use-claude-code.pdf` returned 404 HTML page (102 bytes). PDF no longer hosted at this URL.
- **Resolution**: Skipped update. Existing local content preserved; only `fetched_at` timestamp updated.
- **Prevention**: Check if PDF moved to a new URL on resources.anthropic.com. The HubSpot CDN may have reorganized.

### 2026-04-05 — skills-catalog (GitHub)
- **Error**: WebFetch of `https://github.com/anthropics/anthropic-cookbook/tree/main/misc/prompt_caching/skills` returned 404. Path may have been removed or reorganized.
- **Resolution**: Updated skills/catalog.md from `https://github.com/anthropics/skills` instead (the correct current source). Star count updated from 70.5k to 111k.
- **Prevention**: The source_url in manifest may be stale — the skills repo moved to `github.com/anthropics/skills`. Update manifest source_url if recurring.

### 2026-04-05 — research index pages (interpretability, alignment, societal-impacts, policy)
- **Error**: Multiple research URLs returned 404 without `www.` prefix. E.g., `anthropic.com/research/mapping-the-mind-of-a-large-language-model` 404'd but `www.anthropic.com/research/team/interpretability` worked.
- **Resolution**: Fetched team-level pages successfully. Existing research category files already have richer content than the team overview pages, so no content updates needed.
- **Prevention**: Always use `www.anthropic.com` prefix for Anthropic website URLs. Some paths require it.

### 2026-04-05 — where-stand-department-war
- **Error**: URL without `www.` prefix returned 404. `www.anthropic.com/news/where-stand-department-war` succeeded.
- **Resolution**: Fetched successfully with `www.` prefix. Existing content matches fetched content; no update needed.
- **Prevention**: Ensure all `anthropic.com` URLs use `www.` prefix.
