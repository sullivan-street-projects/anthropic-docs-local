---
title: "Platform Release Notes"
source_url: "https://platform.claude.com/docs/en/release-notes/overview"
source_type: "web-extracted"
fetched_at: "2026-02-15T00:00:00Z"
category: "release-notes"
---

# Claude Developer Platform Release Notes

Updates to the Claude Developer Platform, including the Claude API, client SDKs, and the Claude Console.

> For release notes on Claude Apps, see the [Release notes for Claude Apps in the Claude Help Center](https://support.claude.com/en/articles/12138966-release-notes).
> For updates to Claude Code, see the [complete CHANGELOG.md](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md).

---

## February 7, 2026
- Launched [fast mode](https://platform.claude.com/docs/en/build-with-claude/fast-mode) in research preview for Opus 4.6, providing significantly faster output token generation via the `speed` parameter. Fast mode is up to 2.5x as fast at premium pricing.

## February 5, 2026
- Launched [Claude Opus 4.6](https://www.anthropic.com/news/claude-opus-4-6), our most intelligent model for complex agentic tasks and long-horizon work. Opus 4.6 recommends adaptive thinking (`thinking: {type: "adaptive"}`); manual thinking (`type: "enabled"` with `budget_tokens`) is deprecated. Opus 4.6 does not support prefilling assistant messages.
- The [effort parameter](https://platform.claude.com/docs/en/build-with-claude/effort) is now generally available (no beta header required) and supports Claude Opus 4.6. Effort replaces `budget_tokens` for controlling thinking depth on new models.
- Launched the [compaction API](https://platform.claude.com/docs/en/build-with-claude/compaction) in beta, providing server-side context summarization for effectively infinite conversations. Available on Opus 4.6.
- Introduced [data residency controls](https://platform.claude.com/docs/en/build-with-claude/data-residency), allowing you to specify where model inference runs with the `inference_geo` parameter. US-only inference is available at 1.1x pricing for models released after February 1, 2026.
- The [1M token context window](https://platform.claude.com/docs/en/build-with-claude/context-windows#1m-token-context-window) is now available in beta for Claude Opus 4.6, in addition to Sonnet 4.5 and Sonnet 4. Long context pricing applies to requests exceeding 200K input tokens.
- [Fine-grained tool streaming](https://platform.claude.com/docs/en/agents-and-tools/tool-use/fine-grained-tool-streaming) is now generally available on all models and platforms (no beta header required). The `output_format` parameter for structured outputs has been moved to `output_config.format`.

## January 29, 2026
- [Structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) are now generally available on the Claude API for Claude Sonnet 4.5, Claude Opus 4.5, and Claude Haiku 4.5. GA includes expanded schema support, improved grammar compilation latency, and a simplified integration path with no beta header required. The `output_format` parameter has moved to `output_config.format`.

## January 12, 2026
- `console.anthropic.com` now redirects to `platform.claude.com`. The Claude Console has moved to its new home as part of Claude brand consolidation.

## January 5, 2026
- Retired the Claude Opus 3 model (`claude-3-opus-20240229`). All requests to this model will now return an error. Recommended upgrade: Claude Opus 4.5.

## December 19, 2025
- Announced the deprecation of the Claude Haiku 3.5 model.

## December 4, 2025
- Structured outputs now supports Claude Haiku 4.5.

## November 24, 2025
- Launched [Claude Opus 4.5](https://www.anthropic.com/news/claude-opus-4-5), combining maximum capability with practical performance. $5/$25 MTok pricing.
- Launched programmatic tool calling in public beta.
- Launched the tool search tool in public beta.
- Launched the effort parameter in public beta for Claude Opus 4.5.
- Added client-side compaction to Python and TypeScript SDKs.

## November 21, 2025
- Search result content blocks are now GA on Amazon Bedrock.

## November 19, 2025
- Launched new documentation platform at platform.claude.com/docs.

## November 18, 2025
- Launched Claude in Microsoft Foundry, bringing Claude models to Azure.

## November 14, 2025
- Launched structured outputs in public beta. Beta header: `structured-outputs-2025-11-13`.

## October 28, 2025
- Announced deprecation of Claude Sonnet 3.7.
- Retired Claude Sonnet 3.5 models.
- Expanded context editing with thinking block clearing (`clear_thinking_20251015`).

## October 16, 2025
- Launched [Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) (`skills-2025-10-02` beta). Skills are organized folders of instructions, scripts, and resources that Claude loads dynamically. Includes pre-built skills for .pptx, .xlsx, .docx, and PDF files plus custom skills via Skills API (`/v1/skills` endpoints). Requires code execution tool.

## October 15, 2025
- Launched [Claude Haiku 4.5](https://www.anthropic.com/news/claude-haiku-4-5), fastest and most intelligent Haiku model.

## September 29, 2025
- Launched [Claude Sonnet 4.5](https://www.anthropic.com/news/claude-sonnet-4-5), best model for complex agents and coding.
- Introduced global endpoint pricing for AWS Bedrock and Google Vertex AI.
- New stop reason `model_context_window_exceeded`.
- Launched memory tool in beta.
- Launched context editing in beta.

## September 17, 2025
- Launched tool helpers in beta for Python and TypeScript SDKs.

## September 16, 2025
- Unified developer offerings under the Claude brand. `console.anthropic.com` → `platform.claude.com`, `docs.claude.com` remains. API endpoints, headers, environment variables, and SDKs remain the same.

## September 10, 2025
- Launched web fetch tool in beta.
- Launched Claude Code Analytics API.

## September 8, 2025
- Launched beta C# SDK.

## September 5, 2025
- Launched rate limit charts in Console Usage page.

## September 3, 2025
- Launched support for citable documents in client-side tool results.

## September 2, 2025
- Launched v2 of Code Execution Tool in public beta (Bash execution, file manipulation).

## August 27, 2025
- Launched beta PHP SDK.

## August 26, 2025
- Increased rate limits on 1M token context window for Claude Sonnet 4.
- 1M token context window now available on Google Cloud's Vertex AI.

## August 19, 2025
- Request IDs now included in error response bodies.

## August 18, 2025
- Released Usage & Cost API.
- Added Organization Info Admin API endpoint.

## August 13, 2025
- Announced deprecation of Claude Sonnet 3.5 models (retired October 28, 2025).
- 1-hour cache duration for prompt caching is now GA (no beta header).

## August 12, 2025
- Launched 1M token context window beta for Claude Sonnet 4 on Claude API and Amazon Bedrock.

## August 8, 2025
- Search result content blocks now GA on Claude API and Google Cloud's Vertex AI.

## August 5, 2025
- Launched [Claude Opus 4.1](https://www.anthropic.com/news/claude-opus-4-1). Note: does not allow both `temperature` and `top_p` parameters.

## July 28, 2025
- Released `text_editor_20250728` with optional `max_characters` parameter.

## July 24, 2025
- Increased rate limits for Claude Opus 4 on Claude API.

## July 21, 2025
- Retired Claude 2.0, 2.1, and Sonnet 3 models.

## July 17, 2025
- Increased rate limits for Claude Sonnet 4 on Claude API.

## July 3, 2025
- Launched search result content blocks in beta. Header: `search-results-2025-06-09`.

## June 30, 2025
- Announced deprecation of Claude Opus 3.

## June 23, 2025
- Developer role can now access Cost page in Console.

## June 11, 2025
- Launched fine-grained tool streaming in public beta. Header: `fine-grained-tool-streaming-2025-05-14`.

## May 22, 2025
- Launched [Claude Opus 4 and Claude Sonnet 4](http://www.anthropic.com/news/claude-4).
- Extended thinking returns summary with full thinking encrypted in `signature` field.
- Launched interleaved thinking in public beta. Header: `interleaved-thinking-2025-05-14`.
- Launched Files API in public beta.
- Launched Code execution tool in public beta.
- Launched MCP connector in public beta.
- Changed default `top_p` from 0.999 to 0.99.
- Go SDK moved from beta to GA.

## May 21, 2025
- Ruby SDK moved from beta to GA.

## May 7, 2025
- Launched web search tool in API.

## May 1, 2025
- Cache control must now be specified in parent `content` block of `tool_result` and `document.source`.

## April 9, 2025
- Launched beta Ruby SDK.

## March 31, 2025
- Java SDK moved from beta to GA.
- Go SDK moved from alpha to beta.

## February 27, 2025
- Added URL source blocks for images and PDFs in Messages API.
- Added `none` option to `tool_choice` parameter.
- Launched OpenAI-compatible API endpoint.

## February 24, 2025
- Launched Claude Sonnet 3.7 with extended thinking.
- Added vision support to Claude Haiku 3.5.
- Released token-efficient tool use implementation.
- Changed default Console temperature from 0 to 1.
- Released updated bash/text editor/computer use tools (`bash_20250124`, `text_editor_20250124`, `computer_20250124`).

## February 10, 2025
- Added `anthropic-organization-id` response header.

## January 31, 2025
- Java SDK moved from alpha to beta.

## January 23, 2025
- Launched citations capability in API.
- Added plain text and custom content document support.

## January 21, 2025
- Announced deprecation of Claude 2, 2.1, and Sonnet 3.

## January 15, 2025
- Updated prompt caching: automatic reads from longest cached prefix.
- Can now put words in Claude's mouth when using tools.

## January 10, 2025
- Optimized prompt caching in Message Batches API.

## December 19, 2024
- Added delete endpoint for Message Batches API.

## December 17, 2024
- Models API, Message Batches API, Token counting API, Prompt Caching, and PDF support all moved to GA.
- Released Java SDK (alpha) and Go SDK (alpha).

## December 4, 2024
- Added group-by-API-key to Usage/Cost pages. Added "Last used at" and "Cost" columns to API keys page.

## November 21, 2024
- Launched Admin API.

## November 20, 2024
- Updated rate limits: replaced tokens/minute with separate input/output tokens per minute.
- Added tool use support in Workbench.

## November 13, 2024
- Added PDF support for Claude Sonnet 3.5.

## November 6, 2024
- Retired Claude 1 and Instant models.

## November 4, 2024
- Claude Haiku 3.5 available as text-only model.

## November 1, 2024
- Added PDF support and token counting for Claude Sonnet 3.5.

## October 22, 2024
- Added computer use tools. Claude Sonnet 3.5 upgrade.

## October 8, 2024
- Message Batches API beta (50% cost reduction). Loosened user/assistant turn ordering.

## October 3, 2024
- Added `disable_parallel_tool_use` option.

## September 10, 2024
- Added Workspaces to Developer Console.

## September 4, 2024
- Announced deprecation of Claude 1 models.

## August 22, 2024
- Added browser SDK support with CORS headers.

## August 19, 2024
- 8,192 token outputs GA for Claude Sonnet 3.5.

## August 14, 2024
- Prompt caching beta launched.

## July 15, 2024
- 8,192 token output beta for Sonnet 3.5 (`anthropic-beta: max-tokens-3-5-sonnet-2024-07-15`).

## June 20, 2024
- Claude Sonnet 3.5 GA.

## May 30, 2024
- Tool use GA across all platforms.

## May 10, 2024
- Prompt generator tool launched in Console.
