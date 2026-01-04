---
title: "Platform Release Notes"
source_url: "https://platform.claude.com/docs/en/release-notes/overview"
source_type: "web-extracted"
fetched_at: "2026-01-04T05:50:00Z"
category: "release-notes"
---

# Claude Developer Platform Release Notes

Updates to the Claude Developer Platform, including the Claude API, client SDKs, and the Claude Console.

## December 2025

### December 19, 2025
- Announced deprecation of Claude Haiku 3.5 model

### December 4, 2025
- Structured outputs now supports Claude Haiku 4.5

## November 2025

### November 24, 2025
- **Claude Opus 4.5** launched - most intelligent model combining maximum capability with practical performance
- **Programmatic tool calling** in public beta - call tools from within code execution
- **Tool search tool** in public beta - dynamically discover and load tools on-demand
- **Effort parameter** in public beta for Claude Opus 4.5 - control token usage vs thoroughness
- **Client-side compaction** added to Python and TypeScript SDKs

### November 21, 2025
- Search result content blocks GA on Amazon Bedrock

### November 19, 2025
- New documentation platform launched at platform.claude.com/docs

### November 18, 2025
- **Claude in Microsoft Foundry** launched - Azure billing and OAuth authentication

### November 14, 2025
- **Structured outputs** in public beta - guaranteed schema conformance

## October 2025

### October 28, 2025
- Announced deprecation of Claude Sonnet 3.7 model
- Retired Claude Sonnet 3.5 models
- Expanded context editing with thinking block clearing

### October 16, 2025
- **Agent Skills** launched (`skills-2025-10-02` beta)
  - Anthropic-managed Skills for PowerPoint, Excel, Word, PDF
  - Custom Skills via Skills API

### October 15, 2025
- **Claude Haiku 4.5** launched - fastest and most intelligent Haiku model

## September 2025

### September 29, 2025
- **Claude Sonnet 4.5** launched - best model for complex agents and coding
- Global endpoint pricing for AWS Bedrock and Google Vertex AI
- New stop reason `model_context_window_exceeded`
- Memory tool launched in beta
- Context editing launched in beta

### September 17, 2025
- Tool helpers beta for Python and TypeScript SDKs

### September 16, 2025
- Developer offerings unified under Claude brand
- Anthropic Console → Claude Console
- Anthropic Docs → Claude Docs

### September 10, 2025
- Web fetch tool launched in beta
- Claude Code Analytics API launched

### September 8, 2025
- C# SDK launched (beta)

### September 5, 2025
- Rate limit charts in Console Usage page

### September 3, 2025
- Citable documents support in client-side tool results

### September 2, 2025
- Code Execution Tool v2 in public beta (Bash + file manipulation)

## August 2025

### August 27, 2025
- PHP SDK launched (beta)

### August 26, 2025
- Increased rate limits on 1M token context window for Claude Sonnet 4
- 1M token context window available on Vertex AI

### August 19, 2025
- Request IDs now included in error response bodies

### August 18, 2025
- Usage & Cost API released
- Organization Info Admin API endpoint added

### August 13, 2025
- Announced deprecation of Claude Sonnet 3.5 models
- 1-hour cache duration for prompt caching now GA

### August 12, 2025
- 1M token context window beta for Claude Sonnet 4

### August 8, 2025
- Search result content blocks GA on Claude API and Vertex AI

### August 5, 2025
- **Claude Opus 4.1** launched - incremental update with enhanced capabilities

## July 2025

### July 28, 2025
- Updated text editor tool `text_editor_20250728` with `max_characters` parameter

### July 24, 2025
- Increased rate limits for Claude Opus 4

### July 21, 2025
- Retired Claude 2.0, Claude 2.1, and Claude Sonnet 3 models

### July 17, 2025
- Increased rate limits for Claude Sonnet 4

### July 3, 2025
- Search result content blocks beta - natural citations for RAG

## June 2025

### June 30, 2025
- Announced deprecation of Claude Opus 3 model

### June 23, 2025
- Developer role can now access Cost page in Console

### June 11, 2025
- Fine-grained tool streaming in public beta

## May 2025

### May 22, 2025
- **Claude Opus 4 and Claude Sonnet 4** launched with extended thinking
- Extended thinking default returns summary with encrypted full thinking
- Interleaved thinking in public beta
- Files API in public beta
- Code execution tool in public beta
- MCP connector in public beta
- Default `top_p` changed from 0.999 to 0.99
- Go SDK moved to GA

### May 21, 2025
- Ruby SDK moved to GA

### May 7, 2025
- Web search tool launched in API

### May 1, 2025
- Cache control must be specified in parent content block

## Earlier 2025

### April 9, 2025
- Ruby SDK launched (beta)

### March 31, 2025
- Java SDK moved to GA
- Go SDK moved to beta

### February 27, 2025
- URL source blocks for images and PDFs
- `none` option for `tool_choice` parameter
- OpenAI-compatible API endpoint launched

### February 24, 2025
- **Claude Sonnet 3.7** launched with extended thinking
- Vision support added to Claude Haiku 3.5
- Token-efficient tool use implementation
- Updated bash and text_editor tools (v20250124)
- Updated computer use tool with new commands

### February 10, 2025
- `anthropic-organization-id` response header added

### January 31, 2025
- Java SDK moved to beta

### January 23, 2025
- Citations capability launched
- Plain text and custom content documents support

### January 21, 2025
- Announced deprecation of Claude 2, Claude 2.1, Claude Sonnet 3

### January 15, 2025
- Prompt caching improvements - automatic longest prefix reading
- Words in Claude's mouth support with tools

### January 10, 2025
- Optimized prompt caching in Message Batches API

## December 2024

### December 19, 2024
- Delete endpoint for Message Batches API

### December 17, 2024
- Models API, Message Batches API, Token counting, Prompt Caching, PDF support now GA
- Java SDK and Go SDK launched (alpha)

### December 4, 2024
- Group by API key in Usage and Cost pages
- New columns in API keys page

## November 2024

### November 21, 2024
- Admin API released

### November 20, 2024
- Updated rate limits with input/output tokens per minute
- Tool use support in Workbench

### November 13, 2024
- PDF support for Claude Sonnet 3.5 models

### November 6, 2024
- Retired Claude 1 and Instant models

### November 4, 2024
- Claude Haiku 3.5 available (text-only)

### November 1, 2024
- PDF support for new Claude Sonnet 3.5
- Token counting released

## October 2024

### October 22, 2024
- Computer use tools added to API
- Claude Sonnet 3.5 upgrade released

### October 8, 2024
- Message Batches API beta (50% cost reduction)
- Looser user/assistant turn ordering
- Build and Scale plans deprecated

### October 3, 2024
- Disable parallel tool use option added

## September 2024

### September 10, 2024
- Workspaces added to Developer Console

### September 4, 2024
- Announced deprecation of Claude 1 models

## Earlier 2024

- **August 22**: CORS headers for browser SDK usage
- **August 19**: 8,192 token outputs GA for Claude Sonnet 3.5
- **August 14**: Prompt caching beta launched
- **July 15**: 8,192 token outputs beta
- **July 9**: Test case generation and output comparison
- **June 27**: Usage and Cost tabs in Console
- **June 20**: Claude Sonnet 3.5 launched
- **May 30**: Tool use GA
- **May 10**: Prompt Generator tool released
