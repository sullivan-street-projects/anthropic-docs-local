---
title: "Discovery Log"
created_at: "2026-03-15T00:00:00Z"
---

# Discovery Log

Track new sources found per discovery run. Prevents re-discovering or missing sources across sessions.

## Format

```
### YYYY-MM-DD — Discovery Run
- **New sources found**: N
- **Added**: list of source_ids added to manifest
- **Deferred**: list of URLs found but not added (with reason)
- **Rejected**: list of URLs found but explicitly excluded (with reason)
```

## Log

(No discovery runs logged yet. First entry will be added on next `/update-anthropic-docs --discover` run.)
