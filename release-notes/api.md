---
title: "API Release Notes"
source_url: "https://platform.claude.com/docs/en/release-notes/overview"
source_type: "web-extracted"
fetched_at: "2026-07-27T00:00:00Z"
category: "release-notes"
---

# Claude Platform

Updates to the Claude Platform, including the Claude API, client SDKs, and the Claude Console.

> For release notes on Claude Apps, see the [Release notes for Claude Apps in the Claude Help Center](https://support.claude.com/en/articles/12138966-release-notes).
> For updates to Claude Code, see the [complete CHANGELOG.md](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) in the `claude-code` repository.

### July 24, 2026

- Launched **Claude Opus 5** (`claude-opus-5`), step-change over Opus 4.8. 1M context, 128k output, thinking on by default, $5 / $25 per MTok. Available on Claude API, Bedrock, Google Cloud, and Microsoft Foundry.
- Disabling thinking on Opus 5 only allowed at effort `high` or below; `xhigh`/`max` with disabled thinking returns 400.
- Effort is the primary control for Opus 5: full ladder (`low`, `medium`, `high`, `xhigh`, `max`).
- Mid-conversation tool changes in beta on Fable 5, Mythos 5, Opus 4.8, and Opus 5 (`mid-conversation-tool-changes-2026-07-01` header).
- `fallbacks` parameter supports `"default"` mode for recommended fallback models by refusal category (`server-side-fallback-2026-07-01` header).
- Removed fast mode for Opus 4.7. Requests with `speed: "fast"` return an error. Migrate to Opus 5 or Opus 4.8.

### July 22, 2026

- Managed Agents: `effort` level in agent model config. Environment and memory store webhook events. Session seeding with `initial_events`. Optional `version` on agent updates. Thread-level event deltas.

### July 17, 2026

- Legacy Workbench sunset August 17, 2026. Experimental prompt tools APIs (`generate_prompt`, `improve_prompt`, `templatize_prompt`) retiring same date.

### July 15, 2026

- Mid-conversation system messages available on Fable 5, Mythos 5, and Opus 4.8. No beta header required.

### July 14, 2026

- Admin API in beta for Claude Enterprise user management: members, invites, groups, custom roles. Requires `ce-user-management-2026-07-13` header for group/role endpoints.

### July 10, 2026

- Dreams (research preview) now supports Fable 5 and Sonnet 5.
- Expanded Access Transparency documentation of `cmek_preserve` events with a filter example, an example event payload, and two preservation reason codes (`policy_violation_investigation`, `csae_report`).

### July 8, 2026

- API keys and Admin API keys now support expiration when created in the Claude Console. Choose a preset, a custom duration, or **Never**. The Admin API reports each key's expiration in the `expires_at` field.

### July 2, 2026

- Added the `agent-memory-2026-07-22` beta header, which changes listing memories behavior: stable server-defined ordering, `depth` restricted to `0`, `1`, or omitted, and `path_prefix` must end with `/`. On July 22, 2026, the `managed-agents-2026-04-01` header adopts the same behavior.
- Python (0.116.0), TypeScript (0.110.0), Go (1.56.0), Java (2.48.0), Ruby (1.55.0), PHP (0.36.0), C# (12.35.0), and CLI (1.16.0) SDKs now send `agent-memory-2026-07-22` on all memory store calls.

### July 1, 2026

- Restored access to Claude Fable 5 and Claude Mythos 5.

### June 30, 2026

- Launched **Claude Sonnet 5** (`claude-sonnet-5`) at introductory pricing of $2 / $10 per MTok through August 31, 2026. Supports 1M token context window, 128k max output. Adaptive thinking on by default; manual extended thinking removed; non-default sampling parameters return 400. New tokenizer produces ~30% more tokens.
- Managed Agents: event deltas for session streams, backward pagination for session listing, per-session agent config overrides, vault `injection_location` setting, lifecycle webhooks for agents/deployments/deployment runs.

### June 29, 2026

- Removed fast mode for Claude Opus 4.6. Requests with `speed: "fast"` run at standard speed/billing. Migrate to Opus 4.8.

### June 26, 2026

- Raised rate limits across the API. Sonnet and Haiku now match Opus at every tier. Usage tiers consolidated to Start, Build, and Scale.

### June 25, 2026

- Deprecated fast mode for Claude Opus 4.7, removal July 24, 2026.

### June 22, 2026

- **MCP tunnels** (research preview): management API moved to `/v1/tunnels` on the Claude API with `anthropic-beta: mcp-tunnels-2026-06-22`.

### June 18, 2026

- SDKs now support `code_execution_20260120` with REPL state persistence and programmatic tool calling. No beta header required.

### June 15, 2026

- Retired Claude Sonnet 4 and Claude Opus 4. Recommend Sonnet 4.6 and Opus 4.8.

### June 11, 2026

- Code execution tool supports `code_execution_20260521` with 90-second per-cell time limit.
- Web search/fetch tools support `web_search_20260318`/`web_fetch_20260318` with `response_inclusion` parameter.

### June 10, 2026

- Self-hosted sandbox work endpoint now available on Claude Platform on AWS.

### June 9, 2026

- Launched **Claude Fable 5** and **Claude Mythos 5**. 1M context, 128k output, always-on adaptive thinking, ~30% more tokens from new tokenizer.
- Safety classifiers on Fable 5; refusals return `stop_reason: "refusal"`. Opt-in `fallbacks` parameter for fallback models.
- New `stop_details.category` value `"reasoning_extraction"` on Fable 5.
- Adaptive thinking is the only mode; manual budgets/prefill not supported.
- `thinking.display` defaults to `"omitted"`; set `"summarized"` for readable summaries.
- Fable 5 requires 30-day data retention.
- Managed Agents: scheduled deployments, environment variable credentials in vaults, `session_thread_id` in webhook events.
- Swift package (beta) for Apple Foundation Models on iOS/macOS/visionOS/watchOS 27.

### June 5, 2026

- Announced deprecation of Claude Opus 4.1, retirement August 5, 2026.

### June 2, 2026

- Advisor tool supports `max_tokens` parameter.
- No longer billed for requests returning `stop_reason: "refusal"` without output.

### May 29, 2026

- Managed Agents webhooks, multi-agent, and self-hosted sandboxes on Claude Platform on AWS.

### May 28, 2026

- Launched **Claude Opus 4.8**. 1M context by default, 128k output. Mid-conversation system messages. `stop_details` documented. Effort defaults to `high`. Min cacheable prompt: 1,024 tokens. Adaptive thinking triggers only when needed. High-res image input, task budgets, advisor, computer use, fast mode support.
- Deprecated fast mode for Opus 4.6.

### May 27, 2026

- `usage.output_tokens_details.thinking_tokens` now reported in Messages API response.

### May 19, 2026

- MCP tunnels research preview. Self-hosted sandboxes for Managed Agents. Active session MCP/tool config updates. Large tool output spilling (>100K tokens).

### May 18, 2026

- Web search tool returns richer SEC filing data.

### May 13, 2026

- Cache diagnostics public beta with `cache-diagnosis-2026-04-07` header.

### May 12, 2026

- Fast mode now supports Claude Opus 4.7.

### May 11, 2026

- Launched **Claude Platform on AWS** with AWS billing and IAM authentication.

### May 6, 2026

- Multi-agent sessions and Outcomes in public beta. Vault credential refresh for `mcp_oauth`. Webhooks for Managed Agents. Dreams research preview.

### May 4, 2026

- Workload Identity Federation GA. OIDC tokens from AWS, GCP, GitHub Actions, Kubernetes, Entra ID, Okta, SPIFFE.

### April 30, 2026

- Retired 1M context beta for Sonnet 4.5 and Sonnet 4.

### April 29, 2026

- Released Claude API skill (open-source Agent Skill for 8 languages).

### April 24, 2026

- Released Rate Limits API.

### April 23, 2026

- Memory for Managed Agents in public beta.

### April 20, 2026

- Retired Claude Haiku 3.

### April 16, 2026

- Launched **Claude Opus 4.7** at $5 / $25 per MTok. Open to all Bedrock customers. Task budgets beta. High-res image input. `xhigh` effort level.

### April 14, 2026

- Announced deprecation of Claude Sonnet 4 and Opus 4, retirement June 15, 2026.

### April 9, 2026

- Launched advisor tool in public beta (`advisor-tool-2026-03-01` header).

### April 8, 2026

- Launched **Claude Managed Agents** in public beta (`managed-agents-2026-04-01` header).
- Launched **`ant` CLI** for the Claude API.

### April 7, 2026

- Claude Mythos Preview available (Project Glasswing).
- Messages API on Amazon Bedrock research preview.

### March 30, 2026

- Raised the `max_tokens` cap to 300k on the Message Batches API for Claude Opus 4.6 and Sonnet 4.6. Include the `output-300k-2026-03-24` beta header.
- Retiring the 1M token context window beta for Claude Sonnet 4.5 and Claude Sonnet 4 on **April 30, 2026**.

### March 18, 2026

- Added model capability fields to the Models API. `GET /v1/models` and `GET /v1/models/{model_id}` now return `max_input_tokens`, `max_tokens`, and a `capabilities` object.

### March 16, 2026

- Launched the `display` field for extended thinking, letting you omit thinking content from responses for faster streaming. Set `thinking.display: "omitted"` to receive thinking blocks with an empty `thinking` field and the `signature` preserved for multi-turn continuity.

### March 13, 2026

- The 1M token context window is now generally available for Claude Opus 4.6 and Sonnet 4.6 at standard pricing. Requests over 200k tokens work automatically for these models with no beta header required. The 1M token context window remains in beta for Claude Sonnet 4.5 and Sonnet 4.
- Removed the dedicated 1M rate limits for all supported models. Standard account limits now apply across every context length.
- Raised the media limit from 100 to 600 images or PDF pages per request when using the 1M token context window.

### February 19, 2026

- Launched **automatic caching** for the Messages API. Add a single `cache_control` field to your request body and the system automatically caches the last cacheable block, moving the cache point forward as conversations grow. No manual breakpoint management required. Works alongside existing block-level cache control for fine-grained optimization. Available on the Claude API and Microsoft Foundry (preview).
- Retired Claude Sonnet 3.7 (`claude-3-7-sonnet-20250219`) and Claude Haiku 3.5 (`claude-3-5-haiku-20241022`). Recommend upgrading to Claude Sonnet 4.6 and Claude Haiku 4.5 respectively. Researchers can request ongoing access through the External Researcher Access Program.
- Announced deprecation of Claude Haiku 3 (`claude-3-haiku-20240307`), with retirement scheduled for April 20, 2026.

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
- Fine-grained tool streaming is now generally available on all models and platforms (no beta header required).

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
