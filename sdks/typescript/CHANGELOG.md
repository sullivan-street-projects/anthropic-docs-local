---
title: "TypeScript SDK CHANGELOG"
source_url: "https://raw.githubusercontent.com/anthropics/anthropic-sdk-typescript/main/CHANGELOG.md"
source_type: "github-raw"
fetched_at: "2026-02-05T00:00:00Z"
category: "sdks"
---

# Anthropic SDK TypeScript Changelog

The changelog documents releases from v0.73.0 (February 2026) through v0.5.4 (July 2023).

## Recent Highlights

**Latest Release (0.73.0 - February 5, 2026):**
- Manual API updates
- Fixed memory leak in abort signal listener
- Fixed abort controller binding issues
- Fixed response parsing with empty content-length headers

### 0.72.1 (January 30, 2026)
- Bug fix removing OutputFormat exports from index.ts

### 0.72.0 (January 29, 2026)
- Support for Structured Outputs in the Messages API
- Migrated sending message format in `output_config` rather than `output_format`
- Addition of MCP SDK helper functions
- Bug fixes for MCP code tool API endpoint and TypeScript error handling

### 0.71.2 (December 2025)
- Bug fix ensuring errors are catchable in streams

**Key Recent Features:**
- Structured Outputs in Messages API (GA)
- MCP SDK helper functions
- Support for Claude Opus 4.5, Computer Use v5, and advanced tool use
- Message batches API with streaming support
- Web search integration and PDFs in messages
- Token counting and prompt caching features
- Tool use GA across platforms (Bedrock, Vertex)

## Major Milestones

### API Evolution
- Messages API transitioned from beta to GA (v0.14.0)
- Tool use support expanded across third-party platforms
- Streaming helpers and response utilities added

### Infrastructure
- Browser support implemented (v0.27.0)
- Bedrock and Vertex SDK support integrated
- Foundation SDK added (v0.70.0)
- MCP connector and code execution tools

### Developer Experience
- Custom header support in toolRunner
- Request ID accessibility improvements
- Better error handling and type safety

## Version Highlights

| Version | Date | Key Changes |
|---------|------|-------------|
| 0.73.0 | Feb 2026 | API updates, memory leak fixes |
| 0.72.1 | Jan 2026 | Structured Outputs, MCP helpers |
| 0.71.2 | Dec 2025 | Stream error fix |
| 0.70.0 | Nov 2025 | Foundation SDK |
| 0.27.0 | May 2024 | Browser support |
| 0.14.0 | Mar 2024 | Messages API GA |
