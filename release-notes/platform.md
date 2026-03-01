---
title: "Platform Release Notes"
source_url: "https://platform.claude.com/docs/en/release-notes/overview"
source_type: "web-extracted"
fetched_at: "2026-02-28T00:00:00Z"
category: "release-notes"
---
# Claude Developer Platform

Updates to the Claude Developer Platform, including the Claude API, client SDKs, and the Claude Console.

> For release notes on Claude Apps, see the [Release notes for Claude Apps in the Claude Help Center](https://support.claude.com/en/articles/12138966-release-notes).
> For updates to Claude Code, see the [complete CHANGELOG.md](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) in the `claude-code` repository.

### February 19, 2026
- Launched **automatic caching** for the Messages API. Add a single `cache_control` field to your request body and the system automatically caches the last cacheable block.
- Retired Claude Sonnet 3.7 (`claude-3-7-sonnet-20250219`) and Claude Haiku 3.5 (`claude-3-5-haiku-20241022`). Recommend upgrading to Claude Sonnet 4.6 and Claude Haiku 4.5 respectively.
- Announced deprecation of Claude Haiku 3 (`claude-3-haiku-20240307`), with retirement scheduled for April 19, 2026.

### February 17, 2026
- Launched **Claude Sonnet 4.6**, latest balanced model combining speed and intelligence. Supports extended thinking and 1M token context window (beta).
- API code execution now **free when used with web search or web fetch**.
- Web search tool and programmatic tool calling are now generally available (no beta header required).
- Code execution tool, web fetch tool, tool search tool, tool use examples, and memory tool are now generally available.

### February 7, 2026
- Launched **fast mode** in research preview for Opus 4.6, providing up to 2.5x faster output token generation via the `speed` parameter.

### February 5, 2026
- Launched **Claude Opus 4.6**, most intelligent model for complex agentic tasks and long-horizon work. Recommends adaptive thinking (`thinking: {type: "adaptive"}`); manual thinking with budget_tokens is deprecated.
- The effort parameter is now generally available and supports Claude Opus 4.6.
- Launched the **compaction API** in beta for server-side context summarization.
- Introduced **data residency controls** with the `inference_geo` parameter.
- 1M token context window now available in beta for Claude Opus 4.6.
- Fine-grained tool streaming is now generally available. The `output_format` parameter moved to `output_config.format`.

### January 29, 2026
- Structured outputs now generally available for Claude Sonnet 4.5, Opus 4.5, and Haiku 4.5. No beta header required.

### January 12, 2026
- `console.anthropic.com` now redirects to `platform.claude.com`.

### January 5, 2026
- Retired Claude Opus 3 (`claude-3-opus-20240229`). Recommend upgrading to Claude Opus 4.5.

### December 19, 2025
- Announced deprecation of Claude Haiku 3.5 model.

### December 4, 2025
- Structured outputs now supports Claude Haiku 4.5.

### November 24, 2025
- Launched **Claude Opus 4.5**, most intelligent model combining maximum capability with practical performance.
- Launched programmatic tool calling in public beta.
- Launched tool search tool in public beta.
- Launched effort parameter in public beta for Claude Opus 4.5.
- Added client-side compaction to Python and TypeScript SDKs.

### November 19, 2025
- Launched new documentation platform at platform.claude.com/docs.

### November 18, 2025
- Launched Claude in Microsoft Foundry (Azure).

### November 14, 2025
- Launched structured outputs in public beta.

### October 28, 2025
- Announced deprecation of Claude Sonnet 3.7. Retired Claude Sonnet 3.5 models.
- Expanded context editing with thinking block clearing.

### October 16, 2025
- Launched Agent Skills beta.

### October 15, 2025
- Launched Claude Haiku 4.5.

### September 29, 2025
- Launched Claude Sonnet 4.5.
- Introduced global endpoint pricing for AWS Bedrock and Google Vertex AI.
- New stop reason `model_context_window_exceeded`.
- Launched memory tool in beta.
- Launched context editing in beta.

### September 17, 2025
- Launched tool helpers in beta for Python and TypeScript SDKs.

### September 16, 2025
- Unified developer offerings under the Claude brand. Console moved to platform.claude.com.

### September 10, 2025
- Launched web fetch tool in beta.
- Launched Claude Code Analytics API.

### September 8, 2025
- Launched C# SDK (beta).

### September 2, 2025
- Launched Code Execution Tool v2 in public beta.

### August 27, 2025
- Launched PHP SDK (beta).

### August 19, 2025
- Request IDs now included in error response bodies.

### August 18, 2025
- Released Usage & Cost API.
- Added Organization Info endpoint to Admin API.

### August 13, 2025
- Announced deprecation of Claude Sonnet 3.5 models.
- 1-hour cache duration for prompt caching is now GA.

### August 12, 2025
- Launched 1M token context window beta for Claude Sonnet 4.

### August 5, 2025
- Launched Claude Opus 4.1.

### July 28, 2025
- Released `text_editor_20250728` with `max_characters` parameter.

### May 22, 2025
- Launched Claude Opus 4 and Claude Sonnet 4 with extended thinking.
- Launched interleaved thinking in public beta.
- Launched Files API, Code execution tool, MCP connector in public beta.
- Go SDK moved from beta to GA.

### May 7, 2025
- Launched web search tool in the API.

### February 24, 2025
- Launched Claude Sonnet 3.7.
- Released token-efficient tool use implementation.
- Released updated bash, text editor, and computer use tools.
