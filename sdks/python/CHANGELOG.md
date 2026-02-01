---
title: "Python SDK CHANGELOG"
source_url: "https://raw.githubusercontent.com/anthropics/anthropic-sdk-python/main/CHANGELOG.md"
source_type: "github-raw"
fetched_at: "2026-01-31T00:00:00Z"
category: "sdks"
---

# Anthropic SDK Python Changelog

The changelog documents the evolution of the Anthropic Python SDK from version 0.3.4 (July 2023) through 0.77.0 (January 2026).

## Latest Release: 0.77.0 (January 29, 2026)

### Key Features
- Support for Structured Outputs in the Messages API
- Migrated message format sending to use `output_config` rather than `output_format`
- Custom JSON encoder for extended type support

### Notable Improvements
- Fixed avoiding beta headers when `output_format` is missing

## Recent Major Releases

### 0.76.0 (January 13, 2026)
- Raw JSON schema support for `messages.stream()`
- Binary request streaming capability for the client
- Server-side tools support in the tool runner
- Loosened auth header validation
- Ensured streams are always properly closed

### 0.75.0 (November 24, 2025)
Added support for Claude Opus 4.5, along with effort controls, advanced tool use features, autocompaction, and Computer Use v5.

### 0.74.0 (November 18, 2025)
Introduced the Foundry SDK integration.

### 0.73.0 (November 14, 2025)
Added support for structured outputs beta functionality.

## Major Features Added

**Model & API Support**: The SDK progressively added support for newer Claude models, including Claude 3.5 Sonnet, Claude Opus 4.5, and Haiku variants. New capabilities like tool use, structured outputs, web search, and file handling were incorporated.

**Streaming & Helpers**: Significant refactoring introduced event-iterator patterns for streaming. The SDK added "helper methods" for common tasks like prompt caching and message accumulation.

**Enterprise Features**: Support expanded to include Bedrock (AWS), Vertex AI (Google), and features like batch processing, token counting, and computer use capabilities.

## Notable Architecture Changes

- Migration from Poetry to Rye (later to uv) for package management
- Addition of Pydantic v2 support while maintaining v1 compatibility
- Refactoring of streaming implementations to use composition patterns
- Removal of legacy APIs (e.g., `client.count_tokens()` in favor of beta endpoints)

## Breaking Changes

The most significant breaking change involved removing the old event handler API for streaming (v0.28.0) and the legacy token counting method (v0.39.0).

## Quality Improvements

Consistent updates to dependencies, type checking tools (pyright, mypy), and linting (ruff). The team addressed cross-platform compatibility issues, improved error messages, and enhanced test coverage throughout the release cycle.

## Version Highlights

| Version | Date | Key Changes |
|---------|------|-------------|
| 0.77.0 | Jan 2026 | Structured Outputs in Messages API |
| 0.76.0 | Jan 2026 | JSON schema streaming, binary streaming |
| 0.75.0 | Nov 2025 | Claude Opus 4.5 support |
| 0.74.0 | Nov 2025 | Foundry SDK integration |
| 0.73.0 | Nov 2025 | Structured outputs beta |
| 0.39.0 | Sep 2024 | Removed legacy token counting |
| 0.28.0 | Jul 2024 | New streaming API |
| 0.25.0 | Jun 2024 | Tool use GA |
| 0.3.4 | Jul 2023 | Initial tracked release |
