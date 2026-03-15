---
title: "API Release Notes"
source_url: "https://platform.claude.com/docs/en/release-notes/overview"
source_type: "web-extracted"
fetched_at: "2026-03-15T00:00:00Z"
category: "release-notes"
---
# Claude Developer Platform

Updates to the Claude Developer Platform, including the Claude API, client SDKs, and the Claude Console.

> For release notes on Claude Apps, see the [Release notes for Claude Apps in the Claude Help Center](https://support.claude.com/en/articles/12138966-release-notes).
> For updates to Claude Code, see the [complete CHANGELOG.md](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) in the `claude-code` repository.

### March 13, 2026
- The 1M token context window is now generally available for Claude Opus 4.6 and Sonnet 4.6 at standard pricing. Requests over 200k tokens work automatically for these models with no beta header required. The 1M token context window remains in beta for Claude Sonnet 4.5 and Sonnet 4.
- Removed the dedicated 1M rate limits for all supported models. Standard account limits now apply across every context length.
- Raised the media limit from 100 to 600 images or PDF pages per request when using the 1M token context window.

### February 19, 2026
- Launched **automatic caching** for the Messages API. Add a single `cache_control` field to your request body and the system automatically caches the last cacheable block, moving the cache point forward as conversations grow. No manual breakpoint management required. Works alongside existing block-level cache control for fine-grained optimization. Available on the Claude API and Azure AI Foundry (preview).
- Retired Claude Sonnet 3.7 (`claude-3-7-sonnet-20250219`) and Claude Haiku 3.5 (`claude-3-5-haiku-20241022`). Recommend upgrading to Claude Sonnet 4.6 and Claude Haiku 4.5 respectively. Researchers can request ongoing access through the External Researcher Access Program.
- Announced deprecation of Claude Haiku 3 (`claude-3-haiku-20240307`), with retirement scheduled for April 19, 2026.

### February 17, 2026
- Launched **Claude Sonnet 4.6**, latest balanced model combining speed and intelligence. Sonnet 4.6 delivers improved agentic search performance while consuming fewer tokens. Supports extended thinking and 1M token context window (beta).
- API code execution now **free when used with web search or web fetch**. Sandboxed code execution improves model capability and token efficiency.
- Web search tool and programmatic tool calling are now generally available (no beta header required). Web search and web fetch now support dynamic filtering, which uses code execution to filter results before they reach the context window.
- Code execution tool, web fetch tool, tool search tool, tool use examples, and memory tool are now generally available.

### February 7, 2026
- Launched **fast mode** in research preview for Opus 4.6, providing up to 2.5x faster output token generation via the `speed` parameter. Interested customers should join the waitlist.

### February 5, 2026
- Launched **Claude Opus 4.6**, most intelligent model for complex agentic tasks and long-horizon work. Recommends adaptive thinking (`thinking: {type: "adaptive"}`); manual thinking with budget_tokens is deprecated. Opus 4.6 does not support prefilling assistant messages.
- The effort parameter is now generally available and supports Claude Opus 4.6. Effort replaces `budget_tokens` for controlling thinking depth on new models.
- Launched the **compaction API** in beta for server-side context summarization. Available on Opus 4.6.
- Introduced **data residency controls** with the `inference_geo` parameter. US-only inference is available at 1.1x pricing for models released after February 1, 2026.
- 1M token context window now available in beta for Claude Opus 4.6. Long context pricing applies to requests exceeding 200K input tokens.
- Fine-grained tool streaming is now generally available. The `output_format` parameter moved to `output_config.format`.

### January 29, 2026
- Structured outputs now generally available for Claude Sonnet 4.5, Opus 4.5, and Haiku 4.5. GA includes expanded schema support, improved grammar compilation latency, and a simplified integration path with no beta header required. The `output_format` parameter has moved to `output_config.format`.

### January 12, 2026
- `console.anthropic.com` now redirects to `platform.claude.com`.

### January 5, 2026
- Retired Claude Opus 3 (`claude-3-opus-20240229`). Recommend upgrading to Claude Opus 4.5. Researchers can request ongoing access through the External Researcher Access Program.

### December 19, 2025
- Announced deprecation of Claude Haiku 3.5 model.

### December 4, 2025
- Structured outputs now supports Claude Haiku 4.5.

### November 24, 2025
- Launched **Claude Opus 4.5**, most intelligent model combining maximum capability with practical performance. Ideal for complex specialized tasks, professional software engineering, and advanced agents.
- Launched programmatic tool calling in public beta.
- Launched tool search tool in public beta.
- Launched effort parameter in public beta for Claude Opus 4.5.
- Added client-side compaction to Python and TypeScript SDKs.

### November 21, 2025
- Search result content blocks are now generally available on Amazon Bedrock.

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
- Launched Agent Skills beta. Skills are organized folders of instructions, scripts, and resources that Claude loads dynamically to perform specialized tasks.

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

### September 5, 2025
- Launched rate limit charts in the Console Usage page.

### September 3, 2025
- Launched support for citable documents in client-side tool results.

### September 2, 2025
- Launched Code Execution Tool v2 in public beta, replacing the original Python-only tool with Bash command execution.

### August 27, 2025
- Launched PHP SDK (beta).

### August 26, 2025
- Increased rate limits on the 1M token context window for Claude Sonnet 4 on the Claude API.
- The 1M token context window is now available on Google Cloud's Vertex AI.

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

### August 11, 2025
- Some customers might encounter 429 rate_limit_error errors following a sharp increase in API usage due to acceleration limits.

### August 8, 2025
- Search result content blocks are now generally available on the Claude API and Google Cloud's Vertex AI.

### August 5, 2025
- Launched Claude Opus 4.1.

### July 28, 2025
- Released `text_editor_20250728` with `max_characters` parameter.

### July 24, 2025
- Increased rate limits for Claude Opus 4 on the Claude API.

### July 21, 2025
- Retired Claude 2.0, Claude 2.1, and Claude Sonnet 3 models.

### July 17, 2025
- Increased rate limits for Claude Sonnet 4 on the Claude API.

### July 3, 2025
- Launched search result content blocks in beta, enabling natural citations for RAG applications.

### June 30, 2025
- Announced deprecation of Claude Opus 3 model.

### June 23, 2025
- Console users with the Developer role can now access the Cost page.

### June 11, 2025
- Launched fine-grained tool streaming in public beta.

### May 22, 2025
- Launched Claude Opus 4 and Claude Sonnet 4 with extended thinking.
- Launched interleaved thinking in public beta.
- Launched Files API, Code execution tool, MCP connector in public beta.
- Changed default `top_p` from 0.999 to 0.99 for all models.
- Go SDK moved from beta to GA.

### May 21, 2025
- Ruby SDK moved from beta to GA.

### May 7, 2025
- Launched web search tool in the API.

### May 1, 2025
- Cache control must now be specified directly in the parent `content` block of `tool_result` and `document.source`.

### April 9, 2025
- Launched Ruby SDK (beta).

### March 31, 2025
- Java SDK moved from beta to GA.
- Go SDK moved from alpha to beta.

### February 27, 2025
- Added URL source blocks for images and PDFs in the Messages API.
- Added `none` option to `tool_choice` parameter.
- Launched OpenAI-compatible API endpoint.

### February 24, 2025
- Launched Claude Sonnet 3.7.
- Released token-efficient tool use implementation.
- Released updated bash, text editor, and computer use tools.
