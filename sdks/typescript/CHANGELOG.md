---
title: "TypeScript SDK CHANGELOG"
source_url: "https://raw.githubusercontent.com/anthropics/anthropic-sdk-typescript/main/CHANGELOG.md"
source_type: "github-raw"
fetched_at: "2026-01-04T05:43:46Z"
category: "sdks"
---

# Anthropic SDK TypeScript Changelog

The changelog documents releases from v0.71.2 (December 2025) through v0.5.4 (July 2023).

## Recent Highlights

**Latest Release (0.71.2):** Bug fix ensuring errors are catchable in streams.

**Key Recent Features:**
- Support for Claude Opus 4.5, Computer Use v5, and advanced tool use
- Structured outputs beta functionality
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
| 0.71.2 | Dec 2025 | Stream error fix |
| 0.70.0 | Nov 2025 | Foundation SDK |
| 0.27.0 | May 2024 | Browser support |
| 0.14.0 | Mar 2024 | Messages API GA |
