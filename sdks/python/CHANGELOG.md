---
title: "Python SDK CHANGELOG"
source_url: "https://raw.githubusercontent.com/anthropics/anthropic-sdk-python/main/CHANGELOG.md"
source_type: "github-raw"
fetched_at: "2026-01-04T05:43:46Z"
category: "sdks"
---

# Anthropic SDK Python Changelog

The changelog documents the evolution of the Anthropic Python SDK from version 0.3.4 (July 2023) through 0.75.0 (November 2024).

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
| 0.75.0 | Nov 2024 | Claude Opus 4.5 support |
| 0.39.0 | Sep 2024 | Removed legacy token counting |
| 0.28.0 | Jul 2024 | New streaming API |
| 0.25.0 | Jun 2024 | Tool use GA |
| 0.3.4 | Jul 2023 | Initial tracked release |
