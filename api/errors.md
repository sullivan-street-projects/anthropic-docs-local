---
title: "API Errors"
source_url: "https://platform.claude.com/docs/en/api/errors"
source_type: "web-extracted"
fetched_at: "2026-10-12T00:00:00Z"
category: "api"
---

# Errors

## HTTP errors

The API follows a predictable HTTP error code format:

- 400 - `invalid_request_error`: There was an issue with the format or content of your request. This error type may also be used for other 4XX status codes not listed in this section. The API also returns a 400 when usage reaches an organization or workspace spend limit you set, except limits on the Claude Code workspace, which can return a 429 instead.
- 401 - `authentication_error`: There's an issue with your API key (for example, it's malformed, revoked, or expired; see Key expiration). On Claude Platform on AWS, this can also indicate a problem with your AWS credentials or SigV4 signature.
- 402 - `billing_error`: There's an issue with your billing or payment information. Check your payment details in the Claude Console, or in AWS Marketplace if you're using Claude Platform on AWS.
- 403 - `permission_error`: Your API key does not have permission to use the specified resource. Check your organization's access and workspace settings in the Claude Console.
- 404 - `not_found_error`: The requested resource was not found. Check the endpoint path and any resource IDs in the request URL.
- 409 - `conflict_error`: The request conflicts with the current state of a resource. For example, the resource was modified concurrently, or a value that must be unique is already in use. Resolve the conflict, then retry the request.
- 413 - `request_too_large`: Request exceeds the maximum allowed number of bytes. See Request size limits for per-endpoint maximums.
- 429 - `rate_limit_error`: Your organization has hit a rate limit, reached its usage tier's monthly spend cap, or reached a spend limit on the Claude Code workspace. A tier spend-cap 429 has no `retry-after` header and keeps failing until access resumes.
- 500 - `api_error`: An unexpected error has occurred internal to Anthropic's systems. Retry the request with exponential backoff; if the error persists, contact support with the request ID.
- 504 - `timeout_error`: The request timed out while processing. Consider using the streaming Messages API for long-running requests. See Long requests for more options.
- 529 - `overloaded_error`: The API is temporarily overloaded.

> **Warning:** 529 errors can occur when APIs experience high traffic across all users. In rare cases, if your organization has a sharp increase in usage, you might see 429 errors because of acceleration limits on the API. To avoid hitting acceleration limits, ramp up your traffic gradually and maintain consistent usage patterns.

The official SDK automatically retries transient failures (such as connection errors, rate limits, and 5xx server errors) with exponential backoff, twice by default, honoring the `retry-after` header when present. The SDK client accepts `max_retries` (typescript, java, php: `maxRetries`; csharp: `MaxRetries`; go: `option.WithMaxRetries`) to configure or disable this behavior.

When receiving a [streaming](https://platform.claude.com/docs/en/build-with-claude/streaming) response over SSE, an error can occur after the API returns a 200 response. In that case, error handling doesn't follow these standard mechanisms. See [Error events](https://platform.claude.com/docs/en/build-with-claude/streaming#error-events) for the shape of mid-stream errors.

## Request size limits

The API enforces request size limits to ensure optimal performance:

| Endpoint type                                                                       | Maximum request size |
| :---------------------------------------------------------------------------------- | :------------------- |
| Messages API                                                                        | 32 MB                |
| Token Counting API                                                                  | 32 MB                |
| [Batch API](https://platform.claude.com/docs/en/build-with-claude/batch-processing) | 256 MB               |
| [Files API](https://platform.claude.com/docs/en/build-with-claude/files)            | 500 MB               |

If you exceed these limits, you'll receive a 413 `request_too_large` error. On the direct Claude API, Cloudflare returns this error before the request reaches the API servers.

## Error shapes

The API always returns errors as JSON, with a top-level `error` object that always includes a `type` and `message` value. The response also includes a `request_id` field for easier tracking and debugging. For example:

```json
{
  "type": "error",
  "error": {
    "type": "not_found_error",
    "message": "The requested resource could not be found."
  },
  "request_id": "req_011CSHoEeqs5C35K2UUqR7Fy"
}
```

In accordance with the [versioning](https://platform.claude.com/docs/en/api/versioning) policy, the values within these objects may expand, and it is possible that the `type` values will grow over time.

## SDK error types

The official SDK raises typed exceptions for these errors instead of returning raw JSON. For example, a 404 surfaces as `anthropic.NotFoundError` (python; typescript: `Anthropic.NotFoundError`; ruby: `Anthropic::Errors::NotFoundError`; java: `com.anthropic.errors.NotFoundException`; csharp: `AnthropicNotFoundException`; php: `Anthropic\Core\Exceptions\NotFoundException`; go: `*anthropic.Error`). The Go SDK has one error type for every status, `*anthropic.Error`: branch on `StatusCode`. Catch the SDK's typed classes rather than string-matching error messages, handling the most specific classes first. Your SDK's page documents the full exception hierarchy:

- [Python](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/python#handling-errors) | [TypeScript](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/typescript#handling-errors) | [C#](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/csharp#error-handling) | [Go](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/go#error-handling) | [Java](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/java#error-handling) | [PHP](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/php#error-handling) | [Ruby](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/ruby#handling-errors)

## Request ID

Every API response includes a unique `request-id` header. This header contains a value such as `req_018EeWyXxfu5pfWkrYcMdjWG`. When contacting support about a specific request, include this ID to help quickly resolve your issue.

On Claude Platform on AWS, responses include two request IDs: the AWS request ID (`x-amzn-requestid`, primary, indexed in CloudTrail) and the Anthropic request ID (`request-id`, secondary). Use the AWS request ID for CloudTrail lookups and the Anthropic request ID for Anthropic support tickets.

The Python and TypeScript SDKs expose the request ID as a `_request_id` property on top-level response objects. The C#, Go, Java, and PHP SDKs expose it through their raw-response accessors, and the Ruby SDK through middleware. In every SDK except Ruby, use `with_raw_response` (typescript: `.withResponse()`; java: `.withRawResponse()`; csharp: `WithRawResponse`; go: `option.WithResponseInto`; php: `->raw`) to read any other response header.

```python
client = anthropic.Anthropic()

message = client.messages.create(
    model="claude-sonnet-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello, Claude"}],
)
print(f"Request ID: {message._request_id}")
```

```typescript
const client = new Anthropic();

const message = await client.messages.create({
  model: "claude-sonnet-5",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello, Claude" }],
});
console.log("Request ID:", message._request_id);
```

```python
# Python (Claude Platform on AWS)
from anthropic import AnthropicAWS

client = AnthropicAWS(aws_region="us-west-2")

response = client.messages.with_raw_response.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello, Claude"}],
)
print(f"AWS request ID: {response.headers.get('x-amzn-requestid')}")
message = response.parse()
print(f"Anthropic request ID: {message._request_id}")
```

For Claude Platform on AWS request-ID examples in other languages, see [Request IDs](https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws#request-ids).

## Long requests

> **Warning:** Consider using the [streaming Messages API](https://platform.claude.com/docs/en/build-with-claude/streaming) or [Message Batches API](https://platform.claude.com/docs/en/api/creating-message-batches) for long running requests, especially those over 10 minutes.

Avoid setting a large `max_tokens` value without using the streaming Messages API or Message Batches API:

- Some networks may drop idle connections after a variable period of time, which can cause the request to fail or timeout without receiving a response from Anthropic.
- Networks differ in reliability; the Message Batches API can help you manage the risk of network issues by allowing you to poll for results rather than requiring an uninterrupted network connection.

If you are building a direct API integration, you should be aware that setting a [TCP socket keep-alive](https://tldp.org/HOWTO/TCP-Keepalive-HOWTO/programming.html) can reduce the impact of idle connection timeouts on some networks.

The [SDKs](https://platform.claude.com/docs/en/cli-sdks-libraries/overview) validate that your non-streaming Messages API requests are not expected to exceed a 10 minute timeout and also will set a socket option for TCP keep-alive.

If you don't need to process events incrementally, use `.stream()` with `.get_final_message()` (Python) or `.finalMessage()` (TypeScript) to get the complete `Message` object without writing event-handling code:

```python
with client.messages.stream(
    max_tokens=128000,
    messages=[{"role": "user", "content": "Write a detailed analysis..."}],
    model="claude-opus-4-8",
) as stream:
    message = stream.get_final_message()
print(message.content)
```

```typescript
const stream = client.messages.stream({
  max_tokens: 128000,
  messages: [{ role: "user", content: "Write a detailed analysis..." }],
  model: "claude-opus-4-8",
});
const message = await stream.finalMessage();
console.log(message.content);
```

See [Streaming Messages](https://platform.claude.com/docs/en/build-with-claude/streaming#get-the-final-message-without-handling-events) for more details.

## Common validation errors

### Prefill not supported

Claude 4.6 and later models and Claude Mythos Preview do not support prefilling assistant messages. Sending a request with a prefilled last assistant message to any of these models returns a 400 `invalid_request_error`:

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "This model does not support assistant message prefill. The conversation must end with a user message."
  }
}
```

Use [structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) on models that support it, system prompt instructions, or [`output_config.format`](https://platform.claude.com/docs/en/build-with-claude/structured-outputs#json-outputs) instead.

### Thinking blocks cannot be modified

If the most recent assistant message contains `thinking` or `redacted_thinking` blocks that were edited, reordered, filtered out, or reconstructed before being sent back to the API, the request returns a 400 `invalid_request_error`. The error message starts with the position of the offending block and contains:

```
`thinking` or `redacted_thinking` blocks in the latest assistant message cannot be modified. These blocks must remain as they were in the original response.
```

With tool use, every `thinking` and `redacted_thinking` block from the assistant turn must be passed back exactly as received, including blocks whose `thinking` field is empty. Pass thinking blocks back unchanged, and if your application filters content blocks by type before resending, include both `thinking` and `redacted_thinking`. See [Preserving thinking blocks](https://platform.claude.com/docs/en/build-with-claude/extended-thinking#preserving-thinking-blocks).

### Extended thinking not supported

Claude 4.7 and later models have removed extended thinking. Sending `thinking: {"type": "enabled"}` to any of these models returns a 400 `invalid_request_error`:

```
"thinking.type.enabled" is not supported for this model. Use "thinking.type.adaptive" and "output_config.effort" to control thinking behavior.
```

Use [adaptive thinking](https://platform.claude.com/docs/en/build-with-claude/thinking) instead.

### Adaptive thinking not supported

Models that support only extended thinking (Claude 4.5 and earlier models) reject `thinking: {"type": "adaptive"}` with a 400 `invalid_request_error`:

```
adaptive thinking is not supported on this model
```

Use `thinking: {"type": "enabled", "budget_tokens": N}` on these models; see [Extended thinking](https://platform.claude.com/docs/en/build-with-claude/extended-thinking) for the configuration.

### Thinking cannot be disabled

On Claude Fable 5.1, Claude Mythos 5.1, Claude Fable 5, Claude Mythos 5, Claude Opus 5.5, and Claude Mythos Preview, thinking is always on. Sending `thinking: {"type": "disabled"}` to any of these models returns a 400 `invalid_request_error`:

```
"thinking.type.disabled" is not supported for this model. Use "thinking.type.adaptive" and "output_config.effort" to control thinking behavior.
```

On Claude Mythos Preview (which accepts extended thinking), the message reads:

```
"thinking.type.disabled" is not supported for this model. Thinking defaults to adaptive mode when not specified; use "thinking.type.enabled" with "budget_tokens" for extended thinking.
```

On Claude Sonnet 5.5, thinking can't be set to `disabled`. Use `thinking: {"type": "between_tools"}` for the lowest thinking setting, which turns off up-front thinking. Sending `thinking: {"type": "disabled"}` returns a 400 with a message explaining to use `between_tools` instead.

At `xhigh` or `max` effort, a request with `between_tools` also returns a 400. With `between_tools`, effort can't change mid-conversation: a per-message `output_config.effort` that differs from the level in effect returns a 400 error.

Claude Haiku 5.5 accepts `thinking: {"type": "disabled"}` but holds it to the same two effort limits that apply to `between_tools`: at `xhigh` or `max` effort, or with a per-message `output_config.effort` that differs from the level in effect, the request returns a 400 error.

Omit the `thinking` parameter and the request runs with adaptive thinking. To keep thinking content out of responses without turning thinking off, set `display: "omitted"` on the thinking configuration.

### Forced tool use not supported

Claude Opus 5.5, Claude Sonnet 5.5, Claude Fable 5.1, and Claude Mythos 5.1 don't support forced tool use. Sending `tool_choice: {"type": "any"}` or `tool_choice: {"type": "tool", "name": "..."}` to any of these models returns a 400 `invalid_request_error`:

```
tool_choice: type "tool" and "any" are not supported for this model.
```

`tool_choice: {"type": "auto"}` (the default) and `{"type": "none"}` are accepted. Use `auto` with strict tool use to keep tool inputs schema-valid, or structured outputs when you need the response itself in a fixed JSON shape.

### Computer use tool version not supported

On the Claude API and Google Cloud, Claude Opus 5.5, Claude Sonnet 5.5, and Claude Haiku 5.5 support computer use only as the `computer_toolset_20260801` toolset. On those platforms, sending any of these models a `tools` entry of the earlier `computer_20251124` or `computer_20250124` type returns a 400 `invalid_request_error`. Declare `{"type": "computer_toolset_20260801"}` without the beta header. Earlier models that support the toolset keep accepting `computer_20251124`, as do these models on Amazon Bedrock.

### Thinking block no longer matches the conversation

On Claude Fable 5.1, Claude Opus 5.5, Claude Sonnet 5.5, and Claude Haiku 5.5, the API accepts a replayed thinking block only while the `system` prompt, `tools`, and messages that preceded it are unchanged. For new accounts created on or after August 31, 2026, a replayed block whose earlier history changed is rejected with a 400 `invalid_request_error`. Use the `thinking-binding-controls-2026-08-01` beta header with `prefix_mismatch_behavior: "drop_block"` to drop the block and continue instead of erroring.

### Outbound web identity federation disabled (Claude Platform on AWS)

If every request to Claude Platform on AWS returns `"Outbound web identity federation is disabled for your account"`, run `aws iam enable-outbound-web-identity-federation` once per AWS account. See [Enable outbound web identity federation](https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws#enable-outbound-web-identity-federation) for details.
