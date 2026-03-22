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
