# Source Type Handling Reference

Detailed handling instructions for each source type used in the update process.

## Source Type Overview

| Type | Fetch Method | Notes |
|------|--------------|-------|
| `github-raw` | WebFetch direct URL | Highest fidelity, use raw content as-is |
| `web-extracted` | WebFetch with extraction prompt | Parse HTML, extract main content |
| `github-api` | WebFetch API endpoint | Parse JSON response |
| `manual` | WebFetch source URL + re-synthesize | Read source page, rewrite local file with current content |
| `arxiv-pdfs` | WebSearch + arXiv search | Find new papers, update index |

## github-raw Sources

- Fetch content directly from `source_url` using WebFetch
- For CHANGELOGs: fetch without adding frontmatter, compare to existing
- For READMEs: add YAML frontmatter with updated `fetched_at`
- Save changed files with Write/Edit tool
- Update manifest.json `last_fetched` timestamps

## web-extracted Sources

- Use WebFetch with extraction prompts for each source
- Read existing file first, then update with new content
- Preserve YAML frontmatter format, update `fetched_at`
- When extracting, ask WebFetch to return the main content in markdown format
- Skip navigation, headers, footers — only capture the article/doc content

## github-api Sources

- Fetch JSON from the API endpoint
- Parse the response to extract relevant information
- Format as markdown with proper frontmatter

## manual Sources

Manual sources require special handling because they are agent-synthesized:

1. **Read** the existing local file completely
2. **Fetch** the source URL with WebFetch
3. **Compare** fetched content to existing file
4. **Re-synthesize**: Update the local file with new information while preserving the established structure (headings, tables, code blocks)
5. **Update timestamp** in frontmatter to current date
6. **VERIFY**: Read the file back to confirm the write succeeded

### Key Manual Sources (MUST be updated every run)

- `claude-code/features.md` — from https://code.claude.com/docs/en/features-overview
- `claude-code/hooks.md` — from https://code.claude.com/docs/en/hooks
- `claude-code/mcp-servers.md` — from https://code.claude.com/docs/en/mcp
- `claude-code/plugins.md` — from https://code.claude.com/docs/en/plugins
- `agent-sdk/README.md` — from https://platform.claude.com/docs/en/agent-sdk/overview
- `agent-sdk/quickstart.md` — from https://platform.claude.com/docs/en/agent-sdk/quickstart
- `agent-sdk/examples.md` — from https://platform.claude.com/docs/en/agent-sdk/overview

## arxiv-pdfs Sources

- WebSearch for new Anthropic papers on arXiv
- Compare results against papers already indexed in `research/papers/index.md`
- For new papers: download PDF, add to manifest papers array, update index
