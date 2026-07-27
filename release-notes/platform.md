---
title: "Platform Release Notes"
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

- Launched **Claude Opus 5** (`claude-opus-5`), a step-change improvement over Claude Opus 4.8. Supports 1M token context window, 128k max output tokens, and thinking on by default, at $5 / $25 per MTok. Available on the Claude API, Amazon Bedrock, Google Cloud, and Microsoft Foundry.
- On Claude Opus 5, disabling thinking is allowed only at effort `high` or below: `thinking: {"type": "disabled"}` with effort `xhigh` or `max` returns a 400 error, a breaking change from Claude Opus 4.8.
- Effort is the primary control for steering Claude Opus 5: the model supports the full ladder (`low`, `medium`, `high`, `xhigh`, `max`), with `max` for capability-critical work.
- Mid-conversation tool changes now in beta on Claude Fable 5, Claude Mythos 5, Claude Opus 4.8, and Claude Opus 5. Include the `mid-conversation-tool-changes-2026-07-01` beta header.
- The `fallbacks` parameter now supports a `"default"` mode, which applies Anthropic's recommended fallback models by refusal category. Requires `server-side-fallback-2026-07-01` beta header.
- Removed fast mode for Claude Opus 4.7. Requests with `speed: "fast"` now return an error; unlike Opus 4.6, they do not fall back to standard speed. Migrate to Claude Opus 5 or Claude Opus 4.8.

### July 22, 2026

- Managed Agents agents now support `effort` level in model configuration when creating an agent.
- Webhooks for Managed Agents now cover environment and memory store lifecycle events (`environment.*` and `memory_store.*` event types).
- Managed Agents session creation can now seed with initial events via `initial_events` on `POST /v1/sessions` (up to 50 events). A non-empty list starts the agent loop in the same call.
- The `version` field is now optional when updating a Managed Agents agent. Supply it for optimistic concurrency or omit for unconditional update.
- Managed Agents session thread event streams now support event deltas via `event_deltas[]` query parameter on `GET /v1/sessions/{session_id}/threads/{thread_id}/stream`.

### July 17, 2026

- The legacy **Workbench** in the Claude Console is being sunset with access ending on August 17, 2026. Saved prompts, variables, and evals are not supported in the updated Workbench (Playground).
- The experimental prompt tools APIs (`/v1/experimental/generate_prompt`, `/v1/experimental/improve_prompt`, `/v1/experimental/templatize_prompt`) are being retired on August 17, 2026.

### July 15, 2026

- Mid-conversation system messages are available on Claude Fable 5, Claude Mythos 5, and Claude Opus 4.8 on the Claude API, Amazon Bedrock, and Google Cloud. No beta header required. This corrects earlier availability notes.

### July 14, 2026

- Admin API now available in beta for all Claude Enterprise organizations for user management: list members, change roles, remove members, send and withdraw invites, manage groups and custom roles. Group and custom-role requests require `anthropic-beta: ce-user-management-2026-07-13` beta header.

### July 10, 2026

- Dreams (research preview) now supports Claude Fable 5 and Claude Sonnet 5.
- Expanded Access Transparency documentation of `cmek_preserve` events with a filter example, an example event payload, and two preservation reason codes (`policy_violation_investigation`, `csae_report`). Documentation now clarifies that a preservation event is written whether initiated by a human reviewer or an automated safety pipeline.

### July 8, 2026

- API keys and Admin API keys now support expiration when created in the Claude Console. Choose a preset, a custom duration, or **Never**. For keys with a lifetime of at least 7 days, Anthropic emails the creator before expiration. Existing keys are unaffected. The Admin API reports each key's expiration in the `expires_at` field.

### July 2, 2026

- Added the `agent-memory-2026-07-22` beta header, which changes how listing memories behaves: stable server-defined ordering, `depth` restricted to `0`, `1`, or omitted, and `path_prefix` must end with `/`. On July 22, 2026, the `managed-agents-2026-04-01` header adopts the same list behavior.
- Python (0.116.0), TypeScript (0.110.0), Go (1.56.0), Java (2.48.0), Ruby (1.55.0), PHP (0.36.0), C# (12.35.0), and CLI (1.16.0) SDKs now send `agent-memory-2026-07-22` on all memory store calls.

### July 1, 2026

- Restored access to Claude Fable 5 and Claude Mythos 5.

### June 30, 2026

- Launched **Claude Sonnet 5** (`claude-sonnet-5`) at introductory pricing of $2 / $10 per MTok through August 31, 2026 (standard $3 / $15 thereafter). Supports 1M token context window, 128k max output tokens. Breaking changes: adaptive thinking on by default; manual extended thinking removed (returns 400); non-default sampling parameters return 400. New tokenizer produces ~30% more tokens for the same text.
- Claude Managed Agents session event streams now support event deltas. Opt in with `event_deltas[]` query parameter.
- Listing sessions now supports backward pagination with `prev_page` cursor.
- Session creation can now override agent configuration (model, system prompt, tools, MCP servers, skills) for a single session.
- Managed Agents vaults support `injection_location` setting on environment variable credentials.
- Webhooks for Managed Agents now cover agent, deployment, and deployment run lifecycle events.

### June 29, 2026

- Removed fast mode for Claude Opus 4.6. Requests with `speed: "fast"` now run at standard speed and standard billing. Migrate to Claude Opus 4.8.

### June 26, 2026

- Raised rate limits across the Claude API. Claude Sonnet and Haiku rate limits now match Claude Opus at every usage tier. Usage tiers consolidated into three: Start, Build, and Scale.

### June 25, 2026

- Deprecated fast mode for Claude Opus 4.7, with removal on July 24, 2026. Migrate to fast mode for Claude Opus 4.8.

### June 22, 2026

- **MCP tunnels** (research preview): management API moved from `/v1/organizations/tunnels` on the Admin API to `/v1/tunnels` on the Claude API. New surface uses `anthropic-beta: mcp-tunnels-2026-06-22` header.

### June 18, 2026

- Python, TypeScript, Go, Java, Ruby, PHP, and C# SDKs now support `code_execution_20260120`, the code execution tool version with REPL state persistence and programmatic tool calling support. No beta header required.

### June 15, 2026

- Retired Claude Sonnet 4 (`claude-sonnet-4-20250514`) and Claude Opus 4 (`claude-opus-4-20250514`). Recommend upgrading to Claude Sonnet 4.6 and Claude Opus 4.8 respectively.

### June 11, 2026

- Code execution tool now supports `code_execution_20260521` with 90-second per-cell execution time limit disclosure.
- Web search and web fetch tools now support `web_search_20260318` and `web_fetch_20260318` with `response_inclusion` parameter.

### June 10, 2026

- `GET /v1/environments/{id}/work` endpoint for self-hosted sandboxes now available on Claude Platform on AWS.

### June 9, 2026

- Launched **Claude Fable 5** (`claude-fable-5`) and **Claude Mythos 5** (`claude-mythos-5`, Project Glasswing). Both support 1M token context window, 128k max output, always-on adaptive thinking. New tokenizer produces ~30% more tokens.
- Claude Fable 5 runs safety classifiers; refusals return `stop_reason: "refusal"`. Opt-in `fallbacks` parameter re-runs refused requests on another model.
- New `stop_details.category` value `"reasoning_extraction"` on Claude Fable 5.
- Adaptive thinking is the only mode on Fable 5 / Mythos 5: `thinking: {"type": "disabled"}`, manual budgets, and assistant prefill are not supported.
- `thinking.display` defaults to `"omitted"` on Fable 5 / Mythos 5; set `display: "summarized"` for readable summaries.
- Claude Fable 5 requires 30-day data retention; not available under zero data retention.
- Managed Agents now supports scheduled deployments.
- Managed Agents vaults now support environment variable credentials.
- Released Swift package (beta) for Apple Foundation Models framework (`LanguageModelSession` API on iOS 27, macOS 27, visionOS 27, watchOS 27).

### June 5, 2026

- Announced deprecation of Claude Opus 4.1 (`claude-opus-4-1-20250805`), retirement on August 5, 2026. Recommend migrating to Claude Opus 4.8.

### June 2, 2026

- Advisor tool now supports `max_tokens` parameter to cap advisor model output per call.
- No longer billed for requests returning `stop_reason: "refusal"` without generated output.

### May 29, 2026

- Managed Agents webhooks, multi-agent orchestration, and self-hosted sandboxes now available on Claude Platform on AWS.

### May 28, 2026

- Launched **Claude Opus 4.8** (`claude-opus-4-8`), most capable GA model. 1M token context window by default, 128k max output. Same tools/features as Opus 4.7.
- Launched mid-conversation system messages on Opus 4.8 (`role: "system"` after user turns). Preserves prompt cache hits when instructions change during long sessions.
- `stop_details` field on refusal responses now documented: returns `category` (`cyber`, `bio`, or `null`) and human-readable `explanation`.
- Effort defaults to `high` on Opus 4.8. Minimum cacheable prompt length is 1,024 tokens (lower than Opus 4.7).
- Adaptive thinking on Opus 4.8 triggers reasoning only when needed, reducing wasted thinking tokens.
- High-resolution image input supported (up to 2576px on long edge), same as Opus 4.7.
- Task budgets, advisor tool, computer use, and fast mode (research preview) now support Opus 4.8.
- Non-default `temperature`, `top_p`, or `top_k` returns 400 error on Opus 4.8.
- Claude Code: expanded Auto mode, Max plan defaults to fast mode on Opus 4.8, Workflows research preview.
- Deprecated fast mode for Opus 4.6, with removal ~30 days after launch.

### May 27, 2026

- Messages API response now includes `usage.output_tokens_details.thinking_tokens`, reporting thinking tokens in billed output. No beta header required.

### May 19, 2026

- MCP tunnels now available as research preview for connecting to MCP servers in private networks.
- Self-hosted sandboxes available for Managed Agents as alternative to Anthropic infrastructure.
- Managed Agents: can now update MCP server and tool configs on active sessions.
- Managed Agents: large tool outputs exceeding 100K tokens automatically spilled to file in sandbox.

### May 18, 2026

- Web search tool now returns richer SEC filing data for financial research and due-diligence workflows.

### May 13, 2026

- Launched cache diagnostics in public beta. Pass `diagnostics.previous_message_id` to get `cache_miss_reason` explaining cache prefix divergence. Requires `cache-diagnosis-2026-04-07` beta header.

### May 12, 2026

- Fast mode (research preview) now supports Claude Opus 4.7. Set `speed: "fast"` with `fast-mode-2026-02-01` beta header.

### May 11, 2026

- Launched **Claude Platform on AWS**, bringing the Claude API to Anthropic-managed infrastructure accessible through AWS with AWS billing and IAM authentication.

### May 6, 2026

- Multi-agent sessions and Outcomes now in public beta under `managed-agents-2026-04-01` header.
- Managed Agents vault credential background refresh for `mcp_oauth` credentials.
- Webhooks for Managed Agents now supported.
- Additional filtering/sorting options for Managed Agents sessions and events.
- Dreams for Managed Agents available as research preview (requires `dreaming-2026-04-21` beta header).

### May 4, 2026

- Workload Identity Federation now generally available. Authenticate with OIDC tokens from AWS IAM, Google Cloud, GitHub Actions, Kubernetes, Microsoft Entra ID, Okta, SPIFFE, and more.

### April 30, 2026

- Retired the 1M token context window beta (`context-1m-2025-08-07`) for Claude Sonnet 4.5 and Sonnet 4. Migrate to Sonnet 4.6 or Opus 4.6 for 1M context.

### April 29, 2026

- Released the Claude API skill, an open-source Agent Skill providing up-to-date reference material for building on the Messages API and Managed Agents across 8 languages.

### April 24, 2026

- Released the Rate Limits API for programmatically querying organization and workspace rate limits.

### April 23, 2026

- Memory for Managed Agents now in public beta under `managed-agents-2026-04-01` header.

### April 20, 2026

- Retired Claude Haiku 3 (`claude-3-haiku-20240307`). Recommend upgrading to Claude Haiku 4.5.

### April 16, 2026

- Launched **Claude Opus 4.7**, most capable GA model for complex reasoning and agentic coding at $5 / $25 per MTok. Includes API breaking changes vs Opus 4.6; see migration guide.
- Claude in Amazon Bedrock now open to all Bedrock customers. Opus 4.7 and Haiku 4.5 available self-serve in 27 AWS regions.
- Launched task budgets in beta on Opus 4.7.
- High-resolution image input (up to 2576px on long edge) for improved computer use, screenshot understanding, and document analysis.
- Added `xhigh` effort level on Opus 4.7, tuned for long-running agentic tasks (30+ minutes).

### April 14, 2026

- Announced deprecation of Claude Sonnet 4 and Claude Opus 4, with retirement June 15, 2026.

### April 9, 2026

- Launched the advisor tool in public beta. Pair a faster executor model with a higher-intelligence advisor model for long-horizon agentic workloads. Requires `advisor-tool-2026-03-01` beta header.

### April 8, 2026

- Launched **Claude Managed Agents** in public beta. Fully managed agent harness with secure sandboxing, built-in tools, and SSE streaming. Requires `managed-agents-2026-04-01` beta header.
- Launched the **`ant` CLI**, a command-line client for the Claude API.

### April 7, 2026

- Claude Mythos Preview available as gated research preview for defensive cybersecurity (Project Glasswing).
- Messages API now available on Amazon Bedrock as research preview in `us-east-1`.

### March 30, 2026

- Raised the `max_tokens` cap to 300k on the Message Batches API for Claude Opus 4.6 and Sonnet 4.6. Include the `output-300k-2026-03-24` beta header to generate longer single-turn outputs for long-form content, structured data, and large code generation tasks.
- Retiring the 1M token context window beta for Claude Sonnet 4.5 and Claude Sonnet 4 on **April 30, 2026**. After that date, the `context-1m-2025-08-07` beta header will have no effect on these models, and requests that exceed the standard 200k-token context window will return an error. To continue using 1M context windows, migrate to Claude Sonnet 4.6 or Claude Opus 4.6, which support the full 1M token context window at standard pricing with no beta header required.

### March 18, 2026

- Added model capability fields to the Models API. `GET /v1/models` and `GET /v1/models/{model_id}` now return `max_input_tokens`, `max_tokens`, and a `capabilities` object. Query the API to discover what each model supports.

### March 16, 2026

- Launched the `display` field for extended thinking, letting you omit thinking content from responses for faster streaming. Set `thinking.display: "omitted"` to receive thinking blocks with an empty `thinking` field and the `signature` preserved for multi-turn continuity. Billing is unchanged.

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
