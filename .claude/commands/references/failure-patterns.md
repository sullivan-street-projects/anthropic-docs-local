# Common Failure Patterns & Resolutions

Reference for diagnosing and fixing update failures.

## Fetch Failures

### WebFetch returns empty or garbled content
- **Cause**: Page requires JavaScript rendering, or page structure changed
- **Resolution**: Try a different extraction prompt. If persistent, switch source_type to `manual` and re-synthesize
- **Log to**: `tasks/update-failures.md`

### 404 Not Found
- **Cause**: Source URL moved or deleted
- **Resolution**: WebSearch for the new URL. Update `source_url` in manifest. If content is gone, set `lifecycle_status: "deprecated"`

### Rate limiting (429)
- **Cause**: Too many requests to same domain
- **Resolution**: Wait and retry once. If still failing, skip and note in error report. Use exponential backoff (1s, 2s, 4s)

### GitHub API rate limit
- **Cause**: Unauthenticated requests limited to 60/hour
- **Resolution**: Reduce parallel fetches for github-api and github-raw sources. Batch into smaller groups

## Content Issues

### Content significantly shorter than expected
- **Cause**: Page restructured; extraction prompt only captured partial content
- **Resolution**: Use `--diff` mode to identify what's missing. Update extraction prompt or switch to manual source type

### Frontmatter parsing errors
- **Cause**: Content contains `---` separators that conflict with YAML frontmatter delimiters
- **Resolution**: Ensure frontmatter is the first thing in the file, with no leading whitespace

### Hash mismatches after update
- **Cause**: File was modified but sha256 in manifest wasn't updated
- **Resolution**: Recompute hash: `shasum -a 256 <file>` and update manifest entry

## Agent Failures

### Agent reports success but no files changed
- **Cause**: Agent generated correct content but failed to use Write/Edit tool
- **Resolution**: Retry the update directly (not via agent). Verify with `git diff --stat HEAD`

### Agent context exhaustion
- **Cause**: Too many sources assigned to one agent
- **Resolution**: Split into smaller batches. Assign max 25-30 sources per agent

## Error Handling Rules

- If a source fails to fetch, log the error and continue with other sources
- Report all errors at the end
- Do not commit if ALL sources failed
- For rate limits: wait and retry once, then skip if still failing
- If an agent reports success but files are unchanged on disk, retry the update directly
- After any failure, log to `tasks/update-failures.md` with: source_id, error type, resolution taken
